import type { AppBindings } from './bindings';
import { createPinVerifier, randomOtp, randomToken, sha256Hex, verifyPin } from './crypto';
import { getSql, type Sql } from './database';
import { AppError } from './errors';
import { sendOtpEmail, type OtpPurpose } from './emailService';

type ParentRow = { id: string; email_normalized: string; email_verified_at: string | null; status: string };

const genericOtpResponse = { success: true, message: 'Nếu tài khoản hợp lệ, mã xác minh sẽ được gửi.' };

const createOtpChallenge = async (
  sql: Sql,
  env: AppBindings,
  parent: ParentRow,
  purpose: OtpPurpose,
): Promise<string> => {
  const recent = await sql`
    SELECT resend_after FROM email_otp_challenges
    WHERE parent_id = ${parent.id} AND purpose = ${purpose} AND consumed_at IS NULL
    ORDER BY created_at DESC LIMIT 1
  `;
  if (recent[0] && new Date(String(recent[0].resend_after)).getTime() > Date.now()) {
    throw new AppError(429, 'OTP_RESEND_THROTTLED', 'Vui lòng chờ trước khi gửi lại mã.');
  }

  const otp = randomOtp();
  const otpHash = await sha256Hex(`${otp}:${env.OTP_PEPPER}`);
  const challengeId = crypto.randomUUID();
  await sql`
    INSERT INTO email_otp_challenges
      (id, parent_id, purpose, otp_hash, expires_at, resend_after)
    VALUES
      (${challengeId}, ${parent.id}, ${purpose}, ${otpHash}, NOW() + INTERVAL '10 minutes', NOW() + INTERVAL '60 seconds')
  `;
  await sendOtpEmail(env, parent.email_normalized, otp, purpose);
  return otp;
};

export const registerParent = async (
  env: AppBindings,
  email: string,
  policyVersion: string,
  marketingConsent: boolean,
): Promise<Record<string, unknown>> => {
  const sql = getSql(env);
  const parentId = crypto.randomUUID();
  const rows = await sql`
    INSERT INTO parent_accounts (id, email_normalized)
    VALUES (${parentId}, ${email})
    ON CONFLICT (email_normalized) DO UPDATE SET updated_at = NOW()
    RETURNING id, email_normalized, email_verified_at, status
  ` as ParentRow[];
  const parent = rows[0];
  if (!parent || parent.status !== 'active') return genericOtpResponse;

  const otp = await createOtpChallenge(sql, env, parent, 'verify_email');
  await sql.transaction((tx) => [
    tx`INSERT INTO consent_receipts (id, parent_id, policy_version, scope, accepted)
       VALUES (${crypto.randomUUID()}, ${parent.id}, ${policyVersion}, 'service', TRUE)`,
    tx`INSERT INTO consent_receipts (id, parent_id, policy_version, scope, accepted)
       VALUES (${crypto.randomUUID()}, ${parent.id}, ${policyVersion}, 'marketing', ${marketingConsent})`,
    tx`INSERT INTO wallet_accounts (id, parent_id, wallet_type)
       VALUES (${crypto.randomUUID()}, ${parent.id}, 'parent_vault')
       ON CONFLICT DO NOTHING`,
  ]);
  return env.ENVIRONMENT === 'development' ? { ...genericOtpResponse, debugOtp: otp } : genericOtpResponse;
};

const consumeOtp = async (
  sql: Sql,
  env: AppBindings,
  email: string,
  otp: string,
  purpose: OtpPurpose,
): Promise<string> => {
  const otpHash = await sha256Hex(`${otp}:${env.OTP_PEPPER}`);
  const rows = await sql`
    WITH candidate AS (
      SELECT challenge.id, challenge.parent_id
      FROM email_otp_challenges challenge
      JOIN parent_accounts parent ON parent.id = challenge.parent_id
      WHERE parent.email_normalized = ${email}
        AND challenge.purpose = ${purpose}
        AND challenge.consumed_at IS NULL
        AND challenge.expires_at > NOW()
        AND challenge.attempts < 5
      ORDER BY challenge.created_at DESC
      LIMIT 1
    ), consumed AS (
      UPDATE email_otp_challenges challenge
      SET consumed_at = CASE WHEN challenge.otp_hash = ${otpHash} THEN NOW() ELSE challenge.consumed_at END,
          attempts = challenge.attempts + 1
      FROM candidate
      WHERE challenge.id = candidate.id
      RETURNING challenge.parent_id, challenge.otp_hash = ${otpHash} AS matched
    )
    SELECT parent_id, matched FROM consumed
  `;
  if (!rows[0] || rows[0].matched !== true) {
    throw new AppError(401, 'INVALID_OTP', 'Mã xác minh không hợp lệ hoặc đã hết hạn.');
  }
  return String(rows[0].parent_id);
};

export const createSession = async (sql: Sql, env: AppBindings, parentId: string): Promise<string> => {
  const token = randomToken();
  const tokenHash = await sha256Hex(`${token}:${env.SESSION_PEPPER}`);
  await sql`
    INSERT INTO parent_sessions (id, parent_id, token_hash, expires_at)
    VALUES (${crypto.randomUUID()}, ${parentId}, ${tokenHash}, NOW() + INTERVAL '30 days')
  `;
  return token;
};

