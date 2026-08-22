# Parent Zone — release runbook

Trạng thái code: client và Worker đã có đầy đủ luồng MVP; IAP mặc định **tắt**. Không bật production nếu các gate bên dưới chưa hoàn tất.

> Bản review hiện bật `VITE_PARENT_DEMO_ACCESS=true`, bỏ qua email/OTP và tạm chấp nhận mật khẩu `1234` hoặc `123456` chỉ trong bộ nhớ phiên. Đây là cổng demo tạm thời theo quyết định của Product Owner và được giữ cho tới khi Product Owner yêu cầu bỏ.

## Trạng thái hạ tầng đã kiểm tra ngày 22/08/2026

- Wrangler `4.125.0` đã đăng nhập đúng Cloudflare account `Novastar` và có quyền Workers/Email/Connectivity cần thiết.
- Worker `novastars-api-staging` đã deploy tại `https://novastars-api-staging.novastar-8c7.workers.dev`; code version đang phục vụ và đã smoke gần nhất là `84cf5aa5-5494-4115-9c55-e6be7409a7f7`.
- Hyperdrive Parent Zone riêng `novastars-parent-zone-development` (`3ccaff54ff564d618c64daecde8ea358`) trỏ tới `novastars_app_demo` bằng role giới hạn `novastars_app_runtime`; không tái sử dụng Hyperdrive HCNS.
- Quyết định ngày 22/08/2026: toàn bộ hệ thống hiện là thử nghiệm, vì vậy Parent Zone dùng project `novastars-hcns` (`flat-wave-92357555`) và branch `development` (`br-raspy-voice-az1na2ea`); không tạo project hoặc branch `staging` riêng.
- Branch chưa có database ứng dụng phù hợp: `hcns_data_staging` thuộc HCNS, còn `neondb` mặc định chưa có `schema_migrations`. Neon CLI đã tạo `novastars_app_demo` (ID `427726`) trong branch hiện tại.
- Isolated integration và `shared-demo:provision` đã pass ngày 22/08/2026: 10 migration, 16 bảng, 40 index, 1 custom trigger và các invariant số dư không âm/idempotency/append-only. Connection string chỉ tồn tại tạm trong process và không được ghi vào `.dev.vars`, command output hoặc repo.
- Staging review chủ động dùng `DEMO_AUTH_ENABLED=true`, `EMAIL_DELIVERY_MODE=disabled`, không có email/R2 binding và giữ IAP off. Production vẫn fail readiness nếu bật demo hoặc thiếu email binding. Content endpoint trả 503 có cấu trúc khi R2 chưa được kích hoạt.
- Data boundary và API contract được khóa tại `docs/architecture/ADR-001_PARENT_ZONE_DATA_BOUNDARY.md`, `docs/security/PARENT_ZONE_THREAT_MODEL.md`, `docs/security/PARENT_ZONE_DATA_INVENTORY.md` và `server/openapi/parent-zone.v1.json`.

### Quyết định gate gần nhất — 23/08/2026

Bằng chứng chi tiết nằm tại [`PARENT_ZONE_NATIVE_TEST_GATE_2026-08-23.md`](./PARENT_ZONE_NATIVE_TEST_GATE_2026-08-23.md). Kết luận hiện tại là **TECHNICAL GO** để sideload và kiểm thử debug APK trên thiết bị Android nội bộ, nhưng **NO-GO** cho upload store, IAP, pilot và production. Product Owner chưa ký release gate; technical GO không được dùng thay cho phê duyệt đó. Demo tiếp tục nhận `1234`/`123456`, email delivery và IAP tiếp tục tắt.

## 1. Database

Schema hiện đã được áp dụng vào `novastars_app_demo`. Khi cần chạy lại/triển khai migration mới, dùng runner có checksum; các bảng Parent Zone dùng tên riêng và migration được quản lý độc lập:

