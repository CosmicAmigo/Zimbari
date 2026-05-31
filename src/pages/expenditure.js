import { fetchDashboardData } from '../modules/auth.js';
import { renderNav, renderTransactions } from '../ui/components.js';

const appRoot = document.getElementById('app');

async function renderPage() {
  const dashboard = await fetchDashboardData();
  const transactions = dashboard?.transactions || [];
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Expenditure</h1>`;
  appRoot.appendChild(header);

  appRoot.appendChild(renderTransactions(transactions));
}

renderPage();
