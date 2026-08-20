---
id: "NS-AI-AGNT-002"
title: "Boss & Challenge Agent Contract (ACS)"
domain: "AI"
subdomain: "REGISTRY"
owner: "Lead Game Designer"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "HIGH"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["ai", "agent", "boss-agent", "gameplay", "acs"]
depends_on: ["NS-AI-ACS-001", "NS-GAM-BIB-001", "NS-CNT-MOD-001"]
used_by: ["NS-AI-AIPS-001"]
---

# Boss & Challenge Agent Contract (`NS-AI-AGNT-002`)

## Purpose
Governs the execution contract, context loading strategy, and output schema for the Boss & Challenge Agent, responsible for generating Stage 3 Mini-Boss Objects (`LO-BOSS`).

## Context Loading Map

```yaml
context_loading:
  required_pages:
    - "NS-GAM-BIB-001" # Game Design Bible
    - "NS-CNT-MOD-001" # Content Model Architecture
  optional_pages:
    - "NS-EDU-COMP-001" # Competency Framework Rubric
  forbidden_pages:
    - "NS-VIS-CORE-001" # Vision
    - "NS-ENG-CMS-001"  # CMS Specs
```

## Dependencies & Upstream Links (`depends_on`)
- [Agent Contract Standard (ACS)](file:///Users/thuy/Documents/apptieuhoc/06_AI/acs_standard.md) (`ID: NS-AI-ACS-001`)
- [Game Design Bible](file:///Users/thuy/Documents/apptieuhoc/04_GAME/game_design_bible.md) (`ID: NS-GAM-BIB-001`)

## Downstream Impact & Consumers (`used_by`)
- [AI Production System (AIPS)](file:///Users/thuy/Documents/apptieuhoc/06_AI/aips_framework.md) (`ID: NS-AI-AIPS-001`)

## Governance & Metadata
- **Owner:** Lead Game Designer
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
