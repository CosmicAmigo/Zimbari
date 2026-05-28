import { fetchDashboardData } from '../modules/auth.js';
import { renderCards, renderNav, createGoalCard } from '../ui/components.js';

const appRoot = document.getElementById('app');

async function renderPage() {
  const dashboard = await fetchDashboardData();
  const goals = dashboard?.goals || [];
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Goals</h1>`;
  appRoot.appendChild(header);

  appRoot.appendChild(renderCards('Your Goals', goals, createGoalCard));
}

renderPage();
