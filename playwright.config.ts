import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests sequentially to avoid bank session collisions and race conditions */
  fullyParallel: false,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Disable automated framework retries to let our custom bug_reproduction_skill handle 3x validation */
  retries: 0,

  /* Limit to a single worker in local development to preserve system resources */
  workers: 1,

  /* Maximum execution time for a single test suite */
  timeout: 30 * 1000,

  /* Assertion timeout for web-first expect matchers */
  expect: {
    timeout: 5000,
  },

  /* Reporter to use in CLI execution */
  reporter: 'list',

  /* Shared configuration settings across all test suites */
  use: {
    /* Base URL used across tests (enables relative paths like await page.goto('/login')) */
    baseURL: 'https://zincbank.cydeo.io',

    /* Record traces only when a test fails to optimize local disk usage */
    trace: 'retain-on-failure',

    /* Capture screenshot automatically on failure */
    screenshot: 'only-on-failure',

    /* Disable video recording by default to speed up test execution */
    video: 'off',
  },

  /* Configure target browser projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* Additional browsers (Firefox, WebKit, branded browsers) can be enabled here when needed */
  ],
});