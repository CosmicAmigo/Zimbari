import { initializeTheme } from "../modules/theme.js";
import { renderGoogleSignInButton, storeUser } from "../modules/auth.js";

const appRoot = document.getElementById("app");

function handleLocalSignIn(username, password) {
  if (!username || !password) {
    alert("Please enter both a username/email and password.");
    return;
  }

  const isEmail = username.includes("@");
  const name = isEmail ? username.split("@")[0] : username;
  storeUser({
    id: username,
    name,
    email: isEmail ? username : "",
    localAuth: true,
  });
  window.location.href = "main.html";
}

function handleContinueAsGuest() {
  storeUser({
    id: "guest",
    name: "Guest User",
    guest: true,
  });
  window.location.href = "main.html";
}

function renderPage() {
  initializeTheme();
  appRoot.innerHTML = "";

  const header = document.createElement("header");
  header.innerHTML = `
    <h1 class="page-title">Login to Zimbari</h1>
    <p>Sign in with email and password, use Google, or continue as a guest.</p>
  `;
  appRoot.appendChild(header);

  const form = document.createElement("section");
  form.className = "login-form";
  form.innerHTML = `
    <label>
      Email or Username
      <input id="auth-username" type="text" placeholder="email@example.com or username" />
    </label>
    <label>
      Password
      <input id="auth-password" type="password" placeholder="Password" />
    </label>
    <div class="form-actions">
      <button type="button" class="button" id="local-login">Sign in</button>
      <button type="button" class="button-secondary" id="guest-login">Continue as Guest</button>
    </div>
    <div id="login-google-login" style="margin-top: 18px; display: flex; justify-content: center;"></div>
  `;
  appRoot.appendChild(form);

  form.querySelector("#local-login").addEventListener("click", () => {
    const username = form.querySelector("#auth-username").value.trim();
    const password = form.querySelector("#auth-password").value.trim();
    handleLocalSignIn(username, password);
  });

  form
    .querySelector("#guest-login")
    .addEventListener("click", handleContinueAsGuest);

  renderGoogleSignInButton(form.querySelector("#login-google-login"), {
    onSuccess: () => {
      window.location.href = "main.html";
    },
    text: "signin_with",
  }).catch(() => {
    form.querySelector("#login-google-login").innerHTML =
      `<button type="button" class="button-secondary">Continue with Google</button>`;
  });
}

renderPage();
