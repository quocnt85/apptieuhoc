import type { AvatarCosmeticSlot } from '../types/personalization';

export type CosmeticRarity = 'COMMON' | 'RARE' | 'EPIC';
export interface AvatarCosmeticItem {
  id: string;
  name: string;
  slot: AvatarCosmeticSlot;
  rarity: CosmeticRarity;
  priceCoins: number;
  visual: { emoji?: string; gradient?: string; frameClass?: string };
}

export const DEFAULT_AVATAR_COSMETICS = [
  'outfit_nova_basic', 'headgear_clear', 'accessory_none', 'frame_orbit', 'background_deep_space',
] as const;

export const DEFAULT_EQUIPPED_COSMETICS: Record<AvatarCosmeticSlot, string> = {
  OUTFIT: 'outfit_nova_basic', HEADGEAR: 'headgear_clear', ACCESSORY: 'accessory_none',
  FRAME: 'frame_orbit', BACKGROUND: 'background_deep_space',
};

export const AVATAR_COSMETICS: readonly AvatarCosmeticItem[] = [
  { id: 'outfit_nova_basic', name: 'Đồng phục Nova', slot: 'OUTFIT', rarity: 'COMMON', priceCoins: 0, visual: { emoji: '🧥' } },
  { id: 'outfit_solar_scout', name: 'Trinh sát Mặt Trời', slot: 'OUTFIT', rarity: 'RARE', priceCoins: 120, visual: { emoji: '🦺' } },
  { id: 'outfit_galaxy_scholar', name: 'Học giả Ngân Hà', slot: 'OUTFIT', rarity: 'EPIC', priceCoins: 180, visual: { emoji: '🥼' } },
  { id: 'headgear_clear', name: 'Không mũ', slot: 'HEADGEAR', rarity: 'COMMON', priceCoins: 0, visual: {} },
  { id: 'headgear_star_helmet', name: 'Mũ Sao Băng', slot: 'HEADGEAR', rarity: 'RARE', priceCoins: 90, visual: { emoji: '🪖' } },
  { id: 'headgear_crown', name: 'Vương miện Tinh Tú', slot: 'HEADGEAR', rarity: 'EPIC', priceCoins: 160, visual: { emoji: '👑' } },
  { id: 'accessory_none', name: 'Không phụ kiện', slot: 'ACCESSORY', rarity: 'COMMON', priceCoins: 0, visual: {} },
  { id: 'accessory_star', name: 'Sao Đồng Hành', slot: 'ACCESSORY', rarity: 'RARE', priceCoins: 70, visual: { emoji: '⭐' } },
  { id: 'accessory_robot', name: 'Robot Mini', slot: 'ACCESSORY', rarity: 'EPIC', priceCoins: 140, visual: { emoji: '🤖' } },
  { id: 'frame_orbit', name: 'Khung Quỹ Đạo', slot: 'FRAME', rarity: 'COMMON', priceCoins: 0, visual: { frameClass: 'border-sky-400 shadow-[0_0_18px_rgba(56,189,248,.45)]' } },
  { id: 'frame_aurora', name: 'Khung Cực Quang', slot: 'FRAME', rarity: 'RARE', priceCoins: 110, visual: { frameClass: 'border-emerald-300 shadow-[0_0_22px_rgba(52,211,153,.55)]' } },
  { id: 'background_deep_space', name: 'Không Gian Sâu', slot: 'BACKGROUND', rarity: 'COMMON', priceCoins: 0, visual: { gradient: 'from-indigo-950 via-purple-950 to-slate-950' } },
  { id: 'background_nebula', name: 'Tinh Vân Kẹo Ngọt', slot: 'BACKGROUND', rarity: 'RARE', priceCoins: 100, visual: { gradient: 'from-fuchsia-800 via-indigo-800 to-cyan-900' } },
] as const;

export const cosmeticById = (id?: string | null) => AVATAR_COSMETICS.find((item) => item.id === id);
