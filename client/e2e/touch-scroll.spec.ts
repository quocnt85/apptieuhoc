import { test, expect } from '@playwright/test';

test.describe('3D Canvas Touch & Scroll Isolation Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    // Dismiss FTUE if present
    try {
      const startBtn = page.locator('button:has-text("Bắt Đầu Hành Trình Ngay!")');
      await startBtn.waitFor({ state: 'visible', timeout: 7000 });
      await startBtn.click({ force: true });
      await startBtn.waitFor({ state: 'hidden', timeout: 4000 }).catch(() => {});
    } catch {
      // FTUE already dismissed
    }
  });

  test('1. Root HTML & Body CSS layout is locked (position fixed, overflow hidden, overscroll none)', async ({ page }) => {
    const htmlStyles = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      const root = document.getElementById('root');
      const htmlComputed = window.getComputedStyle(html);
      const bodyComputed = window.getComputedStyle(body);
      const rootComputed = root ? window.getComputedStyle(root) : null;

      return {
        htmlOverflow: htmlComputed.overflow,
        htmlPosition: htmlComputed.position,
        bodyOverflow: bodyComputed.overflow,
        bodyPosition: bodyComputed.position,
        rootPosition: rootComputed?.position,
        rootOverflow: rootComputed?.overflow,
      };
    });

    expect(htmlStyles.htmlOverflow).toBe('hidden');
    expect(htmlStyles.htmlPosition).toBe('fixed');
    expect(htmlStyles.bodyOverflow).toBe('hidden');
    expect(htmlStyles.bodyPosition).toBe('fixed');
    expect(htmlStyles.rootPosition).toBe('fixed');
    expect(htmlStyles.rootOverflow).toBe('hidden');
  });

  test('2. 3D Planet Canvas has touch-action: none and vertical/horizontal drags do not scroll page', async ({ page }) => {
    // Navigate to Planet 3D view
    await page.locator('button:has-text("Hành Tinh")').first().click({ force: true });
    await expect(page.locator('text=Tinh Cầu Dũng Khí').first()).toBeVisible({ timeout: 6000 });

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 6000 });

    // Verify touchAction style
    const touchAction = await canvas.evaluate((el) => {
      return window.getComputedStyle(el).touchAction;
    });
    expect(touchAction).toBe('none');

    // Perform vertical and horizontal drag swipes over the canvas
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      // Vertical swipe
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX, startY - 80, { steps: 3 });
      await page.mouse.move(startX, startY + 80, { steps: 3 });
      await page.mouse.up();

      // Horizontal swipe
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX - 80, startY, { steps: 3 });
      await page.mouse.move(startX + 80, startY, { steps: 3 });
      await page.mouse.up();
    }

    // Verify window scroll offsets remain exactly 0
    const scrollOffsets = await page.evaluate(() => {
      return {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        bodyScrollTop: document.body.scrollTop,
        docScrollTop: document.documentElement.scrollTop,
      };
    });

    expect(scrollOffsets.scrollX).toBe(0);
    expect(scrollOffsets.scrollY).toBe(0);
    expect(scrollOffsets.bodyScrollTop).toBe(0);
    expect(scrollOffsets.docScrollTop).toBe(0);
  });

  test('3. 3D Space Showroom Canvas has touch-action: none and dragging does not scroll', async ({ page }) => {
    // Open Showroom View
    const showroomBtn = page.locator('button:has-text("Duyệt 3D")');
    if (await showroomBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await showroomBtn.click({ force: true });
    } else {
      await page.locator('button:has-text("Xưởng Tàu")').first().click({ force: true });
      await page.locator('button:has-text("Mở Phòng Duyệt 3D")').first().click({ force: true });
    }

    await expect(page.locator('text=Phòng Duyệt 3D Không Gian').first()).toBeVisible({ timeout: 6000 });

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 6000 });

    const touchAction = await canvas.evaluate((el) => window.getComputedStyle(el).touchAction);
    expect(touchAction).toBe('none');

    // Drag model
    const box = await canvas.boundingBox();
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX + 60, startY - 60, { steps: 3 });
      await page.mouse.up();
    }

    const scrollOffsets = await page.evaluate(() => ({
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    }));
    expect(scrollOffsets.scrollX).toBe(0);
    expect(scrollOffsets.scrollY).toBe(0);
  });
});
