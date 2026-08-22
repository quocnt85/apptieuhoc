import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function dismissFTUEIfPresent(page: Page) {
  const start = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
  try { await start.waitFor({ state: 'visible', timeout: 10_000 }); await start.click({ force: true }); await start.waitFor({ state: 'hidden', timeout: 3_000 }); } catch { /* already dismissed */ }
}

test.describe('PRD Parent Zone regressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.reload();
    await dismissFTUEIfPresent(page);
  });

  test('home has no parent-authored real-life quest or default PIN', async ({ page }) => {
    await page.locator('button:has-text("HQ")').click({ force: true });
    await expect(page.locator('text=Nhiệm Vụ Hằng Ngày').first()).toBeVisible();
    await expect(page.locator('text=0/2 Đã Xong').first()).toBeVisible();
    await expect(page.locator('text=Thực hành chào hỏi lễ phép ngoài đời thực')).toHaveCount(0);
    await expect(page.locator('text=1234')).toHaveCount(0);
  });

  test('loads the Parent Zone module only after the parent tab is opened', async ({ page }) => {
    const moduleLoadedBefore = await page.evaluate(() => performance.getEntriesByType('resource').some((entry) => entry.name.includes('/components/dashboard/ParentDashboard')));
    expect(moduleLoadedBefore).toBe(false);

    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Góc phụ huynh' })).toBeVisible();
    const moduleLoadedAfter = await page.evaluate(() => performance.getEntriesByType('resource').some((entry) => entry.name.includes('/components/dashboard/ParentDashboard')));
    expect(moduleLoadedAfter).toBe(true);
  });

  test('Parent Zone demo opens with review password and no email dependency', async ({ page }) => {
    const gateButton = page.getByRole('button', { name: 'Phụ huynh mở cài đặt' });
    if (await gateButton.isVisible()) await gateButton.click();
    else await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Góc phụ huynh' })).toBeVisible();
    await expect(page.getByText('Chế độ review demo')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveCount(0);
    await expect(page.getByText('Dữ liệu học tập của trẻ chỉ lưu trên thiết bị này.')).toBeVisible();
    const password = page.getByPlaceholder('Mật khẩu demo');
    await password.fill('1111');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await expect(page.getByRole('alert')).toContainText('không đúng');
    await password.fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await expect(page.getByText('DEMO', { exact: true })).toBeVisible();
    await expect(page.getByText('Radar 5 miền năng lực')).toBeVisible();
    await expect(page.getByText('CHƯA ĐỦ DỮ LIỆU', { exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Radar năng lực đang chờ đủ 5 mẫu ở mỗi miền' })).toBeVisible();
    await page.getByRole('tab', { name: 'Hồ sơ', exact: true }).click();
    await page.evaluate(() => {
      const gameStore = (window as unknown as { __gameStore: { getState: () => { setNovaCoins: (amount: number) => void; saveToLocalStorage: () => void } } }).__gameStore;
      gameStore.getState().setNovaCoins(321);
      gameStore.getState().saveToLocalStorage();
    });
    await page.getByPlaceholder('Tên hiển thị local').fill('Bé Review');
    await page.getByRole('button', { name: 'Tạo hồ sơ' }).click();
    await expect(page.getByText('Bé Review', { exact: true })).toBeVisible();
    const isolatedState = await page.evaluate(() => ({
      previous: localStorage.getItem('novastars_space_state_profile_local-default'),
      current: localStorage.getItem('novastars_space_state_v3'),
    }));
    expect(isolatedState.previous).toContain('"novaCoins":321');
    expect(isolatedState.current).toContain('"novaCoins":0');
    await page.getByPlaceholder('Tên hồ sơ đang chọn').fill('Bé Review Mới');
    await page.getByLabel('Khối của hồ sơ đang chọn').selectOption('5');
    await page.getByRole('button', { name: 'Lưu hồ sơ' }).click();
    await expect(page.getByText('Bé Review Mới', { exact: true })).toBeVisible();
    await expect(page.getByText('Khối 5 · chỉ để hiển thị')).toBeVisible();
  });

  test('Parent Zone demo also accepts the temporary six-digit review password', async ({ page }) => {
    const gateButton = page.getByRole('button', { name: 'Phụ huynh mở cài đặt' });
    if (await gateButton.isVisible()) await gateButton.click();
    else await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('123456');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await expect(page.getByText('DEMO', { exact: true })).toBeVisible();
  });

  test('Parent Guide catalog supports offline search and hides pending health content by default', async ({ page }) => {
    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Cẩm nang', exact: true }).click();

    await expect(page.getByText('Nội dung được đóng gói offline')).toBeVisible();
    await expect(page.getByText('Thả lỏng vùng quanh mắt', { exact: true })).toHaveCount(0);
    await page.getByPlaceholder('Tìm trong cẩm nang').fill('an toàn số');
    await expect(page.getByRole('heading', { name: /An toàn số trong gia đình/ })).toBeVisible();
    await expect(page.getByText('Bảo vệ cơ thể và vùng riêng tư', { exact: true })).toHaveCount(0);
  });

  test('Parent Guide external source requires a current demo re-auth and opens only the reviewed URL', async ({ page }) => {
    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Cẩm nang', exact: true }).click();
    await page.evaluate(() => {
      (window as typeof window & { __openedParentSource?: string }).__openedParentSource = undefined;
      window.open = ((url?: string | URL) => {
        (window as typeof window & { __openedParentSource?: string }).__openedParentSource = String(url);
        return null;
      }) as typeof window.open;
    });

    const sourceButton = page.getByRole('button', { name: /Mở nguồn UNICEF/ });
    await sourceButton.click();
    const dialog = page.getByRole('dialog', { name: 'Xác thực lại phụ huynh' });
    await expect(dialog).toBeVisible();
    const password = dialog.getByLabel('Mật khẩu demo');
    await expect(password).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.getByRole('button', { name: 'Hủy' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(password).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('status')).toContainText('Đã hủy xác thực');
    expect(await page.evaluate(() => (window as typeof window & { __openedParentSource?: string }).__openedParentSource)).toBeUndefined();

    await sourceButton.click();
    await password.fill('1111');
    await dialog.getByRole('button', { name: 'Xác nhận' }).click();
    await expect(dialog.getByRole('alert')).toContainText('Mật khẩu demo không đúng');
    expect(await page.evaluate(() => (window as typeof window & { __openedParentSource?: string }).__openedParentSource)).toBeUndefined();

    await password.fill('123456');
    await dialog.getByRole('button', { name: 'Xác nhận' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('status')).toContainText('Đã mở nguồn UNICEF');
    expect(await page.evaluate(() => (window as typeof window & { __openedParentSource?: string }).__openedParentSource))
      .toBe('https://www.unicef.org/parenting/child-care/keep-your-child-safe-online');
  });

  test('approves a typed lesson mission and celebrates only after local demo commit', async ({ page }) => {
    await page.evaluate(() => {
      const store = (window as any).__parentZoneStore;
      const profileId = store.getState().activeProfileId;
      store.setState({ missions: [{
        id: 'mission-e2e-1', rewardRequestId: 'mission:mission-e2e-1', profileId, sourceLessonId: 'Q-CRT-001',
        contentMissionId: 'MISSION-CRT-FACT-001', title: 'Kể một sự thật khoa học', difficulty: 'medium', fixedCoinReward: 100,
        status: 'done_by_child', proposedAt: Date.now() - 1_000, completedAt: Date.now(),
      }], coinAwards: [] });
      window.addEventListener('novastars:mission-reward-confirmed', (event) => { (window as any).__missionCelebration = (event as CustomEvent).detail; }, { once: true });
    });
    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Nhiệm vụ', exact: true }).click();
    await expect(page.getByText('Medium · 100 Xu Nova')).toBeVisible();
    await page.getByPlaceholder('Kim cương (0 = không thưởng)').fill('500');
    await page.getByRole('button', { name: 'Duyệt', exact: true }).click();
    const rewardConfirmation = page.getByRole('alertdialog', { name: 'Xác nhận phần thưởng lớn' });
    await expect(rewardConfirmation.getByRole('button', { name: 'Hủy' })).toBeFocused();
    await rewardConfirmation.getByRole('button', { name: 'Trao Kim Cương' }).click();
    await expect(page.getByRole('status')).toContainText('Đã xác nhận nhiệm vụ · +100 Xu · +500');
    expect(await page.evaluate(() => (window as any).__missionCelebration)).toMatchObject({
      localMissionId: 'mission-e2e-1', contentMissionId: 'MISSION-CRT-FACT-001', coinsAwarded: 100, diamondsAwarded: 500,
    });
  });

  test('migrates a legacy local profile to schema v3 without losing demo progress', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('novastars_space_state_v2', JSON.stringify({
        user: { name: 'Bé Dữ Liệu Cũ', grade: 4, avatar: '🦊', novaCoins: 321, diamonds: 77, gems: 77, xp: 45, customization: { equippedShip: 'explorer_v1' } },
        settings: { parentPin: '1234', dailyTimeLimitMinutes: 20, sfxEnabled: true },
        completedNodes: { legacy_lesson: true },
      }));
    });
    await page.reload();
    await dismissFTUEIfPresent(page);

    const migrated = await page.evaluate(() => ({
      current: localStorage.getItem('novastars_space_state_v3'),
      legacy: localStorage.getItem('novastars_space_state_v2'),
      rollback: localStorage.getItem('novastars_space_state_migration_backup_v3'),
    }));
    expect(migrated.legacy).toBeNull();
    expect(migrated.current).toContain('"schemaVersion":3');
    expect(migrated.current).toContain('"novaCoins":321');
    expect(migrated.current).toContain('"diamonds":77');
    expect(migrated.current).not.toContain('parentPin');
    expect(migrated.rollback).not.toContain('1234');

    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Hồ sơ', exact: true }).click();
    await expect(page.getByText('Bé Dữ Liệu Cũ', { exact: true })).toBeVisible();
    await expect(page.getByText('Khối 4 · chỉ để hiển thị')).toBeVisible();
  });

  test('deletes demo Parent Zone data locally and does not restore the old child after reload', async ({ page }) => {
    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Hồ sơ', exact: true }).click();
    await page.getByPlaceholder('Tên hiển thị local').fill('Bé Sắp Xóa');
    await page.getByRole('button', { name: 'Tạo hồ sơ' }).click();
    await expect(page.getByText('Bé Sắp Xóa', { exact: true })).toBeVisible();
    await page.evaluate(() => localStorage.setItem('novastars_deletion_probe', 'must-disappear'));

    await page.getByRole('tab', { name: 'Tài khoản', exact: true }).click();
    await page.getByRole('button', { name: 'Xóa tài khoản và dữ liệu local' }).click();
    const deleteConfirmation = page.getByRole('alertdialog', { name: 'Xóa tài khoản và dữ liệu?' });
    await expect(deleteConfirmation.getByRole('button', { name: 'Hủy' })).toBeFocused();
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      deleteConfirmation.getByRole('button', { name: 'Xóa vĩnh viễn' }).click(),
    ]);
    expect(await page.evaluate(() => localStorage.getItem('novastars_deletion_probe'))).toBeNull();

    await dismissFTUEIfPresent(page);
    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Hồ sơ', exact: true }).click();
    await expect(page.getByText('Bé Sắp Xóa', { exact: true })).toHaveCount(0);
  });

  test('requires a fresh parent password before checking biometric availability', async ({ page }) => {
    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Tài khoản', exact: true }).click();

    await page.getByRole('button', { name: 'Bật Face ID / vân tay' }).click();
    const reauth = page.getByRole('dialog', { name: 'Xác thực lại phụ huynh' });
    await expect(reauth).toContainText('Bật Face ID / vân tay trên thiết bị này');
    await reauth.getByLabel('Mật khẩu demo').fill('123456');
    await reauth.getByRole('button', { name: 'Xác nhận' }).click();

    await expect(page.getByText('Thiết bị chưa có sinh trắc học khả dụng.')).toBeVisible();
  });

  test('creates an encrypted backup through an in-app confirmed passphrase dialog', async ({ page }) => {
    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Tài khoản', exact: true }).click();

    await page.getByRole('button', { name: 'Sao lưu mã hóa thủ công' }).click();
    let secretDialog = page.getByRole('dialog', { name: 'Bảo vệ tệp sao lưu' });
    await expect(secretDialog.getByLabel('Mật khẩu tệp sao lưu')).toBeFocused();
    await secretDialog.press('Escape');
    await expect(secretDialog).toHaveCount(0);

    await page.getByRole('button', { name: 'Sao lưu mã hóa thủ công' }).click();
    secretDialog = page.getByRole('dialog', { name: 'Bảo vệ tệp sao lưu' });
    const password = secretDialog.getByLabel('Mật khẩu tệp sao lưu');
    const confirmation = secretDialog.getByLabel('Nhập lại mật khẩu');
    await expect(password).toHaveAttribute('type', 'password');
    await password.fill('short');
    await confirmation.fill('short');
    await secretDialog.getByRole('button', { name: 'Tạo bản sao lưu' }).click();
    await expect(secretDialog.getByRole('alert')).toHaveText('Mật khẩu phải có ít nhất 8 ký tự.');

    await password.fill('strong-password');
    await confirmation.fill('different-password');
    await secretDialog.getByRole('button', { name: 'Tạo bản sao lưu' }).click();
    await expect(secretDialog.getByRole('alert')).toHaveText('Hai mật khẩu không trùng nhau.');

    await confirmation.fill('strong-password');
    const downloadPromise = page.waitForEvent('download');
    await secretDialog.getByRole('button', { name: 'Tạo bản sao lưu' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^novastars-backup-\d{4}-\d{2}-\d{2}\.json$/);
  });

  test('asks for the backup passphrase before reading an imported file', async ({ page }) => {
    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.getByRole('tab', { name: 'Tài khoản', exact: true }).click();

    await page.locator('input[type="file"]').setInputFiles({
      name: 'invalid-backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from('not-json'),
    });
    const secretDialog = page.getByRole('dialog', { name: 'Mở tệp sao lưu' });
    await expect(secretDialog).toContainText('Mật khẩu không được gửi ra khỏi thiết bị.');
    await secretDialog.getByLabel('Mật khẩu tệp sao lưu').fill('strong-password');
    await secretDialog.getByRole('button', { name: 'Kiểm tra tệp' }).click();

    await expect(secretDialog).toHaveCount(0);
    await expect(page.getByText('Tệp sao lưu không phải JSON hợp lệ.')).toBeVisible();
  });

  test('exports consented aggregate diagnostics without child data', async ({ page }) => {
    await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click();
    await page.getByPlaceholder('Mật khẩu demo').fill('1234');
    await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
    await page.evaluate(() => {
      const store = (window as any).__parentZoneStore;
      const state = store.getState();
      const profileId = state.activeProfileId;
      store.setState({
        profiles: state.profiles.map((profile: any) => profile.id === profileId ? { ...profile, name: 'Bé Diagnostic Không Được Lộ' } : profile),
        usage: { [`${profileId}:2026-08-22`]: { date: '2026-08-22', minutes: 12.5, extensionsUsed: 1, byCategory: { lesson: 7.5, minigame: 5, exploration: 0 } } },
        activities: [{ id: 'activity-private-probe', profileId, type: 'quiz', title: 'Bài kiểm tra riêng tư', score: 9, completedAt: Date.now() }],
        missions: [{ id: 'mission-private-probe', rewardRequestId: 'reward-private-probe', profileId, sourceLessonId: 'lesson-private-probe', contentMissionId: 'content-private-probe', title: 'Nhiệm vụ riêng tư', difficulty: 'easy', fixedCoinReward: 50, status: 'approved', proposedAt: Date.now(), novaCoinsAwarded: 50, diamondsAwarded: 10 }],
      });
    });
    await page.getByRole('tab', { name: 'Tài khoản', exact: true }).click();

    await page.getByRole('button', { name: 'Xuất báo cáo chẩn đoán local' }).click();
    let consent = page.getByRole('alertdialog', { name: 'Xuất báo cáo chẩn đoán local?' });
    await expect(consent).toContainText('Không có tên, ID hồ sơ, email, đáp án, điểm số hoặc ảnh.');
    await expect(consent.getByRole('button', { name: 'Hủy' })).toBeFocused();
    await consent.press('Escape');
    await expect(consent).toHaveCount(0);

    await page.getByRole('button', { name: 'Xuất báo cáo chẩn đoán local' }).click();
    consent = page.getByRole('alertdialog', { name: 'Xuất báo cáo chẩn đoán local?' });
    await consent.getByRole('button', { name: 'Tôi đồng ý xuất' }).click();
    const reauth = page.getByRole('dialog', { name: 'Xác thực lại phụ huynh' });
    await expect(reauth).toContainText('Xác nhận xuất báo cáo chẩn đoán local');
    await reauth.getByLabel('Mật khẩu demo').fill('123456');
    const downloadPromise = page.waitForEvent('download');
    await reauth.getByRole('button', { name: 'Xác nhận' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^novastars-diagnostics-\d{4}-\d{2}-\d{2}\.json$/);
    const path = await download.path();
    expect(path).not.toBeNull();
    const text = await readFile(path!, 'utf8');
    const report = JSON.parse(text);
    expect(report).toMatchObject({
      format: 'novastars-parent-local-diagnostics',
      consent: { scope: 'LOCAL_DIAGNOSTIC_EXPORT', automaticUpload: false },
      aggregates: { profileCount: 1, usage: { totalMinutes: 12.5 }, activities: { quizzes: 1 }, missions: { approved: 1, novaCoinsAwarded: 50, diamondsAwarded: 10 } },
      privacy: { containsNames: false, containsProfileIds: false, containsAnswersOrScores: false, containsMedia: false },
    });
    for (const secret of ['Bé Diagnostic Không Được Lộ', 'activity-private-probe', 'Bài kiểm tra riêng tư', 'mission-private-probe', 'Nhiệm vụ riêng tư', 'lesson-private-probe', 'content-private-probe', 'reward-private-probe']) {
      expect(text).not.toContain(secret);
    }
    await expect(page.getByRole('status')).toContainText('Đã tải báo cáo chẩn đoán local.');
  });
});
