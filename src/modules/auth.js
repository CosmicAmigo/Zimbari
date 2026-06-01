const USER_KEY = 'zimbari-user';
const GOOGLE_SCRIPT_ID = 'google-identity-services';

export const googleClientId = import.meta.env.GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function decodeJwt(token) {
  const payload = token.split('.')[1];
  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
  return JSON.parse(atob(paddedPayload));
}

function normalizeUser(user = {}) {
  return {
    id: user.id,
    googleSub: user.googleSub || user.google_sub || user.sub,
    name: user.name || user.given_name || 'there',
    email: user.email || '',
    picture: user.picture || ''
  };
}

export function getStoredUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
}

export function storeUser(user) {
  const normalized = normalizeUser(user);
  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
  return normalized;
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}

export async function signInWithGoogleCredential(credential) {
  const googleProfile = decodeJwt(credential);
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential })
  });

  if (!response.ok) {
    throw new Error('Google sign-in failed.');
  }

  const { user } = await response.json();
  return storeUser({ ...googleProfile, ...user, googleSub: user.google_sub || googleProfile.sub });
}

export async function fetchDashboardData(user = getStoredUser()) {
  if (!user?.googleSub) return null;

  const response = await fetch(`/api/users/${encodeURIComponent(user.googleSub)}/dashboard`);
  if (!response.ok) return null;

  const data = await response.json();
  if (data.user) {
    storeUser(data.user);
  }
  return data;
}

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

export async function renderGoogleSignInButton(container, { onSuccess, text = 'continue_with' } = {}) {
  container.innerHTML = '';

  if (!googleClientId) {
    container.innerHTML = '<p class="auth-note">Google sign-in needs GOOGLE_CLIENT_ID configured.</p>';
    return;
  }

  await loadGoogleIdentityScript();
  window.google.accounts.id.initialize({
    client_id: googleClientId,
    callback: async response => {
      const user = await signInWithGoogleCredential(response.credential);
      onSuccess?.(user);
    }
  });
  window.google.accounts.id.renderButton(container, {
    theme: 'outline',
    size: 'large',
    type: 'standard',
    text
  });
}
