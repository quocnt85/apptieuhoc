import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(scriptDirectory, '..', 'migrations');
const checkOnly = process.argv.includes('--check');
const databaseSchema = process.env.NEON_DATABASE_SCHEMA || 'public';

if (!/^[a-z][a-z0-9_]{0,62}$/.test(databaseSchema)) {
  throw new Error('NEON_DATABASE_SCHEMA must be a lowercase PostgreSQL identifier.');
}

const splitSqlStatements = (body, migrationName) => {
  const statements = [];
  let current = '';
  let index = 0;
  let state = 'normal';
  let dollarTag = '';

  while (index < body.length) {
    const character = body[index];
    const next = body[index + 1];

    if (state === 'single') {
      current += character;
      if (character === "'" && next === "'") { current += next; index += 2; continue; }
      if (character === "'") state = 'normal';
      index += 1; continue;
    }
    if (state === 'double') {
      current += character;
      if (character === '"' && next === '"') { current += next; index += 2; continue; }
      if (character === '"') state = 'normal';
      index += 1; continue;
    }
    if (state === 'line-comment') {
      current += character;
      if (character === '\n') state = 'normal';
      index += 1; continue;
    }
    if (state === 'block-comment') {
      current += character;
      if (character === '*' && next === '/') { current += next; index += 2; state = 'normal'; continue; }
      index += 1; continue;
    }
    if (state === 'dollar') {
      if (body.startsWith(dollarTag, index)) { current += dollarTag; index += dollarTag.length; state = 'normal'; continue; }
      current += character; index += 1; continue;
    }

    if (character === "'") { state = 'single'; current += character; index += 1; continue; }
    if (character === '"') { state = 'double'; current += character; index += 1; continue; }
    if (character === '-' && next === '-') { state = 'line-comment'; current += '--'; index += 2; continue; }
    if (character === '/' && next === '*') { state = 'block-comment'; current += '/*'; index += 2; continue; }
    if (character === '$') {
      const match = /^\$(?:[A-Za-z_][A-Za-z0-9_]*)?\$/.exec(body.slice(index));
      if (match) { dollarTag = match[0]; state = 'dollar'; current += dollarTag; index += dollarTag.length; continue; }
    }
    if (character === ';') {
      if (current.trim()) statements.push(current.trim());
      current = ''; index += 1; continue;
    }
    current += character;
    index += 1;
  }

  if (state !== 'normal' && state !== 'line-comment') throw new Error(`${migrationName} contains unterminated SQL quoting or comment syntax.`);
  if (current.trim()) statements.push(current.trim());
  return statements;
};

const names = (await readdir(migrationsDirectory))
  .filter((name) => /^\d{4}_[a-z0-9_]+\.sql$/.test(name))
  .sort();

if (names.length === 0) throw new Error('No migrations found.');
names.forEach((name, index) => {
  const expectedPrefix = String(index + 1).padStart(4, '0');
  if (!name.startsWith(`${expectedPrefix}_`)) throw new Error(`Migration sequence gap: expected ${expectedPrefix}, found ${name}.`);
});

const migrations = await Promise.all(names.map(async (name) => {
  const raw = await readFile(path.join(migrationsDirectory, name), 'utf8');
  if (!raw.trimStart().startsWith('BEGIN;') || !raw.trimEnd().endsWith('COMMIT;')) throw new Error(`${name} must be wrapped in BEGIN/COMMIT.`);
  if (/\b(?:DROP|TRUNCATE)\b/i.test(raw)) throw new Error(`${name} contains a destructive statement.`);
  const body = raw.trim().replace(/^BEGIN;\s*/i, '').replace(/\s*COMMIT;$/i, '');
  const statements = splitSqlStatements(body, name);
  if (statements.length === 0) throw new Error(`${name} has no SQL statements.`);
  return { name, checksum: createHash('sha256').update(raw).digest('hex'), statements };
}));

if (checkOnly) {
  console.log(`Migration check passed (${migrations.length} additive migrations in sequence).`);
  process.exit(0);
}

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) throw new Error('NEON_DATABASE_URL is required to apply migrations.');
const sql = neon(connectionString);
await sql.transaction([
  sql`SELECT set_config('search_path', ${databaseSchema}, true)`,
  sql.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      checksum CHAR(64) NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `),
]);

const [, appliedRows] = await sql.transaction([
  sql`SELECT set_config('search_path', ${databaseSchema}, true)`,
  sql.query('SELECT name, checksum FROM schema_migrations ORDER BY name'),
]);
const applied = new Map(appliedRows.map((row) => [String(row.name), String(row.checksum)]));

for (const migration of migrations) {
  const previousChecksum = applied.get(migration.name);
  if (previousChecksum) {
    if (previousChecksum !== migration.checksum) throw new Error(`Applied migration checksum changed: ${migration.name}.`);
    console.log(`skip ${migration.name}`);
    continue;
  }
  const queries = [
    sql`SELECT set_config('search_path', ${databaseSchema}, true)`,
    sql`SELECT pg_advisory_xact_lock(hashtext(${'novastars_schema_migrations:' + databaseSchema}))`,
    ...migration.statements.map((statement) => sql.query(statement)),
    sql`INSERT INTO schema_migrations (name, checksum) VALUES (${migration.name}, ${migration.checksum})`,
  ];
  await sql.transaction(queries);
  console.log(`applied ${migration.name}`);
}

console.log(`Migration apply complete (${migrations.length} known migrations in schema ${databaseSchema}).`);
