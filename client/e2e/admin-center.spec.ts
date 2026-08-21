import { test, expect } from '@playwright/test';

test.describe('Admin Center & Wiki Review Static Routing', () => {
  test('should load Admin Center portal without SPA fallback', async ({ page }) => {
    await page.goto('/admin_center/index.html');
    await expect(page).toHaveTitle(/NovaStars Admin Center & Review Portal/);
    
    // Check key heading in Admin Center
    const heading = page.locator('h1');
    await expect(heading).toContainText('Admin Center & Review Hub');

    // Check review iframe exists
    const iframe = page.locator('#review-frame');
    await expect(iframe).toBeVisible();
  });

  test('should load Wiki Review Dashboard', async ({ page }) => {
    await page.goto('/project_knowledge_wiki_review.html');
    await expect(page).toHaveTitle(/NovaStars/);
  });
});
