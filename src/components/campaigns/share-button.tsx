"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Uses the phone's share sheet where available (WhatsApp, etc.), otherwise copies the link.
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `${title} on Varak Cancer Welfare Society`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // The user closed the share sheet: nothing to do
    }
  }

  return (
    <Button type="button" variant="outline" className="w-full" size="sm" onClick={share} aria-live="polite">
      {copied ? <Check className="mr-2 h-3 w-3" /> : <Share2 className="mr-2 h-3 w-3" />}
      {copied ? "Link copied" : "Share this campaign"}
    </Button>
  );
}
