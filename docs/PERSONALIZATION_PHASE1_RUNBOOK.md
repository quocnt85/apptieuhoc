# Personalization Phase 1 — Avatar & Wardrobe Runbook

## Đã triển khai

- Xưởng Avatar dùng chung ở hồ sơ trẻ.
- Ba avatar preset, ảnh local 3:4, preview trước khi lưu và khôi phục sau reload.
- Composer dùng nhất quán tại Home, Header và Profile.
- Catalog nhỏ gồm 3 outfit, 3 headgear, 3 accessory (kể cả none), 2 frame và 2 background.
- Preview tách khỏi equipped state; xem thử không trừ Xu.
- Purchase/equip đồng bộ, vật phẩm đã sở hữu không bị trừ tiền lần hai.
- Schema v3 tự bổ sung field wardrobe cho dữ liệu Phase 0 đã tồn tại.
- IndexedDB lưu ArrayBuffer thay vì Blob để tương thích WebKit iPhone X.

## Feature gate

Wardrobe/preset hoạt động offline trên web. Chụp/chọn ảnh chỉ hiển thị trong development hoặc khi `VITE_ENABLE_PHOTO_AVATAR=true`. Production giữ flag này tắt cho đến khi native smoke gate của Phase 0 pass. Ảnh đã migrate trước đó vẫn render và không bị xóa.

## Xác minh

```powershell
cd client
npm run test:unit
npm run build
.\node_modules\.bin\playwright.cmd test personalization-avatar.spec.ts --project="Minimum iOS (iPhone X WebKit)"
```

E2E kiểm tra preview không trừ tiền, mua chỉ trừ một lần, ownership sống qua reload, ảnh được xử lý/lưu local và render lại sau reload.

## Chưa làm trong phase này

- Pan/zoom crop editor thủ công; bản hiện tại dùng center crop 3:4 an toàn.
- Art PNG/WebP production theo canvas contract 768×1024; catalog hiện dùng lớp emoji/CSS nhẹ để hoàn thiện behavior trước.
- Native permission/kill-restore smoke trên Android/iOS thật.
