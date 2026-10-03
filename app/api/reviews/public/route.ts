import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const context = url.searchParams.get("context");

    const db = getSupabaseAdmin();
    let query = db
      .from("testimonials")
      .select("id,name,business_name,rating,review,avatar_url,photo_url,status,created_at,context_slug")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(12);

    if (context) query = query.eq("context_slug", context);

    const { data, error } = await query;
    if (error) {
      console.error("Public testimonials query failed:", error);
      return NextResponse.json({ testimonials: [] }, { status: 200 });
    }

    return NextResponse.json(
      { testimonials: data ?? [] },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Public testimonials API failed:", error);
    return NextResponse.json({ testimonials: [] }, { status: 200 });
  }
}
