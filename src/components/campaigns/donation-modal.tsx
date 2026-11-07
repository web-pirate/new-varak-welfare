"use client";

import { useState } from "react";
import { Turnstile } from "@/components/campaigns/turnstile";
import { useUser } from "@clerk/nextjs";
import { track } from "@vercel/analytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { DonationStamp } from "@/components/campaigns/donation-stamp";
import { ShareButton } from "@/components/campaigns/share-button";
import { Heart, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRazorpay } from "@/hooks/use-razorpay";
import type { RazorpayResponse } from "@/hooks/use-razorpay";

const VARIANTS = ["control", "story", "proof", "small", "urgency"] as const;
type Variant = (typeof VARIANTS)[number];

// A/B test of the exit message: each visitor is assigned once ("control" = no message) and keeps it
function pickVariant(): Variant {
  try {
    const saved = localStorage.getItem("varak-exit-ab") as Variant | null;
    if (saved && VARIANTS.includes(saved)) return saved;
    const v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
    localStorage.setItem("varak-exit-ab", v);
    return v;
  } catch {
    return "story"; // storage blocked: show the main message
  }
}

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

export function DonationModal({
  campaignId,
  campaignTitle,
  remaining,
  image,
  beneficiaryName,
  donorCount,
  progress,
  quote,
  daysLeft,
  children,
}: {
  campaignId: string;
  campaignTitle: string;
  /** Rupees the campaign still needs; enables the "your gift covers X%" line. */
  remaining?: number;
  /** The campaign's own cover photo and patient name, shown in the exit prompt. */
  image?: string | null;
  beneficiaryName?: string;
  donorCount?: number;
  /** Percent funded, and the opening of the campaign story, for the exit prompt. */
  progress?: number;
  quote?: string;
  /** Days until the campaign ends; only passed when the campaign has an end date. */
  daysLeft?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [amount, setAmount] = useState("1000");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [donationId, setDonationId] = useState("");
  const [variant, setVariant] = useState<Variant>("story");
  const [showExit, setShowExit] = useState(false);
  // Single-use token: remount the widget (tsKey) after every attempt
  const [tsToken, setTsToken] = useState("");
  const [tsKey, setTsKey] = useState(0);
  const needsCheck = process.env.NODE_ENV === "production";
  const [exitShown, setExitShown] = useState(false);

  function reset() {
    setStep("form");
    setAmount("1000");
    setDonorName("");
    setDonorEmail("");
    setDonorPhone("");
    setIsAnonymous(false);
    setError("");
    setDonationId("");
    setShowExit(false);
    setExitShown(false);
  }

  const { isLoaded: razorpayLoaded } = useRazorpay();

  // Signed-in donors get their details filled in when the popup opens; every field stays editable
  const { user } = useUser();

  async function handleDonate() {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 10) {
      setError("Minimum donation is ₹10");
      return;
    }
    if (!isAnonymous && donorName.trim().length < 2) {
      setError("Please enter your name or donate anonymously");
      return;
    }
    if (!donorEmail && !donorPhone) {
      setError("Enter a phone number or email for your receipt");
      return;
    }

    setError("");
    setStep("processing");

    try {
      if (!razorpayLoaded) throw new Error("Payment gateway is loading, please try again");

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          tipAmount: 0,
          campaignId,
          donorName: isAnonymous ? undefined : donorName,
          donorEmail: donorEmail || undefined,
          donorPhone: donorPhone || undefined,
          isAnonymous,
          turnstileToken: tsToken,
        }),
      });
      setTsToken("");
      setTsKey((k) => k + 1);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create order");
      }

      const { orderId, key } = await res.json();

      const options = {
        key,
        amount: numAmount * 100,
        currency: "INR",
        name: "Varak Cancer Welfare Society",
        description: `Donation for: ${campaignTitle}`,
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              track("payment_complete", { campaignId, variant, amount: numAmount });
              setDonationId(verifyData.donationId);
              setStep("success");
            } else {
              throw new Error("Verification failed");
            }
          } catch {
            setError("Payment verification failed. Please contact support.");
            setStep("form");
          }
        },
        prefill: {
          name: donorName,
          email: donorEmail,
          contact: donorPhone,
        },
        // UPI first for Indian donors
        config: {
          display: {
            blocks: { upi: { name: "Pay via UPI", instruments: [{ method: "upi" }] } },
            sequence: ["block.upi"],
            preferences: { show_default_blocks: true },
          },
        },
        theme: { color: "#0D503C" },
        modal: {
          ondismiss: () => setStep("form"),
        },
      };

      track("payment_started", { campaignId, variant, amount: numAmount });
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("form");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          const started = !!(donorName.trim() || donorEmail || donorPhone);
          // One gentle prompt the first time anyone closes the form
          if (step === "form" && !exitShown && variant !== "control") {
            setExitShown(true);
            setShowExit(true);
            return;
          }
          if (step !== "success") {
            track("donate_abandon", { campaignId, variant, step, amount: parseInt(amount) || 0, hasContact: started });
          }
        }
        setOpen(v);
        if (!v) reset();
      }}
    >
      {/* The trigger can sit inside a card <Link>, so stop the click from navigating while opening the dialog */}
      <span
        role="presentation"
        className="contents"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
          if (user) {
            setDonorName((n) => n || user.fullName || "");
            setDonorEmail((m) => m || user.primaryEmailAddress?.emailAddress || "");
            setDonorPhone((p) => p || user.primaryPhoneNumber?.phoneNumber || "");
          }
          const v = pickVariant();
          setVariant(v);
          track("donate_click", { campaignId, variant: v });
        }}
      >
        {children}
      </span>
      <DialogContent className="sm:max-w-md grid-cols-[minmax(0,1fr)]">
        {step === "success" ? (
          <div className="text-center py-6">
            <DonationStamp amount={parseInt(amount)} date={new Date()} beneficiaryName={beneficiaryName ?? "this family"} image={image} />
            <div className="h-4" />
            <h3 className="font-heading text-xl mb-2">Thank You!</h3>
            <p className="text-muted-foreground text-sm mb-1">
              Your donation of {formatCurrency(parseInt(amount))} has been received.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Donation ID: {donationId}
            </p>
            <div className="space-y-2">
              <ShareButton title={campaignTitle} />
              <Button asChild className="w-full bg-varak-primary hover:bg-varak-primary-dark text-white">
                <Link href="/monthly-giving">Make it monthly</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  window.location.reload();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : showExit ? (
          <ExitMessage
            variant={variant}
            name={beneficiaryName}
            image={image}
            quote={quote}
            progress={progress}
            donorCount={donorCount}
            remaining={remaining}
            daysLeft={daysLeft}
            onPick={(a) => {
              setAmount(String(a));
              setShowExit(false);
            }}
            onLeave={() => {
              track("donate_abandon", { campaignId, variant, step, amount: parseInt(amount) || 0, hasContact: !!(donorName.trim() || donorEmail || donorPhone) });
              setOpen(false);
              reset();
            }}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">
                Donate to this Campaign
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Preset amounts */}
              <div>
                <Label>Select Amount</Label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {PRESET_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAmount(String(a))}
                      className={`p-2.5 rounded-none border text-sm font-medium transition-colors ${
                        amount === String(a)
                          ? "border-varak-primary bg-varak-primary/10 text-varak-primary"
                          : "border-border hover:border-varak-primary/50"
                      }`}
                    >
                      {formatCurrency(a)}
                    </button>
                  ))}
                </div>
              </div>

              {remaining ? (
                <p className="text-sm text-varak-primary font-medium">
                  {parseInt(amount) > 0
                    ? `${formatCurrency(parseInt(amount))} covers ${Math.max(1, Math.round((parseInt(amount) / remaining) * 100))}% of what's needed.`
                    : `${formatCurrency(remaining)} still needed.`}
                </p>
              ) : null}

              <div>
                <Label className="text-xs text-muted-foreground">Or enter another amount (₹)</Label>
                <Input
                  type="number"
                  min={10}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded-none"
                />
                <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                  Donate anonymously
                </Label>
              </div>

              {user && (
                <p className="text-xs text-muted-foreground">
                  From your account. Edit if needed.
                </p>
              )}

              {!isAnonymous && (
                <div>
                  <Label>Your Name *</Label>
                  <Input
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Full name"
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="Phone number"
                  className="mt-1"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {needsCheck && <Turnstile key={tsKey} action="donate" onToken={setTsToken} />}

              <Button
                onClick={handleDonate}
                disabled={step === "processing" || (needsCheck && !tsToken)}
                className="w-full bg-varak-primary hover:bg-varak-primary-dark text-white h-12"
              >
                {step === "processing" ? (
                  "Processing..."
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    {amount
                      ? `Donate ${formatCurrency(parseInt(amount) || 0)}`
                      : "Donate"}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

type ExitProps = {
  variant: Variant;
  name?: string;
  image?: string | null;
  quote?: string;
  progress?: number;
  donorCount?: number;
  remaining?: number;
  daysLeft?: number;
  onPick: (amount: number) => void;
  onLeave: () => void;
};

// Four message types. A type whose facts are missing (no donors yet, no end date) falls back to "story".
function ExitMessage({ variant, name, image, quote, progress, donorCount, remaining, daysLeft, onPick, onLeave }: ExitProps) {
  const who = name ?? "this family";
  const type =
    variant === "proof" && !donorCount ? "story" : variant === "urgency" && !daysLeft ? "story" : variant;
  const copy = {
    story: { title: `Please don't leave ${who} waiting`, body: `Your gift could help ${name ?? "them"} take the next step.`, amounts: [500, 1000, 2500] },
    proof: { title: `${donorCount} people have already given to ${who}`, body: "Join them. Every gift brings treatment closer.", amounts: [500, 1000, 2500] },
    small: { title: `Every rupee helps ${who}`, body: "You don't need to give a lot. Even a small gift counts.", amounts: [100, 250, 500] },
    urgency: { title: `${daysLeft} days left to help ${who}`, body: remaining ? `${formatCurrency(remaining)} is still needed before the campaign ends.` : "Help before the campaign ends.", amounts: [500, 1000, 2500] },
  }[type === "control" ? "story" : type];

  return (
    <div className="text-center space-y-4">
      {image && <img src={image} alt={name ?? "The patient"} className="w-full h-44 rounded-md object-cover object-top" />}
      <h3 className="font-heading text-2xl leading-tight">{copy.title}</h3>
      {type === "story" && quote && (
        <p className="text-sm italic text-foreground/80 border-l-2 border-varak-primary pl-3 text-left">&ldquo;{quote}&rdquo;</p>
      )}
      {progress !== undefined && type !== "small" && (
        <div className="text-left">
          <div className="h-2 bg-foreground/10 overflow-hidden">
            <div className="h-full bg-varak-primary" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {progress}% funded{remaining ? ` · ${formatCurrency(remaining)} to go` : ""}
          </p>
        </div>
      )}
      <p className="text-sm font-medium">{copy.body} Tap an amount:</p>
      <div className="grid grid-cols-3 gap-2">
        {copy.amounts.map((a) => (
          <Button key={a} type="button" className="bg-varak-primary hover:bg-varak-primary-dark text-white h-12 text-base" onClick={() => onPick(a)}>
            {formatCurrency(a)}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Under a minute · 0% platform fee · secure payment</p>
      <Button variant="ghost" className="w-full" onClick={onLeave}>Not now</Button>
    </div>
  );
}
