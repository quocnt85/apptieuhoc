import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChildLimits, ChildProfileLocal, CoinAward, DailyUsage, LearningActivity, RealLifeMission, UsageCategory } from '../types/parentZone';
import type { RealLifeTaskDefinition } from '../types';
import { deleteProfileGameState } from '../services/localGameStateRepository';
import { calculatePlayLimitStatus, DEFAULT_CHILD_LIMITS, localDateKey, normalizeChildLimits, normalizeDailyUsage, usageSlicesByLocalDate } from '../services/screenTime';

const weekStart = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const defaultProfile: ChildProfileLocal = {
  id: 'local-default', childSlotId: null, name: 'Phi Hành Gia Nhí', grade: 3,
  avatar: '👨‍🚀', createdAt: Date.now(),
};
let usageClockTimestamp = Date.now();
const CLOCK_ROLLBACK_TOLERANCE_MS = 2 * 60_000;
type ClockGuard = { lastObservedAt: number; rollbackDetected: boolean };

type ParentZoneState = {
  schemaVersion: 2;
  profiles: ChildProfileLocal[];
  activeProfileId: string;
  limits: Record<string, ChildLimits>;
  usage: Record<string, DailyUsage>;
  activities: LearningActivity[];
  missions: RealLifeMission[];
  coinAwards: CoinAward[];
  clockGuard: ClockGuard;
  createProfile: (profile: Omit<ChildProfileLocal, 'id' | 'createdAt' | 'childSlotId'> & { childSlotId?: string | null }) => string;
  updateProfile: (id: string, patch: Partial<Pick<ChildProfileLocal, 'name' | 'grade' | 'avatar' | 'photoDataUrl' | 'childSlotId'>>) => void;
  removeProfileLocal: (id: string) => void;
  setActiveProfile: (id: string) => void;
  setLimits: (profileId: string, limits: ChildLimits) => void;
  syncUsageClock: (countUsage: boolean, timestamp?: number, category?: UsageCategory) => void;
  resetClockGuard: (timestamp?: number) => void;
  extendToday: (profileId: string) => boolean;
  recordActivity: (activity: Omit<LearningActivity, 'id' | 'profileId' | 'completedAt'>) => void;
  suggestMission: (sourceLessonId: string, task: RealLifeTaskDefinition) => void;
  markMissionDone: (id: string) => void;
  approveMissionLocal: (id: string, diamonds: number, requestedCoins?: number) => { committed: boolean; coinsAwarded: number };
  awardCoins: (requested: number, reason: string) => number;
};

