# 📁 08_Decision Log: Nhật ký Quyết định Dự án

Tài liệu này lưu trữ toàn bộ các quyết định chiến lược về mặt sản phẩm, kỹ sư hệ thống, và phương pháp giáo dục đã được đội ngũ lãnh đạo thông qua (Frozen). Mọi thay đổi đối với các quyết định này bắt buộc phải kích hoạt quy trình tái phê duyệt (Re-approval).

---

## 1. Mẫu Ghi nhận Quyết định (Decision Log Template)
Mỗi quyết định được ghi lại phải tuân thủ cấu trúc sau:
*   **Mã quyết định**: `DEC-[Năm]-[Số thứ tự]` (ví dụ: `DEC-2026-001`).
*   **Tên quyết định**: Tóm tắt nội dung quyết định.
*   **Người phê duyệt (Approver)**: Vai trò phê duyệt chính (ví dụ: CPO, Tech Architect, CLO).
*   **Thời điểm**: Ngày đưa ra quyết định.
*   **Trạng thái**: `DRAFT` (Dự thảo) $\rightarrow$ `REVIEW` (Đang đánh giá) $\rightarrow$ `APPROVED` (Đã phê duyệt) $\rightarrow$ `FROZEN` (Đóng băng).
*   **Bối cảnh & Vấn đề**: Tại sao cần đưa ra quyết định này.
*   **Giải pháp lựa chọn & Rationale**: Giải pháp được chọn và lý do tại sao nó tốt nhất.
*   **Trade-offs (Đánh đổi)**: Phân tích ưu và nhược điểm của lựa chọn này.
*   **Ảnh hưởng về sau (Impact)**: Ảnh hưởng của quyết định đến thiết kế, phát triển và chi phí trong các giai đoạn sau.

---

## 2. Danh sách Quyết định Đã Đóng băng (Frozen Decisions)

### 📌 DEC-2026-001: Khóa Khung Chương trình 34 Kỹ năng Cốt lõi
*   **Thời điểm**: 30/07/2026
*   **Người phê duyệt**: Chief Learning Officer (CLO) & Curriculum Expert
*   **Trạng thái**: **FROZEN**
*   **Bối cảnh**: Cần xác định phạm vi giảng dạy kỹ năng sống cho giai đoạn phát triển ban đầu của nền tảng mà không làm quá tải nội dung sản xuất.
*   **Lựa chọn & Rationale**: Chọn bộ khung gồm 34 kỹ năng cốt lõi (phân chia thành 6 nhóm: Tự chăm sóc & An toàn, Tư duy cơ bản, Giao tiếp & Cảm xúc, Thuyết trình, Trách nhiệm & Tự quản). Bộ khung này bao phủ đầy đủ các năng lực hành vi thiết yếu cho học sinh tiểu học bám sát chương trình giáo dục phổ thông mới của Việt Nam và các chuẩn kỹ năng thế kỷ 21.
*   **Trade-offs**:
    *   *Ưu điểm*: Định hướng rõ ràng cho đội ngũ sản xuất nội dung, tránh lan man.
    *   *Nhược điểm*: Phải loại bỏ một số kỹ năng nâng cao hơn (sẽ bổ sung ở các phase mở rộng sau).
*   **Ảnh hưởng về sau**: Làm cơ sở dữ liệu đầu vào cứng để biên soạn câu hỏi và thiết kế 6 hòn đảo trên Adventure Map.

---

### 📌 DEC-2026-002: Áp dụng Khung Đánh giá Đa tầng LSCAF (5 tầng, 20 câu hỏi/kỹ năng)
*   **Thời điểm**: 30/07/2026
*   **Người phê duyệt**: Chief Learning Officer (CLO) & Child Psychologist
*   **Trạng thái**: **FROZEN**
*   **Bối cảnh**: Cần phương thức đánh giá trẻ thực chất, tránh việc trẻ học vẹt đáp án trắc nghiệm lý thuyết.
*   **Lựa chọn & Rationale**: Chia lộ trình đánh giá mỗi kỹ năng làm 5 tầng (Tier A: Biết $\rightarrow$ Tier B: Hiểu $\rightarrow$ Tier C: Lựa chọn $\rightarrow$ Tier D: Đánh giá hành vi $\rightarrow$ Tier E: Vận dụng & Phản tư). Mỗi kỹ năng biên soạn đúng 20 câu hỏi.
*   **Trade-offs**:
    *   *Ưu điểm*: Đánh giá toàn diện nhận thức, tư duy ra quyết định và sự phản tư cá nhân.
    *   *Nhược điểm*: Khối lượng biên soạn nội dung lớn (tổng cộng 680 câu hỏi cho 34 kỹ năng) và yêu cầu AI Companion phải đủ thông minh để chấm điểm phần Phản tư (Tier E).
*   **Ảnh hưởng về sau**: Quy định cứng cấu trúc dữ liệu của file JSON/JS và logic chuyển tầng nhận thức của ứng dụng di động.

---

### 📌 DEC-2026-003: Phân phối Ngân hàng Câu hỏi Tĩnh qua CDN dưới dạng JavaScript File
*   **Thời điểm**: 30/07/2026
*   **Người phê duyệt**: Technical Architect
*   **Trạng thái**: **FROZEN**
*   **Bối cảnh**: Nếu lưu 680 câu hỏi động trên Firestore, mỗi lượt tải ứng dụng của học sinh sẽ tốn rất nhiều lượt đọc (Reads) API Firestore, dẫn đến tăng chi phí vận hành nhanh chóng khi đạt quy mô hàng triệu người dùng.
*   **Lựa chọn & Rationale**: Lưu trữ ngân hàng câu hỏi đã biên dịch hoàn chỉnh dưới dạng một file JavaScript tĩnh (`questions_data.js`). File này sẽ được tải một lần từ CDN về thiết bị của người dùng và lưu trữ cục bộ (local cache). Chỉ các thông tin cá nhân và tiến trình học tập động mới đồng bộ thời gian thực lên Cloud Firestore.
*   **Trade-offs**:
    *   *Ưu điểm*: Tiết kiệm đến $90\%$ chi phí truy vấn database; tốc độ hiển thị câu hỏi lập tức, không có độ trễ mạng.
    *   *Nhược điểm*: Khi cần sửa đổi câu hỏi, phải chạy lại script build và deploy bản cập nhật ứng dụng hoặc đẩy file mới lên CDN.
*   **Ảnh hưởng về sau**: Quy trình Content Production SOP có thêm bước build (`compile_database.py`) để xuất bản file JS tĩnh.
