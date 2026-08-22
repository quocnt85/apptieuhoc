import type { AppBindings } from './bindings';
import { ITEM_CATALOG } from './catalog';
import { getSql } from './database';
import { AppError } from './errors';

type WalletSummaryRow = {
  child_slot_id: string | null;
  wallet_type: 'parent_vault' | 'child_diamonds';
  balance: string | number;
  version: string | number;
};

type RewardTransferRow = {
  reward_request_id: string;
  child_slot_id: string;
  diamond_amount: string | number;
  already_processed: boolean;
};

type ItemPurchaseRow = {
  purchase_request_id: string;
  child_slot_id: string;
  sku: string;
  diamond_cost: string | number;
  already_processed: boolean;
};

const uniqueViolation = (error: unknown) => Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: unknown }).code === '23505');
const idempotencyConflict = () => new AppError(409, 'IDEMPOTENCY_KEY_REUSED', 'Mã yêu cầu đã được dùng cho một thao tác khác.');

export const getWalletSummary = async (env: AppBindings, parentId: string) => {
  const rows = await getSql(env)`
    SELECT wallet.child_slot_id, wallet.wallet_type, wallet.balance, wallet.version
    FROM wallet_accounts wallet
    LEFT JOIN child_wallet_slots slot ON slot.id = wallet.child_slot_id
    WHERE wallet.parent_id = ${parentId}
      AND (wallet.wallet_type = 'parent_vault' OR slot.status = 'active')
    ORDER BY wallet.wallet_type DESC, wallet.created_at ASC
  ` as WalletSummaryRow[];
  const vault = rows.find((row) => row.wallet_type === 'parent_vault');
  return {
    parentVault: Number(vault?.balance ?? 0),
    parentVaultVersion: Number(vault?.version ?? 0),
    children: rows
      .filter((row) => row.wallet_type === 'child_diamonds' && row.child_slot_id)
      .map((row) => ({ childSlotId: row.child_slot_id, balance: Number(row.balance), version: Number(row.version) })),
  };
};

export const createChildSlot = async (env: AppBindings, parentId: string, requestId: string) => {
  const sql = getSql(env);
  const slotId = crypto.randomUUID();
  const walletId = crypto.randomUUID();
  let rows: Array<{ id: string }>;
  try {
    const results = await sql.transaction((tx) => [
      tx`SELECT id FROM parent_accounts WHERE id = ${parentId} FOR UPDATE`,
      tx`
        WITH existing AS (
          SELECT id FROM child_wallet_slots
          WHERE parent_id = ${parentId} AND creation_request_id = ${requestId}
        ), allowed AS (
          SELECT ${slotId}::uuid AS id
          WHERE (SELECT COUNT(*) FROM child_wallet_slots WHERE parent_id = ${parentId} AND status = 'active') < 4
            AND NOT EXISTS (SELECT 1 FROM existing)
        ), inserted_slot AS (
          INSERT INTO child_wallet_slots (id, parent_id, creation_request_id)
          SELECT id, ${parentId}, ${requestId} FROM allowed
          RETURNING id
        ), selected AS (
          SELECT id FROM existing UNION ALL SELECT id FROM inserted_slot LIMIT 1
        ), inserted_wallet AS (
          INSERT INTO wallet_accounts (id, parent_id, child_slot_id, wallet_type)
          SELECT ${walletId}, ${parentId}, id, 'child_diamonds' FROM inserted_slot
          ON CONFLICT DO NOTHING
        )
        SELECT id FROM selected
      `,
    ]);
    rows = results[1] as Array<{ id: string }>;
  } catch (error) {
    if (!uniqueViolation(error)) throw error;
    rows = await sql`
      SELECT id FROM child_wallet_slots
      WHERE parent_id = ${parentId} AND creation_request_id = ${requestId}
      LIMIT 1
    ` as Array<{ id: string }>;
    if (!rows[0]) throw idempotencyConflict();
  }
  if (!rows[0]) throw new AppError(409, 'PROFILE_LIMIT_REACHED', 'Mỗi tài khoản có tối đa 4 hồ sơ trẻ.');
  return { childSlotId: String(rows[0].id) };
};

