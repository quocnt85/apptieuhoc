import type { DomainId } from './index';

export type ChildGrade = 1 | 2 | 3 | 4 | 5;

export interface ChildProfileLocal {
  id: string;
  childSlotId: string | null;
  name: string;
  grade?: ChildGrade;
  avatar: string;
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
}

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
  profileId: string;
  sourceLessonId: string;
  title: string;
  status: 'suggested' | 'done_by_child' | 'approved';
  proposedAt: number;
  completedAt?: number;
  approvedAt?: number;
  diamondsAwarded?: number;
}

export interface CoinAward {
  id: string;
  profileId: string;
  amount: number;
  reason: string;
  awardedAt: number;
}
