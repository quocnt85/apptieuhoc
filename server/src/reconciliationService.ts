import type { AppBindings } from './bindings';
import { getSql } from './database';
import { DIAMOND_PRODUCTS, VIP_PRODUCTS } from './catalog';

export type WalletReconciliationMismatch = {
  walletId: string;
  parentId: string;
  childSlotId: string | null;
  walletType: string;
  balance: number;
  ledgerBalance: number;
  delta: number;
  version: number;
};

export const getWalletReconciliationMismatches = async (
  env: AppBindings,
  limit = 100,
): Promise<WalletReconciliationMismatch[]> => {
  const safeLimit = Math.max(1, Math.min(500, Math.floor(limit)));
  const rows = await getSql(env)`
    WITH ledger_totals AS (
      SELECT wallet_id,
        COALESCE(SUM(CASE WHEN direction = 'credit' THEN amount ELSE -amount END), 0) AS ledger_balance
      FROM wallet_ledger
      GROUP BY wallet_id
    )
    SELECT wallet.id AS wallet_id, wallet.parent_id, wallet.child_slot_id, wallet.wallet_type,
      wallet.balance, wallet.version, COALESCE(ledger.ledger_balance, 0) AS ledger_balance,
      wallet.balance - COALESCE(ledger.ledger_balance, 0) AS delta
    FROM wallet_accounts wallet
    LEFT JOIN ledger_totals ledger ON ledger.wallet_id = wallet.id
    WHERE wallet.balance <> COALESCE(ledger.ledger_balance, 0)
    ORDER BY ABS(wallet.balance - COALESCE(ledger.ledger_balance, 0)) DESC, wallet.id
    LIMIT ${safeLimit}
  `;
  return rows.map((row) => ({
    walletId: String(row.wallet_id),
    parentId: String(row.parent_id),
    childSlotId: row.child_slot_id ? String(row.child_slot_id) : null,
    walletType: String(row.wallet_type),
    balance: Number(row.balance),
    ledgerBalance: Number(row.ledger_balance),
    delta: Number(row.delta),
    version: Number(row.version),
  }));
};

export type PurchaseReconciliationIssue = {
  eventId: string;
  kind: 'failed' | 'stale_pending' | 'missing_credit_ledger' | 'missing_subscription';
  productId: string;
  eventType: string;
  errorCode: string | null;
};

export const getPurchaseReconciliationReport = async (
  env: AppBindings,
  hours = 24,
  limit = 500,
) => {
  const safeHours = Math.max(1, Math.min(24 * 31, Math.floor(hours)));
  const safeLimit = Math.max(1, Math.min(1_000, Math.floor(limit)));
  const rows = await getSql(env)`
    SELECT event.revenuecat_event_id, event.product_id, event.event_type, event.processing_status,
      event.error_code, event.created_at,
      EXISTS (
        SELECT 1 FROM wallet_ledger ledger
        WHERE ledger.reason = 'purchase_credit'
          AND ledger.external_reference = COALESCE(event.store_transaction_id, event.revenuecat_event_id)
      ) AS has_credit_ledger,
      EXISTS (
        SELECT 1 FROM subscriptions subscription
        WHERE subscription.parent_id = event.parent_id AND subscription.product_id = event.product_id
      ) AS has_subscription,
      EXISTS (
        SELECT 1 FROM purchase_events reversal
        WHERE reversal.parent_id = event.parent_id
          AND reversal.product_id = event.product_id
          AND reversal.store_transaction_id IS NOT DISTINCT FROM event.store_transaction_id
          AND reversal.event_type IN ('REFUND', 'REVOKE')
          AND reversal.processing_status = 'processed'
      ) AS has_reversal,
      event.processing_status = 'pending' AND event.created_at < NOW() - INTERVAL '5 minutes' AS stale_pending
    FROM purchase_events event
    WHERE event.created_at >= NOW() - (${safeHours} * INTERVAL '1 hour')
    ORDER BY event.created_at DESC
    LIMIT ${safeLimit}
  `;
  const issues: PurchaseReconciliationIssue[] = [];
  for (const row of rows) {
    const base = { eventId: String(row.revenuecat_event_id), productId: String(row.product_id), eventType: String(row.event_type), errorCode: row.error_code ? String(row.error_code) : null };
    if (row.processing_status === 'failed') issues.push({ ...base, kind: 'failed' });
    else if (row.stale_pending === true) issues.push({ ...base, kind: 'stale_pending' });
    if (row.processing_status === 'processed' && row.has_reversal !== true
      && row.product_id in DIAMOND_PRODUCTS && ['INITIAL_PURCHASE', 'NON_RENEWING_PURCHASE'].includes(String(row.event_type))
      && row.has_credit_ledger !== true) issues.push({ ...base, kind: 'missing_credit_ledger' });
    if (row.processing_status === 'processed' && row.has_reversal !== true
      && row.product_id in VIP_PRODUCTS && ['INITIAL_PURCHASE', 'RENEWAL'].includes(String(row.event_type))
      && row.has_credit_ledger !== true) issues.push({ ...base, kind: 'missing_credit_ledger' });
    if (row.processing_status === 'processed' && row.product_id in VIP_PRODUCTS
      && ['INITIAL_PURCHASE', 'RENEWAL', 'CANCELLATION', 'BILLING_ISSUE', 'EXPIRATION'].includes(String(row.event_type))
      && row.has_subscription !== true) issues.push({ ...base, kind: 'missing_subscription' });
  }
  return {
    generatedAt: new Date().toISOString(),
    hours: safeHours,
    scannedEvents: rows.length,
    issueCount: issues.length,
    issues,
  };
};
