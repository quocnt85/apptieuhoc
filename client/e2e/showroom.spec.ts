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
  const headerBtn = page.locator('[data-testid="header-showroom-btn"]');
  if (await headerBtn.isVisible()) {
    await headerBtn.click();
  } else {
    const hangarTab = page.locator('button:has-text("Xưởng Tàu")').first();
    await hangarTab.click();
    const showroomBtn = page.locator('button:has-text("Phòng Duyệt 3D"), button:has-text("Duyệt 3D")').first();
    await showroomBtn.click();
  }
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

    // Ship 1: Nova Apex Hunter
    await safeSelect(page.locator('[data-testid="ship-select-explorer_v1"]'));
    await expect(shipTitle).toContainText('Apex', { timeout: 5000 });
    await expect(page.locator('text=Tốc độ').first()).toBeVisible();

    // Ship 2: Chrono Voyager
    await safeSelect(page.locator('[data-testid="ship-select-falcon_apex"]'));
    await expect(shipTitle).toContainText('Chrono', { timeout: 5000 });

    // Ship 3: Orion Sky-Carrier
    await safeSelect(page.locator('[data-testid="ship-select-solar_phoenix"]'));
    await expect(shipTitle).toContainText('Orion', { timeout: 5000 });

    // Ship 4: AeroShuttle X-9
    await safeSelect(page.locator('[data-testid="ship-select-starlight_runner"]'));
    await expect(shipTitle).toContainText('AeroShuttle', { timeout: 5000 });

    // Ship 5: Hyperion Star-Lifter V
    await safeSelect(page.locator('[data-testid="ship-select-astral_shuttle"]'));
    await expect(shipTitle).toContainText('Hyperion', { timeout: 5000 });
  });

  test('3. Switch to 5 Planets Mode and verify each unique planetary body', async ({ page }) => {
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

  test('4. Test Camera Presets, Wind Streamlines and Paint / Flag Customization', async ({ page }) => {
    await openShowroom(page);

    // Camera preset buttons
    await page.locator('button:has-text("Mũi Tàu")').first().click();
    await page.locator('button:has-text("Buồng Lái")').first().click();
    await page.locator('button:has-text("Động Cơ")').first().click();
    await page.locator('button:has-text("Tổng Thể")').first().click();

    // Toggle Flag
    const flagBtn = page.locator('button:has-text("Cờ VN")').first();
    await flagBtn.click();

    // Toggle Wind Streamlines button
    const windBtn = page.locator('button[title*="Vệt Gió"], button[title*="Khí Động Học"]').first();
    if (await windBtn.isVisible()) {
      await windBtn.click();
    }
  });
});
