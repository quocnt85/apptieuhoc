# 📁 MẪU CHUẨN BIÊN SOẠN KỸ NĂNG (SKILL TEMPLATE)
## TÀI LIỆU QUY CHUẨN THIẾT KẾ NỘI DUNG MỘT KỸ NĂNG CỐT LÕI (TIỂU HỌC)

---

## I. THIẾT KẾ CÁC THÀNH PHẦN MẪU CHUẨN (TEMPLATE COMPONENTS DESIGN)

Mỗi kỹ năng trong hệ thống NovaStars bắt buộc phải tuân thủ cấu trúc biên soạn 10 phần dưới đây.

### 1. MỤC TIÊU NĂNG LỰC (COMPETENCY OBJECTIVES)
* **Purpose**: Xác định rõ ràng các kết quả đầu ra kỳ vọng về mặt nhận thức, thái độ và hành vi mà trẻ cần đạt được sau khi hoàn thành bài học.
* **Design Rationale**: Chúng tôi chia mục tiêu thành 3 mảng cốt lõi: Nhận thức (Biết/Hiểu), Lựa chọn (Đưa ra quyết định), và Hành vi thực tế (Hành động ngoài đời). Điều này đảm bảo nội dung biên soạn không sa đà vào lý thuyết suông mà luôn hướng tới đầu ra hành vi.
* **Educational Basis**: Phân loại Bloom cải tiến (Cognitive Domain) kết hợp với Khung học tập cảm xúc - xã hội (CASEL).
* **Trade-offs**: Việc chia nhỏ mục tiêu làm tăng thời gian biên soạn nội dung, nhưng giúp định hướng thiết kế game và câu hỏi trắc nghiệm cực kỳ chính xác.
* **Advantages**: Giúp người biên soạn không bị lệch hướng mục tiêu ban đầu; hỗ trợ AI đo lường chính xác tiến độ của học sinh.
* **Risks**: Mục tiêu quá trừu tượng, khó đo lường bằng hành động.
* *Giảm thiểu*: Bắt buộc sử dụng các động từ hành động có thể đo lường (như *rút*, *chỉ ra*, *giải thích*, *tránh xa*) thay vì các động từ chung chung (như *biết*, *hiểu*, *học*).
* **Dependencies**: Phải đồng bộ với bộ câu hỏi LSCAF của kỹ năng đó.
* **Future Impact**: Đảm bảo các mục tiêu học tập có thể ánh xạ trực tiếp lên học bạ năng lực số.

### 2. KIẾN THỨC NỀN (PREREQUISITE KNOWLEDGE)
* **Purpose**: Liệt kê các thông tin, khái niệm khoa học cơ bản và các quy tắc cốt lõi làm nền tảng cho việc thực hành kỹ năng.
* **Design Rationale**: Kiến thức nền là nguyên liệu đầu vào. Trẻ không thể đưa ra quyết định hành động đúng nếu không hiểu bản chất hiện tượng (ví dụ: cần hiểu nước dẫn điện trước khi học cách lau khô tay cắm điện). Kiến thức phải được trình bày đơn giản hóa tối đa bằng hình ảnh và ngôn ngữ trẻ em.
* **Educational Basis**: Thuyết nhận thức học đường (Cognitive Load Theory) - hạn chế quá tải thông tin, chỉ cung cấp kiến thức thực sự cần thiết cho hành động.
* **Trade-offs**: Cung cấp ít kiến thức hàn lâm chuyên sâu để nhường chỗ cho kiến thức ứng dụng thực tế.
* **Advantages**: Trẻ dễ nhớ, dễ hiểu, tránh xa được các nguy hiểm ngay lập tức.
* **Risks**: Giải thích quá đơn giản dẫn đến sai lệch bản chất khoa học.
* *Giảm thiểu*: Nội dung kiến thức nền phải được kiểm duyệt bởi các chuyên gia Primary Education và Khoa học Tự nhiên.
* **Dependencies**: Là nguồn nguyên liệu chính để biên soạn nội dung Story (Phần 5) và Mini-game (Phần 6).
* **Future Impact**: Giúp học sinh hình thành tư duy khoa học thường thức ứng dụng suốt đời.

