import assert from 'node:assert/strict';

export const normalizeStagingApiOrigin = (rawValue) => {
  const url = new URL(rawValue);
  const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) {
    throw new Error('STAGING_API_URL must use HTTPS except for localhost.');
  }
  if (url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== '')) {
    throw new Error('STAGING_API_URL must be an origin without credentials, path, query or fragment.');
  }
  return url.origin;
};

export const assertReadyPayload = (payload) => {
  assert.equal(payload?.status, 'ready');
  assert.equal(payload?.ready, true);
  assert.equal(payload?.environment, 'staging');
  assert.ok(payload.checks && typeof payload.checks === 'object');
  const entries = Object.entries(payload.checks);
  assert.ok(entries.length >= 9, 'Readiness payload is missing expected checks.');
  for (const [name, passed] of entries) assert.equal(passed, true, `Readiness check ${name} failed.`);
};

export const assertObservabilityPayload = (payload) => {
  assert.equal(payload?.success, true);
  assert.equal(payload?.hours, 1);
  assert.match(payload?.generatedAt ?? '', /^\d{4}-\d{2}-\d{2}T/);
  assert.ok(['healthy', 'warning', 'critical'].includes(payload?.status));
  assert.ok(payload?.auth && payload?.otp && payload?.purchases && payload?.finance);
  assert.equal(typeof payload.finance.walletLedgerMismatches, 'number');
};
