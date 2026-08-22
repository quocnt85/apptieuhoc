import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  PERSONALIZATION_SCHEMA_VERSION,
  type ChildPersonalization,
  type FlagReviewStatus,
  type LocalMediaAsset,
} from '../types/personalization';

const STORAGE_KEY = 'novastars_personalization_v3';

const emptyChild = (childId: string): ChildPersonalization => ({
  childId,
  avatarAssetId: null,
  flagAssetId: null,
  flagReviewStatus: 'NONE',
  flagReviewNote: null,
  updatedAt: Date.now(),
});

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
  setFlagReview: (childId: string, status: FlagReviewStatus, assetId?: string | null, note?: string | null) => void;
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
      [childId]: { ...(state.children[childId] ?? emptyChild(childId)), avatarAssetId: assetId, updatedAt: Date.now() },
    },
  })),
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
      children: value.children && typeof value.children === 'object' ? value.children : {},
      legacyMigrationCompleted: Boolean(value.legacyMigrationCompleted),
    } as PersonalizationState;
  },
  partialize: (state) => ({
    schemaVersion: state.schemaVersion,
    assets: state.assets,
    children: state.children,
    legacyMigrationCompleted: state.legacyMigrationCompleted,
  }),
}));

export const PERSONALIZATION_STORAGE_KEY = STORAGE_KEY;
