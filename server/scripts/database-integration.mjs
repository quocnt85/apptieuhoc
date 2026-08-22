import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import { createIntegrationSchemaName, quoteIntegrationSchema, withOwnedIntegrationSchema } from './database-integration-utils.mjs';

const connectionString = process.env.NEON_INTEGRATION_DATABASE_URL;
if (!connectionString) {
  throw new Error('NEON_INTEGRATION_DATABASE_URL is required. The integration harness never falls back to NEON_DATABASE_URL.');
}

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const schema = createIntegrationSchemaName();
const quotedSchema = quoteIntegrationSchema(schema);
const sql = neon(connectionString);

const runNodeScript = (filename) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [path.join(scriptDirectory, filename)], {
    cwd: path.resolve(scriptDirectory, '..'),
    env: {
      ...process.env,
      NEON_DATABASE_URL: connectionString,
      NEON_DATABASE_SCHEMA: schema,
    },
    stdio: 'inherit',
  });
  child.once('error', reject);
  child.once('exit', (code, signal) => {
    if (code === 0) resolve();
    else reject(new Error(`${filename} failed (${signal ?? `exit ${code}`}).`));
  });
});

const inSchema = async (...queries) => {
  const results = await sql.transaction([
    sql`SELECT set_config('search_path', ${schema}, true)`,
    ...queries,
  ]);
  return results.slice(1);
};

const expectPgCode = async (action, expectedCode) => {
  await assert.rejects(action, (error) => {
    assert.equal(error?.code, expectedCode);
    return true;
  });
};

