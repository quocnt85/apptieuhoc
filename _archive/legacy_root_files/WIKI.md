# 🌟 DỰ ÁN NOVASTARS LIFE SKILLS ADVENTURE - TRANG WIKI TỔNG HỢP (MASTER WIKI)

> **Dự án**: Game Giáo Dục Kỹ Năng Sống Tiểu Học NovaStars  
> **Đơn vị phát triển**: NovaStars Education & Gaming Lab  
> **Phiên bản Wiki**: 1.0 (Cập nhật ngày 31/07/2026)  
> **Trạng thái**: Đã hoàn thành Giai đoạn 1 (Khung Năng Lực, Blueprint & Ngân hàng Câu hỏi)

---

## 📌 TỔNG QUAN DỰ ÁN & THỐNG KÊ KẾT QUẢ

**NovaStars Life Skills Adventure** là hệ sinh thái game nhập vai phiêu lưu giáo dục kết hợp trợ lý AI thông minh (Nova), giúp học sinh tiểu học (từ 6 - 11 tuổi, Lớp 1 đến Lớp 5) hình thành, rèn luyện và làm chủ 40 kỹ năng sống cốt lõi thông qua trải nghiệm chơi mà học, học mà phiêu lưu.

### 📊 Bảng Thống Kê Tổng Quan Kết Quả Dự Án

| Hạng mục | Chỉ số | Mô tả / Ghi chú |
| :--- | :--- | :--- |
| **Tổng số Module Dự án** | **10 Modules** | Từ `00_Project Charter` đến `09_Roadmap` |
| **Số Kỹ năng Cốt lõi** | **40 Kỹ năng** | Được phân chia đều vào 6 nhóm năng lực chính |
| **Nhóm Năng lực Kỹ năng** | **6 Nhóm** | Tự chăm sóc, An toàn, Giao tiếp, Thuyết trình, Tự quản, Kỹ năng Số & Tài chính |
| **Tổng số Câu hỏi Tình huống**| **680 Câu hỏi**| Biên soạn chi tiết theo chuẩn LSCAF (có đáp án & giải thích pedagogy) |
| **Số Tầng Đánh giá (LSCAF)** | **3 Tiers** | Tier A (Biết - Knowledge), Tier B (Dụng - Practice), Tier C (Ngộ - Reflection) |
| **Quyết định Kiến trúc (ADR)**| **3 Decision Logs**| DEC-2026-001, DEC-2026-002, DEC-2026-003 đã được đóng băng |
| **Giai đoạn Lộ trình (Roadmap)**| **4 Giai đoạn** | Hiện đã hoàn thành Phase 1; chuẩn bị bước sang Phase 2 (UI/UX Prototype) |

---

## 🗂️ MỤC LỤC DANH MỤC 10 MODULES ĐÃ HOÀN THÀNH

Below is the directory mapping of all completed modules inside the project:

```
apptieuhoc/
├── 00_Project Charter/               # [Module 00] Tuyên ngôn & Tầm nhìn Dự án
├── 01_Product Foundation/            # [Module 01] Nền tảng Sản phẩm & Blueprint (Epic 1)
├── 02_Curriculum Framework/          # [Module 02] Khung Năng lực Novastars LSCAF & Schema
├── 03_Game Design Bible/             # [Module 03] Thiết kế Trò chơi & Cơ chế Gamification
├── 04_AI Bible/                      # [Module 04] Triết lý, Trợ lý AI Nova & Guardrails
├── 05_Design System/                 # [Module 05] Ngôn ngữ Thiết kế UI/UX & Linh vật Nova
├── 06_Technical Architecture/        # [Module 06] Kiến trúc Kỹ thuật & API Specifications
├── 07_Content Production SOP/        # [Module 07] Quy trình Biên soạn & QA Nội dung 6 bước
├── 08_Decision Log/                  # [Module 08] Nhật ký Quyết định Đã Đóng băng (ADRs)
├── 09_Roadmap/                       # [Module 09] Lộ trình Phát triển & Phân công AI Agents
└── question_bank/                    # Ngân hàng 680 câu hỏi tình huống & File dữ liệu JS
```

---

## 🛠️ CHI TIẾT NỘI DUNG TỪNG MODULE DỰ ÁN

