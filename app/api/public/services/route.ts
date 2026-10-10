import { NextResponse } from "next/server";
import { getServicesWithOverrides } from "@/lib/service-catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const services = await getServicesWithOverrides();
  return NextResponse.json(
    { services },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    },
  );
}
