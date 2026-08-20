---
id: "NS-AI-AGNT-003"
title: "Assessment & Evidence Agent Contract (ACS)"
domain: "AI"
subdomain: "REGISTRY"
owner: "Lead Assessment Specialist"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "HIGH"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["ai", "agent", "assessment-agent", "evidence", "acs"]
depends_on: ["NS-AI-ACS-001", "NS-EDU-COMP-001", "NS-CNT-MOD-001"]
used_by: ["NS-AI-AIPS-001"]
---

# Assessment & Evidence Agent Contract (`NS-AI-AGNT-003`)

## Purpose
Governs the execution contract, context loading strategy, and output schema for the Assessment & Evidence Agent, responsible for generating evidence rubrics, diagnostic feedback, and distractor items.

## Context Loading Map

```yaml
context_loading:
  required_pages:
    - "NS-EDU-COMP-001" # Competency Framework
    - "NS-CNT-MOD-001"   # Content Model Architecture
  optional_pages:
    - "NS-EDU-NLAS-001"  # NLAS Framework
  forbidden_pages:
    - "NS-GAM-BIB-001"   # Game Economy Rules
    - "NS-ENG-ARCH-001"  # Technical Platform Architecture
```

## Dependencies & Upstream Links (`depends_on`)
- [Agent Contract Standard (ACS)](file:///Users/thuy/Documents/apptieuhoc/06_AI/acs_standard.md) (`ID: NS-AI-ACS-001`)
- [Competency Framework](file:///Users/thuy/Documents/apptieuhoc/03_EDUCATION/competency_framework.md) (`ID: NS-EDU-COMP-001`)

## Downstream Impact & Consumers (`used_by`)
- [AI Production System (AIPS)](file:///Users/thuy/Documents/apptieuhoc/06_AI/aips_framework.md) (`ID: NS-AI-AIPS-001`)

## Governance & Metadata
- **Owner:** Lead Assessment Specialist
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
