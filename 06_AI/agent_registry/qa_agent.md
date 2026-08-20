---
id: "NS-AI-AGNT-004"
title: "QA Verification & Schema Validator Agent Contract (ACS)"
domain: "AI"
subdomain: "REGISTRY"
owner: "Senior QA Lead"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "HIGH"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["ai", "agent", "qa-agent", "validator", "acs"]
depends_on: ["NS-AI-ACS-001", "NS-CNT-MOD-001", "NS-OPS-QA-001"]
used_by: ["NS-AI-AIPS-001"]
---

# QA Verification & Schema Validator Agent Contract (`NS-AI-AGNT-004`)

## Purpose
Governs the execution contract, context loading strategy, and output schema for the QA Verification Agent, responsible for evaluating Gate 1 through Gate 4 audit criteria.

## Context Loading Map

```yaml
context_loading:
  required_pages:
    - "NS-CNT-MOD-001" # Content Model Schemas
    - "NS-OPS-QA-001"  # Automated QA Framework & Rubrics
  optional_pages:
    - "NS-EDU-NLAS-001" # NLAS Framework
  forbidden_pages:
    - "NS-VIS-CORE-001" # Vision
    - "NS-ENG-ARCH-001" # Technical Architecture
```

## Agent Output Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "QAValidationResult",
  "type": "object",
  "required": ["lesson_id", "gate_status", "total_score", "audit_breakdown"],
  "properties": {
    "lesson_id": { "type": "string" },
    "gate_status": { "type": "string", "enum": ["PASSED_GATE_1_4", "FAILED_NEEDS_RETRY"] },
    "total_score": { "type": "number", "minimum": 0, "maximum": 100 },
    "audit_breakdown": {
      "type": "object",
      "required": ["schema_score", "readability_score", "pedagogy_score", "fun_score"],
      "properties": {
        "schema_score": { "type": "number" },
        "readability_score": { "type": "number" },
        "pedagogy_score": { "type": "number" },
        "fun_score": { "type": "number" }
      }
    }
  }
}
```

## Dependencies & Upstream Links (`depends_on`)
- [Agent Contract Standard (ACS)](file:///Users/thuy/Documents/apptieuhoc/06_AI/acs_standard.md) (`ID: NS-AI-ACS-001`)
- [Automated QA Framework](file:///Users/thuy/Documents/apptieuhoc/08_OPERATIONS/qa_framework.md) (`ID: NS-OPS-QA-001`)

## Governance & Metadata
- **Owner:** Senior QA Lead
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
