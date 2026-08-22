import { describe, expect, it, vi } from 'vitest';
import { waitForParentVaultCredit } from '../src/services/purchaseConfirmation';

describe('purchase server-confirmation polling', () => {
  it('stays pending until a server refresh observes a larger parent vault', async () => {
    const read = vi.fn().mockResolvedValueOnce(100).mockResolvedValueOnce(100).mockResolvedValueOnce(250);
    const pause = vi.fn(async () => undefined);

    await expect(waitForParentVaultCredit(read, 100, [1, 2, 3], pause)).resolves.toBe(true);
    expect(read).toHaveBeenCalledTimes(3);
    expect(pause.mock.calls).toEqual([[1], [2], [3]]);
  });

  it('returns pending after bounded retries and tolerates transient fetch errors', async () => {
    const read = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(100);
    await expect(waitForParentVaultCredit(read, 100, [0, 0], async () => undefined)).resolves.toBe(false);
    expect(read).toHaveBeenCalledTimes(2);
  });
});
