import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Next.js loads .env.local into its own process automatically; the
// Playwright test runner is a separate process, so global-setup/teardown
// and spec files (which read E2E_SUPABASE_SERVICE_ROLE_KEY directly, not
// through Next.js) need it loaded explicitly here too.
dotenv.config({ path: ".env.local" });

const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: "npm run build && npm run start -- -p " + PORT,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      NODE_ENV: "production",
    },
  },
});
