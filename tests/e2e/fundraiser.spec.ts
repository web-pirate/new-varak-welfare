import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/start-fundraiser");
  await page.evaluate(() => localStorage.removeItem("varak-fundraiser-draft"));
  await page.reload();
});

test("a guest can start a fundraiser and sees step progress", async ({ page }) => {
  await expect(page.getByText("Step 1 of 5")).toBeVisible();
  await page.getByPlaceholder("Full name of the patient").fill("Test Patient");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Step 2 of 5")).toBeVisible();
});

test("calculator and expert form are on the fundraiser page", async ({ page }) => {
  await expect(page.getByText("Fills the Gap").first()).toBeVisible();
});

test("guest is asked to sign in after the story step, and the draft is kept", async ({ page }) => {
  await page.getByPlaceholder("Full name of the patient").fill("Test Patient");
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await page.getByRole("combobox").first().click();
  await page.getByRole("option").first().click();
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await page.getByPlaceholder(/Help Priya/).fill("Help Test Patient fight cancer");
  await page.getByPlaceholder(/Minimum/).fill("50000");
  await page.getByPlaceholder(/Tell donors/).fill("Test Patient needs treatment and the family cannot cover the full cost of it.");
  await page.getByPlaceholder(/₹3,00,000/).fill("Hospital bills and six months of medicines.");
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await page.waitForURL(/sign-in/);
  const draft = await page.evaluate(() => localStorage.getItem("varak-fundraiser-draft"));
  expect(draft).toContain("Test Patient");
});

test("step 3 will not continue without the use of funds", async ({ page }) => {
  await page.getByPlaceholder("Full name of the patient").fill("Test Patient");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("combobox").first().click();
  await page.getByRole("option").first().click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByPlaceholder(/Help Priya/).fill("Help Test Patient fight cancer");
  await page.getByPlaceholder(/Minimum/).fill("50000");
  await page.getByPlaceholder(/Tell donors/).fill("Test Patient needs treatment and the family cannot cover the full cost of it.");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText(/what the money will be used for/i)).toBeVisible();
});
