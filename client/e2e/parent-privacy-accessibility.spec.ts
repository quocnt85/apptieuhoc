import { expect, test, type Page, type Request } from '@playwright/test';

async function dismissFTUEIfPresent(page: Page) {
  const start = page.locator('button:has-text("Bắt Đầu Ngay 🚀"), button:has-text("Bắt Đầu")');
  try {
    await start.waitFor({ state: 'visible', timeout: 10_000 });
    await start.click({ force: true });
    await start.waitFor({ state: 'hidden', timeout: 3_000 });
  } catch {
    // The onboarding was already dismissed.
  }
}

async function openDemoParentZone(page: Page) {
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.goto('/');
  await dismissFTUEIfPresent(page);
  const gateButton = page.getByRole('button', { name: 'Phụ huynh mở cài đặt' });
  if (await gateButton.isVisible()) await gateButton.click();
  else await page.getByRole('button', { name: '👨‍👩‍👧 Phụ Huynh', exact: true }).click({ force: true });
  await page.getByPlaceholder('Mật khẩu demo').fill('1234');
  await page.getByRole('button', { name: 'Vào Góc phụ huynh' }).click();
  await expect(page.getByText('DEMO', { exact: true })).toBeVisible();
}

const requestEvidence = (request: Request) => ({
  method: request.method(),
  resourceType: request.resourceType(),
  url: request.url(),
  body: request.postData() ?? '',
});

