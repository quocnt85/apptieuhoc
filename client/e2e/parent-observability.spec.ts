import { expect, test } from '@playwright/test';

const adminSecret = 'admin-secret-for-e2e-only-1234567890';

test.describe('Parent Zone aggregate observability dashboard', () => {
  test('sends the secret only in a one-shot header and renders an aggregate allowlist', async ({ page }) => {
    await page.route('**/api/v1/admin/observability?hours=24', async (route) => {
      const request = route.request();
      expect(request.headers()['x-admin-secret']).toBe(adminSecret);
      expect(request.url()).not.toContain(adminSecret);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'Cache-Control': 'no-store' },
        body: JSON.stringify({
          success: true,
          generatedAt: '2026-08-22T10:00:00.000Z',
          hours: 24,
          status: 'critical',
          auth: { errorRequests: 4, pinDeniedRequests: 2, rateLimitedRequests: 1 },
          otp: { issued: 8, consumed: 6, expiredUnconsumed: 2 },
          purchases: { failedEvents: 1, stalePendingEvents: 3 },
          finance: { walletLedgerMismatches: 1 },
          email: 'must-not-render@example.com',
          parentId: 'must-not-render-parent-id',
        }),
      });
    });
    await page.goto('/admin_center/parent_zone_observability.html');
    await expect(page).toHaveTitle(/Parent Zone Observability/);
    await page.getByLabel('Admin secret').fill(adminSecret);
    await page.getByRole('button', { name: 'Tải tổng hợp' }).click();

    await expect(page.getByText('critical', { exact: true })).toBeVisible();
    await expect(page.locator('#auth-errors')).toHaveText('4');
    await expect(page.locator('#otp-issued')).toHaveText('8');
    await expect(page.locator('#purchase-failed')).toHaveText('1');
    await expect(page.locator('#ledger-mismatch')).toHaveText('1');
    await expect(page.getByRole('status')).toContainText('Secret không được lưu');
    await expect(page.getByLabel('Admin secret')).toHaveValue('');
    await expect(page.getByText('must-not-render@example.com')).toHaveCount(0);
    await expect(page.getByText('must-not-render-parent-id')).toHaveCount(0);
    expect(await page.evaluate((secret) => ({
      local: Object.values(localStorage).some((value) => value.includes(secret)),
      session: Object.values(sessionStorage).some((value) => value.includes(secret)),
      url: location.href.includes(secret),
    }), adminSecret)).toEqual({ local: false, session: false, url: false });
  });

  test('rejects non-local HTTP API origins before making a request', async ({ page }) => {
    const apiRequests: string[] = [];
    page.on('request', (request) => { if (request.url().includes('/api/v1/admin/')) apiRequests.push(request.url()); });
    await page.goto('/admin_center/parent_zone_observability.html');
    await page.getByLabel('API origin').fill('http://api.example.com');
    await page.getByLabel('Admin secret').fill(adminSecret);
    await page.getByRole('button', { name: 'Tải tổng hợp' }).click();
    await expect(page.getByRole('alert')).toContainText('API origin phải dùng HTTPS');
    await expect(page.getByLabel('Admin secret')).toHaveValue('');
    expect(apiRequests).toEqual([]);
  });
});
