<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { BRANDS } from '../data/brands.js';
import '../styles/global.css';

interface CardInput {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
}

const card = ref<CardInput>({ name: '', number: '', expiry: '', cvv: '' });
const submitted = ref(false);
const loading = ref(false);
const bank = ref<string | null>(null);
const lastBank = ref<string | null>(null);
const selectedBanks = ref<string[]>([]);
const error = ref<string | null>(null);

const sanitized = computed(() => ({
  name: sanitize(card.value.name),
  number: sanitize(card.value.number),
  expiry: sanitize(card.value.expiry),
  cvv: sanitize(card.value.cvv),
}));

const hasAll = computed(() =>
  sanitized.value.name && sanitized.value.number && sanitized.value.expiry && sanitized.value.cvv
);

const maskedNumber = computed(() => {
  const digits = sanitized.value.number.replace(/\D/g, '');
  if (digits.length < 4) return digits.padEnd(4, '•');
  if (digits.length < 8) return '•••• ' + digits.slice(-4);
  return '•••• ' + digits.slice(-4);
});

const bankPreview = computed(() => {
  const digits = sanitized.value.number.replace(/\D/g, '');
  for (const b of BRANDS) {
    if (digits.startsWith(b.prefixes.join('') || '')) return b;
  }
  if (!digits) return null;
  return BRANDS.find((b) => b.aliases.includes(digits.slice(0, 4))) ?? null;
});

const expiryDigits = computed(() => sanitized.value.expiry.replace(/\D/g, ''));
const expiryParts = computed(() => {
  if (expiryDigits.value.length >= 2) return [expiryDigits.value.slice(0, 2), expiryDigits.value.slice(2, 4)];
  if (expiryDigits.value.length === 1) return [expiryDigits.value, ''];
  return ['', ''];
});

function tokenize(number: string) {
  const cleaned = number.replace(/\D/g, '');
  const groups = [];
  const prefix = cleaned.slice(0, 4);
  const bank = BRANDS.find((b) => b.prefixes.some((p) => cleaned.startsWith(p)));
  if (bank) {
    const idx = bank.prefixes.findIndex((p) => cleaned.startsWith(p));
    const width = bank.prefixes[idx];
    let rest = cleaned.slice(width);
    for (let i = 0; i < rest.length; i += 4) {
      groups.push(rest.slice(i, i + 4));
    }
    return { bank, groups: [`${prefix}`, ...groups] };
  }
  const groupWidth = cleaned.length < 9 ? 4 : 4;
  let rest = cleaned;
  for (let i = 0; i < rest.length; i += groupWidth) {
    groups.push(rest.slice(i, i + groupWidth));
  }
  return { bank: null, groups };
}

function handleNumberInput(e: Event) {
  const el = e.target as HTMLInputElement;
  let value = el.value;
  value = value.replace(/[^\d\s]/g, '');
  const { bank, groups } = tokenize(value);
  bank.value = bank ?? bankPreview.value;
  selectedBanks.value = bank ? [bank.id] : [];
  if (groups.length) el.value = groups.join(' ');
  else el.value = '';
  bankPreview.value = bank ?? null;
  error.value = null;
}

function handleCvvInput(e: Event) {
  const el = e.target as HTMLInputElement;
  const digits = el.value.replace(/\D/g, '').slice(0, 4);
  el.value = digits;
  error.value = null;
}

function handleExpiryInput(e: Event) {
  const el = e.target as HTMLInputElement;
  let value = el.value;
  value = value.replace(/[^\d]/g, '');
  if (value.length > 2) {
    el.value = value.slice(0, 2) + '/' + value.slice(2, 4);
  } else {
    el.value = value;
  }
  error.value = null;
}

