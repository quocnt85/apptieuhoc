import { test, expect, Page, Locator } from '@playwright/test';

async function dismissFTUEIfPresent(page: Page) {
  try {
    const startBtn = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
    await startBtn.waitFor({ state: 'visible', timeout: 8000 });
    await startBtn.click({ force: true });
    await startBtn.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  } catch {
    // Already dismissed or not present
  }
}

async function openShowroom(page: Page) {
  // Trigger God Mode via window store helper
  await page.evaluate(() => {
    (window as any).__gameStore?.getState().unlockGodMode();
  });
  
  // Wait for Dev God Mode Modal
  const godModal = page.locator('[data-testid="dev-god-mode-modal"]');
  await expect(godModal).toBeVisible({ timeout: 6000 });
  
  // Go to Progression Tab
  await page.locator('[data-testid="dev-tab-progression"]').click({ force: true });
  
  // Click Open Showroom button
  const showroomBtn = page.locator('[data-testid="dev-open-showroom-btn"]');
  await expect(showroomBtn).toBeVisible({ timeout: 5000 });
  await showroomBtn.click({ force: true });
  
  await expect(page.locator('text=Phòng Duyệt 3D Không Gian').first()).toBeVisible({ timeout: 10000 });
}

async function safeSelect(loc: Locator) {
  await loc.scrollIntoViewIfNeeded();
  await loc.click();
}

