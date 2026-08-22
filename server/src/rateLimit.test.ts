import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppBindings } from './bindings';
import { getSql } from './database';
import { AppError } from './errors';
import { consumeAuthRateLimit } from './rateLimit';

vi.mock('./database', () => ({ getSql: vi.fn() }));

const env = { OTP_PEPPER: 'test-otp-pepper' } as AppBindings;

describe('authentication rate limiter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('stores a hash rather than the email or IP identifier', async () => {
    const sql = vi.fn().mockResolvedValue([{ attempts: 1, window_started_at: new Date().toISOString() }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    await consumeAuthRateLimit(env, 'otp_request', ['email:parent@example.com', 'ip:203.0.113.7'], {
      maxAttempts: 5,
      windowSeconds: 900,
    });

    expect(sql).toHaveBeenCalledTimes(2);
    const serializedCalls = JSON.stringify(sql.mock.calls);
    expect(serializedCalls).not.toContain('parent@example.com');
    expect(serializedCalls).not.toContain('203.0.113.7');
  });

  it('rejects attempts beyond the atomic database counter limit', async () => {
    const sql = vi.fn().mockResolvedValue([{
      attempts: 6,
      window_started_at: new Date(Date.now() - 480_000).toISOString(),
    }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    try {
      await consumeAuthRateLimit(env, 'otp_request', ['email:parent@example.com'], {
        maxAttempts: 5,
        windowSeconds: 900,
      });
      throw new Error('Expected rate limit failure.');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).status).toBe(429);
      expect((error as AppError).code).toBe('AUTH_RATE_LIMITED');
      expect((error as AppError).details).toEqual({ retryAfterSeconds: 420 });
    }
  });
});
