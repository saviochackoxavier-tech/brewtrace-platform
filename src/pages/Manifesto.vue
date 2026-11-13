<script setup lang="ts">
import { NAV_LINKS } from '../data/nav.js';
</script>

<template>
  <section class="manifesto glass anim-fade-in">
    <div class="manifesto-inner">
      <header class="manifesto-head">
        <p class="section-eyebrow">Direct trade</p>
        <h1 class="manifesto-title">A fair trade, by design</h1>
      </header>

      <div class="manifesto-grid">
        <div class="manifesto-col">
          <h2 class="manifesto-h2">Curated origin</h2>
          <p>
            Every bean we sell is a single-origin lot from a named producer. We publish the washing station, the
            altitude, the process, and the cup profile so the bean carries its origin story from the first pour.
          </p>
        </div>

        <div class="manifesto-col">
          <h2 class="manifesto-h2">Direct relationship</h2>
          <p>
            No middlemen. We contract with producers at a premium above commodity pricing and pay on time. When a
            coffee is worth more, the grower receives more.
          </p>
        </div>

        <div class="manifesto-col manifesto-col--right">
          <h2 class="manifesto-h2">Transparent metrics</h2>
          <p>
            Our operations dashboard, sourcing pipelines, inventory, and wholesale queues are read-only façades of
            real-time batch data. The same rows appear in your CSV export.
          </p>
        </div>
      </div>

      <footer class="manifesto-foot">
        <a :href="'/beans/manifesto'">Read the bean manifesto &rarr;</a>
        <a :href="'/beans/ethiopia'">Explore origin lots &rarr;</a>
      </footer>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Manifesto',
  setup() {
    const TOC = [
      { to: '/', label: 'Home' },
      { to: '/beans/ethiopia', label: 'Ethiopia Yirgacheffe' },
      { to: '/beans/kenya', label: 'Kenya Kahawa' },
      { to: '/beans/colonia', label: 'Colombia Huila' },
      { to: '/beans/sumatra', label: 'Sumatra Mandheling' },
    ];
    return { TOC };
  },
});
</script>

<style scoped>
.manifesto {
  padding: 3rem 0;
}

.manifesto-inner {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.manifesto-head {
  text-align: center;
  margin-bottom: 2rem;
}

.section-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.28em;
  font-size: 0.72rem;
  color: #22d3ee;
  margin-bottom: 0.5rem;
}

.manifesto-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

.manifesto-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.manifesto-col {
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: rgba(11, 19, 41, 0.35);
}

.manifesto-col--right {
  border-color: rgba(34, 211, 238, 0.4);
  background: rgba(34, 211, 238, 0.06);
}

.manifesto-h2 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #22d3ee;
}

.manifesto-col p {
  color: var(--text-secondary);
  line-height: 1.65;
}

.manifesto-foot {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.manifesto-foot a {
  color: #22d3ee;
  font-weight: 700;
  text-decoration: none;
}

.manifesto-foot a:hover {
  text-decoration: underline;
}

@media (max-width: 880px) {
  .manifesto-grid {
    grid-template-columns: 1fr;
  }
}
</style>
