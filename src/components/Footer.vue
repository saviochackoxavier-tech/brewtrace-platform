<script setup lang="ts">
import { NAV_LINKS } from '../data/nav.js';
</script>

<template>
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="brand-mark" aria-hidden="true">☕</span>
        <div>
          <span class="brand-name">Zenbean</span>
          <span class="text-secondary">Direct-Trade Specialty Coffee</span>
        </div>
      </div>

      <div class="footer-col">
        <span class="footer-heading">Explore</span>
        <ul class="footer-list">
          <li v-for="link in NAV_LINKS.filter((l) => l.to.startsWith('/beans') || l.to === '/')" :key="link.to">
            <a :href="link.to">{{ link.label }}</a>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <span class="footer-heading">Operations</span>
        <ul class="footer-list">
          <li v-for="link in NAV_LINKS.filter((l) => l.to === '/dashboard' || l.to === '/inventory' || l.to === '/sourcing' || l.to === '/orders' || l.to === '/export/overview.csv')" :key="link.to">
            <a :href="link.to">{{ link.label }}</a>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <span class="footer-heading">Legal</span>
        <ul class="footer-list">
          <li v-for="link in NAV_LINKS.filter((l) => l.to === '/terms' || l.to === '/privacy' || l.to === '/cookies' || l.to === '/ethics')" :key="link.to">
            <a :href="link.to">{{ link.label }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 Zenbean Direct Trade Co. All rights reserved.</span>
      <span class="text-muted">Payments are processed through our 3D-secure gateway.</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 4rem;
  padding: 2.5rem 1.5rem 2rem;
  border-top: 1px solid rgba(34, 211, 238, 0.25);
  background: rgba(7, 15, 34, 0.55);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-mark {
  font-size: 1.4rem;
  color: #22d3ee;
  filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.4));
}

.brand-name {
  display: block;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #f2f6fc;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-heading {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.footer-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.footer-list a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.footer-list a:hover {
  color: #22d3ee;
}

.footer-bottom {
  max-width: 1200px;
  margin: 1.5rem auto 0;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(34, 211, 238, 0.2);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.78rem;
  color: var(--text-muted);
}
</style>
