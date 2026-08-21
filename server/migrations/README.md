# Parent Zone database migrations

Apply these files to the Neon database in numeric order. They are additive and do not upload child profiles, learning progress, usage, missions, or photos.

Required production secrets:

- `NEON_DATABASE_URL` (or configure Hyperdrive and adapt `database.ts`).
- `SESSION_PEPPER`.
- `OTP_PEPPER`.
- `PIN_PEPPER`.
- `REVENUECAT_WEBHOOK_SECRET`.
- `ADMIN_UPLOAD_SECRET` while the legacy content upload route exists.

Never commit secret values. Use Wrangler secrets for staging and production.
