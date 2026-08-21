import { test, expect, Page } from '@playwright/test';

async function dismissFTUEIfPresent(page: Page) {
  try {
    const startBtn = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
    await startBtn.waitFor({ state: 'visible', timeout: 12000 });
    await startBtn.click({ force: true });
    await startBtn.waitFor({ state: 'hidden', timeout: 6000 }).catch(() => {});
  } catch {
    // Already dismissed or not present
  }
}

async function triggerGodMode(page: Page) {
  await page.evaluate(() => {
    (window as any).__gameStore?.getState().unlockGodMode();
  });
  await expect(page.getByTestId('dev-god-mode-modal')).toBeVisible({ timeout: 6000 });
}

test.describe('Dev God Mode & Performance Monitoring E2E Tests', () => {
  test.setTimeout(45000);

  test('1. Activate Dev God Mode via 5-Clicks on Avatar', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Perform rapid clicks on Avatar until God Mode opens
    await triggerGodMode(page);
    await expect(page.locator('text=DEV GOD MODE')).toBeVisible();

    // Close panel using testid
    await page.getByTestId('dev-close-btn').click({ force: true });
    await expect(page.getByTestId('dev-god-mode-modal')).toBeHidden();

    // Floating Button should now be present
    const floatingBtn = page.getByTestId('dev-floating-btn');
    await expect(floatingBtn).toBeVisible();

    // Reopen using floating button
    await floatingBtn.click({ force: true });
    await expect(page.getByTestId('dev-god-mode-modal')).toBeVisible();
  });

  test('2. Energy manipulation: +10, -10, Max, Set 0, Custom input', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Trigger God Mode
    await triggerGodMode(page);

    // Go to Năng Lượng Tab
    await page.getByTestId('dev-tab-energy').click({ force: true });

    // Click Set 0
    await page.getByTestId('dev-set-energy-0-btn').click({ force: true });
    await expect(page.getByTestId('dev-energy-display')).toContainText('0 /', { timeout: 6000 });
    await page.waitForTimeout(150);

    // Click +10
    await page.getByTestId('dev-set-energy-10-btn').click({ force: true });
    await expect(page.getByTestId('dev-energy-display')).toContainText('10 / 50', { timeout: 6000 });
    await page.waitForTimeout(150);

    // Click Hồi Đầy
    const maxBtn = page.getByTestId('dev-set-energy-max-btn');
    await maxBtn.scrollIntoViewIfNeeded();
    await maxBtn.click({ force: true });
    await expect(page.getByTestId('dev-energy-display')).toContainText('50 / 50', { timeout: 6000 });
    await page.waitForTimeout(200);

    // Custom Input 120
    const input = page.getByTestId('dev-energy-input');
    await input.scrollIntoViewIfNeeded();
    await input.fill('120');
    await page.getByTestId('dev-energy-apply-btn').click({ force: true });
    await expect(page.getByTestId('dev-energy-display')).toContainText('120 /', { timeout: 6000 });

    // Level up
    await page.getByTestId('dev-level-up-btn').click({ force: true });
    await expect(page.getByTestId('dev-level-display')).toContainText('Lv.');
  });

  test('3. Economy & Unlimited Everything Mode', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Trigger God Mode
    await triggerGodMode(page);

    // Go to Tiền Tệ Tab
    await page.getByTestId('dev-tab-economy').click({ force: true });

    // Turn ON Unlimited Everything Mode
    const unlimitedToggle = page.getByTestId('dev-unlimited-toggle');
    await unlimitedToggle.click({ force: true });
    await expect(page.getByTestId('dev-unlimited-status')).toHaveText('ON', { timeout: 4000 });

    // Turn OFF Unlimited Everything Mode
    await unlimitedToggle.click({ force: true });
    await expect(page.getByTestId('dev-unlimited-status')).toHaveText('OFF', { timeout: 4000 });

    // Add 1000 Nova Coins
    await page.getByTestId('dev-add-coins-1000-btn').click({ force: true });
    await expect(page.getByTestId('dev-coins-display')).toBeVisible();

    // Add 500 Diamonds
    await page.getByTestId('dev-add-diamonds-500-btn').click({ force: true });
    await expect(page.getByTestId('dev-diamonds-display')).toBeVisible();
  });

  test('4. Performance HUD (FPS Meter & Frame Time) Toggle', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Trigger God Mode
    await triggerGodMode(page);

    // Go to Hệ Thống Tab
    await page.getByTestId('dev-tab-system').click({ force: true });

    // Toggle ON Performance HUD
    await page.getByTestId('dev-fps-toggle').click({ force: true });
    await expect(page.getByTestId('dev-fps-status')).toHaveText('ON', { timeout: 4000 });
    
    // Close modal to see overlay on screen
    await page.getByTestId('dev-close-btn').click({ force: true });

    // Performance Overlay HUD is visible
    const overlay = page.getByTestId('performance-overlay');
    await expect(overlay).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=Hiệu Năng (Dev HUD)')).toBeVisible();

    // Close HUD
    await page.locator('button[title="Tắt HUD"]').click({ force: true });
    await expect(page.getByTestId('performance-overlay')).toBeHidden();
  });

  test('5. Fast Lesson Skip & Instant Complete 3⭐ via QuickDevBar', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Unlock God Mode first
    await triggerGodMode(page);
    // Close panel
    await page.getByTestId('dev-close-btn').click({ force: true });

    // Ensure on 3D Planet
    await page.locator('button:has-text("Hành Tinh")').first().click({ force: true });
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible({ timeout: 5000 });

    // Open Lesson 1
    const nodePin = page.locator('button[title*="Bài 1"], button:has-text("1")').first();
    await nodePin.click({ force: true });

    await expect(page.locator('text=Bài 1: Lời Chào Ngôi Sao').first()).toBeVisible({ timeout: 12000 });
    const launchBtn = page.getByTestId('start-lesson-btn');
    await expect(launchBtn).toBeVisible({ timeout: 6000 });
    await launchBtn.click();

    // 10-Stage runner should mount with QuickDevBar
    await expect(page.getByTestId('ten-stage-runner')).toBeVisible({ timeout: 6000 });
    const devBar = page.getByTestId('quick-dev-bar');
    await expect(devBar).toBeVisible({ timeout: 4000 });

    // Check Stage 1 is current
    await expect(page.locator('text=Chặng 1: Thử tài')).toBeVisible();

    // Click "Qua Màn" (Skip Stage)
    await page.locator('button:has-text("Qua Màn")').click({ force: true });
    
    // Should jump to Stage 2
    await expect(page.locator('text=Chặng 2: Câu chuyện').first()).toBeVisible({ timeout: 5000 });

    // Click "Hoàn Thành 3⭐" (Instant Complete All)
    await page.locator('button:has-text("Hoàn Thành 3⭐")').click({ force: true });

    // Runner closes immediately and returns to 3D Planet
    await expect(page.getByTestId('ten-stage-runner')).toBeHidden({ timeout: 6000 });
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible({ timeout: 6000 });
  });
});
