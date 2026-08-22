import { describe, expect, it, vi } from 'vitest';
import { ParentGateService } from '../src/services/personalization/parentGate';

describe('ParentGateService', () => {
  it('does not retain a PIN and reuses only a live parent session', async () => {
    const verify = vi.fn(async (_pin: string) => ({ unlockedUntil: new Date(Date.now() + 60_000).toISOString() }));
    const gate = new ParentGateService(verify);
    await gate.authorizeWithPin('654321', 'FLAG_APPROVAL');
    await gate.authorizeWithPin('ignored', 'MEDIA_DELETE');
    expect(verify).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(gate.getSession())).not.toContain('654321');
  });

  it('forces a fresh challenge for export and locks immediately', async () => {
    const verify = vi.fn(async () => ({ unlockedUntil: new Date(Date.now() + 60_000).toISOString() }));
    const gate = new ParentGateService(verify);
    await gate.authorizeWithPin('111111', 'FLAG_APPROVAL');
    await gate.authorizeWithPin('222222', 'CARD_EXPORT', true);
    expect(verify).toHaveBeenCalledTimes(2);
    gate.lock();
    expect(gate.isUnlocked()).toBe(false);
  });
});
