export type SecretBindings = {
  NEON_DATABASE_URL: string;
  SESSION_PEPPER: string;
  OTP_PEPPER: string;
  PIN_PEPPER: string;
  REVENUECAT_WEBHOOK_SECRET: string;
  ADMIN_UPLOAD_SECRET: string;
  HYPERDRIVE?: Hyperdrive;
};

export type AppBindings = Env & SecretBindings;

export type AuthVariables = {
  requestId: string;
  parentId: string;
  sessionId: string;
  lastReauthenticatedAt: string | null;
};

export type AppHonoEnv = {
  Bindings: AppBindings;
  Variables: AuthVariables;
};
