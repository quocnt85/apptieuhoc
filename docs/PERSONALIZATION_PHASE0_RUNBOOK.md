# Personalization Phase 0 — Media Foundation Runbook

## Trạng thái

Phase 0 foundation đã được triển khai ở web/runtime và sẵn sàng cho native smoke test sau khi repository khởi tạo thư mục Android/iOS.

## Thành phần đã có

- Metadata schema v3 trong `usePersonalizationStore`; binary/Base64 bị chặn khỏi persisted state.
- IndexedDB adapter cho web, Capacitor Filesystem adapter cho native và in-memory adapter cho unit test.
- Media persistent dùng `Directory.Library`; export tái tạo được dùng `Directory.Cache`.
- Write → commit metadata → delete file cũ; delete idempotent, orphan reconciliation và cleanup export sau 24 giờ.
- Migration ảnh `photoDataUrl` cũ sang file local; chỉ xóa giá trị cũ sau khi conversion thành công.
- Camera URI capture và `appRestoredResult` cho Android activity recovery.
- Image validation/crop/resize local; output mới loại bỏ metadata nguồn.
- `ParentGatePort` dùng session của Parent Zone, tự khóa khi background/hidden/hết hạn và không lưu PIN.
- Xóa hồ sơ/xóa tài khoản gọi media cleanup trước khi xóa metadata.
- Feature flags local; chỉ `localMediaFoundation` bật mặc định.

## Kiểm thử tự động

```powershell
cd client
npm run test:unit
npm run build
npx cap sync
```

Unit test bao phủ storage isolation, idempotent delete/clear, cache expiry và Parent Gate session/forced reauthentication.

Mobile regression trên project `Minimum iOS (iPhone X WebKit)` hiện pass 6/9 test. Ba test legacy còn đỏ nhưng không đi qua code Phase 0: audio unlock timeout, debug overlay bị kỳ vọng trong production build và kịch bản Parent Quest cũ đã bị Parent Zone thay thế. Đây là baseline test debt cần cập nhật riêng, không được coi là native media smoke test.

## Native gate còn lại

Repository hiện chưa có `client/android` và `client/ios`, nên Phase 0 chưa thể tuyên bố hoàn thành native exit criteria. Sau `npx cap add android` hoặc `npx cap add ios`, làm theo `client/README_MOBILE.md` để thêm usage descriptions/privacy manifest rồi kiểm tra:

1. Camera allow, deny, deny vĩnh viễn, cancel và cấp lại từ Settings.
2. Android kill/restore khi Camera activity đang mở.
3. Ảnh còn hiển thị sau restart ở airplane mode.
4. Thay ảnh 10 lần không để orphan file.
5. Xóa hồ sơ xóa file và metadata.
6. Share cancel/success và cache được dọn sau 24 giờ.

Không bật `photoAvatar`, `territoryFlag` hoặc `captainIdExport` ở production trước khi native gate này pass.
