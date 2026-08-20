---
id: "NS-GLO-MAST-001"
title: "NovaStars Central Master Glossary & Term Taxonomy"
domain: "GLOSSARY"
subdomain: "MASTER"
owner: "Chief Knowledge Architect"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "CRITICAL"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["glossary", "terms", "taxonomy", "definitions", "dictionary"]
depends_on: []
used_by: ["NS-HOM-INDX-001"]
---

# NovaStars Central Master Glossary & Term Taxonomy

## Purpose
The single source of truth for all domain terminology, technical definitions, and anti-pattern warnings across NovaStars. Every concept is defined exactly once.

## Governance Rule
No other Markdown document in NovaStars OS may define a term inline; all documents MUST cross-reference this Master Glossary.

---

## Terms & Taxonomy

### Agent Contract Standard (ACS) (`TERM-AI-001`)
- **Canonical Definition:** The universal specification governing the system role, model selection, context loading rules, input/output JSON schemas, and quality rubrics for an AI Agent.
- **Domain:** AI Systems
- **Canonical Reference:** [ACS Standard](file:///Users/thuy/Documents/apptieuhoc/06_AI/acs_standard.md) (`ID: NS-AI-ACS-001`)
- **Anti-Pattern:** Do NOT confuse with an AI Prompt Template (which is a specific prompt string).

### AI Production System (AIPS) (`TERM-AI-002`)
- **Canonical Definition:** The multi-agent production factory and workflow engine that orchestrates AI agents and human editors to produce competency-based lessons at scale.
- **Domain:** AI Systems
- **Canonical Reference:** [AIPS Framework](file:///Users/thuy/Documents/apptieuhoc/06_AI/aips_framework.md) (`ID: NS-AI-AIPS-001`)

### Boss Challenge (`TERM-GAM-001`)
- **Canonical Definition:** A multi-step synthesis challenge at Stage 3 of an NLAS lesson that evaluates cumulative competency mastery through interactive mini-game mechanics.
- **Domain:** Game Design / Pedagogy
- **Canonical Reference:** [Game Design Bible](file:///Users/thuy/Documents/apptieuhoc/04_GAME/game_design_bible.md) (`ID: NS-GAM-BIB-001`)
- **Anti-Pattern:** Do NOT use for basic multiple-choice quizzes in Stage 2.

### Competency Package (`TERM-EDU-001`)
- **Canonical Definition:** A structured module of 5-8 atomic competencies forming a complete learning milestone or unit.
- **Domain:** Education
- **Canonical Reference:** [Competency Framework](file:///Users/thuy/Documents/apptieuhoc/03_EDUCATION/competency_framework.md) (`ID: NS-EDU-COMP-001`)

### Experience OS (`TERM-EDU-002`)
- **Canonical Definition:** The framework modeling child learning psychology, emotional curves, curiosity engines, and 4-phase child state transformations.
- **Domain:** Education
- **Canonical Reference:** [Experience OS](file:///Users/thuy/Documents/apptieuhoc/03_EDUCATION/experience_os.md) (`ID: NS-EDU-EXPOS-001`)

### Freeze Gate (`TERM-OPS-001`)
- **Canonical Definition:** The formal approval state (Gate 1 through Gate 5) that locks a lesson package or specification from further modification prior to production release.
- **Domain:** Operations
- **Canonical Reference:** [Content Factory SOP](file:///Users/thuy/Documents/apptieuhoc/08_OPERATIONS/content_factory_sop.md) (`ID: NS-OPS-SOP-001`)

### NovaStars Lesson Architecture System (NLAS) (`TERM-EDU-003`)
- **Canonical Definition:** The constitutional instructional operating system defining the 4-Stage lesson flow (Hook, Exploration, Boss, Reflection).
- **Domain:** Education
- **Canonical Reference:** [NLAS Framework](file:///Users/thuy/Documents/apptieuhoc/03_EDUCATION/nlas_framework.md) (`ID: NS-EDU-NLAS-001`)

---

## Dependencies & Upstream Links (`depends_on`)
None (Root Term Dictionary).

## Governance & Metadata
- **Owner:** Chief Knowledge Architect
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
