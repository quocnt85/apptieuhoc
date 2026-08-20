---
id: "NS-HOM-MAP-001"
title: "NovaStars OS System Architecture Map"
domain: "HOME"
subdomain: "ARCHITECTURE"
owner: "Chief Knowledge Architect"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "CRITICAL"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["home", "architecture", "map", "topology"]
depends_on: ["NS-HOM-INDX-001"]
used_by: ["NS-HOM-STAT-001"]
---

# NovaStars OS System Architecture Map

## Purpose
Provides a visual, graph-based topological representation of NovaStars OS, mapping directional data and dependency flow across Vision, Product, Education, Game, Content, AI, Engineering, Operations, Glossary, and ADR domains.

## Scope
Covers system-wide document linkages and knowledge propagation pathways.

## High-Level Topology Map

```mermaid
graph TD
    VISION[01_VISION: Product Vision & Strategy] --> PRODUCT[02_PRODUCT: Product Foundation]
    PRODUCT --> EDU[03_EDUCATION: Competencies, Experience OS & NLAS]
    PRODUCT --> GAME[04_GAME: Game Design Bible & Loops]
    EDU --> EXPOS[03_EDUCATION: Experience OS State Transformation]
    EXPOS --> GAME
    EDU --> CONTENT[05_CONTENT: Content Model & Schemas]
    GAME --> CONTENT
    CONTENT --> AI[06_AI: AIPS, ACS Contracts & AIOB Blueprint]
    CONTENT --> ENG[07_ENGINEERING: Technical Stack & CMS Specs]
    AI --> OPS[08_OPERATIONS: Content SOP & Quality Review Gates]
    ENG --> OPS
    GLOSSARY[10_GLOSSARY: Master Glossary] -. Cross-Cuts .-> VISION & PRODUCT & EDU & GAME & CONTENT & AI & ENG & OPS
    ADR[11_ADR: Architecture Decision Records] -. Governs .-> PRODUCT & EDU & GAME & AI & ENG
```

## Domain Flow Explanation
1. **Strategic Intent (`01_VISION` & `02_PRODUCT`)**: Establishes pedagogical goals and user experience boundaries.
2. **Pedagogical & Engagement Engine (`03_EDUCATION` & `04_GAME`)**: Defines learning mastery models and fun gameplay loops.
3. **Data Contracting (`05_CONTENT`)**: Translates education and game rules into machine-readable JSON/Zod schemas.
4. **Autonomous Production & Tech Execution (`06_AI` & `07_ENGINEERING`)**: Executes prompt pipelines and client app rendering.
5. **Quality Assurance & Distribution (`08_OPERATIONS`)**: Verifies content through 5 Review Gates before release.

## Dependencies & Upstream Links (`depends_on`)
- [Master Navigation Portal](file:///Users/thuy/Documents/apptieuhoc/00_HOME/index.md) (`ID: NS-HOM-INDX-001`)

## Governance & Metadata
- **Owner:** Chief Knowledge Architect
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
