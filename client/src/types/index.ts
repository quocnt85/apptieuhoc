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

export interface CustomizationState {
  equippedShip: string; // 'explorer_v1' | 'falcon_apex' | 'solar_phoenix' | 'starlight_runner' | 'astral_shuttle'
  equippedColor: string; // '#38bdf8' | '#f59e0b' | '#ef4444' | '#10b981' | '#8b5cf6'
  hasVietnamFlag: boolean;
  unlockedShips: string[];
  unlockedColors: string[];
  unlockedAccessories: string[];
  unlockedAvatars: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  grade: number;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  energy: number; // Max 50
  maxEnergy: number; // 50
  lastEnergyTimestamp: number;
  novaCoins: number; // Xu Nova
  diamonds: number; // Kim Cương
  gems: number; // Alias for diamonds / legacy
  stars: number;
  streakDays: number;
  lastActiveDate: string;
  doubleRegenUntil?: number; // timestamp
  freeBossPassCount: number;
  customization: CustomizationState;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  parentPin: string;
  dailyTimeLimitMinutes: number;
  todayPlayedMinutes: number;
}

export type ActiveTab = 'home' | 'planet' | 'hangar' | 'profile' | 'showroom' | 'minigame' | 'world' | 'explore' | 'practice' | 'parent' | 'settings';

export interface DomainProgress {
  domainId: DomainId;
  masteryPercentage: number;
  questionsAnswered: number;
  totalQuestions: number;
  streak: number;
}

export interface PlanetCoordinateNode {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  lat: number; // Latitude in radians (-PI/2 to PI/2)
  lon: number; // Longitude in radians (-PI to PI)
  starsRequiredToUnlock?: number;
  isBoss?: boolean;
  bossHp?: number;
  rewardCoins: number;
  rewardXp: number;
  domainId: DomainId;
}

export interface PlanetData {
  id: string;
  name: string;
  nameVi: string;
  titleVi: string;
  description: string;
  type: 'terrestrial' | 'ocean' | 'gas_giant' | 'ice' | 'magma';
  color: string;
  glowColor: string;
  atmosphereColor: string;
  tiltAngle: number; // e.g. 0.41 radians (~23.5 deg)
  rotationSpeed: number;
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringColor?: string;
  hasMoon?: boolean;
  moonColor?: string;
  moonDistance?: number;
  diameterKm?: number;
  surfaceTemp?: string;
  gravity?: string;
  geologyHighlights?: string[];
  nodes: PlanetCoordinateNode[];
}
