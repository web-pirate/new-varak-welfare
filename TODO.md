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

## Landing: monthly + campaign donations
- [ ] Hero: "Give monthly | Give once" toggle, monthly pre-selected, middle amount highlighted, impact line per amount (`Hero`, `MonthlyGivingSection`)
- [ ] Featured campaigns right under the hero; "Make it monthly" upsell in `CampaignCard` / `DonationModal`
- [ ] Thank-you step after a one-time gift: "Keep this impact going, ₹X/month"
- [ ] Monthly section: "Cancel anytime", 80G receipt, monthly impact update; add Razorpay mandate wording
- [ ] Real urgency only (true deadlines/gaps); no forced monthly, keep one-time option
- [ ] A/B test monthly-default vs one-time-default; track conversion, average gift, 3-month retention
- [ ] Depends on #3 (record subscription charges) so monthly impact can be shown

## Other
- [ ] Submit sitemap in Google Search Console after deploy
- [ ] Set Cloudinary keys in `.env.local` and Vercel
- [ ] Enable Web Analytics in the Vercel dashboard
- [ ] Set `NEXT_PUBLIC_APP_URL` to the real domain in Vercel
- [ ] Replace logo share image with a 1200x630 banner
