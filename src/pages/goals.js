import { renderNav, renderCards, createGoalCard } from '../ui/components.js';

const appRoot = document.getElementById('app');

const state = {
  goals: [
    { id: 'goal-tuition', name: 'Tuition', amount: 1900, progress: 0.48 },
    { id: 'goal-inventory', name: 'Inventory Fund', amount: 1250, progress: 0.65 }
  ]
};

function renderPage() {
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Goals</h1>`;
  appRoot.appendChild(header);

  appRoot.appendChild(renderCards('Your Goals', state.goals, createGoalCard));
}

renderPage();