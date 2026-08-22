import type { DomainId, MissionDifficulty } from './index';

export type ChildGrade = 1 | 2 | 3 | 4 | 5;

export interface ChildProfileLocal {
  id: string;
  childSlotId: string | null;
  name: string;
  grade?: ChildGrade;
  avatar: string;
  /** Legacy v1 migration input only. New photos are files managed by personalization storage. */
  photoDataUrl?: string;
  createdAt: number;
}

export interface ChildLimits {
  dailyMinutes: number;
  curfewStart: string;
  curfewEnd: string;
}

export interface DailyUsage {
  date: string;
  minutes: number;
  extensionsUsed: number;
  byCategory?: Record<UsageCategory, number>;
}

export type UsageCategory = 'lesson' | 'minigame' | 'exploration';

export interface LearningActivity {
  id: string;
  profileId: string;
  type: 'lesson' | 'quiz' | 'minigame';
  title: string;
  sourceId?: string;
  domainId?: DomainId;
  score?: number;
  completedAt: number;
}

export interface RealLifeMission {
  id: string;
  rewardRequestId: string;
  profileId: string;
  sourceLessonId: string;
  contentMissionId: string;
  title: string;
  difficulty: MissionDifficulty;
  fixedCoinReward: 50 | 100 | 150 | 200;
  status: 'suggested' | 'done_by_child' | 'approved';
  proposedAt: number;
  completedAt?: number;
  approvedAt?: number;
  diamondsAwarded?: number;
  novaCoinsAwarded?: number;
}

export interface CoinAward {
  id: string;
  profileId: string;
  amount: number;
  reason: string;
  awardedAt: number;
}
