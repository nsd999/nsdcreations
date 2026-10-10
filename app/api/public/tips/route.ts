import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { getPublishedCmsTips } from "@/lib/public-cms";

export async function GET() {
  const tips = await getPublishedCmsTips();
  return NextResponse.json(
    { items: tips.map((tip: any) => ({ ...tip, id: "cms-" + tip.id })) },
    { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
  );
}
