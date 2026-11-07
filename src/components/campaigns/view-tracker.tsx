"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

export function ViewTracker({ campaignId }: { campaignId: string }) {
  useEffect(() => track("campaign_view", { campaignId }), [campaignId]);
  return null;
}
