<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { NAV_LINKS } from '../data/nav.js';
import '../styles/global.css';

const route = useRoute();
</script>

<template>
  <header class="site-header">
    <a class="brand" href="/" aria-label="Zenbean home">
      <span class="brand-mark" aria-hidden="true">☕</span>
      <span class="brand-text">
        <span class="brand-name">Zenbean</span>
        <span class="brand-tagline">Direct-Trade Specialty Coffee</span>
      </span>
    </a>

    <nav class="nav" :class="route.path === '/' ? 'nav--active' : ''">
      <template v-for="link in NAV_LINKS" :key="link.to">
        <a
          v-if="!link.children"
          :href="link.to"
          :class="['nav-link', { 'nav-link--active': route.path === link.to }]"
          :aria-current="route.path === link.to ? 'page' : undefined"
        >
          {{ link.label }}
        </a>
        <details v-else :open="route.path === link.to" class="nav-group">
          <summary class="nav-link">{{ link.label }}</summary>
          <div class="nav-group-menu">
            <a
              v-for="child in link.children"
              :key="child.to"
              :href="child.to"
              class="nav-group-item"
              :class="{ 'nav-group-item--active': route.path === child.to }"
              @click="route.path === child.to && (window as unknown as { history: { back: () => void } }).history.back()"
            >
              {{ child.label }}
            </a>
          </div>
        </details>
      </template>
    </nav>

    <a class="cta-nav" href="/checkout">Pay online <span aria-hidden="true">&rarr;</span></a>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(11, 19, 41, 0.85);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(34, 211, 238, 0.25);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #e8edf5;
}

.brand-mark {
  font-size: 1.5rem;
  line-height: 1;
  color: #22d3ee;
  filter: drop-shadow(0 0 12px rgba(34, 211, 238, 0.45));
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #f2f6fc;
}

.brand-tagline {
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #9fb0cc;
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.nav-link {
  position: relative;
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  color: #c4cee4;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease, background 0.2s ease;
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(34, 211, 238, 0.12);
}

.nav-link--active {
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.16);
  font-weight: 600;
}

.nav--active .nav-link--active {
  color: #ffffff;
}

.cta-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  background: #22d3ee;
  color: #0b1329;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  box-shadow: 0 0 24px rgba(34, 211, 238, 0.35);
  transition: background 0.2s ease, transform 0.15s ease;
}

.cta-nav:hover {
  background: #e0f7ff;
  transform: translateY(-1px);
}

.nav-group {
  position: relative;
}

.nav-group summary {
  list-style: none;
  cursor: pointer;
  padding: 0.4rem 0.7rem;
  color: #c4cee4;
  font-size: 0.9rem;
}

.nav-group summary:hover {
  color: #ffffff;
}

.nav-group-menu {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  min-width: 180px;
  display: grid;
  grid-template-rows: repeat(3, auto);
  gap: 2px;
  padding: 0.5rem;
  background: rgba(11, 19, 41, 0.98);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(34, 211, 238, 0.35);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
}

.nav-group-item {
  display: block;
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  color: #c4cee4;
  text-decoration: none;
  font-size: 0.85rem;
  transition: background 0.15s ease;
}

.nav-group-item:hover {
  background: rgba(34, 211, 238, 0.18);
  color: #ffffff;
}

.nav-group-item--active {
  color: #22d3ee;
  font-weight: 600;
}
</style>
