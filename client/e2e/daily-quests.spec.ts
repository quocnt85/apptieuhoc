import { test, expect, type Page } from '@playwright/test';

async function dismissFTUEIfPresent(page: Page) {
  const start = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
  try { await start.waitFor({ state: 'visible', timeout: 10_000 }); await start.click({ force: true }); await start.waitFor({ state: 'hidden', timeout: 3_000 }); } catch { /* already dismissed */ }
}

test.describe('PRD Parent Zone regressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto('/');
    await dismissFTUEIfPresent(page);
  });

  test('home has no parent-authored real-life quest or default PIN', async ({ page }) => {
    await page.locator('button:has-text("Trang Chủ")').click({ force: true });
    await expect(page.locator('text=Nhiệm Vụ Hằng Ngày').first()).toBeVisible();
    await expect(page.locator('text=0/2 Đã Xong').first()).toBeVisible();
    await expect(page.locator('text=Thực hành chào hỏi lễ phép ngoài đời thực')).toHaveCount(0);
    await expect(page.locator('text=1234')).toHaveCount(0);
  });

  test('Parent Zone starts with verified-email flow and privacy notice', async ({ page }) => {
    const gateButton = page.getByRole('button', { name: 'Phụ huynh mở cài đặt' });
    if (await gateButton.isVisible()) await gateButton.click();
    else await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Góc phụ huynh' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.getByText('Dữ liệu học tập của trẻ chỉ lưu trên thiết bị này.')).toBeVisible();
    await expect(page.getByText('PIN mặc định')).toHaveCount(0);
  });
});
