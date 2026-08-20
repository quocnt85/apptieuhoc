---
id: "NS-AI-AGNT-001"
title: "Story & Narrative Agent Contract (ACS)"
domain: "AI"
subdomain: "REGISTRY"
owner: "Lead Narrative Designer"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "HIGH"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["ai", "agent", "story-agent", "narrative", "acs"]
depends_on: ["NS-AI-ACS-001", "NS-EDU-EXPOS-001", "NS-CNT-MOD-001"]
used_by: ["NS-AI-AIPS-001"]
---

# Story & Narrative Agent Contract (`NS-AI-AGNT-001`)

## Purpose
Governs the execution contract, context loading strategy, and output schema for the Story & Narrative Agent, responsible for generating Stage 1 Story Context Objects (`LO-STORY`).

## Context Loading Map

```yaml
context_loading:
  required_pages:
    - "NS-EDU-EXPOS-001" # Experience OS & Emotion Engine
    - "NS-CNT-MOD-001"   # Content Model Architecture
    - "NS-GAM-BIB-001"   # Game Design Bible
  optional_pages:
    - "NS-EDU-COMP-001"  # Competency Framework
  forbidden_pages:
    - "NS-ENG-ARCH-001"  # Technical Architecture
    - "NS-ENG-API-001"   # API Specs
    - "NS-OPS-SOP-001"   # Operations SOP
```

## Agent Output Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "StoryObjectSchema",
  "type": "object",
  "required": ["story_id", "world_setting", "npc_dialogue", "choice_prompt", "options"],
  "properties": {
    "story_id": { "type": "string" },
    "world_setting": { "type": "string" },
    "npc_dialogue": { "type": "string", "maxLength": 150 },
    "choice_prompt": { "type": "string", "maxLength": 100 },
    "options": {
      "type": "array",
      "minItems": 2,
      "maxItems": 3,
      "items": {
        "type": "object",
        "required": ["option_id", "text", "narrative_consequence"],
        "properties": {
          "option_id": { "type": "string" },
          "text": { "type": "string", "maxLength": 60 },
          "narrative_consequence": { "type": "string" }
        }
      }
    }
  }
}
```

## Dependencies & Upstream Links (`depends_on`)
- [Agent Contract Standard (ACS)](file:///Users/thuy/Documents/apptieuhoc/06_AI/acs_standard.md) (`ID: NS-AI-ACS-001`)
- [Experience OS](file:///Users/thuy/Documents/apptieuhoc/03_EDUCATION/experience_os.md) (`ID: NS-EDU-EXPOS-001`)
- [Content Model Architecture](file:///Users/thuy/Documents/apptieuhoc/05_CONTENT/content_model.md) (`ID: NS-CNT-MOD-001`)

## Downstream Impact & Consumers (`used_by`)
- [AI Production System (AIPS)](file:///Users/thuy/Documents/apptieuhoc/06_AI/aips_framework.md) (`ID: NS-AI-AIPS-001`)

## Governance & Metadata
- **Owner:** Lead Narrative Designer
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
