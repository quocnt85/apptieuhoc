/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_REVENUECAT_IOS_API_KEY?: string;
  readonly VITE_REVENUECAT_ANDROID_API_KEY?: string;
  readonly VITE_ENABLE_PENDING_HEALTH_CONTENT?: string;
  readonly VITE_PARENT_ZONE_ENABLED?: string;
  readonly VITE_REAL_LIFE_REWARDS_ENABLED?: string;
  readonly VITE_PARENT_IAP_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
