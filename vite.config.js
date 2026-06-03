import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Zimbari',
        short_name: 'Zimbari',
        description: 'Amani Financial Management Platform',
        theme_color: '#2563eb',       // Energetic SaaS Blue
        background_color: '#0f172a',  // Deep Dark Slate background for loading splash
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Automatically find and cache every build asset for complete offline capability
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        login: 'login.html',
        main: 'main.html',
        profile: 'profile.html',
        funds: 'funds.html',
        business: 'business.html',
        expenditure: 'expenditure.html',
        goals: 'goals.html',
        bills: 'bills.html',
        settings: 'settings.html',
        articles: 'articles.html'
      },
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    }
  }
});
