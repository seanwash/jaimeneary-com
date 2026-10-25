import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const image = z.object({
  src: z.string(),
  srcset: z.string().optional(),
  sizes: z.string().optional(),
  alt: z.string(),
  width: z.string().optional(),
  height: z.string().optional(),
  loading: z.enum(['lazy', 'eager']).optional(),
});

export const collections = {
  galleries: defineCollection({
    loader: glob({ pattern: '*.json', base: './src/content/galleries' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      order: z.number().int(),
      date: z.string(),
      hero: image,
      thumbnail: image,
      fullImage: z.string(),
      rows: z.array(z.array(image)),
    }),
  }),
};
