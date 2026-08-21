import { test, expect, Page } from '@playwright/test';

async function dismissFTUEIfPresent(page: Page) {
  try {
    const startBtn = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
    await startBtn.waitFor({ state: 'visible', timeout: 10000 });
    await startBtn.click({ force: true });
    await startBtn.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  } catch {
    // Already dismissed or not present
  }
}

async function navigateToHomeTab(page: Page) {
  const homeTab = page.locator('button:has-text("Trang Chủ")');
  await homeTab.click({ force: true });
  await expect(page.locator('text=Nhiệm Vụ Hằng Ngày').first()).toBeVisible({ timeout: 5000 });
}

test.describe('Daily Quests & State Reset E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('1. Initial / Reset state has 0/3 quests completed and no pre-checked boxes', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);
    await navigateToHomeTab(page);

    // Verify 0/3 Done
    await expect(page.locator('text=0/3 Đã Xong').first()).toBeVisible({ timeout: 5000 });

    // Verify Quests
    await expect(page.locator('text=Hoàn thành 1 bài học kỹ năng tinh cầu').first()).toBeVisible();
    await expect(page.locator('text=Thực hành chào hỏi lễ phép ngoài đời thực').first()).toBeVisible();
    await expect(page.locator('text=Lái phi thuyền thu thập 10 sao').first()).toBeVisible();

    // Verify progress badges & action buttons
    await expect(page.locator('text=0/10').first()).toBeVisible();
    await expect(page.locator('button:has-text("Phụ huynh duyệt"), span:has-text("Phụ huynh duyệt")').first()).toBeVisible();

    // Verify no line-through text on quest titles
    const questCards = page.locator('div:has-text("Nhiệm Vụ Hằng Ngày")').locator('.line-through');
    await expect(questCards).toHaveCount(0);
  });

  test('2. Parent Greeting Quest flow via 4-digit PIN (1234)', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);
    await navigateToHomeTab(page);

    // Click on Greeting quest
    const greetingQuestBtn = page.locator('text=Thực hành chào hỏi lễ phép ngoài đời thực').first();
    await greetingQuestBtn.click({ force: true });

    // Verify Parent Auth Modal
    await expect(page.locator('text=Phụ Huynh Duyệt').first()).toBeVisible({ timeout: 5000 });

    // Enter PIN: 1, 2, 3, 4
    await page.locator('button:has-text("1")').last().click({ force: true });
    await page.locator('button:has-text("2")').last().click({ force: true });
    await page.locator('button:has-text("3")').last().click({ force: true });
    await page.locator('button:has-text("4")').last().click({ force: true });

    // Verify PIN verified view
    await expect(page.locator('text=PIN Hợp Lệ!').first()).toBeVisible({ timeout: 5000 });

    // Click Confirm button
    const confirmBtn = page.locator('button:has-text("Duyệt & Nhận Thưởng")').first();
    await confirmBtn.click({ force: true });

    // Verify Reward toast & Quest Done status (1/3 Đã Xong)
    await expect(page.locator('text=1/3 Đã Xong').first()).toBeVisible({ timeout: 5000 });
  });

  test('3. Reset All Progress via Dev God Mode resets quests back to 0/3', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);
    await navigateToHomeTab(page);

    // 1. Complete greeting quest first
    await page.locator('text=Thực hành chào hỏi lễ phép ngoài đời thực').first().click({ force: true });
    await expect(page.locator('text=Phụ Huynh Duyệt').first()).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("1")').last().click({ force: true });
    await page.locator('button:has-text("2")').last().click({ force: true });
    await page.locator('button:has-text("3")').last().click({ force: true });
    await page.locator('button:has-text("4")').last().click({ force: true });
    await expect(page.locator('text=PIN Hợp Lệ!').first()).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Duyệt & Nhận Thưởng")').first().click({ force: true });

    await expect(page.locator('text=1/3 Đã Xong').first()).toBeVisible({ timeout: 5000 });

    // 2. Trigger Dev God Mode and open modal
    await page.evaluate(() => {
      (window as any).__gameStore?.getState().unlockGodMode();
    });
    await expect(page.getByTestId('dev-god-mode-modal')).toBeVisible({ timeout: 6000 });

    // Switch to System Tab
    await page.locator('button:has-text("Hệ Thống")').first().click({ force: true });
    await expect(page.locator('text=Khôi Phục Mặc Định').first()).toBeVisible({ timeout: 5000 });

    // Handle confirm dialog & reset
    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('button:has-text("Xóa Dữ Liệu & Reset Tài Khoản")').first().click({ force: true });

    // Close Dev panel
    await page.getByTestId('dev-close-btn').click({ force: true });

    // Navigate to Home tab
    await navigateToHomeTab(page);

    // Verify 0/3 Đã Xong after reset
    await expect(page.locator('text=0/3 Đã Xong').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=0/10').first()).toBeVisible();
  });
});
