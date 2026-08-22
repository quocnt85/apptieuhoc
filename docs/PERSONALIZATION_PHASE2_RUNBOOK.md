# Personalization Phase 2 runbook

Phase 2 adds an offline territory-flag workflow. The image binary stays in device storage; Zustand stores metadata and the local review status only. No upload, sharing, public gallery, or server moderation is used.

## Local review flow

1. A child crops an image to 3:2 and saves it as `DRAFT_LOCAL`.
2. The child submits it as `PENDING_PARENT_REVIEW`.
3. Inside an already-unlocked Parent Zone session, a parent can approve (`APPROVED_LOCAL`) or reject it (`REJECTED`).
4. Only `APPROVED_LOCAL` media may render on the first completed planet node and on `explorer_v1`.
5. A parent can revoke it back to `DRAFT_LOCAL` or permanently delete the local media.
6. Tapping the planet flag shows only the active child's own local achievement count; there is no other-player route or profile.

The state machine prevents a draft or rejected image from skipping parent review.

## Release controls

- `VITE_ENABLE_TERRITORY_FLAG=true` enables the child studio, Parent Zone queue, and planet flag in production builds.
- `VITE_ENABLE_EXPLORER_FLAG_DECAL=true` enables the `explorer_v1` decal in production builds.
- Both are automatically available in development and remain off by default in production.

## Deferred native gate

Android/iOS capture, interruption recovery, low-storage, and GPU smoke checks remain deferred until native project folders and devices are available. Do not enable either production flag before that gate is complete.

The production build baseline after Phase 2 is 1,530.28 kB minified / 437.02 kB gzip for the main bundle. Frame-rate and GPU-memory acceptance remain part of the deferred native smoke gate; the feature flags stay off until the pilot is within the 10% FPS budget and texture memory returns to baseline after replace/revoke cycles.
