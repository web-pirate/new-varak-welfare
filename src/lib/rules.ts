// Permission and money rules kept free of the database so they can be tested on their own.

const ADMINS = ["ADMIN", "SUPER_ADMIN"];

/** Returns why the actor may not make this role change, or null when it is allowed. */
export function roleChangeError(actorRole: string, targetRole: string, newRole: string): string | null {
  if (!ADMINS.includes(actorRole)) return "Unauthorized - Admin only";
  // Only a SUPER_ADMIN may touch admin accounts, as target or as the new role
  if (actorRole !== "SUPER_ADMIN" && (ADMINS.includes(targetRole) || ADMINS.includes(newRole))) {
    return "Only SUPER_ADMIN can change admin roles";
  }
  return null;
}

/** For each new withdrawal status, the statuses it may come from. */
export const WITHDRAWAL_FROM: Record<string, string[]> = {
  APPROVED: ["PENDING"],
  REJECTED: ["PENDING", "APPROVED", "PROCESSING"],
  COMPLETED: ["APPROVED", "PROCESSING"],
};

/** Rupees still free to withdraw: raised, minus requests that are not rejected. */
export function withdrawable(raised: number, requested: number): number {
  return Math.max(0, raised - requested);
}
