import { beforeEach, describe, expect, it, vi } from 'vitest';

const oldToken = 'a'.repeat(64);
const oldRefreshToken = 'b'.repeat(64);
const newToken = 'c'.repeat(64);
const newRefreshToken = 'd'.repeat(64);
const storage = new Map<string, string>();

const loadParentApi = async () => {
  vi.resetModules();
  return import('../src/services/parentApi');
};

describe('parent API session lifecycle', () => {
  beforeEach(() => {
    storage.clear();
    vi.restoreAllMocks();
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    });
  });

  it('clears a rejected legacy bearer session so the UI can restart email authentication', async () => {
    storage.set('novastars_parent_session', oldToken);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      error: { code: 'INVALID_SESSION', message: 'Phiên đăng nhập đã hết hạn hoặc bị thu hồi.' },
    }), { status: 401, headers: { 'Content-Type': 'application/json' } })));
    const { ParentApiError, parentApi } = await loadParentApi();

    await expect(parentApi.verifyPin('123456')).rejects.toBeInstanceOf(ParentApiError);
    expect(storage.has('novastars_parent_session')).toBe(false);
  });

  it('preserves structured PIN lockout details for the UI countdown', async () => {
    storage.set('novastars_parent_session', oldToken);
    const lockedUntil = new Date(Date.now() + 60_000).toISOString();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { code: 'PIN_LOCKED', message: 'PIN tạm khóa.', details: { lockedUntil } },
    }), { status: 429, headers: { 'Content-Type': 'application/json' } })));
    const { ParentApiError, parentApi } = await loadParentApi();

    try { await parentApi.verifyPin('123456'); throw new Error('Expected PIN lockout.'); }
    catch (error) {
      expect(error).toBeInstanceOf(ParentApiError);
      expect((error as InstanceType<typeof ParentApiError>).details).toEqual({ lockedUntil });
    }
  });

  it('rotates a refresh token and retries the original request once', async () => {
    storage.set('novastars_parent_session', JSON.stringify({ token: oldToken, refreshToken: oldRefreshToken }));
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { code: 'INVALID_SESSION' } }), {
        status: 401, headers: { 'Content-Type': 'application/json' },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: newToken, refreshToken: newRefreshToken }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, unlockedUntil: new Date().toISOString() }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      }));
    vi.stubGlobal('fetch', fetchMock);
    const { parentApi } = await loadParentApi();

    await expect(parentApi.verifyPin('123456')).resolves.toMatchObject({ success: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[1][0])).toContain('/api/v1/auth/session/refresh');
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({ refreshToken: oldRefreshToken });
    expect((fetchMock.mock.calls[2][1]?.headers as Record<string, string>).Authorization).toBe(`Bearer ${newToken}`);
    expect(JSON.parse(storage.get('novastars_parent_session') ?? '{}')).toEqual({ token: newToken, refreshToken: newRefreshToken });
  });

  it('coalesces concurrent access-token failures into one refresh request', async () => {
    storage.set('novastars_parent_session', JSON.stringify({ token: oldToken, refreshToken: oldRefreshToken }));
    let protectedCalls = 0;
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/session/refresh')) {
        await Promise.resolve();
        return new Response(JSON.stringify({ token: newToken, refreshToken: newRefreshToken }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      protectedCalls += 1;
      const authorization = (init?.headers as Record<string, string>)?.Authorization;
      const success = authorization === `Bearer ${newToken}`;
      return new Response(JSON.stringify(success
        ? { success: true, unlockedUntil: new Date().toISOString() }
        : { error: { code: 'INVALID_SESSION' } }), {
        status: success ? 200 : 401,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const { parentApi } = await loadParentApi();

    await Promise.all([parentApi.verifyPin('123456'), parentApi.verifyPin('123456')]);
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes('/session/refresh'))).toHaveLength(1);
    expect(protectedCalls).toBe(4);
  });
});
