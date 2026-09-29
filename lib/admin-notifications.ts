import webpush from "web-push";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type AdminPushPayload = {
  title: string;
  body: string;
  url?: string;
  type?: string;
};

let configured = false;

function ensureConfigured() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) return false;

  if (!configured) {
    webpush.setVapidDetails("mailto:nsd.creations.official@gmail.com", publicKey, privateKey);
    configured = true;
  }

  return true;
}

export async function sendAdminPushNotification(payload: AdminPushPayload) {
  if (!ensureConfigured()) return;

  try {
    const db = getSupabaseAdmin();
    const { data: subscriptions } = await db
      .from("admin_push_subscriptions")
      .select("id,endpoint,p256dh,auth,failure_count")
      .eq("status", "active");

    for (const subscription of subscriptions || []) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify({
            title: payload.title.slice(0, 120),
            body: payload.body.slice(0, 3000),
            icon: "/icon.png",
            url: payload.url?.startsWith("/") ? payload.url : "/nsdtheadmin/dashboard",
            type: payload.type || "admin_activity",
          }),
        );

        await db
          .from("admin_push_subscriptions")
          .update({
            last_notification_status: "sent",
            last_notification_at: new Date().toISOString(),
            failure_count: 0,
          })
          .eq("id", subscription.id);
      } catch (error: any) {
        const invalid = error?.statusCode === 404 || error?.statusCode === 410;

        await db
          .from("admin_push_subscriptions")
          .update({
            status: invalid ? "inactive" : "active",
            last_notification_status: invalid ? "expired" : "failed",
            last_notification_at: new Date().toISOString(),
            failure_count: Number(subscription.failure_count || 0) + 1,
          })
          .eq("id", subscription.id);
      }
    }
  } catch {
    // Never make a customer-facing request fail because an admin notification could not be delivered.
  }
}
