import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";
import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), icon()],
  output: 'status',
  adapter: cloudflare(),
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    ssr: {
      noExternal: ['react-icons'],
    },
    // Ensure environment variables are loaded
    envPrefix: 'PUBLIC_',
  },
});
