import { renderNav, renderMetrics, renderCards, createBillCard, createGoalCard } from '../ui/components.js';
import { computeSafeBalance } from '../modules/vault.js';

const appRoot = document.getElementById('app');

const state = {
  totalFunds: 7800,
  bills: [
    { id: 'bill-rent', name: 'Rent', amount: 2100, due: 'Monthly' },
    { id: 'bill-power', name: 'KPLC', amount: 430, due: 'Next 5 days' }
  ],
  goals: [
    { id: 'goal-tuition', name: 'Tuition', amount: 1900, progress: 0.48 },
    { id: 'goal-inventory', name: 'Inventory Fund', amount: 1250, progress: 0.65 }
  ],
  businesses: [],
  transactions: [],
  articles: []
};

function renderPage() {
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