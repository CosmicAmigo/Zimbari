import { renderNav, renderTransactions } from '../ui/components.js';

const appRoot = document.getElementById('app');

const state = {
  transactions: [
    { id: 'tx-1', amount: 1500, description: 'Payment received', category: 'Personal', date: '2023-10-01' },
    { id: 'tx-2', amount: -500, description: 'Groceries', category: 'Personal', date: '2023-10-02' },
    { id: 'tx-3', amount: 2000, description: 'Service fee', category: 'Business', date: '2023-10-03' }
  ]
};

function renderPage() {
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Expenditure</h1>`;
  appRoot.appendChild(header);

  appRoot.appendChild(renderTransactions(state.transactions));
}

renderPage();