### 3. KỸ NĂNG VI MÔ (MICRO-SKILLS)
* **Purpose**: Phân rã kỹ năng cốt lõi thành các hành động, thao tác cực kỳ nhỏ và cụ thể để trẻ dễ dàng học và thực hiện.
* **Design Rationale**: Đối với học sinh tiểu học, một khái niệm lớn như "An toàn điện" là quá mơ hồ. Chúng tôi phân rã thành các Micro-skills: nhận diện dây hở, lau tay khô trước khi cắm điện, rút phích cắm bằng cách cầm vào chuôi phích thay vì kéo dây.
* **Educational Basis**: Phương pháp Giảng dạy Chia nhỏ (Task Analysis / Scaffolding) trong tâm lý học giáo dục.
* **Trade-offs**: Việc phân rã chi tiết làm tăng số lượng thực thể dữ liệu cần quản lý trên cơ sở dữ liệu.
* **Advantages**: AI Companion có thể phát hiện chính xác trẻ bị hổng ở thao tác nhỏ nào để kịp thời hỗ trợ và gợi ý bài học bổ trợ.
* **Risks**: Phân rã quá sâu dẫn đến vụn vặt và mất đi tính tổng thể của kỹ năng.
* *Giảm thiểu*: Giới hạn mỗi kỹ năng cốt lõi chỉ chứa từ **3 đến 5 Micro-skills**.
* **Dependencies**: Mỗi Micro-skill phải liên kết trực tiếp với ít nhất một Mục tiêu học tập và một hoạt động trong game.
* **Future Impact**: Cho phép xây dựng lộ trình học tập thích ứng siêu cá nhân hóa ở mức độ vi mô.

### 4. CÁC LỖI THƯỜNG GẶP (COMMON PITFALLS & MISCONCEPTIONS)
* **Purpose**: Chỉ ra những hiểu lầm, thói quen sai lệch hoặc hành vi nguy hiểm phổ biến của trẻ em tiểu học đối với kỹ năng đó.
* **Design Rationale**: Học từ sai lầm (Learning from mistakes) là phương pháp học tập rất bền vững. Bằng cách định nghĩa trước các lỗi thường gặp, chúng tôi có thể chủ động thiết kế các tình huống gài bẫy trong game và huấn luyện AI Companion biết cách giải thích khi trẻ mắc lỗi.
* **Educational Basis**: Thuyết thay đổi hành vi thông qua điều chỉnh nhận thức sai lệch (Cognitive Dissonance Theory).
* **Trade-offs**: Phải nghiên cứu thực tế hành vi của trẻ rất nhiều để tìm ra các lỗi thực tế, không thể tự bịa ra.
* **Advantages**: Game thiết kế kịch tính hơn, các câu hỏi trắc nghiệm thực chất hơn do đánh trúng tâm lý trẻ.
* **Risks**: Trẻ có thể bắt chước hành vi sai nếu game minh họa không khéo.
* *Giảm thiểu*: Tuyệt đối không hình ảnh hóa các hành vi sai một cách hấp dẫn, vui nhộn; Boss Battle phải là nơi phê phán các hành vi sai này.
* **Dependencies**: Là cơ sở để biên soạn các phương án nhiễu (distractors) trong bộ câu hỏi trắc nghiệm tình huống.
* **Future Impact**: Giúp học sinh rèn luyện tư duy phản biện, nhận diện và phòng tránh rủi ro trong cuộc sống.

### 5. CÂU CHUYỆN BỐI CẢNH (NARRATIVE/STORY ARC)
* **Purpose**: Tạo ra một bối cảnh giả tưởng hấp dẫn, giàu cảm xúc giúp trẻ kết nối tinh thần và có động lực học tập.
* **Design Rationale**: Trẻ tiểu học học thông qua câu chuyện. Chúng tôi đặt trẻ vào vai một nhà thám hiểm (NovaStar) đồng hành cùng chú sao nhỏ Nova giải cứu các cư dân trên đảo khỏi các vấn đề rắc rối. Câu chuyện phải có nhân vật phản diện đáng yêu đại diện cho thói quen xấu.
* **Educational Basis**: Giáo dục qua kể chuyện (Narrative Pedagogy) và Thiết kế game nhập vai (Avatar & Identity Theory).
* **Trade-offs**: Chi phí viết kịch bản, vẽ tranh minh họa và Việt hóa/Quốc tế hóa câu chuyện rất lớn.
* **Advantages**: Tăng tính cá nhân hóa và giữ chân trẻ học tập tự nguyện mà không cần ép buộc.
* **Risks**: Câu chuyện quá dài gây xao nhãng việc tiếp thu kiến thức kỹ năng.
* *Giảm thiểu*: Khống chế độ dài mỗi chương truyện dưới 150 chữ, kết hợp các đoạn thoại ngắn tương tác trực tiếp.
* **Dependencies**: Đồng bộ chặt chẽ với Hướng nghệ thuật (Art Direction) của Design System.
* **Future Impact**: Cốt truyện có thể mở rộng thành phim hoạt hình, truyện tranh xuất bản ngoài đời.

