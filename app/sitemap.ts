import { MetadataRoute } from 'next';
import { tipsData } from '@/lib/tips-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nsdcreations.vercel.app';

  // Core static routes
  const routes = [
    '',
    '/portfolio',
    '/services',
    '/contact',
    '/meet-the-founder',
    '/our-process',
    '/pricing',
    '/tips',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Categories
  const categories = ["branding", "marketing", "development", "automation", "finance", "operations"].map((category) => ({
    url: `${baseUrl}/tips/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Individual tips
  const tips = tipsData.map((tip) => ({
    url: `${baseUrl}/tips/${tip.category.toLowerCase()}/${tip.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...categories, ...tips];
}