export const closeChildSlot = async (env: AppBindings, parentId: string, childSlotId: string, requestId: string) => {
  const sql = getSql(env);
  const groupId = crypto.randomUUID();
  const results = await sql.transaction((tx) => [
    tx`
      SELECT id, status, close_request_id, closure_returned_diamonds
      FROM child_wallet_slots
      WHERE id = ${childSlotId} AND parent_id = ${parentId}
      FOR UPDATE
    `,
    tx`
      WITH duplicate AS (
        SELECT id, closure_returned_diamonds AS returned
        FROM child_wallet_slots
        WHERE id = ${childSlotId} AND parent_id = ${parentId}
          AND status = 'closed' AND close_request_id = ${requestId}
      ), vault AS MATERIALIZED (
        SELECT id FROM wallet_accounts
        WHERE parent_id = ${parentId} AND wallet_type = 'parent_vault'
        FOR UPDATE
      ), child AS MATERIALIZED (
        SELECT wallet.id, wallet.balance
        FROM wallet_accounts wallet
        JOIN child_wallet_slots slot ON slot.id = wallet.child_slot_id
        WHERE slot.id = ${childSlotId} AND slot.parent_id = ${parentId} AND slot.status = 'active'
          AND EXISTS (SELECT 1 FROM vault)
        FOR UPDATE
      ), debit AS (
        UPDATE wallet_accounts SET balance = 0, version = version + 1, updated_at = NOW()
        WHERE id = (SELECT id FROM child)
        RETURNING id
      ), credit AS (
        UPDATE wallet_accounts
        SET balance = balance + COALESCE((SELECT balance FROM child), 0), version = version + 1, updated_at = NOW()
        WHERE id = (SELECT id FROM vault) AND EXISTS (SELECT 1 FROM child)
        RETURNING id
      ), ledger_debit AS (
        INSERT INTO wallet_ledger (id, transaction_group_id, wallet_id, direction, amount, reason)
        SELECT ${crypto.randomUUID()}, ${groupId}, child.id, 'debit', child.balance, 'profile_closure_return'
        FROM child WHERE child.balance > 0
      ), ledger_credit AS (
        INSERT INTO wallet_ledger (id, transaction_group_id, wallet_id, direction, amount, reason)
        SELECT ${crypto.randomUUID()}, ${groupId}, vault.id, 'credit', child.balance, 'profile_closure_return'
        FROM child, vault WHERE child.balance > 0
      ), closed AS (
        UPDATE child_wallet_slots
        SET status = 'closed', close_request_id = ${requestId},
            closure_returned_diamonds = COALESCE((SELECT balance FROM child), 0), closed_at = NOW()
        WHERE id = ${childSlotId} AND parent_id = ${parentId} AND status = 'active'
          AND EXISTS (SELECT 1 FROM child)
        RETURNING id, closure_returned_diamonds AS returned
      )
      SELECT id, returned, FALSE AS already_processed FROM closed
      UNION ALL
      SELECT id, returned, TRUE AS already_processed FROM duplicate
      LIMIT 1
    `,
  ]);
  const locked = results[0] as Array<{ id: string; status: string; close_request_id: string | null }>;
  const rows = results[1] as Array<{ id: string; returned: string | number | null; already_processed: boolean }>;
  if (!rows[0]) {
    if (locked[0]?.status === 'closed' && locked[0].close_request_id && locked[0].close_request_id !== requestId) throw idempotencyConflict();
    throw new AppError(404, 'CHILD_SLOT_NOT_FOUND', 'Không tìm thấy hồ sơ trẻ đang hoạt động.');
  }
  return { childSlotId: String(rows[0].id), returnedDiamonds: Number(rows[0].returned ?? 0), alreadyProcessed: rows[0].already_processed === true };
};

