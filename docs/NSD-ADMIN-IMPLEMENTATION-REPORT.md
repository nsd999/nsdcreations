# NSD Creations — Admin & Secure Booking Implementation Report

Date: 25 September 2026
Repository: https://github.com/nsd999/nsdcreations
Production: https://nsdcreations.vercel.app/

## A. Audit findings

The existing repository was reviewed before implementation. The notable issues included:

- The previous admin UI used a hardcoded administrator passcode in client/server code.
- The old admin API used the same hardcoded credential pattern.
- Supabase setup SQL contained broad public admin policies using `USING (true)`.
- Razorpay/payment infrastructure was not present as a server-verified booking system.
- Public pricing CTAs did not distinguish fixed payable packages from "+" and range-based starting prices.
- Pricing structured data could expose starting/range prices as exact prices.
- The theme default was system-dependent instead of dark-first.
- The notification manager opened an intrusive prompt automatically and service-worker registration conflicted with push operation.
- Public admin access was not protected at the server/API layer.
- Push subscriptions were not hardened with lifecycle metadata and endpoint uniqueness.
- The repository did not have a production CI workflow.

These areas were changed without replacing the existing public site architecture or the 16-service catalog.

## B. Files and systems added/changed

Major additions include:

- `lib/admin-auth.ts`
- `lib/supabase-admin.ts`
- `lib/razorpay.ts`
- `lib/pricing-engine.ts`
- `lib/service-catalog.ts`
- `lib/public-cms.ts`
- `lib/rate-limit.ts`
- `middleware.ts`
- `components/ServiceBookingFlow.tsx`
- `app/nsdtheadmin/**`
- `app/api/admin/**`
- `app/api/razorpay/**`
- `app/api/bookings/**`
- `app/api/quotes/**`
- `app/book/**`
- `app/booking/success/**`
- `app/quote/**`
- `supabase/migrations/20260925_nsd_admin_booking.sql`
- `supabase/migrations/20260925_admin_rls_hardening.sql`
- `.github/workflows/ci.yml`

Existing public routes, branding, service content, portfolio and SEO structure were retained.

## C. Payment architecture

The booking flow is:

Service → Package → Client details → Review → Server-side pricing → Razorpay order for the advance → Razorpay Checkout → server-side signature verification → payment/order reconciliation → confirmed booking.

The browser never supplies a trusted monetary amount.

Server-side pricing resolves the selected service/package from the source catalog plus any database-backed service override, and calculates all monetary values in paise.

The system distinguishes fixed payable packages from starting/range/custom-quote packages.

Razorpay secrets are server-only.

Webhook handling verifies the raw request body signature and records event IDs for idempotency.

## D. Booking flow

Bookings preserve:

- booking reference
- client details
- service/package snapshots
- selected options
- complete pricing snapshot
- project value
- advance percentage
- advance amount
- balance
- booking status
- payment status
- Razorpay order/payment IDs
- timestamps

Public booking access uses an opaque token whose hash is stored server-side and whose access expires.

Fixed package example verified in production:

- Project value: ₹4,999.00
- Advance: ₹2,499.50
- Balance: ₹2,499.50

Custom/range/“+” packages route to quotation instead of charging the displayed starting value.

## E. Pricing engine

The pricing engine is centralized.

Current defaults:

- Monthly services: first-period payment is 100%.
- Low-ticket fixed services at or below ₹999: 100% upfront.
- Larger fixed one-time projects: 50% advance.
- "+" and price-range packages: quotation required.

Historical bookings retain their own price snapshots, so future catalog edits do not rewrite old financial records.

## F. Database

Admin/auth, booking/payment, quote, CMS, notification campaign, audit, and runtime service-override tables were added.

RLS is enabled on admin tables and no public admin policies are created.

The push subscription table is hardened for lifecycle tracking and unique endpoints.

The payment ledger is server-managed and includes a database trigger against normal-client mutation.

Rate limiting uses a server-side database-backed bucket function.

## G. Security

Admin authentication uses:

- server-side password hashing with scrypt
- database-backed sessions
- opaque random session tokens
- HMAC-SHA256 token hashing with `ADMIN_SESSION_SECRET`
- HttpOnly cookies
- SameSite=Strict
- Secure in production
- 8-hour session lifetime
- session rotation on login
- login failure tracking
- temporary lockout after repeated failures
- same-origin checks for mutations
- server-side authorization on admin APIs
- recent-authentication requirement for password rotation and other sensitive actions

Passwords, password hashes, Razorpay secrets, VAPID private keys and service-role credentials are not returned to the client.

## H. Notification system

The public notification FAB is now compact and user-initiated.

Permission requests happen only after a user gesture.

The existing push subscription storage has been upgraded with status/last-seen/failure metadata, and invalid push endpoints are marked inactive.

The admin console can send notifications to active subscribers and can schedule campaigns for the daily cron.

No browser-delivery statistics are fabricated; the dashboard records send attempts and failures.

## I. Dark theme

The public site now defaults to dark mode without system-theme override.

Light mode remains an intentional user choice.

The admin area uses a separate dark command-center shell and does not reuse the public navbar.

## J. Admin capabilities

`/nsdtheadmin` is the central private command center with:

- dashboard
- bookings
- payments
- leads
- notifications
- subscriber registrations
- tips
- quotes
- services
- pricing
- content
- testimonials
- portfolio
- SEO/settings
- security
- audit logs

Operational statuses and financial values are shown from the database.

Manual/offline payments are stored as separate ledger records and audit-logged instead of mutating Razorpay payment history.

## K. Testing performed

### Repository/CI

A GitHub Actions workflow was added for TypeScript verification and production build.

The final pre-merge repository tree passed CI on the feature branch, including:

- `npx tsc --noEmit`
- `npm run build`

### Production browser verification

Verified after the merge and deployment:

- `/nsdtheadmin` reaches the private admin login gate.
- `/nsdtheadmin/login` renders without visible console errors.
- `/pricing/ai-video-advertisements` shows “Reserve This Plan” CTAs.
- `/book/ai-video-advertisements/Starter` loads successfully.
- The live booking page shows project value ₹4,999.00, advance ₹2,499.50 and balance ₹2,499.50.
- No payment was initiated during browser verification.
- No admin credentials were entered during browser verification.

The browser automation environment did not provide reliable physical viewport emulation for a true 390x844 device test; its JavaScript-based width simulation produced non-authoritative document-width results. Treat the mobile browser measurement as a limitation, not a production regression finding.

### Razorpay

The real payment checkout was not charged during this environment verification. End-to-end Test Mode payment still requires the production Supabase migration and Razorpay Test Mode environment variables to be configured.

## L. Manual production steps

1. In Supabase, run:
   - `supabase/migrations/20260925_nsd_admin_booking.sql`
   - `supabase/migrations/20260925_admin_rls_hardening.sql`

2. In Vercel Project → Settings → Environment Variables, configure:
   - `ADMIN_USERNAME` (optional)
   - `ADMIN_BOOTSTRAP_PASSWORD`
   - `ADMIN_SESSION_SECRET` (use a random value of at least 32 characters)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `CRON_SECRET`
   - `NEXT_PUBLIC_SITE_URL=https://nsdcreations.vercel.app`

3. Configure the Razorpay Test Mode webhook:
   - `https://nsdcreations.vercel.app/api/razorpay/webhook`

4. Verify Test Mode payment + webhook reconciliation before switching the Razorpay environment variables to Live Mode.

5. After the first successful admin login, rotate the administrator password from the Security section. The bootstrap credential is never displayed.

6. The Vercel Hobby cron limitation requires the current daily cron configuration. A previous every-3-hours cron was rejected by Vercel, so the repository now uses a daily schedule.

## M. Known limitations / next expansion points

- CSV export UI is not yet exposed in the command center.
- Subscriber selection UI for targeted push campaigns can be expanded from the current API support.
- The admin service editor covers core service/package metadata; the full long-form SEO/content editor can be expanded without changing the pricing engine.
- Direct Razorpay refund actions are not enabled in the admin UI; refund state reconciliation is supported through webhook events.
- True device-emulation testing at 360/390/768/1024/1440 widths needs a browser runner with explicit viewport control.

No real Razorpay secret or admin bootstrap password is committed to the repository.