export const useParentZoneStore = create<ParentZoneState>()(persist((set, get) => ({
  schemaVersion: 2,
  profiles: [defaultProfile],
  activeProfileId: defaultProfile.id,
  limits: { [defaultProfile.id]: DEFAULT_CHILD_LIMITS },
  usage: {},
  activities: [],
  missions: [],
  coinAwards: [],
  clockGuard: { lastObservedAt: usageClockTimestamp, rollbackDetected: false },
  createProfile: (profile) => {
    if (get().profiles.length >= 4) throw new Error('Mỗi tài khoản có tối đa 4 hồ sơ trẻ.');
    const id = crypto.randomUUID();
    set((state) => ({
      profiles: [...state.profiles, { ...profile, id, childSlotId: profile.childSlotId ?? null, createdAt: Date.now() }],
      limits: { ...state.limits, [id]: DEFAULT_CHILD_LIMITS },
    }));
    return id;
  },
  updateProfile: (id, patch) => set((state) => ({ profiles: state.profiles.map((profile) => profile.id === id ? { ...profile, ...patch } : profile) })),
  removeProfileLocal: (id) => set((state) => {
    deleteProfileGameState(id);
    const profiles = state.profiles.filter((profile) => profile.id !== id);
    const fallback = profiles[0] ?? defaultProfile;
    const limits = { ...state.limits }; delete limits[id];
    return {
      profiles: profiles.length ? profiles : [fallback],
      activeProfileId: state.activeProfileId === id ? fallback.id : state.activeProfileId,
      limits,
      activities: state.activities.filter((activity) => activity.profileId !== id),
      missions: state.missions.filter((mission) => mission.profileId !== id),
      coinAwards: state.coinAwards.filter((award) => award.profileId !== id),
    };
  }),
  setActiveProfile: (id) => { if (get().profiles.some((profile) => profile.id === id)) { usageClockTimestamp = Date.now(); set({ activeProfileId: id }); } },
  setLimits: (profileId, next) => set((state) => ({ limits: { ...state.limits, [profileId]: normalizeChildLimits(next) } })),
  syncUsageClock: (countUsage, timestamp = Date.now(), category = 'exploration') => {
    const state = get();
    const previousObservedAt = Math.max(usageClockTimestamp, state.clockGuard.lastObservedAt);
    const rollbackDetected = timestamp + CLOCK_ROLLBACK_TOLERANCE_MS < previousObservedAt;
    const slices = usageSlicesByLocalDate(usageClockTimestamp, timestamp, countUsage);
    usageClockTimestamp = timestamp;
    const clockGuard = {
      lastObservedAt: rollbackDetected ? previousObservedAt : Math.max(previousObservedAt, timestamp),
      rollbackDetected: state.clockGuard.rollbackDetected || rollbackDetected,
    };
    if (!slices.length) {
      if (rollbackDetected && !state.clockGuard.rollbackDetected) set({ clockGuard });
      return;
    }
    const usage = { ...state.usage };
    for (const slice of slices) {
      const key = `${state.activeProfileId}:${slice.date}`;
      const current = normalizeDailyUsage(usage[key], slice.date);
      usage[key] = { ...current, minutes: current.minutes + slice.minutes, byCategory: { ...current.byCategory!, [category]: (current.byCategory?.[category] ?? 0) + slice.minutes } };
    }
    set({ usage, clockGuard });
  },
  resetClockGuard: (timestamp = Date.now()) => {
    usageClockTimestamp = timestamp;
    set({ clockGuard: { lastObservedAt: timestamp, rollbackDetected: false } });
  },
  extendToday: (profileId) => {
    const date = localDateKey(); const key = `${profileId}:${date}`;
    const current = normalizeDailyUsage(get().usage[key], date);
    if (current.extensionsUsed >= 2) return false;
    set((state) => ({ usage: { ...state.usage, [key]: { ...current, extensionsUsed: current.extensionsUsed + 1 } } }));
    return true;
  },
  recordActivity: (activity) => set((state) => {
    if (activity.type === 'quiz' && activity.sourceId && state.activities.some((item) => item.profileId === state.activeProfileId && item.type === 'quiz' && item.sourceId === activity.sourceId)) return state;
    return { activities: [{ ...activity, id: crypto.randomUUID(), profileId: state.activeProfileId, completedAt: Date.now() }, ...state.activities].slice(0, 500) };
  }),
  suggestMission: (sourceLessonId, task) => set((state) => {
    if (state.missions.some((mission) => mission.profileId === state.activeProfileId && mission.contentMissionId === task.contentMissionId)) return state;
    const id = crypto.randomUUID();
    return { missions: [{ id, rewardRequestId: `mission:${id}`, profileId: state.activeProfileId, sourceLessonId, contentMissionId: task.contentMissionId, title: task.title, difficulty: task.difficulty, fixedCoinReward: task.fixedCoinReward, status: 'suggested', proposedAt: Date.now() }, ...state.missions] };
  }),
  markMissionDone: (id) => set((state) => ({ missions: state.missions.map((mission) => mission.id === id ? { ...mission, status: 'done_by_child', completedAt: Date.now() } : mission) })),
  approveMissionLocal: (id, diamonds, requestedCoins = 50) => {
    let awarded = 0;
    let committed = false;
    set((state) => {
      const mission = state.missions.find((item) => item.id === id);
      if (!mission || mission.status !== 'done_by_child') return state;
      committed = true;
      const now = Date.now(); const profileId = mission.profileId;
      const today = localDateKey(now); const monday = weekStart(now);
      const daily = state.coinAwards.filter((award) => award.profileId === profileId && localDateKey(award.awardedAt) === today).reduce((sum, award) => sum + award.amount, 0);
      const weekly = state.coinAwards.filter((award) => award.profileId === profileId && award.awardedAt >= monday).reduce((sum, award) => sum + award.amount, 0);
      awarded = Math.max(0, Math.min(Math.floor(requestedCoins), 200 - daily, 1000 - weekly));
      const coinAwards = awarded > 0
        ? [{ id: crypto.randomUUID(), profileId, amount: awarded, reason: `mission:${id}`, awardedAt: now }, ...state.coinAwards].slice(0, 1000)
        : state.coinAwards;
      return {
        missions: state.missions.map((item) => item.id === id ? { ...item, status: 'approved', approvedAt: now, diamondsAwarded: diamonds, novaCoinsAwarded: awarded } : item),
        coinAwards,
      };
    });
    return { committed, coinsAwarded: awarded };
  },
  awardCoins: (requested, reason) => {
    const now = Date.now(); const state = get(); const profileId = state.activeProfileId;
    const today = localDateKey(now); const monday = weekStart(now);
    const daily = state.coinAwards.filter((award) => award.profileId === profileId && localDateKey(award.awardedAt) === today).reduce((sum, award) => sum + award.amount, 0);
    const weekly = state.coinAwards.filter((award) => award.profileId === profileId && award.awardedAt >= monday).reduce((sum, award) => sum + award.amount, 0);
    const allowed = Math.max(0, Math.min(Math.floor(requested), 200 - daily, 1000 - weekly));
    if (allowed > 0) set({ coinAwards: [{ id: crypto.randomUUID(), profileId, amount: allowed, reason, awardedAt: now }, ...state.coinAwards].slice(0, 1000) });
    return allowed;
  },
}), {
  name: 'novastars_parent_zone_v1', version: 2,
  migrate: (persisted) => {
    const value = persisted && typeof persisted === 'object' ? { ...(persisted as Record<string, unknown>) } : {};
    delete value.lastUsageTick;
    value.schemaVersion = 2;
    if (value.limits && typeof value.limits === 'object') value.limits = Object.fromEntries(Object.entries(value.limits as Record<string, Partial<ChildLimits>>).map(([id, limits]) => [id, normalizeChildLimits(limits)]));
    if (value.usage && typeof value.usage === 'object') value.usage = Object.fromEntries(Object.entries(value.usage as Record<string, Partial<DailyUsage>>).map(([key, usage]) => [key, normalizeDailyUsage(usage, key.slice(key.lastIndexOf(':') + 1))]));
    if (Array.isArray(value.missions)) value.missions = value.missions.filter((mission): mission is Record<string, unknown> => Boolean(mission && typeof mission === 'object')).map((mission) => {
      const id = typeof mission.id === 'string' ? mission.id : crypto.randomUUID();
      const difficulty = ['easy', 'medium', 'hard', 'challenge'].includes(String(mission.difficulty)) ? mission.difficulty : 'easy';
      const rewardByDifficulty = { easy: 50, medium: 100, hard: 150, challenge: 200 } as const;
      return {
        ...mission,
        id,
        rewardRequestId: typeof mission.rewardRequestId === 'string' ? mission.rewardRequestId : `mission:${id}`,
        contentMissionId: typeof mission.contentMissionId === 'string' ? mission.contentMissionId : `legacy:${String(mission.sourceLessonId ?? id)}`,
        difficulty,
        fixedCoinReward: [50, 100, 150, 200].includes(Number(mission.fixedCoinReward)) ? Number(mission.fixedCoinReward) : rewardByDifficulty[difficulty as keyof typeof rewardByDifficulty],
      };
    });
    const clockGuard = value.clockGuard && typeof value.clockGuard === 'object' ? value.clockGuard as Partial<ClockGuard> : {};
    value.clockGuard = {
      lastObservedAt: typeof clockGuard.lastObservedAt === 'number' && Number.isFinite(clockGuard.lastObservedAt) ? Math.max(0, clockGuard.lastObservedAt) : Date.now(),
      rollbackDetected: clockGuard.rollbackDetected === true,
    };
    return value as unknown as ParentZoneState;
  },
}));

export const getPlayLimitStatus = () => {
  const state = useParentZoneStore.getState();
  const profileId = state.activeProfileId;
  const now = Date.now();
  const limits = state.limits[profileId] ?? DEFAULT_CHILD_LIMITS;
  const usage = state.usage[`${profileId}:${localDateKey(now)}`];
  const status = calculatePlayLimitStatus(now, limits, usage);
  return state.clockGuard.rollbackDetected
    ? { ...status, blocked: true, reason: 'clock_change' as const }
    : status;
};

if (import.meta.env.DEV && typeof window !== 'undefined') (window as any).__parentZoneStore = useParentZoneStore;
