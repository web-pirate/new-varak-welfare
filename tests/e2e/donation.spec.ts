import { expect, test } from "@playwright/test";
import { openDonatePopup } from "./helpers";

test("popup offers six amounts with 1,000 selected", async ({ page }) => {
  const dialog = await openDonatePopup(page);
  for (const label of ["₹500", "₹1,000", "₹2,500", "₹5,000", "₹10,000", "₹25,000"]) {
    await expect(dialog.getByRole("button", { name: label, exact: true })).toBeVisible();
  }
  await expect(dialog.getByRole("button", { name: /Donate ₹1,000/ })).toBeVisible();
});

test("picking an amount updates the pay button", async ({ page }) => {
  const dialog = await openDonatePopup(page);
  await dialog.getByRole("button", { name: "₹2,500", exact: true }).click();
  await expect(dialog.getByRole("button", { name: /Donate ₹2,500/ })).toBeVisible();
});

test("asks for a name, then a phone or email, before paying", async ({ page }) => {
  const dialog = await openDonatePopup(page);
  await dialog.getByRole("button", { name: /Donate ₹/ }).click();
  await expect(dialog).toContainText("Please enter your name or donate anonymously");
  await dialog.getByPlaceholder("Full name").fill("Test Donor");
  await dialog.getByRole("button", { name: /Donate ₹/ }).click();
  await expect(dialog).toContainText("Enter a phone number or email");
});

test("anonymous checkbox hides the name field", async ({ page }) => {
  const dialog = await openDonatePopup(page);
  await expect(dialog.getByPlaceholder("Full name")).toBeVisible();
  await dialog.getByLabel("Donate anonymously").check();
  await expect(dialog.getByPlaceholder("Full name")).toHaveCount(0);
});

test("closing shows the exit message once, then closes", async ({ page }) => {
  const dialog = await openDonatePopup(page, "story");
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog.getByRole("heading", { name: /Please don't leave/ })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "₹500", exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Not now" }).click();
  await expect(dialog).toBeHidden();
});

test("tapping an amount in the exit message goes back to the form", async ({ page }) => {
  const dialog = await openDonatePopup(page, "story");
  await dialog.getByRole("button", { name: "Close" }).click();
  await dialog.getByRole("button", { name: "₹2,500", exact: true }).click();
  await expect(dialog.getByRole("button", { name: /Donate ₹2,500/ })).toBeVisible();
});

test("control group closes straight away with no message", async ({ page }) => {
  const dialog = await openDonatePopup(page, "control");
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
});

test("popup fits inside the phone screen", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  const dialog = await openDonatePopup(page);
  await page.waitForTimeout(500); // let the open animation finish
  const box = await dialog.boundingBox();
  const width = page.viewportSize()!.width;
  expect(box!.x, "left edge").toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width, "right edge").toBeLessThanOrEqual(width);
});
