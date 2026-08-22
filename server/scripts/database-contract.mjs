import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(scriptDirectory, '..', 'migrations');

export const REQUIRED_TABLES = [
  'auth_rate_limits',
  'child_wallet_slots',
  'consent_receipts',
  'email_otp_challenges',
  'item_entitlements',
  'item_purchase_requests',
  'parent_accounts',
  'parent_auth_credentials',
  'parent_sessions',
  'purchase_events',
  'reward_transfers',
  'security_audit_log',
  'subscriptions',
  'wallet_accounts',
  'wallet_ledger',
];

export const REQUIRED_COLUMNS = [
  'child_wallet_slots.close_request_id',
  'child_wallet_slots.closure_returned_diamonds',
  'parent_sessions.refresh_expires_at',
  'parent_sessions.refresh_token_hash',
  'purchase_events.last_error_at',
  'purchase_events.retry_count',
  'subscriptions.last_event_at',
  'subscriptions.last_revenuecat_event_id',
  'wallet_accounts.balance',
  'wallet_accounts.version',
];

export const REQUIRED_INDEXES = [
  'idx_purchase_events_dead_letter',
  'uq_child_slot_close_request',
  'uq_child_slot_creation_request',
  'uq_child_wallet',
  'uq_parent_sessions_refresh_token',
  'uq_parent_vault',
  'uq_purchase_store_event_all',
];

export const REQUIRED_TRIGGERS = ['wallet_ledger.trg_wallet_ledger_append_only'];

export const readMigrationManifest = async () => {
  const names = (await readdir(migrationsDirectory))
    .filter((name) => /^\d{4}_[a-z0-9_]+\.sql$/.test(name))
    .sort();
  return Promise.all(names.map(async (name) => {
    const raw = await readFile(path.join(migrationsDirectory, name), 'utf8');
    return { name, checksum: createHash('sha256').update(raw).digest('hex') };
  }));
};

const missing = (required, actual) => required.filter((value) => !actual.has(value));

export const verifyDatabaseMetadata = (metadata, manifest) => {
  const errors = [];
  const missingTables = missing(REQUIRED_TABLES, new Set(metadata.tables));
  const missingColumns = missing(REQUIRED_COLUMNS, new Set(metadata.columns));
  const missingIndexes = missing(REQUIRED_INDEXES, new Set(metadata.indexes));
  const missingTriggers = missing(REQUIRED_TRIGGERS, new Set(metadata.triggers));

  if (missingTables.length) errors.push(`missing tables: ${missingTables.join(', ')}`);
  if (missingColumns.length) errors.push(`missing columns: ${missingColumns.join(', ')}`);
  if (missingIndexes.length) errors.push(`missing indexes: ${missingIndexes.join(', ')}`);
  if (missingTriggers.length) errors.push(`missing triggers: ${missingTriggers.join(', ')}`);
  if (metadata.unvalidatedConstraints.length) {
    errors.push(`unvalidated constraints: ${metadata.unvalidatedConstraints.join(', ')}`);
  }

  const applied = new Map(metadata.migrations.map(({ name, checksum }) => [name, checksum]));
  const unexpected = [...applied.keys()].filter((name) => !manifest.some((entry) => entry.name === name));
  for (const entry of manifest) {
    if (!applied.has(entry.name)) errors.push(`missing migration: ${entry.name}`);
    else if (applied.get(entry.name) !== entry.checksum) errors.push(`migration checksum mismatch: ${entry.name}`);
  }
  if (unexpected.length) errors.push(`unexpected migrations: ${unexpected.sort().join(', ')}`);

  return errors;
};
