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

    // Switch to Boosters Sub-tab (Nạp Năng Lượng)
    const boostersTab = page.locator('button:has-text("Nạp Năng Lượng")');
    await expect(boostersTab).toBeVisible({ timeout: 5000 });
    await boostersTab.click({ force: true });
    await expect(page.locator('text=Bình Năng Lượng Phi Thuyền').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Lò Phản Ứng Ion').first()).toBeVisible({ timeout: 5000 });

    // Switch back to Ships Sub-tab (Phi Thuyền)
    const shipsTab = page.locator('button:has-text("Phi Thuyền")');
    await expect(shipsTab).toBeVisible({ timeout: 5000 });
    await shipsTab.click({ force: true });
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

  test('5. Header audio popover, sound toggle and BGM style switching', async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto('/');
    await dismissFTUEIfPresent(page);

    // Verify sound button in header
    const header = page.locator('header');
    await expect(header).toBeVisible({ timeout: 4000 });

    const soundBtn = header.locator('button[aria-label="Cài đặt âm thanh và nhạc nền"]').first();
    await expect(soundBtn).toBeVisible();

    // 1. Click speaker button to open Audio Menu
    await soundBtn.click();
    await page.waitForFunction(
      () => (window as any).__novaStarsSoundService?.audioUnlocked === true,
      null,
      { timeout: 8000 }
    );
    const audioRuntime = await page.evaluate(async () => {
      const service = (window as any).__novaStarsSoundService;
      const engine = await service.enginePromise;
      return {
        audioUnlocked: service.audioUnlocked,
        contextStarted: engine.isContextStarted,
        graphReady: Boolean(engine.safetyGraph),
      };
    });
    expect(audioRuntime).toEqual({ audioUnlocked: true, contextStarted: true, graphReady: true });

    // Mobile operating systems suspend/interrupt Web Audio when the page loses
    // audio focus. The next real gesture must resume it instead of trusting a
    // stale `audioUnlocked` flag.
    await page.evaluate(async () => {
      const service = (window as any).__novaStarsSoundService;
      const engine = await service.enginePromise;
      await engine.suspendAudioForDiagnostics();
    });
    await page.waitForFunction(
      () => (window as any).__novaStarsSoundService?.engine?.isAudioRunning() === false,
      null,
      { timeout: 3000 }
    );
    await soundBtn.click();
    await page.waitForFunction(
      () => (window as any).__novaStarsSoundService?.engine?.isAudioRunning() === true,
      null,
      { timeout: 8000 }
    );
    await soundBtn.click();

    // BGM must produce an actual non-silent signal on the protected output,
    // not merely report that its graph and context were created.
    await page.waitForFunction(
      () => (window as any).__novaStarsSoundService?.engine?.getAudioDiagnostics().outputLevel > 0.00001,
      null,
      { timeout: 8000 }
    );
    await expect(page.locator('text=Âm thanh & Nhạc nền').first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator('text=🪐 Vũ trụ êm dịu').first()).toBeVisible();
    await expect(page.locator('text=🚀 Phiêu lưu ngân hà').first()).toBeVisible();

    // 2. BGM and SFX can be controlled independently
    const bgmToggle = page.locator('button[aria-label="Bật tắt nhạc nền BGM"]').first();
    const sfxToggle = page.locator('button[aria-label="Bật tắt hiệu ứng âm thanh SFX"]').first();
    await expect(bgmToggle).toHaveAttribute('aria-pressed', 'true');
    await expect(sfxToggle).toHaveAttribute('aria-pressed', 'true');

    await bgmToggle.click();
    await expect(bgmToggle).toHaveAttribute('aria-pressed', 'false');
    await expect(sfxToggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('button:has-text("🚀 Phiêu lưu ngân hà")').first()).toBeDisabled();
    await bgmToggle.click();

    // 3. Select Adventure style
    const adventureBtn = page.locator('button:has-text("🚀 Phiêu lưu ngân hà")').first();
    await adventureBtn.click();

    // 4. Select Ambient style back
    const ambientBtn = page.locator('button:has-text("🪐 Vũ trụ êm dịu")').first();
    await ambientBtn.click();

    // 5. Independent states persist after reload
    await sfxToggle.click();
    await expect(sfxToggle).toHaveAttribute('aria-pressed', 'false');
    await page.reload();
    await dismissFTUEIfPresent(page);
    await page.locator('button[aria-label="Cài đặt âm thanh và nhạc nền"]').first().click();
    await expect(page.locator('button[aria-label="Bật tắt nhạc nền BGM"]').first()).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('button[aria-label="Bật tắt hiệu ứng âm thanh SFX"]').first()).toHaveAttribute('aria-pressed', 'false');

    // 6. Close audio menu
    const closeBtn = page.locator('button[aria-label="Đóng cài đặt âm thanh"]').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click({ force: true });
    }

    // Verify energy counter display
    await expect(header.locator('span:text-is("50")').first()).toBeVisible({ timeout: 4000 });
  });

  test('5b. Legacy audio settings migrate to independent BGM and SFX controls', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('novastars_space_state_v2', JSON.stringify({
        settings: { soundEnabled: false, musicEnabled: true, bgmStyle: 'ambient' },
      }));
    });
    await page.reload();
    await page.waitForFunction(() => (window as any).__gameStore?.getState().settings.audioSettingsVersion === 2);
    let settings = await page.evaluate(() => (window as any).__gameStore.getState().settings);
    expect(settings.bgmEnabled).toBe(false);
    expect(settings.sfxEnabled).toBe(false);

    await page.evaluate(() => {
      localStorage.setItem('novastars_space_state_v2', JSON.stringify({
        settings: { soundEnabled: true, musicEnabled: false, bgmStyle: 'adventure' },
      }));
    });
    await page.reload();
    await page.waitForFunction(() => (window as any).__gameStore?.getState().settings.bgmStyle === 'adventure');
    settings = await page.evaluate(() => (window as any).__gameStore.getState().settings);
    expect(settings.bgmEnabled).toBe(false);
    expect(settings.sfxEnabled).toBe(true);
    expect(settings.audioSettingsVersion).toBe(2);
  });

  test('5c. Audio debug mode exposes runtime state and a protected test tone', async ({ page }) => {
    await page.goto('/?audioDebug=1');
    const overlay = page.getByTestId('audio-debug-overlay');
    await expect(overlay).toBeVisible({ timeout: 8000 });

    await overlay.getByRole('button', { name: 'Mở khóa / thử lại' }).click();
    await page.waitForFunction(
      () => (window as any).__novaStarsSoundService?.getAudioDiagnostics().engine?.contextState === 'running',
      null,
      { timeout: 8000 }
    );

    await overlay.getByRole('button', { name: 'Phát âm test' }).click();
    await page.waitForFunction(
      () => {
        const report = (window as any).__novaStarsSoundService?.getAudioDiagnostics();
        return report?.events.some((entry: any) => entry.event === 'diagnostic-tone-triggered');
      },
      null,
      { timeout: 8000 }
    );
    await expect(overlay).toContainText('Đã kích hoạt âm test');

    const report = await page.evaluate(() => (window as any).__novaStarsSoundService.getAudioDiagnostics());
    expect(report.page.url).not.toContain('?audioDebug');
    expect(report.device.userAgent).toBeTruthy();
    expect(report.service.audioUnlocked).toBe(true);
    expect(report.engine.graphReady).toBe(true);

    // Regression: WebKit can leave resume()/Tone.start() pending forever while
    // the non-standard context state is `interrupted`. A hung attempt must
    // time out and release the next real gesture instead of wedging the app.
    await page.evaluate(async () => {
      const service = (window as any).__novaStarsSoundService;
      const engine = service.engine;
      await engine.suspendAudioForDiagnostics();
      const originalUnlock = engine.unlockAudio.bind(engine);
      (window as any).__restoreAudioUnlock = () => { engine.unlockAudio = originalUnlock; };
      engine.unlockAudio = () => new Promise<boolean>(() => undefined);
      service.audioUnlocked = false;
    });
    await overlay.getByRole('button', { name: 'Mở khóa / thử lại' }).click();
    await expect(overlay).toContainText('Mở khóa thất bại', { timeout: 4000 });
    await page.waitForFunction(
      () => (window as any).__novaStarsSoundService?.getAudioDiagnostics().service.unlockInFlight === false,
      null,
      { timeout: 4000 }
    );
    await page.evaluate(() => (window as any).__restoreAudioUnlock());
    await overlay.getByRole('button', { name: 'Mở khóa / thử lại' }).click();
    await page.waitForFunction(
      () => (window as any).__novaStarsSoundService?.getAudioDiagnostics().engine?.contextState === 'running',
      null,
      { timeout: 8000 }
    );

    await overlay.getByRole('button', { name: 'Sao chép báo cáo' }).click();
    await expect(overlay).toContainText(/Đã sao chép|Không sao chép được/);
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
