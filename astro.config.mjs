import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kae.studio',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
