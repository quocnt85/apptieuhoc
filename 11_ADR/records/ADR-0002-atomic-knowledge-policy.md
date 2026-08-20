---
id: "NS-ADR-0002"
title: "ADR-0002: Atomic Knowledge & Zero Duplication Policy"
domain: "ADR"
subdomain: "RECORDS"
owner: "Chief Knowledge Architect"
status: "APPROVED"
version: "1.0.0"
authority: "CANONICAL"
priority: "CRITICAL"
review_cycle: "ANNUAL"
last_updated: "2026-08-04"
tags: ["adr", "atomic-knowledge", "ssot", "duplication-policy"]
depends_on: ["NS-ADR-INDX-001"]
used_by: []
---

# ADR-0002: Atomic Knowledge & Zero Duplication Policy

- **Status:** APPROVED
- **Date:** 2026-08-04
- **Owner:** Chief Knowledge Architect
- **Deciders:** Lead Curriculum Architect, AI System Architect

## Context
Duplicating framework definitions across multiple documentation files creates architectural drift, out-of-sync rules, and conflicting AI agent behavior during RAG retrieval.

## Decision
Adopt the **Atomic Knowledge Policy**: Every concept, model, schema, or rule MUST be defined in exactly ONE canonical Markdown file. Any other document requiring that concept MUST link to the canonical node URI rather than re-stating or summarizing the definition.

## Consequences
- **Positive:** Guarantees 100% Single Source of Truth integrity across human and AI workflows.
- **Negative:** Requires rigorous cross-linking during document drafting.
