import { renderApp } from './ui/components.js';
import { computeSafeBalance } from './modules/vault.js';
import { parseCsv } from './modules/parser.js';
import { listenForSms } from './modules/mpesa-sms.js';
import { initDaraja } from './modules/daraja.js';

const appRoot = document.getElementById('app');

const state = {
  totalFunds: 0,
  bills: [],
  goals: [],
  businesses: [],
  transactions: [],
  articles: []
};

const callbacks = {
  onAddTransaction(transaction) {
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
    renderApp(appRoot, state, computeSafeBalance(state.totalFunds, state.goals, state.bills), callbacks);
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
      renderApp(appRoot, state, computeSafeBalance(state.totalFunds, state.goals, state.bills), callbacks);
    });
  },
  onTriggerDaraja() {
    initDaraja();
  }
};

const safeBalance = computeSafeBalance(state.totalFunds, state.goals, state.bills);

renderApp(appRoot, state, safeBalance, callbacks);

listenForSms(message => {
  console.log('SMS transaction candidate:', message);
  // In a real app, prompt user to confirm and add to transactions
});
