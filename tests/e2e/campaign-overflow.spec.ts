import { expect, test } from "@playwright/test";
import { firstCampaignPath } from "./helpers";

// A page wider than the phone screen pushes popups off-centre and clips them
test("pages are not wider than the phone screen", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  const campaign = await firstCampaignPath(page);
  const wide: string[] = [];
  for (const path of ["/", "/campaigns", campaign ?? "/campaigns"]) {
    await page.goto(path);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1500); // let images and animations settle
    const r = await page.evaluate(() => {
      const w = window.innerWidth;
      const culprits = [...document.querySelectorAll("body *")]
        .map((e) => ({ e, r: e.getBoundingClientRect() }))
        .filter(({ r }) => r.right > w + 1 && r.width > 0)
        .slice(0, 5)
        .map(({ e, r }) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 50)} (right edge ${Math.round(r.right)}px)`);
      return { w, scrollWidth: document.documentElement.scrollWidth, culprits };
    });
    if (r.scrollWidth > r.w) wide.push(`${path}: page is ${r.scrollWidth}px wide on a ${r.w}px screen; ${r.culprits.join("; ")}`);
  }
  expect(wide).toEqual([]);
});