```powershell
Set-Location server
# Cách 1: copy .dev.vars.example thành .dev.vars rồi điền NEON_DATABASE_URL.
# File .dev.vars đã được git-ignore và được lệnh dưới đây tự động đọc.
# Cách 2: nạp NEON_DATABASE_URL bằng secret manager/terminal profile an toàn.
npm run shared-demo:provision
# Chỉ cần xóa biến process nếu đã dùng Cách 2:
Remove-Item Env:NEON_DATABASE_URL -ErrorAction SilentlyContinue
```

Lệnh trên tự áp dụng 10 migration theo thứ tự, khóa concurrent migration, đối chiếu checksum và sau đó kiểm tra live schema: bảng, critical columns, financial indexes, append-only trigger và trạng thái constraint. Không chạy từng file bằng `psql`, vì cách đó bỏ qua bảng quản lý checksum `schema_migrations`.

Trước khi chạy smoke trên dữ liệu thử nghiệm dùng chung, có thể chạy integration harness trong một schema tạm của chính database đó:

```powershell
Set-Location server
# Điền NEON_INTEGRATION_DATABASE_URL trong .dev.vars hoặc nạp bằng secret manager.
# Có thể dùng cùng URL database thử nghiệm; harness vẫn không fallback từ NEON_DATABASE_URL.
npm run test:integration:db
Remove-Item Env:NEON_INTEGRATION_DATABASE_URL -ErrorAction SilentlyContinue
```

Harness chỉ tạo schema dạng `pz_it_<timestamp>_<random>`, chạy migration/live verifier, kiểm tra constraint số dư không âm, unique idempotency key và append-only ledger, rồi xóa đúng schema do chính run đó tạo trong `finally`. Nó từ chối `public`, tên schema thủ công hoặc chuỗi có thể chèn SQL. Đây là schema tạm trong Neon hiện tại, không phải database/branch mới. GitHub Actions tự chạy bước này khi repository có secret `NEON_INTEGRATION_DATABASE_URL`; pull request không có secret sẽ bỏ qua bước live.

Không đưa connection string vào client hoặc commit vào repo. Worker thử nghiệm nên dùng Cloudflare Hyperdrive trỏ tới chính Neon database này; `NEON_DATABASE_URL` chỉ dùng tạm cho runner/server development.

Trước khi tạo Hyperdrive, tạo role `novastars_app_runtime` bằng `npm run database:provision-runtime-role`. Script từ chối sai database, role đặc quyền, quyền tạo schema hoặc quyền truy cập `schema_migrations`; chỉ cấp DML trên bảng ứng dụng và tự kiểm tra kết nối runtime. Không dùng `neondb_owner` làm origin credential của Hyperdrive.

## 2. Cloudflare Worker

Tạo secrets cho Worker thử nghiệm (tên environment `staging` chỉ là nhãn kỹ thuật, không phải database riêng):

```powershell
npx wrangler secret put SESSION_PEPPER --env staging
npx wrangler secret put OTP_PEPPER --env staging
npx wrangler secret put PIN_PEPPER --env staging
npx wrangler secret put REVENUECAT_WEBHOOK_SECRET --env staging
npx wrangler secret put ADMIN_UPLOAD_SECRET --env staging
```

Không cấu hình hoặc deploy `--env production` trong giai đoạn hiện tại. Pepper/secret phải là giá trị ngẫu nhiên tối thiểu 32 byte. Sau khi thay đổi `wrangler.jsonc`, chạy `npm run types` và commit binding types mới. Trước deploy dùng `npm run verify:staging` để kiểm tra types, typecheck, tests và dry-run trong một lệnh.

Sau deploy, gọi `GET /ready`. Endpoint chỉ trả trạng thái boolean của từng binding/secret, không trả giá trị bí mật. Chỉ tiếp tục smoke test khi nhận HTTP 200 với `status=ready`; HTTP 503 cho biết cấu hình chưa đủ. Staging/production bắt buộc có Hyperdrive, không fallback trực tiếp về Neon URL.

