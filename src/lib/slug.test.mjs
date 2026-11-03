import { test } from "node:test";
import assert from "node:assert/strict";
import { campaignSlug, shortId, slugId, slugify } from "./slug.ts";

test("English title keeps a readable part", () => {
  assert.match(campaignSlug("Help Sunita fight breast cancer"), /^help-sunita-fight-breast-cancer-[a-z0-9]{8}$/);
});

test("Hindi, Arabic and Chinese titles never produce an empty or id-only slug", () => {
  for (const title of ["सुनीता के इलाज में मदद करें", "ساعدوا أحمد", "帮助小明"]) {
    assert.match(campaignSlug(title), /^campaign-[a-z0-9]{8}$/);
    assert.match(campaignSlug(title, "Lung Cancer"), /^lung-cancer-[a-z0-9]{8}$/);
  }
});

test("Mixed titles keep their Latin words", () => {
  assert.match(campaignSlug("Help राम fight cancer"), /^help-fight-cancer-[a-z0-9]{8}$/);
});

test("Long titles are cut and never end with a dash before the id", () => {
  const slug = campaignSlug("word ".repeat(40));
  assert.ok(slug.length <= 60 + 1 + 8);
  assert.doesNotMatch(slug, /--/);
});

test("slugId finds our id and ignores ordinary words", () => {
  const id = shortId();
  assert.equal(slugId(`anything-at-all-${id}`), id);
  for (const slug of ["help-kabir-fight-lymphoma", "help-aarav-fight-leukemia", "lung-cancer", "", "no-dash-here-"]) {
    assert.equal(slugId(slug), null, slug);
  }
});

test("ids are unique across many draws and always mix letters and digits", () => {
  const ids = new Set(Array.from({ length: 5000 }, shortId));
  assert.equal(ids.size, 5000);
  for (const id of ids) assert.match(id, /^(?=.*\d)(?=.*[a-z])[a-z0-9]{8}$/);
});

test("slugify is unchanged for the cancer-type links", () => {
  assert.equal(slugify("Blood Cancer (Leukemia)"), "blood-cancer-leukemia");
  assert.equal(slugify("Head & Neck Cancer"), "head-neck-cancer");
});
