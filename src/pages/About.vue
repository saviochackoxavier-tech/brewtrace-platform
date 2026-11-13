<script setup lang="ts">
import { NAV_LINKS } from '../data/nav.js';
</script>

<template>
  <section class="legal glass anim-fade-in">
    <div class="legal-inner">
      <header class="legal-head">
        <p class="section-eyebrow">Company</p>
        <h1 class="legal-title">Zenbean Direct Trade Co.</h1>
        <p class="legal-sub">
          We buy directly from producers, cup with transparency, and run the business like an operations floor — batch
          inventory, sourcing pipelines, and wholesale queues that every stakeholder can read.
        </p>
      </header>

      <div class="legal-toc">
        <div class="toc-col">
          <span class="toc-heading">Story</span>
          <ul class="toc-list">
            <li v-for="link in TOC" :key="link.to" class="toc-item">
              <a :href="link.to" class="toc-link">{{ link.label }}</a>
            </li>
          </ul>
        </div>

        <div class="toc-col">
          <span class="toc-heading">Core principles</span>
          <ul class="toc-list">
            <li class="toc-item">
              <a href="/beans/manifesto" class="toc-link">Direct-trade manifesto</a>
            </li>
            <li class="toc-item">
              <a href="/beans/ethiopia" class="toc-link">Origin provenance</a>
            </li>
            <li class="toc-item">
              <a href="/sourcing" class="toc-link">Live sourcing metrics</a>
            </li>
            <li class="toc-item">
              <a href="/ethics" class="toc-link">Ethical disclosures</a>
            </li>
            <li class="toc-item">
              <a href="/privacy" class="toc-link">Privacy &amp; security</a>
            </li>
          </ul>
        </div>
      </div>

      <article class="legal-body">
        <h2 class="legal-h2">The name</h2>
        <p>
          &ldquo;Zenbean&rdquo; is the intersection of intent and origin: a precisely processed coffee, a direct trade
          relationship, and an operation that leaves nothing to chance.
        </p>

        <h2 class="legal-h2">Our supply chain</h2>
        <p>
          We buy at a premium directly from washing stations and cooperatives. Every shipment is tracked from
          parchment to warehouse, with the full provenance card exported alongside our inventory and sourcing
          dashboards. No opaque intermediaries, no commodity pricing.
        </p>

        <h2 class="legal-h2">Operations first</h2>
        <p>
          The platform is built with one discipline: every page is self-contained, every computation runs client-side
          where possible, and data exports are pure snapshots. Zero server state means zero-unknown persistence, and
          zero-trust rules mean the business can scale without trusting a dev-shell.
        </p>
      </article>

      <footer class="legal-foot">
        <a :href="'/terms'">Terms of Service</a>
        <a :href="'/privacy'">Privacy Policy</a>
        <a href="/cookies">Cookie Policy</a>
        <a href="/ethics">Sourcing Disclosures</a>
        <span>&copy; 2026 Zenbean Direct Trade Co.</span>
      </footer>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'About',
  setup() {
    const TOC = [
      { to: '/', label: 'Home' },
      { to: '/beans/manifesto', label: 'Direct-Trade Manifesto' },
      { to: '/beans/ethiopia', label: 'Origin Beans' },
      { to: '/dashboard', label: 'Operations Dashboard' },
      { to: '/checkout', label: 'Secure 3D Checkout' },
      { to: '/export/overview.csv', label: 'CSV Export' },
    ];
    return { TOC };
  },
});
</script>

<style scoped>
.legal {
  padding: 2.5rem 0;
}

.legal-inner {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.legal-head {
  margin-bottom: 1.5rem;
}

.section-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.28em;
  font-size: 0.72rem;
  color: #22d3ee;
  margin-bottom: 0.5rem;
}

.legal-title {
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.legal-sub {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
}

.legal-toc {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.toc-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toc-heading {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  font-size: 0.9rem;
}

.toc-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.toc-link:hover {
  color: #22d3ee;
}

.legal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.legal-h2 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-top: 0.25rem;
}

.legal-body p {
  color: var(--text-secondary);
  line-height: 1.65;
}

.legal-foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--text-muted);
}

.legal-foot a {
  color: var(--cyan);
  text-decoration: none;
}

.legal-foot a:hover {
  text-decoration: underline;
}

@media (max-width: 760px) {
  .legal-toc {
    grid-template-columns: 1fr;
  }
}
</style>
