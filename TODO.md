# TODO (from ponytail audit)

## Must fix
- [ ] 1. Hide unapproved campaigns from the public page; stop loading creator email (`src/server/queries/campaigns.ts`, `campaigns/[slug]/page.tsx`)
- [ ] 2. Block withdrawals unless campaign is APPROVED/COMPLETED (`src/server/actions/withdrawal.ts`)

## Should fix
- [ ] 3. Record monthly subscription charges as money (`webhooks/razorpay`)
- [ ] 4. Handle `payment.refunded` (reverse `amountRaised`/`donorCount`)
- [ ] 5. Don't send anonymous donors' names to the browser (`getRecentDonations`, `loadCampaign`)
- [ ] 6. Remove fake placeholder donations from the ticker (`live-donation-ticker.tsx`)
- [ ] 7. Stop double `viewCount` increment per visit (use React `cache()`, move increment out of loader)
- [ ] 8. Rate-limit uploads per user; delete Cloudinary files on removal (`api/upload`)
- [ ] 9. Clerk `user.deleted`: blank personal data when delete fails; log errors
- [ ] 10. Encrypt PAN at rest; avoid storing Aadhaar
- [ ] 11. Guard `completeDonation` against missing order id (`src/lib/payments.ts`)
- [ ] 12. Add a test for `completeDonation` (credit once under double call)

## Nice to have
- [ ] 13. `requireAdmin()` helper instead of 8 copied admin checks
- [ ] 14. Reuse `hmacSha256`/`safeEqual` in `subscriptions/verify`
- [ ] 15. `updateCampaignStatus`: only allow valid status transitions
- [ ] 16. Rename `middleware.ts` to `proxy.ts` (Next 16)

## Other
- [ ] Submit sitemap in Google Search Console after deploy
- [ ] Set Cloudinary keys in `.env.local` and Vercel
- [ ] Enable Web Analytics in the Vercel dashboard
- [ ] Set `NEXT_PUBLIC_APP_URL` to the real domain in Vercel
- [ ] Replace logo share image with a 1200x630 banner
