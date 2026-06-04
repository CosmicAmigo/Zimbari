import { clearStoredUser, getStoredUser, renderGoogleSignInButton, storeUser } from "../modules/auth.js";
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
    const updatedUser = {
      ...user,
      name: content.querySelector("#display-name").value,
    };
    storeUser(updatedUser);
    alert("Settings saved.");
  });

  content.querySelector("#sign-out").addEventListener("click", () => {
    clearStoredUser();
    window.location.href = "index.html";
  });
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
