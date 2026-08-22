import { expect, test, type Page } from '@playwright/test';

const openStudio = async (page: Page) => {
  await page.goto('/');
  const start = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
  try {
    await start.waitFor({ state: 'visible', timeout: 12_000 });
    await start.click({ force: true });
    await start.waitFor({ state: 'hidden', timeout: 6_000 }).catch(() => undefined);
  } catch { /* FTUE was already completed. */ }
  await page.locator('button:has-text("Hồ Sơ")').first().click({ force: true });
  await page.getByRole('button', { name: 'Mở xưởng avatar' }).click();
  await expect(page.getByRole('dialog', { name: 'Xưởng avatar' })).toBeVisible();
};

test.describe('Personalization avatar and wardrobe', () => {
  test('preview is free, purchase charges once, and ownership survives reload', async ({ page }) => {
    await openStudio(page);
    await page.evaluate(() => (window as any).__gameStore.getState().setNovaCoins(200));

    await page.getByRole('button', { name: 'Mũ', exact: true }).click();
    await page.getByRole('button', { name: /Mũ Sao Băng/ }).click();
    expect(await page.evaluate(() => (window as any).__gameStore.getState().user.novaCoins)).toBe(200);

    await page.getByRole('button', { name: /Mua & trang bị · 90 Xu/ }).click();
    expect(await page.evaluate(() => (window as any).__gameStore.getState().user.novaCoins)).toBe(110);
    await page.getByRole('button', { name: 'Trang bị', exact: true }).click();
    expect(await page.evaluate(() => (window as any).__gameStore.getState().user.novaCoins)).toBe(110);

    await page.reload();
    await page.locator('button:has-text("Hồ Sơ")').first().click({ force: true });
    await page.getByRole('button', { name: 'Mở xưởng avatar' }).click();
    await page.getByRole('button', { name: 'Mũ', exact: true }).click();
    await expect(page.getByRole('button', { name: /Mũ Sao Băng/ })).toContainText('Đã sở hữu');
  });

  test('a selected image is processed into local storage and survives reload', async ({ page }) => {
    await openStudio(page);
    await page.locator('input[type="file"][accept*="image"]').setInputFiles('public/assets/3d/bravery_badge.png');
    await expect(page.getByAltText('Xem trước ảnh mới')).toBeVisible();
    await page.getByRole('button', { name: 'Dùng ảnh' }).click();
    await expect(page.getByRole('dialog', { name: 'Xưởng avatar' }).getByAltText('Avatar local')).toBeVisible();

    await page.reload();
    await page.locator('button:has-text("Hồ Sơ")').first().click({ force: true });
    await expect(page.getByRole('button', { name: 'Mở xưởng avatar' }).getByAltText('Avatar local')).toBeVisible();
  });
});
