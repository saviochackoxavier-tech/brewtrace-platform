# BrewTrace — Legal & Compliance Suite

This document defines the enterprise-grade legal and compliance posture for
BrewTrace, covering Terms of Service, a zero-retention Privacy Policy for
cardholder payment fields, and the Direct-Trade Ethical Disclosure standard.

---

## 1. Terms of Service

### 1.1 Fair Use
- BrewTrace is provided for lawful evaluation, onboarding, and wholesale
  ordering by qualified buyers. All usage is subject to fair-use limits.
- Users may not scrape, reverse-engineer, or automate abuse of the
  checkout or audit endpoints at a rate that degrades platform integrity.

### 1.2 Wholesale SLAs
- Wholesale orders must reference a valid batch ID and a direct-trade
  provenance record.
- Delivery SLAs are defined per-estate: 14 business days standard,
  7 business days expedited (minimum order threshold applies).
- Payment must be settled via the 3D gateway before shipment is released.

### 1.3 Liability Limitations
- BrewTrace does not insure beans, equipment, or landed logistics.
- Seller liability is limited to the purchase price of the disputed batch.
- The platform is not liable for third-party data breaches caused by the
  buyer's own storage configuration or API key management.

---

## 2. Privacy Policy — Zero Data Retention

### 2.1 Zero Retention Guarantee
- The checkout flow collects no persistent cardholder data on the server.
- Cardholder fields are processed exclusively in memory and discarded
  immediately after the gateway acknowledgment.
- No payment, CVV, or full card number is written to any database,
  logs, or analytics pipeline.

### 2.2 Local-First Encryption
- Card fields are encrypted at rest in the browser session using a
  per-session key derived from `VITE_SECURITY_SALT`.
- Encryption keys are never persisted to disk, IndexedDB, or any remote
  store; they exist only in ephemeral memory.

### 2.3 Data Lifecycle
- All client-side payment data is purged on page unload, session close,
  and after a successful or failed gateway transaction.
- Only non-sensitive transaction metadata (batch ID, order ref, outcome)
  is retained, and only for the duration of the active session.

---

## 3. Direct-Trade Ethical Disclosure Standard

### 3.1 Certified Fair Compensation
- Each batch publishes a certified breakdown: estate price, logistics
  surcharge, milling, roaster margin (capped), and farmer payout.
- The farmer payout share must meet or exceed the platform's certified
  direct-trade floor.

### 3.2 Chain-of-Custody Provenance
- Every batch links to farm elevation, harvest timestamp, and verified
  payout records, making greenwashing impossible to claim.

### 3.3 Carbon-Offset Ledger
- Scope 1/2/3 emissions per batch are calculated in real time and
  offset via the carbon ledger before the order is confirmed.

---

## 4. Execution

Run the compliance suite locally with:

```bash
python3 scripts/audit.py
```

All four VAPT checks must pass (CSP, DOMPurify sanitization, secret
isolation, zero client-side data retention) before any production deploy.
