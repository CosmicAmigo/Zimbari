import {
  fetchDashboardData,
  getStoredDashboard,
  saveStoredDashboard,
} from "../modules/auth.js";
import { renderCards, renderNav, createBillCard } from "../ui/components.js";

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

function createBill() {
  const name = prompt("Bill name:");
  if (!name) return;

  const amountText = prompt("Bill amount (Ksh):");
  const amount = Number(amountText);
  if (!amount || isNaN(amount)) {
    alert("Please enter a valid amount.");
    return;
  }

  const due = prompt("Due date or note:", "Pending") || "Pending";
  const dashboard = getStoredDashboard();
  dashboard.bills = [
    ...dashboard.bills,
    { id: `bill-${Date.now()}`, name, amount, due },
  ];
  saveStoredDashboard(dashboard);
  renderPage();
}

async function renderPage() {
  const dashboard = await fetchDashboardData();
  const bills = dashboard?.bills || [];
  appRoot.innerHTML = "";
  appRoot.appendChild(renderNav());
  appRoot.appendChild(createHeader("Bills", "Create new bill", createBill));
  appRoot.appendChild(renderCards("Pending Bills", bills, createBillCard));
}

renderPage();
