"use server";

import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { WITHDRAWAL_FROM, withdrawable } from "@/lib/rules";
import { withdrawalSchema } from "@/lib/validations/withdrawal";

export async function requestWithdrawal(input: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = withdrawalSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Please check the form");
  const data = parsed.data;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!user) throw new Error("User not found");

  // Serializable: two requests sent at once cannot both pass the balance check
  await prisma.$transaction(
    async (tx) => {
      const campaign = await tx.campaign.findUnique({
        where: { id: data.campaignId },
        select: { createdById: true, amountRaised: true },
      });
      if (!campaign || campaign.createdById !== user.id) {
        throw new Error("Campaign not found or unauthorized");
      }

      const taken = await tx.withdrawal.aggregate({
        where: { campaignId: data.campaignId, status: { not: "REJECTED" } },
        _sum: { amount: true },
      });
      const free = withdrawable(Number(campaign.amountRaised), Number(taken._sum.amount ?? 0));
      if (data.amount > free) {
        throw new Error(`You can withdraw up to ₹${free.toLocaleString("en-IN")} from this campaign`);
      }

      await tx.withdrawal.create({
        data: {
          amount: data.amount,
          bankAccountNumber: data.bankAccountNumber,
          bankIfsc: data.bankIfsc,
          bankAccountName: data.bankAccountName,
          note: data.note,
          campaignId: data.campaignId,
          requestedById: user.id,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

  revalidatePath("/dashboard/fundraiser/withdraw");
  revalidatePath("/dashboard/admin/withdrawals");
}

export async function processWithdrawal(
  withdrawalId: string,
  status: "APPROVED" | "REJECTED" | "COMPLETED",
  note?: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized - Admin only");
  }

  const from = WITHDRAWAL_FROM[status];
  if (!from) throw new Error("Invalid status");
  if (note !== undefined && (typeof note !== "string" || note.length > 500)) throw new Error("Note is too long");

  // Only an allowed earlier status may move to the new one, so a double click or a stale page changes nothing
  const { count } = await prisma.withdrawal.updateMany({
    where: { id: withdrawalId, status: { in: from as never[] } },
    data: {
      status,
      note,
      processedAt: ["COMPLETED", "REJECTED"].includes(status) ? new Date() : undefined,
    },
  });
  if (count === 0) throw new Error("This withdrawal has already been handled");

  revalidatePath("/dashboard/admin/withdrawals");
  revalidatePath("/dashboard/fundraiser/withdraw");
}
