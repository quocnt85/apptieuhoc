---
id: "NS-OPS-DEP-001"
title: "NovaStars Release, Freeze & Production Deployment Protocols"
domain: "OPERATIONS"
subdomain: "DEPLOYMENT"
owner: "Head of Content Operations"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "HIGH"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["operations", "deployment", "freeze", "release", "cdn"]
depends_on: ["NS-OPS-SOP-001", "NS-ENG-CMS-001"]
used_by: []
---

# NovaStars Release, Freeze & Production Deployment Protocols

## Purpose
Defines the technical procedures, version tagging rules, and CDN caching strategies for releasing approved content packages from CMS to production mobile client apps.

## Deployment Pipeline Flow

```mermaid
graph LR
    A[Human Gate 5 Approval] --> B[Tag Content Package: FROZEN v1.0.0]
    B --> C[Generate Static CDN Bundle]
    C --> D[Run Smoke Test Suite]
    D --> E[Promote to Global Edge CDN]
```

## Release Freeze Rules
1. **Immutable Freeze**: Once a lesson package is tagged `FROZEN`, its JSON structure CANNOT be altered directly. Any correction requires a patch release (`v1.0.1`).
2. **CDN Staging Gate**: Pre-production builds validate lesson asset loading in a staging sandbox prior to global distribution.

## Dependencies & Upstream Links (`depends_on`)
- [Content Factory SOP](file:///Users/thuy/Documents/apptieuhoc/08_OPERATIONS/content_factory_sop.md) (`ID: NS-OPS-SOP-001`)
- [CMS Specifications](file:///Users/thuy/Documents/apptieuhoc/07_ENGINEERING/cms_specifications.md) (`ID: NS-ENG-CMS-001`)

## Governance & Metadata
- **Owner:** Head of Content Operations
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
