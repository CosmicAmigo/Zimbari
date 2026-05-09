import { renderNav, renderCards, createBillCard } from '../ui/components.js';

const appRoot = document.getElementById('app');

const state = {
  bills: [
    { id: 'bill-rent', name: 'Rent', amount: 2100, due: 'Monthly' },
    { id: 'bill-power', name: 'KPLC', amount: 430, due: 'Next 5 days' }
  ]
};

function renderPage() {
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Bills</h1>`;
  appRoot.appendChild(header);

  appRoot.appendChild(renderCards('Pending Bills', state.bills, createBillCard));
}

renderPage();