export const verifyParentEmail = async (env: AppBindings, email: string, otp: string) => {
  const sql = getSql(env);
  const parentId = await consumeOtp(sql, env, email, otp, 'verify_email');
  await sql`UPDATE parent_accounts SET email_verified_at = COALESCE(email_verified_at, NOW()), updated_at = NOW() WHERE id = ${parentId}`;
  const token = await createSession(sql, env, parentId);
  const credentials = await sql`SELECT 1 FROM parent_auth_credentials WHERE parent_id = ${parentId} LIMIT 1`;
  return { success: true, token, parentId, requiresPinSetup: credentials.length === 0 };
};

export const setupParentPin = async (env: AppBindings, parentId: string, pin: string): Promise<void> => {
  const sql = getSql(env);
  const { salt, verifier, version } = await createPinVerifier(pin, env.PIN_PEPPER);
  await sql`
    INSERT INTO parent_auth_credentials (parent_id, pin_verifier, pin_salt, verifier_version)
    VALUES (${parentId}, ${verifier}, ${salt}, ${version})
    ON CONFLICT (parent_id) DO UPDATE SET
      pin_verifier = EXCLUDED.pin_verifier,
      pin_salt = EXCLUDED.pin_salt,
      verifier_version = EXCLUDED.verifier_version,
      failed_attempts = 0,
      lock_level = 0,
      locked_until = NULL,
      pin_changed_at = NOW()
  `;
};

type PinCredentialRow = {
  pin_verifier: string;
  pin_salt: string;
  failed_attempts: number;
  lock_level: number;
  locked_until: string | null;
};

const lockDurationMinutes = (nextLevel: number): number => {
  if (nextLevel <= 1) return 5;
  if (nextLevel === 2) return 15;
  return 60;
};

export const verifyParentPin = async (
  env: AppBindings,
  parentId: string,
  sessionId: string,
  pin: string,
): Promise<{ success: true; unlockedUntil: string }> => {
  const sql = getSql(env);
  const rows = await sql`
    SELECT pin_verifier, pin_salt, failed_attempts, lock_level, locked_until
    FROM parent_auth_credentials
    WHERE parent_id = ${parentId}
    LIMIT 1
  ` as PinCredentialRow[];
  const credential = rows[0];
  if (!credential) throw new AppError(409, 'PIN_NOT_CONFIGURED', 'Mã PIN phụ huynh chưa được thiết lập.');

  if (credential.locked_until && new Date(credential.locked_until).getTime() > Date.now()) {
    throw new AppError(429, 'PIN_LOCKED', 'Mã PIN tạm khóa do nhập sai nhiều lần.', {
      lockedUntil: credential.locked_until,
    });
  }

  const matched = await verifyPin(pin, env.PIN_PEPPER, credential.pin_salt, credential.pin_verifier);
  if (!matched) {
    const nextAttempts = credential.failed_attempts + 1;
    if (nextAttempts >= 5) {
      const nextLevel = credential.lock_level + 1;
      const minutes = lockDurationMinutes(nextLevel);
      await sql`
        UPDATE parent_auth_credentials
        SET failed_attempts = 0,
            lock_level = ${nextLevel},
            locked_until = NOW() + (${minutes} * INTERVAL '1 minute')
        WHERE parent_id = ${parentId}
      `;
      throw new AppError(429, 'PIN_LOCKED', 'Mã PIN tạm khóa do nhập sai nhiều lần.');
    }
    await sql`
      UPDATE parent_auth_credentials
      SET failed_attempts = ${nextAttempts}, locked_until = NULL
      WHERE parent_id = ${parentId}
    `;
    throw new AppError(401, 'INVALID_PIN', 'Mã PIN không đúng.', { attemptsRemaining: 5 - nextAttempts });
  }

  const unlockedUntil = new Date(Date.now() + 5 * 60_000).toISOString();
  await sql.transaction((tx) => [
    tx`UPDATE parent_auth_credentials
       SET failed_attempts = 0, lock_level = 0, locked_until = NULL
       WHERE parent_id = ${parentId}`,
    tx`UPDATE parent_sessions SET last_reauthenticated_at = NOW() WHERE id = ${sessionId}`,
  ]);
  return { success: true, unlockedUntil };
};

export const requestPinReset = async (env: AppBindings, email: string): Promise<Record<string, unknown>> => {
  const sql = getSql(env);
  const rows = await sql`
    SELECT id, email_normalized, email_verified_at, status
    FROM parent_accounts WHERE email_normalized = ${email} AND status = 'active' LIMIT 1
  ` as ParentRow[];
  if (!rows[0] || !rows[0].email_verified_at) return genericOtpResponse;
  const otp = await createOtpChallenge(sql, env, rows[0], 'reset_pin');
  return env.ENVIRONMENT === 'development' ? { ...genericOtpResponse, debugOtp: otp } : genericOtpResponse;
};

export const confirmPinReset = async (
  env: AppBindings,
  email: string,
  otp: string,
  newPin: string,
) => {
  const sql = getSql(env);
  const parentId = await consumeOtp(sql, env, email, otp, 'reset_pin');
  await setupParentPin(env, parentId, newPin);
  await sql`UPDATE parent_sessions SET revoked_at = NOW() WHERE parent_id = ${parentId} AND revoked_at IS NULL`;
  const token = await createSession(sql, env, parentId);
  return { success: true, token, parentId };
};