Chạy `npm run smoke:staging` cho health/readiness/CORS/admin/observability. Sau đó chạy `npm run smoke:staging:auth` với `STAGING_API_URL` và `STAGING_DATABASE_ADMIN_URL` chỉ nạp tạm trong process. `STAGING_OTP_PEPPER` là tùy chọn và chỉ dùng để xóa chính xác rate-limit hash của smoke; không xoay pepper chỉ để chạy test. Auth smoke tạo email ngẫu nhiên, xác nhận register 200 + retry 429 + đúng 1 parent/1 OTP/2 consent/1 wallet, từ chối debug OTP và luôn xóa parent/OTP/consent/wallet trong `finally`; script từ chối database khác `novastars_app_demo` theo mặc định.

## 3. Transactional email — hoãn trong bản demo

- Demo tiếp tục bỏ qua email/OTP và nhận `1234` hoặc `123456` cho tới khi Product Owner yêu cầu bỏ.
- Chưa cần onboard sender domain, SPF/DKIM hoặc chạy deliverability test trong sprint thử nghiệm hiện tại.
- Khi kích hoạt auth thật sau này, thay `security@novastars.vn` nếu chưa phải domain chính thức, giới hạn binding đúng sender và không log OTP. `debugOtp` chỉ được trả ở `ENVIRONMENT=development`.

## 4. RevenueCat và store

Tạo đúng product IDs trên Apple/Google và RevenueCat:

| Product | Credit |
| --- | ---: |
| `novastars.diamonds.100` | 100 |
| `novastars.diamonds.350` | 350 |
| `novastars.diamonds.1000` | 1.000 |
| `novastars.diamonds.2500` | 2.500 |
| `novastars.vip.monthly` | 150/kỳ hợp lệ |
| `novastars.vip.annual` | 2.000/kỳ hợp lệ |

- Cấu hình webhook URL `/api/v1/webhooks/revenuecat` và Authorization `Bearer <REVENUECAT_WEBHOOK_SECRET>`.
- RevenueCat App User ID phải là UUID tài khoản phụ huynh; không dùng nickname/email trẻ.
- Điền public SDK keys vào `VITE_REVENUECAT_IOS_API_KEY` và `VITE_REVENUECAT_ANDROID_API_KEY`.
- Thêm native platforms (`npx cap add ios/android`) nếu repo phân phối chưa có, rồi `npm run cap:sync`.
- Android Activity `launchMode` phải là `standard` hoặc `singleTop` để luồng xác minh thanh toán không bị hủy.
- iOS: thêm `NSFaceIDUsageDescription` vào `Info.plist` trước khi bật Face ID.
- Android: dùng theme kế thừa `Theme.AppCompat` và kiểm thử BiometricPrompt trên thiết bị có/không có sinh trắc học.
- Test sandbox: initial purchase, renewal, cancel, billing issue, expiration, refund/revoke, duplicate webhook và restore.
- Chỉ đặt `VITE_PARENT_IAP_ENABLED=true` và `PARENT_IAP_ENABLED=true` sau khi toàn bộ matrix pass.

## 5. Reconciliation

Kiểm tra wallet balance với tổng ledger:

```sql
SELECT w.id, w.balance,
       COALESCE(SUM(CASE WHEN l.direction='credit' THEN l.amount ELSE -l.amount END), 0) AS ledger_balance
FROM wallet_accounts w
LEFT JOIN wallet_ledger l ON l.wallet_id=w.id
GROUP BY w.id, w.balance
HAVING w.balance <> COALESCE(SUM(CASE WHEN l.direction='credit' THEN l.amount ELSE -l.amount END), 0);
```

Kiểm tra webhook lỗi/pending quá 10 phút:

```sql
SELECT revenuecat_event_id, event_type, product_id, processing_status, error_code, created_at
FROM purchase_events
WHERE processing_status IN ('pending','failed') AND created_at < NOW() - INTERVAL '10 minutes';
```

Không sửa số dư trực tiếp. Mọi điều chỉnh phải tạo ledger `manual_reconciliation` với transaction group, external reference và audit tương ứng.

### Purchase dead-letter và safe replay

1. Gọi `GET /api/v1/admin/purchase-reconciliation?hours=24&limit=500` với `X-Admin-Secret` để lấy failed/stale events, credit thiếu ledger và VIP thiếu subscription projection.
2. Đối chiếu event với RevenueCat dashboard và store transaction. Không sửa `normalized_payload`, không đổi product ID/store/environment và không tạo event ID mới.
3. Chỉ replay event đang ở trạng thái `failed` bằng `POST /api/v1/admin/purchase-events/{eventId}/replay` với `X-Admin-Secret`.
4. Replay dùng đúng normalized payload đã lưu, chỉ chuyển failed → pending khi payload trùng byte/JSON; unique constraints và ledger idempotency vẫn áp dụng.
5. Chạy lại purchase và wallet reconciliation. Nếu vẫn lỗi, giữ dead-letter, ghi request ID/error code vào incident; không sửa balance trực tiếp.

Product context bắt buộc khớp: Worker `production` chỉ nhận RevenueCat `PRODUCTION`; development/staging chỉ nhận `SANDBOX`; store phải là `APP_STORE` hoặc `PLAY_STORE`.

## 6. Privacy và release gates

- Dùng network inspector xác nhận không request nào chứa nickname, grade, đáp án, progress, usage, nội dung nhiệm vụ hoặc ảnh.
- Kiểm tra production bundle không render God Mode/debug overlay và không chứa Neon URL.
- Xác minh session native nằm trong Keychain/Keystore; web chỉ dùng `sessionStorage`.
- Test PIN sai và lockout, OTP hết hạn/sai quá số lần, khóa khi app vào background, sinh trắc học chỉ được bật sau một lần nhập PIN thành công.
- Test xóa hồ sơ có hoàn kim cương về vault trước khi xóa local; test backup sai mật khẩu không ghi đè.
- Xác minh các thao tác xóa ảnh/hồ sơ/tài khoản, restore backup và thưởng từ 500 Kim Cương dùng alert dialog trong app, focus mặc định ở `Hủy`; không chấp nhận browser `prompt`/`confirm`/`alert`. Gia hạn thời gian và clock reset phải thông báo qua live region trong app.
- Báo cáo chẩn đoán pilot phải yêu cầu consent rõ ràng và fresh re-auth, chỉ chứa aggregate schema đã kiểm định, không tự upload. Native chỉ tạo file tạm trong Cache để mở Share sheet và phải xóa trong `finally`; không thêm raw event, tên/ID hồ sơ, email, tiêu đề, đáp án, điểm hoặc media.
- `VITE_ENABLE_PENDING_HEALTH_CONTENT` phải giữ `false` cho đến khi nội dung mát-xa được hậu kiểm.
- Parent Zone có thể rollout độc lập qua `VITE_PARENT_ZONE_ENABLED`; mission qua `VITE_REAL_LIFE_REWARDS_ENABLED`.
- Bản review thử nghiệm dùng `.env.staging.example` và vẫn bật demo password `1234`/`123456`. `.env.staging-auth.example` chỉ dành cho giai đoạn tương lai sau khi Product Owner yêu cầu kiểm định email/OTP/PIN thật; hiện không dùng làm gate. Mọi cấu hình vẫn bắt buộc API HTTPS và giữ IAP off.
- `npm run build` tự chạy production-safety scanner. Với staging-auth/production không bật demo, build phải không chứa God Mode/debug chunks, `VITE_NEON_DATABASE_URL` hoặc PostgreSQL connection string.
- Strict auth bundle cũng không được chứa `__gameStore` hoặc `__parentZoneStore`; hai debug entrypoint chỉ tồn tại trong môi trường phát triển/review phù hợp.
- `npm run build` cũng chạy data-boundary scanner: migration server và payload Parent API không được thêm nickname, khối lớp, tiến độ, câu trả lời, thời lượng, nhiệm vụ hoặc ảnh của trẻ.
- Mọi nguồn ngoài trong Cẩm nang phải được thêm vào exact allowlist tại `parentExternalLinks.ts`, dùng HTTPS không query/hash, có metadata nhà xuất bản và bắt buộc re-auth trước khi mở. Native mở bằng Capacitor Browser; không nối child/profile/usage data vào URL.

