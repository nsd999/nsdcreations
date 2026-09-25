import { NextResponse } from "next/server";
import { getPublishedCmsTips } from "@/lib/public-cms";

export async function GET() {
  const tips = await getPublishedCmsTips();
  return NextResponse.json({
    items: tips.map((tip: any) => ({
      ...tip,
      id: "cms-" + tip.id,
    })),
  });
}
