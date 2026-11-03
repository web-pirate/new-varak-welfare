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

## Done this session
- [x] Funds Raised stat showed raw rupees with a "Cr+" label. Fixed and pushed (`53edb20`).
- [x] New logo in header, sidebar and footer, larger size, transparent background. Status: done locally, not committed.
- [x] Favicon and Apple icon rebuilt from the trimmed logo. Status: done locally, not committed.
- [x] Audit run (see "From the audit" below).

## From the audit (must fix first)
- [ ] Commit the ~44 uncommitted files in small groups. Prod runs older code than local. Keep one lockfile (npm or pnpm), not both.
- [ ] Withdrawals: require campaign `APPROVED` and the owner's KYC verified (`server/actions/withdrawal.ts`).
- [ ] Anonymous donors: stop returning `donorName` from the queries when `isAnonymous` is true (`server/queries/campaigns.ts`).
- [ ] Marketing numbers: hero says 50Cr+, About says 100Cr+, real total is about 1.29Cr. Use real stats or remove the claims.

## From the audit (should fix)
- [ ] Decide guest donations: `/api/payments` needs sign-in in `middleware.ts`, but `create-order` has guest code.
- [ ] Clerk `user.deleted`: stop swallowing the delete error; decide delete vs anonymize.
- [ ] Encrypt or restrict PAN and bank account columns.
- [ ] Count `viewCount` in one place only, not in every campaign read. Drop `email` from the public campaign select.
- [ ] Check whether medical documents on Cloudinary should be private (signed links).
- [ ] Add tests: `completeDonation` credits once on a double call; withdrawal over the free balance is refused.
- [ ] Donor stat counts donations, not donors; use distinct donors and the same `APPROVED` rule as the amount.
- [ ] Remove the `as never` casts on the home page and convert Prisma `Decimal` amounts to numbers.
- [ ] Nice to have: Content-Security-Policy header; rate limit order creation and uploads.

## Prod database
- [ ] Run the nav `MenuItem` SQL in Supabase (written in chat, safe to re-run). Check first whether existing rows are `isActive = false`.

## Rules
- Run the ponytail audit before every push, then push (see memory `audit-before-push`).

## Ship it
- [x] Pick hosting (for example Vercel) and connect `varakwelfare.org`. Status: done, per you (not verified by me).
- [x] Put prod env vars in the host: Supabase `DATABASE_URL` (pooler string if the host has no IPv6), Clerk `pk_live_`/`sk_live_`, Razorpay live keys, `NEXT_PUBLIC_APP_URL`. Status: done, per you (not verified by me).
- [x] Register the production webhooks: Clerk `https://varakwelfare.org/api/webhooks/clerk`, Razorpay `.../api/webhooks/razorpay`. Status: done, per you (not verified by me).
- [x] Review `git status`, then make the first commit and push (personal git identity). Status: history exists and `main` is pushed to `web-pirate/new-varak-welfare` (latest `53edb20`); about 45 other files are still uncommitted.

## Later
- [ ] Add seed data so nav and campaign pages are not empty. Status: local DB done via `prisma/seed-dev.mjs`; prod nav SQL was written but not run in Supabase, and prod has no campaigns.
- [ ] Decide whether monthly charges should create `Donation` rows. Today `subscription.charged` credits no campaign and no stat.
- [ ] Add CI (typecheck + lint) and a mobile sticky donate button if wanted.
