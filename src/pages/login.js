import { renderGoogleSignInButton } from '../modules/auth.js';
import { initializeTheme } from '../modules/theme.js';

const appRoot = document.getElementById('app');

function renderPage() {
  initializeTheme();
  appRoot.innerHTML = '';

  const header = document.createElement('header');
  header.innerHTML = `
    <h1 class="page-title">Login to Zimbari</h1>
    <p>Use your Google account to keep your finance worlds synced.</p>
  `;
  appRoot.appendChild(header);

  const form = document.createElement('section');
  form.className = 'login-form';
  form.innerHTML = `
    <h2 class="section-title">Continue securely</h2>
    <div id="google-login"></div>
    <p>Or <a href="main.html">Continue as Guest</a></p>
  `;
  appRoot.appendChild(form);

  renderGoogleSignInButton(form.querySelector('#google-login'), {
    onSuccess: () => {
      window.location.href = 'main.html';
    }
  }).catch(() => {
    form.querySelector('#google-login').innerHTML = '<p class="auth-note">Google sign-in is unavailable right now.</p>';
  });
}

renderPage();
