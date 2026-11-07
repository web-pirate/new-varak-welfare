import { expect, test, type Page } from "@playwright/test";

/** Problems a visitor would hit: script errors, console errors, and our own requests failing.
 * Third-party failures (fonts, ads, images on other hosts) are ignored: they depend on the network, not on our code. */
export function collectErrors(page: Page) {
  const errors: string[] = [];
  const ours = (url: string) => new URL(url).origin === new URL(page.url() === "about:blank" ? "http://localhost:3000" : page.url()).origin;
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push(`console: ${m.text()}`);
  });
  page.on("requestfailed", (r) => ours(r.url()) && errors.push(`request failed: ${r.url()}`));
  page.on("response", (r) => ours(r.url()) && r.status() >= 400 && errors.push(`${r.status()}: ${r.url()}`));
  return errors;
}

/** Path of the first campaign in the list, or null when the database has none. */
export async function firstCampaignPath(page: Page): Promise<string | null> {
  await page.goto("/campaigns");
  const link = page.locator('a[href^="/campaigns/"]').first();
  if ((await link.count()) === 0) return null;
  return link.getAttribute("href");
}

/** Open a campaign and its donate popup. exit = which exit-message group to test. */
export async function openDonatePopup(page: Page, exit: "story" | "control" = "story") {
  await page.addInitScript((v) => localStorage.setItem("varak-exit-ab", v), exit);
  const path = await firstCampaignPath(page);
  test.skip(!path, "no campaigns in the database");
  await page.goto(path!);
  const donate = page.getByRole("button", { name: "Donate Now" }).first();
  await donate.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  return dialog;
}
