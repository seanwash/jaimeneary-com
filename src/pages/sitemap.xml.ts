import { getCollection } from 'astro:content';

export async function GET() {
  const galleries = await getCollection('galleries');
  const paths = ['/', '/about/', '/author/jaime/', ...galleries.map(({ id }) => `/${id}/`)];
  const content = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + paths.map(path => `<url><loc>https://jaimeneary.com${path}</loc></url>`).join('') + '</urlset>';
  return new Response(content, { headers: { 'Content-Type': 'application/xml' } });
}
