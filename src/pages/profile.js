import {
  clearStoredUser,
  fetchDashboardData,
  getStoredUser,
} from "../modules/auth.js";
import { initializeTheme } from "../modules/theme.js";
import { renderNav } from "../ui/components.js";

const appRoot = document.getElementById("app");

function renderSignedOutProfile() {
  window.location.href = 'login.html';
}

function renderSignedInProfile(user, dashboard) {
  const transactions = dashboard?.transactions || [];
  const accountLabel = user.email
    ? user.email
    : user.guest
      ? "Guest account"
      : "Local account";

  const content = document.createElement("div");
  content.innerHTML = `
    <header>
      <h1 class="page-title">Profile</h1>
    </header>
    <main>
      <section id="profile-card">
        <div class="card-header">
          <h2>${user.name || "User"}</h2>
          <p>${accountLabel}</p>
        </div>
        <div class="card-body">
          <h3>Account Balance</h3>
          <p class="balance">KES ${dashboard?.balance || "0.00"}</p>
          <h3>Recent Transactions</h3>
          <ul class="transactions-list">
            ${transactions
      .map(
        (t) => `<li>${t.description} - KES ${t.amount}</li>`
      )
      .join("")}
          </ul>
          ${transactions.length === 0 ? "<p>No transactions yet.</p>" : ""}
        </div>
        <div class="card-footer">
          <button id="sign-out" class="button-danger">Sign Out</button>
          <button id="go-to-dashboard" class="button">Go to Dashboard</button>
        </div>
      </section>
      <section id="profile-actions">
        <h2>Account Actions</h2>
        <button class="button-secondary">Change Password</button>
        <button class="button-secondary">Update Profile</button>
      </section>
    </main>
    `;

  appRoot.appendChild(content);

  if (user.guest) {
    appRoot.querySelector("#profile-actions").style.display = "none";
  }

  appRoot.querySelector("#sign-out").addEventListener("click", () => {
    clearStoredUser();
    renderPage();
  });

  appRoot.querySelector("#go-to-dashboard").addEventListener("click", () => {
    window.location.href = "/main.html";
  });
}

async function renderPage() {
  const user = getStoredUser();
  initializeTheme();

  appRoot.innerHTML = "";
  renderNav(appRoot);

  if (user) {
    const dashboard = await fetchDashboardData(user.token);
    renderSignedInProfile(user, dashboard);
  } else {
    renderSignedOutProfile();
  }
}

renderPage();
