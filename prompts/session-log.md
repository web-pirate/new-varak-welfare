# Session log: setup, monthly giving, dev/prod split

Written from the work done in one Claude Code session. Facts are as of the end of that session; re-check anything time-sensitive.

## 1. Project and local setup
- Cloned `web-pirate/varak-welfare-society` into `~/Documents/varak/varak-welfare-society`.
- Stack: Next.js 16 (App Router, TypeScript), Prisma 7 on PostgreSQL, Clerk auth, Razorpay payments, shadcn/ui + Tailwind v4.
- Ran `npm install` and `npx prisma generate`. Dev server: `npm run dev` on http://localhost:3000.
- Git identity for a single terminal window: env vars (`GIT_AUTHOR_*`, `GIT_COMMITTER_*`, `GIT_SSH_COMMAND`). Nothing committed yet.

## 2. Environment variables the code reads
`DATABASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `CLERK_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`. Clerk's own keys are read by its SDK. `.env.example` lists everything.

## 3. Clerk
- `clerk init` linked a new application "Varak Welfare Society" (not the Dashboard-selected one) and added `/sign-in` and `/sign-up` routes.
- Production: `clerk deploy` created a production instance for `varakwelfare.org`, with Google OAuth configured.
- DNS: five CNAME records added at GoDaddy (`clerk`, `accounts`, `clkmail`, `clk._domainkey`, `clk2._domainkey`). Verified live.
- Status at the end of the session: DNS complete, mail complete, **SSL pending** (Clerk issues it automatically). Check with `npx clerk@latest deploy status`.

## 4. Database
- Chose PostgreSQL (the project's native database). Installed `postgresql@17` with Homebrew for local dev.
- Prod database: Supabase project `iziqqcdsfbvwwgcsbppt`. Tables created with `prisma db push`, then Row Level Security enabled on all 18 tables. Prisma bypasses RLS, the publishable key does not.
- Installed `@supabase/supabase-js`, `@supabase/ssr` and the Supabase agent skills. The app does not use Supabase client code yet.
- Baseline migrations `0_init` and `1_enable_rls`, marked applied on both databases.
- Dev/prod split: see `prompts/environments.md`.

## 5. Monthly giving feature
- Page: `src/app/(marketing)/monthly-giving/page.tsx`, with the animated stepper in `src/components/monthly/` (markup, engine, CSS, React wrapper).
- Design follows `prompts/design-system.md` (Warm Terra, sharp corners, JetBrains Mono, theme variables).
- The cost-split summary sentence was removed on request. The donate button sits inside the amount card and pulses once an amount is chosen.
- Razorpay Subscriptions: `POST /api/subscriptions/create`, `POST /api/subscriptions/verify`, and `subscription.*` events in `/api/webhooks/razorpay` keep the `Subscription` row in sync.
- Verified by typecheck and a 200 response from the page. **A real payment was never run.**

## 6. Open items
1. Razorpay keys in `.env` are **live**. Replace with `rzp_test_` keys for development.
2. Wait for Clerk SSL, then put the production Clerk keys in the host's env settings and register `https://varakwelfare.org/api/webhooks/clerk`.
3. Set `CLERK_WEBHOOK_SECRET`. Neither Clerk nor Razorpay webhooks are registered yet (localhost needs a tunnel).
4. Reset the Supabase database password (it was shared in chat) and update `.env.production`.
5. Razorpay Subscriptions must be enabled on the Razorpay account.
6. No hosting, CI or deployment is configured, so `varakwelfare.org` does not serve the app yet.
7. A stray `env` file (no dot) with secret-like keys sits in the repo root. It is gitignored now. Delete it if it is not yours.
8. Nothing is committed. Review `git status` before the first commit.
9. The database is empty, so nav and campaign pages may look bare until data is added. Monthly charges do not create `Donation` rows.
10. The animated stepper was not checked in a browser (layout and animation).
