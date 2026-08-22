import { expect, test, type Page } from '@playwright/test';

test.skip(process.env.PARENT_AUTH_E2E !== 'true', 'Runs only in the isolated real-auth E2E configuration.');

const openParentGate = async (page: Page) => {
  const limitGate = page.getByRole('button', { name: 'Phụ huynh mở cài đặt' });
  if (await limitGate.isVisible()) await limitGate.click();
  else await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click({ force: true });
};

test('reset PIN uses an in-app multi-step form and establishes the rotated session', async ({ page }) => {
  const requests: Array<{ path: string; body: Record<string, unknown> }> = [];
  await page.addInitScript(() => {
    sessionStorage.setItem('novastars_parent_session', JSON.stringify({ token: 'a'.repeat(64), refreshToken: 'b'.repeat(64) }));
    localStorage.setItem('novastars_parent_email', 'old@example.com');
  });
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const body = request.postDataJSON?.() as Record<string, unknown> | null;
    if (body) requests.push({ path, body });
    const response = path.endsWith('/pin-reset/request')
      ? { success: true, debugOtp: '654321' }
      : path.endsWith('/pin-reset/confirm')
        ? { token: 'c'.repeat(64), refreshToken: 'd'.repeat(64) }
        : path.endsWith('/pin/verify')
          ? { success: true, unlockedUntil: new Date(Date.now() + 180_000).toISOString() }
          : path.endsWith('/child-slots')
            ? { childSlotId: 'e2e-child-slot' }
            : path.endsWith('/wallets')
              ? { parentVault: 0, parentVaultVersion: 0, children: [] }
              : path.endsWith('/subscriptions')
                ? { subscriptions: [] }
                : { success: true };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(response) });
  });

  await page.goto('/');
  const start = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
  try { await start.waitFor({ state: 'visible', timeout: 10_000 }); await start.click({ force: true }); } catch { /* already dismissed */ }
  await openParentGate(page);
  await expect(page.getByPlaceholder('PIN phụ huynh 6 số')).toBeVisible();
  await expect(page.getByText('Mật khẩu review:')).toHaveCount(0);

  await page.getByRole('button', { name: 'Quên PIN / đặt lại bằng email' }).click();
  const resetEmail = page.getByLabel('Email đặt lại PIN');
  await expect(resetEmail).toHaveValue('old@example.com');
  await resetEmail.fill('Parent@Example.COM');
  await page.getByRole('button', { name: 'Gửi mã đặt lại' }).click();
  await expect(page.getByRole('status')).toContainText('Mã thử nghiệm: 654321');

  const resetOtp = page.getByLabel('Mã đặt lại PIN');
  await resetOtp.fill('abcdef');
  await expect(resetOtp).toHaveValue('');
  await resetOtp.fill('654321');
  await expect(resetOtp).toHaveValue('654321');
  await page.getByLabel('PIN mới', { exact: true }).fill('112233');
  await page.getByLabel('Nhập lại PIN mới').fill('332211');
  await page.getByRole('button', { name: 'Đặt lại PIN', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Hai mã PIN mới không trùng nhau.');

  await page.getByLabel('Nhập lại PIN mới').fill('112233');
  await page.getByRole('button', { name: 'Đặt lại PIN', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Khóa góc phụ huynh' })).toBeVisible();

  expect(requests).toContainEqual({ path: '/api/v1/auth/pin-reset/request', body: { email: 'parent@example.com' } });
  expect(requests).toContainEqual({ path: '/api/v1/auth/pin-reset/confirm', body: { email: 'parent@example.com', otp: '654321', newPin: '112233' } });
  expect(requests).toContainEqual({ path: '/api/v1/parent/pin/verify', body: { pin: '112233' } });
  const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('novastars_parent_session') ?? '{}'));
  expect(stored).toEqual({ token: 'c'.repeat(64), refreshToken: 'd'.repeat(64) });
});

test('reset PIN keeps the email step visible when the server rate-limits OTP requests', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('novastars_parent_session', JSON.stringify({ token: 'a'.repeat(64) }));
    localStorage.setItem('novastars_parent_email', 'parent@example.com');
  });
  await page.route('**/api/v1/auth/pin-reset/request', async (route) => {
    await route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({ error: { code: 'OTP_RATE_LIMITED', message: 'Đã gửi quá nhiều mã. Vui lòng thử lại sau.' } }),
    });
  });

  await page.goto('/');
  const start = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
  try { await start.waitFor({ state: 'visible', timeout: 10_000 }); await start.click({ force: true }); } catch { /* already dismissed */ }
  await openParentGate(page);
  await expect(page.getByPlaceholder('PIN phụ huynh 6 số')).toBeVisible();
  await page.getByRole('button', { name: 'Quên PIN / đặt lại bằng email' }).click();
  await page.getByRole('button', { name: 'Gửi mã đặt lại' }).click();

  await expect(page.getByRole('alert')).toContainText('Đã gửi quá nhiều mã. Vui lòng thử lại sau.');
  await expect(page.getByLabel('Email đặt lại PIN')).toBeVisible();
  await expect(page.getByLabel('Mã đặt lại PIN')).toHaveCount(0);
});
