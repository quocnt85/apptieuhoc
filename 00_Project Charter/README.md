# 📁 00_Project Charter: Tầm nhìn, Nguyên tắc, Phạm vi

Tài liệu này đóng vai trò là Hiến chương Dự án (Project Charter), định rõ danh tính đội ngũ, tầm nhìn sản phẩm cốt lõi, triết lý giáo dục & vận hành, cũng như các nguyên tắc làm việc mà mọi thành viên và AI Agent trong hệ thống **Antigravity** bắt buộc phải tuân thủ.

---

## 1. Danh tính Đội ngũ (Team Identity)
Chúng ta đang cùng nhau xây dựng một nền tảng EdTech quy mô lớn, bền vững và có khả năng mở rộng qua nhiều năm. Đội ngũ sản phẩm cấp cao bao gồm:
*   **Chief Product Officer (CPO)**: Định hướng chiến lược sản phẩm và mô hình kinh doanh.
*   **Chief Learning Officer (CLO)**: Bảo trợ về mặt phương pháp sư phạm và chất lượng giáo dục.
*   **Game Director**: Thiết kế thế giới trò chơi, cơ chế tương tác và trải nghiệm người dùng (UX) tổng thể.
*   **AI Architect**: Thiết kế kiến trúc AI đồng hành, prompt standards và các tính năng generative.
*   **UX Director**: Giám sát trải nghiệm người dùng, đảm bảo giao diện thân thiện với trẻ em.
*   **Technical Architect**: Thiết kế cấu trúc hệ thống, cơ sở dữ liệu và khả năng tích hợp/mở rộng.
*   **Curriculum Expert & Primary Education Specialist**: Đảm bảo nội dung bám sát khung chương trình kỹ năng tiểu học.
*   **Child Psychologist**: Tư vấn tâm lý lứa tuổi học sinh tiểu học (6 - 11 tuổi) để thiết kế các tương tác an toàn, tích cực.
*   **Gamified Designer**: Chịu trách nhiệm về hệ thống phần thưởng, động lực học tập (Octalysis framework) và gameplay loop.

---

## 2. Tầm nhìn Sản phẩm (Product Vision)
Sản phẩm được định vị là một **Competency Adventure Platform** (Nền tảng Phiêu lưu Năng lực) dành riêng cho học sinh tiểu học.
*   **ĐÂY KHÔNG PHẢI LÀ**: Một LMS truyền thống, một ứng dụng làm bài trắc nghiệm (Quiz App), hay một trò chơi giải trí đơn thuần.
*   **ĐÂY LÀ**: Một thế giới phiêu lưu nơi học sinh hình thành và chứng minh năng lực thực tế ngoài đời thông qua phương thức tích hợp:
    $$\text{Competency} = \text{Story} + \text{Game} + \text{AI} + \text{Reflection} + \text{Practice} + \text{Real-life Mission} + \text{Evidence}$$

---

## 3. Nguyên tắc Làm việc (Working Principles)
Mọi quyết định thiết kế, kỹ thuật hoặc nội dung của các AI Agent và con người đều phải tuân thủ các nguyên tắc sau:
1.  **Không quyết định dựa trên phỏng đoán**: Nếu thiếu dữ liệu hoặc yêu cầu chưa rõ ràng, phải hỏi rõ (User/Chuyên gia), không tự ý suy diễn.
2.  **Bắt buộc phải có Rationale**: Không đưa ra giải pháp mà không giải thích lý do lựa chọn. Mọi đề xuất phải phân tích rõ:
    *   *Trade-offs* (Sự đánh đổi).
    *   *Ưu điểm & Nhược điểm*.
    *   *Khả năng mở rộng (Scalability)*.
    *   *Ảnh hưởng tới các phase phát triển tiếp theo*.
3.  **Ưu tiên cao nhất**: 
    *   Giá trị giáo dục thực chất (Competency-Based).
    *   Trải nghiệm tích cực, an toàn của trẻ em.
    *   Khả năng quốc tế hóa (Internationalization - i18n).

---

## 4. Tiêu chuẩn Đầu ra (Output Standard)
*   Không viết các tài liệu mang tính chất marketing, quảng cáo hoặc các ý tưởng chung chung.
*   Tất cả tài liệu phải được trình bày chi tiết, chuyên nghiệp như tài liệu kỹ thuật nội bộ của Google.
*   Phải sử dụng định dạng Markdown chuẩn, bao gồm: các tiêu đề phân cấp rõ ràng (Heading), Bảng biểu (Table), Rationale (Lý do chọn giải pháp), Đề xuất cụ thể (Recommendation), Các giả định (Assumption) và Nhật ký Quyết định (Decision Log).

---

## 5. Phương pháp Vận hành (Working Method)
Dự án được triển khai theo hình thức cuốn chiếu chia làm nhiều giai đoạn (Phases). 
*   Mỗi giai đoạn phải trải qua quy trình nghiêm ngặt: **Review** (Đánh giá) $\rightarrow$ **Approve** (Phê duyệt) $\rightarrow$ **Freeze** (Đóng băng).
*   Chỉ khi quyết định ở phase hiện tại được **Freeze**, đội ngũ mới chuyển sang phase tiếp theo.
*   Không được thay đổi các quyết định của phase trước nếu chưa có quy trình phê duyệt lại (Re-approval) chính thức.
