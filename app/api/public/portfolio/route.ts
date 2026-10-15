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
        slug: item.slug,
        category: item.category,
        client: item.client_name,
        type: item.category,
        image: item.thumbnail_url,
        coverImage: item.cover_image_url,
        additionalImages: item.additional_images || [],
        description: item.description,
        link: item.project_url,
        liveUrl: item.live_url,
        tech: item.tech || [],
        featured: item.featured,
        displayOrder: item.display_order,
      })),
    },
    { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
  );
}