## Wallet reconciliation (chỉ đọc)

Gọi `GET /api/v1/admin/wallet-reconciliation?limit=100` với header `X-Admin-Secret`. Endpoint chỉ trả các ví có `balance` khác tổng `credit - debit` trong ledger; không tự sửa hoặc ghi lại số dư.

Khi có mismatch:

1. Lưu request ID, wallet ID, balance, ledger balance, delta và thời điểm kiểm tra vào incident nội bộ; không đưa email hoặc dữ liệu trẻ vào biên bản.
2. Đối chiếu `purchase_events`, `reward_transfers`, `item_purchase_requests` và các dòng `wallet_ledger` theo wallet/transaction group.
3. Không sửa trực tiếp `wallet_accounts.balance` và không xóa ledger. Mọi điều chỉnh phải là transaction được review, thêm compensating ledger với reason `manual_reconciliation` và cập nhật balance trong cùng transaction.
4. Chạy lại endpoint; chỉ đóng incident khi mismatch bằng 0 và reviewer thứ hai ký xác nhận.

## Observability summary (chỉ đọc, không PII)

Gọi `GET /api/v1/admin/observability?hours=24` với header `X-Admin-Secret`. Response chỉ có số đếm tổng hợp cho auth errors, PIN bị từ chối, rate limit, OTP issued/consumed/expired, purchase failed/stale và số ví lệch ledger; không trả parent ID, email, IP, child slot, wallet ID hoặc event ID.

Có thể dùng `/admin_center/parent_zone_observability.html` để xem cùng aggregate response. Nhập API origin HTTPS và admin secret theo từng lần gọi; trang xóa ô secret ngay khi gửi, không lưu local/session storage hoặc URL và không render field ngoài allowlist. Không dùng trang này trên thiết bị dùng chung hoặc qua screen sharing. Dashboard chỉ đọc, không thay thế incident/reconciliation runbook.

- `status=critical`: có purchase failed hoặc wallet-ledger mismatch; mở incident và chạy hai reconciliation endpoint ngay.
- `status=warning`: có purchase pending quá 5 phút, rate limit hoặc OTP hết hạn chưa dùng; kiểm tra xu hướng và email/provider health.
- `status=healthy`: không có các tín hiệu trên trong cửa sổ được chọn; đây không thay thế smoke test hoặc store reconciliation.
- Cửa sổ hợp lệ từ 1 đến 744 giờ. Chỉ dashboard/backend vận hành được gọi endpoint này; không gọi từ mobile client và không lưu admin secret trong bundle.

## 7. Lệnh kiểm định

```powershell
cd server
npm run verify:staging

cd ../client
npm run build
npm audit --omit=dev
npx playwright test daily-quests.spec.ts screen-time.spec.ts personalization-flag.spec.ts parent-privacy-accessibility.spec.ts personalization-space-id.spec.ts parent-observability.spec.ts
npm run test:e2e:parent-auth
npm run cap:sync
```

## 8. Native build prerequisites và privacy checks

