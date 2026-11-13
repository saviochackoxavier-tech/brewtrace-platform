<script setup lang="ts">
import { NAV_LINKS } from '../data/nav.js';
</script>

<template>
  <section class="legal glass anim-fade-in">
    <div class="legal-inner">
      <header class="legal-head">
        <p class="section-eyebrow">Legal</p>
        <h1 class="legal-title">
          <template v-if="title">{{ title }}</template>
        </h1>
        <p class="legal-sub">
          Zenbean Direct Trade Co. maintains one coherent legal suite. Links below open the compliant, standalone
          policy pages.
        </p>
      </header>

      <div class="legal-toc">
        <div class="toc-col">
          <span class="toc-heading">Policies</span>
          <ul class="toc-list">
            <li v-for="link in TOC" :key="link.to" class="toc-item">
              <a :href="link.to" class="toc-link">{{ link.label }}</a>
            </li>
          </ul>
        </div>

        <div class="toc-col">
          <span class="toc-heading">Related</span>
          <ul class="toc-list">
            <li v-for="link in RELATED" :key="link.to" class="toc-item">
              <a :href="link.to" class="toc-link">{{ link.label }}</a>
            </li>
          </ul>
        </div>
      </div>

      <article class="legal-body">
        <h2 class="legal-h2">1. Scope &amp; company</h2>
        <p>
          Zenbean Direct Trade Co. (&ldquo;we&rdquo;, &ldquo;Zenbean&rdquo;) operates this platform and the associated
          3D bank card checkout. The terms below govern use, payment, and personal data handled by the site.
        </p>

        <h2 class="legal-h2">2. Terms of Service</h2>
        <p>
          By accessing Zenbean, you agree to these terms. You confirm you are of legal age to enter into a binding
          agreement and that all payments originate from a cardholder in good standing. Orders are fulfilled from
          verified inventory; fraud or misrepresentation voids the agreement immediately.
        </p>

        <h2 class="legal-h2">3. Privacy Policy</h2>
        <p>
          We collect only what is required to process an order and secure a payment. Card data is tokenized at the
          browser and never stored raw. Orders, inventory, and sourcing metrics are held in an isolated local runtime
          only. No third-party analytics, tracking pixels, or persistent user profiles are deployed.
        </p>

        <h2 class="legal-h2">4. Cookie Policy</h2>
        <p>
          Zenbean uses strictly session-essential state. The checkout maintains a signed, client-side receipt so a
          payment can be resumed across tabs without persisting raw card data. No cross-site tracking, advertising,
          or behavioral profiling cookies are set.
        </p>

        <h2 class="legal-h2">5. Direct-Trade Ethical Sourcing Disclosures</h2>
        <p>
          Every lot is purchased directly from the producer at a transparent premium. The disclosure trail
          (origin, region, farm, process, altitude, carrier) is exported with the CSV and PDF data exports so
          consumers, auditors, and partners can verify the source. We oppose middlemen and opaque commodity
          procurement.
        </p>

        <h2 class="legal-h2">6. Data &amp; security</h2>
        <p>
          Input sanitization is enforced at the component boundary: user text is HTML-escaped before render, and
          numbers are normalized. Payments are validated locally and signed at the network boundary. The checkout
          preserves tokens in the browser with an HMAC-signed payload — never raw card data.
        </p>
      </article>

      <footer class="legal-foot">
        <a :href="'/terms'">Terms of Service</a>
        <a :href="'/privacy'">Privacy Policy</a>
        <a href="/cookies">Cookie Policy</a>
        <a href="/ethics">Direct-Trade Ethical Sourcing Disclosures</a>
        <span>&copy; 2026 Zenbean Direct Trade Co.</span>
      </footer>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LegalArticle',
  setup() {
    const title = 'Legal & Compliance Suite';
    const TOC = [
      { to: '/terms', label: 'Terms of Service' },
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/cookies', label: 'Cookie Policy' },
      { to: '/ethics', label: 'Direct-Trade Ethical Sourcing Disclosures' },
    ];
    const RELATED = [
      { to: '/', label: 'Home' },
      { to: '/beans/manifesto', label: 'Origin Beans' },
      { to: '/dashboard', label: 'Operations' },
      { to: '/checkout', label: 'Secure Checkout' },
    ];
    return { title, TOC, RELATED };
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
