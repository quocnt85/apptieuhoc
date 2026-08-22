# Parent Zone security review — repository gate

Date: 2026-08-22
Scope: Web/review client and Cloudflare Worker repository
Result: Pass for experimental review; native/infrastructure gates remain open

## Reviewed controls

| Area | Evidence | Result |
|---|---|---|
| Parent auth | OTP consume-once, email/IP throttling, six-digit PIN verifier, progressive lockout, fresh-PIN middleware; in-app email/OTP/PIN reset with session rotation and rate-limit failure state | Pass — server auth/rate-limit tests and isolated 10/10 E2E on 5 viewports |
| Demo access | `1234` and `123456` centralized for review; production config rejects demo access | Accepted temporary exception |
| Sessions | 15-minute access token, rotated single-use refresh token, 30-day ceiling, logout/delete revocation | Pass — auth/client refresh tests |
| Token storage | Native Secure Storage; browser `sessionStorage`; no token in localStorage | Pass in code; physical native-device validation pending |
| IDOR | Parent ID comes from authenticated session; wallet/slot operations include parent ownership predicate | Pass — wallet tests/OpenAPI review |
| Input/body boundary | Zod schemas, 1 MB JSON cap, UUID/idempotency patterns, safe integer bounds | Pass |
| CORS/headers | Exact origin allowlist; no wildcard; no-store, nosniff and no-referrer headers | Pass — HTTP contract tests |
| Ledger | Non-negative constraints, transactional row locks, idempotency tables, PostgreSQL append-only trigger | Pass — migrations 0002/0009 and wallet tests |
| Webhook | Constant-time bearer check, bounded schema/timestamps, platform/environment catalog, ordering/dedup/reversal guards | Pass — purchase tests |
| Dead letter/replay | Stored normalized payload, failed state/retry counter, admin-only replay, exact-payload replay predicate | Pass — migration 0010/purchase tests |
| Admin routes | Separate `/api/v1/admin/*`, constant-time secret check, no public upload write route; aggregate observability dashboard uses one-shot header secret, no persistence and allowlist rendering | Pass — HTTP tests, static build guard and 10/10 dashboard E2E on 5 viewports |
| Child-data boundary | Profiles/progress/usage/media local-only; opaque child wallet slot only on server | Pass — ADR, data inventory and automated scanner |
| Backup | AES-GCM, derived key, account binding, schema/size checks, preview/rollback; in-app masked passphrase dialog with create confirmation and no network transfer | Pass for unit/E2E on 5 viewports; native reinstall/large-device test pending |
| External links | Exact reviewed HTTPS URL allowlist, forced parent re-auth in an accessible in-app modal, no query/hash or child-data parameters, native Capacitor Browser | Pass — unit/E2E on 5 viewports |
| Destructive confirmation | In-app alert dialogs for profile/media/account deletion, backup restore and rewards >=500; safe focus defaults to cancel, focus trap/Escape, mandatory warning acknowledgement | Pass — focused 125/125 E2E on 5 viewports; no browser prompt/confirm/alert remains in Parent Zone |
| Pilot diagnostics | Explicit in-app consent + fresh re-auth; aggregate allowlist only; no auto-upload; native cache file deleted after Share | Pass — secret-probe unit tests and downloaded-file E2E on 5 viewports |
| Production bundle | Reject demo/default PIN paths, direct Neon, debug store entrypoints and God Mode chunks | Pass — strict build scanner |

## Findings resolved during review

1. Added a PostgreSQL trigger preventing ledger `UPDATE` and `DELETE`.
2. Added wallet projection versions to prevent silent stale-cache assumptions.
3. Bound RevenueCat products to store and provider/runtime environment.
4. Added indexed dead-letter state, exact-payload replay and purchase reconciliation.
5. Added local transaction lease/journal, rollback and crash recovery.
6. Added wall-clock rollback blocking with explicit parent re-authentication reset.
7. Added a reviewed external-source allowlist and forced re-authentication before leaving the app.
8. Replaced browser passphrase prompts with an accessible in-app backup dialog that validates length/match before encryption and asks before reading an imported file.
9. Replaced the personalization rejection prompt with a bounded in-app note dialog; cancellation leaves review state unchanged and blank submission uses a fixed safe message.
10. Replaced the final browser prompts in PIN recovery with a multi-step in-app form and an isolated real-auth E2E runner; demo review remains independently gated.
11. Replaced browser confirm/alert in destructive, restore, large-reward and screen-time flows with accessible in-app confirmation or live-status UI; destructive actions default focus to cancel.
12. Added a consented local diagnostic report for pilot use with aggregate-only schema, fresh parent re-authentication, no automatic upload and native temporary-file cleanup.
13. Added a read-only Admin Center observability dashboard with HTTPS-origin validation, one-shot non-persisted admin secret, CSP, aggregate allowlist rendering, no-store request and timeout/error states.

## Accepted temporary risks

- Review builds intentionally use weak demo passwords `1234`/`123456` until Product requests removal. IAP remains off and production build guards reject this mode.
- The Neon database is experimental. On 2026-08-22, the isolated integration harness and all 10 checksummed migrations were applied and verified on `novastars_app_demo` in the existing development branch; Worker/Hyperdrive smoke testing remains pending.
- Capacitor 8 iOS/Android projects, backup exclusion, device-only Keychain configuration, biometric declarations and RevenueCat native SDK are present and sync cleanly. Physical Keychain/Keystore, biometric, reinstall and store behavior are still not release-proven until compiled/tested on real devices.
- Email delivery/domain controls are not operational; review authentication bypasses email by Product decision.

## Required re-review triggers

Re-review before enabling IAP, adding native projects, enabling real email auth, adding external links, introducing child telemetry/cloud sync, or changing wallet/ledger schemas.

## Repository evidence update — 22/08/2026

- `client/e2e/parent-privacy-accessibility.spec.ts` captures every request after Parent Zone unlock while creating a named profile, changing grade/usage settings and approving a local mission. Unique probe values must not appear in URL/body and the demo local flow must make zero `/api/v1/` calls.
- The same suite checks tab semantics, keyboard activation/focus indication, named tab panel and minimum 44px primary controls on five configured mobile/tablet viewports.
- This evidence covers the web demo build. Authenticated API/native network capture, OS screen reader and reinstall behavior remain release gates and are not inferred from this test.
