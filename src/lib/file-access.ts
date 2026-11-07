import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/** Whether the signed-in user uploaded the file (their Clerk id is in its path) or is an admin. */
export async function isOwnerOrAdmin(owner: string): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;
  if (userId === owner) return true;
  const me = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  return me?.role === "ADMIN" || me?.role === "SUPER_ADMIN";
}
