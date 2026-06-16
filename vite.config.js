import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    emptyOutDir: false,  // evita EPERM no sandbox ao tentar deletar dist anterior
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/**/*'],
      manifest: {
        name: 'Cátedra — Estudos',
        short_name: 'Cátedra',
        description: 'Coleção de aulas de estudo — leitura contínua com aprofundamento.',
        theme_color: '#0e1414',
        background_color: '#0e1414',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            // network-first para o manifesto de aulas
            urlPattern: /\/data\/courses\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'courses-manifest',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 1, maxAgeSeconds: 86400 }
            }
          },
          {
            // network-first para o JSON de cada aula
            urlPattern: /\/data\/courses\/.*\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'courses-data',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 20, maxAgeSeconds: 86400 }
            }
          },
          {
            // cache-first para fontes Google
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 }
            }
          }
        ]
      }
    })
  ]
})
