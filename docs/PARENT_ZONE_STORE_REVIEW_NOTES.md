# Parent Zone — App Review / Play Console notes

These notes are a draft for the future native submission. IAP remains disabled until native, privacy, policy and sandbox gates pass.

## Reviewer access

- Parent Zone is opened from the bottom navigation item “Phụ Huynh”.
- Experimental review builds accept `1234` or `123456`; this temporary bypass is not permitted in production configuration.
- Production authentication is designed for verified parent email plus a six-digit PIN and optional device biometrics.

## Parental gate

- Sensitive actions require an unlocked Parent Zone session; purchase, time extension, clock reset, account deletion and other high-impact actions require re-authentication/fresh PIN as applicable.
- The gate locks on background/inactivity. Child-facing screens cannot switch profiles or access parent vault controls.

## Child data and privacy

- Child display name, cosmetic grade, progress, answers, usage and photos remain on-device.
- The server stores parent authentication/consent, opaque child wallet-slot IDs, purchases, subscriptions and append-only finance records.
- Photos are not uploaded or used for public/social features.

## Purchases

- VIP month is the primary planned subscription. Consumable diamond packs are fulfilled only after an authenticated RevenueCat webhook updates the server-authoritative parent vault.
- Store UI uses localized prices returned by the native store SDK; it does not hard-code a currency price.
- Restore does not promise to restore consumed diamond packs. Store receipts/invoices come from Apple/Google; any NovaStars email is only an internal transaction confirmation.
- The app prevents repeated taps while webhook confirmation is pending and tells the parent not to buy again.

## Screen time

- Default curfew is 21:30–06:00. A child may finish the current lesson location or game turn before blocking.
- A parent can add 15 minutes up to twice per day after re-authentication.

## Content

- Parent guides are curated/offline and do not use AI. Device speech is used only inside Parent Zone.
- Draft massage guidance is hidden behind a disabled health-review flag until content review is complete.
