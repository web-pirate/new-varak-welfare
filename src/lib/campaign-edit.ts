// What a fundraiser may change on their own campaign, by status. No imports, so it is shared by the server action,
// the edit form and `node --test`. After approval donors rely on the goal, patient, cancer type and hospital,
// so those stay locked: changing them needs an admin.

export const ALL_FIELDS = [
  "title",
  "story",
  "goalAmount",
  "beneficiaryName",
  "beneficiaryRelation",
  "beneficiaryAge",
  "images",
  "cancerTypeId",
  "hospitalName",
  "hospitalCity",
  "stateId",
  "districtId",
  "endDate",
] as const;

export type EditableField = (typeof ALL_FIELDS)[number];

const RULES: Record<string, readonly EditableField[]> = {
  DRAFT: ALL_FIELDS,
  PENDING_REVIEW: ALL_FIELDS,
  REJECTED: ALL_FIELDS,
  APPROVED: ["story", "endDate", "images"],
  // COMPLETED and SUSPENDED: nothing can be edited
};

/** Fields the owner can edit at this status. Empty when the campaign can't be edited. */
export function editableFields(status: string): readonly EditableField[] {
  return RULES[status] ?? [];
}

/** Submitted keys that this status doesn't allow (also catches keys like "status" or "amountRaised"). */
export function lockedKeys(status: string, submitted: string[]): string[] {
  const allowed: readonly string[] = editableFields(status);
  return submitted.filter((k) => !allowed.includes(k));
}

/** Progress updates can be posted once a campaign is live, and after it completes. */
export const canPostUpdate = (status: string) => status === "APPROVED" || status === "COMPLETED";
