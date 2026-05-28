import { clearStoredUser, fetchDashboardData, getStoredUser, renderGoogleSignInButton } from '../modules/auth.js';
import { initializeTheme } from '../modules/theme.js';
import { renderNav } from '../ui/components.js';

const appRoot = document.getElementById('app');

function renderSignedOutProfile() {
  const content = document.createElement('section');
  content.className = 'login-form';
  content.innerHTML = `
    <h2 class="section-title">Sign in to view your profile</h2>
    <p>Use Google to retrieve your account details and synced transaction history.</p>
    <div id="profile-google-login"></div>
  `;
  appRoot.appendChild(content);

  renderGoogleSignInButton(content.querySelector('#profile-google-login'), {
    onSuccess: () => renderPage(),
    text: 'signin_with'
  }).catch(() => {
    content.querySelector('#profile-google-login').innerHTML = '<p class="auth-note">Google sign-in is unavailable right now.</p>';
  });
}

function renderSignedInProfile(user, dashboard) {
  const transactions = dashboard?.transactions || [];
  const content = document.createElement('section');
  content.className = 'transaction-form profile-card';
  content.innerHTML = `
    <div class="account-summary">
      ${user.picture ? `<img src="${user.picture}" alt="${user.name}" />` : ''}
      <div>
        <strong>Welcome, ${user.name}</strong>
        <p>${user.email || 'Google account connected'}</p>
      </div>
    </div>
    <div class="metric-grid compact-metrics">
      <div class="metric-panel"><h3>Synced transactions</h3><p>${transactions.length}</p></div>
      <div class="metric-panel"><h3>Goals</h3><p>${dashboard?.goals?.length || 0}</p></div>
      <div class="metric-panel"><h3>Bills</h3><p>${dashboard?.bills?.length || 0}</p></div>
    </div>
    <button class="button-secondary" id="sign-out">Sign out</button>
  `;
  appRoot.appendChild(content);

  content.querySelector('#sign-out').addEventListener('click', () => {
    clearStoredUser();
    renderPage();
  });
}

async function renderPage() {
  initializeTheme();
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Profile Dashboard</h1>`;
  appRoot.appendChild(header);

  const storedUser = getStoredUser();
  if (!storedUser?.googleSub) {
    renderSignedOutProfile();
    return;
  }

  const dashboard = await fetchDashboardData(storedUser);
  renderSignedInProfile(dashboard?.user || storedUser, dashboard);
}

renderPage();
