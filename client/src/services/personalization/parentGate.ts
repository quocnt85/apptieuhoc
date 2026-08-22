import { App as CapacitorApp } from '@capacitor/app';
import { parentApi } from '../parentApi';
import type { ParentGatePort, ParentGatePurpose, ParentGateSession } from '../../types/personalization';
import { PARENT_DEMO_PASSWORD, parentFeatureFlags } from '../../config/parentFeatureFlags';

const DEFAULT_SESSION_MS = 3 * 60_000;

export class ParentGateService implements ParentGatePort {
  private session: ParentGateSession | null = null;
  private listeners = new Set<(session: ParentGateSession | null) => void>();
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private verifyPin: (pin: string) => Promise<{ unlockedUntil?: string }> = parentApi.verifyPin) {}

  getSession() {
    if (this.session && this.session.unlockedUntil <= Date.now()) this.lock();
    return this.session;
  }

  isUnlocked() { return Boolean(this.getSession()); }

  markAuthenticated(unlockedUntil = Date.now() + DEFAULT_SESSION_MS) {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.session = { unlockedUntil };
    this.expiryTimer = setTimeout(() => this.lock(), Math.max(0, unlockedUntil - Date.now()));
    this.emit();
  }

  async authorizeWithPin(pin: string, _purpose: ParentGatePurpose, forceReauthentication = false) {
    if (!forceReauthentication) {
      const existing = this.getSession();
      if (existing) return existing;
    }
    if (parentFeatureFlags.demoAccess) {
      if (pin !== PARENT_DEMO_PASSWORD) throw new Error('Mật khẩu demo không đúng.');
      this.markAuthenticated(Date.now() + 30 * 60_000);
      return this.session!;
    }
    const result = await this.verifyPin(pin);
    const parsed = result.unlockedUntil ? Date.parse(result.unlockedUntil) : Number.NaN;
    this.markAuthenticated(Number.isFinite(parsed) ? parsed : Date.now() + DEFAULT_SESSION_MS);
    return this.session!;
  }

  lock() {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    if (!this.session) return;
    this.session = null;
    this.emit();
  }

  subscribe(listener: (session: ParentGateSession | null) => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private emit() { this.listeners.forEach((listener) => listener(this.session)); }
}

export const parentGate = new ParentGateService();
let initialized = false;

export const initializeParentGate = () => {
  if (initialized) return;
  initialized = true;
  const lockWhenHidden = () => { if (document.hidden) parentGate.lock(); };
  document.addEventListener('visibilitychange', lockWhenHidden);
  void CapacitorApp.addListener('appStateChange', ({ isActive }) => { if (!isActive) parentGate.lock(); });
};
