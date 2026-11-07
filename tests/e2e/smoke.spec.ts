import { expect, test } from "@playwright/test";
import { collectErrors } from "./helpers";

const PAGES = [
  "/", "/campaigns", "/about", "/cancer-types", "/how-it-works", "/faq", "/contact", "/careers",
  "/monthly-giving", "/privacy", "/terms", "/refund", "/cancellation", "/start-fundraiser", "/sign-in", "/sign-up",
];

for (const path of PAGES) {
  test(`page loads without errors: ${path}`, async ({ page }) => {
    const errors = collectErrors(page);
    const res = await page.goto(path);
    expect(res?.status(), "HTTP status").toBeLessThan(400);
    // Sign-in pages keep polling forever, so "networkidle" never arrives; give scripts a moment instead
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1500);
    expect(errors, "console and page errors").toEqual([]);
  });
}

test("guests can reach the payment route (not blocked by sign-in)", async ({ request }) => {
  // An empty body should fail validation (400), never be turned away as 401 or 404
  const res = await request.post("/api/payments/create-order", { data: {} });
  expect(res.status()).toBe(400);
});
