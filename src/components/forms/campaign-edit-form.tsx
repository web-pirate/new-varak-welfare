"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCampaign } from "@/server/actions/campaign";
import { PhotoGalleryUpload } from "@/components/forms/photo-gallery-upload";

export type EditableCampaign = {
  id: string;
  title: string;
  story: string;
  goalAmount: string;
  beneficiaryName: string;
  beneficiaryRelation: string;
  beneficiaryAge: string;
  images: string[];
  cancerTypeId: string;
  hospitalName: string;
  hospitalCity: string;
  stateId: string;
  endDate: string; // yyyy-mm-dd
};

type Kind = "text" | "number" | "textarea" | "date" | "cancer" | "state" | "photos";
const FIELDS: { key: Exclude<keyof EditableCampaign, "id">; label: string; kind: Kind; required?: boolean }[] = [
  { key: "title", label: "Campaign title", kind: "text", required: true },
  { key: "story", label: "Story", kind: "textarea", required: true },
  { key: "goalAmount", label: "Goal amount (₹)", kind: "number", required: true },
  { key: "beneficiaryName", label: "Patient's name", kind: "text", required: true },
  { key: "beneficiaryRelation", label: "Your relationship to the patient", kind: "text" },
  { key: "beneficiaryAge", label: "Patient's age", kind: "number" },
  { key: "images", label: "Patient photos", kind: "photos" },
  { key: "cancerTypeId", label: "Cancer type", kind: "cancer", required: true },
  { key: "hospitalName", label: "Hospital name", kind: "text" },
  { key: "hospitalCity", label: "Hospital city", kind: "text" },
  { key: "stateId", label: "State", kind: "state" },
  { key: "endDate", label: "Campaign end date", kind: "date" },
];

export function CampaignEditForm({
  campaign,
  status,
  editable,
  cancerTypes,
  states,
}: {
  campaign: EditableCampaign;
  status: string;
  editable: string[];
  cancerTypes: { id: string; name: string }[];
  states: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState(campaign);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (key: Exclude<keyof EditableCampaign, "id" | "images">, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
    setError(null);
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    // Send only the fields this status allows (the server checks this too)
    const fd = new FormData();
    for (const f of FIELDS) {
      if (!editable.includes(f.key)) continue;
      fd.append(f.key, f.key === "images" ? JSON.stringify(values.images) : (values[f.key] as string));
    }
    if (editable.includes("districtId") && values.stateId !== campaign.stateId) fd.append("districtId", ""); // old district no longer fits

    const result = await updateCampaign(campaign.id, fd);
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      {FIELDS.map((f) => {
        const locked = !editable.includes(f.key);
        const id = `edit-${f.key}`;
        const common = { id, disabled: locked, className: "mt-1" };
        return (
          <div key={f.key}>
            <Label htmlFor={id} className="flex items-center gap-1.5">
              {f.label}
              {f.required && !locked && " *"}
              {locked && (
                <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  locked after approval
                </span>
              )}
            </Label>
            {f.key === "images" ? (
              <PhotoGalleryUpload id={id} value={values.images} onChange={(urls) => { setValues((v) => ({ ...v, images: urls })); setSaved(false); setError(null); }} disabled={locked} />
            ) : f.kind === "textarea" ? (
              <Textarea {...common} rows={8} value={values.story} onChange={(e) => set("story", e.target.value)} />
            ) : f.kind === "cancer" || f.kind === "state" ? (
              <Select value={values[f.key] as string} onValueChange={(v) => set(f.key as "cancerTypeId" | "stateId", v)} disabled={locked}>
                <SelectTrigger id={id} className="mt-1">
                  <SelectValue placeholder={f.kind === "cancer" ? "Select cancer type" : "Select state"} />
                </SelectTrigger>
                <SelectContent>
                  {(f.kind === "cancer" ? cancerTypes : states).map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input {...common} type={f.kind} value={values[f.key] as string} onChange={(e) => set(f.key as "title", e.target.value)} />
            )}
          </div>
        );
      })}

      {error && (
        <div role="alert" className="rounded-none bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {saved && (
        <div role="status" className="flex items-center gap-2 rounded-none bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          {status === "REJECTED" ? "Saved. Your campaign is back in review." : "Saved. Your changes are live."}
        </div>
      )}

      <Button type="submit" disabled={saving} className="rounded-none bg-varak-primary px-8 text-white hover:bg-varak-primary-dark">
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {status === "REJECTED" ? "Save and resubmit for review" : "Save changes"}
      </Button>
    </form>
  );
}
