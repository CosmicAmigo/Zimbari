import articles from '../content/articles.json';

const articleItems = articles.slice(0, 3);

function renderArticles() {
  const section = document.createElement('section');
  section.innerHTML = '<h2 class="section-title">Articles</h2>';
  const grid = document.createElement('div');
  grid.className = 'card-grid';

  articleItems.forEach(article => {
    const card = document.createElement('article');
    card.className = 'article-card micro';
    card.innerHTML = `
      <small>${article.tag}</small>
      <h4>${article.title}</h4>
      <p>${article.summary}</p>
      <a class="article-link" href="articles.html#${article.id}">Read article</a>
    `;
    grid.appendChild(card);
  });
  section.appendChild(grid);
  return section;
}

function createCard(title, content) {
  const card = document.createElement('section');
  card.className = 'card';
  card.innerHTML = `<strong>${title}</strong>${content}`;
  return card;
}

function createProgress(progress) {
  const wrapper = document.createElement('div');
  wrapper.className = 'progress-bar';
  wrapper.innerHTML = `<div class="progress-filled" style="width: ${Math.min(100, Math.max(0, progress * 100))}%;"></div>`;
  return wrapper;
}

export function renderMetrics(state, safeBalance) {
  const container = document.createElement('div');
  container.className = 'metric-grid';

  const items = [
    { label: 'Total Funds', value: `Ksh ${state.totalFunds.toLocaleString()}` },
    { label: 'Safe to Spend', value: `Ksh ${safeBalance.toLocaleString()}` },
    { label: 'Pending Bills', value: `Ksh ${state.bills.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString()}` },
    { label: 'Goal Allocations', value: `Ksh ${state.goals.reduce((sum, goal) => sum + goal.amount, 0).toLocaleString()}` }
  ];

  items.forEach(item => {
    const panel = document.createElement('div');
    panel.className = 'metric-panel';
    panel.innerHTML = `<h3>${item.label}</h3><p>${item.value}</p>`;
    container.append(panel);
  });

  return container;
}

export function renderCards(title, list, cardFactory) {
  const section = document.createElement('section');
  section.innerHTML = `<h2 class="section-title">${title}</h2>`;
  const grid = document.createElement('div');
  grid.className = 'card-grid';

  list.forEach(item => {
    grid.appendChild(cardFactory(item));
  });

  section.appendChild(grid);
  return section;
}

export function createBillCard(bill) {
  const content = `
    <small>${bill.due}</small>
    <p>Ksh ${bill.amount.toLocaleString()}</p>
  `;
  return createCard(bill.name, content);
}

export function createGoalCard(goal) {
  const content = `
    <small>${goal.progress * 100}% complete</small>
    <p>Ksh ${goal.amount.toLocaleString()}</p>
  `;
  const card = createCard(goal.name, content);
  card.appendChild(createProgress(goal.progress));
  return card;
}

export function createBusinessCard(business) {
  const content = `
    <small>${business.type}</small>
    <p>Ksh ${business.balance.toLocaleString()}</p>
    <small>Growth ${business.growth}%</small>
  `;
  return createCard(business.name, content);
}

export function renderTransactionForm(callbacks) {
  const section = document.createElement('section');
  section.className = 'transaction-form';
  section.innerHTML = `
    <h2 class="section-title">Quick Entry</h2>
    <label>
      Amount
      <input type="number" name="amount" placeholder="Amount" />
    </label>
    <label>
      Description
      <input type="text" name="description" placeholder="Optional description" />
    </label>
    <label>
      Category
      <select name="category">
        <option value="Personal">Personal</option>
        <option value="Business">Business</option>
        <option value="Goal">Goal</option>
        <option value="Bill">Bill</option>
      </select>
    </label>
    <button class="button">Add Transaction</button>
  `;

  const button = section.querySelector('button');
  button.addEventListener('click', () => {
    const amount = Number(section.querySelector('[name="amount"]').value);
    const description = section.querySelector('[name="description"]').value;
    const category = section.querySelector('[name="category"]').value;

    if (!amount || isNaN(amount)) {
      alert('Please enter a valid amount.');
      return;
    }

    callbacks.onAddTransaction({
      id: `tx-${Date.now()}`,
      amount,
      description,
      category,
      date: new Date().toISOString().slice(0, 10)
    });
  });

  return section;
}

function renderImportWidgets(callbacks) {
  const section = document.createElement('section');
  section.className = 'import-widgets';
  section.innerHTML = `
    <h2 class="section-title">Upload & Import</h2>
    <label>
      CSV Import
      <input type="file" accept=".csv" />
    </label>
    <button class="button-secondary">Trigger Daraja STK Push</button>
  `;

  const fileInput = section.querySelector('input[type="file"]');
  fileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
      callbacks.onImportCsv(file);
    }
  });

  section.querySelector('button').addEventListener('click', () => {
    callbacks.onTriggerDaraja();
  });

  return section;
}

export function renderTransactions(transactions) {
  const section = document.createElement('section');
  section.innerHTML = `<h2 class="section-title">Recent Transactions</h2>`;
  const list = document.createElement('ul');
  list.className = 'transaction-list';
  transactions.slice(-5).forEach(tx => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${tx.amount} Ksh</strong> - ${tx.description} (${tx.category}) on ${tx.date}`;
    list.appendChild(item);
  });
  section.appendChild(list);
  return section;
}

export function renderNav() {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = `
    <a href="main.html">Main</a>
    <a href="funds.html">Funds</a>
    <a href="business.html">Business</a>
    <a href="expenditure.html">Expenditure</a>
    <a href="goals.html">Goals</a>
    <a href="bills.html">Bills</a>
    <a href="profile.html">Profile</a>
    <a href="settings.html">Settings</a>
    <a href="articles.html">Articles</a>
  `;
  return nav;
}

export function renderApp(root, state, safeBalance, callbacks) {
  root.innerHTML = '';

  const header = document.createElement('header');
  header.innerHTML = `
    <div class="header-row">
      <div>
        <h1 class="page-title">Zimbari</h1>
        <p>Personal & business finance with safe-to-spend clarity.</p>
      </div>
      <span class="badge">Low friction · Money worlds · Goal-first</span>
    </div>
  `;
  root.appendChild(header);

  root.appendChild(renderMetrics(state, safeBalance));
  root.appendChild(renderCards('Pending Bills', state.bills, createBillCard));
  root.appendChild(renderCards('Goals & Vaults', state.goals, createGoalCard));
  root.appendChild(renderCards('Business Worlds', state.businesses, createBusinessCard));
  root.appendChild(renderTransactionForm(callbacks));
  root.appendChild(renderImportWidgets(callbacks));
  root.appendChild(renderTransactions(state.transactions));
  root.appendChild(renderArticles());
}
