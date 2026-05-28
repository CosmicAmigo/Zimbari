import { getStoredUser, fetchDashboardData } from '../modules/auth.js';
import { initializeTheme } from '../modules/theme.js';
import { listenForSms } from '../modules/mpesa-sms.js';
import { parseCsv } from '../modules/parser.js';
import { initDaraja } from '../modules/daraja.js';
import { renderNav, renderTransactionForm, renderTransactions } from '../ui/components.js';

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
  state.businesses = data.businesses || [];
  state.totalFunds = state.transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
}

async function syncTransaction(transaction) {
  const user = getStoredUser();
  await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...transaction, userGoogleSub: user?.googleSub })
  }).catch(() => null);
}

const callbacks = {
  async onAddTransaction(transaction) {
    state.transactions.push(transaction);
    state.totalFunds += Number(transaction.amount || 0);
    await syncTransaction(transaction);
    renderPage();
  },
  onImportCsv(file) {
    parseCsv(file).then(imported => {
      state.transactions.push(...imported);
      state.totalFunds += imported.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      Promise.all(imported.map(syncTransaction)).finally(() => renderPage());
    });
  },
  onTriggerDaraja() {
    initDaraja();
  }
};

function renderWelcome(user) {
  const profile = document.createElement('section');
  profile.className = 'metric-panel micro welcome-panel';
  profile.innerHTML = `
    ${user?.picture ? `<img src="${user.picture}" alt="${user.name}" />` : ''}
    <div>
      <strong>Welcome, ${user?.name || 'Guest'}</strong>
      <p>${user?.email || 'Sign in with Google to sync this dashboard across devices.'}</p>
    </div>
  `;
  return profile;
}

async function hydrateFromDb() {
  const data = await fetchDashboardData();
  applyDashboardData(data);
}

function renderPage() {
  initializeTheme();
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());
  appRoot.appendChild(renderWelcome(getStoredUser()));
  appRoot.appendChild(renderTransactionForm(callbacks));
  appRoot.appendChild(renderTransactions(state.transactions));
}

hydrateFromDb().finally(renderPage);

listenForSms(message => {
  console.log('SMS transaction candidate:', message);
});
