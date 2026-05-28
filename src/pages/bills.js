import { fetchDashboardData } from '../modules/auth.js';
import { renderCards, renderNav, createBillCard } from '../ui/components.js';

const appRoot = document.getElementById('app');

async function renderPage() {
  const dashboard = await fetchDashboardData();
  const bills = dashboard?.bills || [];
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Bills</h1>`;
  appRoot.appendChild(header);

  appRoot.appendChild(renderCards('Pending Bills', bills, createBillCard));
}

renderPage();
