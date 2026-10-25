import { getCollection } from 'astro:content';
import { aboutText } from '../data/about';

export async function GET() {
  const galleries = (await getCollection('galleries')).sort((a, b) => a.data.order - b.data.order);
  return Response.json([
    { title: 'About me', url: '/about/', text: aboutText },
    ...galleries.map(({ id, data }) => ({ title: data.title, url: `/${id}/`, text: data.description })),
  ]);
}