test.describe('Parent Zone privacy and accessibility gates', () => {
  test('keeps child profile, grade, progress, usage and mission data off the network in demo', async ({ page }) => {
    await openDemoParentZone(page);

    const captured: ReturnType<typeof requestEvidence>[] = [];
    page.on('request', (request) => captured.push(requestEvidence(request)));

    const privateName = 'Bé Mạng Kín 8F4C';
    const privateMission = 'Nhiệm vụ riêng 71A9';
    await page.getByRole('tab', { name: 'Hồ sơ' }).click();
    await page.getByPlaceholder('Tên hiển thị local').fill(privateName);
    await page.getByLabel('Khối của hồ sơ mới').selectOption('5');
    await page.getByRole('button', { name: 'Tạo hồ sơ' }).click();
    await expect(page.getByText(privateName, { exact: true })).toBeVisible();

    await page.getByRole('tab', { name: 'Thời gian' }).click();
    await page.getByRole('slider', { name: /Giới hạn mỗi ngày/ }).fill('35');

    await page.evaluate((missionTitle) => {
      const store = (window as any).__parentZoneStore;
      const profileId = store.getState().activeProfileId;
      store.setState({
        activities: [{ id: 'private-activity', profileId, type: 'lesson', sourceId: 'private-source', title: 'Bài học riêng 3D2E', completedAt: Date.now(), score: 88 }],
        missions: [{
          id: 'private-mission', rewardRequestId: 'mission:private-mission', profileId,
          sourceLessonId: 'PRIVATE-LESSON', contentMissionId: 'MISSION-PRIVATE-71A9', title: missionTitle,
          difficulty: 'easy', fixedCoinReward: 50, status: 'done_by_child', proposedAt: Date.now() - 1_000, completedAt: Date.now(),
        }],
      });
    }, privateMission);
    await page.getByRole('tab', { name: 'Nhiệm vụ' }).click();
    await page.getByPlaceholder('Kim cương (0 = không thưởng)').fill('7');
    await page.getByRole('button', { name: 'Duyệt', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('+50 Xu · +7');

    await page.waitForTimeout(250);
    const serialized = JSON.stringify(captured);
    for (const forbidden of [privateName, privateMission, 'Bài học riêng 3D2E', 'MISSION-PRIVATE-71A9']) {
      expect(serialized, `network evidence must not contain ${forbidden}`).not.toContain(forbidden);
    }
    const apiRequests = captured.filter((item) => item.url.includes('/api/v1/'));
    expect(apiRequests, 'demo local-only Parent Zone actions must not call the API').toEqual([]);
  });

  test('exposes keyboard-operable tabs, selected state, named panel and 44px primary controls', async ({ page }) => {
    await openDemoParentZone(page);

    const tablist = page.getByRole('tablist', { name: 'Các mục Góc phụ huynh' });
    await expect(tablist).toBeVisible();
    const reportTab = page.getByRole('tab', { name: 'Báo cáo' });
    await expect(reportTab).toHaveAttribute('aria-selected', 'true');

    const profilesTab = page.getByRole('tab', { name: 'Hồ sơ' });
    await reportTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(profilesTab).toHaveAttribute('aria-selected', 'true');
    await expect(profilesTab).toBeFocused();
    await expect(page.getByRole('tabpanel', { name: 'Hồ sơ' })).toBeVisible();

    const focusStyle = await profilesTab.evaluate((element) => {
      const style = getComputedStyle(element);
      return `${style.outlineStyle}|${style.boxShadow}`;
    });
    expect(focusStyle).not.toBe('none|none');

    const undersized = await page.getByRole('tabpanel').locator('button:visible, input:visible, select:visible').evaluateAll((elements) => elements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { name: element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.textContent?.trim(), width: rect.width, height: rect.height };
      })
      .filter((item) => item.width < 44 || item.height < 44));
    expect(undersized).toEqual([]);
  });

  test('reflows at 200% root text size and keeps primary control contrast at WCAG AA', async ({ page }) => {
    await openDemoParentZone(page);
    await page.addStyleTag({ content: ':root { font-size: 32px !important; }' });

    const reportTab = page.getByRole('tab', { name: 'Báo cáo' });
    const profilesTab = page.getByRole('tab', { name: 'Hồ sơ' });
    await profilesTab.click();
    await page.getByPlaceholder('Tên hiển thị local').fill('Bé Chữ Lớn');

    const layout = await page.getByRole('tabpanel', { name: 'Hồ sơ' }).evaluate((panel) => {
      const panelRect = panel.getBoundingClientRect();
      const overflow = [...panel.querySelectorAll<HTMLElement>('button, input, select')]
        .filter((element) => {
          const style = getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          const rect = element.getBoundingClientRect();
          return rect.left < panelRect.left - 1 || rect.right > panelRect.right + 1;
        })
        .map((element) => element.getAttribute('aria-label') || element.getAttribute('placeholder') || element.textContent?.trim());
      return { overflow, scrollWidth: panel.scrollWidth, clientWidth: panel.clientWidth };
    });
    expect(layout.overflow).toEqual([]);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);

    const contrast = await page.evaluate(() => {
      const parse = (value: string): [number, number, number] => {
        const numbers = value.match(/[\d.]+/g)?.map(Number) ?? [];
        return [numbers[0] ?? 0, numbers[1] ?? 0, numbers[2] ?? 0];
      };
      const luminance = ([red, green, blue]: [number, number, number]) => {
        const channels = [red, green, blue].map((value) => {
          const normalized = value / 255;
          return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
      };
      const ratio = (element: Element | null) => {
        if (!element) return 0;
        const style = getComputedStyle(element);
        const foreground = luminance(parse(style.color));
        const background = luminance(parse(style.backgroundColor));
        return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
      };
      return {
        selectedTab: ratio(document.querySelector('[role="tab"][aria-selected="true"]')),
        textField: ratio(document.querySelector('input[placeholder="Tên hiển thị local"]')),
        createButton: ratio([...document.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'Tạo hồ sơ') ?? null),
      };
    });
    expect(contrast.selectedTab).toBeGreaterThanOrEqual(4.5);
    expect(contrast.textField).toBeGreaterThanOrEqual(4.5);
    expect(contrast.createButton).toBeGreaterThanOrEqual(4.5);
    await expect(reportTab).toHaveCount(1);
  });
});
