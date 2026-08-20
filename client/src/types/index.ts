export type DomainId = 
  | 'DOM-FIN' // Tài chính & Quản lý tài nguyên
  | 'DOM-SEL' // Cảm xúc & Xã hội
  | 'DOM-CRT' // Tư duy phản biện & Giải quyết vấn đề
  | 'DOM-DIG' // Công dân số & An toàn mạng
  | 'DOM-HAB'; // Tự quản lý & Thói quen hàng ngày

export interface DomainInfo {
  id: DomainId;
  name: string;
  nameVi: string;
  icon: string;
  color: string;
  accentBg: string;
  description: string;
  subdomainCount: number;
}

export type QuestionType = 'single_choice' | 'multiple_choice' | 'scenario' | 'sorting' | 'true_false';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
  scoreBonus?: number;
}

export interface QuestionItem {
  id: string;
  domainId: DomainId;
  subdomainId: string;
  domainNameVi: string;
  subdomainNameVi: string;
  gradeLevel: 1 | 2 | 3 | 4 | 5;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  situation: string;
  characterDialogue?: string;
  questionType: QuestionType;
  options: QuestionOption[];
  advice: string;
  realLifeTask?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  grade: number;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  energy: number;
  maxEnergy: number;
  gems: number;
  stars: number;
  streakDays: number;
  lastActiveDate: string;
}

export interface DomainProgress {
  domainId: DomainId;
  masteryPercentage: number;
  questionsAnswered: number;
  totalQuestions: number;
  streak: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  parentPin: string;
  dailyTimeLimitMinutes: number;
  todayPlayedMinutes: number;
}

export type ActiveTab = 'world' | 'explore' | 'practice' | 'parent' | 'settings';
