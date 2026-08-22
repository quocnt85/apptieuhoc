# Parent Zone — bằng chứng và quyết định gate thử nghiệm native

**Ngày kiểm định:** 23/08/2026
**Phạm vi:** build review nội bộ, chưa phải bản phát hành store
**Git baseline:** snapshot `codex/parent-zone-mvp` dựng trên `origin/main` `ea7dc2e`
**Người lập bằng chứng kỹ thuật:** Codex implementation verifier
**Product Owner ký duyệt:** Chưa ký

## Quyết định

| Phạm vi | Kết luận | Điều kiện |
| --- | --- | --- |
| Cài và kiểm thử APK trên thiết bị Android nội bộ | **TECHNICAL GO** | Chỉ dùng debug APK có hash bên dưới; giữ IAP off; không coi là store build |
| Build/kiểm thử iOS trên Mac hoặc thiết bị iOS | **GO TO TEST** | Cần Xcode/macOS; chưa có bằng chứng compile hay lifecycle thật |
| Upload App Store/Google Play, bật IAP hoặc RevenueCat production | **NO-GO** | Chưa có signing, product mapping và sandbox matrix |
| Pilot gia đình hoặc rollout production | **NO-GO** | Chưa có Product Owner sign-off, native-device matrix, store gate và pilot consent process |

Quyết định này chỉ mở vòng kiểm thử native tiếp theo. Nó không thay thế phê duyệt phát hành. Demo gate tiếp tục nhận `1234` hoặc `123456` theo quyết định hiện hành của Product Owner.

## Định danh artifact Android

| Artifact | Trạng thái | SHA-256 |
| --- | --- | --- |
| `client/android/app/build/outputs/apk/debug/app-debug.apk` | Debug APK, 23.971.819 byte, có thể sideload nội bộ | `FA12DAD8428BF54EA988B5D1F672E3E5100B4C0B8E6F8E5F31076E27510D9E56` |
| `client/android/app/build/outputs/bundle/release/app-release.aab` | Release AAB 20.329.917 byte, **chưa ký**, không được upload store | `4995C09C5024ACDC42A0A8029EC5227D0A9529ABA5A53F81409CE240EA56B986` |

## Bằng chứng chạy từ snapshot PR sạch

### Client

- `npm run test:unit`: **27/27 test files, 86/86 tests pass**.
- `npm run build`: **pass**; dialogue compile, audio safety, Parent data-boundary, native privacy, TypeScript, Vite build và production-safety scanner đều pass.
- Parent Zone tiếp tục được lazy-load thành chunk riêng; build review vẫn chứa demo/debug markers có chủ đích và không được đổi tên thành production artifact.
- `npm run cap:sync` tìm đủ 15 plugin trên Android/iOS và tự chạy fail-closed parity verifier. Sau sync, 57/57 file trong `dist` trùng byte-for-byte với cả Android và iOS public assets; chỉ có thêm hai shim Cordova do Capacitor sinh trên mỗi platform.
- Gradle `:app:testDebugUnitTest :app:assembleDebug :app:bundleRelease`: **BUILD SUCCESSFUL**, 1032 task; artifact có timestamp 23/08/2026 và hash trong bảng trên.
- `npm run check:android-bundle-safety` kiểm tra trực tiếp archive mới: APK 1.116 entries/42.037.784 expanded bytes và AAB 1.112 entries/38.454.831 expanded bytes; cả hai chứa đúng 57 web asset byte-identical + hai Cordova shim, không có database URL, pepper/admin/webhook secret, private key hoặc source map.
- Sáu regression case mới chứng minh verifier nhận artifact đúng và từ chối asset thiếu/cũ/bất ngờ, platform sai, Postgres URL và source map. Khi production build tạo chunk hash mới, verifier đã từ chối APK cũ trước khi rebuild — negative path được chứng minh trên artifact thật, không chỉ fixture.
- `jarsigner -verify` xác nhận AAB mới chưa ký đúng chủ đích.

### Worker và database contract

- `npm run types` tái sinh `worker-configuration.d.ts` theo `wrangler.jsonc`; staging có Hyperdrive, `EMAIL_DELIVERY_MODE=disabled`, `DEMO_AUTH_ENABLED=true` và `PARENT_IAP_ENABLED=false`; email/R2 chỉ bắt buộc ở production.
- `npm run verify:staging`: migration check **10/10**, Wrangler types check, TypeScript, **9/9 Node contract tests**, **79/79 Vitest tests** và staging deploy dry-run đều pass.
- Dry-run dùng Hyperdrive `3ccaff54ff564d618c64daecde8ea358`, không deploy phiên bản mới.
- Worker live gần nhất: `novastars-api-staging`, version `84cf5aa5-5494-4115-9c55-e6be7409a7f7`; health/readiness/CORS/admin guard/observability và atomic registration smoke đã pass trước đó.

### Network và privacy

- Data-boundary scanner xác nhận 10 migration không thêm child profile/progress/media payload fields.
- Native privacy verifier xác nhận cleartext off, Android backup/transfer exclusion, iOS backup exclusion, device-only secure session và Parent Gate lock khi lifecycle thay đổi.
- Kiểm định trình duyệt hiển thị sau giờ giới nghiêm: cả `1234` và `123456` mở được dashboard; `0000` bị từ chối; đủ tám tab và liên kết tab-panel ARIA hợp lệ.
- Resource timing trong luồng demo local không ghi nhận request `/api/v1/` hoặc Worker. Nickname, grade, progress, usage, nhiệm vụ và ảnh không rời thiết bị trong luồng đã kiểm tra.
- Thử mua trên web sau fresh re-auth dừng tại thông báo IAP đang tắt; không tạo giao dịch giả.

## Gate còn mở

- Cài APK, background/foreground, biometric fallback, backup/restore/reinstall và network capture trên thiết bị Android thật.
- Compile iOS, signed entitlements, VoiceOver/dynamic type và lifecycle/reinstall trên thiết bị iOS thật.
- Store signing, RevenueCat sandbox: purchase/renew/cancel/billing issue/expire/refund/revoke/duplicate/restore.
- Sender domain, SPF/DKIM/deliverability khi Product Owner yêu cầu bỏ demo auth.
- GitHub Actions native run đầu tiên trên một commit bàn giao sạch.
- Product Owner xem bằng chứng và ký quyết định cho từng mốc IAP, pilot và production.

## Chữ ký quyết định

- **Kỹ thuật — vòng thử native nội bộ:** GO, 23/08/2026.
- **IAP/store:** NO-GO.
- **Pilot/production:** NO-GO.
- **Product Owner:** Chưa ký; để trống có chủ đích, không được suy diễn từ technical GO.