### 6. CƠ CHẾ MINI-GAME PHÙ HỢP (MINI-GAME MECHANICS)
* **Purpose**: Đề xuất các tương tác game hóa trực quan giúp trẻ thực hành và ghi nhớ kiến thức nền tảng (Tier A, Tier B).
* **Design Rationale**: Tránh xa việc click chọn đáp án nhàm chán. Mỗi kỹ năng cần một cơ chế game phù hợp. Ví dụ: kỹ năng phân loại rác cần game kéo thả (Drag and Drop); kỹ năng an toàn điện cần game tìm điểm nguy hiểm trên bức tranh (Hidden Object).
* **Educational Basis**: Play-based Learning (Học qua chơi) và Thuyết tương tác trực quan của trẻ em.
* **Trade-offs**: Đội ngũ phát triển game phải lập trình nhiều loại gameplay khác nhau thay vì chỉ làm một mẫu quiz chuẩn.
* **Advantages**: Tạo sự wowed và thích thú cho trẻ, giữ chân học sinh học hàng ngày.
* **Risks**: Trẻ chỉ tập trung chơi game nhanh tay nhanh mắt mà không học được kỹ năng sống.
* *Giảm thiểu*: Game phải thiết kế sao cho việc chiến thắng phụ thuộc hoàn toàn vào việc đưa ra quyết định đúng đắn về kỹ năng sống, không phụ thuộc vào phản xạ ngón tay nhanh chậm.
* **Dependencies**: Phối hợp chặt chẽ với Game Design Bible.
* **Future Impact**: Xây dựng kho mini-games đồ sộ, có thể tái sử dụng cho nhiều kỹ năng khác nhau.

### 7. KỊCH BẢN ĐẤU BOSS (BOSS BATTLE SCENARIO)
* **Purpose**: Thiết kế màn kiểm tra tổng kết nhận thức (Tier D) kịch tính, đòi hỏi trẻ vận dụng tổng hợp các kỹ năng vi mô để giải cứu thế giới game.
* **Design Rationale**: Trận đấu Boss là đỉnh điểm của chương game. Boss (ví dụ: Quái vật Lười Biếng, Ngọn lửa Tinh Nghịch) sẽ tấn công bằng cách đưa ra các tình huống hành vi sai lệch. Học sinh phải đóng vai "Trọng tài", nhanh chóng chỉ ra lỗi sai của Boss và đưa ra hành động khắc phục để giành chiến thắng.
* **Educational Basis**: Thuyết thử thách tăng dần (Flow Theory in Game Design) - cân bằng giữa độ khó thử thách và kỹ năng của người chơi.
* **Trade-offs**: Thiết kế Boss Battle đòi hỏi tính mỹ thuật cao và lập trình kịch bản (Scripting) phức tạp.
* **Advantages**: Tạo cảm giác thành tựu cực kỳ lớn cho trẻ khi vượt qua thử thách khó nhất trên màn hình app.
* **Risks**: Độ khó quá cao khiến trẻ ức chế, khóc hoặc bỏ game.
* *Giảm thiểu*: Cho phép AI Companion xuất hiện hỗ trợ, gợi ý khi trẻ trả lời sai 2 lần liên tiếp, không giới hạn mạng chơi.
* **Dependencies**: Kịch bản Boss phải tích hợp các mục tiêu đánh giá nhận thức Tier D của bộ câu hỏi.
* **Future Impact**: Boss Battle sẽ là mốc checkpoint dữ liệu quan trọng cho báo cáo phụ huynh.

