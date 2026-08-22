import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppBindings } from './bindings';
import { getSql } from './database';
import { getPurchaseReconciliationReport, getWalletReconciliationMismatches } from './reconciliationService';

vi.mock('./database', () => ({ getSql: vi.fn() }));

describe('wallet reconciliation report', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns only ledger mismatches without mutating balances', async () => {
    const sql = vi.fn().mockResolvedValue([{
      wallet_id: 'wallet-1', parent_id: 'parent-1', child_slot_id: null, wallet_type: 'parent_vault',
      balance: '120', ledger_balance: '100', delta: '20', version: '4',
    }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    await expect(getWalletReconciliationMismatches({} as AppBindings, 1000)).resolves.toEqual([{
      walletId: 'wallet-1', parentId: 'parent-1', childSlotId: null, walletType: 'parent_vault',
      balance: 120, ledgerBalance: 100, delta: 20, version: 4,
    }]);
    const query = (sql.mock.calls[0][0] as TemplateStringsArray).join(' ');
    expect(query).toContain("direction = 'credit'");
    expect(query).toContain('wallet.balance <>');
    expect(query).not.toMatch(/\b(?:UPDATE|INSERT|DELETE)\b/i);
    expect(sql.mock.calls[0]).toContain(500);
  });
});

describe('purchase reconciliation report', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reports dead letters and missing ledger/subscription projections without mutating data', async () => {
    const sql = vi.fn().mockResolvedValue([
      { revenuecat_event_id: 'failed-1', product_id: 'novastars.diamonds.100', event_type: 'INITIAL_PURCHASE', processing_status: 'failed', error_code: 'DB_ERROR', has_credit_ledger: false, has_subscription: false, has_reversal: false, stale_pending: false },
      { revenuecat_event_id: 'vip-1', product_id: 'novastars.vip.monthly', event_type: 'RENEWAL', processing_status: 'processed', error_code: null, has_credit_ledger: false, has_subscription: false, has_reversal: false, stale_pending: false },
    ]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    const report = await getPurchaseReconciliationReport({} as AppBindings, 24, 500);
    expect(report).toMatchObject({ hours: 24, scannedEvents: 2, issueCount: 3 });
    expect(report.issues.map((issue) => issue.kind)).toEqual(['failed', 'missing_credit_ledger', 'missing_subscription']);
    const query = (sql.mock.calls[0][0] as TemplateStringsArray).join(' ');
    expect(query).toContain("ledger.reason = 'purchase_credit'");
    expect(query).not.toMatch(/\b(?:UPDATE|INSERT|DELETE)\b/i);
  });
});
