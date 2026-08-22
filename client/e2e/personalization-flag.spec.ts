import { expect, test, type Page } from '@playwright/test';

const openFlagStudio = async (page: Page) => {
  await page.goto('/');
  const start = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
  try { await start.waitFor({ state: 'visible', timeout: 12_000 }); await start.click({ force: true }); }
  catch { /* FTUE was already completed. */ }
  await page.locator('button:has-text("HQ")').first().click({ force: true });
  await page.getByTestId('open-flag-studio').click();
  await expect(page.getByRole('dialog', { name: 'Xưởng cờ lãnh địa' })).toBeVisible();
};

test('territory flag stays local and cannot apply before parent approval', async ({ page }) => {
  await openFlagStudio(page);
  const dialog = page.getByRole('dialog', { name: 'Xưởng cờ lãnh địa' });
  await dialog.locator('input[type="file"]').setInputFiles('public/assets/3d/bravery_badge.png');
  await expect(dialog.getByAltText('Xem trước cờ mới')).toBeVisible();
  await dialog.getByRole('button', { name: 'Lưu bản nháp' }).click();
  await expect(dialog).toContainText('Bản nháp trên máy');
  await dialog.getByTestId('submit-flag-review').click();
  await expect(dialog).toContainText('Đang chờ phụ huynh duyệt');
  await expect(dialog).toContainText('Cờ chưa được gắn lên hành tinh');

  await page.reload();
  await page.locator('button:has-text("HQ")').first().click({ force: true });
  await page.getByTestId('open-flag-studio').click();
  const restoredDialog = page.getByRole('dialog', { name: 'Xưởng cờ lãnh địa' });
  await expect(restoredDialog).toContainText('Đang chờ phụ huynh duyệt');

  await page.route('**/api/v1/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const body = path.endsWith('/pin/verify') ? { success: true, unlockedUntil: new Date(Date.now() + 180_000).toISOString() }
      : path.endsWith('/wallets') ? { parentVault: 0, children: [] }
      : path.endsWith('/subscriptions') ? { subscriptions: [] }
      : { childSlotId: 'e2e-child-slot' };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await page.evaluate(() => sessionStorage.setItem('novastars_parent_session', 'e2e-token'));
  await restoredDialog.getByRole('button', { name: 'Đóng xưởng cờ' }).click();
  await page.locator('button:has-text("Phụ Huynh")').last().click({ force: true });
  await page.getByPlaceholder('Mật khẩu demo').fill('1234');
  await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
  await page.getByRole('button', { name: 'Cá nhân hóa' }).click();
  await expect(page.getByText('Đang chờ duyệt')).toBeVisible();
  await page.getByRole('button', { name: 'Duyệt & áp dụng' }).click();
  await expect(page.getByText('Đã áp dụng trong game')).toBeVisible();
  await page.getByRole('button', { name: 'Gỡ khỏi game' }).click();
  await expect(page.getByText('Bản nháp local')).toBeVisible();
});
