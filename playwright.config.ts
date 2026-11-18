import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node --import ./tests/mock-fetch.mjs node_modules/@react-router/serve/dist/cli.js ./build/server/index.js",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    env: {
      NODE_ENV: "production",
      OPENWEATHER_API_KEY: "e2e-only-key",
    },
  },
});
