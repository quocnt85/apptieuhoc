export const PARENT_DEMO_PASSWORD = '1234';

export const parentFeatureFlags = Object.freeze({
  parentZone: import.meta.env.VITE_PARENT_ZONE_ENABLED !== 'false',
  realLifeRewards: import.meta.env.VITE_REAL_LIFE_REWARDS_ENABLED !== 'false',
  iap: import.meta.env.VITE_PARENT_IAP_ENABLED === 'true',
  // Temporary review gate. Disable as soon as email OTP is available.
  demoAccess: import.meta.env.VITE_PARENT_DEMO_ACCESS !== 'false',
});
