"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (existing) return existing;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  return prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      phone: clerkUser.phoneNumbers[0]?.phoneNumber ?? null,
      firstName: clerkUser.firstName ?? "User",
      lastName: clerkUser.lastName ?? null,
      avatarUrl: clerkUser.imageUrl ?? null,
    },
    select: { id: true },
  });
}
