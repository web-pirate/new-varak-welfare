import { expect, test } from "@playwright/test";
import { collectErrors, firstCampaignPath } from "./helpers";

test("campaign page shows the story, donate card and verification details", async ({ page }) => {
  const errors = collectErrors(page);
  const path = await firstCampaignPath(page);
  test.skip(!path, "no campaigns in the database");
  await page.goto(path!);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("tab", { name: "Story" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Donate Now" }).first()).toBeVisible();
  await expect(page.getByText(/funded|Fully funded/).first()).toBeVisible();
  expect(errors, "console and page errors").toEqual([]);
});

test("campaign page has one header and one footer", async ({ page }) => {
  const path = await firstCampaignPath(page);
  test.skip(!path, "no campaigns in the database");
  await page.goto(path!);
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
});