### 8. NHIỆM VỤ NGOÀI ĐỜI THỰC (REAL-LIFE MISSIONS)
* **Purpose**: Đưa ra các nhiệm vụ hành động thực tế tại nhà hoặc trường học để chuyển hóa năng lực từ màn hình thiết bị ra đời thực.
* **Design Rationale**: Đây là điểm cốt lõi của triết lý CBE. AI Companion sẽ phân tích độ tuổi, giới tính và môi trường của trẻ để đề xuất 1 nhiệm vụ phù hợp (ví dụ: con hãy đi quanh nhà cùng bố mẹ, tìm 3 ổ cắm điện bị hở hoặc quá thấp và dán nhãn cảnh báo). Nhiệm vụ phải cụ thể, dễ làm và an toàn.
* **Educational Basis**: Experiential Learning (Kolb) và Học tập kết nối đời sống thực (Authentic Task).
* **Trade-offs**: Tỷ lệ hoàn thành nhiệm vụ sẽ thấp hơn làm quiz online vì đòi hỏi hành động vật lý ngoài đời.
* **Advantages**: Tạo ra giá trị thực sự cho gia đình, trẻ tự tin vào năng lực bản thân.
* **Risks**: Trẻ gặp nguy hiểm khi thực hiện nhiệm vụ ngoài đời.
* *Giảm thiểu*: Bắt buộc đính kèm câu lệnh: "Nhiệm vụ này bắt buộc phải thực hiện cùng bố mẹ/người lớn". Không đề xuất các nhiệm vụ nguy hiểm.
* **Dependencies**: Dashboard của phụ huynh phải hiển thị được mô tả nhiệm vụ để phối hợp giám sát.
* **Future Impact**: Trẻ phát triển thói quen tự lập và an toàn bền vững.

### 9. YÊU CẦU BẰNG CHỨNG NĂNG LỰC (COMPETENCY EVIDENCE REQUIREMENTS)
* **Purpose**: Đặc tả các loại bằng chứng số mà học sinh phải tải lên để chứng minh đã hoàn thành nhiệm vụ đời thực.
* **Design Rationale**: Bằng chứng phải trực quan và sinh động. Chúng tôi yêu cầu nộp: 1 ảnh chụp sản phẩm (ví dụ: ảnh nhãn cảnh báo đã dán), hoặc 1 đoạn ghi âm giải thích của trẻ cho AI Companion. Bằng chứng được lưu vào hồ sơ năng lực cá nhân.
* **Educational Basis**: Thiết kế đánh giá dựa trên bằng chứng (Evidence-Centered Design).
* **Trade-offs**: Phụ huynh cảm thấy phiền phức khi chụp ảnh/quay video con rồi tải lên app.
* **Advantages**: Cung cấp dữ liệu thực chất cho hệ thống đánh giá; là bằng chứng không thể chối cãi về sự tiến bộ của trẻ.
* **Risks**: Rò rỉ dữ liệu riêng tư của trẻ em.
* *Giảm thiểu*: Dữ liệu media được mã hóa đầu cuối và chỉ lưu hành nội bộ trong tài khoản gia đình. AI tự động làm mờ khuôn mặt trẻ nếu phụ huynh yêu cầu.
* **Dependencies**: Module camera/micro trên app client phải tương thích tốt với Firebase Storage.
* **Future Impact**: Tạo dựng kho tư liệu phát triển cá nhân (Growth Portfolio) quý giá cho trẻ khi lớn lên.

### 10. TIÊU CHÍ MASTERY CHUYÊN BIỆT (MASTERY VALIDATION CRITERIA)
* **Purpose**: Xác lập các chỉ số cụ thể để hệ thống chính thức công nhận trẻ đạt Mastery đối với kỹ năng chuyên biệt này.
* **Design Rationale**: Thiết kế các chỉ số định lượng rõ ràng: Đạt bao nhiêu % câu hỏi, Boss Pass hay chưa, AI duyệt phản tư chưa, và Phụ huynh nhấn nút xác nhận đạt nhiệm vụ đời thực chưa.
* **Educational Basis**: Mastery Learning (Bloom).
* **Trade-offs**: Tiến trình đạt Mastery của trẻ sẽ bị kéo dài, đòi hỏi phụ huynh phải tích cực phối hợp.
* **Advantages**: Đảm bảo chất lượng giáo dục thực chất; phụ huynh nhìn thấy kết quả rõ ràng.
* **Risks**: Học sinh bị kẹt lại không đạt Mastery lâu ngày dẫn đến chán nản.
* *Giảm thiểu*: Gửi thông báo khích lệ nhẹ nhàng cho phụ huynh hàng ngày để nhắc họ duyệt bài cho con.
* **Dependencies**: Hệ thống thông báo đẩy (Push Notifications) trên Firebase Cloud Messaging.
* **Future Impact**: Chứng nhận Mastery của NovaStars có uy tín cao đối với nhà trường và xã hội.

