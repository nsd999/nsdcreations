import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subscription = body?.subscription || body;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription object" }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    const now = new Date().toISOString();
    const userAgent = typeof body?.userAgent === "string"
      ? body.userAgent.slice(0, 500)
      : request.headers.get("user-agent")?.slice(0, 500) || null;

    const { data: existing, error: lookupError } = await db
      .from("push_subscriptions")
      .select("id")
      .eq("endpoint", subscription.endpoint)
      .maybeSingle();

    if (lookupError) throw lookupError;

    const values = {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      last_seen_at: now,
      user_agent: userAgent,
      status: "active",
      last_notification_status: null,
      failure_count: 0,
    };

    if (existing?.id) {
      const { error } = await db.from("push_subscriptions").update(values).eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await db.from("push_subscriptions").insert({
        ...values,
        created_at: now,
      });
      if (error) throw error;
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Push subscribe error:", error?.message || "unknown");
    return NextResponse.json({ error: "Unable to register notifications." }, { status: 500 });
  }
}
