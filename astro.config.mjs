import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kae.studio',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize: (item) => ({
        ...item,
        changefreq: 'monthly',
        priority: new URL(item.url).pathname === '/' ? 1 : 0.8,
      }),
    }),
  ],
});