---

## II. MẪU SOẠN THẢO CHUẨN (STANDARDIZED MARKDOWN TEMPLATE)

*Đội ngũ Content Production copy bộ khung dưới đây để soạn thảo kỹ năng mới:*

```markdown
# 📁 SKILL PROFILE: [Tên Kỹ Năng]
## Nhóm kỹ năng: [Tên Nhóm] | Mã Kỹ Năng: [SKILL-XXX]

### 1. MỤC TIÊU NĂNG LỰC (COMPETENCY OBJECTIVES)
Sau khi hoàn thành kỹ năng này, học sinh có khả năng:
* **Nhận thức (Cognitive)**:
  - [Mục tiêu 1: động từ hành động + đối tượng]
  - [Mục tiêu 2]
* **Quyết định (Decision Making)**:
  - [Mục tiêu 3]
  - [Mục tiêu 4]
* **Hành vi đời thực (Real-life Behavior)**:
  - [Mục tiêu 5]

### 2. KIẾN THỨC NỀN (PREREQUISITE KNOWLEDGE)
* **Quy tắc cốt lõi**:
  - [Quy tắc 1]
  - [Quy tắc 2]
* **Khái niệm khoa học thường thức**:
  - [Khái niệm 1]

### 3. KỸ NĂNG VI MÔ (MICRO-SKILLS)
* **Micro-skill 1**: [Tên thao tác cụ thể 1]
* **Micro-skill 2**: [Tên thao tác cụ thể 2]
* **Micro-skill 3**: [Tên thao tác cụ thể 3]
* **Micro-skill 4**: [Tên thao tác cụ thể 4]

### 4. CÁC LỖI THƯỜNG GẶP (COMMON PITFALLS & MISCONCEPTIONS)
* **Lỗi 1**: [Mô tả lỗi hoặc hiểu lầm phổ biến của trẻ] -> *Hậu quả nguy hiểm*: [Mô tả].
* **Lỗi 2**: [Mô tả lỗi hoặc hiểu lầm phổ biến của trẻ] -> *Hậu quả nguy hiểm*: [Mô tả].

### 5. CÂU CHUYỆN BỐI CẢNH (NARRATIVE/STORY ARC)
* **Tên câu chuyện**: [Tên hấp dẫn]
* **Bối cảnh**: [Hòn đảo nào, vùng đất nào]
* **Nhân vật**: [Nhà thám hiểm (học sinh), Nova, Boss/NPC nghịch ngợm]
* **Tóm tắt cốt truyện**:
  - [Đoạn 1: Giới thiệu bối cảnh, sự cố xảy ra]
  - [Đoạn 2: Nova gợi mở kiến thức học tập]
  - [Đoạn 3: Dẫn dắt tới Boss Battle]

### 6. CƠ CHẾ MINI-GAME PHÙ HỢP (MINI-GAME MECHANICS)
* **Mini-game 1: [Tên Mini-game]**
  - *Gameplay*: [Kéo thả / Phân loại / Tìm vật ẩn...]
  - *Mô tả tương tác*: [Cách trẻ thao tác để giải quyết kiến thức nền]
* **Mini-game 2: [Tên Mini-game]**
  - *Gameplay*: [Kéo thả / Phân loại / Tìm vật ẩn...]
  - *Mô tả tương tác*: [Cách trẻ thao tác]

### 7. KỊCH BẢN ĐẤU BOSS (BOSS BATTLE SCENARIO)
* **Tên Boss**: [Ví dụ: Quái vật Điện Giật Volt-O]
* **Bối cảnh Boss Battle**: [Địa điểm kịch tính]
* **Cơ chế đối đầu**:
  - *Boss ra chiêu*: [Đưa ra tình huống sai trái]
  - *Học sinh phản công*: [Chỉ ra điểm sai và chọn hành động đúng]
  - *Chiêu thức quyết định*: [Câu hỏi tình huống tổng hợp]

### 8. NHIỆM VỤ NGOÀI ĐỜI THỰC (REAL-LIFE MISSIONS)
* **Nhiệm vụ 1 (Dành cho Lớp 1-2)**: [Tên nhiệm vụ]
  - *Mô tả chi tiết*: [Các bước thực hiện có cha mẹ giám sát]
* **Nhiệm vụ 2 (Dành cho Lớp 3-5)**: [Tên nhiệm vụ]
  - *Mô tả chi tiết*: [Các bước thực hiện có cha mẹ giám sát]

### 9. YÊU CẦU BẰNG CHỨNG NĂNG LỰC (COMPETENCY EVIDENCE REQUIREMENTS)
* **Bằng chứng bắt buộc**: [Ảnh chụp / Ghi âm / Video]
  - *Mô tả bằng chứng đạt chuẩn*: [Ví dụ: Ảnh rõ nét, chụp sản phẩm tự làm...]
* **Phỏng vấn Phản tư của AI (Tier E)**:
  - *Câu hỏi AI*: "[Câu hỏi mở để trẻ phản tư về nhiệm vụ đã làm]"

### 10. TIÊU CHÍ MASTERY CHUYÊN BIỆT (MASTERY VALIDATION CRITERIA)
Để đạt Mastery kỹ năng [Tên Kỹ Năng], học sinh phải:
1. Trả lời đúng từ **16/20** câu hỏi tình huống LSCAF trở lên.
2. Vượt qua trận đấu Boss [Tên Boss].
3. AI Companion phê duyệt đoạn ghi âm phản tư đạt mức độ "Chân thành & Hiểu bài".
4. Phụ huynh phê duyệt nhiệm vụ đời thực trên Dashboard Phụ huynh.
```

