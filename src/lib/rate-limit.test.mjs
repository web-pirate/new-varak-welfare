import { test } from "node:test";
import assert from "node:assert/strict";
import { allow } from "./rate-limit.ts";

test("blocks after max calls, per key, and recovers after the window", () => {
  assert.ok(allow("a", 2, 1000, 0));
  assert.ok(allow("a", 2, 1000, 1));
  assert.equal(allow("a", 2, 1000, 2), false);
  assert.ok(allow("b", 2, 1000, 2));
  assert.ok(allow("a", 2, 1000, 1500));
});
