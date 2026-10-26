import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        category: z.string().default('Engineering Notes'),
        tags: z.array(z.enum(['backend', 'database', 'ai', 'systems'])).default([]),
        draft: z.boolean().default(false),
        example: z.boolean().default(false),
        heroImage: image().optional(),
        heroAlt: z.string().optional(),
        heroCaption: z.string().optional(),
      })
      .refine((data) => !data.heroImage || Boolean(data.heroAlt), {
        message: 'heroAlt is required when heroImage is set.',
        path: ['heroAlt'],
      }),
});
export const collections = { blog };
