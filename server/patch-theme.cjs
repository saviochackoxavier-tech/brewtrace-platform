// Obsidian-Glass & Neon Cyan theme patch for the 3D bank card checkout.
// Extends global.css with frosted-glass depth layers, micro-haptic CSS
// transitions, and a subtle glowing grid border over the 3D card stage.
const fs = require('fs');
const path = require('path');

const p = path.resolve(__dirname, '..', 'src', 'styles', 'global.css');
let s = fs.readFileSync(p, 'utf8');

const addition = `
/* ── Obsidian-Glass & Neon Cyan theme ────────────────────────────────────── */
:root {
  --obs-cyan: #22d3ee;
  --obs-cyan-soft: rgba(34, 211, 238, 0.16);
  --obs-cyan-glow: rgba(34, 211, 238, 0.55);
  --obs-obsidian: #0b1329;
  --obs-obsidian-2: #070f22;
  --obs-surface: rgba(19, 32, 71, 0.72);
  --obs-elevated: rgba(25, 42, 90, 0.88);
  --obs-border: rgba(34, 211, 238, 0.24);
  --obs-border-strong: rgba(34, 211, 238, 0.45);
  --obs-text: #f2f6fc;
  --obs-muted: #7d8ba3;
  --obs-glow-neon: rgba(34, 211, 238, 0.45);
}

/* Obsidian-glass glassmorphism depth layers */
.o-glass {
  background: var(--obs-surface);
  border: 1px solid var(--obs-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(18px);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.o-glass--elevated {
  background: var(--obs-elevated);
  border-color: var(--obs-border-strong);
  box-shadow:
    0 28px 70px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.o-glass--neon {
  background: var(--obs-elevated);
  border-color: var(--obs-neon-border);
  box-shadow:
    0 28px 70px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 0 0 1px var(--obs-neon-border),
    0 0 28px var(--obs-neon-glow);
}

/* Glowing grid border utility */
.grid-border {
  position: relative;
  background: var(--obs-surface);
  border: 1px solid var(--obs-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.grid-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  background-image:
    linear-gradient(rgba(34, 211, 238, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.045) 1px, transparent 1px);
  background-size: 32px 32px;
  mask: linear-gradient(#fff 0%, transparent 0%);
  pointer-events: none;
}

.grid-border::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  box-shadow: inset 0 0 40px rgba(34, 211, 238, 0.08);
}

/* Neon cyan micro-haptic transition + glow pulse */
.neon-glow,
.o-glass,
.checkout-card-stage {
  transition: box-shadow 0.18s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.18s ease,
              background 0.18s ease;
}

.neon-glow:hover,
.o-glass:hover,
.checkout-card-stage:hover {
  box-shadow:
    0 0 24px var(--obs-glow-neon),
    0 8px 26px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* micro-haptic press feedback */
.neon-glow:active,
.o-glass:active,
.checkout-card-stage:active {
  transform: scale(0.994);
  box-shadow:
    0 0 10px var(--obs-glow-neon),
    0 2px 12px rgba(0, 0, 0, 0.35);
}

/* focused input micro-haptic */
.field input:focus {
  outline: none;
  border-color: var(--obs-cyan);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.25);
}

/* 3D card stage glowing grid override */
.checkout-card-stage .grid-border {
  border-radius: var(--radius-lg);
}

.checkout-card-stage .grid-border::before {
  background-image:
    linear-gradient(rgba(34, 211, 238, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
}

/* bank theme neon accents */
.card.bank-hdfc,
.card.bank-sbi,
.card.bank-icici,
.card.bank-visa,
.card.bank-mastercard {
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.card.bank-hdfc .card-logo,
.card.bank-sbi .card-logo,
.card.bank-icici .card-logo,
.card.bank-visa .card-logo,
.card.bank-mastercard .card-logo {
  color: var(--obs-cyan);
}
.card .card-series {
  color: var(--obs-text);
  text-shadow: 0 0 10px var(--obs-glow-neon);
}
.card .card-holder {
  color: var(--obs-muted);
}

/* micro-loading spinner neon pulse */
.card-microloader .spinner {
  border-top-color: var(--obs-cyan);
  border-color: rgba(34, 211, 238, 0.22);
  animation-duration: 0.7s;
}
.card-microloader .loader-label {
  color: var(--obs-muted);
  letter-spacing: 0.14em;
}

/* Neon cyan border accent for the card-embed container */
.card-embed {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.card-embed::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--obs-cyan) 0%, rgba(34, 211, 238, 0.6) 50%, var(--obs-cyan) 100%);
  mask: linear-gradient(#fff 0%, transparent 100%);
  -webkit-mask: linear-gradient(#fff 0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}

.card-embed > * {
  position: relative;
  z-index: 1;
}

/* tactile micro-haptic transition on the payment action */
.pay-btn {
  transition: transform 0.14s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.2s ease;
}

.pay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(34, 211, 238, 0.4);
}

.pay-btn:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 12px rgba(34, 211, 238, 0.25);
}

/* Neo-grid divider for compliance panels */
.grid-divider {
  position: relative;
  overflow: hidden;
}

.grid-divider::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}
`;

fs.writeFileSync(p, s + addition);
console.log('global.css patched with Obsidian-Glass & Neon Cyan theme');
