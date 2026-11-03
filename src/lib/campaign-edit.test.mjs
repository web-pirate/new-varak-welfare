import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_FIELDS, canPostUpdate, editableFields, lockedKeys } from "./campaign-edit.ts";

test("before approval every field is editable", () => {
  for (const status of ["DRAFT", "PENDING_REVIEW", "REJECTED"]) {
    assert.deepEqual(editableFields(status), ALL_FIELDS);
  }
});

test("after approval the goal, patient, cancer type, hospital and title are locked", () => {
  assert.deepEqual([...editableFields("APPROVED")].sort(), ["endDate", "images", "story"]);
  assert.deepEqual(
    lockedKeys("APPROVED", ["story", "goalAmount", "beneficiaryName", "cancerTypeId", "hospitalName", "title"]),
    ["goalAmount", "beneficiaryName", "cancerTypeId", "hospitalName", "title"]
  );
});

test("completed, suspended and unknown statuses allow no edits", () => {
  for (const status of ["COMPLETED", "SUSPENDED", "NOPE"]) {
    assert.deepEqual(editableFields(status), []);
    assert.deepEqual(lockedKeys(status, ["story"]), ["story"]);
  }
});

test("tampered keys are always rejected, even before approval", () => {
  assert.deepEqual(lockedKeys("PENDING_REVIEW", ["title", "status", "amountRaised", "createdById", "slug", "isFeatured"]), [
    "status", "amountRaised", "createdById", "slug", "isFeatured",
  ]);
});

test("progress updates need a live or completed campaign", () => {
  assert.equal(canPostUpdate("APPROVED"), true);
  assert.equal(canPostUpdate("COMPLETED"), true);
  for (const s of ["DRAFT", "PENDING_REVIEW", "REJECTED", "SUSPENDED"]) assert.equal(canPostUpdate(s), false);
});
