import { defineConfig, devices } from "@playwright/test";
import os from "os";
import path from "path";

export default defineConfig({
  testDir: "./tests/e2e",
  retries: 1,
  reporter: "list",
  outputDir: path.join(os.tmpdir(), "sparkcv-playwright-output"),
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
