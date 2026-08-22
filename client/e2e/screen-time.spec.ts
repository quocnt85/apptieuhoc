import { expect, test, type Page } from '@playwright/test';

async function cleanStart(page: Page) {
  await page.goto('/');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload();
  const start = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
  try { await start.waitFor({ state: 'visible', timeout: 10_000 }); await start.click({ force: true }); } catch { /* already dismissed */ }
}

async function setLimitReached(page: Page) {
  await page.evaluate(() => {
    const store = (window as any).__parentZoneStore;
    const state = store.getState();
    const profileId = state.activeProfileId;
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    store.setState({
      limits: { ...state.limits, [profileId]: { dailyMinutes: 10, curfewStart: '00:00', curfewEnd: '00:00' } },
      usage: { ...state.usage, [`${profileId}:${date}`]: { date, minutes: 10, extensionsUsed: 0 } },
    });
  });
}

async function attemptPlanetNavigationUntilBlocked(page: Page) {
  await page.getByRole('button', { name: '🪐 Hành Tinh', exact: true })
    .evaluate((element) => (element as HTMLButtonElement).click());
}

test.describe('Parent Zone screen-time boundaries', () => {
  test.beforeEach(async ({ page }) => cleanStart(page));

  test('blocks the idle child shell immediately after the daily limit is reached', async ({ page }) => {
    await setLimitReached(page);
    await attemptPlanetNavigationUntilBlocked(page);
    await expect(page.getByRole('heading', { name: 'Đến giờ nghỉ rồi' })).toBeVisible();
    await expect(page.getByText('Con đã dùng hết thời gian hôm nay.')).toBeVisible();
  });

  test('does not interrupt a running lesson and blocks immediately after it closes', async ({ page }) => {
    await page.evaluate(() => (window as any).__gameStore.getState().startLesson('island_1_node_1'));
    await setLimitReached(page);
    await expect(page.getByRole('heading', { name: 'Đến giờ nghỉ rồi' })).toHaveCount(0);

    await page.evaluate(() => (window as any).__gameStore.getState().closeLesson());
    await expect(page.getByRole('heading', { name: 'Đến giờ nghỉ rồi' })).toBeVisible();
  });

  test('does not interrupt the current mini-game screen and blocks after exit', async ({ page }) => {
    await page.getByRole('button', { name: '🎮 Mini Game', exact: true }).click();
    await setLimitReached(page);
    await expect(page.getByRole('heading', { name: 'Đến giờ nghỉ rồi' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Đóng mini game' }).click();
    await expect(page.getByRole('heading', { name: 'Đến giờ nghỉ rồi' })).toBeVisible();
  });

  test('requires a fresh parent password before extending today by 15 minutes', async ({ page }) => {
    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Thời gian', exact: true }).click();

    await page.getByRole('button', { name: 'Thêm 15 phút hôm nay' }).click();
    const reauth = page.getByRole('dialog', { name: 'Xác thực lại phụ huynh' });
    await expect(reauth).toContainText('Gia hạn thêm 15 phút hôm nay');
    await reauth.getByLabel('Mật khẩu demo').fill('123456');
    await reauth.getByRole('button', { name: 'Xác nhận' }).click();
    await expect(page.getByRole('status')).toContainText('Đã thêm 15 phút hôm nay.');

    const extensionsUsed = await page.evaluate(() => {
      const store = (window as any).__parentZoneStore;
      const state = store.getState();
      const now = new Date();
      const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      return state.usage[`${state.activeProfileId}:${date}`]?.extensionsUsed;
    });
    expect(extensionsUsed).toBe(1);
  });

  test('blocks after wall-clock rollback until a parent confirms the corrected device time', async ({ page }) => {
    await page.evaluate(() => {
      const store = (window as any).__parentZoneStore;
      const now = Date.now();
      store.setState({ clockGuard: { lastObservedAt: now + 10 * 60_000, rollbackDetected: false } });
      store.getState().syncUsageClock(false, now);
    });
    await attemptPlanetNavigationUntilBlocked(page);
    await expect(page.getByText('Giờ trên thiết bị vừa bị lùi.')).toBeVisible();
    await page.getByRole('button', { name: 'Phụ huynh mở cài đặt' }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Thời gian', exact: true }).click();
    await expect(page.getByText('Phát hiện giờ thiết bị bị lùi')).toBeVisible();

    await page.getByRole('button', { name: 'Xác nhận lại giờ thiết bị' }).click();
    const reauth = page.getByRole('dialog', { name: 'Xác thực lại phụ huynh' });
    await reauth.getByLabel('Mật khẩu demo').fill('1234');
    await reauth.getByRole('button', { name: 'Xác nhận' }).click();
    await expect(page.getByRole('status')).toContainText('Đã xác nhận lại giờ thiết bị.');
    await expect(page.getByText('Phát hiện giờ thiết bị bị lùi')).toHaveCount(0);
  });
});
