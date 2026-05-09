const appRoot = document.getElementById('app');

function renderPage() {
  appRoot.innerHTML = '';

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Login to Zimbari</h1>`;
  appRoot.appendChild(header);

  const form = document.createElement('section');
  form.className = 'login-form';
  form.innerHTML = `
    <label>
      Email
      <input type="email" placeholder="email@example.com" />
    </label>
    <label>
      Password
      <input type="password" placeholder="Password" />
    </label>
    <button class="button">Login</button>
    <p>Or <a href="main.html">Continue as Guest</a></p>
  `;
  appRoot.appendChild(form);
}

renderPage();