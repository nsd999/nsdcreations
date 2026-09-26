import { NextResponse } from "next/server";
import { getServicesWithOverrides } from "@/lib/service-catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = await getServicesWithOverrides();
  return NextResponse.json(
    { services },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}
