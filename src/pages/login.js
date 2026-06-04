import { initializeTheme } from "../modules/theme.js";
import { renderGoogleSignInButton, storeUser } from "../modules/auth.js";

const appRoot = document.getElementById("app");

// Helper function to check if a user is currently logged in
function isUserLoggedIn() {
  // Checks if a user session exists in localStorage
  return localStorage.getItem("user") !== null;
}

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
      <button type="button" class="button" id="local-login">Login w/ email</button>
    </div>
    <div class="or-separator">or</div>
    <div id="google-click-wrapper" style="margin-top: 18px; display: flex; justify-content: center;">
      <div id="login-google-login"></div>
    </div>
     <div class="or-separator">or</div>
    <div class="form-actions">
      <button type="button" class="button-secondary" id="guest-login">Continue as Guest</button>
    </div>
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

  // --- GOOGLE SIGN IN CONDITIONAL LOGIC ---
  const googleContainer = form.querySelector("#login-google-login");
  const googleWrapper = form.querySelector("#google-click-wrapper");

  // Intercept any click heading toward the Google button area
  googleWrapper.addEventListener("click", (event) => {
    if (isUserLoggedIn()) {
      // If already logged in, block the click action and prevent redirection
      event.preventDefault();
      event.stopPropagation();
      alert("You are already logged in!"); 
    }
  }, true); // Using capturing phase ('true') to catch the click before Google's script does

  renderGoogleSignInButton(googleContainer, {
    onSuccess: () => {
      // Only redirect if NOT logged in (double-check fallback)
      if (!isUserLoggedIn()) {
        window.location.href = "google.html";
      }
    },
    text: "signin_with",
  }).catch(() => {
    
    googleContainer.querySelector("#google-fallback").addEventListener("click", (event) => {
      if (isUserLoggedIn()) {
        event.preventDefault();
        alert("You are already logged in!");
      } else {
        window.location.href = "google.html";
      }
    });
  });
}

renderPage();
