import { test } from "node:test";
import assert from "node:assert/strict";
import { hmacSha256, safeEqual } from "./signature.ts";
import { verifyTurnstile } from "./turnstile.ts";

test("signature matches only for the right secret and payload; length mismatch is safe", () => {
  const sig = hmacSha256("secret", "order|pay");
  assert.ok(safeEqual(sig, hmacSha256("secret", "order|pay")));
  assert.equal(safeEqual(sig, hmacSha256("other", "order|pay")), false);
  assert.equal(safeEqual(sig, "short"), false);
});

test("turnstile: needs a token and a matching action, fails closed on errors", async () => {
  process.env.TURNSTILE_SECRET_KEY = "s";
  const real = globalThis.fetch;
  try {
    globalThis.fetch = async () => ({ json: async () => ({ success: true, action: "donate" }) });
    assert.equal(await verifyTurnstile("tok", "donate", "1.2.3.4"), true);
    assert.equal(await verifyTurnstile("tok", "signup", "1.2.3.4"), false);
    assert.equal(await verifyTurnstile("", "donate", "1.2.3.4"), false);
    globalThis.fetch = async () => { throw new Error("down"); };
    assert.equal(await verifyTurnstile("tok", "donate", "1.2.3.4"), false);
  } finally {
    globalThis.fetch = real;
    delete process.env.TURNSTILE_SECRET_KEY;
  }
});
