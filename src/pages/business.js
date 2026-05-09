import { renderNav, renderCards, createBusinessCard } from '../ui/components.js';

const appRoot = document.getElementById('app');

const state = {
  businesses: [
    { id: 'biz-delivery', name: 'Delivery Goods', type: 'Goods', balance: 3900, growth: 12 },
    { id: 'biz-marketing', name: 'Service Studio', type: 'Services', balance: 2250, growth: 9 }
  ]
};

function renderPage() {
  appRoot.innerHTML = '';
  appRoot.appendChild(renderNav());

  const header = document.createElement('header');
  header.innerHTML = `<h1 class="page-title">Business Worlds</h1>`;
  appRoot.appendChild(header);

  appRoot.appendChild(renderCards('Your Businesses', state.businesses, createBusinessCard));
}

renderPage();