---

### 📘 MODULE 00: PROJECT CHARTER (DẠNG FILE & ĐIỂM CỐT LÕI)
- **Tài liệu tham chiếu**: [`00_Project Charter/README.md`](file:///Users/thuy/Documents/apptieuhoc/00_Project%20Charter/README.md)
- **Mục tiêu**: Định hình sứ mệnh, giá trị cốt lõi và tiêu chuẩn an toàn cho sản phẩm giáo dục tiểu học.
- **Điểm cốt lõi**:
  - **Sứ mệnh**: Giúp trẻ em Việt Nam rèn luyện kỹ năng tự lập, an toàn và giao tiếp thông qua thế giới ảo Nova Land.
  - **Đối tượng sử dụng**: Học sinh tiểu học 6-11 tuổi (User chính) và Phụ huynh/Giáo viên (User giám sát & hỗ trợ).
  - **Tiêu chuẩn An toàn**: Tuân thủ tiêu chuẩn an toàn dữ liệu trẻ em COPPA & GDPR Kids, không quảng cáo thương mại, không có cơ chế quay thưởng nạp tiền độc hại (No Pay-to-Win / No Gacha).

---

### 📕 MODULE 01: PRODUCT FOUNDATION & BLUEPRINT (EPIC 1)
- **Tài liệu tham chiếu**: 
  - [`01_Product Foundation/PRODUCT_FOUNDATION.md`](file:///Users/thuy/Documents/apptieuhoc/01_Product%20Foundation/PRODUCT_FOUNDATION.md)
  - [`01_Product Foundation/PRODUCT_BLUEPRINT.md`](file:///Users/thuy/Documents/apptieuhoc/01_Product%20Foundation/PRODUCT_BLUEPRINT.md)
- **Mục tiêu**: Xây dựng nền tảng sản phẩm toàn diện cho Epic 1, định nghĩa cơ chế kết hợp giữa Giáo dục (Pedagogy) và Trò chơi (Gamification).
- **Vòng lặp Học tập Cốt lõi (Learning Loop)**:
  1. **Học tập tương tác (Learn)**: Khám phá kịch bản tình huống cùng Trợ lý AI Nova.
  2. **Thực hành Mini-game (Practice)**: Giải đố, lựa chọn hành vi đúng trong môi trường ảo.
  3. **Phản tư & Nhiệm vụ Đời thực (Reflect & Real-world Mission)**: Áp dụng bài học vào cuộc sống thực tế dưới sự xác nhận của phụ huynh.
  4. **Làm chủ Kỹ năng (Mastery)**: Nhận Huy hiệu Năng lực, mở khóa trang phục và khu vực phiêu lưu mới.

---

### 📗 MODULE 02: CURRICULUM FRAMEWORK (KHUNG NĂNG LỰC LSCAF)
- **Tài liệu tham chiếu**:
  - [`02_Curriculum Framework/UNIVERSAL_COMPETENCY_FRAMEWORK.md`](file:///Users/thuy/Documents/apptieuhoc/02_Curriculum%20Framework/UNIVERSAL_COMPETENCY_FRAMEWORK.md)
  - [`02_Curriculum Framework/DATABASE_SCHEMA.md`](file:///Users/thuy/Documents/apptieuhoc/02_Curriculum%20Framework/DATABASE_SCHEMA.md)
  - [`02_Curriculum Framework/SKILL_TEMPLATE.md`](file:///Users/thuy/Documents/apptieuhoc/02_Curriculum%20Framework/SKILL_TEMPLATE.md)
- **Khung Năng lực Novastars LSCAF**: Bao gồm **40 Kỹ năng Cốt lõi** được chuẩn hóa thành 3 tầng nhận thức (Bloom Taxonomy):
  - **Tier A - Knowledge (Biết)**: Phân biệt hành vi đúng/sai, nhận biết khái niệm.
  - **Tier B - Application (Dụng)**: Áp dụng quy trình xử lý tình huống trong mini-game.
  - **Tier C - Mastery & Reflection (Ngộ)**: Giải thích lý do, thực hành hành vi ngoài đời thực.

#### 📋 Danh sách 6 Nhóm Năng Lực & 40 Kỹ Năng Cốt Lõi:
1. **Nhóm 1: Tự chăm sóc & An toàn cá nhân (8 Kỹ năng)**
   - Vệ sinh cá nhân, Dinh dưỡng hợp lý, Phòng tránh đi lạc, An toàn điện/nước, Xử lý khi bị thương nhẹ, An toàn giao thông, Phòng tránh xâm hại, Ứng phó thiên tai/hỏa hoạn.
2. **Nhóm 2: An toàn & Tư duy cơ bản (7 Kỹ năng)**
   - Nhận diện nguy hiểm, Quản lý thời gian, Sắp xếp đồ đạc, Tư duy phản biện đơn giản, Quan sát & Ghi nhớ, Giải quyết vấn đề đơn giản, Đặt mục tiêu cá nhân.
3. **Nhóm 3: Giao tiếp & Cảm xúc (7 Kỹ năng)**
   - Nhận diện cảm xúc, Quản lý cơn giận, Lắng nghe tích cực, Nói lời cảm ơn & xin lỗi, Giao tiếp lịch sự, Thể hiện sự đồng cảm, Kết bạn & Hòa nhập.
4. **Nhóm 4: Thuyết trình & Học đường (6 Kỹ năng)**
   - Tự giới thiệu bản thân, Thuyết trình trước đám đông, Quản lý góc học tập, Đọc sách hiệu quả, Lập kế hoạch học tập, Hợp tác làm việc nhóm.
5. **Nhóm 5: Trách nhiệm & Tự quản (6 Kỹ năng)**
   - Giúp đỡ việc nhà, Bảo vệ môi trường/tiết kiệm năng lượng, Yêu thương động vật, Tôn trọng quy định chung, Trung thực trong cuộc sống, Tự giác học tập.
6. **Nhóm 6: Kỹ năng Số & Tài chính cơ bản (6 Kỹ năng)**
   - Nhận diện tiền tệ & Giá trị, Tiết kiệm tiền xu, Phân biệt Cần vs Muốn, An toàn trên Internet, Quản lý thời gian xem màn hình (Screen time), Ứng xử văn minh trên mạng.

---

### 📙 MODULE 03: GAME DESIGN BIBLE (THIẾT KẾ TRÒ CHƠI)
- **Tài liệu tham chiếu**: [`03_Game Design Bible/GAME_DESIGN_BIBLE.md`](file:///Users/thuy/Documents/apptieuhoc/03_Game%20Design%20Bible/GAME_DESIGN_BIBLE.md)
- **Thế giới Game - Hành tinh Nova Land**:
  - Gồm 5 Đảo Nguyên Tố: Đảo Thần Thái (Cảm xúc), Đảo Trí Tuệ (Tư duy), Đảo An Toàn (Kỹ năng an toàn), Đảo Kết Nối (Giao tiếp), Đảo Ngôi Sao (Kỳ thi Năng lực).
- **Cơ chế Gameplay**:
  - **Chế độ Phiêu lưu (Story Mode)**: Theo chân Linh vật Nova vượt qua các thử thách kịch bản.
  - **Đấu Boss Năng Lực (Boss Battles)**: Thử thách tổng hợp giải quyết kịch bản phức tạp ở cuối mỗi đảo.
  - **Hệ thống Phần thưởng**: Ngôi sao XP, Huy hiệu Năng lực, Năng lượng Trí tuệ, Trang phục Linh vật.

---

### 🤖 MODULE 04: AI BIBLE (TRIẾT LÝ & HÀNG RÀO BẢO VỆ AI)
- **Tài liệu tham chiếu**: [`04_AI Bible/README.md`](file:///Users/thuy/Documents/apptieuhoc/04_AI%20Bible/README.md)
- **Nhân vật AI Companion (Nova)**:
  - Giọng điệu: Thân thiện, khích lệ, kiên nhẫn, sử dụng từ ngữ dễ hiểu cho học sinh tiểu học.
- **Hàng rào Bảo vệ (Safety Guardrails)**:
  - **Zero-Toxic Prompt Policy**: Ngăn chặn tuyệt đối nội dung bạo lực, người lớn, nhạy cảm hoặc định kiến.
  - **Thuật toán IRIS**: Tự động điều chỉnh độ khó bài tập dựa trên lịch sử làm bài và tốc độ phản ứng của học sinh.
  - **Phản hồi Tích cực (Positive Reinforcement)**: Không phạt nặng khi làm sai, tập trung hướng dẫn tìm ra nguyên nhân và cách làm đúng.

---

### 🎨 MODULE 05: DESIGN SYSTEM (HỆ THỐNG THIẾT KẾ UI/UX)
- **Tài liệu tham chiếu**: [`05_Design System/README.md`](file:///Users/thuy/Documents/apptieuhoc/05_Design%20System/README.md)
- **Bảng màu Chủ đạo**:
  - **Nova Blue (`#1E40AF`)**: Màu nền chính, tạo sự tin cậy và hiện đại.
  - **Star Yellow (`#F59E0B`)**: Màu điểm nhấn phần thưởng, ngôi sao và điểm XP.
  - **Emerald Green (`#10B981`)**: Màu thành công, đáp án đúng và năng lượng tích cực.
  - **Soft Purple (`#8B5CF6`)**: Màu phép thuật, trí tuệ và khám phá.
- **Typography & Accessibility**:
  - Font chữ tròn, thân thiện: **Fredoka** (Tiêu đề), **Quicksand** (Văn bản chính).
  - Kích thước nút bấm lớn (tối thiểu 48x48px) giúp trẻ nhỏ dễ dàng thao tác cảm ứng trên máy tính bảng.

---

### 💻 MODULE 06: TECHNICAL ARCHITECTURE (KIẾN TRÚC KỸ THUẬT)
- **Tài liệu tham chiếu**: [`06_Technical Architecture/README.md`](file:///Users/thuy/Documents/apptieuhoc/06_Technical%20Architecture/README.md)
- **Mô hình Kiến trúc**:
  - **Client Layer**: Single Page App / Progressive Web App (HTML5 Canvas, CSS Grid/Flexbox, JavaScript ES6+).
  - **Database Layer**:
    - *Static Data (Cục bộ/CDN)*: Ngân hàng câu hỏi `questions_data.js` giúp tải ứng dụng tức thì và hoạt động Offline.
    - *Dynamic Data (Cloud Firestore)*: Lưu tiến trình người chơi, tài khoản phụ huynh, lịch sử nhận huy hiệu.
  - **API Specifications**: Luồng nộp bài phản tư, luồng duyệt nhiệm vụ thực tế từ phụ huynh qua Zalo/App.

---

### ⚙️ MODULE 07: CONTENT PRODUCTION SOP (QUY TRÌNH BIÊN SOẠN)
- **Tài liệu tham chiếu**: [`07_Content Production SOP/README.md`](file:///Users/thuy/Documents/apptieuhoc/07_Content%20Production%20SOP/README.md)
- **Quy trình 6 bước Biên soạn Nội dung chuẩn hóa**:
  1. *Curriculum Setup*: Xác định mục tiêu kỹ năng theo khung LSCAF.
  2. *AI Drafting*: Trợ lý AI tạo bản nháp câu hỏi và kịch bản tình huống.
  3. *Editor Review*: Chuyên gia giáo dục chỉnh sửa ngôn từ phù hợp lứa tuổi.
  4. *Automated Verification*: Chạy script kiểm tra cấu trúc dữ liệu JSON/JS.
  5. *Database Compilation*: Biên dịch vào ngân hàng câu hỏi tổng hợp.
  6. *Visual QA*: Kiểm thử trực quan trên giao diện ứng dụng.

---

### 📌 MODULE 08: DECISION LOG (NHẬT KÝ QUYẾT ĐỊNH ĐÃ ĐÓNG BĂNG)
- **Tài liệu tham chiếu**: [`08_Decision Log/README.md`](file:///Users/thuy/Documents/apptieuhoc/08_Decision%20Log/README.md)
- **Các ADRs quan trọng đã đóng băng**:
  - **DEC-2026-001**: Khóa Khung Chương trình 40 Kỹ năng Cốt lõi cho Tiểu học.
  - **DEC-2026-002**: Áp dụng Hệ thống Đánh giá 3 Tầng LSCAF (Biết - Dụng - Ngộ).
  - **DEC-2026-003**: Biên dịch Ngân hàng Câu hỏi Tĩnh thành File JavaScript (`questions_data.js`) phát hành qua CDN để tối ưu tốc độ và chi phí Server.

---

### 🗺️ MODULE 09: ROADMAP (LỘ TRÌNH PHÁT TRIỂN & PHÂN CÔNG AGENTS)
- **Tài liệu tham chiếu**: [`09_Roadmap/README.md`](file:///Users/thuy/Documents/apptieuhoc/09_Roadmap/README.md)
- **4 Giai đoạn Phát triển chính**:
  - **Giai đoạn 1 (Đã hoàn thành)**: Thiết lập Khung Chương trình, Blueprint & Ngân hàng 680 Câu hỏi.
  - **Giai đoạn 2 (Tiếp theo)**: Xây dựng UI/UX Design & Game Client Prototype.
  - **Giai đoạn 3 (Q3/2026)**: Tích hợp AI Companion Engine (Nova) & Backend Sync.
  - **Giai đoạn 4 (Q4/2026)**: Kiểm thử Beta toàn quốc & Chính thức ra mắt.

---

## 🗃️ THỐNG KÊ NGÂN HÀNG CÂU HỎI (QUESTION BANK ENGINE)

- **Tài liệu & Data**: 
  - File dữ liệu compiled: [`question_bank/questions_data.js`](file:///Users/thuy/Documents/apptieuhoc/question_bank/questions_data.js)
  - Ứng dụng xem câu hỏi Standalone: [`review_standalone.html`](file:///Users/thuy/Documents/apptieuhoc/review_standalone.html)

### Phân bổ 680 Câu hỏi theo Nhóm Kỹ Năng trong Hệ Thống:
1. **Tự chăm sóc & An toàn (Group 1)**: 160 câu hỏi
2. **An toàn & Tư duy cơ bản (Group 2)**: 120 câu hỏi
3. **Giao tiếp & Cảm xúc (Group 3)**: 140 câu hỏi
4. **Thuyết trình & Học đường (Group 4)**: 140 câu hỏi
5. **Trách nhiệm & Tự quản (Group 5)**: 120 câu hỏi

---

## 🔗 LIÊN KẾT NHANH TỚI CÁC TÀI LIỆU TRONG WORKSPACE

- 📄 [Tuyên ngôn Dự án (Project Charter)](file:///Users/thuy/Documents/apptieuhoc/00_Project%20Charter/README.md)
- 📄 [Nền tảng Sản phẩm (Product Foundation)](file:///Users/thuy/Documents/apptieuhoc/01_Product%20Foundation/PRODUCT_FOUNDATION.md)
- 📄 [Bản thiết kế Sản phẩm (Product Blueprint)](file:///Users/thuy/Documents/apptieuhoc/01_Product%20Foundation/PRODUCT_BLUEPRINT.md)
- 📄 [Khung Năng lực Chung (Universal Competency Framework)](file:///Users/thuy/Documents/apptieuhoc/02_Curriculum%20Framework/UNIVERSAL_COMPETENCY_FRAMEWORK.md)
- 📄 [Lược đồ CSDL (Database Schema)](file:///Users/thuy/Documents/apptieuhoc/02_Curriculum%20Framework/DATABASE_SCHEMA.md)
- 📄 [Chuẩn Hợp đồng Tác nhân AI (AI Agent Contract Standard - ACS)](file:///Users/thuy/Documents/apptieuhoc/04_AI%20Bible/NOVASTARS_AI_AGENT_CONTRACT_STANDARD.md)
- 📄 [Bản thiết kế Tổ chức AI (AI Organization Blueprint - AIOB)](file:///Users/thuy/Documents/apptieuhoc/04_AI%20Bible/NOVASTARS_AI_ORGANIZATION_BLUEPRINT.md)
- 📄 [Kinh thánh Thiết kế Game (Game Design Bible)](file:///Users/thuy/Documents/apptieuhoc/03_Game%20Design%20Bible/GAME_DESIGN_BIBLE.md)
- 📄 [Ứng dụng Wiki tương tác Web (wiki.html)](file:///Users/thuy/Documents/apptieuhoc/wiki.html)

---
*Trang Wiki này được tổng hợp và tự động chuẩn hóa bởi Antigravity AI Assistant.*
