# Todo

## First thing (about 10 minutes)
- [x] `npx clerk@latest deploy status`. Expect SSL to have finished. If SSL is still pending, check the Clerk Dashboard domains page for an error.
- [ ] Reset the Supabase DB password (Project Settings -> Database), then update `.env.production`. It was shared in chat.
- [ ] Delete the stray `env` file in the repo root if it is not yours (it is gitignored, but holds secret-like keys). Status: it looks like an older copy of `.env`; waiting for your OK to delete.

## Safety before testing payments
- [ ] Swap the live Razorpay keys in `.env` for `rzp_test_` keys (Razorpay Dashboard -> test mode). Status: `.env` still has live keys; waiting for test keys.
- [ ] Confirm Razorpay Subscriptions is enabled on the account.
- [ ] Run one test monthly gift end to end on `/monthly-giving` and check the row in `Subscription`.

## Look at what was built
- [ ] Open http://localhost:3000/monthly-giving in a browser. Check the stepper layout and animation on desktop and mobile, light and dark. Status: dev server running, page returns 200; visual check is yours.
- [ ] Check `/sign-in` and `/sign-up` render and sign in works. Status: `/sign-in` returns 200; sign-in not tested.

## Webhooks
- [ ] Start a tunnel (ngrok or cloudflared) for local testing.
- [ ] Clerk (dev): add webhook `/api/webhooks/clerk`, set `CLERK_WEBHOOK_SECRET` in `.env`.
- [ ] Razorpay (test): add webhook `/api/webhooks/razorpay` with the `subscription.*` and `payment.*` events.

## Ship it
- [ ] Pick hosting (for example Vercel) and connect `varakwelfare.org`.
- [ ] Put prod env vars in the host: Supabase `DATABASE_URL` (pooler string if the host has no IPv6), Clerk `pk_live_`/`sk_live_`, Razorpay live keys, `NEXT_PUBLIC_APP_URL`.
- [ ] Register the production webhooks: Clerk `https://varakwelfare.org/api/webhooks/clerk`, Razorpay `.../api/webhooks/razorpay`.
- [ ] Review `git status`, then make the first commit and push (personal git identity).

## Later
- [ ] Add seed data so nav and campaign pages are not empty.
- [ ] Decide whether monthly charges should create `Donation` rows.
- [ ] Add CI (typecheck + lint) and a mobile sticky donate button if wanted.
