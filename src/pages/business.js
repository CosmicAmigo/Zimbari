import {
  fetchDashboardData,
  getStoredDashboard,
  saveStoredDashboard,
} from "../modules/auth.js";
import {
  renderCards,
  renderNav,
  createBusinessCard,
} from "../ui/components.js";

const appRoot = document.getElementById("app");

function createHeader(title, buttonLabel, onClick) {
  const header = document.createElement("header");
  header.className = "header-row";
  header.innerHTML = `<div><h1 class="page-title">Business Worlds</h1></div>`;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button-secondary";
  button.textContent = buttonLabel;
  button.addEventListener("click", onClick);
  header.appendChild(button);
  return header;
}

function createBusiness() {
  const name = prompt("Business name:");
  if (!name) return;

  const type = prompt("Business type:", "Service") || "Service";
  const balanceText = prompt("Current balance (Ksh):", "0");
  const balance = Number(balanceText);
  if (isNaN(balance)) {
    alert("Please enter a valid balance.");
    return;
  }

  const growthText = prompt("Growth percentage:", "0");
  const growth = Number(growthText);
  if (isNaN(growth)) {
    alert("Please enter a valid growth value.");
    return;
  }

  const dashboard = getStoredDashboard();
  dashboard.businesses = [
    ...dashboard.businesses,
    { id: `biz-${Date.now()}`, name, type, balance, growth },
  ];
  saveStoredDashboard(dashboard);
  renderPage();
}

async function renderPage() {
  const dashboard = await fetchDashboardData();
  const businesses = dashboard?.businesses || [];
  appRoot.innerHTML = "";
  appRoot.appendChild(renderNav());
  appRoot.appendChild(
    createHeader("Business Worlds", "Create new business", createBusiness),
  );
  appRoot.appendChild(
    renderCards("Your Businesses", businesses, createBusinessCard),
  );
}

renderPage();
