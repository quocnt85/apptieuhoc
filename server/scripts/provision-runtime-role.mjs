import assert from 'node:assert/strict';
import process from 'node:process';
import { neon } from '@neondatabase/serverless';

const ownerConnectionString = process.env.NEON_DATABASE_URL;
const runtimeConnectionString = process.env.NEON_RUNTIME_DATABASE_URL;
const runtimeRole = process.env.NEON_RUNTIME_ROLE;
const runtimePassword = process.env.NEON_RUNTIME_PASSWORD;
const expectedDatabase = process.env.NEON_EXPECTED_DATABASE;

if (!ownerConnectionString) throw new Error('NEON_DATABASE_URL is required for the database owner connection.');
if (!runtimeConnectionString) throw new Error('NEON_RUNTIME_DATABASE_URL is required to verify the runtime role.');
if (!runtimeRole || !/^[a-z][a-z0-9_]{0,62}$/.test(runtimeRole)) {
  throw new Error('NEON_RUNTIME_ROLE must be a lowercase PostgreSQL identifier.');
}
if (!runtimePassword || !/^[A-Za-z0-9_-]{40,128}$/.test(runtimePassword)) {
  throw new Error('NEON_RUNTIME_PASSWORD must be a 40-128 character base64url secret.');
}
if (!expectedDatabase || !/^[a-z][a-z0-9_]{0,62}$/.test(expectedDatabase)) {
  throw new Error('NEON_EXPECTED_DATABASE must be a lowercase PostgreSQL identifier.');
}

const quoteIdentifier = (value) => `"${value.replaceAll('"', '""')}"`;
const quoteLiteral = (value) => `'${value.replaceAll("'", "''")}'`;
const ownerSql = neon(ownerConnectionString);
const runtimeSql = neon(runtimeConnectionString);

const databaseRows = await ownerSql`SELECT current_database() AS database_name, current_user AS owner_name`;
assert.equal(databaseRows[0]?.database_name, expectedDatabase, 'Refusing to grant privileges on an unexpected database.');

const quotedRole = quoteIdentifier(runtimeRole);
const existingRoleRows = await ownerSql.query('SELECT rolname FROM pg_roles WHERE rolname = $1', [runtimeRole]);
if (existingRoleRows.length === 0) {
  await ownerSql.query(`
    CREATE ROLE ${quotedRole}
    LOGIN PASSWORD ${quoteLiteral(runtimePassword)}
    NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS
    CONNECTION LIMIT 20
  `);
}
await ownerSql.query(`
  ALTER ROLE ${quotedRole}
  PASSWORD ${quoteLiteral(runtimePassword)}
  NOCREATEDB NOCREATEROLE
  CONNECTION LIMIT 20
`);

const roleRows = await ownerSql.query(`
  SELECT rolname, rolcanlogin, rolsuper, rolcreatedb, rolcreaterole, rolreplication, rolbypassrls
  FROM pg_roles
  WHERE rolname = $1
`, [runtimeRole]);
assert.equal(roleRows.length, 1, `Runtime role ${runtimeRole} does not exist.`);
const role = roleRows[0];
assert.equal(role.rolcanlogin, true, 'Runtime role must be able to login.');
for (const forbiddenAttribute of ['rolsuper', 'rolcreatedb', 'rolcreaterole', 'rolreplication', 'rolbypassrls']) {
  assert.equal(role[forbiddenAttribute], false, `Runtime role unexpectedly has ${forbiddenAttribute}.`);
}

const tableRows = await ownerSql`
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = 'public' AND tablename <> 'schema_migrations'
  ORDER BY tablename
`;
assert.ok(tableRows.length >= 15, `Expected at least 15 application tables, found ${tableRows.length}.`);

const quotedDatabase = quoteIdentifier(expectedDatabase);
await ownerSql.query(`GRANT CONNECT ON DATABASE ${quotedDatabase} TO ${quotedRole}`);
await ownerSql.query(`REVOKE CREATE ON SCHEMA public FROM ${quotedRole}`);
await ownerSql.query(`GRANT USAGE ON SCHEMA public TO ${quotedRole}`);

