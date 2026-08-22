import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useParentZoneStore } from '../src/stores/useParentZoneStore';
import { useGameStore } from '../src/stores/useGameStore';

vi.mock('../src/services/audio', () => ({ soundService: { playCoin: vi.fn(), playCorrect: vi.fn(), playLevelUp: vi.fn() } }));

const profileId = 'local-default';

describe('real-life mission Nova Coin cap', () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
      key: (index: number) => [...values.keys()][index] ?? null,
      get length() { return values.size; },
    });
    useParentZoneStore.setState({
      activeProfileId: profileId,
      missions: [{
        id: 'mission-1', rewardRequestId: 'mission:mission-1', profileId, sourceLessonId: 'lesson-1', contentMissionId: 'MISSION-TEST-001', title: 'Việc tốt', difficulty: 'easy', fixedCoinReward: 50,
        status: 'done_by_child', proposedAt: Date.now() - 1_000, completedAt: Date.now(),
      }],
      coinAwards: [{ id: 'prior', profileId, amount: 190, reason: 'lesson', awardedAt: Date.now() }],
    });
  });

  it('partially awards up to the daily cap and commits approval only once', () => {
    const first = useParentZoneStore.getState().approveMissionLocal('mission-1', 25, 50);
    const second = useParentZoneStore.getState().approveMissionLocal('mission-1', 25, 50);
    const state = useParentZoneStore.getState();

    expect(first).toEqual({ committed: true, coinsAwarded: 10 });
    expect(second).toEqual({ committed: false, coinsAwarded: 0 });
    expect(state.missions[0]).toMatchObject({ status: 'approved', diamondsAwarded: 25, novaCoinsAwarded: 10 });
    expect(state.coinAwards.filter((award) => award.reason === 'mission:mission-1')).toHaveLength(1);
  });

  it('credits the already-capped amount without creating a second coin-award entry', () => {
    const beforeCoins = useGameStore.getState().user.novaCoins;
    const local = useParentZoneStore.getState().approveMissionLocal('mission-1', 0, 50);
    useGameStore.getState().creditAwardedNovaCoins(local.coinsAwarded);

    expect(local).toEqual({ committed: true, coinsAwarded: 10 });
    expect(useGameStore.getState().user.novaCoins).toBe(beforeCoins + 10);
    expect(useParentZoneStore.getState().coinAwards.reduce((sum, award) => sum + award.amount, 0)).toBe(200);
  });

  it('creates one mission per stable content mission ID with fixed difficulty reward metadata', () => {
    useParentZoneStore.setState({ missions: [] });
    const task = { contentMissionId: 'MISSION-CRT-FACT-001', title: 'Kể một sự thật', difficulty: 'medium' as const, fixedCoinReward: 100 as const };
    useParentZoneStore.getState().suggestMission('Q-CRT-001', task);
    useParentZoneStore.getState().suggestMission('another-delivery-id', task);
    const missions = useParentZoneStore.getState().missions;
    expect(missions).toHaveLength(1);
    expect(missions[0]).toMatchObject({
      sourceLessonId: 'Q-CRT-001', contentMissionId: task.contentMissionId, difficulty: 'medium', fixedCoinReward: 100,
    });
    expect(missions[0].rewardRequestId).toBe(`mission:${missions[0].id}`);
  });
});
