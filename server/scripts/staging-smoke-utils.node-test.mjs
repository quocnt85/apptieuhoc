import assert from 'node:assert/strict';
import test from 'node:test';
import { assertObservabilityPayload, assertReadyPayload, normalizeStagingApiOrigin } from './staging-smoke-utils.mjs';

test('accepts only a credential-free HTTPS staging origin', () => {
  assert.equal(normalizeStagingApiOrigin('https://novastars-api-staging.example.workers.dev/'), 'https://novastars-api-staging.example.workers.dev');
  assert.equal(normalizeStagingApiOrigin('http://localhost:8787'), 'http://localhost:8787');
  for (const unsafe of [
    'http://api.example.com',
    'https://user:secret@api.example.com',
    'https://api.example.com/path',
    'https://api.example.com?secret=value',
    'https://api.example.com/#fragment',
  ]) assert.throws(() => normalizeStagingApiOrigin(unsafe));
});

test('validates redacted readiness and aggregate observability contracts', () => {
  assert.doesNotThrow(() => assertReadyPayload({
    status: 'ready',
    ready: true,
    environment: 'staging',
    checks: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [`check${index}`, true])),
  }));
  assert.throws(() => assertReadyPayload({ status: 'ready', ready: true, environment: 'staging', checks: { databaseBinding: false } }));
  assert.doesNotThrow(() => assertObservabilityPayload({
    success: true,
    generatedAt: '2026-08-22T00:00:00.000Z',
    hours: 1,
    status: 'healthy',
    auth: {},
    otp: {},
    purchases: {},
    finance: { walletLedgerMismatches: 0 },
  }));
});
