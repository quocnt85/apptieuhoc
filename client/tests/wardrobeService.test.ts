import { describe, expect, it } from 'vitest';
import { planWardrobeTransaction } from '../src/services/personalization/wardrobeService';

describe('planWardrobeTransaction', () => {
  it('does not charge an owned item', () => {
    expect(planWardrobeTransaction(180, 0, true, false)).toEqual({ ok: true, charge: 0 });
  });

  it('rejects an unaffordable item without a partial charge', () => {
    expect(planWardrobeTransaction(180, 179, false, false)).toEqual({ ok: false, reason: 'INSUFFICIENT_COINS' });
  });

  it('charges once for a new item and respects unlimited mode', () => {
    expect(planWardrobeTransaction(120, 120, false, false)).toEqual({ ok: true, charge: 120 });
    expect(planWardrobeTransaction(120, 0, false, true)).toEqual({ ok: true, charge: 0 });
  });
});
