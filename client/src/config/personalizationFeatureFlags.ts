export interface PersonalizationFeatureFlags {
  localMediaFoundation: boolean;
  photoAvatar: boolean;
  territoryFlag: boolean;
  explorerFlagDecal: boolean;
  captainIdExport: boolean;
  shipVfx: boolean;
  pets: boolean;
  captainCabin: boolean;
}

const enabled = (value: unknown, fallback = false) => value === undefined ? fallback : value === 'true';

export const PERSONALIZATION_FEATURE_FLAGS: Readonly<PersonalizationFeatureFlags> = Object.freeze({
  localMediaFoundation: enabled(import.meta.env.VITE_ENABLE_LOCAL_MEDIA_FOUNDATION, true),
  photoAvatar: enabled(import.meta.env.VITE_ENABLE_PHOTO_AVATAR),
  territoryFlag: enabled(import.meta.env.VITE_ENABLE_TERRITORY_FLAG),
  explorerFlagDecal: enabled(import.meta.env.VITE_ENABLE_EXPLORER_FLAG_DECAL),
  captainIdExport: enabled(import.meta.env.VITE_ENABLE_CAPTAIN_ID_EXPORT),
  shipVfx: enabled(import.meta.env.VITE_ENABLE_SHIP_VFX),
  pets: enabled(import.meta.env.VITE_ENABLE_PETS),
  captainCabin: enabled(import.meta.env.VITE_ENABLE_CAPTAIN_CABIN),
});