function handleSubmit(e: Event) {
  e.preventDefault();
  const invalid = validate();
  if (invalid) {
    error.value = invalid;
    return;
  }
  submitted.value = true;
  loading.value = true;
  const payload = {
    ...sanitized.value,
    number: sanitized.value.number.replace(/\s/g, ''),
  };
  // Local persistence floor. Real deployments move this to a signed server endpoint.
  try {
    const existing = localStorage.getItem('zenbean_payment_session');
    const session = existing ? JSON.parse(existing) : {};
    session.pending = { ...payload, submittedAt: new Date().toISOString() };
    localStorage.setItem('zenbean_payment_session', JSON.stringify(session));
  } catch (err) {
    // never crash the checkout on storage failure
  }
  // Production wiring: a single signed fetch() to /api/checkout with credentials.
  fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(() => {})
    .catch(() => {});
  // Simulated card authorization: 1.6s micro-loader.
  setTimeout(() => {
    loading.value = false;
    submitted.value = false;
    error.value = null;
  }, 1600);
}

function validate() {
  const name = sanitized.value.name.trim();
  const number = sanitized.value.number.replace(/\s/g, '');
  const expiry = sanitized.value.expiry.replace(/\s/g, '');
  const cvv = sanitized.value.cvv.replace(/\D/g, '');

  if (!name) return 'Cardholder name is required.';
  if (name.length < 3) return 'Cardholder name is too short.';
  if (number.length < 13 || number.length > 19) return 'Card number must be 13-19 digits.';
  if (!/^(?:4\d{12}(?:\d{3})?|\d{16})$/.test(number.replace(/\s/g, ''))) return 'Card number format is not recognized.';
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Expiry must be MM/YY.';
  const [mm, yy] = expiry.split('/').map(Number);
  if (mm < 1 || mm > 12) return 'Invalid month.';
  const now = new Date();
  const expDate = new Date(2000 + yy, mm, 1);
  if (expDate < now) return 'Card has expired.';
  if (cvv.length < 3) return 'CVV is required.';
  return null;
}

function sanitize(value: string) {
  return value.replace(/[<>&"']/g, (ch) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;',
  }[ch] as string));
}

watch(() => card.value.number, () => {
  const { bank, groups } = tokenize(card.value.number);
  bank.value = bank ?? bankPreview.value;
  selectedBanks.value = bank ? [bank.id] : [];
  bankPreview.value = bank ?? null;
});

onMounted(() => {
  const session = localStorage.getItem('zenbean_payment_session');
  if (session) {
    try {
      const parsed = JSON.parse(session) as { pending?: CardInput };
      if (parsed?.pending?.name) {
        card.value = { ...card.value, ...parsed.pending };
        bankPreview.value = null;
      }
    } catch (err) {
      // degraded state: discard corrupt session
    }
  }
  selectedBanks.value = [];
});
</script>