export const transferReward = async (
  env: AppBindings,
  parentId: string,
  childSlotId: string,
  requestId: string,
  amount: number,
) => {
  if (amount === 0) return { rewardRequestId: requestId, diamonds: 0, alreadyProcessed: false };
  const sql = getSql(env);
  const groupId = crypto.randomUUID();
  let rows: RewardTransferRow[];
  let recoveredUniqueViolation = false;
  try {
    rows = await sql`
    WITH duplicate AS (
      SELECT reward_request_id, child_slot_id, diamond_amount FROM reward_transfers
      WHERE reward_request_id = ${requestId} AND parent_id = ${parentId}
    ), vault AS (
      SELECT id, balance FROM wallet_accounts
      WHERE parent_id = ${parentId} AND wallet_type = 'parent_vault'
      FOR UPDATE
    ), child AS (
      SELECT wallet.id
      FROM wallet_accounts wallet
      JOIN child_wallet_slots slot ON slot.id = wallet.child_slot_id
      WHERE slot.id = ${childSlotId} AND slot.parent_id = ${parentId} AND slot.status = 'active'
      FOR UPDATE
    ), transfer AS (
      INSERT INTO reward_transfers
        (reward_request_id, parent_id, child_slot_id, diamond_amount, ledger_transaction_group_id)
      SELECT ${requestId}, ${parentId}, ${childSlotId}, ${amount}, ${groupId}
      WHERE NOT EXISTS (SELECT 1 FROM duplicate)
        AND EXISTS (SELECT 1 FROM child)
        AND COALESCE((SELECT balance FROM vault), 0) >= ${amount}
      RETURNING reward_request_id, child_slot_id, diamond_amount
    ), debit AS (
      UPDATE wallet_accounts SET balance = balance - ${amount}, version = version + 1, updated_at = NOW()
      WHERE id = (SELECT id FROM vault) AND EXISTS (SELECT 1 FROM transfer)
      RETURNING id
    ), credit AS (
      UPDATE wallet_accounts SET balance = balance + ${amount}, version = version + 1, updated_at = NOW()
      WHERE id = (SELECT id FROM child) AND EXISTS (SELECT 1 FROM transfer)
      RETURNING id
    ), ledger_debit AS (
      INSERT INTO wallet_ledger (id, transaction_group_id, wallet_id, direction, amount, reason)
      SELECT ${crypto.randomUUID()}, ${groupId}, id, 'debit', ${amount}, 'mission_transfer' FROM debit
    ), ledger_credit AS (
      INSERT INTO wallet_ledger (id, transaction_group_id, wallet_id, direction, amount, reason)
      SELECT ${crypto.randomUUID()}, ${groupId}, id, 'credit', ${amount}, 'mission_transfer' FROM credit
    )
    SELECT reward_request_id, child_slot_id, diamond_amount, FALSE AS already_processed FROM transfer
    UNION ALL
    SELECT reward_request_id, child_slot_id, diamond_amount, TRUE AS already_processed FROM duplicate
    LIMIT 1
    ` as RewardTransferRow[];
  } catch (error) {
    if (!uniqueViolation(error)) throw error;
    recoveredUniqueViolation = true;
    rows = await sql`
      SELECT reward_request_id, child_slot_id, diamond_amount, TRUE AS already_processed
      FROM reward_transfers
      WHERE reward_request_id = ${requestId} AND parent_id = ${parentId}
      LIMIT 1
    ` as RewardTransferRow[];
  }
  if (recoveredUniqueViolation && !rows[0]) throw idempotencyConflict();
  if (!rows[0]) throw new AppError(409, 'INSUFFICIENT_VAULT_BALANCE', 'Kho kim cương không đủ hoặc hồ sơ không hợp lệ.');
  if (String(rows[0].child_slot_id) !== childSlotId || Number(rows[0].diamond_amount) !== amount) throw idempotencyConflict();
  return {
    rewardRequestId: String(rows[0].reward_request_id),
    diamonds: Number(rows[0].diamond_amount),
    alreadyProcessed: rows[0].already_processed === true,
  };
};

