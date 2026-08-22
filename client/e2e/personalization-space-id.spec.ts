import { expect, test } from '@playwright/test';

test('Space ID renders at export size and requires a fresh parent PIN', async ({ page }) => {
  let pinChecks = 0;
  await page.route('**/api/v1/parent/pin/verify', async (route) => { pinChecks += 1; await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, unlockedUntil: new Date(Date.now()+180_000).toISOString() }) }); });
  await page.goto('/');
  const start = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
  try { await start.waitFor({ state: 'visible', timeout: 12_000 }); await start.click({ force: true }); await start.waitFor({ state: 'hidden', timeout: 6_000 }).catch(()=>undefined); } catch { /* FTUE done */ }
  await page.locator('button:has-text("HQ")').first().click({ force: true });
  await page.getByTestId('open-space-id').click();
  const preview = page.getByAltText('Xem trước Space ID'); await expect(preview).toBeVisible();
  expect(await preview.evaluate((image: HTMLImageElement) => [image.naturalWidth,image.naturalHeight])).toEqual([1080,1920]);
  page.once('dialog', (dialog) => dialog.accept('1234'));
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('export-space-id').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^novastars-space-id-\d{4}-\d{2}-\d{2}\.png$/);
  expect(pinChecks).toBe(0);
});
