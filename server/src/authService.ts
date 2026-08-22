import type { AppBindings } from './bindings';
import { createPinVerifier, randomOtp, randomToken, sha256Hex, verifyPin } from './crypto';
import { getSql, type Sql } from './database';
import { AppError } from './errors';
import { sendOtpEmail, type OtpPurpose } from './emailService';

type ParentRow = { id: string; email_normalized: string; email_verified_at: string | null; status: string };
type RegistrationRow = ParentRow & { challenge_created: boolean };

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
  sql: Sql = getSql(env),
): Promise<Record<string, unknown>> => {
  const parentId = crypto.randomUUID();
  const challengeId = crypto.randomUUID();
  const otp = randomOtp();
  const otpHash = await sha256Hex(`${otp}:${env.OTP_PEPPER}`);
  const rows = await sql`
    WITH registered_parent AS (
      INSERT INTO parent_accounts (id, email_normalized)
      VALUES (${parentId}, ${email})
      ON CONFLICT (email_normalized) DO UPDATE SET updated_at = NOW()
      RETURNING id, email_normalized, email_verified_at, status
    ), recent_challenge AS (
      SELECT 1
      FROM email_otp_challenges challenge
      JOIN registered_parent parent ON parent.id = challenge.parent_id
      WHERE challenge.purpose = 'verify_email'
        AND challenge.consumed_at IS NULL
        AND challenge.resend_after > NOW()
      LIMIT 1
    ), inserted_challenge AS (
      INSERT INTO email_otp_challenges
        (id, parent_id, purpose, otp_hash, expires_at, resend_after)
      SELECT ${challengeId}, parent.id, 'verify_email', ${otpHash}, NOW() + INTERVAL '10 minutes', NOW() + INTERVAL '60 seconds'
      FROM registered_parent parent
      WHERE parent.status = 'active'
        AND NOT EXISTS (SELECT 1 FROM recent_challenge)
      RETURNING parent_id
    ), service_consent AS (
      INSERT INTO consent_receipts (id, parent_id, policy_version, scope, accepted)
      SELECT ${crypto.randomUUID()}, parent.id, ${policyVersion}, 'service', TRUE
      FROM registered_parent parent
      JOIN inserted_challenge challenge ON challenge.parent_id = parent.id
    ), marketing_consent AS (
      INSERT INTO consent_receipts (id, parent_id, policy_version, scope, accepted)
      SELECT ${crypto.randomUUID()}, parent.id, ${policyVersion}, 'marketing', ${marketingConsent}
      FROM registered_parent parent
      JOIN inserted_challenge challenge ON challenge.parent_id = parent.id
    ), parent_wallet AS (
      INSERT INTO wallet_accounts (id, parent_id, wallet_type)
      SELECT ${crypto.randomUUID()}, parent.id, 'parent_vault'
      FROM registered_parent parent
      JOIN inserted_challenge challenge ON challenge.parent_id = parent.id
      ON CONFLICT DO NOTHING
    )
    SELECT parent.id, parent.email_normalized, parent.email_verified_at, parent.status,
      EXISTS (SELECT 1 FROM inserted_challenge) AS challenge_created
    FROM registered_parent parent
  ` as RegistrationRow[];
  const parent = rows[0];
  if (!parent || parent.status !== 'active') return genericOtpResponse;
  if (!parent.challenge_created) {
    throw new AppError(429, 'OTP_RESEND_THROTTLED', 'Vui lòng chờ trước khi gửi lại mã.');
  }
  try {
    await sendOtpEmail(env, parent.email_normalized, otp, 'verify_email');
  } catch (error) {
    // A failed delivery must not leave an undeliverable challenge blocking an
    // immediate retry. Parent, consent and wallet rows remain internally valid.
    await sql`DELETE FROM email_otp_challenges WHERE id = ${challengeId} AND consumed_at IS NULL`;
    throw error;
  }
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
        AND challenge.consumed_at IS NULL
        AND challenge.expires_at > NOW()
        AND challenge.attempts < 5
      RETURNING challenge.parent_id, challenge.otp_hash = ${otpHash} AS matched
    )
    SELECT parent_id, matched FROM consumed
  `;
  if (!rows[0] || rows[0].matched !== true) {
    throw new AppError(401, 'INVALID_OTP', 'Mã xác minh không hợp lệ hoặc đã hết hạn.');
  }
  return String(rows[0].parent_id);
};

export type SessionTokens = { token: string; refreshToken: string };

const hashRefreshToken = (token: string, env: AppBindings) => sha256Hex(`${token}:refresh:${env.SESSION_PEPPER}`);

export const createSession = async (sql: Sql, env: AppBindings, parentId: string): Promise<SessionTokens> => {
  const token = randomToken();
  const refreshToken = randomToken();
  const [tokenHash, refreshTokenHash] = await Promise.all([
    sha256Hex(`${token}:${env.SESSION_PEPPER}`),
    hashRefreshToken(refreshToken, env),
  ]);
  await sql`
    INSERT INTO parent_sessions (id, parent_id, token_hash, refresh_token_hash, expires_at, refresh_expires_at)
    VALUES (${crypto.randomUUID()}, ${parentId}, ${tokenHash}, ${refreshTokenHash}, NOW() + INTERVAL '15 minutes', NOW() + INTERVAL '30 days')
  `;
  return { token, refreshToken };
};

export const refreshParentSession = async (
  env: AppBindings,
  providedRefreshToken: string,
): Promise<SessionTokens & { parentId: string }> => {
  const sql = getSql(env);
  const token = randomToken();
  const refreshToken = randomToken();
  const [providedHash, tokenHash, refreshTokenHash] = await Promise.all([
    hashRefreshToken(providedRefreshToken, env),
    sha256Hex(`${token}:${env.SESSION_PEPPER}`),
    hashRefreshToken(refreshToken, env),
  ]);
  const rows = await sql`
    UPDATE parent_sessions session
    SET token_hash = ${tokenHash},
        refresh_token_hash = ${refreshTokenHash},
        expires_at = NOW() + INTERVAL '15 minutes',
        last_reauthenticated_at = NULL
    FROM parent_accounts parent
    WHERE session.refresh_token_hash = ${providedHash}
      AND session.parent_id = parent.id
      AND session.revoked_at IS NULL
      AND session.refresh_expires_at > NOW()
      AND parent.status = 'active'
    RETURNING session.parent_id
  `;
  if (!rows[0]) throw new AppError(401, 'INVALID_REFRESH_SESSION', 'Phiên đăng nhập đã hết hạn hoặc bị thu hồi.');
  return { token, refreshToken, parentId: String(rows[0].parent_id) };
};

export const verifyParentEmail = async (env: AppBindings, email: string, otp: string, sql: Sql = getSql(env)) => {
  const parentId = await consumeOtp(sql, env, email, otp, 'verify_email');
  await sql`UPDATE parent_accounts SET email_verified_at = COALESCE(email_verified_at, NOW()), updated_at = NOW() WHERE id = ${parentId}`;
  await sql`
    INSERT INTO wallet_accounts (id, parent_id, wallet_type)
    VALUES (${crypto.randomUUID()}, ${parentId}, 'parent_vault')
    ON CONFLICT DO NOTHING
  `;
  const tokens = await createSession(sql, env, parentId);
  const credentials = await sql`SELECT 1 FROM parent_auth_credentials WHERE parent_id = ${parentId} LIMIT 1`;
  return { success: true, ...tokens, parentId, requiresPinSetup: credentials.length === 0 };
};

type SetupPinOptions = { allowReplace?: boolean; sessionId?: string };

export const setupParentPin = async (
  env: AppBindings,
  parentId: string,
  pin: string,
  options: SetupPinOptions = {},
  sql: Sql = getSql(env),
): Promise<{ unlockedUntil?: string }> => {
  const { salt, verifier, version } = await createPinVerifier(pin, env.PIN_PEPPER);
  try {
    if (options.allowReplace) {
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
    } else {
      await sql`
        INSERT INTO parent_auth_credentials (parent_id, pin_verifier, pin_salt, verifier_version)
        VALUES (${parentId}, ${verifier}, ${salt}, ${version})
      `;
    }
  } catch (error) {
    if (!options.allowReplace && typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      throw new AppError(409, 'PIN_ALREADY_CONFIGURED', 'Mã PIN đã được thiết lập. Vui lòng dùng luồng đặt lại PIN.');
    }
    throw error;
  }

  if (!options.sessionId) return {};
  await sql`UPDATE parent_sessions SET last_reauthenticated_at = NOW() WHERE id = ${options.sessionId} AND parent_id = ${parentId}`;
  return { unlockedUntil: new Date(Date.now() + 5 * 60_000).toISOString() };
};

type PinCredentialRow = {
  pin_verifier: string;
  pin_salt: string;
  failed_attempts: number;
  lock_level: number;
  locked_until: string | null;
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
    const failureRows = await sql`
      UPDATE parent_auth_credentials
      SET failed_attempts = CASE WHEN failed_attempts + 1 >= 5 THEN 0 ELSE failed_attempts + 1 END,
          lock_level = CASE WHEN failed_attempts + 1 >= 5 THEN lock_level + 1 ELSE lock_level END,
          locked_until = CASE
            WHEN failed_attempts + 1 >= 5 THEN NOW() + (
              CASE WHEN lock_level + 1 <= 1 THEN 5 WHEN lock_level + 1 = 2 THEN 15 ELSE 60 END
              * INTERVAL '1 minute'
            )
            ELSE NULL
          END
      WHERE parent_id = ${parentId}
        AND (locked_until IS NULL OR locked_until <= NOW())
      RETURNING failed_attempts, lock_level, locked_until
    ` as Pick<PinCredentialRow, 'failed_attempts' | 'lock_level' | 'locked_until'>[];
    const failure = failureRows[0];
    if (!failure || (failure.locked_until && new Date(failure.locked_until).getTime() > Date.now())) {
      throw new AppError(429, 'PIN_LOCKED', 'Mã PIN tạm khóa do nhập sai nhiều lần.', {
        lockedUntil: failure?.locked_until ?? null,
      });
    }
    throw new AppError(401, 'INVALID_PIN', 'Mã PIN không đúng.', { attemptsRemaining: 5 - failure.failed_attempts });
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

export const requestPinReset = async (env: AppBindings, email: string, sql: Sql = getSql(env)): Promise<Record<string, unknown>> => {
  const rows = await sql`
    SELECT id, email_normalized, email_verified_at, status
    FROM parent_accounts WHERE email_normalized = ${email} AND status = 'active' LIMIT 1
  ` as ParentRow[];
  if (!rows[0] || !rows[0].email_verified_at) return genericOtpResponse;
  let otp: string;
  try {
    otp = await createOtpChallenge(sql, env, rows[0], 'reset_pin');
  } catch (error) {
    if (error instanceof AppError && error.code === 'OTP_RESEND_THROTTLED') return genericOtpResponse;
    throw error;
  }
  return env.ENVIRONMENT === 'development' ? { ...genericOtpResponse, debugOtp: otp } : genericOtpResponse;
};

export const confirmPinReset = async (
  env: AppBindings,
  email: string,
  otp: string,
  newPin: string,
  sql: Sql = getSql(env),
) => {
  const parentId = await consumeOtp(sql, env, email, otp, 'reset_pin');
  await setupParentPin(env, parentId, newPin, { allowReplace: true }, sql);
  await sql`UPDATE parent_sessions SET revoked_at = NOW() WHERE parent_id = ${parentId} AND revoked_at IS NULL`;
  const tokens = await createSession(sql, env, parentId);
  return { success: true, ...tokens, parentId };
};
