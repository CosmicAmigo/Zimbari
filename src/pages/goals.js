import {
  fetchDashboardData,
  getStoredDashboard,
  saveStoredDashboard,
} from "../modules/auth.js";
import { renderCards, renderNav, createGoalCard } from "../ui/components.js";

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

function createGoal() {
  const name = prompt("Goal name:");
  if (!name) return;

  const amountText = prompt("Goal amount (Ksh):");
  const amount = Number(amountText);
  if (!amount || isNaN(amount)) {
    alert("Please enter a valid amount.");
    return;
  }

  const dashboard = getStoredDashboard();
  dashboard.goals = [
    ...dashboard.goals,
    { id: `goal-${Date.now()}`, name, amount, progress: 0 },
  ];
  saveStoredDashboard(dashboard);
  renderPage();
}

async function renderPage() {
  const dashboard = await fetchDashboardData();
  const goals = dashboard?.goals || [];
  appRoot.innerHTML = "";
  appRoot.appendChild(renderNav());
  appRoot.appendChild(createHeader("Goals", "Create new goal", createGoal));
  appRoot.appendChild(renderCards("Your Goals", goals, createGoalCard));
}

renderPage();
