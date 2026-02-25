import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './features/tests',

  timeout: 120000,

  expect: {
    timeout: 10000,
  },

  fullyParallel: false,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});