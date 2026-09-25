import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { assertSameOrigin, requireAdmin, writeAuditLog } from "@/lib/admin-auth";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const db = getSupabaseAdmin();
    const { data, error } = await db.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: "Unable to load admin records." }, { status: 500 });
    return NextResponse.json({ submissions: data || [] });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Admin operation failed." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin(request);
    assertSameOrigin(request);
    const body = await request.json();
    const db = getSupabaseAdmin();
    const allowed = ["unread","contacted","qualified","proposal_sent","won","lost","archived","read"];
    if (!body?.id || !allowed.includes(body.status)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const { error } = await db.from("contact_submissions").update({
      status: body.status,
      updated_at: new Date().toISOString(),
    }).eq("id", body.id);

    if (error) return NextResponse.json({ error: "Unable to update lead." }, { status: 500 });
    await writeAuditLog(admin, "LEAD_STATUS_CHANGED", "Legacy admin lead status changed.", request, body.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error?.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Admin operation failed." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin(request);
    assertSameOrigin(request);
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing identifier." }, { status: 400 });
    const db = getSupabaseAdmin();
    const { error } = await db.from("contact_submissions").update({ status: "archived" }).eq("id", id);
    if (error) return NextResponse.json({ error: "Unable to archive lead." }, { status: 500 });
    await writeAuditLog(admin, "LEAD_STATUS_CHANGED", "Legacy admin archived a lead.", request, id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error?.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Admin operation failed." }, { status: 500 });
  }
}
