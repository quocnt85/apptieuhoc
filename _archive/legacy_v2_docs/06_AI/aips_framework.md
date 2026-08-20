---
id: "NS-AI-AIPS-001"
title: "NovaStars AI Production System (AIPS) Blueprint"
domain: "AI"
subdomain: "AIPS"
owner: "AI System Architect"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "CRITICAL"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["ai", "aips", "production-system", "factory", "multi-agent"]
depends_on: ["NS-CNT-MOD-001", "NS-EDU-NLAS-001"]
used_by: ["NS-AI-ACS-001", "NS-AI-AIOB-001", "NS-OPS-SOP-001"]
---

# NovaStars AI Production System (AIPS) Blueprint

## Purpose
AIPS governs how specialized AI agent teams and human domain experts collaborate to produce, review, freeze, publish, and continuously improve 10,000+ competency-based learning experiences at scale.

## Scope
Defines agent pipeline orchestration, human-in-the-loop gates, automated schema validation, and prompt pipeline execution.

## AIPS Multi-Agent Production Pipeline

```mermaid
graph TD
    A[Orchestrator Agent] --> B[Story Agent: Generate LO-STORY]
    B --> C[Exploration Agent: Generate LO-EXPLORE]
    C --> D[Boss Agent: Generate LO-BOSS]
    D --> E[Reflection Agent: Generate LO-REFL]
    E --> F[Schema Validator Agent]
    F --> G[Pedagogical QA Agent]
    G --> H{Pass Gate 1-4?}
    H -- Yes --> I[Human Editor Final Review Gate 5]
    H -- No --> B
    I -- Approved --> J[Freeze & Publish to CMS]
```

## Core Production Pillars
1. **Multi-Agent Specialization**: Rather than one monolithic LLM call, specialized agents handle distinct stages (Story, Puzzle, Boss, QA).
2. **Schema-Enforced Generation**: All agent output is parsed against Zod / JSON schemas defined in [Content Model](file:///Users/thuy/Documents/apptieuhoc/05_CONTENT/content_model.md).
3. **Deterministic Review Gates**: 4 automated AI review gates + 1 human domain lead gate ensure 100% safety and pedagogical accuracy.

## Dependencies & Upstream Links (`depends_on`)
- [Content Model Architecture](file:///Users/thuy/Documents/apptieuhoc/05_CONTENT/content_model.md) (`ID: NS-CNT-MOD-001`)
- [Lesson Architecture System (NLAS)](file:///Users/thuy/Documents/apptieuhoc/03_EDUCATION/nlas_framework.md) (`ID: NS-EDU-NLAS-001`)

## Downstream Impact & Consumers (`used_by`)
- [Agent Contract Standard (ACS)](file:///Users/thuy/Documents/apptieuhoc/06_AI/acs_standard.md) (`ID: NS-AI-ACS-001`)
- [AI Organization Blueprint (AIOB)](file:///Users/thuy/Documents/apptieuhoc/06_AI/aiob_blueprint.md) (`ID: NS-AI-AIOB-001`)
- [Content Factory SOP](file:///Users/thuy/Documents/apptieuhoc/08_OPERATIONS/content_factory_sop.md) (`ID: NS-OPS-SOP-001`)

## Governance & Metadata
- **Owner:** AI System Architect
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
