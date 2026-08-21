import { test, expect, Page } from '@playwright/test';

async function dismissFTUEIfPresent(page: Page) {
  try {
    const startBtn = page.locator('button:has-text("Bắt Đầu Hành Trình Ngay!")');
    await startBtn.waitFor({ state: 'visible', timeout: 7000 });
    await startBtn.click({ force: true });
    await startBtn.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
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
    const startBtn = page.locator('button:has-text("Bắt Đầu Hành Trình Ngay!")');
    await expect(startBtn).toBeVisible({ timeout: 7000 });
    await startBtn.click({ force: true });

    // Should navigate to 3D Planet view
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible({ timeout: 5000 });
  });

  test('2. Bottom Navigation across 4 tabs with touch response', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Tab 1: Trang Chủ
    const homeTab = page.locator('button:has-text("Trang Chủ")');
    await homeTab.click({ force: true });
    await expect(page.locator('text=Nhiệm Vụ Hằng Ngày').first()).toBeVisible({ timeout: 5000 });

    // Tab 2: Hành Tinh
    const planetTab = page.locator('button:has-text("Hành Tinh")').first();
    await planetTab.click({ force: true });
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible({ timeout: 5000 });

    // Tab 3: Xưởng Tàu
    const hangarTab = page.locator('button:has-text("Xưởng Tàu")').first();
    await hangarTab.click({ force: true });
    await expect(page.locator('text=Xưởng Tàu Không Gian').first()).toBeVisible({ timeout: 5000 });

    // Tab 4: Hồ Sơ
    const profileTab = page.locator('button:has-text("Hồ Sơ")').first();
    await profileTab.click({ force: true });
    await expect(page.locator('text=Bộ Sưu Tập Huy Chương').first()).toBeVisible({ timeout: 5000 });
  });

  test('3. Space Hangar Customization & 3D Ship Inspector Modal', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Go to Xưởng Tàu Tab
    await page.locator('button:has-text("Xưởng Tàu")').first().click({ force: true });
    await expect(page.locator('text=Xưởng Tàu Không Gian').first()).toBeVisible({ timeout: 5000 });

    // Open 3D Ship Inspector Modal
    const open3DBtn = page.locator('button:has-text("Mở Phòng Ngắm Tàu Vũ Trụ 3D")');
    await expect(open3DBtn).toBeVisible({ timeout: 5000 });
    await open3DBtn.click({ force: true });
    await expect(page.locator('text=Quan Sát Phi Thuyền 3D Thực Tế')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Đã Xong")').click({ force: true });

    // Switch to Colors & Flag Sub-tab
    const colorsTab = page.locator('button:has-text("Màu Sơn & Cờ")');
    await colorsTab.click({ force: true });
    await expect(page.locator('text=Quốc Kỳ Việt Nam').first()).toBeVisible({ timeout: 5000 });

    // Toggle Vietnam Flag
    const flagBtn = page.locator('button:has-text("Đã Dán Cờ"), button:has-text("Bật Dán Cờ")').first();
    await expect(flagBtn).toBeVisible({ timeout: 5000 });
    await flagBtn.click({ force: true });

    // Switch to Boosters Sub-tab
    const boostersTab = page.locator('button:has-text("Năng Lượng & Buff")');
    await boostersTab.click({ force: true });
    await expect(page.locator('text=Bình Năng Lượng Phi Thuyền').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Lò Phản Ứng Ion').first()).toBeVisible({ timeout: 5000 });
  });

  test('4. Full 10-Stage Universal Lesson Runner Walkthrough', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Ensure on 3D Planet
    await page.locator('button:has-text("Hành Tinh")').first().click({ force: true });
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible({ timeout: 5000 });

    // Click Lesson 1 Node on Planet surface (force: true for 3D animated canvas)
    const nodePin = page.locator('button[title*="Bài 1"], button:has-text("1")').first();
    await nodePin.click({ force: true });

    // Coordinate Preview Modal pops up after 3-5s flight animation
    await expect(page.locator('text=Bài 1: Lời Chào Ngôi Sao').first()).toBeVisible({ timeout: 12000 });
    const launchBtn = page.getByTestId('start-lesson-btn');
    await expect(launchBtn).toBeVisible({ timeout: 6000 });
    await launchBtn.click();

    // Verify 10-Stage runner mounted
    await expect(page.getByTestId('ten-stage-runner')).toBeVisible({ timeout: 6000 });

    // Stage 1: Pretest -> Pick Option B
    await expect(page.locator('text=Giai Đoạn 1: Đánh Giá Ban Đầu')).toBeVisible({ timeout: 6000 });
    await page.locator('button:has-text("Dừng lại, khoanh tay mỉm cười")').click({ force: true });

    // Stage 2: Story Decision
    await expect(page.locator('text=Giai Đoạn 2: Câu Chuyện Phiêu Lưu')).toBeVisible({ timeout: 6000 });
    await page.locator('button:has-text("Dũng cảm mỉm cười và tiến lại gần")').click({ force: true });

    // Stage 3: Minigame Drag/Select
    await expect(page.locator('text=Giai Đoạn 3: Chọn Cử Chỉ Đúng')).toBeVisible({ timeout: 6000 });
    const dragItem1 = page.locator('button:has-text("Mỉm cười ấm áp")');
    await expect(dragItem1).toBeVisible({ timeout: 4000 });
    await dragItem1.click();
    await page.waitForTimeout(200);

    const dragItem2 = page.locator('button:has-text("Nhìn thẳng mắt bạn")');
    await expect(dragItem2).toBeVisible({ timeout: 4000 });
    await dragItem2.click();

    // Stage 4: Minigame Match
    await expect(page.locator('text=Giai Đoạn 4: Nối Cặp Hoàn Cảnh')).toBeVisible({ timeout: 6000 });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Gặp thầy cô buổi sáng")').click();
    await page.waitForTimeout(100);
    await page.locator('button:has-text("Em chào thầy/cô ạ!")').click();
    await page.waitForTimeout(150);

    await page.locator('button:has-text("Lần đầu gặp bạn mới")').click();
    await page.waitForTimeout(100);
    await page.locator('button:has-text("Chào bạn, tớ là Su!")').click();
    await page.waitForTimeout(150);

    await page.locator('button:has-text("Bác hàng xóm vẫy tay")').click();
    await page.waitForTimeout(100);
    await page.locator('button:has-text("Cháu chào bác ạ!")').click();

    // Stage 5: Minigame Sequence Reorder
    await expect(page.locator('text=Giai Đoạn 5: Sắp Xếp Thứ Tự Lời Chào')).toBeVisible({ timeout: 6000 });
    await page.waitForTimeout(200);
    const upBtn = page.locator('button[aria-label="Di chuyển lên"]:not([disabled])').first();
    await expect(upBtn).toBeVisible({ timeout: 4000 });
    await upBtn.click();
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Xác Nhận Thứ Tự 3 Bước")').click();

    // Stage 6: Boss Battle
    await expect(page.locator('text=Giai Đoạn 6: Thử Thách Boss')).toBeVisible({ timeout: 6000 });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Đứng bên cạnh, mỉm cười")').click();

    // Stage 7: Reflection
    await expect(page.locator('text=Giai Đoạn 7: Phản Tư & Bài Học')).toBeVisible({ timeout: 6000 });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Tự tin và cảm thấy ấm áp")').click();

    // Stage 8: Challenge
    await expect(page.locator('text=Giai Đoạn 8: Nhiệm Vụ Thực Tế')).toBeVisible({ timeout: 6000 });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Em Sẵn Sàng Thực Hành!")').click();

    // Stage 9: Parent Confirm
    await expect(page.locator('text=Giai Đoạn 9: Góc Phụ Huynh')).toBeVisible({ timeout: 6000 });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Bố/Mẹ Xác Nhận Bé Đã Làm Tốt!"), button:has-text("Xác Nhận")').first().click();

    // Stage 10: Posttest Mastery
    await expect(page.locator('text=Giai Đoạn 10: Nhận Huy Chương')).toBeVisible({ timeout: 6000 });
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Mỉm cười, nhìn thẳng mắt và tự tin")').click();

    // Should automatically finish and return to 3D Planet
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible({ timeout: 6000 });
  });

  test('5. Header sound toggle and energy display', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Verify sound toggle in header
    const header = page.locator('header');
    await expect(header).toBeVisible({ timeout: 4000 });

    const soundBtn = header.locator('button').last();
    await expect(soundBtn).toBeVisible();
    await soundBtn.click({ force: true });

    // Verify energy counter display
    await expect(header.locator('span:text-is("50")').first()).toBeVisible({ timeout: 4000 });
  });

  test('6. Parent Quest Verification with PIN Security flow', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Click Home Tab
    await page.locator('button:has-text("Trang Chủ")').first().click({ force: true });

    // Click greeting quest
    const greetingQuest = page.locator('text=Thực hành chào hỏi lễ phép ngoài đời thực');
    await expect(greetingQuest).toBeVisible({ timeout: 5000 });
    await greetingQuest.click({ force: true });

    // Parent PIN Modal opens
    await expect(page.locator('text=Góc Xác Nhận Của Phụ Huynh')).toBeVisible({ timeout: 5000 });

    // Type PIN 1-2-3-4
    await page.getByRole('button', { name: '1', exact: true }).click({ force: true });
    await page.getByRole('button', { name: '2', exact: true }).click({ force: true });
    await page.getByRole('button', { name: '3', exact: true }).click({ force: true });
    await page.getByRole('button', { name: '4', exact: true }).click({ force: true });

    // PIN verified screen appears
    await expect(page.locator('text=Mã PIN Phụ Huynh Hợp Lệ!')).toBeVisible({ timeout: 5000 });
    const confirmBtn = page.locator('button:has-text("Xác Nhận & Trao Thưởng")');
    await expect(confirmBtn).toBeVisible({ timeout: 5000 });
    await confirmBtn.click({ force: true });

    // Toast alert appears
    await expect(page.locator('text=Phụ huynh đã xác nhận')).toBeVisible({ timeout: 5000 });
  });
});
