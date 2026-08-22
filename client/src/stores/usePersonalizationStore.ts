import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  PERSONALIZATION_SCHEMA_VERSION,
  type ChildPersonalization,
  type AvatarCosmeticSlot,
  type FlagReviewStatus,
  type LocalMediaAsset,
} from '../types/personalization';
import { DEFAULT_AVATAR_COSMETICS, DEFAULT_EQUIPPED_COSMETICS } from '../data/avatarCosmetics';

const STORAGE_KEY = 'novastars_personalization_v3';

const emptyChild = (childId: string): ChildPersonalization => ({
  childId,
  avatarAssetId: null,
  avatarMode: 'PRESET',
  flagAssetId: null,
  flagReviewStatus: 'NONE',
  flagReviewNote: null,
  unlockedCosmeticIds: [...DEFAULT_AVATAR_COSMETICS],
  equippedCosmetics: { ...DEFAULT_EQUIPPED_COSMETICS },
  updatedAt: Date.now(),
});

const normalizeChild = (childId: string, current?: Partial<ChildPersonalization>): ChildPersonalization => {
  const defaults = emptyChild(childId);
  return {
    ...defaults,
    ...current,
    unlockedCosmeticIds: Array.isArray(current?.unlockedCosmeticIds)
      ? [...new Set([...DEFAULT_AVATAR_COSMETICS, ...current.unlockedCosmeticIds])]
      : defaults.unlockedCosmeticIds,
    equippedCosmetics: { ...defaults.equippedCosmetics, ...(current?.equippedCosmetics ?? {}) },
  };
};

const validateAssetMetadata = (asset: LocalMediaAsset) => {
  if (!asset.id || !asset.childId || !asset.relativePath) throw new Error('Media metadata is incomplete.');
  if (asset.relativePath.startsWith('data:') || asset.relativePath.includes(';base64,')) {
    throw new Error('Binary or Base64 media cannot be persisted in Zustand.');
  }
  if (!Number.isFinite(asset.byteSize) || asset.byteSize < 0) throw new Error('Invalid media byte size.');
};

interface PersonalizationState {
  schemaVersion: typeof PERSONALIZATION_SCHEMA_VERSION;
  assets: LocalMediaAsset[];
  children: Record<string, ChildPersonalization>;
  legacyMigrationCompleted: boolean;
  registerAsset: (asset: LocalMediaAsset) => void;
  replaceAssetMetadata: (previousAssetId: string | null, asset: LocalMediaAsset) => void;
  removeAssetMetadata: (assetId: string) => void;
  removeMissingAssets: (assetIds: string[]) => void;
  setAvatarAsset: (childId: string, assetId: string | null) => void;
  setAvatarMode: (childId: string, mode: ChildPersonalization['avatarMode']) => void;
  setFlagReview: (childId: string, status: FlagReviewStatus, assetId?: string | null, note?: string | null) => void;
  unlockCosmetic: (childId: string, itemId: string) => void;
  equipCosmetic: (childId: string, slot: AvatarCosmeticSlot, itemId: string) => boolean;
  clearChildMetadata: (childId: string) => void;
  markLegacyMigrationCompleted: () => void;
}

const clearReferences = (children: Record<string, ChildPersonalization>, removed: Set<string>) => Object.fromEntries(
  Object.entries(children).map(([childId, child]) => [childId, {
    ...child,
    avatarAssetId: child.avatarAssetId && removed.has(child.avatarAssetId) ? null : child.avatarAssetId,
    flagAssetId: child.flagAssetId && removed.has(child.flagAssetId) ? null : child.flagAssetId,
    flagReviewStatus: child.flagAssetId && removed.has(child.flagAssetId) ? 'NONE' : child.flagReviewStatus,
    flagReviewNote: child.flagAssetId && removed.has(child.flagAssetId) ? null : child.flagReviewNote,
  }]),
);