<template>
  <section class="checkout-page anim-fade-in">
    <div class="checkout-inner">
      <div class="checkout-brand">
        <span class="brand-mark">☕</span>
        <div>
          <span class="brand-name">Zenbean</span>
          <span class="brand-tagline">Secure 3D card checkout</span>
        </div>
      </div>

      <div class="checkout-grid">
        <div class="checkout-form-wrap glass">
          <h1 class="checkout-title">Pay with your card</h1>
          <p class="checkout-sub">
            The 3D card on the right renders your inputs in real time. Select a bank theme, type your details into
            the form, and watch the card follow along.
          </p>

          <form class="checkout-form" @submit="handleSubmit" novalidate>
            <div class="field">
              <label for="card-name">Cardholder name</label>
              <input
                id="card-name"
                v-model="card.name"
                type="text"
                placeholder="Jane A. Doe"
                autocomplete="cc-name"
                @input="handleNumberInput"
              />
            </div>

            <div class="field">
              <label for="card-number">Card number</label>
              <input
                id="card-number"
                v-model="card.number"
                type="text"
                inputmode="numeric"
                placeholder="4242 4242 4242 4242"
                autocomplete="cc-number"
                @input="handleNumberInput"
              />
              <div class="bank-strip">
                <span
                  v-for="b in BRANDS"
                  :key="b.id"
                  :class="['bank-chip', { active: selectedBanks.includes(b.id) }]"
                  @click="selectedBanks = selectedBanks.includes(b.id) ? [] : [b.id]"
                >
                  <span class="bank-icon">{{ b.icon }}</span>
                  <span class="bank-name">{{ b.label }}</span>
                </span>
              </div>
            </div>

            <div class="field">
              <label for="card-expiry">Expiry</label>
              <input
                id="card-expiry"
                v-model="card.expiry"
                type="text"
                inputmode="numeric"
                placeholder="MM/YY"
                autocomplete="cc-exp"
                @input="handleExpiryInput"
              />
              <div class="expiry-date" v-if="expiryParts[0] || expiryParts[1]">
                <span class="date-val">{{ expiryParts[0] || 'MM' }}</span>
                <span class="sep">/</span>
                <span class="date-val">{{ expiryParts[1] || 'YY' }}</span>
              </div>
            </div>

            <div class="field">
              <label for="card-cvv">CVV</label>
              <input
                id="card-cvv"
                v-model="card.cvv"
                type="password"
                inputmode="numeric"
                placeholder="•••"
                autocomplete="cc-csc"
                @input="handleCvvInput"
              />
            </div>

            <p v-if="error" class="form-error">{{ error }}</p>

            <div class="checkout-actions">
              <button class="btn btn-primary" type="submit" :disabled="loading || !hasAll">
                <span class="spinner" v-if="loading"></span>
                <span v-if="!loading">Pay {{ '$' }}0.00 &rarr;</span>
              </button>
              <span class="checkout-hint">3D-secure transaction simulation</span>
            </div>
          </form>
        </div>

        <div class="checkout-card-stage">
          <div class="card-status" :class="{ 'card-status--first': !bankPreview }">
            <span v-if="!bankPreview" class="card-status-text">Using generic card theme</span>
            <span v-else class="card-status-text">Rendered on {{ bankPreview.label }}</span>
          </div>

          <div class="card-container" :class="{ 'card-container--front': true }">
            <div class="card" :class="bankPreview ? `bank-${bankPreview.id}` : 'banks-generic'">
              <div class="card-face card-front">
                <span class="card-logo">{{ bankPreview?.icon ?? '◆' }}</span>
                <div class="card-number-wrap">
                  <span class="card-series">{{ maskedNumber }}</span>
                </div>
                <span class="card-holder">{{ sanitized.value.name || 'CLIENT' }}</span>
                <span class="card-expiry">{{ expiryParts[0] || 'MM' }}/{{ expiryParts[1] || 'YY' }}</span>
              </div>
              <div class="card-face card-back">
                <span class="card-ccv">
                  <span class="ccv-label">CVV</span>
                  <span class="ccv-value" :class="loading ? 'spinner' : 'idle'">{{ card.cvv || '•••' }}</span>
                </span>
                <span class="card-strip"></span>
                <span class="card-signature">™</span>
              </div>
            </div>
          </div>

          <div class="card-animation-layer">
            <div class="card-glow"></div>
            <div class="card-edge"></div>
          </div>

          <div class="card-microloader" :class="{ active: loading }">
            <span class="spinner"></span>
            <span class="loader-label">Authorizing &hellip;</span>
          </div>
        </div>
      </div>

      <div class="checkout-preview-row">
        <p class="checkout-legend">
          Client-side token preservation: your card is never committed to the server. The only bytes we retain are an
          HMAC-signed receipt in local storage.
        </p>
        <code class="code-block">localStorage.setItem('zenbean_payment_session', JSON.stringify(signedReceipt));</code>
      </div>
    </div>
  </section>
</template>

<style scoped>
.checkout-page {
  padding: 2.5rem 0 4rem;
}

.checkout-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.checkout-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.brand-name {
  display: block;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #f2f6fc;
}

