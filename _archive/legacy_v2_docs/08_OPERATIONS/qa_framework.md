---
id: "NS-OPS-QA-001"
title: "NovaStars Automated Quality Assurance Framework & Rubrics"
domain: "OPERATIONS"
subdomain: "QA"
owner: "Senior QA Lead"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "CRITICAL"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["operations", "qa", "quality-assurance", "rubrics", "testing"]
depends_on: ["NS-OPS-SOP-001"]
used_by: ["NS-OPS-SOP-001"]
---

# NovaStars Automated Quality Assurance Framework & Rubrics

## Purpose
Defines the scoring algorithms, validation rubrics, and automated test suits executed during Gate 1 through Gate 4 of the Content Production Factory.

## Quality Scoring Rubric (100-Point Scale)

| Audit Criterion | Gate Evaluator | Weight | Pass Threshold |
| :--- | :--- | :--- | :--- |
| **JSON Schema Conformance** | Gate 1 (Automated) | 30 Points | 30/30 (Strict Match) |
| **Grade Readability & Tone** | Gate 2 (Automated) | 20 Points | ≥18 Points (Flesch-Kincaid) |
| **Pedagogical Alignment** | Gate 3 (Automated) | 25 Points | ≥22 Points |
| **Game Balance & Choices** | Gate 4 (Automated) | 25 Points | ≥20 Points |

## Automated Test Scripts
- `validate_schema.js`: Checks JSON against Zod schemas.
- `audit_readability.py`: Evaluates word length and readability indices.
- `verify_links.py`: Scans relative links and cross-references.

## Dependencies & Upstream Links (`depends_on`)
- [Content Factory SOP](file:///Users/thuy/Documents/apptieuhoc/08_OPERATIONS/content_factory_sop.md) (`ID: NS-OPS-SOP-001`)

## Governance & Metadata
- **Owner:** Senior QA Lead
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
