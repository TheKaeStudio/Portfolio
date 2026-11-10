import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categories = z.enum(['ui-ux', 'developpement', 'montage-video', 'graphisme']);

const projects = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      summary: z.string().max(170),
      categories: z.array(categories).min(1),
      deliverables: z.array(z.string()).min(1),
      year: z.string(),
      order: z.number(),
      cover: image(),
      coverAlt: z.string(),
      preview: z.string().optional(),
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.url(),
          }),
        )
        .default([]),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            frame: z.enum(['browser', 'phone', 'none']).default('none'),
            url: z.string().optional(),
            span: z.enum(['full', 'half', 'third']).default('full'),
            dark: z.boolean().default(false),
          }),
        )
        .default([]),
    }),
});

export const collections = { projects };
