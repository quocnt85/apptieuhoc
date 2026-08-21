import { describe, expect, it } from 'vitest';
import { constantTimeEqual, createPinVerifier, normalizeEmail, randomOtp, randomToken, verifyPin } from './crypto';

describe('parent authentication crypto', () => {
  it('creates unpredictable-shaped OTP and session tokens', () => {
    expect(randomOtp()).toMatch(/^\d{6}$/);
    expect(randomToken()).toMatch(/^[0-9a-f]{64}$/);
  });

  it('verifies the correct PIN without storing the PIN', async () => {
    const credential = await createPinVerifier('482915', 'test-pepper');
    expect(credential.verifier).not.toContain('482915');
    await expect(verifyPin('482915', 'test-pepper', credential.salt, credential.verifier)).resolves.toBe(true);
    await expect(verifyPin('482916', 'test-pepper', credential.salt, credential.verifier)).resolves.toBe(false);
  });

  it('compares webhook secrets and normalizes email', async () => {
    await expect(constantTimeEqual('secret', 'secret')).resolves.toBe(true);
    await expect(constantTimeEqual('secret', 'different')).resolves.toBe(false);
    expect(normalizeEmail(' Parent@Example.COM ')).toBe('parent@example.com');
  });
});