await withOwnedIntegrationSchema(schema, {
  create: async () => {
    await sql.query(`CREATE SCHEMA ${quotedSchema}`);
    console.log(`Created isolated integration schema ${schema}.`);
  },
  run: async () => {
  await runNodeScript('migrate.mjs');
  await runNodeScript('verify-database.mjs');

  const parentId = crypto.randomUUID();
  const slotId = crypto.randomUUID();
  const vaultId = crypto.randomUUID();
  const childWalletId = crypto.randomUUID();
  const ledgerId = crypto.randomUUID();

  await inSchema(
    sql`INSERT INTO parent_accounts (id, email_normalized, email_verified_at) VALUES (${parentId}, ${`integration-${parentId}@example.invalid`}, NOW())`,
    sql`INSERT INTO child_wallet_slots (id, parent_id, creation_request_id) VALUES (${slotId}, ${parentId}, 'integration-slot')`,
    sql`INSERT INTO wallet_accounts (id, parent_id, wallet_type, balance) VALUES (${vaultId}, ${parentId}, 'parent_vault', 100)`,
    sql`INSERT INTO wallet_accounts (id, parent_id, child_slot_id, wallet_type, balance) VALUES (${childWalletId}, ${parentId}, ${slotId}, 'child_diamonds', 0)`,
  );

  await expectPgCode(
    () => inSchema(sql`UPDATE wallet_accounts SET balance = -1 WHERE id = ${vaultId}`),
    '23514',
  );
  await expectPgCode(
    () => inSchema(sql`INSERT INTO child_wallet_slots (id, parent_id, creation_request_id) VALUES (${crypto.randomUUID()}, ${parentId}, 'integration-slot')`),
    '23505',
  );

  await inSchema(sql`
    INSERT INTO wallet_ledger (id, transaction_group_id, wallet_id, direction, amount, reason)
    VALUES (${ledgerId}, ${crypto.randomUUID()}, ${vaultId}, 'credit', 10, 'manual_reconciliation')
  `);
  await expectPgCode(
    () => inSchema(sql`UPDATE wallet_ledger SET metadata = '{"changed":true}'::jsonb WHERE id = ${ledgerId}`),
    '55000',
  );

  const rewardRequestId = `reward-${crypto.randomUUID()}`;
  const runReward = async (requestId, amount) => {
    const groupId = crypto.randomUUID();
    const [rows] = await inSchema(sql`
      WITH duplicate AS (
        SELECT reward_request_id, child_slot_id, diamond_amount FROM reward_transfers
        WHERE reward_request_id = ${requestId} AND parent_id = ${parentId}
      ), vault AS (
        SELECT id, balance FROM wallet_accounts
        WHERE parent_id = ${parentId} AND wallet_type = 'parent_vault'
        FOR UPDATE
      ), child AS (
        SELECT wallet.id FROM wallet_accounts wallet
        JOIN child_wallet_slots slot ON slot.id = wallet.child_slot_id
        WHERE slot.id = ${slotId} AND slot.parent_id = ${parentId} AND slot.status = 'active'
        FOR UPDATE
      ), transfer AS (
        INSERT INTO reward_transfers
          (reward_request_id, parent_id, child_slot_id, diamond_amount, ledger_transaction_group_id)
        SELECT ${requestId}, ${parentId}, ${slotId}, ${amount}, ${groupId}
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
    `);
    return rows;
  };

  const firstReward = await runReward(rewardRequestId, 40);
  assert.equal(firstReward[0]?.already_processed, false);
  assert.equal(Number(firstReward[0]?.diamond_amount), 40);
  const repeatedReward = await runReward(rewardRequestId, 40);
  assert.equal(repeatedReward[0]?.already_processed, true);
  const conflictingReward = await runReward(rewardRequestId, 41);
  assert.equal(Number(conflictingReward[0]?.diamond_amount), 40, 'A reused reward key must preserve the authoritative original amount.');
  const rejectedReward = await runReward(`reward-${crypto.randomUUID()}`, 1_000);
  assert.equal(rejectedReward.length, 0, 'An insufficient vault must not create a reward transfer.');

  const purchaseRequestId = `purchase-${crypto.randomUUID()}`;
  const runConsumablePurchase = async (requestId) => {
    const groupId = crypto.randomUUID();
    const [rows] = await inSchema(sql`
      WITH duplicate AS (
        SELECT purchase_request_id, child_slot_id, sku, diamond_cost FROM item_purchase_requests
        WHERE purchase_request_id = ${requestId} AND parent_id = ${parentId}
      ), wallet AS (
        SELECT wallet.id, wallet.balance FROM wallet_accounts wallet
        JOIN child_wallet_slots slot ON slot.id = wallet.child_slot_id
        WHERE slot.id = ${slotId} AND slot.parent_id = ${parentId} AND slot.status = 'active'
        FOR UPDATE
      ), purchased AS (
        INSERT INTO item_purchase_requests
          (purchase_request_id, parent_id, child_slot_id, sku, diamond_cost, ledger_transaction_group_id)
        SELECT ${requestId}, ${parentId}, ${slotId}, 'double_regen', 15, ${groupId}
        WHERE NOT EXISTS (SELECT 1 FROM duplicate)
          AND COALESCE((SELECT balance FROM wallet), 0) >= 15
        RETURNING purchase_request_id, child_slot_id, sku, diamond_cost, ledger_transaction_group_id
      ), debit AS (
        UPDATE wallet_accounts SET balance = balance - 15, version = version + 1, updated_at = NOW()
        WHERE id = (SELECT id FROM wallet) AND EXISTS (SELECT 1 FROM purchased)
        RETURNING id
      ), ledger AS (
        INSERT INTO wallet_ledger (id, transaction_group_id, wallet_id, direction, amount, reason, external_reference)
        SELECT ${crypto.randomUUID()}, purchased.ledger_transaction_group_id, debit.id, 'debit', purchased.diamond_cost, 'item_purchase', purchased.sku
        FROM debit, purchased
      )
      SELECT purchase_request_id, child_slot_id, sku, diamond_cost, FALSE AS already_processed FROM purchased
      UNION ALL
      SELECT purchase_request_id, child_slot_id, sku, diamond_cost, TRUE AS already_processed FROM duplicate
      LIMIT 1
    `);
    return rows;
  };

  const firstPurchase = await runConsumablePurchase(purchaseRequestId);
  assert.equal(firstPurchase[0]?.already_processed, false);
  const repeatedPurchase = await runConsumablePurchase(purchaseRequestId);
  assert.equal(repeatedPurchase[0]?.already_processed, true);

  const closeRequestId = `close-${crypto.randomUUID()}`;
  const runClose = async (requestId) => {
    const groupId = crypto.randomUUID();
    const [, rows] = await inSchema(
      sql`SELECT id FROM child_wallet_slots WHERE id = ${slotId} AND parent_id = ${parentId} FOR UPDATE`,
      sql`
        WITH duplicate AS (
          SELECT id, closure_returned_diamonds AS returned FROM child_wallet_slots
          WHERE id = ${slotId} AND parent_id = ${parentId}
            AND status = 'closed' AND close_request_id = ${requestId}
        ), vault AS MATERIALIZED (
          SELECT id FROM wallet_accounts
          WHERE parent_id = ${parentId} AND wallet_type = 'parent_vault' FOR UPDATE
        ), child AS MATERIALIZED (
          SELECT wallet.id, wallet.balance FROM wallet_accounts wallet
          JOIN child_wallet_slots slot ON slot.id = wallet.child_slot_id
          WHERE slot.id = ${slotId} AND slot.parent_id = ${parentId} AND slot.status = 'active'
            AND EXISTS (SELECT 1 FROM vault) FOR UPDATE
        ), debit AS (
          UPDATE wallet_accounts SET balance = 0, version = version + 1, updated_at = NOW()
          WHERE id = (SELECT id FROM child) RETURNING id
        ), credit AS (
          UPDATE wallet_accounts SET balance = balance + COALESCE((SELECT balance FROM child), 0), version = version + 1, updated_at = NOW()
          WHERE id = (SELECT id FROM vault) AND EXISTS (SELECT 1 FROM child) RETURNING id
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
          WHERE id = ${slotId} AND parent_id = ${parentId} AND status = 'active'
            AND EXISTS (SELECT 1 FROM child)
          RETURNING id, closure_returned_diamonds AS returned
        )
        SELECT id, returned, FALSE AS already_processed FROM closed
        UNION ALL
        SELECT id, returned, TRUE AS already_processed FROM duplicate
        LIMIT 1
      `,
    );
    return rows;
  };

  const firstClose = await runClose(closeRequestId);
  assert.equal(firstClose[0]?.already_processed, false);
  assert.equal(Number(firstClose[0]?.returned), 25);
  const repeatedClose = await runClose(closeRequestId);
  assert.equal(repeatedClose[0]?.already_processed, true);
  assert.equal(Number(repeatedClose[0]?.returned), 25);

  const [matrixRows] = await inSchema(sql`
    SELECT
      (SELECT balance FROM wallet_accounts WHERE id = ${vaultId}) AS vault_balance,
      (SELECT balance FROM wallet_accounts WHERE id = ${childWalletId}) AS child_balance,
      (SELECT count(*) FROM reward_transfers WHERE parent_id = ${parentId}) AS reward_count,
      (SELECT count(*) FROM item_purchase_requests WHERE parent_id = ${parentId}) AS purchase_count,
      (SELECT count(*) FROM wallet_ledger WHERE reason = 'mission_transfer') AS reward_ledger_count,
      (SELECT count(*) FROM wallet_ledger WHERE reason = 'item_purchase') AS purchase_ledger_count,
      (SELECT count(*) FROM wallet_ledger WHERE reason = 'profile_closure_return') AS close_ledger_count
  `);
  assert.deepEqual({
    vaultBalance: Number(matrixRows[0]?.vault_balance),
    childBalance: Number(matrixRows[0]?.child_balance),
    rewardCount: Number(matrixRows[0]?.reward_count),
    purchaseCount: Number(matrixRows[0]?.purchase_count),
    rewardLedgerCount: Number(matrixRows[0]?.reward_ledger_count),
    purchaseLedgerCount: Number(matrixRows[0]?.purchase_ledger_count),
    closeLedgerCount: Number(matrixRows[0]?.close_ledger_count),
  }, {
    vaultBalance: 85,
    childBalance: 0,
    rewardCount: 1,
    purchaseCount: 1,
    rewardLedgerCount: 2,
    purchaseLedgerCount: 1,
    closeLedgerCount: 2,
  });

  const [walletRows] = await inSchema(sql`SELECT balance FROM wallet_accounts WHERE id = ${vaultId}`);
  assert.equal(Number(walletRows[0]?.balance), 85);
  console.log('Database integration invariants passed (non-negative wallet, slot/reward/purchase/closure idempotency, insufficient funds, append-only ledger).');
  },
  drop: async () => {
    await sql.query(`DROP SCHEMA ${quotedSchema} CASCADE`);
    console.log(`Removed isolated integration schema ${schema}.`);
  },
  onCleanupError: (cleanupError) => {
    console.error(`Integration schema cleanup also failed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`);
  },
});
