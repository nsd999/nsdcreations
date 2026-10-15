import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Public Supabase configuration is incomplete.");
    const db = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
    const { data, error } = await db.from("public_agency_stats").select("projects_completed,happy_clients").single();
    if (error || !data) throw new Error("Public stats are unavailable.");
    return NextResponse.json({
      projectsCompleted: Number(data.projects_completed),
      happyClients: Number(data.happy_clients),
      source: "cms",
    }, { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } });
  } catch {
    return NextResponse.json({ projectsCompleted: 50, happyClients: 30, source: "baseline" }, {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
    });
  }
}
