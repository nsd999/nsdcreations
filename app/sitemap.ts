import { MetadataRoute } from 'next';
import { tipsData } from '@/lib/tips-data';
import { servicesData } from '@/lib/services-data';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nsdcreations.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/portfolio', '/services', '/contact', '/meet-the-founder', '/process', '/pricing', '/tips'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
  const pricingRoutes = servicesData.map((service) => ({
    url: `${baseUrl}/pricing/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  const categories = ["branding", "marketing", "development", "automation", "finance", "operations"].map((category) => ({
    url: `${baseUrl}/tips/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  const tips = tipsData.map((tip) => ({
    url: `${baseUrl}/tips/${tip.category.toLowerCase()}/${tip.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...routes, ...pricingRoutes, ...categories, ...tips];
}
