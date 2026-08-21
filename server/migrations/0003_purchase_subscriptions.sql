BEGIN;

CREATE TABLE IF NOT EXISTS purchase_events (
  revenuecat_event_id VARCHAR(255) PRIMARY KEY,
  parent_id UUID REFERENCES parent_accounts(id),
  store_transaction_id VARCHAR(255),
  app_user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  normalized_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  processing_status VARCHAR(16) NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'ignored', 'failed')),
  processed_at TIMESTAMPTZ,
  error_code VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_purchase_store_transaction
  ON purchase_events(store_transaction_id, event_type)
  WHERE store_transaction_id IS NOT NULL AND processing_status = 'processed';

CREATE TABLE IF NOT EXISTS subscriptions (
  parent_id UUID NOT NULL REFERENCES parent_accounts(id) ON DELETE CASCADE,
  entitlement_id VARCHAR(128) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  status VARCHAR(24) NOT NULL CHECK (status IN ('active', 'grace', 'billing_retry', 'cancelled', 'expired', 'revoked')),
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  will_renew BOOLEAN NOT NULL DEFAULT FALSE,
  last_store_transaction_id VARCHAR(255),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (parent_id, entitlement_id)
);

COMMIT;
