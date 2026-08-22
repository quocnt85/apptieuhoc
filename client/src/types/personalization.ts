export const PERSONALIZATION_SCHEMA_VERSION = 3 as const;

export type MediaAssetKind = 'AVATAR_SOURCE' | 'FLAG_SOURCE' | 'SIGNATURE' | 'CARD_EXPORT';
export type MediaStorageArea = 'library' | 'cache';
export type FlagReviewStatus = 'NONE' | 'DRAFT_LOCAL' | 'PENDING_PARENT_REVIEW' | 'APPROVED_LOCAL' | 'REJECTED';
export type AvatarCosmeticSlot = 'OUTFIT' | 'HEADGEAR' | 'ACCESSORY' | 'FRAME' | 'BACKGROUND';

export interface ProcessedImage {
  blob: Blob;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  width: number;
  height: number;
}

export interface MediaTarget {
  childId: string;
  assetId: string;
  kind: MediaAssetKind;
  area?: MediaStorageArea;
}

export interface StoredMedia {
  relativePath: string;
  area: MediaStorageArea;
  byteSize: number;
}

export interface LocalMediaAsset {
  id: string;
  childId: string;
  kind: MediaAssetKind;
  relativePath: string;
  storageArea: MediaStorageArea;
  mimeType: ProcessedImage['mimeType'];
  width: number;
  height: number;
  byteSize: number;
  createdAt: number;
  updatedAt: number;
}

export interface ChildPersonalization {
  childId: string;
  avatarAssetId: string | null;
  avatarMode: 'PRESET' | 'PHOTO';
  flagAssetId: string | null;
  flagReviewStatus: FlagReviewStatus;
  flagReviewNote: string | null;
  unlockedCosmeticIds: string[];
  equippedCosmetics: Partial<Record<AvatarCosmeticSlot, string>>;
  updatedAt: number;
}

export type ParentGatePurpose = 'FLAG_APPROVAL' | 'MEDIA_DELETE' | 'CARD_EXPORT';

export interface ParentGateSession {
  unlockedUntil: number;
}

export interface ParentGatePort {
  getSession(): ParentGateSession | null;
  isUnlocked(): boolean;
  markAuthenticated(unlockedUntil?: number): void;
  authorizeWithPin(pin: string, purpose: ParentGatePurpose, forceReauthentication?: boolean): Promise<ParentGateSession>;
  lock(): void;
  subscribe(listener: (session: ParentGateSession | null) => void): () => void;
}
