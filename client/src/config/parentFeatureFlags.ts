export const parentFeatureFlags = Object.freeze({
  parentZone: import.meta.env.VITE_PARENT_ZONE_ENABLED !== 'false',
  realLifeRewards: import.meta.env.VITE_REAL_LIFE_REWARDS_ENABLED !== 'false',
  iap: import.meta.env.VITE_PARENT_IAP_ENABLED === 'true',
});
