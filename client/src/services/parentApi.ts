import { Capacitor } from '@capacitor/core';
import { KeychainAccess, SecureStorage } from '@aparajita/capacitor-secure-storage';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'novastars_parent_session_device_only_v1';
const LEGACY_TOKEN_KEY = 'novastars_parent_session';
type StoredSession = { token: string; refreshToken?: string };
let sessionCache: StoredSession | null = null;
let refreshInFlight: Promise<StoredSession> | null = null;
let nativeStorageReady: Promise<void> | null = null;

const configureNativeSessionStorage = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  nativeStorageReady ??= (async () => {
    await SecureStorage.setSynchronize(false);
    await SecureStorage.setDefaultKeychainAccess(KeychainAccess.whenUnlockedThisDeviceOnly);
  })();
  await nativeStorageReady;
};

const parseStoredSession = (value: string | null): StoredSession | null => {
  if (!value) return null;
  if (/^[0-9a-f]{64}$/i.test(value)) return { token: value };
  try {
    const parsed = JSON.parse(value) as Partial<StoredSession>;
    if (!parsed.token || !/^[0-9a-f]{64}$/i.test(parsed.token)) return null;
    if (parsed.refreshToken && !/^[0-9a-f]{64}$/i.test(parsed.refreshToken)) return null;
    return { token: parsed.token, ...(parsed.refreshToken ? { refreshToken: parsed.refreshToken } : {}) };
  } catch { return null; }
};
const readSession = async (): Promise<StoredSession | null> => {
  if (sessionCache) return sessionCache;
  await configureNativeSessionStorage();
  let stored = Capacitor.isNativePlatform() ? await SecureStorage.getItem(TOKEN_KEY) : sessionStorage.getItem(LEGACY_TOKEN_KEY);
  if (Capacitor.isNativePlatform() && !stored) {
    const legacyStored = await SecureStorage.getItem(LEGACY_TOKEN_KEY);
    const legacySession = parseStoredSession(legacyStored);
    if (legacySession) {
      stored = JSON.stringify(legacySession);
      // Writing under a new key guarantees the configured ThisDeviceOnly
      // accessibility instead of relying on a Keychain update to rewrite the
      // attributes of a legacy, potentially migratable item.
      await SecureStorage.setItem(TOKEN_KEY, stored);
    }
    await SecureStorage.removeItem(LEGACY_TOKEN_KEY);
  }
  sessionCache = parseStoredSession(stored);
  return sessionCache;
};
const saveSession = async (session: StoredSession) => {
  sessionCache = session;
  const serialized = JSON.stringify(session);
  if (Capacitor.isNativePlatform()) { await configureNativeSessionStorage(); await SecureStorage.setItem(TOKEN_KEY, serialized); }
  else sessionStorage.setItem(LEGACY_TOKEN_KEY, serialized);
};
const clearSession = async () => {
  sessionCache = null;
  refreshInFlight = null;
  if (Capacitor.isNativePlatform()) {
    await configureNativeSessionStorage();
    await SecureStorage.removeItem(TOKEN_KEY);
    await SecureStorage.removeItem(LEGACY_TOKEN_KEY);
  }
  else sessionStorage.removeItem(LEGACY_TOKEN_KEY);
};

type ApiErrorShape = { error?: { code?: string; message?: string; details?: Record<string, unknown> } };
export class ParentApiError extends Error {
  constructor(public code: string, message: string, public status: number, public details?: Record<string, unknown>) { super(message); }
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => ({})) as T & ApiErrorShape;
  if (!response.ok) throw new ParentApiError(data.error?.code ?? 'REQUEST_FAILED', data.error?.message ?? 'Không thể kết nối máy chủ.', response.status, data.error?.details);
  return data;
};

