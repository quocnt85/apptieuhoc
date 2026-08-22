import { PERSONALIZATION_FEATURE_FLAGS } from '../../config/personalizationFeatureFlags';
import { useParentZoneStore } from '../../stores/useParentZoneStore';
import { usePersonalizationStore } from '../../stores/usePersonalizationStore';
import type { LocalMediaAsset, MediaAssetKind, ProcessedImage } from '../../types/personalization';
import { dataUrlToBlob, processLocalImage } from './imageProcessing';
import { getMediaStorage } from './mediaStorage';

export const saveProcessedMedia = async (
  childId: string,
  kind: MediaAssetKind,
  image: ProcessedImage,
  previousAssetId: string | null = null,
) => {
  const storage = getMediaStorage(); const assetId = crypto.randomUUID(); const now = Date.now();
  const stored = await storage.write(image, { childId, assetId, kind });
  const asset: LocalMediaAsset = {
    id: assetId, childId, kind, relativePath: stored.relativePath, storageArea: stored.area,
    mimeType: image.mimeType, width: image.width, height: image.height, byteSize: stored.byteSize,
    createdAt: now, updatedAt: now,
  };
  const store = usePersonalizationStore.getState();
  try {
    store.registerAsset(asset);
    if (kind === 'AVATAR_SOURCE') store.setAvatarAsset(childId, assetId);
    if (kind === 'FLAG_SOURCE') store.setFlagReview(childId, 'DRAFT_LOCAL', assetId);
    if (previousAssetId) {
      const previous = usePersonalizationStore.getState().assets.find((item) => item.id === previousAssetId);
      store.removeAssetMetadata(previousAssetId);
      if (previous) await storage.delete(previous.relativePath).catch(() => undefined);
    }
    return asset;
  } catch (error) {
    await storage.delete(stored.relativePath).catch(() => undefined);
    throw error;
  }
};

export const deleteMediaAsset = async (assetId: string) => {
  const asset = usePersonalizationStore.getState().assets.find((item) => item.id === assetId);
  if (!asset) return;
  await getMediaStorage().delete(asset.relativePath);
  usePersonalizationStore.getState().removeAssetMetadata(assetId);
};

export const clearChildPersonalizationData = async (childId: string) => {
  const result = await getMediaStorage().clearChild(childId);
  usePersonalizationStore.getState().clearChildMetadata(childId);
  return result;
};

export const reconcileChildMedia = async (childId: string) => {
  const storage = getMediaStorage();
  const state = usePersonalizationStore.getState();
  const metadata = state.assets.filter((asset) => asset.childId === childId);
  const physical = new Set(await storage.list(childId));
  const expected = new Set(metadata.map((asset) => asset.relativePath));
  const missing = metadata.filter((asset) => !physical.has(asset.relativePath)).map((asset) => asset.id);
  if (missing.length) state.removeMissingAssets(missing);
  for (const orphan of physical) if (!expected.has(orphan)) await storage.delete(orphan).catch(() => undefined);
  return { missingMetadataReferences: missing.length, deletedOrphans: [...physical].filter((path) => !expected.has(path)).length };
};

const migrateInlineProfilePhotos = async () => {
  const personalization = usePersonalizationStore.getState();
  if (personalization.legacyMigrationCompleted) return;
  const parentState = useParentZoneStore.getState();
  let completed = true;
  for (const profile of parentState.profiles) {
    if (!profile.photoDataUrl) continue;
    try {
      const processed = await processLocalImage(dataUrlToBlob(profile.photoDataUrl), { aspectRatio: 3 / 4, maxWidth: 768, maxHeight: 1024 });
      const current = usePersonalizationStore.getState().children[profile.id]?.avatarAssetId ?? null;
      await saveProcessedMedia(profile.id, 'AVATAR_SOURCE', processed, current);
      parentState.updateProfile(profile.id, { photoDataUrl: undefined });
    } catch {
      // Keep the legacy value if conversion fails so a family does not lose its image.
      completed = false;
    }
  }
  if (completed) usePersonalizationStore.getState().markLegacyMigrationCompleted();
};

export const initializePersonalizationFoundation = async (activeChildId: string) => {
  if (!PERSONALIZATION_FEATURE_FLAGS.localMediaFoundation) return;
  await migrateInlineProfilePhotos();
  await getMediaStorage().clearExpiredExports(Date.now());
  await reconcileChildMedia(activeChildId);
};

export const clearAllPersonalizationData = async () => {
  const state = usePersonalizationStore.getState();
  const childIds = new Set([...Object.keys(state.children), ...state.assets.map((asset) => asset.childId)]);
  const failures: string[] = [];
  for (const childId of childIds) {
    const result = await clearChildPersonalizationData(childId);
    failures.push(...result.failed);
  }
  return failures;
};
