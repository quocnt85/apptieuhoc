import { SHIPS_DATA } from '../../data/shipsData';

export type RunnerShipId = 'explorer_v1' | 'falcon_apex' | 'solar_phoenix' | 'starlight_runner' | 'astral_shuttle';
export type WeaponKind = 'single' | 'twin' | 'cluster' | 'spread' | 'missile';
export type AsteroidTier = 'small' | 'medium' | 'large' | 'titan';
export type AsteroidMaterial = 'rock' | 'hard' | 'crystal';
export type RunnerPowerUp = 'heal' | 'slow' | 'orbiter';

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
}

export interface RunnerShipConfig {
  id: RunnerShipId;
  name: string;
  nameVi: string;
  icon: string;
  speed: number;
  shield: number;
  power: number;
  weapon: WeaponConfig;
}

const WEAPONS: Record<RunnerShipId, WeaponConfig> = {
  explorer_v1: {
    id: 'W1', name: 'Đạn Đơn Plasma', shortName: 'PLASMA', kind: 'single',
    damage: 15, fireInterval: 0.18, projectileSpeed: 13.5, color: '#55f6ff', aoe: 0,
  },
  falcon_apex: {
    id: 'W2', name: 'Đạn Đôi Lượng Tử', shortName: 'TWIN', kind: 'twin',
    damage: 10, fireInterval: 0.22, projectileSpeed: 12.5, color: '#b66cff', aoe: 0,
  },
  solar_phoenix: {
    id: 'W5', name: 'Bom Chùm Sao', shortName: 'CLUSTER', kind: 'cluster',
    damage: 28, fireInterval: 0.5, projectileSpeed: 9.2, color: '#ffd84f', aoe: 1.35,
  },
  starlight_runner: {
    id: 'W6', name: 'Đạn Rẻ Quạt', shortName: 'SPREAD', kind: 'spread',
    damage: 8, fireInterval: 0.2, projectileSpeed: 13.2, color: '#48ffbd', aoe: 0,
  },
  astral_shuttle: {
    id: 'W7', name: 'Tên Lửa Nova', shortName: 'MISSILE', kind: 'missile',
    damage: 25, fireInterval: 0.32, projectileSpeed: 10.8, color: '#ff824d', aoe: 0.85,
  },
};

const MVP_IDS: RunnerShipId[] = ['explorer_v1', 'falcon_apex', 'solar_phoenix', 'starlight_runner', 'astral_shuttle'];

export const RUNNER_SHIPS: RunnerShipConfig[] = MVP_IDS.map((id) => {
  const ship = SHIPS_DATA.find((item) => item.id === id);
  if (!ship) throw new Error(`Missing MVP ship config: ${id}`);
  return {
    id,
    name: ship.name,
    nameVi: ship.nameVi,
    icon: ship.icon,
    speed: ship.speed,
    shield: ship.shield,
    power: ship.power,
    weapon: WEAPONS[id],
  };
});

export const RUNNER_BALANCE = {
  stageDurationSeconds: 78,
  bossEntrySeconds: 2.2,
  wormholeTimeoutSeconds: 6,
  victoryBonusCoins: 30,
  runCoinCap: 120,
  retryEnergyCost: 10,
  continueEnergyCost: 10,
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
  bossHp: 1650,
} as const;

export const ASTEROID_STATS: Record<AsteroidTier, { radius: number; hp: number; speed: number; damage: number; coins: number }> = {
  small: { radius: 0.48, hp: 20, speed: 2.55, damage: 10, coins: 1 },
  medium: { radius: 0.82, hp: 58, speed: 2.05, damage: 18, coins: 2 },
  large: { radius: 1.18, hp: 138, speed: 1.48, damage: 28, coins: 4 },
  titan: { radius: 3.35, hp: RUNNER_BALANCE.bossHp, speed: 0.7, damage: 100, coins: 30 },
};

export const MATERIAL_STATS: Record<AsteroidMaterial, { label: string; hpMultiplier: number; color: string; emissive: string }> = {
  rock: { label: 'Đá Sao', hpMultiplier: 1, color: '#6f7891', emissive: '#111827' },
  hard: { label: 'Đá Cứng', hpMultiplier: 1.5, color: '#8a5f4c', emissive: '#2b1008' },
  crystal: { label: 'Tinh Thể', hpMultiplier: 2.05, color: '#7a54d8', emissive: '#351884' },
};

export const getRunnerShip = (shipId: string): RunnerShipConfig => (
  RUNNER_SHIPS.find((ship) => ship.id === shipId) || RUNNER_SHIPS[0]
);

export const getDamageMultiplier = (ship: RunnerShipConfig) => 0.78 + ship.power / 210;
export const getMoveSpeed = (ship: RunnerShipConfig) => 5.8 + ship.speed * 0.037;
export const getResponsiveness = (ship: RunnerShipConfig) => 7.5 + ship.speed * 0.055;
