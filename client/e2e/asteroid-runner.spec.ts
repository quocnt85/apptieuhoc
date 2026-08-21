import { expect, Page, test } from '@playwright/test';

async function enterHome(page: Page) {
  await page.goto('/?runnerDebug=fast');
  const startFtue = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
  try {
    await startFtue.waitFor({ state: 'visible', timeout: 10_000 });
    await startFtue.click({ force: true });
  } catch {
    // Persisted test context may already have completed FTUE.
  }
  await page.getByRole('button', { name: /Trang Chủ/ }).click({ force: true });
  await expect(page.getByText('Thử Thách Phi Thuyền', { exact: true })).toBeVisible({ timeout: 10_000 });
}

test.describe('Nova Fleet: Asteroid Runner MVP', () => {
  test('iPhone X fullscreen lobby, pause-safe run and reward-once victory flow', async ({ page }) => {
    test.setTimeout(60_000);
    await enterHome(page);

    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
    expect(viewport?.height).toBe(812);
    await expect(page.getByRole('button', { name: /Mini Game/ })).toBeVisible();

    await page.getByText('Thử Thách Phi Thuyền', { exact: true }).click();
    const lobby = page.getByTestId('asteroid-runner-lobby');
    await expect(lobby).toBeVisible();
    await expect(page.getByRole('navigation')).toBeHidden();
    const lobbyRect = await lobby.boundingBox();
    expect(lobbyRect?.width).toBe(375);
    expect(lobbyRect?.height).toBe(812);
    await expect(page.getByRole('button', { name: /CẤT CÁNH/ })).toBeVisible();

    const coinsBefore = await page.evaluate(() => (window as any).__gameStore.getState().user.novaCoins as number);
    await page.getByTestId('asteroid-runner-start').click();
    const game = page.getByTestId('asteroid-runner-game');
    await expect(game).toBeVisible();

    // A relative drag must be accepted without scrolling or losing fullscreen.
    await page.mouse.move(188, 680);
    await page.mouse.down();
    await page.mouse.move(105, 590, { steps: 8 });
    await page.waitForTimeout(250);
    await page.mouse.up();
    expect(await page.evaluate(() => ({ x: scrollX, y: scrollY }))).toEqual({ x: 0, y: 0 });

    await page.getByRole('button', { name: 'Tạm dừng' }).click();
    await expect(page.getByText('Đang Tạm Dừng', { exact: true })).toBeVisible();
    const progressBeforePause = await page.getByText(/%$/).first().textContent();
    await page.waitForTimeout(900);
    const progressAfterPause = await page.getByText(/%$/).first().textContent();
    expect(progressAfterPause).toBe(progressBeforePause);
    await page.getByRole('button', { name: 'TIẾP TỤC' }).click();

    await expect(page.getByText('Dải Thiên Thạch Đã Mở!', { exact: true })).toBeVisible({ timeout: 25_000 });
    await expect(page.getByText('MISSION COMPLETE', { exact: true })).toBeVisible();

    const completed = await page.evaluate(() => {
      const state = (window as any).__gameStore.getState();
      return {
        coins: state.user.novaCoins as number,
        wins: state.miniGameProgress.totalWins as number,
        runs: state.miniGameProgress.totalRuns as number,
      };
    });
    expect(completed.coins).toBeGreaterThan(coinsBefore);
    expect(completed.wins).toBe(1);
    expect(completed.runs).toBe(1);

    await page.waitForTimeout(350);
    const coinsAfterWait = await page.evaluate(() => (window as any).__gameStore.getState().user.novaCoins as number);
    expect(coinsAfterWait).toBe(completed.coins);

    await page.getByRole('button', { name: 'VỀ TRANG CHỦ' }).click();
    await expect(page.getByText('Nhiệm Vụ Hằng Ngày', { exact: true })).toBeVisible();
  });

  test('all five production ships and weapon starts are runtime-safe', async ({ page }) => {
    test.setTimeout(70_000);
    const runtimeErrors: string[] = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(message.text());
    });
    await enterHome(page);
    await page.evaluate(() => {
      const state = (window as any).__gameStore.getState();
      state.unlockAllCosmetics();
      if (!state.isUnlimitedMode) state.toggleUnlimitedMode();
    });

    const shipNames = [
      'Tàu Tiên Phong Bạch Đằng',
      'Tuần Dương Hạm Chi Lăng',
      'Chiến Hạm Điện Biên Phủ',
      'Tàu Con Thoi Ngọc Hồi',
      'Tàu Khu Trục Quảng Trị',
    ];

    for (const shipName of shipNames) {
      await page.getByText('Thử Thách Phi Thuyền', { exact: true }).click();
      await page.getByRole('button', { name: `Chọn ${shipName}` }).click();
      await expect(page.getByRole('heading', { name: shipName })).toBeVisible();
      await page.getByTestId('asteroid-runner-start').click();
      await page.mouse.move(190, 680);
      await page.mouse.down();
      await page.mouse.move(175, 640, { steps: 3 });
      await page.waitForTimeout(240);
      await page.mouse.up();
      await page.getByRole('button', { name: 'Tạm dừng' }).click();
      await page.getByRole('button', { name: 'KẾT THÚC VÁN' }).click();
      await expect(page.getByText('Nhiệm Vụ Hằng Ngày', { exact: true })).toBeVisible();
    }

    expect(runtimeErrors).toEqual([]);
  });
});