---

## III. VÍ DỤ MINH HỌA HOÀN CHỈNH (CONCRETE EXAMPLE)

*Dưới đây là một Skill Profile hoàn chỉnh được biên soạn bám sát mẫu chuẩn:*

```markdown
# 📁 SKILL PROFILE: Kỹ năng phòng tránh nguy cơ bị điện giật
## Nhóm kỹ năng: Tự chăm sóc & An toàn | Mã Kỹ Năng: [SKILL-SAF-008]

### 1. MỤC TIÊU NĂNG LỰC (COMPETENCY OBJECTIVES)
Sau khi hoàn thành kỹ năng này, học sinh có khả năng:
* **Nhận thức (Cognitive)**:
  - Nhận diện các khu vực nguy hiểm về điện trong nhà (ổ cắm điện, dây điện hở, thiết bị điện đang hoạt động).
  - Giải thích được nguyên nhân tại sao tay ướt chạm vào điện rất dễ bị giật (Nước dẫn điện).
* **Quyết định (Decision Making)**:
  - Đưa ra lựa chọn đúng đắn: không tự ý cắm/rút điện khi không có người lớn giám sát; báo ngay cho người lớn khi thấy dây điện bị hở.
* **Hành vi đời thực (Real-life Behavior)**:
  - Luôn lau tay thật khô trước khi nhờ người lớn cắm/rút thiết bị điện.
  - Tránh xa khu vực ổ cắm điện và không đút bất kỳ vật gì vào lỗ ổ điện.

### 2. KIẾN THỨC NỀN (PREREQUISITE KNOWLEDGE)
* **Quy tắc cốt lõi**:
  - Không chạm tay ướt vào ổ điện, phích cắm hay bất kỳ thiết bị điện nào.
  - Không tự ý sửa chữa hoặc cắm/rút điện nếu chưa có sự cho phép và giám sát của cha mẹ.
  - Tránh xa các thiết bị điện đang tỏa nhiệt hoặc có dấu hiệu hỏng hóc (bốc khói, có tiếng xẹt lửa).
* **Khái niệm khoa học thường thức**:
  - Điện rất mạnh và di chuyển rất nhanh. Cơ thể con người chứa nhiều nước, và nước dẫn điện cực kỳ tốt. Nếu chạm vào nguồn điện, dòng điện sẽ truyền qua nước trong cơ thể gây bỏng, ngưng tim rất nguy hiểm.

### 3. KỸ NĂNG VI MÔ (MICRO-SKILLS)
* **Micro-skill 1**: Nhận diện nguồn điện và dây dẫn an toàn/không an toàn (phát hiện dây sờn, hở đồng).
* **Micro-skill 2**: Thao tác lau khô tay bằng khăn khô trước khi tiếp cận khu vực có điện.
* **Micro-skill 3**: Thao tác gọi điện thoại khẩn cấp hoặc gọi người lớn khi phát hiện sự cố chập điện.
* **Micro-skill 4**: Quy tắc ứng phó khẩn cấp: Không chạm vào người đang bị điện giật mà phải dùng vật cách điện (chổi gỗ, nhựa) để gạt dây điện ra.

### 4. CÁC LỖI THƯỜNG GẶP (COMMON PITFALLS & MISCONCEPTIONS)
* **Lỗi 1**: Dùng tay ướt cắm sạc điện thoại vì nghĩ rằng sạc điện thoại dòng điện nhỏ nên không sao -> *Hậu quả nguy hiểm*: Sạc hỏng có thể rò điện lưới 220V trực tiếp gây giật chết người.
* **Lỗi 2**: Dùng bút chì hoặc dĩa kim loại chọc vào lỗ ổ cắm điện để chơi đùa -> *Hậu quả nguy hiểm*: Kim loại dẫn điện từ lỗ ổ cắm truyền trực tiếp vào tay gây điện giật ngay lập tức.
* **Lỗi 3**: Khi thấy bạn bị điện giật, lập tức lao vào dùng tay kéo bạn ra -> *Hậu quả nguy hiểm*: Dòng điện truyền qua người bạn sang cơ thể mình, khiến cả hai cùng bị giật.

### 5. CÂU CHUYỆN BỐI CẢNH (NARRATIVE/STORY ARC)
* **Tên câu chuyện**: Sứ mệnh giải cứu đảo Sét Lan
* **Bối cảnh**: Đảo An Toàn (Safety Island) - Thung lũng Sét Lan
* **Nhân vật**: Nhà thám hiểm (Học sinh), Nova (Sao nhỏ đồng hành), Sparky (Linh tinh nghịch ngợm hay nghịch dây điện).
* **Tóm tắt cốt truyện**:
  - Thung lũng Sét Lan bỗng dưng mất điện. Nova và Nhà thám hiểm phát hiện Sparky đang dùng tay ướt nhẹp nghịch ngợm tủ điện trung tâm và chuẩn bị cắm một sợi dây bị hở đồng vào ổ cắm để nghịch tia lửa.
  - Nova lập tức ngăn lại và giải thích cho Sparky hiểu về sự nguy hiểm của nước dẫn điện và dây điện hở.
  - Sparky hối hận nhưng tủ điện bị chập và hóa thành Quái vật Điện Giật Volt-O hung dữ. Học sinh phải giúp Sparky đánh bại Volt-O bằng kiến thức an toàn điện.

### 6. CƠ CHẾ MINI-GAME PHÙ HỢP (MINI-GAME MECHANICS)
* **Mini-game 1: Máy Dò Tìm Dây Hở (Hidden Hazards)**
  - *Gameplay*: Tìm điểm nguy hiểm (Hidden Object).
  - *Mô tả tương tác*: Màn hình hiển thị một căn phòng khách lộn xộn. Trẻ phải dùng ngón tay chạm vào các điểm mất an toàn điện trong vòng 60 giây (ví dụ: dây sạc bị mèo cắn hở đồng, ổ điện quá thấp cạnh vũng nước lau nhà, phích cắm cắm lỏng lẻo bốc khói). Mỗi lần chạm đúng, AI Companion sẽ giải thích tại sao đó là điểm nguy hiểm.
* **Mini-game 2: Đội Cứu Hộ Lau Tay (Dry Hands Matcher)**
  - *Gameplay*: Kéo thả phân loại (Drag and Drop).
  - *Mô tả tương tác*: Màn hình chia làm hai bên: Bên ẩm ướt (chơi bóng nước, rửa tay, đi mưa) và Bên khô ráo. Trẻ phải kéo các bàn tay tương ứng qua khăn lau khô trước khi kéo bàn tay đó chạm vào phích cắm điện để mở khóa cửa.

### 7. KỊCH BẢN ĐẤU BOSS (BOSS BATTLE SCENARIO)
* **Tên Boss**: Quái vật Điện Giật Volt-O
* **Bối cảnh Boss Battle**: Tủ điện trung tâm bốc khói và xẹt lửa xanh lục.
* **Cơ chế đối đầu**:
  - *Volt-O ra chiêu 1*: Volt-O phóng ra một vũng nước lớn lan đến chân Sparky và đe dọa: "Ta sẽ ném sợi dây điện hở này vào vũng nước!"
    -> *Học sinh phản công*: Chọn phương án đúng trong 3 giây: (A) Lao vào ôm Sparky kéo ra, (B) Hét lớn bảo Sparky nhảy lên ghế gỗ khô ráo, (C) Dùng vòi nước xịt vào Volt-O. (Đáp án đúng: B).
  - *Volt-O ra chiêu 2*: Volt-O biến ra một bàn tay ướt và với tới công tắc nguồn điện để bật máy.
    -> *Học sinh phản công*: Chọn công cụ ngăn chặn: (A) Chiếc chổi tre khô, (B) Cột sắt, (C) Thanh nhựa ẩm. (Đáp án đúng: A - dùng vật cách điện khô ráo để gạt).
  - *Chiêu thức quyết định*: Volt-O suy yếu, học sinh phải trả lời câu hỏi phản tư: "Nếu em phát hiện ổ điện trong nhà tắm bị bắn nước vào, em sẽ làm gì đầu tiên?" để dập tắt hoàn toàn Volt-O.

### 8. NHIỆM VỤ NGOÀI ĐỜI THỰC (REAL-LIFE MISSIONS)
* **Nhiệm vụ 1: Biệt đội Dán Nhãn Cảnh Báo (Dành cho mọi khối lớp)**
  - *Mô tả chi tiết*: Con hãy cùng bố/mẹ đi một vòng quanh nhà. Tìm các ổ cắm điện nằm ở tầm thấp (dưới 1 mét) hoặc các thiết bị điện lớn (tủ lạnh, máy giặt, lò vi sóng). Vẽ 3 hình mặt cười cảnh báo màu vàng trên giấy, nhờ bố mẹ cắt ra và dán nhẹ bên cạnh các khu vực đó để nhắc nhở cả nhà luôn cẩn thận.
  - *Lệnh an toàn bắt buộc*: `Em phải đi cùng bố mẹ và tuyệt đối không tự ý chạm tay vào bên trong ổ điện.`

### 9. YÊU CẦU BẰNG CHỨNG NĂNG LỰC (COMPETENCY EVIDENCE REQUIREMENTS)
* **Bằng chứng bắt buộc**: Ảnh chụp (Photo Evidence).
  - *Mô tả bằng chứng đạt chuẩn*: Ảnh chụp rõ ràng 1 nhãn cảnh báo do trẻ tự vẽ đã được dán bên cạnh ổ cắm điện hoặc thiết bị điện trong nhà. Trong ảnh có thể có bàn tay trẻ chỉ vào nhãn (khuyến khích không chụp mặt trẻ để bảo vệ quyền riêng tư).
* **Phỏng vấn Phản tư của AI (Tier E - Voice Evidence)**:
  - *Câu hỏi AI*: "Chào cậu! Cậu đã dán nhãn cảnh báo điện rất đẹp. Bây giờ, cậu hãy ghé sát tai tớ (nhấn micro) và kể cho tớ nghe: Tại sao chúng mình tuyệt đối không được dùng tay đang ướt để cắm điện thế nhỉ?"
  - *Tiêu chuẩn AI duyệt*: File ghi âm có chứa các từ khóa cốt lõi: "nước dẫn điện", "bị giật nguy hiểm", "ướt", "khô tay".

### 10. TIÊU CHÍ MASTERY CHUYÊN BIỆT (MASTERY VALIDATION CRITERIA)
Để đạt Mastery kỹ năng Phòng tránh nguy cơ bị điện giật, học sinh phải:
1. Trả lời đúng ít nhất **16/20** câu hỏi thuộc bộ câu hỏi An toàn điện.
2. Vượt qua trận đấu Boss Volt-O trong game.
3. Hoàn thành ghi âm phản tư và được AI Companion duyệt (đạt độ tin cậy từ khóa > 85%).
4. Phụ huynh nhấn nút "Xác nhận đạt" cho Nhiệm vụ Dán Nhãn Cảnh Báo trên app phụ huynh.
```
