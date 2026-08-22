import type { AppBindings } from './bindings';
import { sha256Hex } from './crypto';
import { getSql, type Sql } from './database';
import { AppError } from './errors';

export type AuthRateLimitAction = 'otp_request' | 'otp_verify';

type RateLimitPolicy = {
  maxAttempts: number;
  windowSeconds: number;
};

type RateLimitRow = { attempts: number | string; window_started_at: string | Date };

export const consumeAuthRateLimit = async (
  env: AppBindings,
  action: AuthRateLimitAction,
  identifiers: string[],
  policy: RateLimitPolicy,
  sql: Sql = getSql(env),
): Promise<void> => {
  const uniqueIdentifiers = [...new Set(identifiers.filter(Boolean))];
  if (uniqueIdentifiers.length === 0) return;

  for (const identifier of uniqueIdentifiers) {
    const keyHash = await sha256Hex(`${action}:${identifier}:${env.OTP_PEPPER}`);
    const resetBefore = new Date(Date.now() - policy.windowSeconds * 1_000).toISOString();
    const rows = await sql`
      INSERT INTO auth_rate_limits (key_hash, action, window_started_at, attempts, updated_at)
      VALUES (${keyHash}, ${action}, NOW(), 1, NOW())
      ON CONFLICT (key_hash, action) DO UPDATE SET
        attempts = CASE
          WHEN auth_rate_limits.window_started_at <= ${resetBefore} THEN 1
          ELSE auth_rate_limits.attempts + 1
        END,
        window_started_at = CASE
          WHEN auth_rate_limits.window_started_at <= ${resetBefore} THEN NOW()
          ELSE auth_rate_limits.window_started_at
        END,
        updated_at = NOW()
      RETURNING attempts, window_started_at
    ` as RateLimitRow[];

    const result = rows[0];
    if (result && Number(result.attempts) > policy.maxAttempts) {
      const windowStartedAt = new Date(result.window_started_at).getTime();
      const retryAfterSeconds = Math.max(0, Math.ceil((windowStartedAt + policy.windowSeconds * 1_000 - Date.now()) / 1_000));
      throw new AppError(429, 'AUTH_RATE_LIMITED', 'Có quá nhiều yêu cầu. Vui lòng thử lại sau.', {
        retryAfterSeconds,
      });
    }
  }
};
