/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_LOCAL_MEDIA_FOUNDATION?: string;
  readonly VITE_ENABLE_PHOTO_AVATAR?: string;
  readonly VITE_ENABLE_TERRITORY_FLAG?: string;
  readonly VITE_ENABLE_EXPLORER_FLAG_DECAL?: string;
  readonly VITE_ENABLE_CAPTAIN_ID_EXPORT?: string;
  readonly VITE_ENABLE_SHIP_VFX?: string;
  readonly VITE_ENABLE_PETS?: string;
  readonly VITE_ENABLE_CAPTAIN_CABIN?: string;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_REVENUECAT_IOS_API_KEY?: string;
  readonly VITE_REVENUECAT_ANDROID_API_KEY?: string;
  readonly VITE_ENABLE_PENDING_HEALTH_CONTENT?: string;
  readonly VITE_PARENT_ZONE_ENABLED?: string;
  readonly VITE_REAL_LIFE_REWARDS_ENABLED?: string;
  readonly VITE_PARENT_IAP_ENABLED?: string;
  readonly VITE_PARENT_DEMO_ACCESS?: string;
  readonly VITE_DEPLOYMENT_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
