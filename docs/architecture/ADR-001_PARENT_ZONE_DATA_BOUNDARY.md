# ADR-001 — Parent Zone data boundary

- Status: Accepted
- Date: 2026-08-22
- Owners: Product, Client, Backend
- Scope: Parent Zone MVP

## Context

NovaStars needs parent authentication, paid diamonds and subscriptions without collecting a child's identity, learning progress, usage history or photos on the server. The product is currently experimental and uses the existing shared Neon database. Creating a separate database is not required, but the privacy and financial boundaries must remain enforceable if environments are split later.

## Decision

1. Child profile fields (`name`, cosmetic `grade`, avatar/photo), learning progress, screen-time history and parent-guide activity are local-only.
2. Photos and other personalization media use app-private storage on native devices and IndexedDB in the browser preview. They never enter Neon, R2, analytics or application logs.
3. Neon stores only parent account/authentication data, opaque child wallet-slot IDs, consent receipts, finance/entitlement state and security audit events.
4. A `childSlotId` is an opaque finance handle. It must not contain or be joined to a child's name, grade, birthday, photo, progress or usage data.
5. Wallet balances and entitlements are server-authoritative. The client may cache a read model but cannot directly set diamonds or finalize a purchase.
6. Every money-like mutation is atomic and idempotent. The append-only ledger is the accounting record; mutable balance columns are a transactionally maintained projection.
7. The mobile/web client never connects directly to Neon. All server data flows through the Worker API.
8. Encrypted backup/export is initiated by the parent and stays on the parent's device or chosen destination. Import validates and previews before committing.
9. The existing shared experimental Neon database is used for now. Parent Zone tables remain isolated by explicit names and additive, checksummed migrations.

## Authentication exception for review builds

Review builds temporarily accept demo passwords `1234` and `123456`. This exception is centralized in the client demo-access policy and must be rejected by production build gates. It does not change the six-digit server PIN contract.

## Consequences

- The server cannot restore a deleted child profile or learning history.
- Reinstalling without a parent-created encrypted backup can permanently remove local child data.
- Cross-device child-profile sync is outside MVP.
- Closing a local profile must close its wallet slot and return remaining diamonds before deleting the local mapping.
- Product analytics must use aggregate/non-child operational signals only; no child-level telemetry is introduced by default.

## Enforcement evidence

- `client/scripts/check-parent-data-boundary.mjs` scans migrations and server routes for forbidden child fields.
- `client/scripts/check-parent-production-safety.mjs` rejects direct Neon configuration and demo/debug access in strict builds.
- `server/migrations/0001_parent_auth.sql` through `0010_purchase_dead_letter.sql` define the server boundary, database-enforced append-only ledger and purchase dead-letter metadata.
- `server/src/walletService.ts` and `server/src/purchaseService.ts` enforce transactional finance mutations.
- `client/src/services/parentBackup.ts` and `client/src/services/personalization/mediaStorage.ts` implement local backup/media handling.

## Revisit triggers

Re-review this ADR before enabling multi-device sync, server-side learning analytics, cloud media backup, social features, or a production environment split.
