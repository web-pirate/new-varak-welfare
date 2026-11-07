import { defineConfig, devices } from "@playwright/test";

// One timestamp per run, shared with worker processes through the environment
const pad = (n: number) => String(n).padStart(2, "0");
const now = new Date();
const stamp = (process.env.E2E_STAMP ??=
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`);
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
// These tests are for local runs only; never point them at the live site by accident
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(baseURL) && process.env.E2E_ALLOW_REMOTE !== "1") {
  throw new Error(`Refusing to run E2E tests against ${baseURL}. Use localhost, or set E2E_ALLOW_REMOTE=1 on purpose.`);
}
const dir = `reports/e2e/${stamp}`;

export default defineConfig({
  testDir: "tests/e2e",
  outputDir: `${dir}/artifacts`,
  fullyParallel: false, // the donation route is rate limited per IP, so keep one worker
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: [
    ["list"],
    ["html", { outputFolder: `${dir}/html`, open: "never" }],
    ["./tests/e2e/summary-reporter.ts", { file: `${dir}/summary.md` }],
  ],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] }, testMatch: /home|campaign|donation/ },
  ],
  // Reuses the dev server you already have running
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
