import type { MetadataRoute } from "next";
import { tipsData } from "@/lib/tips-data";
import { getServicesWithOverrides } from "@/lib/service-catalog";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 3600;

const staticRoutes = [
  "/",
  "/portfolio",
  "/services",
  "/contact",
  "/meet-the-founder",
  "/process",
  "/pricing",
  "/tips",
] as const;

const tipCategories = ["branding", "marketing", "development", "automation", "finance", "operations"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the effective public catalogue so services disabled by the admin are not advertised to crawlers.
  const services = await getServicesWithOverrides();

  const candidates: MetadataRoute.Sitemap = [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.8,
    })),
    ...services.flatMap((service) => [
      {
        url: `${SITE_URL}/services/${service.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      },
      {
        url: `${SITE_URL}/pricing/${service.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ]),
    ...tipCategories.map((category) => ({
      url: `${SITE_URL}/tips/${category}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...tipsData.map((tip) => ({
      url: `${SITE_URL}/tips/${tip.category.toLowerCase()}/${tip.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  // Keep each canonical URL once and avoid timestamps that change on every sitemap request.
  const unique = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of candidates) {
    const normalizedUrl = entry.url.replace(/\/$/, "") || SITE_URL;
    unique.set(normalizedUrl, {
      ...entry,
      url: entry.url,
    });
  }

  return [...unique.values()];
}
