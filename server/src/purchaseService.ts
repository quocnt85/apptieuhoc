import type { AppBindings } from './bindings';
import { isKnownRevenueProductId, resolveRevenueProduct } from './catalog';
import { getSql } from './database';
import { AppError } from './errors';
import { revenueCatWebhookSchema, uuidSchema } from './validation';
import type { z } from 'zod';

export type RevenueCatPayload = z.infer<typeof revenueCatWebhookSchema>;

const asTimestamp = (value: number | null | undefined): string | null =>
  value ? new Date(value).toISOString() : null;

export const subscriptionStatus = (type: string, expirationAtMs?: number | null, now = Date.now()): 'active' | 'grace' | 'billing_retry' | 'cancelled' | 'expired' | 'revoked' => {
  if (type === 'BILLING_ISSUE') return expirationAtMs && expirationAtMs > now ? 'grace' : 'billing_retry';
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
  const product = resolveRevenueProduct(event.product_id, event.store, event.environment, env.ENVIRONMENT);
  if (isKnownRevenueProductId(event.product_id) && !product) {
    throw new AppError(422, 'PRODUCT_CONTEXT_MISMATCH', 'RevenueCat product does not match the configured store/environment catalog.');
  }
  const sql = getSql(env);
  const diamonds = product?.kind === 'diamonds' ? product.diamonds : undefined;
  const storeTransactionId = event.transaction_id
    ?? (event.type === 'RENEWAL' ? null : event.original_transaction_id ?? null);
  const externalReference = storeTransactionId ?? event.id;
  const eventTimestamp = asTimestamp(event.event_timestamp_ms ?? event.expiration_at_ms ?? event.purchased_at_ms ?? Date.now());
  const refundableDiamonds = product?.diamonds;

  if (refundableDiamonds && ['REFUND', 'REVOKE'].includes(event.type)) {
    const transactionGroupId = crypto.randomUUID();
    const rows = await sql`
      WITH incoming AS (
        INSERT INTO purchase_events
          (revenuecat_event_id, parent_id, store_transaction_id, app_user_id, product_id, event_type, normalized_payload)
        VALUES
          (${event.id}, ${parentId}, ${storeTransactionId}, ${parentId}, ${event.product_id}, ${event.type}, ${JSON.stringify(event)}::jsonb)
        ON CONFLICT (revenuecat_event_id) DO UPDATE SET processing_status = 'pending', error_code = NULL
        WHERE purchase_events.processing_status = 'failed'
          AND purchase_events.normalized_payload = EXCLUDED.normalized_payload
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
        SELECT ${crypto.randomUUID()}, ${transactionGroupId}, vault.id, 'debit', LEAST(vault_before.balance, ${refundableDiamonds}), 'refund_adjustment', ${externalReference},
               ${JSON.stringify({ requested: refundableDiamonds })}::jsonb
        FROM vault, vault_before WHERE vault_before.balance > 0
      ), revoked AS (
        UPDATE subscriptions SET status = 'revoked', will_renew = FALSE,
          last_event_at = ${eventTimestamp}::timestamptz, last_revenuecat_event_id = ${event.id}, updated_at = NOW()
        WHERE parent_id = ${parentId} AND product_id = ${event.product_id} AND EXISTS (SELECT 1 FROM incoming)
          AND (last_event_at IS NULL OR last_event_at <= ${eventTimestamp}::timestamptz)
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
        ON CONFLICT (revenuecat_event_id) DO UPDATE SET processing_status = 'pending', error_code = NULL
        WHERE purchase_events.processing_status = 'failed'
          AND purchase_events.normalized_payload = EXCLUDED.normalized_payload
        RETURNING revenuecat_event_id
      ), vault AS (
        UPDATE wallet_accounts
        SET balance = balance + ${diamonds}, version = version + 1, updated_at = NOW()
        WHERE parent_id = ${parentId} AND wallet_type = 'parent_vault'
          AND EXISTS (SELECT 1 FROM incoming)
          AND NOT EXISTS (
            SELECT 1 FROM purchase_events reversal
            WHERE reversal.parent_id = ${parentId}
              AND reversal.product_id = ${event.product_id}
              AND reversal.store_transaction_id IS NOT DISTINCT FROM ${storeTransactionId}
              AND reversal.event_type IN ('REFUND', 'REVOKE')
              AND reversal.processing_status = 'processed'
          )
        RETURNING id
      ), ledger AS (
        INSERT INTO wallet_ledger
          (id, transaction_group_id, wallet_id, direction, amount, reason, external_reference)
        SELECT ${crypto.randomUUID()}, ${transactionGroupId}, id, 'credit', ${diamonds}, 'purchase_credit', ${externalReference}
        FROM vault
      ), completed AS (
        UPDATE purchase_events SET processing_status = 'processed', processed_at = NOW()
        WHERE revenuecat_event_id IN (SELECT revenuecat_event_id FROM incoming)
        RETURNING revenuecat_event_id
      )
      SELECT completed.revenuecat_event_id, EXISTS(SELECT 1 FROM vault) AS credited FROM completed
    `;
    return { accepted: true, duplicate: rows.length === 0, kind: 'diamonds', diamonds: rows[0]?.credited === true ? diamonds : 0 };
  }

  const vipDiamonds = product?.kind === 'vip' ? product.diamonds : undefined;
  if (vipDiamonds) {
    const entitlementId = event.entitlement_ids?.[0] ?? 'vip';
    const status = subscriptionStatus(event.type, event.expiration_at_ms);
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
        ON CONFLICT (revenuecat_event_id) DO UPDATE SET processing_status = 'pending', error_code = NULL
        WHERE purchase_events.processing_status = 'failed'
          AND purchase_events.normalized_payload = EXCLUDED.normalized_payload
        RETURNING revenuecat_event_id
      ), entitlement AS (
        INSERT INTO subscriptions
          (parent_id, entitlement_id, product_id, status, period_start, period_end, will_renew, last_store_transaction_id, last_event_at, last_revenuecat_event_id)
        SELECT ${parentId}, ${entitlementId}, ${event.product_id}, ${status}, ${periodStart}::timestamptz,
               ${periodEnd}::timestamptz, ${event.will_renew ?? false}, ${storeTransactionId}, ${eventTimestamp}::timestamptz, ${event.id}
        FROM incoming
        ON CONFLICT (parent_id, entitlement_id) DO UPDATE SET
          product_id = EXCLUDED.product_id,
          status = EXCLUDED.status,
          period_start = EXCLUDED.period_start,
          period_end = EXCLUDED.period_end,
          will_renew = EXCLUDED.will_renew,
          last_store_transaction_id = EXCLUDED.last_store_transaction_id,
          last_event_at = EXCLUDED.last_event_at,
          last_revenuecat_event_id = EXCLUDED.last_revenuecat_event_id,
          updated_at = NOW()
        WHERE subscriptions.last_event_at IS NULL OR subscriptions.last_event_at <= EXCLUDED.last_event_at
      ), vault AS (
        UPDATE wallet_accounts
        SET balance = balance + ${vipDiamonds}, version = version + 1, updated_at = NOW()
        WHERE parent_id = ${parentId} AND wallet_type = 'parent_vault'
          AND ${shouldCredit}
          AND EXISTS (SELECT 1 FROM incoming)
          AND NOT EXISTS (
            SELECT 1 FROM purchase_events reversal
            WHERE reversal.parent_id = ${parentId}
              AND reversal.product_id = ${event.product_id}
              AND reversal.store_transaction_id IS NOT DISTINCT FROM ${storeTransactionId}
              AND reversal.event_type IN ('REFUND', 'REVOKE')
              AND reversal.processing_status = 'processed'
          )
        RETURNING id
      ), ledger AS (
        INSERT INTO wallet_ledger
          (id, transaction_group_id, wallet_id, direction, amount, reason, external_reference)
        SELECT ${crypto.randomUUID()}, ${transactionGroupId}, id, 'credit', ${vipDiamonds}, 'purchase_credit', ${externalReference}
        FROM vault
      ), completed AS (
        UPDATE purchase_events SET processing_status = 'processed', processed_at = NOW()
        WHERE revenuecat_event_id IN (SELECT revenuecat_event_id FROM incoming)
        RETURNING revenuecat_event_id
      )
      SELECT completed.revenuecat_event_id, EXISTS(SELECT 1 FROM vault) AS credited FROM completed
    `;
    return { accepted: true, duplicate: rows.length === 0, kind: 'subscription', status, diamonds: rows[0]?.credited === true ? vipDiamonds : 0 };
  }

  const rows = await sql`
    INSERT INTO purchase_events
      (revenuecat_event_id, parent_id, store_transaction_id, app_user_id, product_id, event_type, normalized_payload, processing_status, processed_at)
    VALUES
      (${event.id}, ${parentId}, ${storeTransactionId}, ${parentId}, ${event.product_id}, ${event.type}, ${JSON.stringify(event)}::jsonb, 'ignored', NOW())
    ON CONFLICT (revenuecat_event_id) DO UPDATE SET processing_status = 'ignored', error_code = NULL, processed_at = NOW()
    WHERE purchase_events.processing_status = 'failed'
      AND purchase_events.normalized_payload = EXCLUDED.normalized_payload
    RETURNING revenuecat_event_id
  `;
  return { accepted: true, duplicate: rows.length === 0, kind: 'ignored' };
};

const purchaseErrorCode = (error: unknown): string => error instanceof AppError ? error.code.slice(0, 64) : 'PURCHASE_PROCESSING_FAILED';

const recordPurchaseFailure = async (env: AppBindings, payload: RevenueCatPayload, error: unknown): Promise<void> => {
  const event = payload.event;
  if (!uuidSchema.safeParse(event.app_user_id).success) return;
  const storeTransactionId = event.transaction_id ?? (event.type === 'RENEWAL' ? null : event.original_transaction_id ?? null);
  await getSql(env)`
    INSERT INTO purchase_events
      (revenuecat_event_id, parent_id, store_transaction_id, app_user_id, product_id, event_type,
       normalized_payload, processing_status, error_code, retry_count, last_error_at)
    VALUES
      (${event.id}, ${event.app_user_id}, ${storeTransactionId}, ${event.app_user_id}, ${event.product_id}, ${event.type},
       ${JSON.stringify(event)}::jsonb, 'failed', ${purchaseErrorCode(error)}, 1, NOW())
    ON CONFLICT (revenuecat_event_id) DO UPDATE SET
      processing_status = 'failed',
      error_code = EXCLUDED.error_code,
      retry_count = purchase_events.retry_count + 1,
      last_error_at = NOW()
    WHERE purchase_events.processing_status IN ('pending', 'failed')
      AND purchase_events.normalized_payload = EXCLUDED.normalized_payload
  `;
};

export const processRevenueCatEventWithDeadLetter = async (env: AppBindings, payload: RevenueCatPayload) => {
  try {
    return await processRevenueCatEvent(env, payload);
  } catch (error) {
    await recordPurchaseFailure(env, payload, error).catch(() => undefined);
    throw error;
  }
};

export const replayFailedRevenueCatEvent = async (env: AppBindings, eventId: string) => {
  if (!/^[A-Za-z0-9._:-]{1,255}$/.test(eventId)) throw new AppError(422, 'INVALID_EVENT_ID', 'RevenueCat event ID không hợp lệ.');
  const rows = await getSql(env)`
    SELECT normalized_payload FROM purchase_events
    WHERE revenuecat_event_id = ${eventId} AND processing_status = 'failed'
    LIMIT 1
  `;
  if (!rows[0]) throw new AppError(404, 'FAILED_EVENT_NOT_FOUND', 'Không tìm thấy purchase event đang lỗi.');
  const parsed = revenueCatWebhookSchema.safeParse({ event: rows[0].normalized_payload });
  if (!parsed.success) throw new AppError(409, 'FAILED_EVENT_PAYLOAD_INVALID', 'Payload dead-letter không còn hợp lệ với schema hiện tại.');
  return processRevenueCatEventWithDeadLetter(env, parsed.data);
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
