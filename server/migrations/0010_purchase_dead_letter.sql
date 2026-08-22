BEGIN;

ALTER TABLE purchase_events
  ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  ADD COLUMN IF NOT EXISTS last_error_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_purchase_events_dead_letter
  ON purchase_events(processing_status, last_error_at DESC)
  WHERE processing_status = 'failed';

COMMIT;
