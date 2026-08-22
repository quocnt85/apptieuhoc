import { describe, expect, it } from 'vitest';
import parentAuthSql from '../migrations/0001_parent_auth.sql?raw';
import walletLedgerSql from '../migrations/0002_wallet_ledger.sql?raw';
import purchaseSubscriptionsSql from '../migrations/0003_purchase_subscriptions.sql?raw';
import auditConsentSql from '../migrations/0004_audit_and_consent.sql?raw';
import childSlotCloseIdempotencySql from '../migrations/0005_child_slot_close_idempotency.sql?raw';
import authRateLimitsSql from '../migrations/0006_auth_rate_limits.sql?raw';
import refreshSessionsSql from '../migrations/0007_refresh_sessions.sql?raw';
import purchaseOrderingSql from '../migrations/0008_purchase_event_ordering.sql?raw';
import walletLedgerAppendOnlySql from '../migrations/0009_wallet_ledger_append_only.sql?raw';
import purchaseDeadLetterSql from '../migrations/0010_purchase_dead_letter.sql?raw';

const migrations = [
  { name: '0001_parent_auth.sql', sql: parentAuthSql },
  { name: '0002_wallet_ledger.sql', sql: walletLedgerSql },
  { name: '0003_purchase_subscriptions.sql', sql: purchaseSubscriptionsSql },
  { name: '0004_audit_and_consent.sql', sql: auditConsentSql },
  { name: '0005_child_slot_close_idempotency.sql', sql: childSlotCloseIdempotencySql },
  { name: '0006_auth_rate_limits.sql', sql: authRateLimitsSql },
  { name: '0007_refresh_sessions.sql', sql: refreshSessionsSql },
  { name: '0008_purchase_event_ordering.sql', sql: purchaseOrderingSql },
  { name: '0009_wallet_ledger_append_only.sql', sql: walletLedgerAppendOnlySql },
  { name: '0010_purchase_dead_letter.sql', sql: purchaseDeadLetterSql },
];

describe('Parent Zone migration contract', () => {
  it('keeps the expected additive migration sequence', async () => {
    expect(migrations.map(({ name }) => name)).toEqual([
      '0001_parent_auth.sql',
      '0002_wallet_ledger.sql',
      '0003_purchase_subscriptions.sql',
      '0004_audit_and_consent.sql',
      '0005_child_slot_close_idempotency.sql',
      '0006_auth_rate_limits.sql',
      '0007_refresh_sessions.sql',
      '0008_purchase_event_ordering.sql',
      '0009_wallet_ledger_append_only.sql',
      '0010_purchase_dead_letter.sql',
    ]);
    for (const { sql } of migrations) {
      expect(sql.trimStart().startsWith('BEGIN;')).toBe(true);
      expect(sql.trimEnd().endsWith('COMMIT;')).toBe(true);
      expect(sql).not.toMatch(/\b(?:DROP|TRUNCATE)\b/i);
    }
  });

  it('contains all server-authoritative auth and finance tables', async () => {
    const sql = migrations.map((migration) => migration.sql).join('\n');
    for (const table of [
      'parent_accounts',
      'parent_auth_credentials',
      'email_otp_challenges',
      'parent_sessions',
      'child_wallet_slots',
      'wallet_accounts',
      'wallet_ledger',
      'reward_transfers',
      'item_entitlements',
      'item_purchase_requests',
      'purchase_events',
      'subscriptions',
      'consent_receipts',
      'security_audit_log',
      'auth_rate_limits',
    ]) {
      expect(sql).toMatch(new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`, 'i'));
    }
    expect(sql).toMatch(/balance BIGINT NOT NULL DEFAULT 0 CHECK \(balance >= 0\)/i);
    expect(sql).toMatch(/amount BIGINT NOT NULL CHECK \(amount > 0\)/i);
    expect(sql).toMatch(/revenuecat_event_id VARCHAR\(255\) PRIMARY KEY/i);
  });

  it('does not add child profile, learning, usage or photo fields to server schema', async () => {
    const sql = migrations.map((migration) => migration.sql).join('\n');
    for (const forbiddenColumn of [
      'child_name',
      'nickname',
      'grade_level',
      'learning_progress',
      'answer_text',
      'mission_title',
      'usage_minutes',
      'photo_url',
      'avatar_url',
    ]) {
      expect(sql).not.toMatch(new RegExp(`\\b${forbiddenColumn}\\b`, 'i'));
    }
  });

  it('persists retry-safe child-slot closure state', () => {
    expect(childSlotCloseIdempotencySql).toContain('close_request_id');
    expect(childSlotCloseIdempotencySql).toContain('closure_returned_diamonds');
    expect(childSlotCloseIdempotencySql).toContain('uq_child_slot_close_request');
  });

  it('adds rotating refresh-session fields without storing raw tokens', () => {
    expect(refreshSessionsSql).toContain('refresh_token_hash');
    expect(refreshSessionsSql).toContain('refresh_expires_at');
    expect(refreshSessionsSql).not.toMatch(/\brefresh_token\s+(?:TEXT|VARCHAR)/i);
  });

  it('deduplicates store events and persists subscription event ordering', () => {
    expect(purchaseOrderingSql).toContain('uq_purchase_store_event_all');
    expect(purchaseOrderingSql).toContain('last_event_at');
    expect(purchaseOrderingSql).toContain('last_revenuecat_event_id');
  });

  it('enforces the wallet ledger append-only invariant in PostgreSQL', () => {
    expect(walletLedgerAppendOnlySql).toContain('BEFORE UPDATE OR DELETE ON wallet_ledger');
    expect(walletLedgerAppendOnlySql).toContain('prevent_wallet_ledger_mutation');
    expect(walletLedgerAppendOnlySql).toContain("ERRCODE = '55000'");
  });

  it('adds an indexed dead-letter retry state for failed purchase events', () => {
    expect(purchaseDeadLetterSql).toContain('retry_count');
    expect(purchaseDeadLetterSql).toContain('last_error_at');
    expect(purchaseDeadLetterSql).toContain('idx_purchase_events_dead_letter');
  });
});
