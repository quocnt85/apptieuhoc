# NovaStars Operating System (NovaStars OS) v1.0
**The AI-Native Single Source of Truth (SSOT) Knowledge Operating System**

Welcome to **NovaStars OS**, the constitutional, AI-native Knowledge Operating System governing the entire NovaStars ecosystem across Product, Education, Game Design, AI Systems, Software Engineering, Content Production, and Operations.

---

## 🌟 Quick Links

- 🧭 **[Master Navigation Portal](file:///Users/thuy/Documents/apptieuhoc/00_HOME/index.md)** (`NS-HOM-INDX-001`)
- 🗺️ **[System Architecture Map](file:///Users/thuy/Documents/apptieuhoc/00_HOME/architecture_map.md)** (`NS-HOM-MAP-001`)
- 📖 **[Table of Contents (SUMMARY.md)](file:///Users/thuy/Documents/apptieuhoc/SUMMARY.md)**
- ⚙️ **[System Manifest (SYSTEM.md)](file:///Users/thuy/Documents/apptieuhoc/SYSTEM.md)**
- 📚 **[Central Master Glossary](file:///Users/thuy/Documents/apptieuhoc/10_GLOSSARY/master_glossary.md)** (`NS-GLO-MAST-001`)
- 📜 **[Architecture Decision Records (ADR Index)](file:///Users/thuy/Documents/apptieuhoc/11_ADR/adr_index.md)** (`NS-ADR-INDX-001`)

---

## 🚀 Design Philosophy

NovaStars OS is built on 6 core architectural principles inspired by modern AI-native engineering:

1. **AI First**: Machine-parsable metadata (YAML Front Matter), deterministic tags, and explicit type constraints for RAG and context engineering.
2. **Atomic Knowledge**: Every concept has exactly one canonical file. No duplicate definitions.
3. **Modular Structure**: Minimal inter-file coupling, clear boundaries.
4. **Linked Knowledge**: Explicit Directed Acyclic Graph (DAG) cross-referencing upstream dependencies (`depends_on`) and downstream consumers (`used_by`).
5. **Single Source of Truth (SSOT)**: Every rule, model, or schema exists in one canonical location.
6. **Context Window Optimization**: Token-efficient headers and precise semantic chunking for LLM agent execution.

---

## 📂 Repository Topology

| Folder | Purpose | Canonical Master Spec |
| :--- | :--- | :--- |
| `00_HOME/` | Navigation, Dashboard, & System Health | [Index](file:///Users/thuy/Documents/apptieuhoc/00_HOME/index.md) |
| `01_VISION/` | Product Vision, Mission, & Strategic OKRs | [Product Philosophy](file:///Users/thuy/Documents/apptieuhoc/01_VISION/product_philosophy.md) |
| `02_PRODUCT/` | Product Foundation & Modular Feature Catalog | [Product Foundation](file:///Users/thuy/Documents/apptieuhoc/02_PRODUCT/product_foundation.md) |
| `03_EDUCATION/`| Competency Framework, Experience OS & NLAS | [Competency Framework](file:///Users/thuy/Documents/apptieuhoc/03_EDUCATION/competency_framework.md) |
| `04_GAME/` | Game Design Bible, Loops, & Economy | [Game Design Bible](file:///Users/thuy/Documents/apptieuhoc/04_GAME/game_design_bible.md) |
| `05_CONTENT/` | Content Model & Schemas | [Content Model](file:///Users/thuy/Documents/apptieuhoc/05_CONTENT/content_model.md) |
| `06_AI/` | AIPS, Agent Contracts (ACS), & AIOB Blueprint | [ACS Standard](file:///Users/thuy/Documents/apptieuhoc/06_AI/acs_standard.md) |
| `07_ENGINEERING/`| Technical Architecture & Data Schemas | [Tech Architecture](file:///Users/thuy/Documents/apptieuhoc/07_ENGINEERING/technical_architecture.md) |
| `08_OPERATIONS/` | Content Production SOP & Quality Review Gates | [Content SOP](file:///Users/thuy/Documents/apptieuhoc/08_OPERATIONS/content_factory_sop.md) |
| `09_LIBRARY/` | Markdown Templates & Design Tokens | Standard Templates |
| `10_GLOSSARY/` | Central Master Term Dictionary | [Master Glossary](file:///Users/thuy/Documents/apptieuhoc/10_GLOSSARY/master_glossary.md) |
| `11_ADR/` | Architecture Decision Records | [ADR Index](file:///Users/thuy/Documents/apptieuhoc/11_ADR/adr_index.md) |

---

## 🛠️ Governance & Quality Enforcement

All Markdown documents are validated by automated CI/CD checks:
- **YAML Front Matter Validation** (`lint_yaml`)
- **Relative Link & Anchor Verification** (`check_links`)
- **Bidirectional Reference Symmetry** (`check_dependencies`)
- **Orphan Page Detection** (`detect_orphans`)

---

*NovaStars OS v1.0 — Permanent Knowledge Architecture for NovaStars Ecosystem.*
