---
id: "NS-ADR-0004"
title: "ADR-0004: Semantic Versioning Strategy Across Knowledge & AI Contracts"
domain: "ADR"
subdomain: "RECORDS"
owner: "Chief Knowledge Architect"
status: "APPROVED"
version: "1.0.0"
authority: "CANONICAL"
priority: "HIGH"
review_cycle: "ANNUAL"
last_updated: "2026-08-04"
tags: ["adr", "semver", "versioning", "governance"]
depends_on: ["NS-ADR-INDX-001"]
used_by: []
---

# ADR-0004: Semantic Versioning Strategy Across Knowledge & AI Contracts

- **Status:** APPROVED
- **Date:** 2026-08-04
- **Owner:** Chief Knowledge Architect
- **Deciders:** Chief Technology Officer, Lead AI Engineer

## Context
When schemas, agent specifications, or pedagogical frameworks change, downstream systems (AI prompt runners, client app JSON parsers, CMS pipelines) must know whether a change is backward-compatible.

## Decision
Enforce Semantic Versioning 2.0.0 (`MAJOR.MINOR.PATCH`) across all Markdown documents, ACS agent contracts, and JSON Schemas in NovaStars OS:
- **MAJOR (X.0.0):** Breaking schema or architectural changes.
- **MINOR (0.Y.0):** Backward-compatible additions (new competencies, new mini-game patterns).
- **PATCH (0.0.Z):** Clarifications, typo fixes, or link updates.

## Consequences
- **Positive:** Guarantees zero runtime client app crashes and deterministic AI prompt compatibility.
- **Negative:** Requires updating version strings in metadata headers during Pull Requests.
