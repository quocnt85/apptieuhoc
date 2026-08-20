---
id: "ADR-0005"
title: "Tech Stack Migration: Web-First React + TypeScript, Capacitor, Neon PostgreSQL & Cloudflare Ecosystem"
status: "ACCEPTED"
date: "2026-08-20"
deciders: ["Chief Technology Officer", "Lead Systems Engineer", "AI System Architect"]
tags: ["adr", "tech-stack", "react", "capacitor", "neon", "cloudflare", "r2", "serverless"]
---

# ADR-0005: Tech Stack Migration to React + TypeScript (Vite), Capacitor, Neon Serverless PostgreSQL & Cloudflare Platform

## Context & Problem Statement
NovaStars previously specified a Flutter/Unity hybrid client with traditional Node.js/Go microservices and Google BigQuery. However, as the product evolves towards rapid iteration, high-velocity content deployment, cross-platform web/mobile parity, and low operational overhead, we require a modern, lightweight, type-safe, and serverless stack.

Key requirements:
1. **Developer Velocity & Maintainability**: Single codebase supporting rich dynamic interfaces (dashboards, stateful interactions, multi-step quests).
2. **Native Mobile Parity**: Effortless deployment to iOS and Android without maintaining separate native rendering engines.
3. **Serverless & Edge First**: Scalable, zero-cold-start backend with relational integrity and edge data access.
4. **Zero-Egress Content Storage**: Cost-effective storage and high-speed global delivery for thousands of interactive lesson JSONs and media assets.

## Decision Drivers
- High performance on mobile devices with sub-second startup time and small bundle size (< 15MB).
- Type-safety end-to-end (TypeScript shared schemas).
- Ease of packaging Web App into native iOS/Android binary with native device APIs.
- Serverless PostgreSQL with branchable environments and built-in connection pooling.
- High-throughput edge workers with zero ingress/egress fees for multimedia assets.

## Considered Options
1. **Option 1**: Flutter (App) + Unity (Mini-games) + Go Backend (Original proposal).
2. **Option 2**: Pure Vanilla JS + Static HTML5 + Capacitor.
3. **Option 3 (Selected)**: React 19/18 + TypeScript (Vite) + Tailwind CSS + HTML5 Canvas + Capacitor v6 + Neon PostgreSQL + Cloudflare Pages & Workers + Cloudflare R2.

## Decision Outcome
**Chosen Option**: **Option 3**.

### Architecture Blueprint
1. **Frontend Core**:
   - **Framework**: React 19/18 with TypeScript and Vite.
   - **Styling**: Tailwind CSS with custom EdTech / Kid-Friendly design tokens.
   - **State Management**: Zustand for reactive, lightweight client state (energy, progress, audio settings).
   - **Game & Interactive Layer**: HTML5 Canvas 2D / SVG / Web Audio Engine embedded seamlessly in React components.
2. **Mobile Packaging**:
   - **Capacitor v6**: Bridges the Vite build (`dist/`) directly to native iOS and Android projects with native hardware plugins (Haptics, Screen Orientation, Preferences).
3. **Database & Authentication**:
   - **Neon Serverless PostgreSQL**: High-performance Postgres accessed via `@neondatabase/serverless` with branchable environments for instant staging/prod migrations.
   - **Neon Auth / JWT**: Secure authentication for parents and learner profiles.
4. **Compute & Edge Delivery**:
   - **Cloudflare Pages**: Global CDN hosting for the React SPA.
   - **Cloudflare Workers / Pages Functions**: Low-latency edge APIs handling lesson progress syncing, auth verification, and analytics.
5. **Storage & Content CDN**:
   - **Cloudflare R2**: Object storage for frozen lesson packages and media assets with 0$ egress costs.

## Positive Consequences
- Dramatic reduction in bundle size from > 80MB (Unity engine) to < 15MB.
- Single unified language (TypeScript / JavaScript / SQL) across client, edge workers, and database migrations.
- Instant hot-module replacement (HMR) during development via Vite.
- Seamless web preview directly in browsers with 100% feature parity to native mobile builds.

## Negative Consequences & Mitigations
- *Risk*: Complex 3D game mechanics are limited compared to Unity.
  - *Mitigation*: NovaStars pedagogical mini-games focus on 2D physics, interactive puzzles, story dialogue, and card mechanics, which perform at solid 60 FPS in HTML5 Canvas 2D.
- *Risk*: Database connection spikes from serverless edge workers.
  - *Mitigation*: Use Neon Serverless connection pooling driver over HTTP/WebSockets.
