type RuntimeConfig = {
  ENVIRONMENT: string;
  ALLOWED_ORIGINS?: string;
  EMAIL_DELIVERY_MODE?: string;
  EMAIL_FROM?: string;
  DEMO_AUTH_ENABLED?: string;
  PARENT_IAP_ENABLED?: string;
  NEON_DATABASE_URL?: string;
  SESSION_PEPPER?: string;
  OTP_PEPPER?: string;
  PIN_PEPPER?: string;
  REVENUECAT_WEBHOOK_SECRET?: string;
  ADMIN_UPLOAD_SECRET?: string;
  HYPERDRIVE?: { connectionString: string };
  EMAIL?: unknown;
};

export type RuntimeConfigurationCheck = {
  ready: boolean;
  environment: string;
  checks: {
    databaseBinding: boolean;
    corsAllowlist: boolean;
    emailBinding: boolean;
    sessionPepper: boolean;
    otpPepper: boolean;
    pinPepper: boolean;
    revenueCatWebhookSecret: boolean;
    adminUploadSecret: boolean;
    stagingIapDisabled: boolean;
    demoAuthRestricted: boolean;
  };
};

const hasSecretStrength = (value: string | undefined): boolean => Boolean(value && value.length >= 32);

export const validateRuntimeConfiguration = (env: RuntimeConfig): RuntimeConfigurationCheck => {
  const managedEnvironment = env.ENVIRONMENT === 'staging' || env.ENVIRONMENT === 'production';
  const stagingDemoAuth = env.ENVIRONMENT === 'staging' && env.DEMO_AUTH_ENABLED === 'true';
  const allowedOrigins = (env.ALLOWED_ORIGINS ?? '').split(',').map((origin) => origin.trim()).filter(Boolean);
  const checks = {
    databaseBinding: managedEnvironment ? Boolean(env.HYPERDRIVE?.connectionString) : Boolean(env.HYPERDRIVE?.connectionString || env.NEON_DATABASE_URL),
    corsAllowlist: allowedOrigins.length > 0 && !allowedOrigins.includes('*'),
    emailBinding: managedEnvironment
      ? stagingDemoAuth
        ? env.EMAIL_DELIVERY_MODE === 'disabled'
        : env.EMAIL_DELIVERY_MODE === 'binding' && Boolean(env.EMAIL) && Boolean(env.EMAIL_FROM)
      : env.EMAIL_DELIVERY_MODE === 'console' || (env.EMAIL_DELIVERY_MODE === 'binding' && Boolean(env.EMAIL)),
    sessionPepper: hasSecretStrength(env.SESSION_PEPPER),
    otpPepper: hasSecretStrength(env.OTP_PEPPER),
    pinPepper: hasSecretStrength(env.PIN_PEPPER),
    revenueCatWebhookSecret: hasSecretStrength(env.REVENUECAT_WEBHOOK_SECRET),
    adminUploadSecret: hasSecretStrength(env.ADMIN_UPLOAD_SECRET),
    stagingIapDisabled: env.ENVIRONMENT !== 'staging' || env.PARENT_IAP_ENABLED !== 'true',
    demoAuthRestricted: env.DEMO_AUTH_ENABLED !== 'true' || env.ENVIRONMENT !== 'production',
  };

  return {
    ready: Object.values(checks).every(Boolean),
    environment: env.ENVIRONMENT,
    checks,
  };
};
