import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { getPublishedCmsPortfolio } from "@/lib/public-cms";

export async function GET() {
  const items = await getPublishedCmsPortfolio();
  return NextResponse.json(
    {
      items: items.map((item: any) => ({
        id: "cms-" + item.id,
        title: item.title,
        category: item.category,
        client: item.client_name,
        type: item.category,
        image: item.thumbnail_url,
        description: item.description,
        link: item.project_url,
        tech: item.tech || [],
        featured: item.featured,
        displayOrder: item.display_order,
      })),
    },
    { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
  );
}
