import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChildLimits, ChildProfileLocal, CoinAward, DailyUsage, LearningActivity, RealLifeMission } from '../types/parentZone';

const todayKey = (timestamp = Date.now()) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
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
const defaultLimits: ChildLimits = { dailyMinutes: 30, curfewStart: '21:30', curfewEnd: '06:00' };

type ParentZoneState = {
  schemaVersion: 1;
  profiles: ChildProfileLocal[];
  activeProfileId: string;
  limits: Record<string, ChildLimits>;
  usage: Record<string, DailyUsage>;
  activities: LearningActivity[];
  missions: RealLifeMission[];
  coinAwards: CoinAward[];
  lastUsageTick: number;
  createProfile: (profile: Omit<ChildProfileLocal, 'id' | 'createdAt' | 'childSlotId'> & { childSlotId?: string | null }) => string;
  updateProfile: (id: string, patch: Partial<Pick<ChildProfileLocal, 'name' | 'grade' | 'avatar' | 'photoDataUrl' | 'childSlotId'>>) => void;
  removeProfileLocal: (id: string) => void;
  setActiveProfile: (id: string) => void;
  setLimits: (profileId: string, limits: ChildLimits) => void;
  recordUsageTick: () => void;
  extendToday: (profileId: string) => boolean;
  recordActivity: (activity: Omit<LearningActivity, 'id' | 'profileId' | 'completedAt'>) => void;
  suggestMission: (sourceLessonId: string, title: string) => void;
  markMissionDone: (id: string) => void;
  approveMissionLocal: (id: string, diamonds: number) => void;
  awardCoins: (requested: number, reason: string) => number;
};

export const useParentZoneStore = create<ParentZoneState>()(persist((set, get) => ({
  schemaVersion: 1,
  profiles: [defaultProfile],
  activeProfileId: defaultProfile.id,
  limits: { [defaultProfile.id]: defaultLimits },
  usage: {},
  activities: [],
  missions: [],
  coinAwards: [],
  lastUsageTick: Date.now(),
  createProfile: (profile) => {
    if (get().profiles.length >= 4) throw new Error('Mỗi tài khoản có tối đa 4 hồ sơ trẻ.');
    const id = crypto.randomUUID();
    set((state) => ({
      profiles: [...state.profiles, { ...profile, id, childSlotId: profile.childSlotId ?? null, createdAt: Date.now() }],
      limits: { ...state.limits, [id]: defaultLimits },
    }));
    return id;
  },
  updateProfile: (id, patch) => set((state) => ({ profiles: state.profiles.map((profile) => profile.id === id ? { ...profile, ...patch } : profile) })),
  removeProfileLocal: (id) => set((state) => {
    localStorage.removeItem(`novastars_space_state_profile_${id}`);
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
  setActiveProfile: (id) => { if (get().profiles.some((profile) => profile.id === id)) set({ activeProfileId: id }); },
  setLimits: (profileId, next) => set((state) => ({ limits: { ...state.limits, [profileId]: next } })),
  recordUsageTick: () => {
    const now = Date.now();
    const state = get();
    const elapsedMinutes = Math.min(1, Math.max(0, (now - state.lastUsageTick) / 60_000));
    const key = `${state.activeProfileId}:${todayKey(now)}`;
    const current = state.usage[key] ?? { date: todayKey(now), minutes: 0, extensionsUsed: 0 };
    set({ usage: { ...state.usage, [key]: { ...current, minutes: current.minutes + elapsedMinutes } }, lastUsageTick: now });
  },
  extendToday: (profileId) => {
    const key = `${profileId}:${todayKey()}`;
    const current = get().usage[key] ?? { date: todayKey(), minutes: 0, extensionsUsed: 0 };
    if (current.extensionsUsed >= 2) return false;
    set((state) => ({ usage: { ...state.usage, [key]: { ...current, extensionsUsed: current.extensionsUsed + 1 } } }));
    return true;
  },
  recordActivity: (activity) => set((state) => {
    if (activity.type === 'quiz' && activity.sourceId && state.activities.some((item) => item.profileId === state.activeProfileId && item.type === 'quiz' && item.sourceId === activity.sourceId)) return state;
    return { activities: [{ ...activity, id: crypto.randomUUID(), profileId: state.activeProfileId, completedAt: Date.now() }, ...state.activities].slice(0, 500) };
  }),
  suggestMission: (sourceLessonId, title) => set((state) => {
    if (state.missions.some((mission) => mission.profileId === state.activeProfileId && mission.sourceLessonId === sourceLessonId)) return state;
    return { missions: [{ id: crypto.randomUUID(), profileId: state.activeProfileId, sourceLessonId, title, status: 'suggested', proposedAt: Date.now() }, ...state.missions] };
  }),
  markMissionDone: (id) => set((state) => ({ missions: state.missions.map((mission) => mission.id === id ? { ...mission, status: 'done_by_child', completedAt: Date.now() } : mission) })),
  approveMissionLocal: (id, diamonds) => set((state) => ({ missions: state.missions.map((mission) => mission.id === id ? { ...mission, status: 'approved', approvedAt: Date.now(), diamondsAwarded: diamonds } : mission) })),
  awardCoins: (requested, reason) => {
    const now = Date.now(); const state = get(); const profileId = state.activeProfileId;
    const today = todayKey(now); const monday = weekStart(now);
    const daily = state.coinAwards.filter((award) => award.profileId === profileId && todayKey(award.awardedAt) === today).reduce((sum, award) => sum + award.amount, 0);
    const weekly = state.coinAwards.filter((award) => award.profileId === profileId && award.awardedAt >= monday).reduce((sum, award) => sum + award.amount, 0);
    const allowed = Math.max(0, Math.min(Math.floor(requested), 200 - daily, 1000 - weekly));
    if (allowed > 0) set({ coinAwards: [{ id: crypto.randomUUID(), profileId, amount: allowed, reason, awardedAt: now }, ...state.coinAwards].slice(0, 1000) });
    return allowed;
  },
}), { name: 'novastars_parent_zone_v1', version: 1 }));

export const getPlayLimitStatus = () => {
  const state = useParentZoneStore.getState();
  const profileId = state.activeProfileId;
  const limits = state.limits[profileId] ?? defaultLimits;
  const usage = state.usage[`${profileId}:${todayKey()}`] ?? { minutes: 0, extensionsUsed: 0 };
  const now = new Date(); const minutesNow = now.getHours() * 60 + now.getMinutes();
  const parse = (value: string) => { const [hour, minute] = value.split(':').map(Number); return hour * 60 + minute; };
  const start = parse(limits.curfewStart); const end = parse(limits.curfewEnd);
  const inCurfew = start > end ? minutesNow >= start || minutesNow < end : minutesNow >= start && minutesNow < end;
  const allowedMinutes = limits.dailyMinutes + usage.extensionsUsed * 15;
  return { blocked: inCurfew || usage.minutes >= allowedMinutes, reason: inCurfew ? 'curfew' as const : 'daily_limit' as const, usedMinutes: Math.floor(usage.minutes), allowedMinutes, extensionsUsed: usage.extensionsUsed };
};
