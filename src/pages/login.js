import { initializeTheme } from '../modules/theme.js';

const appRoot = document.getElementById('app');

function decodeJwt(token) {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
}

async function handleGoogleCredential(credential) {
  const profile = decodeJwt(credential);
  localStorage.setItem('zimbari-user', JSON.stringify({
    googleSub: profile.sub,
    name: profile.name,
    email: profile.email,
    picture: profile.picture,
    token: credential
  }));

  await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential })
  }).catch(() => null);

  window.location.href = 'main.html';
}

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
    <label>Email<input type="email" placeholder="email@example.com" /></label>
    <label>Password<input type="password" placeholder="Password" /></label>
    <button class="button">Login</button>
    <button class="button-secondary" id="google-login">Continue with Google</button>
    <p>Or <a href="main.html">Continue as Guest</a></p>
  `;
  appRoot.appendChild(form);

  form.querySelector('#google-login').addEventListener('click', async () => {
    const token = prompt('Paste Google ID token (JWT) to simulate Google login/signup:');
    if (!token) return;
    try {
      await handleGoogleCredential(token);
    } catch {
      alert('Invalid token.');
    }
  });
}

renderPage();
