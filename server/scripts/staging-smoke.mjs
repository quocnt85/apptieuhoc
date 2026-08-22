import assert from 'node:assert/strict';
import process from 'node:process';
import { assertObservabilityPayload, assertReadyPayload, normalizeStagingApiOrigin } from './staging-smoke-utils.mjs';

const apiOrigin = normalizeStagingApiOrigin(process.env.STAGING_API_URL ?? '');
const adminSecret = process.env.STAGING_ADMIN_SECRET;
const allowedOrigin = process.env.STAGING_ALLOWED_ORIGIN ?? 'https://staging.novastars.vn';
if (!adminSecret || adminSecret.length < 32) throw new Error('STAGING_ADMIN_SECRET must contain at least 32 characters.');

const request = async (pathname, init = {}) => {
  const response = await fetch(`${apiOrigin}${pathname}`, {
    ...init,
    redirect: 'error',
    signal: AbortSignal.timeout(15_000),
  });
  const text = await response.text();
  assert.ok(!text.includes(adminSecret), `${pathname} reflected the admin secret.`);
  let body;
  try { body = JSON.parse(text); } catch { throw new Error(`${pathname} returned non-JSON content (HTTP ${response.status}).`); }
  return { response, body };
};

const health = await request('/health');
assert.equal(health.response.status, 200);
assert.equal(health.body.status, 'healthy');
assert.equal(health.body.environment, 'staging');

const ready = await request('/ready');
assert.equal(ready.response.status, 200);
assertReadyPayload(ready.body);

const allowedCors = await request('/health', { headers: { Origin: allowedOrigin } });
assert.equal(allowedCors.response.headers.get('access-control-allow-origin'), allowedOrigin);
const deniedCors = await request('/health', { headers: { Origin: 'https://attacker.invalid' } });
assert.equal(deniedCors.response.headers.get('access-control-allow-origin'), null);

const unauthorized = await request('/api/v1/admin/observability?hours=1');
assert.equal(unauthorized.response.status, 401);
assert.equal(unauthorized.body?.error?.code, 'ADMIN_AUTH_REQUIRED');

const observability = await request('/api/v1/admin/observability?hours=1', {
  headers: { 'X-Admin-Secret': adminSecret },
});
assert.equal(observability.response.status, 200);
assertObservabilityPayload(observability.body);

console.log(`Staging smoke passed for ${apiOrigin} (health, readiness, CORS, admin guard and live Neon observability).`);
