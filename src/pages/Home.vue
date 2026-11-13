<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BEANS as beansData } from '../data/beans.js';
import { NAV_LINKS } from '../data/nav.js';

const beans = beansData;
const scrollY = ref(0);

onMounted(() => {
  const ro = new ResizeObserver(() => {
    scrollY.value = window.scrollY;
  });
  ro.observe(document.body);
});

function pick(picked: string[]) {
  return beans.filter((b) => picked.includes(b.id));
}
</script>

<template>
  <section class="hero anim-fade-up" :style="{ opacity: scrollY > 40 ? 0.78 : 1 }">
    <div class="hero-layers">
      <div class="hero-bg" aria-hidden="true">
        <span class="hero-glow"></span>
        <span class="hero-grid"></span>
        <span class="hero-coffee"></span>
      </div>

      <div class="hero-content">
        <p class="eyebrow">Direct-Trade · Transparent Sourcing · Certified Green</p>
        <h1 class="hero-title">
          Coffee that
          <span class="gradient-text">carries the origin</span>
          in every cup.
        </h1>
        <p class="hero-sub">
          We trade directly with small-holder producers across Ethiopia, Kenya, Colombia, and Sumatra.
          Single-origin provenance cards, real-time inventory, and a secure 3D bank card checkout,
          all under one fully static, zero-dependency frontend.
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/beans/manifesto">Meet the beans</a>
          <a class="btn btn-ghost" href="/dashboard">Open operations dashboard</a>
        </div>
      </div>
    </div>

    <div class="provenance-grid">
      <article
        v-for="bean in beans"
        :key="bean.id"
        class="provenance-card glass anim-fade-up"
        :style="{ animationDelay: `${bean.delay}ms` }"
      >
        <div class="provenance-thumb" :style="{ background: `radial-gradient(circle at 30% 20%, ${bean.glow}, transparent 60%)` }">
          <span class="bean-icon">{{ bean.icon }}</span>
        </div>
        <div class="provenance-body">
          <span class="bean-origin">{{ bean.origin }}</span>
          <h3 class="bean-name">{{ bean.name }}</h3>
          <p class="bean-note">{{ bean.note }}</p>
          <div class="bean-meta">
            <span>{{ bean.processing }}</span>
            <span class="sep">·</span>
            <span>{{ bean.cupProfile }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>

  <section class="section glass">
    <div class="section-inner">
      <header class="section-head">
        <p class="section-eyebrow">Portfolio</p>
        <h2 class="section-title">Direct-trade provenance</h2>
        <p class="section-text">Every lot is purchased at a premium directly from the washing station or cooperative. No middlemen, no opaque supply chains.</p>
      </header>
      <div class="bean-pills">
        <button
          v-for="tag in ['All', 'Ethiopia', 'Kenya', 'Colombia', 'Sumatra']"
          :key="tag"
          class="pill"
          :class="{ 'pill--active': selectedTag === tag }"
          @click="selectedTag = tag"
        >
          {{ tag }}
        </button>
      </div>
      <div class="bean-grid">
        <article
          v-for="bean in filteredBeans"
          :key="bean.id"
          class="bean-card glass anim-fade-up"
          :style="{ animationDelay: `${bean.delay}ms` }"
        >
          <div class="bean-image" :style="{ background: `radial-gradient(circle at 25% 20%, ${bean.glow}, transparent 65%)` }">
            <span class="bean-card-ico">{{ bean.icon }}</span>
            <span class="bean-price">${{ bean.price }}</span>
          </div>
          <div class="bean-card-body">
            <h3 class="bean-card-title">{{ bean.name }}</h3>
            <p class="bean-card-origin">{{ bean.origin }}</p>
            <p class="bean-card-note">{{ bean.note }}</p>
            <div class="bean-card-footer">
              <span>{{ bean.cupProfile }}</span>
              <a class="bean-card-link" href="/beans/{{ bean.id }}">View lot &rarr;</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--alt anim-fade-in">
    <div class="section-inner">
      <header class="section-head">
        <p class="section-eyebrow">Terminal</p>
        <h2 class="section-title">Real-time operations dashboard</h2>
        <p class="section-text">Batch inventory, active sourcing metrics, wholesale queues, and CSV export.</p>
      </header>
      <div class="ops-grid">
        <div class="ops-card glass">
          <span class="ops-label">Active Sourcing</span>
          <span class="ops-value" data-counter>0</span>
          <span class="ops-sub">producer relationships open</span>
        </div>
        <div class="ops-card glass">
          <span class="ops-label">Batches Ready</span>
          <span class="ops-value" data-counter>0</span>
          <span class="ops-sub">awaiting roast or dispatch</span>
        </div>
        <div class="ops-card glass">
          <span class="ops-label">Pending Wholesale</span>
          <span class="ops-value" data-counter>0</span>
          <span class="ops-sub">orders in queue</span>
        </div>
        <div class="ops-card glass glass--glow">
          <span class="ops-label">Sustainability</span>
          <span class="ops-value" data-counter>0</span>
          <span class="ops-sub">kg CO₂ offset this cycle</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section-inner">
      <header class="section-head">
        <p class="section-eyebrow">Secure checkout</p>
        <h2 class="section-title">3D bank card payment</h2>
        <p class="section-text">Multi-bank themes, real-time 3D card mapping, and micro-loading states.</p>
      </header>
      <div class="checkout-preview">
        <div class="card-frame glass">
          <div class="card-front">
            <span class="card-brand">HDFC</span>
            <span class="card-type">DEBIT</span>
            <span class="card-series">•••• 2021</span>
            <span class="card-holder">CH - CLIENT</span>
            <span class="card-exp">09/29</span>
          </div>
          <div class="card-back">
            <div class="card-ccv">
              <span class="ccv-label">CVV</span>
              <span class="ccv-value spinner" aria-hidden="true"></span>
            </div>
            <span class="card-strip"></span>
          </div>
        </div>
        <p class="checkout-legend">Tapping “Checkout” maps your inputs onto this animated 3D render.</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'Home',
  setup() {
    const selectedTag = defineModel('selectedTag', { type: String, default: 'All' });
    return { selectedTag, pick };
  },
  setup() {
    return {};
  },
  computed: {
    filteredBeans() {
      const tag = this.selectedTag;
      if (tag === 'All') return this.beans;
      return this.beans.filter((b) => b.origin.includes(tag));
    },
  },
});
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 86vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-layers {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  top: -20%;
  left: -15%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.12), transparent 65%);
  filter: blur(40px);
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(34, 211, 238, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.07) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(black 40%, transparent 80%);
}