export const purchaseItem = async (
  env: AppBindings,
  parentId: string,
  childSlotId: string,
  requestId: string,
  sku: string,
) => {
  const item = ITEM_CATALOG[sku];
  if (!item) throw new AppError(422, 'UNKNOWN_SKU', 'Vật phẩm không tồn tại trong danh mục.');
  const sql = getSql(env);
  const groupId = crypto.randomUUID();
  let rows: ItemPurchaseRow[];
  let recoveredUniqueViolation = false;
  try {
    rows = await sql`
    WITH duplicate AS (
      SELECT purchase_request_id, child_slot_id, sku, diamond_cost FROM item_purchase_requests
      WHERE purchase_request_id = ${requestId} AND parent_id = ${parentId}
    ), wallet AS (
      SELECT wallet.id, wallet.balance
      FROM wallet_accounts wallet
      JOIN child_wallet_slots slot ON slot.id = wallet.child_slot_id
      WHERE slot.id = ${childSlotId} AND slot.parent_id = ${parentId} AND slot.status = 'active'
      FOR UPDATE
    ), purchased AS (
      INSERT INTO item_purchase_requests
        (purchase_request_id, parent_id, child_slot_id, sku, diamond_cost, ledger_transaction_group_id)
      SELECT ${requestId}, ${parentId}, ${childSlotId}, ${sku}, ${item.diamondCost}, ${groupId}
      WHERE NOT EXISTS (SELECT 1 FROM duplicate)
        AND COALESCE((SELECT balance FROM wallet), 0) >= ${item.diamondCost}
        AND (${item.kind} <> 'permanent' OR NOT EXISTS (
          SELECT 1 FROM item_entitlements WHERE child_slot_id = ${childSlotId} AND sku = ${sku} AND status = 'active'
        ))
      RETURNING purchase_request_id, child_slot_id, sku, diamond_cost, ledger_transaction_group_id
    ), debit AS (
      UPDATE wallet_accounts SET balance = balance - ${item.diamondCost}, version = version + 1, updated_at = NOW()
      WHERE id = (SELECT id FROM wallet) AND EXISTS (SELECT 1 FROM purchased)
      RETURNING id
    ), ledger AS (
      INSERT INTO wallet_ledger (id, transaction_group_id, wallet_id, direction, amount, reason, external_reference)
      SELECT ${crypto.randomUUID()}, purchased.ledger_transaction_group_id, debit.id, 'debit', purchased.diamond_cost, 'item_purchase', purchased.sku
      FROM debit, purchased
    ), entitlement AS (
      INSERT INTO item_entitlements (id, parent_id, child_slot_id, sku, source_transaction_group_id)
      SELECT ${crypto.randomUUID()}, ${parentId}, ${childSlotId}, ${sku}, purchased.ledger_transaction_group_id
      FROM purchased WHERE ${item.kind} = 'permanent'
      ON CONFLICT DO NOTHING
    )
    SELECT purchase_request_id, child_slot_id, sku, diamond_cost, FALSE AS already_processed FROM purchased
    UNION ALL
    SELECT purchase_request_id, child_slot_id, sku, diamond_cost, TRUE AS already_processed FROM duplicate
    LIMIT 1
    ` as ItemPurchaseRow[];
  } catch (error) {
    if (!uniqueViolation(error)) throw error;
    recoveredUniqueViolation = true;
    rows = await sql`
      SELECT purchase_request_id, child_slot_id, sku, diamond_cost, TRUE AS already_processed
      FROM item_purchase_requests
      WHERE purchase_request_id = ${requestId} AND parent_id = ${parentId}
      LIMIT 1
    ` as ItemPurchaseRow[];
  }
  if (recoveredUniqueViolation && !rows[0]) throw idempotencyConflict();
  if (!rows[0]) throw new AppError(409, 'PURCHASE_REJECTED', 'Không đủ kim cương hoặc vật phẩm đã sở hữu.');
  if (String(rows[0].child_slot_id) !== childSlotId || String(rows[0].sku) !== sku || Number(rows[0].diamond_cost) !== item.diamondCost) throw idempotencyConflict();
  return {
    purchaseRequestId: String(rows[0].purchase_request_id),
    sku: String(rows[0].sku),
    diamondCost: Number(rows[0].diamond_cost),
    alreadyProcessed: rows[0].already_processed === true,
  };
};
