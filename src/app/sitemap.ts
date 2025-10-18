import { MetadataRoute } from 'next';

const staticRoutes = [
  '',
  'tos',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { globby } = await import('globby');
  const pages = await globby([
    'src/app/(main)/**/page.tsx',
    '!src/app/(main)/**/success/page.tsx',
  ]);

  const routes = pages.map((page) => {
    const path = page
      .replace('src/app/(main)', '')
      .replace('/page.tsx', '')
      .replace('/index', '');
    return path;
  });

  const allRoutes = [...staticRoutes, ...routes];

  return allRoutes.map((route) => ({
    url: `https://sparkcv.vercel.app/${route}`,
    lastModified: new Date(),
  }));
}