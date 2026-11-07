import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("home has exactly one headline and the donate button leads", async ({ page }) => {
  await expect(page.locator("h1")).toHaveCount(1);
  const hero = page.locator("#hero");
  await expect(hero.getByRole("link", { name: "Donate Now" })).toBeVisible();
  await expect(hero.getByRole("link", { name: /Start a Fundraiser/ })).toBeVisible();
});

test("trust strip sits right under the hero, before trending campaigns", async ({ page }) => {
  const strip = page.getByLabel("Why donors trust Varak");
  await expect(strip).toContainText("0% platform fee");
  await expect(strip).toContainText("80G tax benefit");
  await expect(strip).toContainText("3-tier verified");
  const heroBox = await page.locator("#hero").boundingBox();
  const stripBox = await strip.boundingBox();
  expect(stripBox!.y).toBeGreaterThanOrEqual(heroBox!.y + heroBox!.height - 2);
});

test("calculator and expert form moved off the home page", async ({ page }) => {
  await expect(page.getByText("Fills the Gap")).toHaveCount(0);
});

test("sticky donate bar appears on phones only after the hero scrolls away", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  const bar = page.locator("div.fixed", { has: page.getByRole("link", { name: "Donate Now" }) });
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, document.getElementById("hero")!.offsetHeight + 400));
  await expect(bar).toBeVisible();
});
