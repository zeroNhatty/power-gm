// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from 'node:url';
export default defineNuxtConfig({
  runtimeConfig: {
    serverUrl: process.env.SERVER_DATABASE_URL,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {'@': fileURLToPath (new URL('~/app', import.meta.url))},
  css: [
    '~/assets/css/main.css',
    'maplibre-gl/dist/maplibre-gl.css',
  ],
  modules: ['@nuxt/test-utils', 'nuxt-auth-sanctum'],
  sanctum: {
    baseUrl: "http://127.0.0.1:8000",
    redirect:{
      onLogin: "/operational/dashboard",
      onAuthOnly: "/operational",
    },
    logLevel: 4,
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'zod',
      ],
      exclude: [
        'maplibre-gl',
      ],
    },
    plugins: [tailwindcss() as any],
  },

})