export const usePersonalizationStore = create<PersonalizationState>()(persist((set) => ({
  schemaVersion: PERSONALIZATION_SCHEMA_VERSION,
  assets: [],
  children: {},
  legacyMigrationCompleted: false,
  registerAsset: (asset) => {
    validateAssetMetadata(asset);
    set((state) => ({ assets: [...state.assets.filter((item) => item.id !== asset.id), asset] }));
  },
  replaceAssetMetadata: (previousAssetId, asset) => {
    validateAssetMetadata(asset);
    set((state) => {
      const removed = previousAssetId ? new Set([previousAssetId]) : new Set<string>();
      return {
        assets: [...state.assets.filter((item) => item.id !== asset.id && item.id !== previousAssetId), asset],
        children: clearReferences(state.children, removed),
      };
    });
  },
  removeAssetMetadata: (assetId) => set((state) => ({
    assets: state.assets.filter((item) => item.id !== assetId),
    children: clearReferences(state.children, new Set([assetId])),
  })),
  removeMissingAssets: (assetIds) => set((state) => {
    const removed = new Set(assetIds);
    return {
      assets: state.assets.filter((item) => !removed.has(item.id)),
      children: clearReferences(state.children, removed),
    };
  }),
  setAvatarAsset: (childId, assetId) => set((state) => ({
    children: {
      ...state.children,
      [childId]: { ...(state.children[childId] ?? emptyChild(childId)), avatarAssetId: assetId, avatarMode: assetId ? 'PHOTO' : 'PRESET', updatedAt: Date.now() },
    },
  })),
  setAvatarMode: (childId, mode) => set((state) => ({ children: { ...state.children, [childId]: { ...(state.children[childId] ?? emptyChild(childId)), avatarMode: mode, updatedAt: Date.now() } } })),
  setFlagReview: (childId, status, assetId, note = null) => set((state) => ({
    children: {
      ...state.children,
      [childId]: {
        ...(state.children[childId] ?? emptyChild(childId)),
        flagAssetId: assetId === undefined ? state.children[childId]?.flagAssetId ?? null : assetId,
        flagReviewStatus: status,
        flagReviewNote: note,
        updatedAt: Date.now(),
      },
    },
  })),
  unlockCosmetic: (childId, itemId) => set((state) => {
    const child = normalizeChild(childId, state.children[childId]);
    return { children: { ...state.children, [childId]: { ...child, unlockedCosmeticIds: child.unlockedCosmeticIds.includes(itemId) ? child.unlockedCosmeticIds : [...child.unlockedCosmeticIds, itemId], updatedAt: Date.now() } } };
  }),
  equipCosmetic: (childId, slot, itemId) => {
    let equipped = false;
    set((state) => {
      const child = normalizeChild(childId, state.children[childId]);
      if (!child.unlockedCosmeticIds.includes(itemId)) return state;
      equipped = true;
      return { children: { ...state.children, [childId]: { ...child, equippedCosmetics: { ...child.equippedCosmetics, [slot]: itemId }, updatedAt: Date.now() } } };
    });
    return equipped;
  },
  clearChildMetadata: (childId) => set((state) => {
    const children = { ...state.children };
    delete children[childId];
    return { children, assets: state.assets.filter((asset) => asset.childId !== childId) };
  }),
  markLegacyMigrationCompleted: () => set({ legacyMigrationCompleted: true }),
}), {
  name: STORAGE_KEY,
  version: PERSONALIZATION_SCHEMA_VERSION,
  storage: createJSONStorage(() => localStorage),
  migrate: (persisted) => {
    const value = (persisted && typeof persisted === 'object' ? persisted : {}) as Partial<PersonalizationState>;
    return {
      ...value,
      schemaVersion: PERSONALIZATION_SCHEMA_VERSION,
      assets: Array.isArray(value.assets) ? value.assets.filter((asset) => {
        try { validateAssetMetadata(asset); return true; } catch { return false; }
      }) : [],
      children: value.children && typeof value.children === 'object' ? Object.fromEntries(Object.entries(value.children).map(([childId, child]) => [childId, normalizeChild(childId, child as Partial<ChildPersonalization>)])) : {},
      legacyMigrationCompleted: Boolean(value.legacyMigrationCompleted),
    } as PersonalizationState;
  },
  partialize: (state) => ({
    schemaVersion: state.schemaVersion,
    assets: state.assets,
    children: state.children,
    legacyMigrationCompleted: state.legacyMigrationCompleted,
  }),
  merge: (persisted, current) => {
    const value = (persisted && typeof persisted === 'object' ? persisted : {}) as Partial<PersonalizationState>;
    return {
      ...current,
      ...value,
      children: value.children && typeof value.children === 'object'
        ? Object.fromEntries(Object.entries(value.children).map(([childId, child]) => [childId, normalizeChild(childId, child)]))
        : current.children,
    } as PersonalizationState;
  },
}));

export const PERSONALIZATION_STORAGE_KEY = STORAGE_KEY;
