import { describe, expect, it } from 'vitest';
import { validateRuntimeConfiguration } from './config';

const secret = 'x'.repeat(32);

const base = {
  ENVIRONMENT: 'development',
  ALLOWED_ORIGINS: 'http://localhost:3000,capacitor://localhost',
  EMAIL_DELIVERY_MODE: 'console',
  EMAIL_FROM: 'security@example.com',
  PARENT_IAP_ENABLED: 'false',
  NEON_DATABASE_URL: 'postgresql://development',
  SESSION_PEPPER: secret,
  OTP_PEPPER: secret,
  PIN_PEPPER: secret,
  REVENUECAT_WEBHOOK_SECRET: secret,
  ADMIN_UPLOAD_SECRET: secret,
};

describe('runtime readiness configuration', () => {
  it('accepts the local development fallback configuration', () => {
    expect(validateRuntimeConfiguration(base).ready).toBe(true);
  });

  it('requires Hyperdrive and email binding on non-demo staging', () => {
    const result = validateRuntimeConfiguration({ ...base, ENVIRONMENT: 'staging', EMAIL_DELIVERY_MODE: 'binding' });
    expect(result.ready).toBe(false);
    expect(result.checks.databaseBinding).toBe(false);
    expect(result.checks.emailBinding).toBe(false);
  });

  it('accepts a complete staging configuration while IAP remains disabled', () => {
    const result = validateRuntimeConfiguration({
      ...base,
      ENVIRONMENT: 'staging',
      EMAIL_DELIVERY_MODE: 'binding',
      HYPERDRIVE: { connectionString: 'postgresql://hyperdrive' },
      EMAIL: {},
    });
    expect(result.ready).toBe(true);
  });

  it('accepts explicitly disabled email delivery only for staging demo auth', () => {
    const result = validateRuntimeConfiguration({
      ...base,
      ENVIRONMENT: 'staging',
      DEMO_AUTH_ENABLED: 'true',
      EMAIL_DELIVERY_MODE: 'disabled',
      HYPERDRIVE: { connectionString: 'postgresql://hyperdrive' },
    });
    expect(result.ready).toBe(true);
    expect(result.checks.emailBinding).toBe(true);
    expect(result.checks.demoAuthRestricted).toBe(true);
  });

  it('rejects demo auth in production', () => {
    const result = validateRuntimeConfiguration({
      ...base,
      ENVIRONMENT: 'production',
      DEMO_AUTH_ENABLED: 'true',
      EMAIL_DELIVERY_MODE: 'binding',
      HYPERDRIVE: { connectionString: 'postgresql://hyperdrive' },
      EMAIL: {},
    });
    expect(result.ready).toBe(false);
    expect(result.checks.demoAuthRestricted).toBe(false);
  });

  it('rejects wildcard CORS, short secrets and staging IAP', () => {
    const result = validateRuntimeConfiguration({
      ...base,
      ALLOWED_ORIGINS: '*',
      SESSION_PEPPER: 'short',
      ENVIRONMENT: 'staging',
      EMAIL_DELIVERY_MODE: 'binding',
      PARENT_IAP_ENABLED: 'true',
      HYPERDRIVE: { connectionString: 'postgresql://hyperdrive' },
      EMAIL: {},
    });
    expect(result.ready).toBe(false);
    expect(result.checks.corsAllowlist).toBe(false);
    expect(result.checks.sessionPepper).toBe(false);
    expect(result.checks.stagingIapDisabled).toBe(false);
  });
});
