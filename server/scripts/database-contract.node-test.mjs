import assert from 'node:assert/strict';
import test from 'node:test';
import {
  REQUIRED_COLUMNS,
  REQUIRED_INDEXES,
  REQUIRED_TABLES,
  REQUIRED_TRIGGERS,
  verifyDatabaseMetadata,
} from './database-contract.mjs';

const manifest = [
  { name: '0001_parent_auth.sql', checksum: 'a'.repeat(64) },
  { name: '0002_wallet_ledger.sql', checksum: 'b'.repeat(64) },
];

const completeMetadata = () => ({
  tables: [...REQUIRED_TABLES],
  columns: [...REQUIRED_COLUMNS],
  indexes: [...REQUIRED_INDEXES],
  triggers: [...REQUIRED_TRIGGERS],
  unvalidatedConstraints: [],
  migrations: manifest.map((entry) => ({ ...entry })),
});

test('accepts a complete shared demo database contract', () => {
  assert.deepEqual(verifyDatabaseMetadata(completeMetadata(), manifest), []);
});

test('reports missing schema objects and unvalidated constraints', () => {
  const metadata = completeMetadata();
  metadata.tables.pop();
  metadata.columns.pop();
  metadata.indexes.pop();
  metadata.triggers.pop();
  metadata.unvalidatedConstraints.push('wallet_accounts.balance_check');
  const errors = verifyDatabaseMetadata(metadata, manifest);
  assert.equal(errors.length, 5);
  assert.match(errors.join('\n'), /missing tables:/);
  assert.match(errors.join('\n'), /missing columns:/);
  assert.match(errors.join('\n'), /missing indexes:/);
  assert.match(errors.join('\n'), /missing triggers:/);
  assert.match(errors.join('\n'), /unvalidated constraints:/);
});

test('reports missing, changed and unexpected migrations', () => {
  const metadata = completeMetadata();
  metadata.migrations = [
    { name: manifest[0].name, checksum: 'wrong' },
    { name: '9999_unknown.sql', checksum: 'c'.repeat(64) },
  ];
  const errors = verifyDatabaseMetadata(metadata, manifest);
  assert.deepEqual(errors, [
    'migration checksum mismatch: 0001_parent_auth.sql',
    'missing migration: 0002_wallet_ledger.sql',
    'unexpected migrations: 9999_unknown.sql',
  ]);
});
