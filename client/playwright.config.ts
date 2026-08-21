import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 4, // Tối thiểu 4, tối đa 8 theo user rule
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    hasTouch: true,
  },
  projects: [
    {
      name: 'Mobile Android (Pixel 7)',
      use: { 
        ...devices['Pixel 7'],
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'Mobile iOS (iPhone 14 Pro)',
      use: { 
        viewport: { width: 393, height: 852 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'Small Screen Mobile (iPhone SE)',
      use: { 
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'Tablet Screen (iPad Mini)',
      use: { 
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'chromium',
      },
    },
  ],
  webServer: {
    command: 'npx.cmd vite preview --port 4173 --host',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120000,
  },
});

