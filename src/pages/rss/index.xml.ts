import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import feed from '../../data/feed.json';

const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export async function GET() {
  const galleries = (await getCollection('galleries')).sort((a, b) => a.data.order - b.data.order);
  return rss({
    title: 'Jaime Neary',
    description: 'Nature, landscape, and environmental photography.',
    site: 'https://jaimeneary.com',
    items: galleries.map(({ id, data }) => {
      const original = feed[id as keyof typeof feed];
      return {
        title: data.title,
        description: data.description,
        link: `/${id}/`,
        pubDate: new Date(original?.publishedAt ?? data.date),
        content: `<p>${escape(data.description)}</p>` + data.rows.flat().map(image => `<img src="https://jaimeneary.com${escape(image.src)}" alt="${escape(image.alt)}" />`).join(''),
        customData: original ? `<guid isPermaLink="false">${original.guid}</guid>` : undefined,
      };
    }),
  });
}
