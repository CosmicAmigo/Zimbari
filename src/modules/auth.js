const USER_KEY = "zimbari-user";
const DASHBOARD_KEY = "zimbari-dashboard";
const GOOGLE_SCRIPT_ID = "google-identity-services";

export const googleClientId =
  import.meta.env.GOOGLE_CLIENT_ID ||
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "";

function decodeJwt(token) {
  const payload = token.split(".")[1];
  const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
  const paddedPayload = normalizedPayload.padEnd(
    Math.ceil(normalizedPayload.length / 4) * 4,
    "=",
  );
  return JSON.parse(atob(paddedPayload));
}

function normalizeUser(user = {}) {
  return {
    id: user.id || user.email || user.googleSub || user.sub || "guest",
    googleSub: user.googleSub || user.google_sub || user.sub,
    name: user.name || user.given_name || user.email?.split("@")[0] || "Guest",
    email: user.email || "",
    picture: user.picture || "",
    guest: user.guest || false,
    localAuth: user.localAuth || false,
  };
}

export function getStoredUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || "null");
}

export function storeUser(user) {
  const normalized = normalizeUser(user);
  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
  return normalized;
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}

function getDashboardKey(user = getStoredUser()) {
  const keyId = user?.googleSub || user?.id || user?.email || "guest";
  return `${DASHBOARD_KEY}:${keyId}`;
}

export function getStoredDashboard(user = getStoredUser()) {
  return (
    JSON.parse(localStorage.getItem(getDashboardKey(user)) || "null") || {
      bills: [],
      goals: [],
      businesses: [],
      transactions: [],
    }
  );
}

export function saveStoredDashboard(data, user = getStoredUser()) {
  const normalized = {
    bills: Array.isArray(data.bills) ? data.bills : [],
    goals: Array.isArray(data.goals) ? data.goals : [],
    businesses: Array.isArray(data.businesses) ? data.businesses : [],
    transactions: Array.isArray(data.transactions) ? data.transactions : [],
  };
  localStorage.setItem(getDashboardKey(user), JSON.stringify(normalized));
  return normalized;
}

function mergeDashboard(remote = {}, local = {}) {
  return {
    bills: [...(remote.bills || []), ...(local.bills || [])],
    goals: [...(remote.goals || []), ...(local.goals || [])],
    businesses: [...(remote.businesses || []), ...(local.businesses || [])],
    transactions: [
      ...(remote.transactions || []),
      ...(local.transactions || []),
    ],
  };
}

export async function signInWithGoogleCredential(credential) {
  const googleProfile = decodeJwt(credential);
  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });

  if (!response.ok) {
    throw new Error("Google sign-in failed.");
  }

  const { user } = await response.json();
  return storeUser({
    ...googleProfile,
    ...user,
    googleSub: user.google_sub || googleProfile.sub,
  });
}

export async function fetchDashboardData(user = getStoredUser()) {
  const localData = getStoredDashboard(user);
  if (!user?.googleSub) {
    return localData;
  }

  try {
    const response = await fetch(
      `/api/users/${encodeURIComponent(user.googleSub)}/dashboard`,
    );
    if (!response.ok) {
      return localData;
    }

    const data = await response.json();
    if (data.user) {
      storeUser(data.user);
    }
    return mergeDashboard(data, localData);
  } catch {
    return localData;
  }
}

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.appendChild(script);
  });
}

function createFallbackGoogleButton(container, buttonText, onClick) {
  container.innerHTML = "";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button-secondary";
  button.textContent = buttonText;
  button.addEventListener("click", onClick);
  container.appendChild(button);
}

function getGoogleButtonText(text = "continue_with") {
  if (text === "signin_with") return "Sign in with Google";
  if (text === "continue_with") return "Continue with Google";
  return "Sign in with Google";
}

export async function renderGoogleSignInButton(
  container,
  { onSuccess, text = "continue_with" } = {},
) {
  container.innerHTML = "";

  if (!googleClientId) {
    createFallbackGoogleButton(container, getGoogleButtonText(text), () => {
      alert(
        "Google sign-in is not configured here. Use local email/password or continue as guest.",
      );
    });
    return;
  }

  await loadGoogleIdentityScript();
  window.google.accounts.id.initialize({
    client_id: googleClientId,
    callback: async (response) => {
      const user = await signInWithGoogleCredential(response.credential);
      onSuccess?.(user);
    },
  });

  window.google.accounts.id.renderButton(container, {
    theme: "outline",
    size: "large",
    type: "standard",
    text,
  });
}
