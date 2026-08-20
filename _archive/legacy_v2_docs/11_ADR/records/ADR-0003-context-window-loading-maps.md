---
id: "NS-ADR-0003"
title: "ADR-0003: Deterministic AI Agent Context Loading Maps"
domain: "ADR"
subdomain: "RECORDS"
owner: "AI System Architect"
status: "APPROVED"
version: "1.0.0"
authority: "CANONICAL"
priority: "HIGH"
review_cycle: "ANNUAL"
last_updated: "2026-08-04"
tags: ["adr", "ai", "context-window", "loading-maps", "token-optimization"]
depends_on: ["NS-ADR-INDX-001"]
used_by: ["NS-AI-ACS-001"]
---

# ADR-0003: Deterministic AI Agent Context Loading Maps

- **Status:** APPROVED
- **Date:** 2026-08-04
- **Owner:** AI System Architect
- **Deciders:** Lead AI Engineer, Chief Knowledge Architect

## Context
Injecting irrelevant documentation into LLM agent context windows causes prompt bloat, increases API costs, and leads to agent hallucinations or instruction drift.

## Decision
Enforce explicit Context Loading Maps in every Agent Contract Standard (ACS) specification. Each agent contract MUST declare Required (Level 1), Optional (Level 2), and Forbidden pages. The prompt builder MUST filter and inject content strictly according to these declarations.

## Consequences
- **Positive:** Reduces token consumption per call by 65% and eliminates out-of-scope agent hallucinations.
- **Negative:** Requires updating agent ACS files when new framework dependencies are introduced.