test.describe('3D Space Fleet & Planet Showroom E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);
  });

  test('1. Navigate to Duyệt 3D Showroom via Header / Hangar', async ({ page }) => {
    await openShowroom(page);
    await expect(page.locator('text=5 Phi Thuyền').first()).toBeVisible({ timeout: 5000 });
  });

  test('2. Browse all 5 Aerodynamic Spaceships and check aerodynamic specs', async ({ page }) => {
    await openShowroom(page);

    const shipTitle = page.locator('[data-testid="showroom-ship-title"]');

    // Ship 1: Bạch Đằng Interceptor
    await safeSelect(page.locator('[data-testid="ship-select-explorer_v1"]'));
    await expect(shipTitle).toContainText('Bạch Đằng', { timeout: 5000 });
    await expect(page.locator('text=Tốc độ').first()).toBeVisible();

    // Ship 2: Chi Lăng Voyager
    await safeSelect(page.locator('[data-testid="ship-select-falcon_apex"]'));
    await expect(shipTitle).toContainText('Chi Lăng', { timeout: 5000 });

    // Ship 3: Chiến Hạm Điện Biên Phủ (solar_phoenix)
    await safeSelect(page.locator('[data-testid="ship-select-solar_phoenix"]'));
    await expect(shipTitle).toContainText('Điện Biên Phủ', { timeout: 5000 });

    // Ship 4: Tàu Con Thoi Ngọc Hồi (starlight_runner)
    await safeSelect(page.locator('[data-testid="ship-select-starlight_runner"]'));
    await expect(shipTitle).toContainText('Ngọc Hồi', { timeout: 5000 });

    // Ship 5: Quảng Trị Star-Lifter
    await safeSelect(page.locator('[data-testid="ship-select-astral_shuttle"]'));
    await expect(shipTitle).toContainText('Quảng Trị', { timeout: 5000 });
  });

  test('3. Switch to 5 Planets Mode and verify each unique planetary body', async ({ page }) => {
    test.setTimeout(90000);
    await openShowroom(page);

    // Click 5 Hành Tinh tab button in showroom
    const planetsModeBtn = page.locator('[data-testid="showroom-tab-planets"]');
    await safeSelect(planetsModeBtn);
    await expect(page.locator('text=5 Tinh Cầu').first()).toBeVisible({ timeout: 5000 });

    const planetTitle = page.locator('[data-testid="showroom-planet-title"]');

    // Planet 1: Bravery Prime (Terrestrial)
    await safeSelect(page.locator('[data-testid="planet-select-bravery_prime"]'));
    await expect(planetTitle).toContainText('Dũng Khí', { timeout: 5000 });

    // Planet 2: Aqua Nova (Ocean)
    await safeSelect(page.locator('[data-testid="planet-select-aqua_nova"]'));
    await expect(planetTitle).toContainText('Đại Dương', { timeout: 5000 });

    // Planet 3: Storm Giant (Gas Giant)
    await safeSelect(page.locator('[data-testid="planet-select-storm_giant"]'));
    await expect(planetTitle).toContainText('Bão Táp', { timeout: 5000 });

    // Planet 4: Frost Aegis (Ice)
    await safeSelect(page.locator('[data-testid="planet-select-frost_aegis"]'));
    await expect(planetTitle).toContainText('Băng Vĩnh Cửu', { timeout: 5000 });

    // Planet 5: Magma Ignis (Magma)
    await safeSelect(page.locator('[data-testid="planet-select-magma_ignis"]'));
    await expect(planetTitle).toContainText('Dung Nham', { timeout: 5000 });
  });

  test('4. Test Camera Presets, Wind Streamlines and Paint Customization', async ({ page }) => {
    await openShowroom(page);

    // Camera preset buttons
    await page.locator('button:has-text("Mũi Tàu")').first().click();
    await page.locator('button:has-text("Buồng Lái")').first().click();
    await page.locator('button:has-text("Động Cơ")').first().click();
    await page.locator('button:has-text("Tổng Thể")').first().click();

    // Toggle Wind Streamlines button
    const windBtn = page.locator('button[title*="Vệt Gió"], button[title*="Khí Động Học"]').first();
    if (await windBtn.isVisible()) {
      await windBtn.click();
    }
  });

  test('5. Hangar shows clean thumbnails, differentiated stats, and no separate Màu & Cờ tab', async ({ page }) => {
    // Navigate to Xưởng Tàu
    await page.locator('button:has-text("Xưởng Tàu")').first().click({ force: true });
    await expect(page.locator('text=Xưởng Tàu Không Gian').first()).toBeVisible({ timeout: 6000 });

    // Verify 2 sub-tabs exist
    await expect(page.locator('button:has-text("Phi Thuyền Không Gian")')).toBeVisible();
    await expect(page.locator('button:has-text("Năng Lượng & Tiện Ích")')).toBeVisible();

    // Verify separate "Màu & Cờ" tab is REMOVED from top switcher
    await expect(page.locator('button:has-text("Màu & Cờ")')).toBeHidden();

    // Check Bạch Đằng (Speed 98, Shield 42, Power 65)
    await expect(page.locator('text=Tàu Tiên Phong Bạch Đằng').first()).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=⚡ 98').first()).toBeVisible();
    await expect(page.locator('text=🛡️ 42').first()).toBeVisible();
    await expect(page.locator('text=💥 65').first()).toBeVisible();

    // Check Điện Biên Phủ (Speed 40, Shield 99, Power 90)
    await expect(page.locator('text=Chiến Hạm Điện Biên Phủ').first()).toBeVisible();
    await expect(page.locator('text=⚡ 40').first()).toBeVisible();
    await expect(page.locator('text=🛡️ 99').first()).toBeVisible();

    // Check Placeholder ship: Chương Dương (Sắp Ra Mắt)
    await expect(page.locator('text=Tuần Dương Hạm Chương Dương').first()).toBeVisible();
    await expect(page.locator('text=Sắp Ra Mắt').first()).toBeVisible();
  });

  test('6. Open Ship 3D Modal with Real-time Paint Palette & Gold color locked at 250 Coins', async ({ page }) => {
    await page.locator('button:has-text("Xưởng Tàu")').first().click({ force: true });

    // Click on Bạch Đằng ship card to open 3D interactive modal
    await page.locator('text=Tàu Tiên Phong Bạch Đằng').first().click({ force: true });

    // Modal opens with 3D canvas and hint
    await expect(page.locator('text=Sơn Màu Phi Thuyền').first()).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=Vuốt để xoay 360°').first()).toBeVisible();

    // Check Default color (Mặc Định) swatch exists
    const defaultColorBtn = page.locator('button[title*="Mặc Định"]');
    await expect(defaultColorBtn).toBeVisible();

    // Check Gold color (Vàng Hoàng Kim) swatch exists and shows 250 🟡
    const goldColorBtn = page.locator('button[title*="Vàng Hoàng Kim"]');
    await expect(goldColorBtn).toBeVisible();
    await expect(goldColorBtn).toContainText('250');

    // Click Gold color swatch -> Unlock prompt appears
    await goldColorBtn.click({ force: true });
    await expect(page.locator('text=Màu này cần mở khóa:').first()).toBeVisible({ timeout: 4000 });
    await expect(page.locator('button:has-text("Mở Khóa (250 Xu 🟡)")').first()).toBeVisible();

    // Close modal
    await page.locator('button:has([class*="lucide-x"])').first().click({ force: true });
    await expect(page.locator('text=Sơn Màu Phi Thuyền')).toBeHidden();
  });
});
