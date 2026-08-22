import { describe, expect, it } from 'vitest';
import { isKnownRevenueProductId, resolveRevenueProduct } from './catalog';

describe('RevenueCat product catalog boundary', () => {
  it('maps known products only for the expected provider environment', () => {
    expect(resolveRevenueProduct('novastars.diamonds.100', 'PLAY_STORE', 'SANDBOX', 'staging')).toEqual({
      productId: 'novastars.diamonds.100', kind: 'diamonds', diamonds: 100,
    });
    expect(resolveRevenueProduct('novastars.vip.monthly', 'APP_STORE', 'PRODUCTION', 'production')).toMatchObject({ kind: 'vip', diamonds: 150 });
    expect(resolveRevenueProduct('novastars.vip.monthly', 'APP_STORE', 'SANDBOX', 'production')).toBeNull();
  });

  it('does not treat an unknown provider product as a catalog item', () => {
    expect(isKnownRevenueProductId('attacker.product')).toBe(false);
    expect(resolveRevenueProduct('attacker.product', 'PLAY_STORE', 'SANDBOX', 'staging')).toBeNull();
  });
});
