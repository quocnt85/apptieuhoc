import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppBindings } from './bindings';
import { getSql } from './database';
import { AppError } from './errors';
import { refreshParentSession, registerParent, requestPinReset, setupParentPin, verifyParentEmail, verifyParentPin } from './authService';
import { sendOtpEmail } from './emailService';

vi.mock('./database', () => ({ getSql: vi.fn() }));
vi.mock('./emailService', () => ({ sendOtpEmail: vi.fn() }));

const env = {
  ENVIRONMENT: 'staging',
  OTP_PEPPER: 'otp-pepper',
  PIN_PEPPER: 'pin-pepper',
} as AppBindings;

describe('parent authentication state transitions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates the parent, OTP, consents and wallet in one atomic registration statement', async () => {
    const sql = Object.assign(vi.fn().mockResolvedValue([{
      id: 'parent-id',
      email_normalized: 'parent@example.com',
      email_verified_at: null,
      status: 'active',
      challenge_created: true,
    }]), { transaction: vi.fn() });
    vi.mocked(sendOtpEmail).mockResolvedValue({ delivered: false, mode: 'disabled' });

    await expect(registerParent(env, 'parent@example.com', '2026-08-22', false, sql as unknown as ReturnType<typeof getSql>))
      .resolves.toMatchObject({ success: true });

    expect(sql).toHaveBeenCalledTimes(1);
    expect(sql.transaction).not.toHaveBeenCalled();
    const queryText = (sql.mock.calls[0][0] as TemplateStringsArray).join(' ');
    for (const table of ['parent_accounts', 'email_otp_challenges', 'consent_receipts', 'wallet_accounts']) {
      expect(queryText).toContain(table);
    }
    expect(vi.mocked(sendOtpEmail)).toHaveBeenCalledOnce();
  });

  it('does not send another registration OTP during the resend window', async () => {
    const sql = vi.fn().mockResolvedValue([{
      id: 'parent-id',
      email_normalized: 'parent@example.com',
      email_verified_at: null,
      status: 'active',
      challenge_created: false,
    }]);

    await expect(registerParent(env, 'parent@example.com', '2026-08-22', false, sql as unknown as ReturnType<typeof getSql>))
      .rejects.toMatchObject({ status: 429, code: 'OTP_RESEND_THROTTLED' });
    expect(vi.mocked(sendOtpEmail)).not.toHaveBeenCalled();
  });

  it('guards OTP consumption atomically against reuse, expiry and attempt overflow', async () => {
    const sql = vi.fn().mockResolvedValue([]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    await expect(verifyParentEmail(env, 'parent@example.com', '123456')).rejects.toMatchObject({
      code: 'INVALID_OTP',
    });

    const queryText = (sql.mock.calls[0][0] as TemplateStringsArray).join(' ');
    expect(queryText).toContain('challenge.consumed_at IS NULL');
    expect(queryText).toContain('challenge.expires_at > NOW()');
    expect(queryText).toContain('challenge.attempts < 5');
  });

  it('updates the failed PIN counter atomically and reports remaining attempts', async () => {
    const sql = vi.fn()
      .mockResolvedValueOnce([{
        pin_verifier: 'invalid-verifier',
        pin_salt: '00'.repeat(16),
        failed_attempts: 0,
        lock_level: 0,
        locked_until: null,
      }])
      .mockResolvedValueOnce([{ failed_attempts: 1, lock_level: 0, locked_until: null }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    try {
      await verifyParentPin(env, 'parent-id', 'session-id', '123456');
      throw new Error('Expected PIN failure.');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe('INVALID_PIN');
      expect((error as AppError).details).toEqual({ attemptsRemaining: 4 });
    }

    const updateText = (sql.mock.calls[1][0] as TemplateStringsArray).join(' ');
    expect(updateText).toContain('failed_attempts + 1');
    expect(updateText).toContain('RETURNING failed_attempts, lock_level, locked_until');
  });

  it('returns the authoritative lock expiry when the fifth PIN attempt locks the account', async () => {
    const lockedUntil = new Date(Date.now() + 5 * 60_000).toISOString();
    const sql = vi.fn()
      .mockResolvedValueOnce([{
        pin_verifier: 'invalid-verifier', pin_salt: '00'.repeat(16), failed_attempts: 4, lock_level: 0, locked_until: null,
      }])
      .mockResolvedValueOnce([{ failed_attempts: 0, lock_level: 1, locked_until: lockedUntil }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    await expect(verifyParentPin(env, 'parent-id', 'session-id', '123456')).rejects.toMatchObject({
      status: 429,
      code: 'PIN_LOCKED',
      details: { lockedUntil },
    });
  });

  it('does not reveal registered email through reset resend throttling', async () => {
    const sql = vi.fn()
      .mockResolvedValueOnce([{
        id: 'parent-id',
        email_normalized: 'parent@example.com',
        email_verified_at: new Date().toISOString(),
        status: 'active',
      }])
      .mockResolvedValueOnce([{ resend_after: new Date(Date.now() + 60_000).toISOString() }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    await expect(requestPinReset(env, 'parent@example.com')).resolves.toEqual({
      success: true,
      message: 'Nếu tài khoản hợp lệ, mã xác minh sẽ được gửi.',
    });
  });

  it('does not let an existing session overwrite an already configured PIN', async () => {
    const duplicate = Object.assign(new Error('duplicate key'), { code: '23505' });
    const sql = vi.fn().mockRejectedValue(duplicate);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    await expect(setupParentPin(env, 'parent-id', '123456')).rejects.toMatchObject({
      status: 409,
      code: 'PIN_ALREADY_CONFIGURED',
    });
    const queryText = (sql.mock.calls[0][0] as TemplateStringsArray).join(' ');
    expect(queryText).not.toContain('ON CONFLICT');
  });

  it('rotates a refresh token atomically and never sends the raw token to SQL', async () => {
    const sql = vi.fn().mockResolvedValueOnce([{ parent_id: 'parent-id' }]).mockResolvedValueOnce([]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);
    const oldRefreshToken = 'b'.repeat(64);

    const rotated = await refreshParentSession({ ...env, SESSION_PEPPER: 'session-pepper' }, oldRefreshToken);
    expect(rotated).toMatchObject({ parentId: 'parent-id' });
    expect(rotated.token).toMatch(/^[0-9a-f]{64}$/);
    expect(rotated.refreshToken).toMatch(/^[0-9a-f]{64}$/);
    expect(rotated.refreshToken).not.toBe(oldRefreshToken);
    expect(JSON.stringify(sql.mock.calls[0])).not.toContain(oldRefreshToken);
    const queryText = (sql.mock.calls[0][0] as TemplateStringsArray).join(' ');
    expect(queryText).toContain('session.refresh_token_hash =');
    expect(queryText).toContain('session.refresh_expires_at > NOW()');
    expect(queryText).toContain('last_reauthenticated_at = NULL');
    expect(queryText).not.toContain("refresh_expires_at = NOW() + INTERVAL '30 days'");

    await expect(refreshParentSession({ ...env, SESSION_PEPPER: 'session-pepper' }, oldRefreshToken)).rejects.toMatchObject({
      status: 401,
      code: 'INVALID_REFRESH_SESSION',
    });
  });
});
