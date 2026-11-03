"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRazorpay } from "@/hooks/use-razorpay";
import type { RazorpayResponse } from "@/hooks/use-razorpay";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

export function DonationModal({
  campaignId,
  campaignTitle,
  children,
}: {
  campaignId: string;
  campaignTitle: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [panNumber, setPanNumber] = useState("");
  const [error, setError] = useState("");
  const [donationId, setDonationId] = useState("");

  function reset() {
    setStep("form");
    setAmount("");
    setDonorName("");
    setDonorEmail("");
    setDonorPhone("");
    setIsAnonymous(false);
    setPanNumber("");
    setError("");
    setDonationId("");
  }

  const { isLoaded: razorpayLoaded } = useRazorpay();

  async function handleDonate() {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 10) {
      setError("Minimum donation is ₹10");
      return;
    }
    if (!isAnonymous && !donorName) {
      setError("Please enter your name or donate anonymously");
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
          panNumber: panNumber || undefined,
        }),
      });

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
        theme: { color: "#0D503C" },
        modal: {
          ondismiss: () => setStep("form"),
        },
      };

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
        }}
      >
        {children}
      </span>
      <DialogContent className="sm:max-w-md">
        {step === "success" ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-heading text-xl mb-2">Thank You!</h3>
            <p className="text-muted-foreground text-sm mb-1">
              Your donation of {formatCurrency(parseInt(amount))} has been received.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Donation ID: {donationId}
            </p>
            <Button
              onClick={() => {
                setOpen(false);
                window.location.reload();
              }}
              className="bg-varak-primary hover:bg-varak-primary-dark text-white"
            >
              Close
            </Button>
          </div>
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

              <div>
                <Label>Or enter custom amount (₹)</Label>
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
                <Label>Email (for receipt)</Label>
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

              <div>
                <Label>PAN (for 80G tax benefit)</Label>
                <Input
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="mt-1"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <Button
                onClick={handleDonate}
                disabled={step === "processing"}
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
