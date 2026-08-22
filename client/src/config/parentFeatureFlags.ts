export const parentFeatureFlags = Object.freeze({
  parentZone: import.meta.env.VITE_PARENT_ZONE_ENABLED !== 'false',
  realLifeRewards: import.meta.env.VITE_REAL_LIFE_REWARDS_ENABLED !== 'false',
  iap: import.meta.env.VITE_PARENT_IAP_ENABLED === 'true',
  // Temporary Product-approved review gate. Keep until Product asks to remove it.
  demoAccess: import.meta.env.VITE_PARENT_DEMO_ACCESS !== 'false',
});
