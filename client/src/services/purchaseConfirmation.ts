export const waitForParentVaultCredit = async (
  readBalance: () => Promise<number>,
  baseline: number,
  delays: readonly number[] = [1_500, 2_500, 4_000, 6_000, 8_000],
  pause: (milliseconds: number) => Promise<void> = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
): Promise<boolean> => {
  for (const delay of delays) {
    await pause(delay);
    try { if (await readBalance() > baseline) return true; } catch { /* transient network failure; keep polling */ }
  }
  return false;
};
