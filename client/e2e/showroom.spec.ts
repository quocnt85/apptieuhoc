import { test, expect, Page } from '@playwright/test';

async function dismissFTUEIfPresent(page: Page) {
  try {
    const startBtn = page.locator('button:has-text("Bắt Đầu Hành Trình Ngay!")');
    await startBtn.waitFor({ state: 'visible', timeout: 7000 });
    await startBtn.click();
    await startBtn.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  } catch {
    // Already dismissed or not present
  }
}

test.describe('3D Space Fleet & Planet Showroom E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);
  });

  test('1. Navigate to Duyệt 3D Showroom via Header Button', async ({ page }) => {
    const showroomHeaderBtn = page.locator('[data-testid="header-showroom-btn"]');
    await expect(showroomHeaderBtn).toBeVisible({ timeout: 5000 });
    await showroomHeaderBtn.click();

    // Showroom header & subtitle
    await expect(page.locator('text=Phòng Duyệt 3D Không Gian').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=5 Phi Thuyền Khí Động Học').first()).toBeVisible({ timeout: 5000 });
  });

  test('2. Browse all 5 Aerodynamic Spaceships and check aerodynamic specs', async ({ page }) => {
    await page.locator('[data-testid="header-showroom-btn"]').click();

    // Ship 1: Nova Falcon V1
    const ship1 = page.locator('[data-testid="ship-select-explorer_v1"]');
    await ship1.scrollIntoViewIfNeeded();
    await ship1.click();
    await expect(page.locator('text=Tiêm Kích Siêu Thanh Nova Falcon').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Hệ Số Cản ($C_d$)').first()).toBeVisible();

    // Ship 2: Apex Phantom X
    const ship2 = page.locator('[data-testid="ship-select-falcon_apex"]');
    await ship2.scrollIntoViewIfNeeded();
    await ship2.click();
    await expect(page.locator('text=Tiêm Kích Tàng Hình Apex Phantom').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Mach 4.8').first()).toBeVisible();

    // Ship 3: Solar Phoenix S
    const ship3 = page.locator('[data-testid="ship-select-solar_phoenix"]');
    await ship3.scrollIntoViewIfNeeded();
    await ship3.click();
    await expect(page.locator('text=Trinh Sát Tiên Phong Cánh Ngược Tiến').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Linh Hoạt Tuyệt Đối').first()).toBeVisible();

    // Ship 4: Hyperion Dreadnought D-5
    const ship4 = page.locator('[data-testid="ship-select-starlight_runner"]');
    await ship4.scrollIntoViewIfNeeded();
    await ship4.click();
    await expect(page.locator('text=Chiến Hạm Thân Nâng Hyperion D-5').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Chiến Hạm Hạng Nặng').first()).toBeVisible();

    // Ship 5: Astral Shuttle Orbiter
    const ship5 = page.locator('[data-testid="ship-select-astral_shuttle"]');
    await ship5.scrollIntoViewIfNeeded();
    await ship5.click();
    await expect(page.locator('text=Tàu Con Thoi Quỹ Đạo Astral').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Chinh Phục Quỹ Đạo').first()).toBeVisible();
  });

  test('3. Switch to 5 Planets Mode and verify each unique planetary body', async ({ page }) => {
    await page.locator('[data-testid="header-showroom-btn"]').click();

    // Click 5 Hành Tinh tab button in showroom
    const planetsModeBtn = page.locator('[data-testid="showroom-tab-planets"]');
    await planetsModeBtn.click();
    await expect(page.locator('text=5 Tinh Cầu Độc Bản').first()).toBeVisible({ timeout: 5000 });

    // Planet 1: Bravery Prime (Terrestrial)
    const pl1 = page.locator('[data-testid="planet-select-bravery_prime"]');
    await pl1.scrollIntoViewIfNeeded();
    await pl1.click();
    await expect(page.locator('text=Cao nguyên đất đỏ bazan').first()).toBeVisible({ timeout: 5000 });

    // Planet 2: Aqua Nova (Ocean)
    const pl2 = page.locator('[data-testid="planet-select-aqua_nova"]');
    await pl2.scrollIntoViewIfNeeded();
    await pl2.click();
    await expect(page.locator('text=Aqua Nova').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Đại dương xanh ngọc lam bao phủ 96%').first()).toBeVisible();

    // Planet 3: Storm Giant (Gas Giant)
    const pl3 = page.locator('[data-testid="planet-select-storm_giant"]');
    await pl3.scrollIntoViewIfNeeded();
    await pl3.click();
    await expect(page.locator('text=Storm Giant').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=139,820 km').first()).toBeVisible();

    // Planet 4: Frost Aegis (Ice)
    const pl4 = page.locator('[data-testid="planet-select-frost_aegis"]');
    await pl4.scrollIntoViewIfNeeded();
    await pl4.click();
    await expect(page.locator('text=Frost Aegis').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Cực Quang').first()).toBeVisible();

    // Planet 5: Magma Ignis (Magma)
    const pl5 = page.locator('[data-testid="planet-select-magma_ignis"]');
    await pl5.scrollIntoViewIfNeeded();
    await pl5.click();
    await expect(page.locator('text=Magma Ignis').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Vỏ đá bazan đen tuyền').first()).toBeVisible();
  });

  test('4. Test Camera Presets, Wind Streamlines and Paint / Flag Customization', async ({ page }) => {
    await page.locator('[data-testid="header-showroom-btn"]').click();

    // Camera preset buttons
    await page.locator('button:has-text("Mũi Tàu")').click();
    await page.locator('button:has-text("Buồng Lái")').click();
    await page.locator('button:has-text("Động Cơ")').click();
    await page.locator('button:has-text("Tổng Thể")').click();

    // Toggle Flag
    const flagBtn = page.locator('button:has-text("Cờ VN")');
    await expect(flagBtn).toBeVisible();
    await flagBtn.click();

    // Color palette selection
    const goldColorBtn = page.locator('button[title="Vàng Hoàng Kim"]');
    if (await goldColorBtn.isVisible()) {
      await goldColorBtn.click();
    }

    // Equip current ship
    const equipBtn = page.locator('button:has-text("Trang Bị Phi Thuyền Này")');
    if (await equipBtn.isVisible()) {
      await equipBtn.click();
      await expect(page.locator('text=Đang Trang Bị').first()).toBeVisible();
    }
  });

  test('5. Open Showroom from Space Hangar View button', async ({ page }) => {
    await page.locator('button:has-text("Xưởng Tàu")').first().click();
    await expect(page.locator('text=Xưởng Tàu Không Gian').first()).toBeVisible({ timeout: 5000 });

    const openShowroomBtn = page.locator('button:has-text("Mở Phòng Duyệt 3D")');
    await expect(openShowroomBtn).toBeVisible();
    await openShowroomBtn.click();

    // Should arrive at showroom
    await expect(page.locator('text=Phòng Duyệt 3D Không Gian').first()).toBeVisible({ timeout: 5000 });
  });
});
