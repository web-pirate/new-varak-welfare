"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { roleChangeError } from "@/lib/rules";

const VALID_ROLES = ["DONOR", "FUNDRAISER", "NGO_ADMIN", "ADMIN", "SUPER_ADMIN"] as const;
type UserRole = (typeof VALID_ROLES)[number];

export async function updateUserRole(targetUserId: string, newRole: UserRole) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!VALID_ROLES.includes(newRole)) throw new Error("Invalid role");

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });
  if (!currentUser) throw new Error("User not found");

  // Prevent demoting yourself
  if (targetUserId === currentUser.id && newRole !== currentUser.role) {
    throw new Error("Cannot change your own role");
  }

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { role: true },
  });
  if (!target) throw new Error("User not found");

  const denied = roleChangeError(currentUser.role, target.role, newRole);
  if (denied) throw new Error(denied);

  await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });

  revalidatePath("/dashboard/admin/users");
}
