import type { AppBindings } from './bindings';
import { DIAMOND_PRODUCTS, VIP_PRODUCTS } from './catalog';
import { getSql } from './database';
import { AppError } from './errors';
import { uuidSchema, type revenueCatWebhookSchema } from './validation';
import type { z } from 'zod';

export type RevenueCatPayload = z.infer<typeof revenueCatWebhookSchema>;

const asTimestamp = (value: number | null | undefined): string | null =>
  value ? new Date(value).toISOString() : null;

const subscriptionStatus = (type: string): 'active' | 'billing_retry' | 'cancelled' | 'expired' | 'revoked' => {
  if (type === 'BILLING_ISSUE') return 'billing_retry';
  if (type === 'CANCELLATION') return 'cancelled';
  if (type === 'EXPIRATION') return 'expired';
  if (type === 'REFUND') return 'revoked';
  return 'active';
};

export const processRevenueCatEvent = async (env: AppBindings, payload: RevenueCatPayload) => {
  const event = payload.event;
  const parentId = event.app_user_id;
  if (!uuidSchema.safeParse(parentId).success) {
    throw new AppError(422, 'INVALID_APP_USER_ID', 'RevenueCat app_user_id must be the parent account UUID.');
  }
  const sql = getSql(env);
  const diamonds = DIAMOND_PRODUCTS[event.product_id];
  const storeTransactionId = event.transaction_id ?? event.original_transaction_id ?? null;
  const refundableDiamonds = diamonds ?? VIP_PRODUCTS[event.product_id];

  if (refundableDiamonds && ['REFUND', 'REVOKE'].includes(event.type)) {
    const transactionGroupId = crypto.randomUUID();
    const rows = await sql`
      WITH incoming AS (
        INSERT INTO purchase_events
          (revenuecat_event_id, parent_id, store_transaction_id, app_user_id, product_id, event_type, normalized_payload)
        VALUES
          (${event.id}, ${parentId}, ${storeTransactionId}, ${parentId}, ${event.product_id}, ${event.type}, ${JSON.stringify(event)}::jsonb)
        ON CONFLICT DO NOTHING
        RETURNING revenuecat_event_id
      ), vault_before AS (
        SELECT id, balance FROM wallet_accounts
        WHERE parent_id = ${parentId} AND wallet_type = 'parent_vault'
        FOR UPDATE
      ), vault AS (
        UPDATE wallet_accounts
        SET balance = GREATEST(0, balance - ${refundableDiamonds}), version = version + 1, updated_at = NOW()
        WHERE id = (SELECT id FROM vault_before) AND EXISTS (SELECT 1 FROM incoming)
        RETURNING id
      ), ledger AS (
        INSERT INTO wallet_ledger
          (id, transaction_group_id, wallet_id, direction, amount, reason, external_reference, metadata)
        SELECT ${crypto.randomUUID()}, ${transactionGroupId}, vault.id, 'debit', LEAST(vault_before.balance, ${refundableDiamonds}), 'refund_adjustment', ${storeTransactionId},
               ${JSON.stringify({ requested: refundableDiamonds })}::jsonb
        FROM vault, vault_before WHERE vault_before.balance > 0
      ), revoked AS (
        UPDATE subscriptions SET status = 'revoked', will_renew = FALSE, updated_at = NOW()
        WHERE parent_id = ${parentId} AND product_id = ${event.product_id} AND EXISTS (SELECT 1 FROM incoming)
      ), completed AS (
        UPDATE purchase_events SET processing_status = 'processed', processed_at = NOW()
        WHERE revenuecat_event_id IN (SELECT revenuecat_event_id FROM incoming)
        RETURNING revenuecat_event_id
      )
      SELECT completed.revenuecat_event_id, COALESCE((SELECT LEAST(balance, ${refundableDiamonds}) FROM vault_before), 0) AS debited FROM completed
    `;
    return { accepted: true, duplicate: rows.length === 0, kind: 'refund', debitedDiamonds: Number(rows[0]?.debited ?? 0) };
  }

  if (diamonds && ['INITIAL_PURCHASE', 'NON_RENEWING_PURCHASE'].includes(event.type)) {
    const transactionGroupId = crypto.randomUUID();
    const rows = await sql`
      WITH incoming AS (
        INSERT INTO purchase_events
          (revenuecat_event_id, parent_id, store_transaction_id, app_user_id, product_id, event_type, normalized_payload)
        VALUES
          (${event.id}, ${parentId}, ${storeTransactionId}, ${parentId}, ${event.product_id}, ${event.type}, ${JSON.stringify(event)}::jsonb)
        ON CONFLICT DO NOTHING
        RETURNING revenuecat_event_id
      ), vault AS (
        UPDATE wallet_accounts
        SET balance = balance + ${diamonds}, version = version + 1, updated_at = NOW()
        WHERE parent_id = ${parentId} AND wallet_type = 'parent_vault'
          AND EXISTS (SELECT 1 FROM incoming)
        RETURNING id
      ), ledger AS (
        INSERT INTO wallet_ledger
          (id, transaction_group_id, wallet_id, direction, amount, reason, external_reference)
        SELECT ${crypto.randomUUID()}, ${transactionGroupId}, id, 'credit', ${diamonds}, 'purchase_credit', ${storeTransactionId}
        FROM vault
      ), completed AS (
        UPDATE purchase_events SET processing_status = 'processed', processed_at = NOW()
        WHERE revenuecat_event_id IN (SELECT revenuecat_event_id FROM incoming)
        RETURNING revenuecat_event_id
      )
      SELECT revenuecat_event_id FROM completed
    `;
    return { accepted: true, duplicate: rows.length === 0, kind: 'diamonds', diamonds };
  }

  const vipDiamonds = VIP_PRODUCTS[event.product_id];
  if (vipDiamonds) {
    const entitlementId = event.entitlement_ids?.[0] ?? 'vip';
    const status = subscriptionStatus(event.type);
    const periodStart = asTimestamp(event.purchased_at_ms);
    const periodEnd = asTimestamp(event.expiration_at_ms);
    const shouldCredit = ['INITIAL_PURCHASE', 'RENEWAL'].includes(event.type);
    const transactionGroupId = crypto.randomUUID();
    const rows = await sql`
      WITH incoming AS (
        INSERT INTO purchase_events
          (revenuecat_event_id, parent_id, store_transaction_id, app_user_id, product_id, event_type, normalized_payload)
        VALUES
          (${event.id}, ${parentId}, ${storeTransactionId}, ${parentId}, ${event.product_id}, ${event.type}, ${JSON.stringify(event)}::jsonb)
        ON CONFLICT DO NOTHING
        RETURNING revenuecat_event_id
      ), entitlement AS (
        INSERT INTO subscriptions
          (parent_id, entitlement_id, product_id, status, period_start, period_end, will_renew, last_store_transaction_id)
        SELECT ${parentId}, ${entitlementId}, ${event.product_id}, ${status}, ${periodStart}::timestamptz,
               ${periodEnd}::timestamptz, ${event.will_renew ?? false}, ${storeTransactionId}
        FROM incoming
        ON CONFLICT (parent_id, entitlement_id) DO UPDATE SET
          product_id = EXCLUDED.product_id,
          status = EXCLUDED.status,
          period_start = EXCLUDED.period_start,
          period_end = EXCLUDED.period_end,
          will_renew = EXCLUDED.will_renew,
          last_store_transaction_id = EXCLUDED.last_store_transaction_id,
          updated_at = NOW()
      ), vault AS (
        UPDATE wallet_accounts
        SET balance = balance + ${vipDiamonds}, version = version + 1, updated_at = NOW()
        WHERE parent_id = ${parentId} AND wallet_type = 'parent_vault'
          AND ${shouldCredit}
          AND EXISTS (SELECT 1 FROM incoming)
        RETURNING id
      ), ledger AS (
        INSERT INTO wallet_ledger
          (id, transaction_group_id, wallet_id, direction, amount, reason, external_reference)
        SELECT ${crypto.randomUUID()}, ${transactionGroupId}, id, 'credit', ${vipDiamonds}, 'purchase_credit', ${storeTransactionId}
        FROM vault
      ), completed AS (
        UPDATE purchase_events SET processing_status = 'processed', processed_at = NOW()
        WHERE revenuecat_event_id IN (SELECT revenuecat_event_id FROM incoming)
        RETURNING revenuecat_event_id
      )
      SELECT revenuecat_event_id FROM completed
    `;
    return { accepted: true, duplicate: rows.length === 0, kind: 'subscription', status, diamonds: shouldCredit ? vipDiamonds : 0 };
  }

  const rows = await sql`
    INSERT INTO purchase_events
      (revenuecat_event_id, parent_id, store_transaction_id, app_user_id, product_id, event_type, normalized_payload, processing_status, processed_at)
    VALUES
      (${event.id}, ${parentId}, ${storeTransactionId}, ${parentId}, ${event.product_id}, ${event.type}, ${JSON.stringify(event)}::jsonb, 'ignored', NOW())
    ON CONFLICT DO NOTHING
    RETURNING revenuecat_event_id
  `;
  return { accepted: true, duplicate: rows.length === 0, kind: 'ignored' };
};

export const getSubscription = async (env: AppBindings, parentId: string) => {
  const rows = await getSql(env)`
    SELECT entitlement_id, product_id, status, period_start, period_end, will_renew
    FROM subscriptions WHERE parent_id = ${parentId} ORDER BY updated_at DESC
  `;
  return rows.map((row) => ({
    entitlementId: String(row.entitlement_id),
    productId: String(row.product_id),
    status: String(row.status),
    periodStart: row.period_start ? String(row.period_start) : null,
    periodEnd: row.period_end ? String(row.period_end) : null,
    willRenew: row.will_renew === true,
  }));
};