for (const { tablename } of tableRows) {
  const quotedTable = quoteIdentifier(String(tablename));
  await ownerSql.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.${quotedTable} TO ${quotedRole}`);
}

const sequenceRows = await ownerSql`
  SELECT sequencename
  FROM pg_sequences
  WHERE schemaname = 'public'
  ORDER BY sequencename
`;
for (const { sequencename } of sequenceRows) {
  const quotedSequence = quoteIdentifier(String(sequencename));
  await ownerSql.query(`GRANT USAGE, SELECT ON SEQUENCE public.${quotedSequence} TO ${quotedRole}`);
}

await ownerSql.query(`REVOKE ALL PRIVILEGES ON TABLE public.schema_migrations FROM ${quotedRole}`);
await ownerSql.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${quotedRole}`);
await ownerSql.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ${quotedRole}`);

const privilegeRows = await ownerSql.query(`
  SELECT
    has_schema_privilege($1, 'public', 'USAGE') AS schema_usage,
    has_schema_privilege($1, 'public', 'CREATE') AS schema_create,
    has_table_privilege($1, 'public.parent_accounts', 'SELECT') AS can_read_app,
    has_table_privilege($1, 'public.parent_accounts', 'INSERT') AS can_write_app,
    has_table_privilege($1, 'public.schema_migrations', 'SELECT') AS can_read_migrations,
    has_table_privilege($1, 'public.schema_migrations', 'INSERT, UPDATE, DELETE') AS can_change_migrations
`, [runtimeRole]);
assert.deepEqual(privilegeRows[0], {
  schema_usage: true,
  schema_create: false,
  can_read_app: true,
  can_write_app: true,
  can_read_migrations: false,
  can_change_migrations: false,
});

const requiredDml = tableRows.flatMap(({ tablename }) => (
  ['SELECT', 'INSERT', 'UPDATE', 'DELETE'].map((privilege) => ({ table_name: String(tablename), privilege }))
));
const dmlRows = await ownerSql.query(`
  SELECT requirement.table_name, requirement.privilege,
    has_table_privilege($1, format('public.%I', requirement.table_name), requirement.privilege) AS allowed
  FROM jsonb_to_recordset($2::jsonb) AS requirement(table_name TEXT, privilege TEXT)
  ORDER BY requirement.table_name, requirement.privilege
`, [runtimeRole, JSON.stringify(requiredDml)]);
assert.equal(dmlRows.length, requiredDml.length, 'Runtime DML privilege matrix is incomplete.');
for (const row of dmlRows) {
  assert.equal(row.allowed, true, `Runtime role lacks ${row.privilege} on public.${row.table_name}.`);
}

const runtimeIdentity = await runtimeSql`
  SELECT current_database() AS database_name, current_user AS role_name,
    current_setting('transaction_read_only') AS transaction_read_only,
    pg_is_in_recovery() AS in_recovery,
    to_regclass('public.auth_rate_limits') IS NOT NULL AS auth_rate_limits_visible,
    to_regclass('public.parent_accounts') IS NOT NULL AS parent_accounts_visible
`;
assert.equal(runtimeIdentity[0]?.database_name, expectedDatabase);
assert.equal(runtimeIdentity[0]?.role_name, runtimeRole);
assert.equal(runtimeIdentity[0]?.transaction_read_only, 'off');
assert.equal(runtimeIdentity[0]?.in_recovery, false);
assert.equal(runtimeIdentity[0]?.auth_rate_limits_visible, true);
assert.equal(runtimeIdentity[0]?.parent_accounts_visible, true);
await runtimeSql`SELECT id FROM parent_accounts LIMIT 1`;
await assert.rejects(
  () => runtimeSql`SELECT name FROM schema_migrations LIMIT 1`,
  (error) => error?.code === '42501',
  'Runtime role must be denied access to schema_migrations.',
);

console.log(`Runtime role ${runtimeRole} provisioned for ${expectedDatabase} (${tableRows.length} application tables, ${requiredDml.length} DML grants, ${sequenceRows.length} sequences; writable primary; schema metadata denied).`);
