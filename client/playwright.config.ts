import { defineConfig, devices } from '@playwright/test';

const parentAuthE2E = process.env.PARENT_AUTH_E2E === 'true';
const requestedE2EPort = Number(process.env.PLAYWRIGHT_E2E_PORT);
const e2ePort = parentAuthE2E
  ? 3001
  : Number.isInteger(requestedE2EPort) && requestedE2EPort > 0 && requestedE2EPort <= 65_535
    ? requestedE2EPort
    : 3000;
const viteCommand = process.platform === 'win32'
  ? `npx.cmd vite --port ${e2ePort} --host`
  : `npx vite --port ${e2ePort} --host`;

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 4, // Tối thiểu 4, tối đa 8 theo user rule
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${e2ePort}`,
    trace: 'on-first-retry',
    hasTouch: true,
  },
  projects: [
    {
      name: 'Minimum iOS (iPhone X WebKit)',
      use: {
        ...devices['iPhone X'],
        browserName: 'webkit',
      },
    },
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
    command: parentAuthE2E ? 'node scripts/start-parent-auth-e2e-server.mjs' : viteCommand,
    url: `http://localhost:${e2ePort}`,
    reuseExistingServer: !parentAuthE2E,
    timeout: 120000,
  },
});
