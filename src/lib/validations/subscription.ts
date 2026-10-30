import { z } from "zod";

export const subscriptionSchema = z.object({
  amount: z.coerce
    .number()
    .int()
    .min(100, "Minimum monthly gift is ₹100")
    .max(500000, "Maximum monthly gift is ₹5,00,000"),
});

export const verifySubscriptionSchema = z.object({
  razorpay_payment_id: z.string().min(1),
  razorpay_subscription_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
