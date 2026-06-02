import {
  fetchDashboardData,
  getStoredDashboard,
  saveStoredDashboard,
} from "../modules/auth.js";
import { renderNav, renderTransactions } from "../ui/components.js";

const appRoot = document.getElementById("app");

function createHeader(title, buttonLabel, onClick) {
  const header = document.createElement("header");
  header.className = "header-row";
  header.innerHTML = `<div><h1 class="page-title">${title}</h1></div>`;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button-secondary";
  button.textContent = buttonLabel;
  button.addEventListener("click", onClick);
  header.appendChild(button);
  return header;
}

function createTransaction() {
  const amountText = prompt("Enter expenditure amount (Ksh):");
  const amount = Number(amountText);
  if (!amount || isNaN(amount)) {
    alert("Please enter a valid amount.");
    return;
  }

  const description =
    prompt("Description (optional):", "New expense") || "New expense";
  const category =
    prompt("Category (Personal, Business, Goal, Bill):", "Personal") ||
    "Personal";
  const transaction = {
    id: `tx-${Date.now()}`,
    amount,
    description,
    category,
    date: new Date().toISOString().slice(0, 10),
  };

  const dashboard = getStoredDashboard();
  dashboard.transactions = [...dashboard.transactions, transaction];
  saveStoredDashboard(dashboard);
  renderPage();
}

async function renderPage() {
  const dashboard = await fetchDashboardData();
  const transactions = dashboard?.transactions || [];
  appRoot.innerHTML = "";
  appRoot.appendChild(renderNav());
  appRoot.appendChild(
    createHeader("Expenditure", "Create new expenditure", createTransaction),
  );
  appRoot.appendChild(renderTransactions(transactions));
}

renderPage();
