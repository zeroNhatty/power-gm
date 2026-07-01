// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url';
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {'@': fileURLToPath (new URL('~/app', import.meta.url))},
  css: ['./app/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxt/test-utils'],
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    },
  }
})