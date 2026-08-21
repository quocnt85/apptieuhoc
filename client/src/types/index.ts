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

export type BgmStyle = 'ambient' | 'adventure';

export interface GameSettings {
  audioSettingsVersion: 2;
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  hapticEnabled: boolean;
  bgmStyle: BgmStyle;
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

export interface MoonData {
  id: string;
  name: string;
  nameVi: string;
  size: number; // e.g. 0.05 to 0.18
  distance: number; // e.g. 2.0 to 3.8
  orbitSpeed: number; // e.g. 0.005 to 0.015 (chiều thuận hoặc nghịch)
  orbitTilt: [number, number, number]; // [x, y, z] tilt radians
  color: string;
  textureType: 'crater' | 'ice_cracked' | 'lava_rock' | 'crystal' | 'metallic';
  hasOrbitTrack?: boolean;
  orbitTrackColor?: string;
  glowColor?: string;
}

export interface PlanetCloudConfig {
  hasClouds: boolean;
  cloudType: 'terrestrial_cumulus' | 'tropical_cyclones' | 'aurora_mist' | 'volcanic_ash_smoke' | 'none';
  color?: string; // '#ffffff', '#1e293b' (tro núi lửa), '#7dd3fc' (băng cực quang)
  opacity?: number; // 0.2 to 0.8
  speed?: number; // Tốc độ quay của mây
}

export interface PlanetRingConfig {
  hasRings: boolean;
  innerRadius: number; // e.g. 1.45
  outerRadius: number; // e.g. 2.45
  primaryColor: string;
  secondaryColor?: string;
  tiltOffset?: number; // Độ lệch góc nghiêng
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
  ringConfig?: PlanetRingConfig;
  hasMoon?: boolean;
  moonColor?: string;
  moonDistance?: number;
  moons?: MoonData[];
  cloudConfig?: PlanetCloudConfig;
  diameterKm?: number;
  surfaceTemp?: string;
  gravity?: string;
  geologyHighlights?: string[];
  unlockRequirement?: {
    requiredStars?: number;
    requiredBossNodeId?: string;
    descriptionVi: string;
  };
  nodes: PlanetCoordinateNode[];
}

