import { test, expect, Page } from '@playwright/test';

async function dismissFTUEIfPresent(page: Page) {
  try {
    const startBtn = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
    await startBtn.waitFor({ state: 'visible', timeout: 12000 });
    await startBtn.click({ force: true });
    await startBtn.waitFor({ state: 'hidden', timeout: 6000 }).catch(() => {});
  } catch {
    // Already dismissed
  }
}

test.describe('5 Planets Interactive Navigation & Locked Planet Exploration E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);
  });

  test('1. Planet Navigation Bar renders all 5 planets with icons and status', async ({ page }) => {
    // Go to Planet View
    await page.locator('button:has-text("Hành Tinh")').first().click({ force: true });

    // Check 5 planet items in top bar
    const braveryItem = page.locator('[data-testid="planet-nav-item-bravery_prime"]');
    const aquaItem = page.locator('[data-testid="planet-nav-item-aqua_nova"]');
    const stormItem = page.locator('[data-testid="planet-nav-item-storm_giant"]');
    const frostItem = page.locator('[data-testid="planet-nav-item-frost_aegis"]');
    const magmaItem = page.locator('[data-testid="planet-nav-item-magma_ignis"]');

    await expect(braveryItem).toBeVisible({ timeout: 5000 });
    await expect(aquaItem).toBeVisible({ timeout: 5000 });
    await expect(stormItem).toBeVisible({ timeout: 5000 });
    await expect(frostItem).toBeVisible({ timeout: 5000 });
    await expect(magmaItem).toBeVisible({ timeout: 5000 });

    // Verify Bravery Prime is initially active and unlocked
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible();
    await expect(page.locator('text=Đang Khai Phá').first()).toBeVisible();
  });

  test('2. Navigate between all 5 planets using Prev / Next arrow buttons', async ({ page }) => {
    test.setTimeout(60000);
    await page.locator('button:has-text("Hành Tinh")').first().click({ force: true });

    const nextBtn = page.locator('[data-testid="planet-nav-next-btn"]');
    const prevBtn = page.locator('[data-testid="planet-nav-prev-btn"]');

    // Click Next -> Switch to Aqua Nova
    await nextBtn.click({ force: true });
    await expect(page.locator('text=Tinh Cầu Đại Dương').first()).toBeVisible({ timeout: 8000 });

    // Click Next -> Switch to Storm Giant
    await nextBtn.click({ force: true });
    await expect(page.locator('text=Tinh Cầu Bão Táp').first()).toBeVisible({ timeout: 8000 });

    // Click Next -> Switch to Frost Aegis
    await nextBtn.click({ force: true });
    await expect(page.locator('text=Tinh Cầu Băng Vĩnh Cửu').first()).toBeVisible({ timeout: 8000 });

    // Click Next -> Switch to Magma Ignis
    await nextBtn.click({ force: true });
    await expect(page.locator('text=Tinh Cầu Dung Nham').first()).toBeVisible({ timeout: 8000 });

    // Click Prev -> Back to Frost Aegis
    await prevBtn.click({ force: true });
    await expect(page.locator('text=Tinh Cầu Băng Vĩnh Cửu').first()).toBeVisible({ timeout: 8000 });
  });

  test('3. Travel to Locked Planet and verify 3D spaceship coordinates navigation & Cockpit notice', async ({ page }) => {
    test.setTimeout(60000);
    await page.locator('button:has-text("Hành Tinh")').first().click({ force: true });

    // Select Locked Planet: Aqua Nova
    const aquaItem = page.locator('[data-testid="planet-nav-item-aqua_nova"]');
    await aquaItem.click({ force: true });

    // Check header and status badge
    await expect(page.locator('text=Tinh Cầu Đại Dương').first()).toBeVisible({ timeout: 8000 });
    const lockBadge = page.locator('[data-testid="planet-status-badge"]');
    await expect(lockBadge).toBeVisible();
    await expect(lockBadge).toContainText('Chưa Mở Khóa');

    // Click on coordinate node 1 on Aqua Nova (force: true on 3D canvas)
    const nodePin = page.locator('button[title*="Bài 1"], button:has-text("1")').first();
    await nodePin.click({ force: true });

    // Wait for spaceship to fly and arrive -> Cockpit Dashboard appears
    await expect(page.locator('text=Bài 1: Giữ Gìn Vệ Sinh').first()).toBeVisible({ timeout: 12000 });
    await expect(page.locator('text=CHƯA MỞ KHÓA BÀI HỌC 🔒').first()).toBeVisible({ timeout: 5000 });

    // Verify Start button is disabled
    const startBtn = page.getByTestId('start-lesson-btn');
    await expect(startBtn).toBeDisabled();

    // Verify quick return button to Bravery Prime exists
    const returnBtn = page.locator('button:has-text("Về Tinh Cầu Dũng Khí")');
    await expect(returnBtn).toBeVisible();

    // Click Return button -> Back to Bravery Prime
    await returnBtn.click({ force: true });
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible({ timeout: 8000 });
  });

  test('4. Arriving at Boss node triggers Red Alert NGUY HIỂM overlay and Boss battle button', async ({ page }) => {
    test.setTimeout(60000);
    // Unlock all coordinates for test exploration
    await page.evaluate(() => {
      (window as any).__gameStore?.getState().unlockAllPlanetNodes();
    });

    await page.locator('button:has-text("Hành Tinh")').first().click({ force: true });
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible({ timeout: 5000 });

    // Click Boss node pin (with Crown icon 👑)
    const bossPin = page.locator('button[title*="Boss"], button:has-text("👑")').first();
    await bossPin.click({ force: true });

    // Wait for spaceship flight & arrival
    await expect(page.locator('text=Boss: Rồng Dũng Cảm').first()).toBeVisible({ timeout: 15000 });

    // Verify Red Alert "NGUY HIỂM" overlay appears
    const redAlert = page.getByTestId('boss-red-alert-overlay');
    await expect(redAlert).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=NGUY HIỂM').first()).toBeVisible();

    // Verify Boss battle button is active
    const startBtn = page.getByTestId('start-lesson-btn');
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toContainText('BẮT ĐẦU ĐẤU BOSS');
  });
});
