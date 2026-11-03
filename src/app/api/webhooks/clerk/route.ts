import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // The signature covers the exact bytes Clerk sent, so verify the raw text
  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Webhook verification failed", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url, phone_numbers } =
      evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address;
    const primaryPhone = phone_numbers?.[0]?.phone_number;

    if (!primaryEmail) {
      return new Response("No email found", { status: 400 });
    }

    await prisma.user.upsert({
      where: { clerkId: id },
      update: {},
      create: {
        clerkId: id,
        email: primaryEmail,
        phone: primaryPhone || null,
        firstName: first_name || "User",
        lastName: last_name || null,
        avatarUrl: image_url || null,
      },
    });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url, phone_numbers } =
      evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address;
    const primaryPhone = phone_numbers?.[0]?.phone_number;

    await prisma.user.updateMany({
      where: { clerkId: id },
      data: {
        email: primaryEmail,
        phone: primaryPhone || null,
        firstName: first_name || "User",
        lastName: last_name || null,
        avatarUrl: image_url || null,
      },
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await prisma.user.delete({
        where: { clerkId: id },
      }).catch(() => {
        // User might not exist in our DB
      });
    }
  }

  return new Response("OK", { status: 200 });
}
