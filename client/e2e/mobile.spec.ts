import { test, expect, Page } from '@playwright/test';

async function dismissFTUEIfPresent(page: Page) {
  try {
    const startBtn = page.locator('button:has-text("Bắt Đầu Hành Trình Ngay!")');
    await startBtn.waitFor({ state: 'visible', timeout: 5000 });
    await startBtn.click();
    await startBtn.waitFor({ state: 'hidden', timeout: 4000 });
  } catch {
    // Already dismissed or not present
  }
}

test.describe('NovaStars Mobile UI & Touch Ergonomics E2E Tests', () => {
  test('1. App Launch, Splash Screen & Welcome FTUE flow', async ({ page }) => {
    await page.goto('/');
    // Splash screen visible initially
    await expect(page.locator('text=NOVASTARS')).toBeVisible({ timeout: 5000 });
    
    // Welcome modal appears after splash
    const welcomeModal = page.locator('text=Chào Mừng Đến NovaStars!');
    await expect(welcomeModal).toBeVisible({ timeout: 6000 });
    
    // Tap FTUE CTA button
    const startBtn = page.locator('button:has-text("Bắt Đầu Hành Trình Ngay!")');
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Should navigate to Map view
    await expect(page.getByRole('heading', { name: 'Đảo 1: Đảo Dũng Cảm' })).toBeVisible({ timeout: 4000 });
  });

  test('2. Bottom Navigation across 4 tabs with touch response', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Tab 1: Trang Chủ
    const homeTab = page.locator('button:has-text("Trang Chủ")');
    await homeTab.click();
    await expect(page.locator('text=Nhiệm Vụ Hằng Ngày')).toBeVisible({ timeout: 4000 });

    // Tab 2: Bản Đồ
    const mapTab = page.locator('button:has-text("Bản Đồ")');
    await mapTab.click();
    await expect(page.locator('text=Bài 1: Lời Chào Ngôi Sao')).toBeVisible({ timeout: 4000 });

    // Tab 3: Mini Game
    const minigameTab = page.locator('button:has-text("Mini Game")');
    await minigameTab.click();
    await expect(page.locator('text=Thử Thách Phi Thuyền Nova')).toBeVisible({ timeout: 4000 });

    // Tab 4: Hồ Sơ
    const profileTab = page.locator('button:has-text("Hồ Sơ")');
    await profileTab.click();
    await expect(page.locator('text=Bộ Sưu Tập Huy Chương')).toBeVisible({ timeout: 4000 });
  });

  test('3. Canvas Mini Game with Thumb Controller & D-Pad', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Go to Mini Game Tab
    await page.locator('button:has-text("Mini Game")').click();
    await expect(page.locator('text=Thử Thách Phi Thuyền Nova')).toBeVisible({ timeout: 4000 });

    // Start Game
    const playBtn = page.locator('button:has-text("Bắt Đầu Bay!")');
    await expect(playBtn).toBeVisible({ timeout: 4000 });
    await playBtn.click();

    // Verify Thumb Controller Zone is visible
    await expect(page.locator('text=VÙNG ĐIỀU KHIỂN NGÓN CÁI')).toBeVisible({ timeout: 4000 });
    
    // Tap D-Pad Left and Right buttons
    const leftBtn = page.locator('button:has-text("Sang Trái")');
    const rightBtn = page.locator('button:has-text("Sang Phải")');
    await expect(leftBtn).toBeVisible();
    await expect(rightBtn).toBeVisible();

    await leftBtn.click();
    await rightBtn.click();
  });

  test('4. Full 10-Stage Universal Lesson Runner Walkthrough', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Go to Map
    await page.locator('button:has-text("Bản Đồ")').click();
    
    // Click Lesson 1 Node
    await page.locator('text=Bài 1: Lời Chào Ngôi Sao').first().click();

    // Stage 1: Pretest -> Pick Option B (Dừng lại, khoanh tay mỉm cười...)
    await expect(page.locator('text=Giai Đoạn 1: Đánh Giá Ban Đầu')).toBeVisible({ timeout: 4000 });
    await page.locator('button:has-text("Dừng lại, khoanh tay mỉm cười")').click();

    // Stage 2: Story Decision
    await expect(page.locator('text=Giai Đoạn 2: Câu Chuyện Phiêu Lưu')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Dũng cảm mỉm cười và tiến lại gần")').click();

    // Stage 3: Minigame Drag/Click
    await expect(page.locator('text=Giai Đoạn 3: Chọn Cử Chỉ Đúng')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Mỉm cười ấm áp")').click();
    await page.locator('button:has-text("Nhìn thẳng mắt bạn")').click();

    // Stage 4: Minigame Matching Grid
    await expect(page.locator('text=Giai Đoạn 4: Nối Cặp Hoàn Cảnh')).toBeVisible({ timeout: 5000 });
    // Match pair 1
    await page.locator('button:has-text("Gặp thầy cô buổi sáng")').click();
    await page.locator('button:has-text("Em chào thầy/cô ạ!")').click();
    // Match pair 2
    await page.locator('button:has-text("Lần đầu gặp bạn mới")').click();
    await page.locator('button:has-text("Chào bạn, tớ là Su!")').click();
    // Match pair 3
    await page.locator('button:has-text("Bác hàng xóm vẫy tay")').click();
    await page.locator('button:has-text("Cháu chào bác ạ!")').click();

    // Stage 5: Minigame Sequence Reorder
    await expect(page.locator('text=Giai Đoạn 5: Sắp Xếp Thứ Tự Lời Chào')).toBeVisible({ timeout: 5000 });
    const step2DownBtn = page.locator('button[aria-label="Di chuyển xuống"]').first();
    await step2DownBtn.click();
    // Verify
    await page.locator('button:has-text("Xác Nhận Thứ Tự 3 Bước")').click();

    // Stage 6: Boss Battle
    await expect(page.locator('text=Giai Đoạn 6: Thử Thách Boss')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Đứng bên cạnh, mỉm cười")').click();

    // Stage 7: Reflection
    await expect(page.locator('text=Giai Đoạn 7: Phản Tư & Bài Học')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Tự tin và cảm thấy ấm áp")').click();

    // Stage 8: Real Life Challenge
    await expect(page.locator('text=Giai Đoạn 8: Nhiệm Vụ Thực Tế')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Em Sẵn Sàng Thực Hành!")').click();

    // Stage 9: Parent Confirm
    await expect(page.locator('text=Giai Đoạn 9: Góc Phụ Huynh')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Bố/Mẹ Xác Nhận Bé Đã Làm Tốt!")').click();

    // Stage 10: Posttest & Medal
    await expect(page.locator('text=Giai Đoạn 10: Nhận Huy Chương')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Mỉm cười, nhìn thẳng mắt")').click();

    // Should return to Map and show node completed
    await expect(page.locator('text=Đã Hoàn Thành')).toBeVisible({ timeout: 6000 });
  });

  test('5. Header sound toggle and haptic response', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    const soundBtn = page.locator('button[aria-label="Bật tắt âm thanh"]');
    await expect(soundBtn).toBeVisible({ timeout: 4000 });
    await soundBtn.click();
    await soundBtn.click();
  });
});

