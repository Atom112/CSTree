import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { remarkWikiLink } from './src/plugins/remark-wiki-link';
import { rehypeKnowledgeNode } from './src/plugins/rehype-knowledge-node';

export default defineConfig({
  site: 'https://cstree.example.com',
  output: 'static',
  integrations: [
    react(),
    tailwind(),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkWikiLink],
    rehypePlugins: [rehypeKnowledgeNode],
  },
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['/_pagefind/pagefind.js'],
      },
    },
  },
});
