import { defineConfig, loadEnv } from 'vite';

const input = {
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
};

const pwaOptions = {
  registerType: 'autoUpdate',
  includeAssets: ['pwa.svg'],
  manifest: {
    name: 'Zimbari',
    short_name: 'Zimbari',
    description: 'Personal and business finance with safe-to-spend clarity.',
    theme_color: '#2563eb',
    background_color: '#f8fafc',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: '/pwa.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{html,js,css,png,svg,jpg,jpeg,gif,webp,ico,woff,woff2,json}'],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true
  }
};

function pwaFallbackPlugin() {
  return {
    name: 'zimbari-pwa-fallback',
    generateBundle(_, bundle) {
      const files = Object.keys(bundle).filter(file => /\.(html|js|css|png|svg|jpe?g|gif|webp|ico|woff2?|json)$/.test(file));
      const manifest = JSON.stringify(pwaOptions.manifest, null, 2);
      const serviceWorker = `const CACHE_NAME = 'zimbari-offline-v1';\nconst PRECACHE_URLS = ${JSON.stringify(['/', ...files.map(file => `/${file}`)])};\nself.addEventListener('install', event => {\n  self.skipWaiting();\n  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)));\n});\nself.addEventListener('activate', event => {\n  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));\n});\nself.addEventListener('fetch', event => {\n  if (event.request.method !== 'GET') return;\n  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {\n    const clone = response.clone();\n    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));\n    return response;\n  }).catch(() => caches.match('/index.html'))));\n});\n`;

      this.emitFile({ type: 'asset', fileName: 'manifest.webmanifest', source: manifest });
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: serviceWorker });
    }
  };
}

async function getPwaPlugin() {
  try {
    const { VitePWA } = await import('vite-plugin-pwa');
    return VitePWA(pwaOptions);
  } catch {
    return pwaFallbackPlugin();
  }
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const googleClientId = env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID || '';

  return {
    plugins: [await getPwaPlugin()],
    define: {
      __GOOGLE_CLIENT_ID__: JSON.stringify(googleClientId)
    },
    build: {
      rollupOptions: { input }
    }
  };
});
