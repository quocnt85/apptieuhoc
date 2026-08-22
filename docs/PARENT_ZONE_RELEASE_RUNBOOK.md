# Parent Zone — release runbook

Trạng thái code: client và Worker đã có đầy đủ luồng MVP; IAP mặc định **tắt**. Không bật production nếu các gate bên dưới chưa hoàn tất.

> Bản review hiện bật `VITE_PARENT_DEMO_ACCESS=true`, bỏ qua email/OTP và dùng mật khẩu `1234` chỉ trong bộ nhớ phiên. Đây là cổng demo tạm thời; bắt buộc đặt `false` trước pilot hoặc production có người dùng thật.

## 1. Database

Áp dụng migration theo đúng thứ tự, trên database staging trước:

```powershell
psql $env:NEON_DATABASE_URL -v ON_ERROR_STOP=1 -f server/migrations/0001_parent_auth.sql
psql $env:NEON_DATABASE_URL -v ON_ERROR_STOP=1 -f server/migrations/0002_wallet_ledger.sql
psql $env:NEON_DATABASE_URL -v ON_ERROR_STOP=1 -f server/migrations/0003_purchase_subscriptions.sql
psql $env:NEON_DATABASE_URL -v ON_ERROR_STOP=1 -f server/migrations/0004_audit_and_consent.sql
```

Không đưa connection string vào client. Production nên tạo Cloudflare Hyperdrive cho Neon và thêm binding `HYPERDRIVE` theo mẫu trong `server/wrangler.jsonc`; `NEON_DATABASE_URL` chỉ là fallback/dev.

## 2. Cloudflare Worker

Tạo secrets riêng cho staging và production:

```powershell
npx wrangler secret put NEON_DATABASE_URL --env staging
npx wrangler secret put SESSION_PEPPER --env staging
npx wrangler secret put OTP_PEPPER --env staging
npx wrangler secret put PIN_PEPPER --env staging
npx wrangler secret put REVENUECAT_WEBHOOK_SECRET --env staging
npx wrangler secret put ADMIN_UPLOAD_SECRET --env staging
```

Lặp lại với `--env production`. Pepper/secret phải là giá trị ngẫu nhiên khác nhau giữa môi trường, tối thiểu 32 byte. Chạy `npm run types`, `npm run typecheck`, `npm test` và `npm run deploy:dry-run` trước deploy.

## 3. Transactional email

- Thay `security@novastars.vn` nếu đây chưa phải domain chính thức.
- Onboard domain Cloudflare Email Sending, xác minh SPF/DKIM và giới hạn binding đúng sender.
- Đổi `EMAIL_DELIVERY_MODE=binding` chỉ sau khi gửi OTP thật thành công ở staging.
- Không log OTP ở staging/production. `debugOtp` chỉ được trả ở `ENVIRONMENT=development`.

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

## 6. Privacy và release gates

- Dùng network inspector xác nhận không request nào chứa nickname, grade, đáp án, progress, usage, nội dung nhiệm vụ hoặc ảnh.
- Kiểm tra production bundle không render God Mode/debug overlay và không chứa Neon URL.
- Xác minh session native nằm trong Keychain/Keystore; web chỉ dùng `sessionStorage`.
- Test PIN sai và lockout, OTP hết hạn/sai quá số lần, khóa khi app vào background, sinh trắc học chỉ được bật sau một lần nhập PIN thành công.
- Test xóa hồ sơ có hoàn kim cương về vault trước khi xóa local; test backup sai mật khẩu không ghi đè.
- `VITE_ENABLE_PENDING_HEALTH_CONTENT` phải giữ `false` cho đến khi nội dung mát-xa được hậu kiểm.
- Parent Zone có thể rollout độc lập qua `VITE_PARENT_ZONE_ENABLED`; mission qua `VITE_REAL_LIFE_REWARDS_ENABLED`.

## 7. Lệnh kiểm định

```powershell
cd server
npm run typecheck
npm test
npm run deploy:dry-run

cd ../client
npm run build
npm audit --omit=dev
npm run cap:sync
```
