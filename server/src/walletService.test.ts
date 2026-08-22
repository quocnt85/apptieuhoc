import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppBindings } from './bindings';
import { getSql } from './database';
import { AppError } from './errors';
import { closeChildSlot, createChildSlot, getWalletSummary, purchaseItem, transferReward } from './walletService';

vi.mock('./database', () => ({ getSql: vi.fn() }));

const env = {} as AppBindings;
const parentId = '11111111-1111-4111-8111-111111111111';
const childSlotId = '22222222-2222-4222-8222-222222222222';
const otherChildSlotId = '33333333-3333-4333-8333-333333333333';

const sqlMock = (...results: Array<unknown>) => {
  const sql = vi.fn();
  for (const result of results) {
    if (result instanceof Error) sql.mockRejectedValueOnce(result);
    else sql.mockResolvedValueOnce(result);
  }
  vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);
  return sql;
};

const expectAppError = async (promise: Promise<unknown>, code: string) => {
  try { await promise; throw new Error('Expected request to fail.'); }
  catch (error) {
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).status).toBe(409);
    expect((error as AppError).code).toBe(code);
  }
};

describe('wallet idempotency contract', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keeps a zero-diamond mission local without accessing the database', async () => {
    await expect(transferReward(env, parentId, childSlotId, 'mission:zero', 0)).resolves.toEqual({
      rewardRequestId: 'mission:zero', diamonds: 0, alreadyProcessed: false,
    });
    expect(getSql).not.toHaveBeenCalled();
  });

  it('returns versioned server-authoritative wallet projections scoped by parent', async () => {
    const sql = sqlMock([
      { child_slot_id: null, wallet_type: 'parent_vault', balance: '500', version: '7' },
      { child_slot_id: childSlotId, wallet_type: 'child_diamonds', balance: '25', version: '3' },
    ]);
    await expect(getWalletSummary(env, parentId)).resolves.toEqual({
      parentVault: 500,
      parentVaultVersion: 7,
      children: [{ childSlotId, balance: 25, version: 3 }],
    });
    expect(String(sql.mock.calls[0][0])).toContain('wallet.parent_id');
  });

  it('serializes child-slot creation on the parent row before enforcing the four-profile limit', async () => {
    const tx = vi.fn()
      .mockResolvedValueOnce([{ id: parentId }])
      .mockResolvedValueOnce([{ id: childSlotId }]);
    const sql = vi.fn() as ReturnType<typeof vi.fn> & { transaction: ReturnType<typeof vi.fn> };
    sql.transaction = vi.fn(async (callback: (query: typeof tx) => Promise<unknown>[]) => Promise.all(callback(tx)));
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    await expect(createChildSlot(env, parentId, 'profile:12345678')).resolves.toEqual({ childSlotId });
    expect(sql.transaction).toHaveBeenCalledTimes(1);
    expect(tx).toHaveBeenCalledTimes(2);
    expect(String(tx.mock.calls[0][0])).toContain('FOR UPDATE');
  });

  it('recovers concurrent child-slot creation using the existing idempotent slot', async () => {
    const conflict = Object.assign(new Error('duplicate key'), { code: '23505' });
    const sql = vi.fn().mockResolvedValueOnce([{ id: childSlotId }]) as ReturnType<typeof vi.fn> & { transaction: ReturnType<typeof vi.fn> };
    sql.transaction = vi.fn().mockRejectedValue(conflict);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    await expect(createChildSlot(env, parentId, 'profile:12345678')).resolves.toEqual({ childSlotId });
    expect(sql).toHaveBeenCalledTimes(1);
  });

  it('returns the same child-slot closure result when a delete request is retried', async () => {
    const tx = vi.fn()
      .mockResolvedValueOnce([{ id: childSlotId, status: 'closed', close_request_id: 'profile-close:child-a', closure_returned_diamonds: 40 }])
      .mockResolvedValueOnce([{ id: childSlotId, returned: 40, already_processed: true }]);
    const sql = vi.fn() as ReturnType<typeof vi.fn> & { transaction: ReturnType<typeof vi.fn> };
    sql.transaction = vi.fn(async (callback: (query: typeof tx) => Promise<unknown>[]) => Promise.all(callback(tx)));
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    await expect(closeChildSlot(env, parentId, childSlotId, 'profile-close:child-a')).resolves.toEqual({ childSlotId, returnedDiamonds: 40, alreadyProcessed: true });
  });

  it('rejects reuse of a closed child slot with another deletion request ID', async () => {
    const tx = vi.fn()
      .mockResolvedValueOnce([{ id: childSlotId, status: 'closed', close_request_id: 'profile-close:child-a', closure_returned_diamonds: 40 }])
      .mockResolvedValueOnce([]);
    const sql = vi.fn() as ReturnType<typeof vi.fn> & { transaction: ReturnType<typeof vi.fn> };
    sql.transaction = vi.fn(async (callback: (query: typeof tx) => Promise<unknown>[]) => Promise.all(callback(tx)));
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    await expectAppError(closeChildSlot(env, parentId, childSlotId, 'profile-close:child-b'), 'IDEMPOTENCY_KEY_REUSED');
  });

  it('returns the original reward only when replay payload is identical', async () => {
    sqlMock([{ reward_request_id: 'mission:12345678', child_slot_id: childSlotId, diamond_amount: 25, already_processed: true }]);
    await expect(transferReward(env, parentId, childSlotId, 'mission:12345678', 25)).resolves.toMatchObject({ diamonds: 25, alreadyProcessed: true });
  });

  it('rejects reuse of a reward request ID with another amount or child', async () => {
    sqlMock([{ reward_request_id: 'mission:12345678', child_slot_id: childSlotId, diamond_amount: 25, already_processed: true }]);
    await expectAppError(transferReward(env, parentId, childSlotId, 'mission:12345678', 50), 'IDEMPOTENCY_KEY_REUSED');
    sqlMock([{ reward_request_id: 'mission:12345678', child_slot_id: childSlotId, diamond_amount: 25, already_processed: true }]);
    await expectAppError(transferReward(env, parentId, otherChildSlotId, 'mission:12345678', 25), 'IDEMPOTENCY_KEY_REUSED');
  });

  it('recovers a concurrent unique-key race and returns the committed reward', async () => {
    const conflict = Object.assign(new Error('duplicate key'), { code: '23505' });
    const sql = sqlMock(conflict, [{ reward_request_id: 'mission:12345678', child_slot_id: childSlotId, diamond_amount: 25, already_processed: true }]);
    await expect(transferReward(env, parentId, childSlotId, 'mission:12345678', 25)).resolves.toMatchObject({ alreadyProcessed: true });
    expect(sql).toHaveBeenCalledTimes(2);
  });

  it('returns the original item purchase only when child, SKU and price match', async () => {
    sqlMock([{ purchase_request_id: 'purchase:12345678', child_slot_id: childSlotId, sku: 'boss_pass', diamond_cost: 20, already_processed: true }]);
    await expect(purchaseItem(env, parentId, childSlotId, 'purchase:12345678', 'boss_pass')).resolves.toMatchObject({ sku: 'boss_pass', diamondCost: 20, alreadyProcessed: true });
  });

  it('rejects reuse of a purchase request ID for another child or SKU', async () => {
    sqlMock([{ purchase_request_id: 'purchase:12345678', child_slot_id: childSlotId, sku: 'boss_pass', diamond_cost: 20, already_processed: true }]);
    await expectAppError(purchaseItem(env, parentId, otherChildSlotId, 'purchase:12345678', 'boss_pass'), 'IDEMPOTENCY_KEY_REUSED');
    sqlMock([{ purchase_request_id: 'purchase:12345678', child_slot_id: childSlotId, sku: 'boss_pass', diamond_cost: 20, already_processed: true }]);
    await expectAppError(purchaseItem(env, parentId, childSlotId, 'purchase:12345678', 'instant_refuel'), 'IDEMPOTENCY_KEY_REUSED');
  });

  it('does not turn unrelated database errors into idempotency responses', async () => {
    const unavailable = Object.assign(new Error('connection lost'), { code: '08006' });
    sqlMock(unavailable);
    await expect(transferReward(env, parentId, childSlotId, 'mission:12345678', 25)).rejects.toBe(unavailable);
  });
});
