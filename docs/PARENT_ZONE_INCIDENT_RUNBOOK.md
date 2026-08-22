# Parent Zone incident runbook

Version: 1.0 — experimental environment

Never place PINs, OTPs, tokens, email addresses, IP addresses, connection strings, child profile data, progress or media in an incident ticket. Record request IDs, opaque parent/slot/wallet/event IDs, stable error codes and timestamps only.

Start triage with `GET /api/v1/admin/observability?hours=24`. It returns aggregate counts only. A `critical` result requires immediate purchase and wallet reconciliation; never copy the admin secret into a ticket or browser bundle.

## Compromised parent account/session

1. Disable Parent Zone globally if exploitation is active.
2. Revoke all `parent_sessions` for the affected parent and require OTP/PIN reset.
3. Review `security_audit_log` by parent/request ID without exporting child data.
4. Check wallet/purchase reconciliation; use compensating ledger only after review.
5. Rotate shared secrets only if exposure is evidenced; never copy old/new values into the ticket.

## Stuck purchase

1. Ask for store transaction time/product and internal request ID, not a store password or child details.
2. Call the read-only purchase reconciliation endpoint for the relevant window.
3. Verify product store/environment mapping and RevenueCat event delivery.
4. If the stored event is `failed`, replay its exact normalized payload through the admin replay endpoint once.
5. Re-run purchase and wallet reconciliation. Do not tell the parent to buy again while status is pending.

## Duplicate or conflicting webhook

1. Compare RevenueCat event ID, store transaction ID, type and normalized payload hash.
2. Identical duplicate: no action; idempotent response is expected.
3. Same event ID with different payload: do not replay; quarantine and escalate to provider investigation.
4. Check ordering fields on subscription and matching purchase/ledger entries.

## Ledger mismatch

1. Use `GET /api/v1/admin/wallet-reconciliation`; never update the balance directly.
2. Trace transaction groups through purchase events, reward transfers, item requests and ledger.
3. Prepare a reviewed compensating transaction with reason `manual_reconciliation`, external incident reference and audit event.
4. Balance update and compensating ledger append must commit in the same database transaction.
5. Re-run reconciliation and attach redacted before/after evidence.

## Email outage

1. Keep existing valid sessions usable; do not weaken real-auth PIN/OTP rules.
2. Confirm Worker binding/readiness, sender-domain status and provider delivery metrics.
3. Pause new OTP-dependent onboarding/reset if delivery cannot be trusted.
4. Review builds may continue using the Product-approved demo gate; never enable that gate in production.
5. Announce recovery only after delivery tests to real team-owned addresses pass.

## Local child data/media concern

1. Do not request the parent's raw backup or child photo by default.
2. Use the consented local diagnostic export only if implemented and explicitly approved by the parent.
3. Confirm network/data-boundary checks and local deletion behavior.
4. If a server payload contains child identity/progress/media, disable the affected feature and treat as a privacy incident.
