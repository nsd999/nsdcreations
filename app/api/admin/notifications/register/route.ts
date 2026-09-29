import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { assertSameOrigin, requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    assertSameOrigin(request);

    const body = await request.json().catch(() => ({}));
    const subscription = body?.subscription;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: "Invalid push subscription." }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    const now = new Date().toISOString();
    const values = {
      admin_user_id: admin.userId,
      endpoint: String(subscription.endpoint).slice(0, 2000),
      p256dh: String(subscription.keys.p256dh).slice(0, 1000),
      auth: String(subscription.keys.auth).slice(0, 1000),
      last_seen_at: now,
      user_agent: request.headers.get("user-agent")?.slice(0, 500) || null,
      status: "active",
      last_notification_status: null,
      failure_count: 0,
    };

    const { error } = await db
      .from("admin_push_subscriptions")
      .upsert(values, { onConflict: "endpoint" });

    if (error) return NextResponse.json({ error: "Unable to register admin notifications." }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error?.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Unable to register admin notifications." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin(request);
    assertSameOrigin(request);

    const body = await request.json().catch(() => ({}));
    const endpoint = typeof body?.endpoint === "string" ? body.endpoint : "";

    if (!endpoint) return NextResponse.json({ error: "Endpoint is required." }, { status: 400 });

    const db = getSupabaseAdmin();
    const { error } = await db
      .from("admin_push_subscriptions")
      .update({ status: "inactive", last_seen_at: new Date().toISOString() })
      .eq("admin_user_id", admin.userId)
      .eq("endpoint", endpoint);

    if (error) return NextResponse.json({ error: "Unable to disable admin notifications." }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error?.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Unable to disable admin notifications." }, { status: 500 });
  }
}