- Toolchain hiện tại: Capacitor 8; Node 22+; iOS deployment target 15.0/Xcode 26+; Android minSdk 24, compile/target SDK 36, AGP 8.13.0 và Gradle 8.14.3.
- Chạy `npm run check:parent-native-privacy` trước mọi native build. Check bắt buộc cleartext off, Android backup/transfer exclusion, iOS backup exclusion, Face ID/camera usage copy, device-only Keychain và background Parent Gate lock.
- `npm run cap:sync` phải tìm đủ 15 plugin cho cả hai platform. Wrapper tự đối chiếu SHA-256/byte parity giữa `dist` và Android/iOS public assets, chỉ cho phép `cordova.js`/`cordova_plugins.js` được sinh thêm; thiếu, stale hoặc extra file khác phải làm lệnh fail. Luôn dùng wrapper npm này trong CI/Windows vì nó còn chuẩn hóa SwiftPM local path sang dấu `/`; không gọi trực tiếp Capacitor CLI rồi commit `Package.swift` chứa dấu `\`. Không commit generated web assets, local SDK path, signing key hoặc store secret.
- Android manifest giữ `allowBackup=false` đồng thời khai báo cả `backup_rules.xml` và `data_extraction_rules.xml`; không bỏ một trong hai vì Android 12+ có hành vi device-transfer khác cloud backup.
- iOS app target phải đóng gói `PrivacyInfo.xcprivacy` với FileTimestamp reason `C617.1` và UserDefaults reason `CA92.1`. iOS session storage phải giữ `SecureStorage.setSynchronize(false)`, `whenUnlockedThisDeviceOnly` và key namespace `novastars_parent_session_device_only_v1`; legacy key phải được migrate rồi xóa, không bật iCloud Keychain sync cho Parent Zone session.
- Backup thủ công dùng dialog passphrase trong app: che input, yêu cầu tối thiểu 8 ký tự và nhập lại khi tạo; restore hỏi passphrase trước khi đọc/giải mã tệp. Trên native, export phải đi qua `parentBackupExport`: file mã hóa chỉ tồn tại tạm trong cache, được đưa vào OS Share/Save sheet và bị xóa trong `finally` cả khi người dùng hủy. Không ghi backup plaintext hoặc để file tạm trong Documents/Library.
- Android local compile đã được chứng minh bằng toolchain tạm Temurin Java 21.0.12.1 + SDK 36: debug lint có 0 error/13 warning, release lint có 0 error/11 warning. Ngày 23/08/2026, sau khi đồng bộ byte-for-byte web assets mới nhất, unit/debug APK/release AAB build lại pass 1032 task; hash artifact nằm trong gate evidence. Toolchain nằm ngoài repository; không commit SDK path hay debug signing material. AAB local chưa ký và tuyệt đối không upload Play Store. iOS build vẫn cần Xcode/macOS. Chỉ đóng toàn bộ native gate sau install, background/foreground, biometric fallback, backup/reinstall và network inspection trên thiết bị thật.
- Workflow `.github/workflows/parent-zone-verify.yml` có job `native-android` dùng Java 21 để build staging-review, sync Capacitor, chạy debug/release lint + unit + APK/AAB packaging và giữ APK, unsigned AAB, lint HTML/XML, JUnit results trong artifact 7 ngày. Có thể kích hoạt thủ công bằng `workflow_dispatch`; một job được khai báo chưa phải bằng chứng pass, nên vẫn phải lưu link GitHub run/commit khi job chạy xanh lần đầu.
- Trước khi upload artifact, CI giải nén cả debug APK và release AAB; mọi web asset đóng gói phải trùng byte với `dist`, chỉ có hai Cordova shim được phép thêm. CI fail nếu asset thiếu/cũ/bất ngờ hoặc gặp database URL, OTP pepper, admin token, RevenueCat webhook secret, private key hay source map. Staging API URL và demo review markers (`1234`/`123456`, God Mode) được phép trong staging-review artifact hiện tại; artifact này không được đổi tên hoặc coi là production build.
