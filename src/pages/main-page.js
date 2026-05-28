import { renderNav, renderTransactionForm, renderTransactions } from '../ui/components.js';
import { initializeTheme } from '../modules/theme.js';
import { computeSafeBalance } from '../modules/vault.js';
import { parseCsv } from '../modules/parser.js';
import { listenForSms } from '../modules/mpesa-sms.js';
import { initDaraja } from '../modules/daraja.js';

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
  businesses: [
    { id: 'biz-delivery', name: 'Delivery Goods', type: 'Goods', balance: 3900, growth: 12 },
    { id: 'biz-marketing', name: 'Service Studio', type: 'Services', balance: 2250, growth: 9 }
  ],
  transactions: [
    { id: 'tx-1', amount: 1500, description: 'Payment received', category: 'Personal', date: '2023-10-01' },
    { id: 'tx-2', amount: -500, description: 'Groceries', category: 'Personal', date: '2023-10-02' }
  ],
  articles: []
};

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

renderPage();

listenForSms(message => {
  console.log('SMS transaction candidate:', message);
});