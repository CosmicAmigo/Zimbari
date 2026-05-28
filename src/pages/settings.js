import { renderNav } from '../ui/components.js';
import { applyTheme, initializeTheme } from '../modules/theme.js';

const appRoot = document.getElementById('app');

function renderPage() {
  initializeTheme();
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const user = JSON.parse(localStorage.getItem('zimbari-user') || '{}');

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Settings</h1>`;
  appRoot.appendChild(header);

  const content = document.createElement('section');
  content.className = 'transaction-form';
  content.innerHTML = `
    <h2 class="section-title">Appearance</h2>
    <label><input id="theme-toggle" type="checkbox" ${document.documentElement.dataset.theme === 'dark' ? 'checked' : ''}/> Enable Dark Mode</label>
    <h2 class="section-title">Account</h2>
    <label>Display name <input id="display-name" value="${user.name || ''}" /></label>
    <label>Email <input value="${user.email || ''}" disabled /></label>
    <button class="button" id="save-settings">Save settings</button>
  `;
  appRoot.appendChild(content);

  content.querySelector('#theme-toggle').addEventListener('change', e => {
    applyTheme(e.target.checked ? 'dark' : 'light');
  });

  content.querySelector('#save-settings').addEventListener('click', () => {
    const savedUser = { ...user, name: content.querySelector('#display-name').value };
    localStorage.setItem('zimbari-user', JSON.stringify(savedUser));
    alert('Settings saved.');
  });
}

renderPage();
