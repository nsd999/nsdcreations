import { NextResponse } from "next/server";
import { getPublishedCmsPortfolio } from "@/lib/public-cms";

export async function GET() {
  const items = await getPublishedCmsPortfolio();
  return NextResponse.json({
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
  });
}