.hero-coffee {
  position: absolute;
  bottom: 8%;
  right: 6%;
  font-size: 18rem;
  color: rgba(34, 211, 238, 0.08);
  transform: rotate(12deg);
}

.hero-content {
  max-width: 880px;
  z-index: 2;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.28em;
  font-size: 0.72rem;
  color: #22d3ee;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: clamp(2.6rem, 6vw, 4.6rem);
  font-weight: 800;
  line-height: 1.08;
  margin-bottom: 1.25rem;
}

.gradient-text {
  background: linear-gradient(120deg, #22d3ee, #7dd3fc, #22d3ee);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
}

.hero-sub {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin-bottom: 1.75rem;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.4rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.25s ease;
}

.btn-primary {
  background: #22d3ee;
  color: #0b1329;
  box-shadow: 0 0 26px rgba(34, 211, 238, 0.35);
}

.btn-primary:hover {
  background: #4ade80;
  transform: translateY(-2px);
}

.btn-ghost {
  border: 1px solid var(--border-strong);
  color: var(--text-primary);
  background: transparent;
}

.btn-ghost:hover {
  border-color: #22d3ee;
  background: rgba(34, 211, 238, 0.12);
}

.provenance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.25rem;
  margin-top: 2.5rem;
}

.provenance-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border-color: var(--border);
}

