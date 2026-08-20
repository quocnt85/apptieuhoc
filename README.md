# 🌟 NovaStars Competency Adventure Platform (NovaStars OS)
**Nền Tảng Giáo Dục Kỹ Năng Sống & Phiêu Lưu Năng Lực Dành Cho Học Sinh Tiểu Học (Lớp 1 – 5)**

---

## 🏛️ 3 TRỤ CỘT CỐT LÕI CỦA HỆ THỐNG (The 3 Core Pillars)

Dự án NovaStars được phân tách kiến trúc rõ ràng thành 3 trụ cột độc lập:

```
                                  ┌─────────────────────────────────────────────────────────┐
                                  │      NOVASTARS COMPETENCY ADVENTURE PLATFORM (OS)       │
                                  └─────────────────────────────────────────────────────────┘
                                           │                   │                   │
                     ┌─────────────────────┘                   │                   └─────────────────────┐
                     ▼                                         ▼                                         ▼
        ┌─────────────────────────┐               ┌─────────────────────────┐               ┌─────────────────────────┐
        │   1. CLIENT-FACING APP  │               │ 2. MODULAR KNOWLEDGE    │               │    3. ADMIN CENTER      │
        │       (`client/`)       │               │      (`wiki/`)          │               │   (`admin_center/`)     │
        ├─────────────────────────┤               ├─────────────────────────┤               ├─────────────────────────┤
        │ • Học sinh Lớp 1 - 5    │               │ • AI Agents & Prompts   │               │ • Ban Quản Trị & Chuyên Gia│
        │ • Chạy 10 Giai đoạn bài │               │ • Khung 125 Kỹ năng     │               │ • Master Review Hub     │
        │ • Nuôi thú đồng hành    │               │ • NLAS 10 Giai đoạn     │               │ • Design Standards      │
        │ • Parent Dashboard      │               │ • Quy tắc 3-File Nạp    │               │ • Handover Audit & Logs │
        └─────────────────────────┘               └─────────────────────────┘               └─────────────────────────┘
```

---

## 📂 BẢN ĐỒ TỔ CHỨC THƯ MỤC REPO (Repository Topology)

| Thư Mục / File | Bản Chất & Chức Năng | Liên Kết Tài Liệu |
| :--- | :--- | :--- |
| 📱 **`client/`** | Mã nguồn ứng dụng di động & web (React 18 + Vite + Tailwind + Capacitor v6 + Zustand). | [`client/README.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/client/README.md) |
| 🧠 **`wiki/`** | Bách khoa tri thức tinh gọn chuẩn phong cách Karpathy cho AI Agent nạp ngữ cảnh khi sinh bài học. | [`wiki/INDEX.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/INDEX.md) |
| 🏛️ **`admin_center/`** | Trung tâm quản trị, Review Hub 10 module V1/V2 và quy chuẩn thiết kế. | [`admin_center/index.html`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/admin_center/index.html) |
| 📚 **`docs/`** | 8 File Master PRD chuẩn hóa đóng băng (4 Master V1 + 4 Master V2 `v2.1.0`). | [`docs/PRD_V2/`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/docs/PRD_V2/) |
| 📊 **`data/`** | Dữ liệu nguồn: Excel gốc (`data/raw/`) và ma trận 125 kỹ năng JSON (`data/processed/`). | [`data/processed/extracted_skills.json`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/data/processed/extracted_skills.json) |
| ⚡ **`server/`** | Serverless Backend REST API xây dựng trên Cloudflare Workers Hono + Neon PostgreSQL DB + R2. | [`server/src/index.ts`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/server/src/index.ts) |
| ❓ **`question_bank/`**| Ngân hàng 680 câu hỏi tĩnh V1 và scripts kiểm thử. | [`question_bank/`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/question_bank/) |
| 📦 **`_archive/`** | Bản sao lưu an toàn 100% của 22 thư mục gốc và file nháp cũ. | [`_archive/`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/_archive/) |
| 📋 **`PROJECT_AUDIT...md`**| Báo cáo kiểm toán và bàn giao dự án toàn diện. | [`PROJECT_AUDIT_AND_HANDOVER_INVENTORY.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/PROJECT_AUDIT_AND_HANDOVER_INVENTORY.md) |

---

## 🛠️ HƯỚNG DẪN KHỞI CHẠY (Quick Start)

### 1. Khởi Chạy Web & Mobile Client (`client/`)
```bash
cd client
npm install
npm run dev
# Mở trình duyệt tại: http://localhost:5173
```

### 2. Khởi Chạy Serverless Backend API (`server/`)
```bash
cd server
npm install
npm run dev
# API chạy tại: http://localhost:8787
```

### 3. Mở Admin Center & Review Hub
Mở trực tiếp file [`admin_center/index.html`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/admin_center/index.html) trên trình duyệt hoặc chạy server review:
```bash
node scripts/serve_review.js
# Xem Wiki Dashboard tại: http://localhost:8080/project_knowledge_wiki_review.html
# Xem Admin Center Hub tại: http://localhost:8080/admin_center/index.html
```

---

## 🔒 TIÊU CHUẨN AN TOÀN & BẢO MẬT
- **Safe Failure**: Tuyệt đối không trừ điểm sinh mệnh (Zero HP penalty) khi trẻ trả lời sai.
- **Child Privacy**: Tuân thủ tiêu chuẩn an toàn trẻ em COPPA & GDPR Kids.
- **AI Guardrails**: Giới hạn $\le 25$ từ/thoại, không tạo nội dung tiêu cực hoặc bạo lực.
