import {
  clearStoredUser,
  getStoredUser,
  renderGoogleSignInButton,
} from "../modules/auth.js";
import { applyTheme, initializeTheme } from "../modules/theme.js";
import { renderNav } from "../ui/components.js";

const appRoot = document.getElementById("app");

function renderSignedOutSettings() {
  const content = document.createElement("section");
  content.className = "transaction-form";
  content.innerHTML = `
    <h2 class="section-title">Account</h2>
    <p>Sign in to access your settings and preferences.</p>
    <div id="settings-google-login" style="display: flex; justify-content: flex-start;"></div>
  `;
  appRoot.appendChild(content);

  renderGoogleSignInButton(content.querySelector("#settings-google-login"), {
    onSuccess: () => renderPage(),
    text: "signin_with",
  }).catch(() => {
    content.querySelector("#settings-google-login").innerHTML =
      '<p class="auth-note">Google sign-in is unavailable right now.</p>';
  });
}

function renderSignedInSettings(user) {
  const content = document.createElement("section");
  content.className = "transaction-form";
  content.innerHTML = `
    <h2 class="section-title">Appearance</h2>
    <label><input id="theme-toggle" type="checkbox" ${document.documentElement.dataset.theme === "dark" ? "checked" : ""}/> Enable Dark Mode</label>
    
    <h2 class="section-title">Account</h2>
    <label>Display name <input id="display-name" value="${user.name || ""}" /></label>
    <label>Email <input value="${user.email || ""}" disabled /></label>
    
    <h2 class="section-title">Integrations</h2>
    <label><input id="mpesa-hook" type="checkbox" /> Enable M-Pesa Hook (Track SMS transactions)</label>
    <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 8px;">Automatically log M-Pesa transactions from incoming SMS messages to your account.</p>
    
    <div style="margin-top: 24px; display: flex; gap: 12px;">
      <button class="button" id="save-settings">Save settings</button>
      <button class="button-secondary" id="sign-out">Sign out</button>
    </div>
  `;
  appRoot.appendChild(content);

  content.querySelector("#theme-toggle").addEventListener("change", (e) => {
    applyTheme(e.target.checked ? "dark" : "light");
  });

  content.querySelector("#save-settings").addEventListener("click", () => {
    const savedUser = {
      ...user,
      name: content.querySelector("#display-name").value,
      mpesaHookEnabled: content.querySelector("#mpesa-hook").checked,
    };
    localStorage.setItem("zimbari-user", JSON.stringify(savedUser));
    alert("Settings saved.");
  });

  content.querySelector("#sign-out").addEventListener("click", () => {
    clearStoredUser();
    renderPage();
  });

  // Load saved MPESA hook setting
  const savedUser = JSON.parse(localStorage.getItem("zimbari-user") || "{}");
  if (savedUser.mpesaHookEnabled) {
    content.querySelector("#mpesa-hook").checked = true;
  }
}

function renderPage() {
  initializeTheme();
  appRoot.innerHTML = "";
  appRoot.appendChild(renderNav());

  const header = document.createElement("header");
  const storedUser = getStoredUser();
  const displayName = storedUser?.name || "User";
  header.innerHTML = `<h1 class="page-title">Settings</h1><p>Welcome, ${displayName}.</p>`;
  appRoot.appendChild(header);

  if (!storedUser) {
    renderSignedOutSettings();
    return;
  }

  renderSignedInSettings(storedUser);
}

renderPage();