const rotateSession = async (failedToken: string): Promise<StoredSession | null> => {
  const current = await readSession();
  if (current && current.token !== failedToken) return current;
  if (!current?.refreshToken) return null;
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const response = await fetch(`${API_BASE}/api/v1/auth/session/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      });
      const rotated = await parseResponse<{ token: string; refreshToken: string }>(response);
      const session = { token: rotated.token, refreshToken: rotated.refreshToken };
      await saveSession(session);
      return session;
    })().finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
};

const request = async <T>(path: string, init: RequestInit = {}, authenticated = false): Promise<T> => {
  const session = authenticated ? await readSession() : null;
  const execute = (activeSession: StoredSession | null) => fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(authenticated && activeSession ? { Authorization: `Bearer ${activeSession.token}` } : {}), ...init.headers },
  });
  let response = await execute(session);
  if (authenticated && response.status === 401 && session) {
    try {
      const rotated = await rotateSession(session.token);
      if (rotated) response = await execute(rotated);
    } catch { await clearSession(); }
  }
  try { return await parseResponse<T>(response); }
  catch (error) {
    if (authenticated && error instanceof ParentApiError && error.status === 401) await clearSession();
    throw error;
  }
};
const post = <T>(path: string, body: unknown, authenticated = false) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }, authenticated);

export const parentApi = {
  hasSession: async () => Boolean(await readSession()),
  register: (email: string, marketingConsent = false) => post<{ success: true; debugOtp?: string }>('/api/v1/auth/register', { email, marketingConsent, policyVersion: 'parent-zone-v1.2.0' }),
  verifyEmail: async (email: string, otp: string) => { const data = await post<{ token: string; refreshToken: string; parentId: string; requiresPinSetup: boolean }>('/api/v1/auth/verify-email', { email, otp }); await saveSession({ token: data.token, refreshToken: data.refreshToken }); return data; },
  setupPin: (pin: string) => post<{ success: true; unlockedUntil?: string }>('/api/v1/parent/pin/setup', { pin }, true),
  verifyPin: (pin: string) => post<{ success: true; unlockedUntil: string }>('/api/v1/parent/pin/verify', { pin }, true),
  requestPinReset: (email: string) => post<{ success: true; debugOtp?: string }>('/api/v1/auth/pin-reset/request', { email }),
  confirmPinReset: async (email: string, otp: string, newPin: string) => { const data = await post<{ token: string; refreshToken: string }>('/api/v1/auth/pin-reset/confirm', { email, otp, newPin }); await saveSession({ token: data.token, refreshToken: data.refreshToken }); return data; },
  wallets: () => request<{ parentVault: number; parentVaultVersion: number; children: { childSlotId: string; balance: number; version: number }[] }>('/api/v1/parent/wallets', {}, true),
  subscriptions: () => request<{ subscriptions: { status: string; periodEnd: string | null }[] }>('/api/v1/parent/subscriptions', {}, true),
  createChildSlot: (idempotencyKey: string) => post<{ childSlotId: string }>('/api/v1/parent/child-slots', { idempotencyKey }, true),
  closeChildSlot: (childSlotId: string, idempotencyKey: string) => request<{ returnedDiamonds: number; alreadyProcessed: boolean }>(`/api/v1/parent/child-slots/${childSlotId}`, { method: 'DELETE', body: JSON.stringify({ idempotencyKey }) }, true),
  deleteAccount: async () => { try { return await request<{ success: true }>('/api/v1/parent/account', { method: 'DELETE' }, true); } finally { await clearSession(); } },
  approveReward: (rewardRequestId: string, childSlotId: string, diamonds: number) => post<{ diamonds: number }>('/api/v1/parent/rewards/approve', { rewardRequestId, childSlotId, diamonds }, true),
  purchaseItem: (purchaseRequestId: string, childSlotId: string, sku: string) => post<{ diamondCost: number }>('/api/v1/parent/items/purchase', { purchaseRequestId, childSlotId, sku }, true),
  logout: async () => { try { await post('/api/v1/parent/logout', {}, true); } finally { await clearSession(); } },
};
