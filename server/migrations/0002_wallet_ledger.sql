BEGIN;

CREATE TABLE IF NOT EXISTS child_wallet_slots (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES parent_accounts(id) ON DELETE CASCADE,
  creation_request_id VARCHAR(128) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_child_slot_creation_request
  ON child_wallet_slots(parent_id, creation_request_id);

CREATE INDEX IF NOT EXISTS idx_child_slots_parent ON child_wallet_slots(parent_id, status);

CREATE TABLE IF NOT EXISTS wallet_accounts (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES parent_accounts(id) ON DELETE CASCADE,
  child_slot_id UUID REFERENCES child_wallet_slots(id) ON DELETE CASCADE,
  wallet_type VARCHAR(24) NOT NULL CHECK (wallet_type IN ('parent_vault', 'child_diamonds')),
  balance BIGINT NOT NULL DEFAULT 0 CHECK (balance >= 0),
  version BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (wallet_type = 'parent_vault' AND child_slot_id IS NULL) OR
    (wallet_type = 'child_diamonds' AND child_slot_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_parent_vault
  ON wallet_accounts(parent_id) WHERE wallet_type = 'parent_vault';
CREATE UNIQUE INDEX IF NOT EXISTS uq_child_wallet
  ON wallet_accounts(child_slot_id) WHERE wallet_type = 'child_diamonds';

CREATE TABLE IF NOT EXISTS wallet_ledger (
  id UUID PRIMARY KEY,
  transaction_group_id UUID NOT NULL,
  wallet_id UUID NOT NULL REFERENCES wallet_accounts(id),
  direction VARCHAR(8) NOT NULL CHECK (direction IN ('credit', 'debit')),
  amount BIGINT NOT NULL CHECK (amount > 0),
  reason VARCHAR(40) NOT NULL CHECK (reason IN (
    'purchase_credit', 'mission_transfer', 'item_purchase',
    'profile_closure_return', 'refund_adjustment', 'manual_reconciliation'
  )),
  external_reference VARCHAR(255),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_ledger_wallet ON wallet_ledger(wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_ledger_group ON wallet_ledger(transaction_group_id);

CREATE TABLE IF NOT EXISTS reward_transfers (
  reward_request_id VARCHAR(128) PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES parent_accounts(id),
  child_slot_id UUID NOT NULL REFERENCES child_wallet_slots(id),
  diamond_amount BIGINT NOT NULL CHECK (diamond_amount > 0),
  ledger_transaction_group_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS item_entitlements (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES parent_accounts(id),
  child_slot_id UUID NOT NULL REFERENCES child_wallet_slots(id),
  sku VARCHAR(128) NOT NULL,
  source_transaction_group_id UUID NOT NULL UNIQUE,
  status VARCHAR(16) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS item_purchase_requests (
  purchase_request_id VARCHAR(128) PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES parent_accounts(id),
  child_slot_id UUID NOT NULL REFERENCES child_wallet_slots(id),
  sku VARCHAR(128) NOT NULL,
  diamond_cost BIGINT NOT NULL CHECK (diamond_cost > 0),
  ledger_transaction_group_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_active_item_entitlement
  ON item_entitlements(child_slot_id, sku) WHERE status = 'active';

COMMIT;
