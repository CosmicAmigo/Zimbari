import { renderNav } from '../ui/components.js';

const appRoot = document.getElementById('app');

function renderPage() {
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Profile Dashboard</h1>`;
  appRoot.appendChild(header);

  const content = document.createElement('section');
  content.innerHTML = `
    <p>Welcome to your profile. Here you can manage your account settings.</p>
    <p>Name: John Doe</p>
    <p>Email: john@example.com</p>
  `;
  appRoot.appendChild(content);
}

renderPage();