"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useRazorpay } from "@/hooks/use-razorpay";
import type { RazorpayResponse } from "@/hooks/use-razorpay";
import { STEPPER_HTML } from "./stepper-markup";
import { mountStepper } from "./stepper-engine";
import "./stepper.css";

type StepperApi = ReturnType<typeof mountStepper>;

export function MonthlyGivingStepper() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded: razorpayLoaded } = useRazorpay();
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<StepperApi | null>(null);
  const donateRef = useRef<(amount: number) => void>(() => {});

  donateRef.current = async (amount: number) => {
    const api = apiRef.current;
    if (!api) return;

    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent("/monthly-giving")}`);
      return;
    }
    if (!razorpayLoaded) {
      api.setStatus("Payment gateway is loading, please try again.", "error");
      return;
    }

    api.setBusy(true);
    api.setStatus("");
    try {
      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start monthly giving");

      const rzp = new window.Razorpay({
        key: data.key,
        subscription_id: data.subscriptionId,
        amount: amount * 100,
        currency: "INR",
        name: "Varak Cancer Welfare Society",
        description: `Monthly gift of ₹${amount}`,
        handler: async (response: RazorpayResponse) => {
          try {
            const verify = await fetch("/api/subscriptions/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            if (!verify.ok) throw new Error();
            api.setStatus("Thank you! Your monthly gift is set up.", "ok");
            router.push("/dashboard/donor/subscriptions");
          } catch {
            api.setStatus("Payment received but we could not confirm it. Please contact support.", "error");
            api.setBusy(false);
          }
        },
        theme: { color: "#C2553A" },
        modal: { ondismiss: () => api.setBusy(false) },
      });
      rzp.open();
    } catch (err) {
      api.setStatus(err instanceof Error ? err.message : "Something went wrong", "error");
      api.setBusy(false);
    }
  };

  useEffect(() => {
    const host = hostRef.current!;
    host.innerHTML = STEPPER_HTML; // fresh DOM each mount, so React StrictMode's double mount is safe
    const api = mountStepper(host, (amount: number) => donateRef.current(amount));
    apiRef.current = api;
    return () => {
      api.destroy();
      apiRef.current = null;
    };
  }, []);

  return <div className="mg" ref={hostRef} />;
}
