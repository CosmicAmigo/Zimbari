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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const googleClientId = env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID || '';

  return {
    define: {
      __GOOGLE_CLIENT_ID__: JSON.stringify(googleClientId)
    },
    build: {
      rollupOptions: { input }
    }
  };
});
