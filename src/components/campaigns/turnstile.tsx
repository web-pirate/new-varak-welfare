"use client";

import { useEffect, useRef } from "react";

export const TURNSTILE_SITE_KEY = "0x4AAAAAAF3pVE1NxHRVnadp";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

/** Cloudflare Turnstile widget. Tokens are single-use: remount it (change `key`) after each submit. */
export function Turnstile({ action, onToken }: { action: string; onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id: string | undefined;
    let cancelled = false;
    const mount = () => {
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (cancelled || !api || !ref.current) return;
      id = api.render(ref.current, {
        sitekey: TURNSTILE_SITE_KEY,
        action,
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };
    if ((window as unknown as { turnstile?: TurnstileApi }).turnstile) mount();
    else {
      let s = document.getElementById("cf-turnstile-script") as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement("script");
        s.id = "cf-turnstile-script";
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", mount);
    }
    return () => {
      cancelled = true;
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (id && api) api.remove(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  return <div ref={ref} />;
}
