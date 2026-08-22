import { describe, expect, it } from 'vitest';
import { pinSchema, refreshSessionSchema, revenueCatWebhookSchema, rewardApprovalSchema } from './validation';

describe('parent API validation', () => {
  it('requires exactly six PIN digits', () => {
    expect(pinSchema.safeParse('123456').success).toBe(true);
    expect(pinSchema.safeParse('1234').success).toBe(false);
    expect(pinSchema.safeParse('12345a').success).toBe(false);
  });

  it('allows mission approval with zero or unbounded diamonds', () => {
    const base = { rewardRequestId: 'mission:12345678', childSlotId: crypto.randomUUID() };
    expect(rewardApprovalSchema.safeParse({ ...base, diamonds: 0 }).success).toBe(true);
    expect(rewardApprovalSchema.safeParse({ ...base, diamonds: 1_000_000 }).success).toBe(true);
    expect(rewardApprovalSchema.safeParse({ ...base, diamonds: -1 }).success).toBe(false);
  });

  it('accepts only full-length opaque refresh tokens', () => {
    expect(refreshSessionSchema.safeParse({ refreshToken: 'a'.repeat(64) }).success).toBe(true);
    expect(refreshSessionSchema.safeParse({ refreshToken: 'a'.repeat(63) }).success).toBe(false);
    expect(refreshSessionSchema.safeParse({ refreshToken: 'z'.repeat(64) }).success).toBe(false);
  });

  it('rejects unsafe or negative RevenueCat timestamps', () => {
    const base = { id: 'event', type: 'RENEWAL', app_user_id: crypto.randomUUID(), product_id: 'novastars.vip.monthly' };
    expect(revenueCatWebhookSchema.safeParse({ event: { ...base, event_timestamp_ms: Date.now() } }).success).toBe(true);
    expect(revenueCatWebhookSchema.safeParse({ event: { ...base, event_timestamp_ms: -1 } }).success).toBe(false);
    expect(revenueCatWebhookSchema.safeParse({ event: { ...base, event_timestamp_ms: Number.MAX_SAFE_INTEGER } }).success).toBe(false);
  });
});
