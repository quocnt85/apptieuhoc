import { describe, expect, it, vi } from 'vitest';
import { emitMissionRewardConfirmed, MISSION_REWARD_CONFIRMED_EVENT } from '../src/services/missionCelebration';

describe('mission reward celebration event', () => {
  it('emits the committed reward detail without mutating finance state', () => {
    const target = new EventTarget();
    const listener = vi.fn();
    target.addEventListener(MISSION_REWARD_CONFIRMED_EVENT, listener);
    emitMissionRewardConfirmed({ localMissionId: 'local-1', contentMissionId: 'MISSION-FIN-001', coinsAwarded: 50, diamondsAwarded: 10 }, target);
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({
      localMissionId: 'local-1', contentMissionId: 'MISSION-FIN-001', coinsAwarded: 50, diamondsAwarded: 10,
    });
  });
});
