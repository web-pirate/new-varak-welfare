import { expect, test } from "@playwright/test";

const START = ["/", "/campaigns", "/about", "/how-it-works", "/faq", "/monthly-giving", "/start-fundraiser"];
// Signed-out visitors cannot open these, so they are not broken links
const SKIP = /^\/(dashboard|api|register-ngo)/;

test("every internal link on the main pages leads somewhere", async ({ page, request }) => {
  test.setTimeout(120_000);
  const links = new Map<string, string>(); // target -> page it was found on
  for (const from of START) {
    await page.goto(from);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    for (const h of hrefs) {
      const target = h.split("#")[0].split("?")[0] || "/";
      if (!SKIP.test(target) && !links.has(target)) links.set(target, from);
    }
  }

  const broken: string[] = [];
  for (const [target, from] of links) {
    const res = await request.get(target, { maxRedirects: 5 });
    if (res.status() >= 400) broken.push(`${target} -> ${res.status()} (linked from ${from})`);
  }
  expect(broken, `checked ${links.size} links`).toEqual([]);
});
