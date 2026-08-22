BEGIN;

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS last_event_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_revenuecat_event_id VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS uq_purchase_store_event_all
  ON purchase_events(store_transaction_id, event_type)
  WHERE store_transaction_id IS NOT NULL;

COMMIT;
