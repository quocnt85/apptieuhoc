import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import process from 'node:process';
import { neon } from '@neondatabase/serverless';
import { normalizeStagingApiOrigin } from './staging-smoke-utils.mjs';

const apiOrigin = normalizeStagingApiOrigin(process.env.STAGING_API_URL ?? '');
const adminDatabaseUrl = process.env.STAGING_DATABASE_ADMIN_URL;
const otpPepper = process.env.STAGING_OTP_PEPPER;
const expectedDatabase = process.env.STAGING_EXPECTED_DATABASE ?? 'novastars_app_demo';
if (!adminDatabaseUrl) throw new Error('STAGING_DATABASE_ADMIN_URL is required for invariant verification and cleanup.');
if (otpPepper && otpPepper.length < 32) throw new Error('STAGING_OTP_PEPPER must contain at least 32 characters when provided.');
if (!/^[a-z][a-z0-9_]{0,62}$/.test(expectedDatabase)) throw new Error('STAGING_EXPECTED_DATABASE is invalid.');

const sql = neon(adminDatabaseUrl);
const email = `staging-auth-smoke-${randomUUID()}@example.invalid`;
const rateLimitHash = otpPepper
  ? createHash('sha256').update(`otp_request:email:${email}:${otpPepper}`).digest('hex')
  : null;
const requestId = () => `staging-auth-${randomUUID()}`;

const register = async () => {
  const response = await fetch(`${apiOrigin}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Request-ID': requestId() },
    body: JSON.stringify({ email, policyVersion: 'staging-smoke-v1', marketingConsent: false }),
    redirect: 'error',
    signal: AbortSignal.timeout(15_000),
  });
  const text = await response.text();
  assert.ok(!text.includes(email), 'Registration response exposed the smoke email.');
  if (otpPepper) assert.ok(!text.includes(otpPepper), 'Registration response exposed the OTP pepper.');
  let body;
  try { body = JSON.parse(text); } catch { throw new Error(`Registration returned non-JSON content (HTTP ${response.status}).`); }
  return { response, body };
};

try {
  const identity = await sql`SELECT current_database() AS database_name`;
  assert.equal(identity[0]?.database_name, expectedDatabase, 'Refusing to inspect or clean an unexpected database.');

  const first = await register();
  assert.equal(first.response.status, 200);
  assert.equal(first.body?.success, true);
  assert.equal(Object.hasOwn(first.body ?? {}, 'debugOtp'), false, 'Staging must not expose a debug OTP.');

  const retry = await register();
  assert.equal(retry.response.status, 429);
  assert.equal(retry.body?.error?.code, 'OTP_RESEND_THROTTLED');

  const rows = await sql.query(`
    SELECT
      parent.id,
      (SELECT count(*)::integer FROM email_otp_challenges otp WHERE otp.parent_id = parent.id) AS otp_count,
      (SELECT count(*)::integer FROM consent_receipts consent WHERE consent.parent_id = parent.id) AS consent_count,
      (SELECT count(*)::integer FROM wallet_accounts wallet WHERE wallet.parent_id = parent.id) AS wallet_count
    FROM parent_accounts parent
    WHERE parent.email_normalized = $1
  `, [email]);
  assert.equal(rows.length, 1);
  assert.deepEqual({
    otpCount: rows[0].otp_count,
    consentCount: rows[0].consent_count,
    walletCount: rows[0].wallet_count,
  }, { otpCount: 1, consentCount: 2, walletCount: 1 });

  console.log('Staging auth smoke passed (register 200, retry 429, atomic parent/OTP/consent/wallet invariant, no debug OTP).');
} finally {
  await sql.query('DELETE FROM parent_accounts WHERE email_normalized = $1', [email]);
  if (rateLimitHash) {
    await sql.query('DELETE FROM auth_rate_limits WHERE key_hash = $1 AND action = $2', [rateLimitHash, 'otp_request']);
  }
  const remaining = await sql.query('SELECT count(*)::integer AS count FROM parent_accounts WHERE email_normalized = $1', [email]);
  assert.equal(remaining[0]?.count, 0, 'Staging auth smoke cleanup failed.');
}
