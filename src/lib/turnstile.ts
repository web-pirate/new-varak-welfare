/** True if the Turnstile token is valid for `action`. Fails closed in production when the secret is missing.
 * Outside production with no secret set it passes, so local dev and e2e tests need no token. */
export async function verifyTurnstile(token: unknown, action: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (typeof token !== "string" || !token) return false;
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({ secret, response: token, ...(ip !== "unknown" && { remoteip: ip }) }),
    });
    const result = await r.json();
    return result.success === true && result.action === action;
  } catch {
    return false;
  }
}
