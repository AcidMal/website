import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel'
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [react(), tailwind(), icon()],
  output: 'server',
  adapter: cloudflare(),
  vite: {
    build: {
      rollupOptions: {
        external: ['net']
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    ssr: {
      noExternal: ['react-icons'],
    },
  }
});