.provenance-thumb {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(11, 19, 41, 0.5);
  font-size: 3rem;
  position: relative;
}

.provenance-thumb::before {
  content: '';
  position: absolute;
  inset: 0;
  background: conic-gradient(from 180deg, rgba(34, 211, 238, 0.3), transparent 50%);
  mask-image: radial-gradient(black 40%, transparent 80%);
}

.bean-icon {
  position: relative;
  z-index: 1;
}

.provenance-body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.bean-origin {
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--cyan);
}

.bean-name {
  font-size: 1.25rem;
  font-weight: 700;
}

.bean-note {
  color: var(--text-secondary);
  font-size: 0.92rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bean-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.bean-meta .sep {
  color: var(--border);
}

.section {
  padding: 3.5rem 0;
}

.section--alt {
  background: rgba(11, 19, 41, 0.35);
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-head {
  max-width: 760px;
  margin-bottom: 1.75rem;
}

.section-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.28em;
  font-size: 0.72rem;
  color: #22d3ee;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.section-text {
  color: var(--text-secondary);
  font-size: 1.02rem;
  line-height: 1.6;
}

.bean-pills {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
}

.pill {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.pill--active {
  background: rgba(34, 211, 238, 0.18);
  border-color: #22d3ee;
  color: #22d3ee;
  font-weight: 600;
}

.bean-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.bean-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-color: var(--border);
  transition: border-color 0.25s ease;
}

.bean-card:hover {
  border-color: rgba(34, 211, 238, 0.6);
}

.bean-image {
  position: relative;
  height: 160px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: rgba(11, 19, 41, 0.45);
  overflow: hidden;
}

.bean-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(34, 211, 238, 0.2), transparent 50%);
  opacity: 0.5;
}

.bean-card-ico {
  font-size: 2.2rem;
  position: relative;
  z-index: 1;
}

.bean-price {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(11, 19, 41, 0.8);
  border: 1px solid var(--border);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #22d3ee;
}

.bean-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.bean-card-title {
  font-size: 1.2rem;
  font-weight: 700;
}

.bean-card-origin {
  font-size: 0.82rem;
  color: var(--cyan);
  font-weight: 600;
}

.bean-card-note {
  color: var(--text-secondary);
  font-size: 0.88rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bean-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.bean-card-link {
  color: var(--cyan);
  text-decoration: none;
  font-weight: 600;
}

.bean-card-link:hover {
  text-decoration: underline;
}

.ops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.ops-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-color: var(--border);
}

.ops-label {
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.ops-value {
  font-size: 2.2rem;
  font-weight: 800;
  color: #22d3ee;
  line-height: 1.1;
}

.ops-sub {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.checkout-preview {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.card-frame {
  flex: 1 1 280px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-front,
.card-back {
  position: relative;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-strong);
  overflow: hidden;
}

.card-front {
  background: linear-gradient(145deg, #f0f4ff, #e2e9ff);
  color: #0b1329;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.card-brand {
  font-size: 0.7rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.card-type {
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--text-muted);
}

.card-series,
.card-holder,
.card-exp {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.card-exp {
  text-align: right;
}

.card-back {
  background: linear-gradient(145deg, #1f2a52, #161e3f);
  color: rgba(255, 255, 255, 0.85);
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-ccv {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 80px;
}

.ccv-label {
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.55);
}

.ccv-value {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border-color: rgba(255, 255, 255, 0.25);
  margin: 0 auto;
}

.card-strip {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  height: 60%;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 4px;
}

.checkout-legend {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: center;
}

@media (max-width: 720px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
  .hero {
    min-height: 70vh;
  }
  .ops-grid {
    grid-template-columns: 1fr;
  }
  .checkout-preview {
    flex-direction: column;
  }
}
</style>
