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
  await loc.click({ force: true, noWaitAfter: true, timeout: 10000 });
}

test.describe('3D Space Fleet & Planet Showroom E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);
  });

  test('1. Navigate to Duyệt 3D Showroom via Header / Hangar', async ({ page }) => {
    await openShowroom(page);
    await expect(page.locator('text=8 Phi Thuyền').first()).toBeVisible({ timeout: 5000 });
  });

  test('2. Browse all 8 Aerodynamic Spaceships and check aerodynamic specs', async ({ page }) => {
    test.setTimeout(90_000);
    await openShowroom(page);

    const shipTitle = page.locator('[data-testid="showroom-ship-title"]');

    // Ship 1: Bạch Đằng Interceptor
    await safeSelect(page.locator('[data-testid="ship-select-explorer_v1"]'));
    await expect(shipTitle).toContainText('Bạch Đằng', { timeout: 5000 });
    await expect(page.locator('text=Tốc độ').first()).toBeVisible();

    // Ship 2: Chi Lăng Voyager
    await safeSelect(page.locator('[data-testid="ship-select-falcon_apex"]'));
    await expect(shipTitle).toContainText('Chi Lăng', { timeout: 5000 });

    // Ship 3: Tàu Con Thoi Ngọc Hồi
    await safeSelect(page.locator('[data-testid="ship-select-starlight_runner"]'));
    await expect(shipTitle).toContainText('Ngọc Hồi', { timeout: 5000 });

    // Ship 4: Tuần Dương Hạm Chương Dương
    await safeSelect(page.locator('[data-testid="ship-select-chuong_duong"]'));
    await expect(shipTitle).toContainText('Chương Dương', { timeout: 5000 });

    // Ship 5: Tàu Khu Trục Quảng Trị
    await safeSelect(page.locator('[data-testid="ship-select-astral_shuttle"]'));
    await expect(shipTitle).toContainText('Quảng Trị', { timeout: 5000 });

    // Ship 6: Tàu Khảo Sát Sơn Tinh
    await safeSelect(page.locator('[data-testid="ship-select-son_tinh"]'));
    await expect(shipTitle).toContainText('Sơn Tinh', { timeout: 5000 });

    // Ship 7: Thiết Giáp Hạm Thánh Gióng
    await safeSelect(page.locator('[data-testid="ship-select-thanh_giong"]'));
    await expect(shipTitle).toContainText('Thánh Gióng', { timeout: 5000 });

    // Ship 8: Chiến Hạm Điện Biên Phủ
    await safeSelect(page.locator('[data-testid="ship-select-solar_phoenix"]'));
    await expect(shipTitle).toContainText('Điện Biên Phủ', { timeout: 5000 });
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
    await expect(page.getByRole('button', { name: 'Phi Thuyền', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Nạp Năng Lượng', exact: true })).toBeVisible();

    // Verify separate "Màu & Cờ" tab is REMOVED from top switcher
    await expect(page.locator('button:has-text("Màu & Cờ")')).toBeHidden();

    // Check Bạch Đằng (Speed 82, Shield 38, Power 36)
    await expect(page.locator('text=Tàu Tiên Phong Bạch Đằng').first()).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=⚡ 82').first()).toBeVisible();
    await expect(page.locator('text=🛡️ 38').first()).toBeVisible();
    await expect(page.locator('text=💥 36').first()).toBeVisible();

    // Check Điện Biên Phủ (Speed 50, Shield 100, Power 92)
    await expect(page.locator('text=Chiến Hạm Điện Biên Phủ').first()).toBeVisible();
    await expect(page.locator('text=⚡ 50').first()).toBeVisible();
    await expect(page.locator('text=🛡️ 100').first()).toBeVisible();

    // The complete expansion fleet is production-ready and purchasable.
    await expect(page.locator('text=Tuần Dương Hạm Chương Dương').first()).toBeVisible();
    await expect(page.locator('text=Tàu Khảo Sát Sơn Tinh').first()).toBeVisible();
    await expect(page.locator('text=Thiết Giáp Hạm Thánh Gióng').first()).toBeVisible();
    await expect(page.locator('text=Sắp Ra Mắt')).toHaveCount(0);
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
