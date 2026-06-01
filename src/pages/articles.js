import { renderNav } from '../ui/components.js';
import articles from '../content/articles.json';

const appRoot = document.getElementById('app');

function renderPage() {
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = '<h1 class="page-title">Learning Articles</h1><p>Guides to improve your money habits.</p>';
  appRoot.appendChild(header);

  const section = document.createElement('section');
  section.className = 'card-grid';

  articles.forEach(article => {
    const item = document.createElement('article');
    item.className = 'article-card micro';
    item.id = article.id;
    item.innerHTML = `<small>${article.tag}</small><h4>${article.title}</h4><p>${article.summary}</p>`;
    section.appendChild(item);
  });

  appRoot.appendChild(section);
}

renderPage();
