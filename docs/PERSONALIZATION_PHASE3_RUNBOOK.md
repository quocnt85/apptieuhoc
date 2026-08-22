# Personalization Phase 3 runbook

Phase 3 creates a 1080×1920 Space ID in memory and exports it only after a fresh Parent Gate PIN challenge. Production access is off by default behind `VITE_ENABLE_CAPTAIN_ID_EXPORT=true`.

The renderer whitelist contains only the family display nickname, grade number, generic title, star count, completed-coordinate count, local avatar, and an approved local flag. It excludes child/profile IDs, email, school, local paths, timestamps, debug state, and server data. The output filename is generic and date-based.

On web, export uses the Web Share API when file sharing is supported and falls back to a local download. On native, the PNG is written to cache, passed to the operating-system share sheet, and deleted after the share call resolves; the Phase 0 startup cleanup remains a 24-hour fallback.

Native share-sheet smoke testing remains deferred with the other Android/iOS gates. Keep the production flag off until PIN interruption, share cancellation, cache cleanup, and low-storage behavior pass on real devices.
