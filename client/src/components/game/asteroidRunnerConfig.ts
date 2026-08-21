import { SHIPS_DATA } from '../../data/shipsData';

export type RunnerShipId = 'explorer_v1' | 'falcon_apex' | 'solar_phoenix' | 'starlight_runner' | 'astral_shuttle' | 'chuong_duong' | 'son_tinh' | 'thanh_giong';
export type WeaponKind = 'single' | 'twin' | 'piercing' | 'charge' | 'cluster' | 'spread' | 'missile' | 'homing';
export type AsteroidTier = 'debris' | 'small' | 'medium' | 'large' | 'huge' | 'titan';
export type AsteroidMaterial = 'rock' | 'hard' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type RunnerPowerUp = 'heal' | 'slow' | 'orbiter' | 'attack_speed' | 'move_speed' | 'damage' | 'blackhole' | 'phase' | 'team' | 'mid_wormhole';

export interface WeaponConfig {
  id: string;
  name: string;
  shortName: string;
  kind: WeaponKind;
  damage: number;
  fireInterval: number;
  projectileSpeed: number;
  color: string;
  aoe: number;
  piercing?: number;
  homingStrength?: number;
  autoDetonateDistance?: number;
}

export interface RunnerShipConfig {
  id: RunnerShipId;
  name: string;
  nameVi: string;
  icon: string;
  speed: number;
  shield: number;
  power: number;
  totalPower: number;
  weapon: WeaponConfig;
}

const WEAPONS: Record<RunnerShipId, WeaponConfig> = {
  explorer_v1: {
    id: 'W1', name: 'Đạn Đơn Plasma', shortName: 'PLASMA', kind: 'single',
    damage: 11, fireInterval: 0.21, projectileSpeed: 13.5, color: '#55f6ff', aoe: 0,
  },
  falcon_apex: {
    id: 'W2', name: 'Đạn Đôi Lượng Tử', shortName: 'TWIN', kind: 'twin',
    damage: 8.5, fireInterval: 0.24, projectileSpeed: 12.5, color: '#b66cff', aoe: 0,
  },
  solar_phoenix: {
    id: 'W5', name: 'Bom Chùm Sao', shortName: 'CLUSTER', kind: 'cluster',
    damage: 40, fireInterval: 0.38, projectileSpeed: 9.2, color: '#ffd84f', aoe: 1.35, autoDetonateDistance: 4.1,
  },
  starlight_runner: {
    id: 'W6', name: 'Đạn Rẻ Quạt', shortName: 'SPREAD', kind: 'spread',
    damage: 5.5, fireInterval: 0.27, projectileSpeed: 13.2, color: '#48ffbd', aoe: 0,
  },
  astral_shuttle: {
    id: 'W7', name: 'Tên Lửa Nova', shortName: 'MISSILE', kind: 'missile',
    damage: 25, fireInterval: 0.29, projectileSpeed: 10.8, color: '#ff824d', aoe: 0.85,
  },
  chuong_duong: {
    id: 'W3', name: 'Laser Xuyên Thấu', shortName: 'PIERCE', kind: 'piercing',
    damage: 17, fireInterval: 0.25, projectileSpeed: 11.6, color: '#55eaff', aoe: 0, piercing: 24,
  },
  son_tinh: {
    id: 'W4', name: 'Plasma Tích Năng', shortName: 'CHARGE', kind: 'charge',
    damage: 62, fireInterval: 0.7, projectileSpeed: 7.2, color: '#fbbf24', aoe: 0.72,
  },
  thanh_giong: {
    id: 'W8', name: 'Tên Lửa Tầm Nhiệt', shortName: 'HOMING', kind: 'homing',
    damage: 28, fireInterval: 0.28, projectileSpeed: 9.8, color: '#b98cff', aoe: 0.78, homingStrength: 4.8,
  },
};

const FLEET_IDS: RunnerShipId[] = ['explorer_v1', 'starlight_runner', 'chuong_duong', 'falcon_apex', 'astral_shuttle', 'son_tinh', 'thanh_giong', 'solar_phoenix'];

export const RUNNER_SHIPS: RunnerShipConfig[] = FLEET_IDS.map((id) => {
  const ship = SHIPS_DATA.find((item) => item.id === id);
  if (!ship) throw new Error(`Missing fleet ship config: ${id}`);
  return {
    id,
    name: ship.name,
    nameVi: ship.nameVi,
    icon: ship.icon,
    speed: ship.speed,
    shield: ship.shield,
    power: ship.power,
    totalPower: ship.totalPower,
    weapon: WEAPONS[id],
  };
});

export const RUNNER_BALANCE = {
  stageDurationSeconds: 78,
  bossEntrySeconds: 2.2,
  wormholeTimeoutSeconds: 6,
  victoryBonusCoins: 12,
  victoryRewardCap: 45,
  runCoinCap: 32,
  retryEnergyCost: 10,
  continueEnergyCost: 15,
  worldHalfWidth: 4.75,
  worldBottom: -8.2,
  worldTop: 8.2,
  maxAsteroids: 22,
  maxBullets: 72,
  maxBursts: 28,
  playerVisualScale: 0.72,
  playerHitRadius: 0.44,
  playerInvulnerableSeconds: 0.72,
  lowHpAssistThreshold: 0.38,
  pickupMagnetRadius: 2.15,
  bossHp: 1800,
} as const;

export const ASTEROID_STATS: Record<AsteroidTier, { radius: number; hpFactor: number; speed: number; damage: number; coins: number }> = {
  debris: { radius: 0.25, hpFactor: 0.512, speed: 3.15, damage: 10, coins: 0 },
  small: { radius: 0.48, hpFactor: 0.64, speed: 2.55, damage: 15, coins: 1 },
  medium: { radius: 0.82, hpFactor: 0.8, speed: 2.05, damage: 25, coins: 1 },
  large: { radius: 1.18, hpFactor: 1, speed: 1.48, damage: 35, coins: 2 },
  huge: { radius: 1.62, hpFactor: 1.25, speed: 1.08, damage: 100, coins: 3 },
  titan: { radius: 5.65, hpFactor: 1, speed: 0.48, damage: 100, coins: 6 },
};

export const MATERIAL_STATS: Record<AsteroidMaterial, { label: string; baseHp: number; color: string; emissive: string }> = {
  rock: { label: 'Đá Sao', baseHp: 14, color: '#6f7891', emissive: '#111827' },
  hard: { label: 'Đá Cứng', baseHp: 28, color: '#8a5f4c', emissive: '#2b1008' },
  silver: { label: 'Khoáng Bạc', baseHp: 56, color: '#b9c7d8', emissive: '#26384c' },
  gold: { label: 'Khoáng Vàng', baseHp: 112, color: '#e7ad32', emissive: '#6b3808' },
  platinum: { label: 'Bạch Kim', baseHp: 224, color: '#a8e5df', emissive: '#185e69' },
  diamond: { label: 'Kim Cương', baseHp: 448, color: '#8f72ed', emissive: '#351884' },
};

export const getRunnerShip = (shipId: string): RunnerShipConfig => (
  RUNNER_SHIPS.find((ship) => ship.id === shipId) || RUNNER_SHIPS[0]
);

export const getDamageMultiplier = (ship: RunnerShipConfig) => 0.78 + ship.power / 210;
export const getMoveSpeed = (ship: RunnerShipConfig) => 5.8 + ship.speed * 0.037;
export const getResponsiveness = (ship: RunnerShipConfig) => 7.5 + ship.speed * 0.055;
