<script setup lang="ts">
import { useRoute } from 'vue-router';
import { BEANS } from '../data/beans.js';

const route = useRoute();
const slug = String(route.params.slug ?? '');

const bean = BEANS.find((b) => b.id === slug);
</script>

<template>
  <section class="bean-detail glass anim-fade-in">
    <div class="bean-detail-inner">
      <div class="bean-hero">
        <div class="bean-hero-glow">
          <span class="bean-hero-icon">{{ bean?.icon }}</span>
        </div>
        <p class="bean-hero-origin">{{ bean?.origin }} · {{ bean?.region }}</p>
        <h1 v-if="bean" class="bean-hero-name">{{ bean.name }}</h1>
        <p v-if="bean" class="bean-hero-meta">
          {{ bean.altitude }} · {{ bean.process }} · <strong>{{ bean.cup }}</strong> cup rating
        </p>
      </div>

      <div class="bean-detail-grid">
        <div class="bean-card glass">
          <span class="bean-card-title">Description</span>
          <p>{{ bean?.note }}</p>
        </div>

        <div class="bean-card glass">
          <span class="bean-card-title">Producer &amp; process</span>
          <p>
            <strong>{{ bean?.farm }}</strong><br />
            <span class="text-muted">Process: {{ bean?.process }} · Altitude: {{ bean?.altitude }}</span>
          </p>
        </div>

        <div class="bean-cta glass glass--glow">
          <span class="bean-cta-label">Per 12oz lot</span>
          <span class="bean-cta-price">${{ bean?.price }}</span>
          <a class="btn btn-primary" href="/checkout">Secure checkout &rarr;</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BeanDetail',
});
</script>

<style scoped>
.bean-detail {
  padding: 2.5rem 0;
}

.bean-detail-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.bean-hero {
  position: relative;
  height: 340px;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: radial-gradient(circle at 30% 20%, rgba(34, 211, 238, 0.18), transparent 60%);
  border: 1px solid var(--border);
  overflow: hidden;
}

.bean-hero-glow {
  position: absolute;
  inset: 0;
  background: conic-gradient(from 180deg, rgba(34, 211, 238, 0.35), transparent 55%);
  mask-image: radial-gradient(black 40%, transparent 80%);
}

.bean-hero-icon {
  font-size: 5rem;
  position: relative;
  z-index: 1;
  color: #22d3ee;
}

.bean-hero-origin {
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.72rem;
  color: var(--cyan);
  margin-bottom: 0.6rem;
}

.bean-hero-name {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.bean-hero-meta {
  position: relative;
  z-index: 1;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.bean-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-top: 2rem;
}

.bean-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-color: var(--border);
}

.bean-card-title {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.bean-card p {
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.6;
}

.bean-cta {
  grid-column: 1 / -1;
  padding: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-color: var(--border);
}

.bean-cta-label {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.bean-cta-price {
  font-size: 2rem;
  font-weight: 800;
  color: #22d3ee;
}

@media (max-width: 720px) {
  .bean-detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
