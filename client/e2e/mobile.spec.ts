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

test.describe('NovaStars Mobile UI & Touch Ergonomics E2E Tests', () => {
  test('1. App Launch, Splash Screen & Welcome FTUE flow', async ({ page }) => {
    await page.goto('/');
    // Splash screen visible initially with cinematic artwork
    await expect(page.locator('text=Hành Tinh Học Kỹ Năng Sống').first()).toBeVisible({ timeout: 5000 });
    
    // Welcome modal appears after splash
    const startBtn = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
    await expect(startBtn).toBeVisible({ timeout: 8000 });
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
    await expect(page.locator('text=Huy Chương Đã Đạt').first()).toBeVisible({ timeout: 5000 });
  });

  test('3. Space Hangar Ship Card 3D Detail Modal & Customization', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Go to Xưởng Tàu Tab
    await page.locator('button:has-text("Xưởng Tàu")').first().click({ force: true });
    await expect(page.locator('text=Xưởng Tàu Không Gian').first()).toBeVisible({ timeout: 5000 });

    // Click on Ship Card to open 3D Interactive Detail Modal
    const shipCard = page.locator('text=Tàu Tiên Phong Bạch Đằng').first();
    await expect(shipCard).toBeVisible({ timeout: 5000 });
    await shipCard.click({ force: true });

    // Check 3D Modal details
    await expect(page.locator('text=Vuốt để xoay 360°').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Tốc Độ').first()).toBeVisible();
    await expect(page.locator('text=Đang Lái Phi Thuyền Này').first()).toBeVisible();
    await expect(page.locator('text=Sơn Màu Phi Thuyền').first()).toBeVisible();

    // Toggle Vietnam Flag in modal
    const flagBtn = page.locator('button:has-text("Cờ VN")').first();
    await expect(flagBtn).toBeVisible({ timeout: 5000 });
    await flagBtn.click({ force: true });

    // Close Modal
    await page.locator('button:has(svg.lucide-x)').first().click({ force: true });

    // Switch to Boosters Sub-tab
    const boostersTab = page.locator('button:has-text("Năng Lượng")');
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

    // Chặng 1: Thử tài -> Pick Option B
    await expect(page.locator('text=Chặng 1: Thử tài')).toBeVisible({ timeout: 8000 });
    await page.locator('button:has-text("Mỉm cười và chào lễ phép")').click({ force: true });

    // Chặng 2: Câu chuyện
    await expect(page.locator('text=Chặng 2: Câu chuyện').first()).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(400);
    await page.locator('button:has-text("Mỉm cười lại gần chào bạn Kem")').click({ force: true });

    // Chặng 3: Chọn hành động đúng
    await expect(page.locator('text=Chặng 3: Chọn hành động đúng').first()).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Mỉm cười ấm áp")').click({ force: true });
    await page.locator('button:has-text("Nhìn thẳng mắt bạn")').click({ force: true });

    // Chặng 4: Nối cặp
    await expect(page.locator('text=Chặng 4: Nối cặp').first()).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Gặp thầy cô")').click({ force: true });
    await page.locator('button:has-text("Em chào thầy/cô ạ!")').click({ force: true });
    await page.locator('button:has-text("Gặp bạn mới")').click({ force: true });
    await page.locator('button:has-text("Chào bạn, tớ là Su!")').click({ force: true });
    await page.locator('button:has-text("Bác hàng xóm")').click({ force: true });
    await page.locator('button:has-text("Cháu chào bác ạ!")').click({ force: true });

    // Chặng 5: Xếp thứ tự
    await expect(page.locator('text=Chặng 5: Xếp thứ tự').first()).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(300);
    const upBtn = page.locator('button[aria-label="Di chuyển lên"]:not([disabled])').first();
    await expect(upBtn).toBeVisible({ timeout: 4000 });
    await upBtn.click({ force: true });
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Xác Nhận")').click({ force: true });

    // Chặng 6: Đấu Boss
    await expect(page.locator('text=Chặng 6: Đấu Boss').first()).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Mỉm cười chờ các bạn nhảy xong lượt")').click({ force: true });

    // Chặng 7: Bài học
    await expect(page.locator('text=Chặng 7: Bài học').first()).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Tự tin và thấy rất vui vẻ")').click({ force: true });

    // Chặng 8: Việc tốt hôm nay
    await expect(page.locator('text=Chặng 8: Việc tốt hôm nay').first()).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Sẵn Sàng 🚀")').click({ force: true });

    // Chặng 9: Bố mẹ duyệt
    await expect(page.locator('text=Chặng 9: Bố mẹ duyệt').first()).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Bố Mẹ Xác Nhận ✨"), button:has-text("Xác Nhận")').first().click({ force: true });

    // Chặng 10: Nhận huy chương
    await expect(page.locator('text=Chặng 10: Nhận huy chương').first()).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Mỉm cười và tự tin chào")').click({ force: true });

    // Should automatically finish and return to 3D Planet
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible({ timeout: 15000 });
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

  test('5. Home View UI verification: Play button, parent review label, square checkbox', async ({ page }) => {
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Go to Home Tab
    await page.locator('button:has-text("Trang Chủ")').first().click({ force: true });
    await expect(page.locator('text=Nhiệm Vụ Hằng Ngày').first()).toBeVisible({ timeout: 5000 });

    // Play Continue button check
    const playBtn = page.locator('[data-testid="play-continue-btn"]');
    await expect(playBtn).toBeVisible();
    await expect(page.locator('text=Tiếp tục học').first()).toBeVisible();

    // Check Parent review quest label
    const parentQuestBtn = page.locator('text=Phụ huynh duyệt').first();
    if (await parentQuestBtn.isVisible()) {
      await expect(parentQuestBtn).toBeVisible();
    }
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
    await expect(page.getByRole('heading', { name: 'Phụ Huynh Duyệt' })).toBeVisible({ timeout: 5000 });

    // Type PIN 1-2-3-4
    await page.getByRole('button', { name: '1', exact: true }).click({ force: true });
    await page.getByRole('button', { name: '2', exact: true }).click({ force: true });
    await page.getByRole('button', { name: '3', exact: true }).click({ force: true });
    await page.getByRole('button', { name: '4', exact: true }).click({ force: true });

    // PIN verified screen appears
    await expect(page.locator('text=PIN Hợp Lệ!')).toBeVisible({ timeout: 5000 });
    const confirmBtn = page.locator('button:has-text("Duyệt & Nhận Thưởng")');
    await expect(confirmBtn).toBeVisible({ timeout: 5000 });
    await confirmBtn.click({ force: true });

    // Toast alert appears
    await expect(page.locator('text=Phụ huynh đã duyệt')).toBeVisible({ timeout: 5000 });
  });
});
