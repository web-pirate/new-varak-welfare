import { z } from "zod";

export const withdrawalSchema = z.object({
  campaignId: z.string().min(1),
  amount: z.number().min(500, "Minimum withdrawal is ₹500").max(100_000_000),
  bankAccountNumber: z.string().trim().regex(/^\d{9,18}$/, "Enter a valid bank account number"),
  bankIfsc: z.string().trim().toUpperCase().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC code"),
  bankAccountName: z.string().trim().min(2, "Enter the account holder's name").max(100),
  note: z.string().trim().max(500).optional(),
});
