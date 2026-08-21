import { describe, expect, it } from 'vitest';
import { pinSchema, rewardApprovalSchema } from './validation';

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
});
