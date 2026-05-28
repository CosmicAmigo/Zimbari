import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'import.meta.env.GOOGLE_CLIENT_ID': JSON.stringify(env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID || '')
    },
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
        }
      }
    }
  };
});
