import { getStoredUser, fetchDashboardData } from '../modules/auth.js';
import { applyTheme, getTheme, initializeTheme } from '../modules/theme.js';
import { renderNav } from '../ui/components.js';

const appRoot = document.getElementById('app');

async function renderPage() {
  initializeTheme();
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const dashboard = await fetchDashboardData();
  const user = dashboard?.user || getStoredUser();
  const name = user?.name || 'Guest';

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Settings</h1><p>Welcome, ${name}.</p>`;
  appRoot.appendChild(header);

  const content = document.createElement('section');
  content.className = 'transaction-form settings-panel';
  content.innerHTML = `
    <h2 class="section-title">Appearance</h2>
    <label class="setting-row">
      <span>Dark Mode</span>
      <input id="theme-toggle" type="checkbox" ${getTheme() === 'dark' ? 'checked' : ''}/>
    </label>
    <h2 class="section-title">Account</h2>
    <div class="account-summary">
      ${user?.picture ? `<img src="${user.picture}" alt="${name}" />` : ''}
      <div>
        <strong>Welcome, ${name}</strong>
        <p>${user?.email || 'Sign in with Google to sync your profile and transactions.'}</p>
      </div>
    </div>
  `;
  appRoot.appendChild(content);

  content.querySelector('#theme-toggle').addEventListener('change', e => {
    applyTheme(e.target.checked ? 'dark' : 'light');
  });
}

renderPage();
