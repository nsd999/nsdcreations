import { NextResponse } from "next/server";
import webpush from "web-push";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { assertSameOrigin, requireAdmin, writeAuditLog } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    assertSameOrigin(request);

    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: "Push notifications are not configured." }, { status: 503 });
    }

    webpush.setVapidDetails(
      "mailto:nsd.creations.official@gmail.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.slice(0, 120) : "A client";
    const db = getSupabaseAdmin();
    const { data: subscriptions } = await db.from("push_subscriptions").select("id,endpoint,p256dh,auth,status").eq("status", "active");

    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions || []) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({
            title: "New Client Review",
            body: name + " has left a new review for NSD Creations.",
            icon: "/icon.png",
            url: "/",
            type: "review",
          }),
        );
        sent += 1;
        await db.from("push_subscriptions").update({ last_notification_status: "sent", last_notification_at: new Date().toISOString(), failure_count: 0 }).eq("id", sub.id);
      } catch (error: any) {
        failed += 1;
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await db.from("push_subscriptions").update({ status: "inactive", last_notification_status: "expired", last_notification_at: new Date().toISOString() }).eq("id", sub.id);
        }
      }
    }

    await writeAuditLog(admin, "NOTIFICATION_SENT", "Review notification campaign sent.", request);
    return NextResponse.json({ success: true, sent, failed });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error?.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Notification operation failed." }, { status: 500 });
  }
}
