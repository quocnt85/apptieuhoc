---
id: "NS-AI-ACS-001"
title: "NovaStars AI Agent Contract Standard (ACS)"
domain: "AI"
subdomain: "ACS"
owner: "Lead AI Engineer"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "CRITICAL"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["ai", "acs", "agent-contract", "specification", "schema"]
depends_on: ["NS-AI-AIPS-001"]
used_by: ["NS-AI-AIOB-001", "NS-AI-AGNT-001", "NS-AI-AGNT-002", "NS-AI-AGNT-003"]
---

# NovaStars AI Agent Contract Standard (ACS)

## Purpose
The universal standard specifying the definition, context boundaries, input/output schemas, test suites, and execution contracts for every AI Agent in the NovaStars AI Production System.

## Scope
Governs all 100+ AI agents across Narrative, Assessment, Game Mechanics, Engineering, and QA domains.

## Standard ACS File Specification Structure

Every Agent Contract file in `06_AI/agent_registry/` MUST contain:

```yaml
agent_contract:
  id: "NS-AI-AGNT-XXX"
  name: "Agent Name"
  role: "Agent System Role Description"
  version: "1.0.0"
  model_tier: "PRO" # Options: FLASH_LITE, FLASH, PRO
  
context_loading:
  required_pages:
    - "NS-XXX-001"
  optional_pages:
    - "NS-YYY-001"
  forbidden_pages:
    - "NS-ZZZ-001"

inputs:
  schema: "JSON / Zod Schema for task input"

outputs:
  schema: "JSON / Zod Schema for agent output"

quality_rubric:
  metrics:
    - name: "Schema Validity"
      weight: 0.4
    - name: "Grade Readability"
      weight: 0.3
    - name: "Pedagogical Alignment"
      weight: 0.3
```

## Mandatory Contract Constraints
1. **Context Boundary Enforcement**: An agent MUST NOT load pages listed in its `forbidden_pages` matrix.
2. **Schema Output Mandate**: Every agent response MUST parse strictly against its defined output JSON schema. Non-parsing outputs trigger an automatic retry.
3. **Deterministic Versioning**: Agent Contract versions follow SemVer. Breaking changes require major version increment (`X.0.0`).

## Dependencies & Upstream Links (`depends_on`)
- [AI Production System (AIPS)](file:///Users/thuy/Documents/apptieuhoc/06_AI/aips_framework.md) (`ID: NS-AI-AIPS-001`)

## Downstream Impact & Consumers (`used_by`)
- [AI Organization Blueprint (AIOB)](file:///Users/thuy/Documents/apptieuhoc/06_AI/aiob_blueprint.md) (`ID: NS-AI-AIOB-001`)
- All Agent Contract files in `06_AI/agent_registry/`.

## Governance & Metadata
- **Owner:** Lead AI Engineer
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
