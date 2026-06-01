import { renderNav, renderTransactionForm, renderTransactions } from '../ui/components.js';
import { initializeTheme } from '../modules/theme.js';
import { computeSafeBalance } from '../modules/vault.js';
import { parseCsv } from '../modules/parser.js';
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
    if (transaction.category === 'Goal') {
      state.goals.push({ id: `goal-${Date.now()}`, name: transaction.description || 'New Goal', amount: transaction.amount, progress: 0 });
      state.totalFunds -= transaction.amount;
    } else if (transaction.category === 'Bill') {
      state.bills.push({ id: `bill-${Date.now()}`, name: transaction.description || 'New Bill', amount: transaction.amount, due: 'Pending' });
      state.totalFunds -= transaction.amount;
    } else {
      state.totalFunds += transaction.amount;
    }
    await syncTransaction(transaction);
    renderPage();
  },
  onImportCsv(file) {
    parseCsv(file).then(imported => {
      imported.forEach(tx => {
        state.transactions.push(tx);
        if (tx.category === 'Goal') {
          state.goals.push({ id: `goal-${Date.now()}`, name: tx.description, amount: tx.amount, progress: 0 });
          state.totalFunds -= tx.amount;
        } else if (tx.category === 'Bill') {
          state.bills.push({ id: `bill-${Date.now()}`, name: tx.description, amount: tx.amount, due: 'Pending' });
          state.totalFunds -= tx.amount;
        } else {
          state.totalFunds += tx.amount;
        }
      });
      Promise.all(imported.map(syncTransaction)).finally(() => renderPage());
    });
  },
  onTriggerDaraja() {
    initDaraja();
  }
};


async function syncTransaction(transaction) {
  await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...transaction, userGoogleSub: JSON.parse(localStorage.getItem('zimbari-user') || '{}').googleSub })
  }).catch(() => null);
}

function renderPage() {
  initializeTheme();
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());
  const user = JSON.parse(localStorage.getItem('zimbari-user') || '{}');
  if (user.name) {
    const profile = document.createElement('section');
    profile.className = 'metric-panel micro';
    profile.innerHTML = `<strong>Welcome, ${user.name}</strong><p>${user.email || ''}</p>`;
    appRoot.appendChild(profile);
  }
  appRoot.appendChild(renderTransactionForm(callbacks));
  appRoot.appendChild(renderTransactions(state.transactions));
}

hydrateFromDb().finally(renderPage);

listenForSms(message => {
  console.log('SMS transaction candidate:', message);
});
