# NovaStars Operating System (NovaStars OS) v2.0
**The AI-Native Single Source of Truth (SSOT) & Web-First EdTech Platform**

Welcome to **NovaStars OS**, the constitutional, AI-native Knowledge Operating System governing the entire NovaStars ecosystem across Product, Education, Game Design, AI Systems, Software Engineering, Content Production, and Operations.

---

## 🌟 Live Production Links

- 🌐 **Web App Live (Cloudflare Pages)**: [https://novastars-app.pages.dev](https://novastars-app.pages.dev)
- ⚡ **Serverless API (Cloudflare Workers)**: [https://novastars-api.novastar-8c7.workers.dev](https://novastars-api.novastar-8c7.workers.dev)
- 📦 **GitHub Repository**: [https://github.com/quocnt85/apptieuhoc](https://github.com/quocnt85/apptieuhoc)

---

## 🚀 Tech Stack v2.0 (Modern Serverless & Edge-First)

- **Frontend & App Shell**: React 18/19, TypeScript, Vite, Tailwind CSS, Zustand.
- **Gameplay & Interaction**: HTML5 Canvas 2D (60 FPS), Web Audio API Synthesizer, 10-Stage Universal Lesson Runner.
- **Mobile Container**: Capacitor v6 (Biên dịch trực tiếp sang iOS & Android native app).
- **Database & Auth**: Neon Serverless PostgreSQL (`@neondatabase/serverless`) & Neon Auth.
- **Hosting & Compute**: Cloudflare Pages (Web CDN) + Cloudflare Workers (Serverless API Layer).
- **Object Storage**: Cloudflare R2 Storage (Lưu trữ bài học JSON và media assets không tốn phí egress).

---

## 🧭 System Quick Links

- 🗺️ **[System Architecture Map](file:///00_HOME/architecture_map.md)** (`NS-HOM-MAP-001`)
- 📜 **[Architecture Decision Records (ADR Index)](file:///11_ADR/adr_index.md)** (`NS-ADR-INDX-001`)
- ⚙️ **[Technical Platform Architecture](file:///07_ENGINEERING/technical_architecture.md)** (`NS-ENG-ARCH-001`)
- 📚 **[Central Master Glossary](file:///10_GLOSSARY/master_glossary.md)** (`NS-GLO-MAST-001`)

---

## 📂 Repository Topology

| Folder | Purpose | Canonical Master Spec |
| :--- | :--- | :--- |
| `client/` | React 19 + Vite Web & Mobile Shell App (Capacitor) | [Client Readme](file:///client/README_MOBILE.md) |
| `server/` | Cloudflare Workers API & Cloudflare R2 Bindings | [Wrangler Config](file:///server/wrangler.toml) |
| `scripts/` | Database DDL schema & seed scripts for Neon PostgreSQL | [Schema SQL](file:///scripts/db/schema.sql) |
| `00_HOME/` | Navigation, Dashboard, & System Health | [Index](file:///00_HOME/index.md) |
| `01_VISION/` | Product Vision, Mission, & Strategic OKRs | [Product Philosophy](file:///01_VISION/product_philosophy.md) |
| `02_PRODUCT/` | Product Foundation & Modular Feature Catalog | [Product Foundation](file:///02_PRODUCT/product_foundation.md) |
| `03_EDUCATION/`| Competency Framework, Experience OS & NLAS | [Competency Framework](file:///03_EDUCATION/competency_framework.md) |
| `04_GAME/` | Game Design Bible, Loops, & Economy | [Game Design Bible](file:///04_GAME/game_design_bible.md) |
| `05_CONTENT/` | Content Model & Schemas | [Content Model](file:///05_CONTENT/content_model.md) |
| `06_AI/` | AIPS, Agent Contracts (ACS), & AIOB Blueprint | [ACS Standard](file:///06_AI/acs_standard.md) |
| `07_ENGINEERING/`| Technical Architecture & Data Schemas | [Tech Architecture](file:///07_ENGINEERING/technical_architecture.md) |
| `08_OPERATIONS/` | Content Production SOP & Quality Review Gates | [Content SOP](file:///08_OPERATIONS/content_factory_sop.md) |
| `10_GLOSSARY/` | Central Master Term Dictionary | [Master Glossary](file:///10_GLOSSARY/master_glossary.md) |
| `11_ADR/` | Architecture Decision Records | [ADR Index](file:///11_ADR/adr_index.md) |

---

## 🛠️ Quick Start (Phát triển cục bộ)

```bash
# 1. Khởi chạy Web App
cd client
npm install
npm run dev

# 2. Đóng gói Mobile với Capacitor
npm run build
npx cap sync
npx cap open android # Mở Android Studio
```
