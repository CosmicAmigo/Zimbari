import { fetchDashboardData } from '../modules/auth.js';
import { computeSafeBalance } from '../modules/vault.js';
import { renderCards, renderMetrics, renderNav, createBillCard, createGoalCard } from '../ui/components.js';

const appRoot = document.getElementById('app');

const state = {
  totalFunds: 0,
  bills: [],
  goals: [],
  businesses: [],
  transactions: [],
  articles: []
};

function applyDashboardData(data) {
  if (!data) return;
  state.transactions = data.transactions || [];
  state.bills = data.bills || [];
  state.goals = data.goals || [];
  state.totalFunds = state.transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
}

async function renderPage() {
  applyDashboardData(await fetchDashboardData());
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Funds Dashboard</h1>`;
  appRoot.appendChild(header);

  const safeBalance = computeSafeBalance(state.totalFunds, state.goals, state.bills);
  appRoot.appendChild(renderMetrics(state, safeBalance));
  appRoot.appendChild(renderCards('Pending Bills', state.bills, createBillCard));
  appRoot.appendChild(renderCards('Goals & Vaults', state.goals, createGoalCard));
}

renderPage();
