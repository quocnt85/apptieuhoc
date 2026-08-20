---
id: "NS-AI-AGNT-005"
title: "Pipeline Orchestrator Agent Contract (ACS)"
domain: "AI"
subdomain: "REGISTRY"
owner: "AI System Architect"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "CRITICAL"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["ai", "agent", "orchestrator-agent", "pipeline", "acs"]
depends_on: ["NS-AI-ACS-001", "NS-AI-AIPS-001", "NS-AI-AIOB-001"]
used_by: ["NS-AI-AIPS-001"]
---

# Pipeline Orchestrator Agent Contract (`NS-AI-AGNT-005`)

## Purpose
Governs the execution contract, context loading strategy, and task dispatch protocols for the Pipeline Orchestrator Agent, responsible for coordinating the multi-agent production lifecycle.

## Context Loading Map

```yaml
context_loading:
  required_pages:
    - "NS-AI-AIPS-001" # AIPS Blueprint
    - "NS-AI-AIOB-001" # AIOB Blueprint
    - "NS-AI-ACS-001"  # ACS Standard
  optional_pages:
    - "NS-OPS-SOP-001" # Operations SOP
  forbidden_pages:
    - "NS-ENG-ARCH-001" # Technical Platform Architecture
```

## Dependencies & Upstream Links (`depends_on`)
- [Agent Contract Standard (ACS)](file:///Users/thuy/Documents/apptieuhoc/06_AI/acs_standard.md) (`ID: NS-AI-ACS-001`)
- [AIPS Blueprint](file:///Users/thuy/Documents/apptieuhoc/06_AI/aips_framework.md) (`ID: NS-AI-AIPS-001`)

## Governance & Metadata
- **Owner:** AI System Architect
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
