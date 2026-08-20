# NovaStars Modular Knowledge Wiki (Karpathy-Style)

> **Mục tiêu**: Cung cấp tri thức tinh đặc, chuẩn xác và module hóa tuyệt đối để AI Agent hoặc con người nạp ngữ cảnh tối ưu khi thiết kế và biên soạn bài học kỹ năng sống tiểu học (Lớp 1 đến Lớp 5).

---

## 1. Nguyên Tắc Nạp Ngữ Cảnh Cho AI Agent (Agent Ingestion Rules)

Khi tạo một bài học mới, **KHÔNG nạp toàn bộ wiki**. Chỉ nạp đúng 3 file theo công thức:

$$\text{Context} = \text{Core Schema (00\_CORE)} + \text{Core Pedagogical Rules (00\_CORE)} + \text{Domain Knowledge (01\_DOMAINS)}$$

---

## 2. Bản Đồ Thư Mục Wiki (Directory Map)

### 📁 `00_CORE/` (Quy Chuẩn Chung - AI Luôn Nạp)
1. [`nlas_10_stages.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/00_CORE/nlas_10_stages.md): Chi tiết cấu trúc và cơ chế gameplay của 10 giai đoạn bài học (Pretest $\rightarrow$ Story $\rightarrow$ Gestures $\rightarrow$ Matching $\rightarrow$ Sequence $\rightarrow$ Boss Battle $\rightarrow$ Reflection $\rightarrow$ Mission $\rightarrow$ Parent Confirm $\rightarrow$ Posttest).
2. [`content_schema.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/00_CORE/content_schema.md): TypeScript Interfaces & JSON Schema chuẩn để bài học xuất ra nạp thẳng vào app client.
3. [`pedagogical_guardrails.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/00_CORE/pedagogical_guardrails.md): Giới hạn tâm lý & nhận thức trẻ em (độ dài câu chữ, giọng điệu khích lệ, an toàn thông tin COPPA/GDPR Kids).

---

### 📁 `01_DOMAINS/` (Tri Thức Chuyên Sâu 5 Miền - AI Chỉ Nạp 1 Miền Khi Viết Bài)
1. [`financial_literacy.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/01_DOMAINS/financial_literacy.md): **Miền Tài Chính**: Tiết kiệm, phân biệt Cần vs Muốn, lập ngân sách nhỏ, giá trị sức lao động (Lớp 1-5).
2. [`safety_and_protection.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/01_DOMAINS/safety_and_protection.md): **Miền An Toàn**: Safe Touch (5 vùng riêng tư), Từ chối người lạ (No-Go-Tell), An toàn giao thông, Điện/Lửa/Đi lạc (Lớp 1-5).
3. [`sel_and_communication.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/01_DOMAINS/sel_and_communication.md): **Miền Cảm Xúc & Giao Tiếp (SEL)**: Lời chào tự tin, Quản lý cơn giận, Nói lời cảm ơn/xin lỗi, Lắng nghe, Kết bạn (Lớp 1-5).
4. [`self_care_and_health.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/01_DOMAINS/self_care_and_health.md): **Miền Tự Chăm Sóc & Sức Khỏe**: Dinh dưỡng 4 nhóm chất, Bảo vệ mắt, Giấc ngủ, Vệ sinh cá nhân, Tuổi dậy thì (Lớp 1-5).
5. [`digital_and_study_skills.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/01_DOMAINS/digital_and_study_skills.md): **Miền Kỹ Năng Số & Học Đường**: An toàn Internet, Quản lý thời gian xem màn hình, Tự tin thuyết trình, Sắp xếp góc học tập (Lớp 1-5).

---

### 📁 `02_TEMPLATES/` (Khuôn Mẫu & Prompt Sinh Bài Học)
1. [`prompt_generate_lesson.md`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/02_TEMPLATES/prompt_generate_lesson.md): System prompt chuẩn để ra lệnh cho LLM sinh gói bài học mới.
2. [`golden_lesson_sample.json`](file:///c:/Users/Nova/.gemini/antigravity/scratch/apptieuhoc/wiki/02_TEMPLATES/golden_lesson_sample.json): File JSON mẫu chuẩn 100% của Bài 1 (Đảo Dũng Cảm) làm đối chứng (Few-Shot Reference).
