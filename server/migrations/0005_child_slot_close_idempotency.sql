BEGIN;

ALTER TABLE child_wallet_slots
  ADD COLUMN IF NOT EXISTS close_request_id VARCHAR(128),
  ADD COLUMN IF NOT EXISTS closure_returned_diamonds BIGINT
    CHECK (closure_returned_diamonds IS NULL OR closure_returned_diamonds >= 0);

CREATE UNIQUE INDEX IF NOT EXISTS uq_child_slot_close_request
  ON child_wallet_slots(parent_id, close_request_id)
  WHERE close_request_id IS NOT NULL;

COMMIT;
