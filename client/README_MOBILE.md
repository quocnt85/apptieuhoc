# Hướng Dẫn Đóng Gói Mobile Ứng Dụng NovaStars với Capacitor

Tài liệu này hướng dẫn các bước để xuất bản và kiểm thử ứng dụng **NovaStars** trên **Android (APK/AAB)** và **iOS (IPA)** bằng Capacitor.

---

## 1. Yêu cầu Hệ thống
- **Node.js**: >= 18.x
- **Android**: Đã cài đặt Android Studio & Android SDK (API 33+)
- **iOS**: MacOS với Xcode 15+ và CocoaPods (để build iOS)

---

## 2. Các Bước Build & Đồng Bộ (Workflow)

### Bước 1: Cài đặt Dependencies trong thư mục `client/`
```bash
cd client
npm install
```

### Bước 2: Build Web App ra thư mục `dist/`
```bash
npm run build
```

### Bước 3: Khởi tạo & Thêm Nền Tảng Native (Chỉ chạy 1 lần đầu)
```bash
# Thêm Android project
npx cap add android

# Thêm iOS project (trên MacOS)
npx cap add ios
```

### Bước 4: Đồng bộ Code Web vào Native Container
Mỗi khi có thay đổi code giao diện hoặc tính năng, chạy lệnh:
```bash
npm run build
npx cap sync
```

### Bước 5: Mở Android Studio / Xcode để Run & Debug trên Thiết Bị Thật
```bash
# Mở Android Studio
npx cap open android

# Mở Xcode (trên Mac)
npx cap open ios
```

---

## 3. Các Plugin Native Đã Được Tích Hợp Sẵn Trong App
- `@capacitor/haptics`: Rung phản hồi cảm xúc khi trẻ làm đúng/sai.
- `@capacitor/screen-orientation`: Khóa màn hình ngang/dọc tối ưu cho game.
- `@capacitor/status-bar`: Điều khiển status bar toàn màn hình.
- `@capacitor/preferences`: Lưu cache ngoại tuyến tiến trình học tập khi không có Internet.
- `@capacitor/network`: Tự động phát hiện trạng thái mạng online/offline để đồng bộ dữ liệu với Neon DB.
