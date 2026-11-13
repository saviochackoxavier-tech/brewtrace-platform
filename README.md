<div align="center">

# ☕ BrewTrace Platform
### *Enterprise-Grade Specialty Coffee Transparency, 3D Payment Automation & Carbon-Offset Ledger*

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/saviochackoxavier-tech/brewtrace-platform/ci.yml?branch=main&style=for-the-badge&logo=github)](https://github.com/saviochackoxavier-tech/brewtrace-platform/actions)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vue 3](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

*An uncompromising blend of direct-trade supply chain verification, zero-trust security auditing, and immersive 3D payment workflows.*

</div>

---

## 🌍 Purpose & Real-World Problem Solving

### The Problem
The global specialty coffee industry suffers from deep opacity:
1. **Greenwashing & Fake Direct-Trade Claims:** Consumers pay premium prices assuming farmers receive fair wages, but supply chain middlemen capture most margins.
2. **Carbon Inefficiencies:** Long-haul logistics and roasting operations lack granular carbon-offset calculations per batch.
3. **Friction & Vulnerability in Digital Checkout:** Traditional e-commerce checkout forms lack tactile, secure micro-interactions and fail to validate card inputs against multi-tenant banking gateways securely.

### The Solution: BrewTrace
BrewTrace bridges the gap between ethical estate farming and high-performance digital commerce by introducing:
* **Verifiable Chain-of-Custody:** Every batch links directly to farmer payout records, elevation data, and harvest timestamps.
* **Automated Carbon Accounting:** Real-time scope emissions calculated and offset per wholesale order.
* **Zero-Data Retention Checkout:** Client-side 3D card embossing engine backed by robust VAPT-audited security pipelines.

---

## 🏛️ System Architecture & Workflow

```mermaid
graph TD
    A[Client Browser / Vue 3 SPA] -->|Client-Side State| B(3D Card Embossing Engine)
    A -->|Batch & Inventory Fetch| C(Vite Edge Dev Server / Static Assets)
    A -->|Audit Validation| D[Python VAPT Script: audit.py]

    subgraph Security & Compliance Layer
        D -->|Checks CSP Headers| E[Zero-Trust Storage]
        D -->|DOMPurify Sanitization| F[Payment Gateway Sandbox]
    end

    C -->|Zero-Config Routing| G[Vercel / Netlify SPA Fallback]
```

<details>
<summary><b>📂 Project Structure</b></summary>

```
brewtrace-platform/
├── .github/workflows/       # CI/CD automation pipelines (ci.yml)
├── docs/                    # Enterprise Legal & Compliance Suite (COMPLIANCE.md)
├── public/                  # Static assets, service workers, and robots.txt
├── scripts/                 # Automated VAPT audits & security scanners (audit.py)
├── server/                  # API routing helpers and middleware mocks
├── src/
│   ├── assets/              # Icons, fonts, and branding graphics
│   ├── components/          # Reusable Vue UI components (Header, Footer, Cards)
│   ├── data/                # Mock inventory, batch data, and pricing logic
│   ├── styles/              # Global CSS, dark-mode variables, and glassmorphism themes
│   ├── tests/               # Automated unit test suite (checkout.spec.js)
│   ├── views/               # Core page views (Home, Dashboard, Checkout, BatchDetails)
│   ├── App.vue              # Root Vue application container
│   └── main.js              # Application entry point
├── static-deploy/           # Zero-config deployment manifests (vercel.json, netlify.toml)
├── .env.example             # Environment variable template
├── index.html               # Main HTML shell
├── package.json             # Node dependencies and build scripts
└── vite.config.js           # Optimized Vite bundler configuration
```
</details>

## 🚀 Getting Started Locally

**Prerequisites**
- Node.js (v18+ recommended)  
- Python 3.10+ (for running security audits)

**Installation & Run**
```bash
git clone https://github.com/saviochackoxavier-tech/brewtrace-platform.git
cd brewtrace-platform
npm install
npm run dev
```

**Build for production:**
```bash
npm run build
```

## 🛡️ Enterprise Security & Auditing (audit.py)
BrewTrace includes an automated Python verification script ensuring strict adherence to zero-trust standards:
- **Content Security Policy (CSP):** Enforced headers preventing XSS and unauthorized script injection.
- **Input Sanitization:** DOMPurify integration across all checkout and inventory fields.
- **Zero Secret Leakage:** Strict environment variable isolation checks.

**Run the audit suite:**
```bash
python3 scripts/audit.py
```

## ⚖️ Legal & Compliance Suite & Visual Workflows

BrewTrace enforces strict digital commerce regulations, zero-data retention security standards, and radical supply chain transparency. Below is a visual walkthrough of our compliance and interface workflows:

### 1. 3D Bank Card Checkout & Multi-Bank Theme Engine
Real-time card embossing workspace supporting multi-tenant banking themes (HDFC, SBI, ICICI, Visa, Mastercard) with strict client-side encryption and zero-server retention. The interactive 3D card layout renders cardholder inputs dynamically while maintaining VAPT-audited sandbox protocols.

![3D Bank Card Checkout & Multi-Bank Theme Engine](https://images.unsplash.com/photo-1556742049-0a67d55362a5?auto=format&fit=crop&w=1200&q=80)

### 2. Direct-Trade Estate Provenance & Carbon Ledger
Granular farm-gate payout tracking coupled with automated scope-emissions calculations per wholesale dispatch. Connecting end-consumers directly with estate elevation data, harvest timestamps, and verified fair-compensation metrics.

![Direct-Trade Estate Provenance & Carbon Ledger](https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80)

### 3. Automated VAPT Security Audit Suite (audit.py)
Continuous static analysis and zero-trust verification pipelines running on every deployment build. Automated verification of Content Security Policy (CSP) headers, DOMPurify sanitization bounds, and environment secret isolation.

![Automated VAPT Security Audit Suite](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80)

## 📄 License

Distributed under the MIT License. See LICENSE for more information.
