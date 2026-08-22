import process from 'node:process';
import { neon } from '@neondatabase/serverless';
import { readMigrationManifest, verifyDatabaseMetadata } from './database-contract.mjs';

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) throw new Error('NEON_DATABASE_URL is required to verify the shared demo database.');
const databaseSchema = process.env.NEON_DATABASE_SCHEMA || 'public';
if (!/^[a-z][a-z0-9_]{0,62}$/.test(databaseSchema)) {
  throw new Error('NEON_DATABASE_SCHEMA must be a lowercase PostgreSQL identifier.');
}

const sql = neon(connectionString);
const [tableRows, columnRows, indexRows, triggerRows, constraintRows, migrationRows] = await Promise.all([
  sql.query("SELECT table_name FROM information_schema.tables WHERE table_schema = $1 AND table_type = 'BASE TABLE'", [databaseSchema]),
  sql.query('SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = $1', [databaseSchema]),
  sql.query('SELECT indexname FROM pg_indexes WHERE schemaname = $1', [databaseSchema]),
  sql.query(`
    SELECT table_class.relname AS table_name, trigger_row.tgname AS trigger_name
    FROM pg_trigger trigger_row
    JOIN pg_class table_class ON table_class.oid = trigger_row.tgrelid
    JOIN pg_namespace schema_row ON schema_row.oid = table_class.relnamespace
    WHERE schema_row.nspname = $1 AND NOT trigger_row.tgisinternal
  `, [databaseSchema]),
  sql.query(`
    SELECT table_class.relname AS table_name, constraint_row.conname AS constraint_name
    FROM pg_constraint constraint_row
    JOIN pg_class table_class ON table_class.oid = constraint_row.conrelid
    JOIN pg_namespace schema_row ON schema_row.oid = table_class.relnamespace
    WHERE schema_row.nspname = $1 AND NOT constraint_row.convalidated
  `, [databaseSchema]),
  sql.query(`SELECT name, checksum FROM "${databaseSchema}".schema_migrations ORDER BY name`),
]);

const metadata = {
  tables: tableRows.map((row) => String(row.table_name)),
  columns: columnRows.map((row) => `${String(row.table_name)}.${String(row.column_name)}`),
  indexes: indexRows.map((row) => String(row.indexname)),
  triggers: triggerRows.map((row) => `${String(row.table_name)}.${String(row.trigger_name)}`),
  unvalidatedConstraints: constraintRows.map((row) => `${String(row.table_name)}.${String(row.constraint_name)}`),
  migrations: migrationRows.map((row) => ({ name: String(row.name), checksum: String(row.checksum) })),
};
const manifest = await readMigrationManifest();
const errors = verifyDatabaseMetadata(metadata, manifest);

if (errors.length) {
  throw new Error(`Shared demo database contract failed:\n- ${errors.join('\n- ')}`);
}

console.log(`Database schema ${databaseSchema} verified (${manifest.length} migrations, ${metadata.tables.length} tables, ${metadata.indexes.length} indexes, ${metadata.triggers.length} custom triggers).`);
