import { defineCollection, z } from 'astro:content';

export const collections = {
  node: defineCollection({
    type: 'content',
    schema: z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
      order: z.number().default(0),
      parent: z.string().nullable().optional(),
      children: z.array(z.string()).default([]),
      related: z.array(z.string()).default([]),
      prerequisites: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    }),
  }),
};
