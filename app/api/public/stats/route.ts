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
    if (error || !data) throw new Error("Owner-managed public metrics are unavailable.");
    const projectsCompleted = Number(data.projects_completed);
    const happyClients = Number(data.happy_clients);
    if (!Number.isSafeInteger(projectsCompleted) || projectsCompleted < 0 || !Number.isSafeInteger(happyClients) || happyClients < 0) {
      throw new Error("Owner-managed public metrics are invalid.");
    }
    return NextResponse.json({
      projectsCompleted,
      happyClients,
      source: "cms",
    }, { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } });
  } catch {
    return NextResponse.json({ projectsCompleted: null, happyClients: null, source: "unavailable" }, {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
    });
  }
}
