import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: "./src",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: [
    ['html', { open: "never" }],
    ['list'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        screenshots: true, // Attach screenshots to Allure
        videos: true       // Attach videos to Allure
      }
    ]
  ],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    baseURL: "http://localhost:3000", // Update as needed
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /.*api.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: 'firefox',
      testIgnore: /.*api.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /.*api.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testMatch: /.*api.*\.spec\.ts/,
      use: {},
    }
  ],
});
