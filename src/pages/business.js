import { fetchDashboardData } from '../modules/auth.js';
import { renderCards, renderNav, createBusinessCard } from '../ui/components.js';

const appRoot = document.getElementById('app');

async function renderPage() {
  const dashboard = await fetchDashboardData();
  const businesses = dashboard?.businesses || [];
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Business Worlds</h1>`;
  appRoot.appendChild(header);

  appRoot.appendChild(renderCards('Your Businesses', businesses, createBusinessCard));
}

renderPage();
