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
    await page.locator('button:has-text("HQ")').click({ force: true });
    await expect(page.locator('text=Nhiệm Vụ Hằng Ngày').first()).toBeVisible();
    await expect(page.locator('text=0/2 Đã Xong').first()).toBeVisible();
    await expect(page.locator('text=Thực hành chào hỏi lễ phép ngoài đời thực')).toHaveCount(0);
    await expect(page.locator('text=1234')).toHaveCount(0);
  });

  test('Parent Zone demo opens with review password and no email dependency', async ({ page }) => {
    const gateButton = page.getByRole('button', { name: 'Phụ huynh mở cài đặt' });
    if (await gateButton.isVisible()) await gateButton.click();
    else await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Góc phụ huynh' })).toBeVisible();
    await expect(page.getByText('Chế độ review demo')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveCount(0);
    await expect(page.getByText('Dữ liệu học tập của trẻ chỉ lưu trên thiết bị này.')).toBeVisible();
    const password = page.getByPlaceholder('Mật khẩu demo');
    await password.fill('1111');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await expect(page.getByRole('alert')).toContainText('không đúng');
    await password.fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await expect(page.getByText('DEMO', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Hồ sơ', exact: true }).click();
    await page.getByPlaceholder('Tên hiển thị local').fill('Bé Review');
    await page.getByRole('button', { name: 'Tạo hồ sơ' }).click();
    await expect(page.getByText('Bé Review', { exact: true })).toBeVisible();
  });
});
