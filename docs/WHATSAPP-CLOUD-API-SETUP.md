# NSD Creations — WhatsApp Cloud API setup

Webhook endpoint: `https://nsdcreations.vercel.app/api/webhooks/whatsapp`

## 1. Create and configure Meta assets
1. Open https://developers.facebook.com/ and create a Meta app for the business.
2. Add the WhatsApp product and complete the WhatsApp Business Platform / Cloud API setup.
3. Use the test number first. Save the Phone Number ID, WhatsApp Business Account ID, and access token from the WhatsApp API setup screen.
4. Configure the app's Webhooks product for the WhatsApp Business Account and subscribe to the `messages` field.
5. For a production sender, complete Meta's business verification/phone registration and use a suitable long-lived system-user access token. Never commit tokens to GitHub.

## 2. Add Vercel environment variables
Set these in the Vercel project for the Production environment (and Preview if needed), then redeploy:
- `WHATSAPP_APP_SECRET`: App Secret from Meta App Settings > Basic. Used to validate POST signatures.
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`: A long random secret you create; use the same value in Meta webhook setup.
- `WHATSAPP_ACCESS_TOKEN`: Cloud API access token. Keep server-only; do not use a NEXT_PUBLIC_ prefix.
- `WHATSAPP_PHONE_NUMBER_ID`: Phone Number ID shown by Meta, not the phone number itself.
- `WHATSAPP_GRAPH_API_VERSION`: Optional Graph API version, for example `v23.0`; use a currently supported version in your Meta app.

Also confirm `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` are configured for the production project.

## 3. Verify webhook
In Meta > Webhooks, use:
- Callback URL: `https://nsdcreations.vercel.app/api/webhooks/whatsapp`
- Verify token: the exact `WHATSAPP_WEBHOOK_VERIFY_TOKEN` value
- Subscribe to `messages`

The route validates the GET challenge and validates POST requests with `x-hub-signature-256`. Incoming messages and delivery statuses are stored in `whatsapp_messages`.

## 4. Apply database migration
Apply `supabase/migrations/20261012_whatsapp_cloud_api.sql` to the same Supabase project used by production.

## 5. Send a test message
After deployment and Meta webhook subscription, send a message to the Meta test/business number from an allowed recipient. Check Vercel logs and the `whatsapp_messages` table.

The authenticated server endpoint `POST /api/whatsapp/send` accepts JSON `{"to":"919876543210","message":"Hello"}`. It requires a recently authenticated admin session and same-origin request. The recipient must have opted in; free-form replies are generally limited to the 24-hour customer-service window, and approved templates are required outside it.

## Existing WhatsApp Business app number
Do not remove or migrate +91 9492651908 from the WhatsApp Business app until Meta explicitly confirms the supported onboarding path for this number. Ask about WhatsApp Business App coexistence during setup. Availability depends on account eligibility and onboarding flow. If coexistence is unavailable, use a separate API number or knowingly migrate the number after reviewing the effect on app usage and history.
