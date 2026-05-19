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
        name: 'Plano de Redenção',
        short_name: 'Redenção',
        description: 'Plano de Redenção — estudo visual baseado no curso do Pr. Ricardo',
        theme_color: '#1a3a2a',
        background_color: '#1a3a2a',
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
            // network-first para o JSON (pode ser atualizado a qualquer momento)
            urlPattern: /\/data\/timeline\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'timeline-data',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 1, maxAgeSeconds: 86400 }
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
