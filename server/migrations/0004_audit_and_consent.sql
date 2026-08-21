BEGIN;

CREATE TABLE IF NOT EXISTS consent_receipts (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES parent_accounts(id) ON DELETE CASCADE,
  policy_version VARCHAR(64) NOT NULL,
  scope VARCHAR(32) NOT NULL CHECK (scope IN ('service', 'marketing')),
  accepted BOOLEAN NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consent_parent_scope ON consent_receipts(parent_id, scope, accepted_at DESC);

CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID PRIMARY KEY,
  parent_id UUID REFERENCES parent_accounts(id) ON DELETE SET NULL,
  action VARCHAR(64) NOT NULL,
  result VARCHAR(16) NOT NULL CHECK (result IN ('success', 'failure', 'denied')),
  request_id VARCHAR(64) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_parent_created ON security_audit_log(parent_id, created_at DESC);

COMMIT;
