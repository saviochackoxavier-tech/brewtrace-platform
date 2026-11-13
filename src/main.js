import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import { NAV_LINKS } from './data/nav.js';

const routes = [
  { path: '/', component: () => import('./pages/Home.vue') },
  { path: '/beans/:slug', component: () => import('./pages/BeanDetail.vue') },
  { path: '/dashboard', component: () => import('./pages/Dashboard.vue') },
  { path: '/inventory', component: () => import('./pages/Inventory.vue') },
  { path: '/sourcing', component: () => import('./pages/Sourcing.vue') },
  { path: '/orders', component: () => import('./pages/Orders.vue') },
  { path: '/export/overview.csv', component: () => import('./pages/ExportCsv.vue') },
  { path: '/checkout', component: () => import('./pages/Checkout.vue') },
  { path: '/terms', component: () => import('./pages/Terms.vue') },
  { path: '/privacy', component: () => import('./pages/Privacy.vue') },
  { path: '/cookies', component: () => import('./pages/Cookies.vue') },
  { path: '/ethics', component: () => import('./pages/Ethics.vue') },
  { path: '/about', component: () => import('./pages/About.vue') },
  { path: '/manifesto', component: () => import('./pages/Manifesto.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('./pages/NotFound.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App)
  .use(router)
  .mount('#app');
