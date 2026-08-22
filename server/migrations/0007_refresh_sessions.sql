BEGIN;

ALTER TABLE parent_sessions
  ADD COLUMN IF NOT EXISTS refresh_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS refresh_expires_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS uq_parent_sessions_refresh_token
  ON parent_sessions(refresh_token_hash)
  WHERE refresh_token_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_parent_sessions_refresh_expiry
  ON parent_sessions(refresh_expires_at)
  WHERE revoked_at IS NULL;

COMMIT;
