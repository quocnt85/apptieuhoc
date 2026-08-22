import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from './app';
import type { AppBindings } from './bindings';
import { getSql } from './database';

vi.mock('./database', () => ({ getSql: vi.fn() }));

const secret = 'x'.repeat(32);

const createEnv = (overrides: Partial<AppBindings> = {}): AppBindings => ({
  ENVIRONMENT: 'staging',
  API_VERSION: 'v1',
  ALLOWED_ORIGINS: 'https://staging.novastars.vn,https://localhost,capacitor://localhost',
  EMAIL_FROM: 'security@novastars.vn',
  EMAIL_DELIVERY_MODE: 'binding',
  DEMO_AUTH_ENABLED: 'false',
  PARENT_ZONE_ENABLED: 'true',
  REAL_LIFE_REWARDS_ENABLED: 'true',
  PARENT_IAP_ENABLED: 'false',
  NEON_DATABASE_URL: '',
  SESSION_PEPPER: secret,
  OTP_PEPPER: secret,
  PIN_PEPPER: secret,
  REVENUECAT_WEBHOOK_SECRET: secret,
  ADMIN_UPLOAD_SECRET: secret,
  HYPERDRIVE: { connectionString: 'postgresql://hyperdrive' } as Hyperdrive,
  EMAIL: {} as SendEmail,
  CONTENT_BUCKET: {} as R2Bucket,
  ...overrides,
});

describe('staging readiness HTTP contract', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns only configuration check results when ready', async () => {
    const response = await app.request('/ready', undefined, createEnv());
    const body = await response.json() as Record<string, unknown>;
    expect(response.status).toBe(200);
    expect(body.status).toBe('ready');
    expect(JSON.stringify(body)).not.toContain(secret);
    expect(JSON.stringify(body)).not.toContain('postgresql://');
  });

  it('returns 503 when a required staging binding is absent', async () => {
    const response = await app.request('/ready', undefined, createEnv({ HYPERDRIVE: undefined }));
    const body = await response.json() as { status: string; checks: { databaseBinding: boolean } };
    expect(response.status).toBe(503);
    expect(body.status).toBe('not_ready');
    expect(body.checks.databaseBinding).toBe(false);
  });

  it('sets CORS only for allowlisted origins', async () => {
    const allowed = await app.request('/health', { headers: { Origin: 'https://staging.novastars.vn' } }, createEnv());
    const denied = await app.request('/health', { headers: { Origin: 'https://attacker.example' } }, createEnv());
    expect(allowed.headers.get('Access-Control-Allow-Origin')).toBe('https://staging.novastars.vn');
    expect(denied.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('rejects content upload without the admin secret before touching R2', async () => {
    const response = await app.request('/api/v1/admin/content/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId: 'lesson-1', content: {} }),
    }, createEnv());
    const body = await response.json() as { error: { code: string } };
    expect(response.status).toBe(401);
    expect(body.error.code).toBe('ADMIN_AUTH_REQUIRED');
  });

  it('does not expose the legacy public content upload route', async () => {
    const response = await app.request('/api/v1/content/upload', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packageId: 'lesson-1', content: {} }),
    }, createEnv());
    expect(response.status).toBe(404);
  });

  it('returns a redacted 429 response when an email exceeds the OTP request limit', async () => {
    const sql = vi.fn().mockResolvedValue([{
      attempts: 6,
      window_started_at: new Date(Date.now() - 300_000).toISOString(),
    }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    const response = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.7' },
      body: JSON.stringify({
        email: 'parent@example.com',
        policyVersion: '2026-08-22',
        marketingConsent: false,
      }),
    }, createEnv());
    const bodyText = await response.text();

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('600');
    expect(bodyText).toContain('AUTH_RATE_LIMITED');
    expect(bodyText).not.toContain('parent@example.com');
    expect(bodyText).not.toContain('203.0.113.7');
    expect(bodyText).not.toContain(secret);
    await vi.waitFor(() => expect(JSON.stringify(sql.mock.calls)).toContain('auth_error'));
    expect(JSON.stringify(sql.mock.calls)).toContain('AUTH_RATE_LIMITED');
  });

  it('rotates a refresh token through the public session endpoint', async () => {
    const sql = vi.fn().mockResolvedValue([{ parent_id: '11111111-1111-4111-8111-111111111111' }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);
    const oldRefreshToken = 'b'.repeat(64);

    const response = await app.request('/api/v1/auth/session/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: oldRefreshToken }),
    }, createEnv());
    const body = await response.json() as { success: boolean; token: string; refreshToken: string };

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.token).toMatch(/^[0-9a-f]{64}$/);
    expect(body.refreshToken).toMatch(/^[0-9a-f]{64}$/);
    expect(body.refreshToken).not.toBe(oldRefreshToken);
    expect(JSON.stringify(sql.mock.calls)).not.toContain(oldRefreshToken);
  });

  it('protects and serves the read-only wallet reconciliation report', async () => {
    const denied = await app.request('/api/v1/admin/wallet-reconciliation', undefined, createEnv());
    expect(denied.status).toBe(401);

    const sql = vi.fn().mockResolvedValue([{
      wallet_id: 'wallet-1', parent_id: 'parent-1', child_slot_id: null, wallet_type: 'parent_vault',
      balance: '20', ledger_balance: '10', delta: '10', version: '2',
    }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);
    const allowed = await app.request('/api/v1/admin/wallet-reconciliation?limit=10', {
      headers: { 'X-Admin-Secret': secret },
    }, createEnv());
    const body = await allowed.json() as { mismatchCount: number; mismatches: { delta: number }[] };

    expect(allowed.status).toBe(200);
    expect(body.mismatchCount).toBe(1);
    expect(body.mismatches[0].delta).toBe(10);
  });

  it('protects and serves aggregate-only Parent Zone observability', async () => {
    const denied = await app.request('/api/v1/admin/observability', undefined, createEnv());
    expect(denied.status).toBe(401);

    const sql = vi.fn().mockResolvedValue([{
      auth_error_requests: '4', pin_denied_requests: '2', rate_limited_requests: '1',
      issued: '12', consumed: '11', expired_unconsumed: '1', failed_events: '0',
      stale_pending_events: '1', wallet_ledger_mismatches: '0', email_normalized: 'must-not-leak@example.com',
    }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);
    const allowed = await app.request('/api/v1/admin/observability?hours=24', {
      headers: { 'X-Admin-Secret': secret },
    }, createEnv());
    const bodyText = await allowed.text();
    const body = JSON.parse(bodyText) as { status: string; auth: { errorRequests: number }; purchases: { stalePendingEvents: number } };

    expect(allowed.status).toBe(200);
    expect(body.status).toBe('warning');
    expect(body.auth.errorRequests).toBe(4);
    expect(body.purchases.stalePendingEvents).toBe(1);
    expect(bodyText).not.toContain('must-not-leak@example.com');
  });
});
