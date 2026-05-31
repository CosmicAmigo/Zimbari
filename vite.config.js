import { defineConfig, loadEnv } from 'vite';

export default defineConfig({
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
});
