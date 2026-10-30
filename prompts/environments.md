# Environments: dev and prod

| | Dev (your machine) | Prod |
|---|---|---|
| Database | local Postgres 17, db `varak` (`brew services start postgresql@17`) | Supabase project `iziqqcdsfbvwwgcsbppt` |
| Where config lives | `.env` (gitignored) | hosting provider env settings; `.env.production` (gitignored) only for running migrations from this machine |
| Clerk | development instance keys | production instance (`npx clerk@latest deploy`) |
| Razorpay | `rzp_test_` keys | `rzp_live_` keys |

## Schema changes
- Dev: edit `prisma/schema.prisma`, then `npm run db:migrate` (creates a migration, applies it locally).
- Prod: commit the migration, then `npm run db:deploy:prod` (or `prisma migrate deploy` in CI/host). Never run `db push` against prod.
- Baseline: `0_init` (all tables) and `1_enable_rls` (RLS on every table) are marked applied on both databases.
- New tables on Supabase need RLS: turn on "automatically enable RLS" in the dashboard, or add `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` in the migration. Prisma bypasses RLS, the publishable key does not.

## Rules
- Never put the Supabase URL in `.env`, so local runs cannot touch prod data.
- Reset the Supabase DB password if it was ever shared in chat.
