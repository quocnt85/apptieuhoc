import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppBindings } from './bindings';
import { getSql } from './database';
import { AppError } from './errors';
import { processRevenueCatEvent, processRevenueCatEventWithDeadLetter, replayFailedRevenueCatEvent, subscriptionStatus, type RevenueCatPayload } from './purchaseService';

vi.mock('./database', () => ({ getSql: vi.fn() }));

const env = {} as AppBindings;
const parentId = '11111111-1111-4111-8111-111111111111';

const payload = (overrides: Partial<RevenueCatPayload['event']> = {}): RevenueCatPayload => ({
  event: {
    id: 'event-1',
    type: 'INITIAL_PURCHASE',
    app_user_id: parentId,
    product_id: 'novastars.diamonds.100',
    transaction_id: 'store-tx-1',
    event_timestamp_ms: Date.parse('2026-08-22T00:00:00.000Z'),
    store: 'PLAY_STORE',
    environment: 'SANDBOX',
    ...overrides,
  },
});

const sqlMock = (rows: unknown[]) => {
  const sql = vi.fn().mockResolvedValue(rows);
  vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);
  return sql;
};

describe('RevenueCat event processing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps billing issues to grace only while the paid period remains live', () => {
    const now = Date.parse('2026-08-22T00:00:00.000Z');
    expect(subscriptionStatus('BILLING_ISSUE', now + 60_000, now)).toBe('grace');
    expect(subscriptionStatus('BILLING_ISSUE', now - 1, now)).toBe('billing_retry');
    expect(subscriptionStatus('CANCELLATION', now + 60_000, now)).toBe('cancelled');
  });

  it('credits a known consumable once and reports whether the vault was actually updated', async () => {
    const sql = sqlMock([{ revenuecat_event_id: 'event-1', credited: true }]);
    await expect(processRevenueCatEvent(env, payload())).resolves.toEqual({
      accepted: true, duplicate: false, kind: 'diamonds', diamonds: 100,
    });
    const query = (sql.mock.calls[0][0] as TemplateStringsArray).join(' ');
    expect(query).toContain("reversal.event_type IN ('REFUND', 'REVOKE')");
    expect(query).toContain('IS NOT DISTINCT FROM');
  });

  it('does not claim a credit when a reversal or missing vault suppressed the update', async () => {
    sqlMock([{ revenuecat_event_id: 'event-1', credited: false }]);
    await expect(processRevenueCatEvent(env, payload())).resolves.toMatchObject({
      duplicate: false, kind: 'diamonds', diamonds: 0,
    });
  });

  it('keeps newer subscription state when an older store event arrives later', async () => {
    const sql = sqlMock([{ revenuecat_event_id: 'event-vip', credited: false }]);
    await processRevenueCatEvent(env, payload({
      id: 'event-vip', product_id: 'novastars.vip.monthly', type: 'CANCELLATION',
      entitlement_ids: ['vip'], expiration_at_ms: Date.parse('2026-09-22T00:00:00.000Z'),
    }));
    const query = (sql.mock.calls[0][0] as TemplateStringsArray).join(' ');
    expect(query).toContain('subscriptions.last_event_at <= EXCLUDED.last_event_at');
    expect(query).toContain('last_revenuecat_event_id');
  });

  it('orders refund revocation and uses the event ID when no store transaction exists', async () => {
    const sql = sqlMock([{ revenuecat_event_id: 'refund-1', debited: 0 }]);
    await expect(processRevenueCatEvent(env, payload({
      id: 'refund-1', type: 'REFUND', transaction_id: null, original_transaction_id: null,
    }))).resolves.toMatchObject({ kind: 'refund', debitedDiamonds: 0 });
    const query = (sql.mock.calls[0][0] as TemplateStringsArray).join(' ');
    expect(query).toContain('last_event_at <=');
    expect(JSON.stringify(sql.mock.calls[0])).toContain('refund-1');
  });

  it('treats a repeated RevenueCat/store event as a duplicate', async () => {
    sqlMock([]);
    await expect(processRevenueCatEvent(env, payload())).resolves.toMatchObject({ duplicate: true, diamonds: 0 });
  });

  it('does not deduplicate separate renewals by a shared original transaction ID', async () => {
    const sql = sqlMock([{ revenuecat_event_id: 'renewal-2', credited: true }]);
    await processRevenueCatEvent(env, payload({
      id: 'renewal-2', type: 'RENEWAL', product_id: 'novastars.vip.monthly',
      transaction_id: null, original_transaction_id: 'original-subscription', entitlement_ids: ['vip'],
    }));
    expect(JSON.stringify(sql.mock.calls[0])).toContain('renewal-2');
    const values = sql.mock.calls[0].slice(1);
    expect(values).not.toContain('original-subscription');
  });

  it('rejects a non-parent app user ID before touching the database', async () => {
    await expect(processRevenueCatEvent(env, payload({ app_user_id: 'anonymous-child' }))).rejects.toBeInstanceOf(AppError);
    expect(getSql).not.toHaveBeenCalled();
  });

  it('rejects a known product from the wrong provider environment before crediting', async () => {
    const productionEnv = { ENVIRONMENT: 'production' } as AppBindings;
    await expect(processRevenueCatEvent(productionEnv, payload({ environment: 'SANDBOX' }))).rejects.toMatchObject({
      status: 422, code: 'PRODUCT_CONTEXT_MISMATCH',
    });
    expect(getSql).not.toHaveBeenCalled();
  });

  it('keeps unknown products ignored after validating parent ownership', async () => {
    sqlMock([{ revenuecat_event_id: 'unknown-1' }]);
    await expect(processRevenueCatEvent(env, payload({ id: 'unknown-1', product_id: 'unknown.product' }))).resolves.toMatchObject({ kind: 'ignored' });
  });

  it('records a failed event with retry metadata when processing throws', async () => {
    const processingError = new Error('database constraint');
    const sql = vi.fn().mockRejectedValueOnce(processingError).mockResolvedValueOnce([]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);
    await expect(processRevenueCatEventWithDeadLetter(env, payload())).rejects.toBe(processingError);
    expect(sql).toHaveBeenCalledTimes(2);
    const deadLetterQuery = (sql.mock.calls[1][0] as TemplateStringsArray).join(' ');
    expect(deadLetterQuery).toContain("processing_status = 'failed'");
    expect(deadLetterQuery).toContain('retry_count = purchase_events.retry_count + 1');
  });

  it('replays only the normalized payload stored in a failed event', async () => {
    const event = payload({ id: 'failed-event-1' }).event;
    const sql = vi.fn()
      .mockResolvedValueOnce([{ normalized_payload: event }])
      .mockResolvedValueOnce([{ revenuecat_event_id: event.id, credited: true }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);
    await expect(replayFailedRevenueCatEvent(env, event.id)).resolves.toMatchObject({ kind: 'diamonds', diamonds: 100 });
    expect((sql.mock.calls[0][0] as TemplateStringsArray).join(' ')).toContain("processing_status = 'failed'");
    expect((sql.mock.calls[1][0] as TemplateStringsArray).join(' ')).toContain("purchase_events.processing_status = 'failed'");
  });
});
