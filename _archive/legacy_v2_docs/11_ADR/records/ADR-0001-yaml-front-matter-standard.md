---
id: "NS-ADR-0001"
title: "ADR-0001: Mandatory YAML Front Matter Metadata Schema"
domain: "ADR"
subdomain: "RECORDS"
owner: "Chief Knowledge Architect"
status: "APPROVED"
version: "1.0.0"
authority: "CANONICAL"
priority: "CRITICAL"
review_cycle: "ANNUAL"
last_updated: "2026-08-04"
tags: ["adr", "yaml", "front-matter", "metadata"]
depends_on: ["NS-ADR-INDX-001"]
used_by: []
---

# ADR-0001: Mandatory YAML Front Matter Metadata Schema

- **Status:** APPROVED
- **Date:** 2026-08-04
- **Owner:** Chief Knowledge Architect
- **Deciders:** Head of AI, Lead System Architect, Chief Product Officer

## Context
In an AI-native Knowledge Operating System, AI agents and automated scripts require deterministic, machine-parsable metadata headers to evaluate document relevance, authority, ownership, and dependency boundaries prior to injecting content into LLM prompt buffers.

## Decision
Enforce a mandatory YAML Front Matter metadata block on every Markdown file in NovaStars OS. The metadata MUST validate against a strict JSON Schema containing 14 required fields: `id`, `title`, `domain`, `subdomain`, `owner`, `status`, `version`, `authority`, `priority`, `review_cycle`, `last_updated`, `tags`, `depends_on`, and `used_by`.

## Alternatives Considered
- *Option A: In-body Markdown tables.* (Rejected due to unpredictable parsing logic in script runners).
- *Option B: Separate JSON sidecar files.* (Rejected because split files violate single-file atomic SSOT integrity).

## Consequences
- **Positive:** Enables automated CI linting, instantaneous graph generation, and deterministic AI agent context loading.
- **Negative:** Minimal authoring overhead when creating new pages.
