import { beforeEach, describe, expect, it, vi } from 'vitest';

const secureStorage = vi.hoisted(() => ({
  setSynchronize: vi.fn().mockResolvedValue(undefined),
  setDefaultKeychainAccess: vi.fn().mockResolvedValue(undefined),
  getItem: vi.fn().mockResolvedValue(null),
  setItem: vi.fn().mockResolvedValue(undefined),
  removeItem: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => true } }));
vi.mock('@aparajita/capacitor-secure-storage', () => ({
  KeychainAccess: { whenUnlockedThisDeviceOnly: 'whenUnlockedThisDeviceOnly' },
  SecureStorage: secureStorage,
}));

describe('native Parent API session storage', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    secureStorage.getItem.mockResolvedValue(null);
  });

  it('disables iCloud sync and uses device-only Keychain access before storing a session', async () => {
    const token = 'a'.repeat(64);
    const refreshToken = 'b'.repeat(64);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      token, refreshToken, parentId: 'parent-1', requiresPinSetup: false,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })));
    const { parentApi } = await import('../src/services/parentApi');

    await expect(parentApi.hasSession()).resolves.toBe(false);
    await parentApi.verifyEmail('parent@example.com', '123456');

    expect(secureStorage.setSynchronize).toHaveBeenCalledExactlyOnceWith(false);
    expect(secureStorage.setDefaultKeychainAccess).toHaveBeenCalledExactlyOnceWith('whenUnlockedThisDeviceOnly');
    expect(secureStorage.setItem).toHaveBeenCalledWith('novastars_parent_session_device_only_v1', JSON.stringify({ token, refreshToken }));
  });

  it('migrates a valid legacy Keychain session to a new device-only key', async () => {
    const legacy = JSON.stringify({ token: 'c'.repeat(64), refreshToken: 'd'.repeat(64) });
    secureStorage.getItem.mockImplementation(async (key: string) => (
      key === 'novastars_parent_session' ? legacy : null
    ));
    const { parentApi } = await import('../src/services/parentApi');

    await expect(parentApi.hasSession()).resolves.toBe(true);

    expect(secureStorage.setItem).toHaveBeenCalledWith('novastars_parent_session_device_only_v1', legacy);
    expect(secureStorage.removeItem).toHaveBeenCalledWith('novastars_parent_session');
    expect(secureStorage.setDefaultKeychainAccess.mock.invocationCallOrder[0])
      .toBeLessThan(secureStorage.setItem.mock.invocationCallOrder[0]);
  });
});
