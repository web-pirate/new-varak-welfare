"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addCampaignUpdate } from "@/server/actions/campaign";

export function CampaignUpdateForm({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posted, setPosted] = useState(false);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    setError(null);
    setPosted(false);
    const fd = new FormData();
    fd.append("content", content);
    const result = await addCampaignUpdate(campaignId, fd);
    setPosting(false);
    if (result.ok) {
      setContent("");
      setPosted(true);
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={post} className="space-y-3">
      <Label htmlFor="update-content">What&apos;s new?</Label>
      <Textarea
        id="update-content"
        rows={4}
        maxLength={2000}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setPosted(false);
          setError(null);
        }}
        placeholder="Share progress with your donors, for example how the treatment is going."
      />
      <p className="text-xs text-muted-foreground">{content.length}/2000. Updates appear on your public campaign page.</p>
      {error && (
        <div role="alert" className="rounded-none bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {posted && (
        <div role="status" className="flex items-center gap-2 rounded-none bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          Update posted.
        </div>
      )}
      <Button type="submit" disabled={posting || content.trim().length < 10} className="rounded-none bg-varak-primary text-white hover:bg-varak-primary-dark">
        {posting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Post update
      </Button>
    </form>
  );
}
