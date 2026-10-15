import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// The current public site already communicates these verified historical totals.
// CMS records created after this baseline increment the public figures automatically.
const BASE_PROJECTS = 50;
const BASE_CLIENTS = 30;

export async function GET() {
  try {
    const db = getSupabaseAdmin();
    const [projects, clients] = await Promise.all([
      db.from("cms_portfolio").select("id", { count: "exact", head: true }).eq("status", "completed"),
      db.from("clients").select("id", { count: "exact", head: true }).eq("status", "active"),
    ]);
    if (projects.error || clients.error) {
      return NextResponse.json({ projectsCompleted: BASE_PROJECTS, happyClients: BASE_CLIENTS, source: "baseline" }, {
        headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
      });
    }
    return NextResponse.json({
      projectsCompleted: BASE_PROJECTS + (projects.count || 0),
      happyClients: BASE_CLIENTS + (clients.count || 0),
      source: "cms",
    }, { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } });
  } catch {
    return NextResponse.json({ projectsCompleted: BASE_PROJECTS, happyClients: BASE_CLIENTS, source: "baseline" }, {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
    });
  }
}
