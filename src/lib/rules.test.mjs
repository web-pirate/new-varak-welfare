import { test } from "node:test";
import assert from "node:assert/strict";
import { roleChangeError, withdrawable, WITHDRAWAL_FROM } from "./rules.ts";

test("an ADMIN cannot demote a SUPER_ADMIN or create admins", () => {
  assert.ok(roleChangeError("ADMIN", "SUPER_ADMIN", "DONOR"));
  assert.ok(roleChangeError("ADMIN", "DONOR", "ADMIN"));
  assert.ok(roleChangeError("ADMIN", "ADMIN", "DONOR"));
});

test("an ADMIN can move ordinary users, and a SUPER_ADMIN can change admins", () => {
  assert.equal(roleChangeError("ADMIN", "DONOR", "FUNDRAISER"), null);
  assert.equal(roleChangeError("SUPER_ADMIN", "ADMIN", "DONOR"), null);
});

test("a non-admin can change nothing", () => {
  assert.ok(roleChangeError("FUNDRAISER", "DONOR", "FUNDRAISER"));
});

test("withdrawable never goes below zero", () => {
  assert.equal(withdrawable(2000, 500), 1500);
  assert.equal(withdrawable(2000, 5000), 0);
});

test("a completed withdrawal cannot be changed again", () => {
  for (const to of Object.keys(WITHDRAWAL_FROM)) assert.ok(!WITHDRAWAL_FROM[to].includes("COMPLETED"));
});
