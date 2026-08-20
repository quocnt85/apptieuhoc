---
id: "NS-PRD-FET-001"
title: "Feature Spec: Interactive Quest Engine & Star Map Nodes"
domain: "PRODUCT"
subdomain: "FEATURES"
owner: "Lead Product Manager"
status: "FROZEN"
version: "1.0.0"
authority: "CANONICAL"
priority: "HIGH"
review_cycle: "QUARTERLY"
last_updated: "2026-08-04"
tags: ["product", "feature", "quest-engine", "star-map"]
depends_on: ["NS-PRD-FND-001", "NS-GAM-LOOP-001"]
used_by: ["NS-ENG-ARCH-001"]
---

# Feature Spec: Interactive Quest Engine & Star Map Nodes

## Purpose
Defines the technical and user experience specifications for the Quest Engine and Star Map Node progression system.

## Feature Overview
The Star Map serves as the main gameplay campaign interface. Learners navigate through World Maps (e.g. Echo Forest, Crystal Canyon) containing sequential Quest Nodes.

## Quest Node Types
1. **Story Quest Node (Standard)**: Executes a standard 4-stage NLAS lesson (Hook, Exploration, Boss, Reflection).
2. **Challenge Quest Node**: Special time-independent puzzle node testing a specific competency.
3. **World Boss Node**: Cumulative boss battle at the end of each World Map (5 quest nodes).

## Dependencies & Upstream Links (`depends_on`)
- [Product Foundation Blueprint](file:///Users/thuy/Documents/apptieuhoc/02_PRODUCT/product_foundation.md) (`ID: NS-PRD-FND-001`)
- [Core & Meta Gameplay Loops](file:///Users/thuy/Documents/apptieuhoc/04_GAME/gameplay_loops.md) (`ID: NS-GAM-LOOP-001`)

## Governance & Metadata
- **Owner:** Lead Product Manager
- **Status:** FROZEN
- **Version:** 1.0.0
- **Last Updated:** 2026-08-04
