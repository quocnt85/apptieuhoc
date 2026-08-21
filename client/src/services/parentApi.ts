import { Capacitor } from '@capacitor/core';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'novastars_parent_session';
let tokenCache: string | null = null;

const readToken = async () => {
  if (tokenCache) return tokenCache;
  tokenCache = Capacitor.isNativePlatform() ? await SecureStorage.getItem(TOKEN_KEY) : sessionStorage.getItem(TOKEN_KEY);
  return tokenCache;
};
const saveToken = async (token: string) => { tokenCache = token; if (Capacitor.isNativePlatform()) await SecureStorage.setItem(TOKEN_KEY, token); else sessionStorage.setItem(TOKEN_KEY, token); };
const clearToken = async () => { tokenCache = null; if (Capacitor.isNativePlatform()) await SecureStorage.removeItem(TOKEN_KEY); else sessionStorage.removeItem(TOKEN_KEY); };

type ApiErrorShape = { error?: { code?: string; message?: string } };
export class ParentApiError extends Error { constructor(public code: string, message: string, public status: number) { super(message); } }

const request = async <T>(path: string, init: RequestInit = {}, authenticated = false): Promise<T> => {
  const token = await readToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  const data = await response.json().catch(() => ({})) as T & ApiErrorShape;
  if (!response.ok) throw new ParentApiError(data.error?.code ?? 'REQUEST_FAILED', data.error?.message ?? 'Không thể kết nối máy chủ.', response.status);
  return data;
};
const post = <T>(path: string, body: unknown, authenticated = false) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }, authenticated);

export const parentApi = {
  hasSession: async () => Boolean(await readToken()),
  register: (email: string, marketingConsent = false) => post<{ success: true; debugOtp?: string }>('/api/v1/auth/register', { email, marketingConsent, policyVersion: 'parent-zone-v1.2.0' }),
  verifyEmail: async (email: string, otp: string) => { const data = await post<{ token: string; parentId: string; requiresPinSetup: boolean }>('/api/v1/auth/verify-email', { email, otp }); await saveToken(data.token); return data; },
  setupPin: (pin: string) => post<{ success: true }>('/api/v1/parent/pin/setup', { pin }, true),
  verifyPin: (pin: string) => post<{ success: true; unlockedUntil: string }>('/api/v1/parent/pin/verify', { pin }, true),
  requestPinReset: (email: string) => post<{ success: true; debugOtp?: string }>('/api/v1/auth/pin-reset/request', { email }),
  confirmPinReset: async (email: string, otp: string, newPin: string) => { const data = await post<{ token: string }>('/api/v1/auth/pin-reset/confirm', { email, otp, newPin }); await saveToken(data.token); return data; },
  wallets: () => request<{ parentVault: number; children: { childSlotId: string; balance: number }[] }>('/api/v1/parent/wallets', {}, true),
  subscriptions: () => request<{ subscriptions: { status: string; periodEnd: string | null }[] }>('/api/v1/parent/subscriptions', {}, true),
  createChildSlot: (idempotencyKey: string) => post<{ childSlotId: string }>('/api/v1/parent/child-slots', { idempotencyKey }, true),
  closeChildSlot: (childSlotId: string) => request<{ returnedDiamonds: number }>(`/api/v1/parent/child-slots/${childSlotId}`, { method: 'DELETE' }, true),
  deleteAccount: async () => { try { return await request<{ success: true }>('/api/v1/parent/account', { method: 'DELETE' }, true); } finally { await clearToken(); } },
  approveReward: (rewardRequestId: string, childSlotId: string, diamonds: number) => post<{ diamonds: number }>('/api/v1/parent/rewards/approve', { rewardRequestId, childSlotId, diamonds }, true),
  purchaseItem: (purchaseRequestId: string, childSlotId: string, sku: string) => post<{ diamondCost: number }>('/api/v1/parent/items/purchase', { purchaseRequestId, childSlotId, sku }, true),
  logout: async () => { try { await post('/api/v1/parent/logout', {}, true); } finally { await clearToken(); } },
};
