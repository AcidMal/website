// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  adapter: vercel(),
  output: 'static',  // Ensure static file output
  build: {
    assets: 'assets'  // This is the default, but let's make it explicit
  }
});


