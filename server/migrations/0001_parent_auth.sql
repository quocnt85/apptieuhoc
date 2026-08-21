BEGIN;

CREATE TABLE IF NOT EXISTS parent_accounts (
  id UUID PRIMARY KEY,
  email_normalized VARCHAR(320) NOT NULL UNIQUE,
  email_verified_at TIMESTAMPTZ,
  status VARCHAR(16) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleting', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parent_auth_credentials (
  parent_id UUID PRIMARY KEY REFERENCES parent_accounts(id) ON DELETE CASCADE,
  pin_verifier TEXT NOT NULL,
  pin_salt TEXT NOT NULL,
  verifier_version SMALLINT NOT NULL DEFAULT 1,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  lock_level SMALLINT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  pin_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_otp_challenges (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES parent_accounts(id) ON DELETE CASCADE,
  purpose VARCHAR(24) NOT NULL CHECK (purpose IN ('verify_email', 'reset_pin', 'login')),
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts SMALLINT NOT NULL DEFAULT 0,
  resend_after TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_parent_purpose_created
  ON email_otp_challenges(parent_id, purpose, created_at DESC);

CREATE TABLE IF NOT EXISTS parent_sessions (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES parent_accounts(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  device_id_hash TEXT,
  last_reauthenticated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parent_sessions_token ON parent_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_parent_sessions_parent ON parent_sessions(parent_id, expires_at DESC);

COMMIT;
