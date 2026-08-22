import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSql } from './database';
import { getParentZoneObservabilitySummary } from './observabilityService';
import type { AppBindings } from './bindings';

vi.mock('./database', () => ({ getSql: vi.fn() }));

describe('Parent Zone observability summary', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns aggregate-only critical metrics and clamps the window', async () => {
    const sql = vi.fn().mockResolvedValue([{
      auth_error_requests: '8', pin_denied_requests: '3', rate_limited_requests: '2',
      issued: '20', consumed: '17', expired_unconsumed: '3', failed_events: '1',
      stale_pending_events: '2', wallet_ledger_mismatches: '1', parent_id: 'must-not-leak',
    }]);
    vi.mocked(getSql).mockReturnValue(sql as unknown as ReturnType<typeof getSql>);

    const summary = await getParentZoneObservabilitySummary({} as AppBindings, 99_999);

    expect(summary).toMatchObject({
      hours: 744, status: 'critical',
      auth: { errorRequests: 8, pinDeniedRequests: 3, rateLimitedRequests: 2 },
      otp: { issued: 20, consumed: 17, expiredUnconsumed: 3 },
      purchases: { failedEvents: 1, stalePendingEvents: 2 },
      finance: { walletLedgerMismatches: 1 },
    });
    expect(JSON.stringify(summary)).not.toContain('must-not-leak');
    expect(sql).toHaveBeenCalledOnce();
  });

  it('reports healthy when all counters are zero', async () => {
    vi.mocked(getSql).mockReturnValue(vi.fn().mockResolvedValue([{}]) as unknown as ReturnType<typeof getSql>);
    const summary = await getParentZoneObservabilitySummary({} as AppBindings, 24);
    expect(summary.status).toBe('healthy');
    expect(summary.finance.walletLedgerMismatches).toBe(0);
  });
});
