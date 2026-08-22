import { beforeEach, describe, expect, it, vi } from 'vitest';

const native = vi.hoisted(() => ({ appStateListener: undefined as ((state: { isActive: boolean }) => void) | undefined, addListener: vi.fn() }));
vi.mock('@capacitor/app', () => ({
  App: {
    addListener: native.addListener.mockImplementation(async (_event: string, listener: (state: { isActive: boolean }) => void) => {
      native.appStateListener = listener;
      return { remove: vi.fn() };
    }),
  },
}));

describe('Parent Gate lifecycle integration', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    native.appStateListener = undefined;
  });

  it('registers once and locks on both native background and document hiding', async () => {
    let visibilityListener: (() => void) | undefined;
    let hidden = false;
    vi.stubGlobal('document', {
      get hidden() { return hidden; },
      addEventListener: vi.fn((event: string, listener: () => void) => {
        if (event === 'visibilitychange') visibilityListener = listener;
      }),
    });
    const { initializeParentGate, parentGate } = await import('../src/services/personalization/parentGate');

    initializeParentGate();
    initializeParentGate();
    expect(native.addListener).toHaveBeenCalledOnce();

    parentGate.markAuthenticated(Date.now() + 60_000);
    native.appStateListener?.({ isActive: false });
    expect(parentGate.isUnlocked()).toBe(false);

    parentGate.markAuthenticated(Date.now() + 60_000);
    hidden = true;
    visibilityListener?.();
    expect(parentGate.isUnlocked()).toBe(false);
  });
});
