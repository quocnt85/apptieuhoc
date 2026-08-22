import type { AppBindings } from './bindings';
import { getSql } from './database';

export type ParentZoneObservabilitySummary = {
  generatedAt: string;
  hours: number;
  status: 'healthy' | 'warning' | 'critical';
  auth: {
    errorRequests: number;
    pinDeniedRequests: number;
    rateLimitedRequests: number;
  };
  otp: {
    issued: number;
    consumed: number;
    expiredUnconsumed: number;
  };
  purchases: {
    failedEvents: number;
    stalePendingEvents: number;
  };
  finance: {
    walletLedgerMismatches: number;
  };
};

const count = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0;
};

export const getParentZoneObservabilitySummary = async (
  env: AppBindings,
  hours = 24,
): Promise<ParentZoneObservabilitySummary> => {
  const safeHours = Math.max(1, Math.min(24 * 31, Math.floor(hours)));
  const rows = await getSql(env)`
    WITH recent_audit AS (
      SELECT action, result, request_id, metadata
      FROM security_audit_log
      WHERE created_at >= NOW() - (${safeHours} * INTERVAL '1 hour')
    ), audit_counts AS (
      SELECT
        COUNT(DISTINCT request_id) FILTER (WHERE action = 'auth_error') AS auth_error_requests,
        COUNT(DISTINCT request_id) FILTER (WHERE action = 'pin_verify' AND result = 'denied') AS pin_denied_requests,
        COUNT(DISTINCT request_id) FILTER (
          WHERE action = 'auth_error' AND metadata->>'errorCode' = 'AUTH_RATE_LIMITED'
        ) AS rate_limited_requests
      FROM recent_audit
    ), otp_counts AS (
      SELECT
        COUNT(*) AS issued,
        COUNT(*) FILTER (WHERE consumed_at IS NOT NULL) AS consumed,
        COUNT(*) FILTER (WHERE consumed_at IS NULL AND expires_at < NOW()) AS expired_unconsumed
      FROM email_otp_challenges
      WHERE created_at >= NOW() - (${safeHours} * INTERVAL '1 hour')
    ), purchase_counts AS (
      SELECT
        COUNT(*) FILTER (WHERE processing_status = 'failed') AS failed_events,
        COUNT(*) FILTER (
          WHERE processing_status = 'pending' AND created_at < NOW() - INTERVAL '5 minutes'
        ) AS stale_pending_events
      FROM purchase_events
      WHERE created_at >= NOW() - (${safeHours} * INTERVAL '1 hour')
    ), ledger_totals AS (
      SELECT wallet_id,
        COALESCE(SUM(CASE WHEN direction = 'credit' THEN amount ELSE -amount END), 0) AS ledger_balance
      FROM wallet_ledger
      GROUP BY wallet_id
    ), ledger_counts AS (
      SELECT COUNT(*) AS wallet_ledger_mismatches
      FROM wallet_accounts wallet
      LEFT JOIN ledger_totals ledger ON ledger.wallet_id = wallet.id
      WHERE wallet.balance <> COALESCE(ledger.ledger_balance, 0)
    )
    SELECT * FROM audit_counts, otp_counts, purchase_counts, ledger_counts
  `;
  const row = rows[0] ?? {};
  const auth = {
    errorRequests: count(row.auth_error_requests),
    pinDeniedRequests: count(row.pin_denied_requests),
    rateLimitedRequests: count(row.rate_limited_requests),
  };
  const otp = {
    issued: count(row.issued),
    consumed: count(row.consumed),
    expiredUnconsumed: count(row.expired_unconsumed),
  };
  const purchases = {
    failedEvents: count(row.failed_events),
    stalePendingEvents: count(row.stale_pending_events),
  };
  const finance = { walletLedgerMismatches: count(row.wallet_ledger_mismatches) };
  const status = finance.walletLedgerMismatches > 0 || purchases.failedEvents > 0
    ? 'critical'
    : purchases.stalePendingEvents > 0 || auth.rateLimitedRequests > 0 || otp.expiredUnconsumed > 0
      ? 'warning'
      : 'healthy';
  return { generatedAt: new Date().toISOString(), hours: safeHours, status, auth, otp, purchases, finance };
};
