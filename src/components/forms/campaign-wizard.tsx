"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCampaign } from "@/server/actions/campaign";
import { PhotoGalleryUpload } from "@/components/forms/photo-gallery-upload";
import { DocumentUpload, type DocItem } from "@/components/forms/document-upload";
import {
  User,
  Heart,
  Target,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Beneficiary", icon: User },
  { label: "Medical Info", icon: Heart },
  { label: "Goal & Story", icon: Target },
  { label: "Documents", icon: FileText },
  { label: "Review", icon: CheckCircle },
];

const DRAFT_KEY = "varak-fundraiser-draft";

const relationships = [
  "Self",
  "Parent",
  "Spouse",
  "Child",
  "Sibling",
  "Friend",
  "Other",
];

export function CampaignWizard({
  cancerTypes,
  states,
  isSignedIn,
}: {
  isSignedIn: boolean;
  cancerTypes: { id: string; name: string }[];
  states: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    beneficiaryName: "",
    beneficiaryRelation: "",
    beneficiaryAge: "",
    cancerTypeId: "",
    hospitalName: "",
    hospitalCity: "",
    stateId: "",
    title: "",
    goalAmount: "",
    story: "",
    fundsUse: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DocItem[]>([]);

  // Draft survives refresh and the sign-in round trip (urls only, no files)
  const [draftLoaded, setDraftLoaded] = useState(false);
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (d) {
        setFormData((f) => ({ ...f, ...d.formData }));
        setImages(d.images ?? []);
        setDocuments(d.documents ?? []);
        setStep(isSignedIn ? d.step : Math.min(d.step, 2));
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
    setDraftLoaded(true);
  }, [isSignedIn]);
  useEffect(() => {
    if (draftLoaded) localStorage.setItem(DRAFT_KEY, JSON.stringify({ formData, images, documents, step }));
  }, [draftLoaded, formData, images, documents, step]);

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const next = () => {
    if (step === 0 && !formData.beneficiaryName) {
      setError("Beneficiary name is required");
      return;
    }
    if (step === 1 && !formData.cancerTypeId) {
      setError("Please select a cancer type");
      return;
    }
    if (step === 2) {
      if (!formData.title || formData.title.length < 10) {
        setError("Title must be at least 10 characters");
        return;
      }
      if (formData.title.length > 100) {
        setError("Title must be 100 characters or less");
        return;
      }
      if (!formData.goalAmount || parseInt(formData.goalAmount) < 1000) {
        setError("Minimum goal amount is ₹1,000");
        return;
      }
      if (!formData.story || formData.story.length < 50) {
        setError("Story must be at least 50 characters");
        return;
      }
      if (formData.fundsUse.trim().length < 20) {
        setError("Tell donors what the money will be used for (at least 20 characters)");
        return;
      }
    }
    if (step === 2 && !isSignedIn) {
      track("fundraiser_signup_prompt");
      router.push("/sign-in?redirect_url=/start-fundraiser");
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      const { fundsUse, ...rest } = formData;
      // No separate column yet: the funds plan is stored as the last section of the story
      Object.entries({ ...rest, story: `${rest.story}\n\nHow the funds will be used:\n${fundsUse.trim()}` }).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });

      fd.append("images", JSON.stringify(images));
      fd.append("documents", JSON.stringify(documents.map(({ url, fileName, type }) => ({ url, fileName, type }))));

      const result = await createCampaign(fd);
      if (result.success) {
        localStorage.removeItem(DRAFT_KEY);
        router.push(`/campaigns/${result.slug}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                i <= step
                  ? "bg-varak-primary text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <s.icon className="h-4 w-4" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-16 mx-1",
                  i < step ? "bg-varak-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-border/50">
        <p className="text-xs font-medium text-varak-primary mb-1">
          Step {step + 1} of {steps.length} · progress saved automatically
        </p>
        <h2 className="font-heading text-xl mb-6">{steps[step].label}</h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Step 0: Beneficiary */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label>Patient&apos;s Name *</Label>
              <Input
                value={formData.beneficiaryName}
                onChange={(e) => update("beneficiaryName", e.target.value)}
                placeholder="Full name of the patient"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Relationship</Label>
              <Select
                value={formData.beneficiaryRelation}
                onValueChange={(v) => update("beneficiaryRelation", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Your relationship to the patient" />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Patient&apos;s Age</Label>
              <Input
                type="number"
                value={formData.beneficiaryAge}
                onChange={(e) => update("beneficiaryAge", e.target.value)}
                placeholder="Age"
                className="mt-1"
              />
            </div>
            {isSignedIn ? (
              <div>
                <Label htmlFor="wizard-photo">Patient&apos;s photos (optional)</Label>
                <PhotoGalleryUpload id="wizard-photo" value={images} onChange={setImages} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You can add photos and documents after a quick sign-in at the end of step 3.</p>
            )}
          </div>
        )}

        {/* Step 1: Medical Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Cancer Type *</Label>
              <Select
                value={formData.cancerTypeId}
                onValueChange={(v) => update("cancerTypeId", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select cancer type" />
                </SelectTrigger>
                <SelectContent>
                  {cancerTypes.map((ct) => (
                    <SelectItem key={ct.id} value={ct.id}>{ct.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hospital Name</Label>
              <Input
                value={formData.hospitalName}
                onChange={(e) => update("hospitalName", e.target.value)}
                placeholder="Name of the treating hospital"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Hospital City</Label>
              <Input
                value={formData.hospitalCity}
                onChange={(e) => update("hospitalCity", e.target.value)}
                placeholder="City where the hospital is located"
                className="mt-1"
              />
            </div>
            <div>
              <Label>State</Label>
              <Select
                value={formData.stateId}
                onValueChange={(v) => update("stateId", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 2: Goal & Story */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Campaign Title * (10–100 characters)</Label>
              <Input
                value={formData.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g., Help Priya Fight Leukemia"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.title.length}/10 characters minimum
              </p>
            </div>
            <div>
              <Label>Fundraising Goal (₹) *</Label>
              <Input
                type="number"
                value={formData.goalAmount}
                onChange={(e) => update("goalAmount", e.target.value)}
                placeholder="Minimum ₹1,000"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Your Story * (min 50 characters)</Label>
              <Textarea
                value={formData.story}
                onChange={(e) => update("story", e.target.value)}
                placeholder="Tell donors about the patient's condition, treatment needed, and how their donation will help..."
                rows={6}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.story.length}/50 characters minimum
              </p>
            </div>
            <div>
              <Label>What will the money be used for? * (min 20 characters)</Label>
              <Textarea
                value={formData.fundsUse}
                onChange={(e) => update("fundsUse", e.target.value)}
                placeholder="e.g., ₹3,00,000 for the bone marrow transplant, ₹1,00,000 for 6 months of medicines"
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload medical documents to help verify your campaign. This
              increases donor trust and speeds up approval.
            </p>
            <DocumentUpload
              value={documents}
              onAdd={(items) => setDocuments((d) => [...d, ...items])}
              onRemove={(_, index) => setDocuments((d) => d.filter((_, i) => i !== index))}
              onTypeChange={(index, type) => setDocuments((d) => d.map((x, i) => (i === index ? { ...x, type } : x)))}
            />
            <p className="text-xs text-muted-foreground">
              Accepted documents: Medical reports, hospital bills, prescriptions,
              doctor&apos;s letter. You can also add documents after creating the campaign.
            </p>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Patient Name</span>
                <p className="font-medium">{formData.beneficiaryName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Relationship</span>
                <p className="font-medium">
                  {formData.beneficiaryRelation || "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Cancer Type</span>
                <p className="font-medium">
                  {cancerTypes.find((ct) => ct.id === formData.cancerTypeId)?.name}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Hospital</span>
                <p className="font-medium">
                  {formData.hospitalName || "Not specified"}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Campaign Title</span>
                <p className="font-medium">{formData.title}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Goal Amount</span>
                <p className="font-medium text-varak-primary">
                  ₹{parseInt(formData.goalAmount).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Story</span>
                <p className="font-medium text-sm">{formData.story}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Use of funds</span>
                <p className="font-medium text-sm">{formData.fundsUse}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          {step > 0 ? (
            <Button variant="outline" onClick={prev}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <Button
              onClick={next}
              className="bg-varak-primary hover:bg-varak-primary-dark text-white"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-varak-primary hover:bg-varak-primary-dark text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit for approval (within 48 hours)
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