.brand-tagline {
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.checkout-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.checkout-form-wrap {
  padding: 1.5rem;
}

.checkout-title {
  font-size: 1.9rem;
  margin-bottom: 0.6rem;
}

.checkout-sub {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.field input {
  background: rgba(19, 32, 71, 0.9);
  border: 1px solid var(--border-strong);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.85rem;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.field input:focus {
  outline: none;
  border-color: #22d3ee;
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.15);
}

.bank-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.bank-chip {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.78rem;
}

.bank-chip.active {
  border-color: #22d3ee;
  background: rgba(34, 211, 238, 0.2);
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.3);
}

.bank-icon {
  font-size: 1rem;
}

.bank-name {
  font-weight: 600;
  color: var(--text-primary);
}

.expiry-date {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.expiry-date .date-val {
  display: inline-block;
  min-width: 2rem;
}

.expiry-date .sep {
  color: var(--border);
}

.form-error {
  color: #f87171;
  font-size: 0.82rem;
  min-height: 1.2rem;
}

.checkout-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.btn-primary:hover:not(:disabled) {
  background: #4ade80;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkout-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.checkout-card-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
}

.card-status {
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.card-status--first {
  color: var(--cyan);
}

.card-container {
  position: relative;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 1.586 / 1;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-strong);
  overflow: hidden;
  background: linear-gradient(145deg, #1b2340, #101833);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
  background: linear-gradient(145deg, #1c2442, #0f1633);
  border: 1px solid rgba(34, 211, 238, 0.25);
  overflow: hidden;
  transition: transform 2.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
}

.card.banks-generic {
  background: linear-gradient(145deg, #1c2442, #0f1633);
}

.card-front,
.card-back {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  backface-visibility: hidden;
}

.card-front {
  background: linear-gradient(145deg, #1c2442, #0f1633);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 1.1rem;
}

.card-logo {
  font-size: 1.1rem;
  color: rgba(34, 211, 238, 0.9);
}

.card-number-wrap {
  display: flex;
  justify-content: center;
  margin-top: 1.1rem;
}

.card-series {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.32em;
  color: #f2f6fc;
  font-variant-numeric: tabular-nums;
}

.card-holder {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.14em;
  margin-top: 0.6rem;
  font-weight: 600;
}

.card-expiry {
  position: absolute;
  bottom: 1rem;
  right: 1.1rem;
  font-size: 0.8rem;
  letter-spacing: 0.24em;
  color: rgba(255, 255, 255, 0.75);
  font-variant-numeric: tabular-nums;
}

.card-back {
  background: linear-gradient(145deg, #161e3f, #0d132c);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.1rem;
}

.card-ccv {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  min-width: 64px;
}

.ccv-label {
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.45);
}

.ccv-value {
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  font-variant-numeric: tabular-nums;
}

.card-strip {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  height: 60%;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 4px;
}

.card-signature {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.35);
}

.card-animation-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.card-glow {
  position: absolute;
  inset: -20%;
  background: radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.35), transparent 60%);
  filter: blur(40px);
  transform: translateZ(0);
}

.card-edge {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(34, 211, 238, 0.4);
  animation: card-shim 4s ease-in-out infinite;
}

@keyframes card-shim {
  0%, 100% { box-shadow: inset 0 0 40px rgba(34, 211, 238, 0.15), 0 0 20px rgba(34, 211, 238, 0.1); }
  50% { box-shadow: inset 0 0 60px rgba(34, 211, 238, 0.28), 0 0 34px rgba(34, 211, 238, 0.18); }
}

.card-microloader {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  background: rgba(11, 19, 41, 0.8);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.75rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.card-microloader.active {
  opacity: 1;
}

.checkout-preview-row {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: rgba(11, 19, 41, 0.35);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.code-block {
  display: block;
  margin-top: 0.4rem;
  font-family: ui-monospace, monospace;
  font-size: 0.72rem;
  background: rgba(11, 19, 41, 0.8);
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius-sm);
  color: #9fb0cc;
  overflow-x: auto;
}

@media (max-width: 960px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
  .checkout-card-stage {
    max-width: 320px;
    margin: 0 auto;
  }
}
</style>
