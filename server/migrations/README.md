# Parent Zone database migrations

Validate the ordered additive sequence with `npm run migrations:check`. After setting `NEON_DATABASE_URL` to the existing shared experimental Neon database, run `npm run shared-demo:provision`. This applies all pending files and then verifies the live schema contract. The runner records filename/checksum in `schema_migrations`, rejects changed applied files and applies each migration atomically.

The live verifier checks required tables, critical columns, financial indexes, the append-only wallet trigger, validated constraints and exact migration checksums. Its success output contains counts only and never prints the connection string.

For an opt-in destructive integration test, set `NEON_INTEGRATION_DATABASE_URL` and run `npm run test:integration:db`. The harness creates a uniquely owned `pz_it_*` schema inside that database, provisions and verifies it, exercises financial constraints, and removes only that exact schema in `finally`. It never falls back to `NEON_DATABASE_URL`, never targets `public`, and does not require a separate Neon database or branch.

`NEON_DATABASE_SCHEMA` is reserved for the migration/verifier subprocesses used by this harness. Ordinary shared-demo provisioning defaults to `public`; do not set a custom schema manually in operational runs.

These migrations do not upload child profiles, learning progress, usage, missions, or photos.

The current sequence ends at `0010_purchase_dead_letter.sql`; migration 0009 installs a database trigger rejecting `UPDATE` and `DELETE` against `wallet_ledger`, and 0010 adds indexed purchase retry/dead-letter metadata.

Required production secrets:

- `NEON_DATABASE_URL` (or configure Hyperdrive and adapt `database.ts`).
- `SESSION_PEPPER`.
- `OTP_PEPPER`.
- `PIN_PEPPER`.
- `REVENUECAT_WEBHOOK_SECRET`.
- `ADMIN_UPLOAD_SECRET` for protected admin reconciliation/content routes.

Never commit secret values. Use Wrangler secrets for staging and production.
