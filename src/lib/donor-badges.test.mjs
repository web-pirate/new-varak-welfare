import { test } from "node:test";
import assert from "node:assert/strict";
import { BADGES, earnedBadges } from "./donor-badges.ts";

const d = (s) => new Date(s);
const base = { subscriptionMonths: 0, commentCount: 0, isFoundingDonor: false };
const camp = { createdAt: d("2026-01-01"), goalAmount: 1000, cancerTypeId: "c1", stateId: "s1", beneficiaryAge: 40 };

test("15 badges with unique ids", () => {
  assert.equal(BADGES.length, 15);
  assert.equal(new Set(BADGES.map((b) => b.id)).size, 15);
});

test("first donor in the first day who also crosses the goal", () => {
  const mine = { id: "a", campaignId: "x", amount: 1000, createdAt: d("2026-01-01T10:00:00"), isAnonymous: false };
  const e = earnedBadges({ ...base, donations: [mine], campaigns: { x: camp }, campaignDonations: { x: [mine] } });
  for (const id of ["first-light", "early-supporter", "hero"]) assert.ok(e.has(id), id);
  assert.ok(!e.has("last-mile"));
});

test("last mile and spark come from what happened before the gift", () => {
  const earlier = { id: "p", amount: 950, createdAt: d("2026-01-02") };
  const mine = { id: "a", campaignId: "x", amount: 10, createdAt: d("2026-02-01"), isAnonymous: true };
  const e = earnedBadges({ ...base, donations: [mine], campaigns: { x: camp }, campaignDonations: { x: [earlier, mine] } });
  for (const id of ["last-mile", "spark", "quiet-giver"]) assert.ok(e.has(id), id);
  assert.ok(!e.has("first-light") && !e.has("hero"));
});

test("loyalty and reach badges count distinct months, types and states", () => {
  const mk = (i, m, c) => ({ id: `d${i}`, campaignId: c, amount: 5, createdAt: d(`2026-0${m}-15`), isAnonymous: false });
  const donations = [mk(1, 1, "a"), mk(2, 2, "b"), mk(3, 3, "c"), mk(4, 3, "c")];
  const campaigns = {
    a: { ...camp, cancerTypeId: "t1", stateId: "s1", beneficiaryAge: 8 },
    b: { ...camp, cancerTypeId: "t2", stateId: "s2" },
    c: { ...camp, cancerTypeId: "t3", stateId: "s3" },
  };
  const e = earnedBadges({ ...base, donations, campaigns, campaignDonations: {}, subscriptionMonths: 3, commentCount: 1, isFoundingDonor: true });
  for (const id of ["returning-friend", "companion", "pathfinder", "explorer", "little-light", "guardian", "encourager", "founding-supporter"]) assert.ok(e.has(id), id);
  assert.ok(!e.has("steadfast"));
});
