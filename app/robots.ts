import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ["/private/", "/nsdtheadmin", "/api/admin"],
    },
    sitemap: 'https://nsdcreations.vercel.app/sitemap.xml',
  };
}
