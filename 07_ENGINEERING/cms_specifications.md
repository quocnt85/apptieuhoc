---
id: "NS-ENG-CMS-001"
title: "NovaStars Headless CMS & Cloudflare R2 Pipeline Specifications"
domain: "ENGINEERING"
subdomain: "CMS"
owner: "Lead Systems Engineer"
status: "FROZEN"
version: "2.0.0"
authority: "CANONICAL"
priority: "HIGH"
review_cycle: "QUARTERLY"
last_updated: "2026-08-20"
tags: ["engineering", "cms", "pipeline", "cloudflare-r2", "workers", "content-api"]
depends_on: ["NS-ENG-ARCH-001", "NS-CNT-MOD-001"]
used_by: ["NS-OPS-SOP-001"]
---

# NovaStars Headless CMS & Cloudflare R2 Pipeline Specifications

## Purpose
Defines the headless content data structures, ingestion pipelines, webhook triggers, and automated Cloudflare R2 storage distribution protocols for publishing frozen lesson packages.

## Content Ingestion & Freeze Pipeline

```mermaid
graph LR
    A[AIPS AI Agent Output] --> B[Automated Gate 1-4 Validation]
    B --> C[Human Gate 5 Approval]
    C --> D[Cloudflare Worker Webhook]
    D --> E[Validate JSON Schema & Sync to Neon DB]
    E --> F[Store Frozen JSON Bundle in Cloudflare R2]
    F --> G[Global Edge CDN Distribution]
```

## Content API Contract (Cloudflare Workers API)
- `GET /api/v1/lessons/{lesson_id}`: Returns frozen JSON Lesson Package from Cloudflare R2 Cache.
- `GET /api/v1/competencies`: Returns current Competency Tree directly from Neon PostgreSQL.
- `POST /api/v1/content/webhook/freeze`: Ingests approved lesson package from AIPS, stores record in Neon DB, and uploads bundle to Cloudflare R2.

## Dependencies & Upstream Links (`depends_on`)
- [Technical Architecture](file:///Users/thuy/Documents/apptieuhoc/07_ENGINEERING/technical_architecture.md) (`ID: NS-ENG-ARCH-001`)
- [Content Model Architecture](file:///Users/thuy/Documents/apptieuhoc/05_CONTENT/content_model.md) (`ID: NS-CNT-MOD-001`)

## Downstream Impact & Consumers (`used_by`)
- [Content Factory SOP](file:///Users/thuy/Documents/apptieuhoc/08_OPERATIONS/content_factory_sop.md) (`ID: NS-OPS-SOP-001`)

## Governance & Metadata
- **Owner:** Lead Systems Engineer
- **Status:** FROZEN
- **Version:** 2.0.0
- **Last Updated:** 2026-08-20
