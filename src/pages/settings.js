import { renderNav } from '../ui/components.js';

const appRoot = document.getElementById('app');

function renderPage() {
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Settings</h1>`;
  appRoot.appendChild(header);

  const content = document.createElement('section');
  content.innerHTML = `
    <p>App settings here.</p>
    <label>
      Dark Mode
      <input type="checkbox" />
    </label>
  `;
  appRoot.appendChild(content);
}

renderPage();