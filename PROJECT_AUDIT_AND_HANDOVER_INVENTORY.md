# BÁO CÁO TỔNG HỢP KIỂM TOÁN VÀ BÀN GIAO DỰ ÁN NOVASTARS
*(Master Project Inventory, Knowledge Map & Handover Audit)*

> **Dự án**: NovaStars - Nền Tảng Phiêu Lưu Học Kỹ Năng Sống Tiểu Học  
> **Thời gian lập**: 20/08/2026  
> **Mục tiêu**: Bảng kiểm toán toàn diện 100% các file và thư mục trong repository để người tiếp nhận bàn giao nắm bắt rõ ràng lịch sử, mục đích, giá trị đặc thù và tình trạng tích hợp vào hệ thống mới.

---

## 1. TỔNG QUAN LỊCH SỬ TIẾN HÓA CỦA DỰ ÁN

Dự án đã trải qua **3 thế hệ tài liệu** kế tiếp nhau:

1. **Thế hệ 1 (Legacy V1 - Thiết Kế Ban Đầu)**: 10 thư mục đánh số chữ thường (`00_Project Charter`, `01_Product Foundation`, `02_Curriculum Framework`...) + 8 file HTML review đơn lẻ.
2. **Thế hệ 2 (NovaStars OS V2 - Kiến Trúc Chuẩn Hóa)**: 12 thư mục chữ in hoa (`00_HOME`, `01_VISION`, `02_PRODUCT`, `03_EDUCATION`...) có gắn chuẩn YAML Frontmatter (`depends_on`, `used_by`) đã đóng băng (*FROZEN*).
3. **Thế hệ 3 (Hệ Thống Thực Thi Hiện Tại)**: 
   - Mã nguồn ứng dụng di động chuẩn Mobile-First (`client/` - React 18 + Capacitor + E2E Playwright).
   - Hệ thống bách khoa tri thức tinh gọn module hóa cho AI (`wiki/` - Karpathy Style).

---

## 2. BẢNG KIỂM TOÁN CHI TIẾT THEO TỪNG NHÓM THƯ MỤC

### 📂 NHÓM I: THƯ MỤC TRI THỨC CỐT LÕI MỚI (`wiki/`)
*Hệ thống tri thức tinh đặc, module hóa dùng làm ngữ cảnh nạp cho AI Agent sinh nội dung.*

| Thư Mục / File | Mục Đích & Nội Dung Cốt Lõi | Tình Trạng Tích Hợp | Giá Trị Đặc Thù Cần Lưu Ý | Khuyến Nghị & Quyết Định |
| :--- | :--- | :--- | :--- | :--- |
| `wiki/INDEX.md` | Bản đồ điều hướng & quy tắc nạp ngữ cảnh (Context Ingestion Rules) cho AI. | **100% Cốt lõi Wiki** | Giúp AI chỉ nạp 3 file thay vì toàn bộ repo. | **🟢 ACTIVE CORE**: Giữ làm kim chỉ nam. |
| `wiki/00_CORE/nlas_10_stages.md` | Quy chuẩn 10 giai đoạn bài học (Pretest $\rightarrow$ Story $\rightarrow$ Minigames $\rightarrow$ Boss $\rightarrow$ Posttest). | **100% Cốt lõi Wiki** | Đặc tả chuẩn gameplay, thời lượng 6-10 phút cho trẻ. | **🟢 ACTIVE CORE**: Dùng cho mọi bài học. |
| `wiki/00_CORE/content_schema.md` | Khai báo TypeScript Interface & Master JSON Schema cho `LessonZeroPackage`. | **100% Cốt lõi Wiki** | Đảm bảo AI xuất JSON chuẩn để nạp thẳng vào app di động. | **🟢 ACTIVE CORE**: Contract dữ liệu bắt buộc. |
| `wiki/00_CORE/pedagogical_guardrails.md` | Giới hạn $\le 25$ từ/thoại, tâm lý học tích cực, tiêu chuẩn an toàn COPPA/GDPR Kids. | **100% Cốt lõi Wiki** | Hàng rào bảo vệ trẻ em, chặn từ ngữ tiêu cực. | **🟢 ACTIVE CORE**: Bộ lọc an toàn. |
| `wiki/01_DOMAINS/financial_literacy.md` | Bảng kỹ năng chi tiết theo Lớp 1-5 + Kịch bản mẫu + Nhiệm vụ đời thực miền Tài Chính. | **100% Cốt lõi Wiki** | Đã chắt lọc tinh hoa từ file Excel gốc và Khung LSCAF. | **🟢 ACTIVE CORE**: Nguồn tri thức chính cho AI. |
| `wiki/01_DOMAINS/safety_and_protection.md` | Bảng kỹ năng chi tiết theo Lớp 1-5 + Kịch bản Safe Touch, No-Go-Tell miền An Toàn. | **100% Cốt lõi Wiki** | Ranh giới 5 vùng riêng tư, an toàn giao thông/cháy nổ. | **🟢 ACTIVE CORE**: Nguồn tri thức chính cho AI. |
| `wiki/01_DOMAINS/sel_and_communication.md` | Bảng kỹ năng chi tiết theo Lớp 1-5 miền Trí tuệ cảm xúc & Giao tiếp (SEL). | **100% Cốt lõi Wiki** | Chào hỏi, hạ nhiệt cơn giận, kết bạn, thấu cảm. | **🟢 ACTIVE CORE**: Nguồn tri thức chính cho AI. |
| `wiki/01_DOMAINS/self_care_and_health.md` | Bảng kỹ năng chi tiết theo Lớp 1-5 miền Tự chăm sóc & Sức khỏe. | **100% Cốt lõi Wiki** | Dinh dưỡng 4 nhóm chất, bảo vệ mắt, tuổi dậy thì. | **🟢 ACTIVE CORE**: Nguồn tri thức chính cho AI. |
| `wiki/01_DOMAINS/digital_and_study_skills.md` | Bảng kỹ năng chi tiết theo Lớp 1-5 miền Kỹ năng số & Học đường. | **100% Cốt lõi Wiki** | An toàn Internet, chống bắt nạt mạng, thuyết trình. | **🟢 ACTIVE CORE**: Nguồn tri thức chính cho AI. |
| `wiki/02_TEMPLATES/prompt_generate_lesson.md` | System prompt và template để ra lệnh cho LLM sinh bài học tự động. | **100% Cốt lõi Wiki** | Prompt mẫu chuẩn hóa đầu ra JSON. | **🟢 ACTIVE CORE**: Dùng khi chạy AI Generator. |
| `wiki/02_TEMPLATES/golden_lesson_sample.json` | Dữ liệu mẫu chuẩn 100% của Bài 1 (Đảo Dũng Cảm). | **100% Cốt lõi Wiki** | Mẫu đối chiếu (Few-Shot Reference). | **🟢 ACTIVE CORE**: Mẫu vàng để AI học theo. |

---

### 📂 NHÓM II: TÀI LIỆU KIẾN TRÚC ĐÓNG BĂNG V2 (`00_HOME` $\rightarrow$ `11_ADR`)
*Bộ tài liệu kiến trúc cấp cao (NovaStars OS Canonical Specifications - Đã FROZEN).*

| Thư Mục / File | Mục Đích & Nội Dung Cốt Lõi | Tình Trạng Tích Hợp | Giá Trị Đặc Thù Cần Lưu Ý | Khuyến Nghị & Quyết Định |
| :--- | :--- | :--- | :--- | :--- |
| `00_HOME/` *(index, architecture_map, system_status.md)* | Cổng điều hướng Master Portal, sơ đồ Topology hệ thống và bảng audit sức khỏe tài liệu. | **Đã tóm tắt vào `wiki/INDEX.md`** | Chứa sơ đồ Mermaid liên kết 12 miền tri thức. | **🔵 CANONICAL SPEC**: Giữ nguyên làm hồ sơ kiến trúc. |
| `01_VISION/` *(product_philosophy, core_assumptions, strategic_objectives.md)* | Tuyên ngôn triết lý sản phẩm, các giả định cốt lõi và mục tiêu OKRs (2026-2027). | **Đã tích hợp triết lý vào `wiki/00_CORE/`** | Định nghĩa OKR: 10,000 learning objects, D30 retention >45%. | **🔵 CANONICAL SPEC**: Giữ làm tài liệu định hướng chiến lược. |
| `02_PRODUCT/` *(product_foundation.md, feature_catalog/, user_personas/)* | Đặc tả tính năng (Companion, Quest), chân dung người học (Learner Persona) và phụ huynh. | **Đã tích hợp chân dung vào `wiki/00_CORE/`** | Phân tích tâm lý học sinh 6-11 tuổi và nhu cầu theo dõi của phụ huynh. | **🔵 CANONICAL SPEC**: Giữ làm tài liệu Product Design. |
| `03_EDUCATION/` *(competency_framework, experience_os, learning_framework, nlas_framework.md)* | Khung năng lực NLAS, đường cong cảm xúc học sinh (Experience OS), mô hình chuyển đổi trạng thái trẻ. | **Đã tích hợp 100% vào `wiki/00_CORE/nlas_10_stages.md`** | Chứa lý thuyết chuyển đổi trạng thái tâm lý trẻ (Anxious $\rightarrow$ Empowered). | **🔵 CANONICAL SPEC**: Giữ làm tài liệu Sư phạm chuẩn. |
| `04_GAME/` *(game_design_bible, game_economy, gameplay_loops, mini_game_patterns.md)* | Kinh thánh thiết kế game, kinh tế sao XP, vòng lặp chơi (Core & Meta Loops), mẫu mini-game. | **Đã tích hợp cơ chế game vào `wiki/00_CORE/`** | Khung Fun Framework (Octalysis) và logic cân bằng kinh tế sao/kim cương. | **🔵 CANONICAL SPEC**: Giữ làm tài liệu Game Design. |
| `05_CONTENT/` *(content_model.md)* | Mô hình đối tượng học tập nguyên tử (`LO-STORY`, `LO-EXPLORE`, `LO-BOSS`, `LO-REFL`) và JSON Schemas. | **Đã tích hợp 100% vào `wiki/00_CORE/content_schema.md`** | Định nghĩa mã định danh chuẩn (`NS-LES-xxxxx`, `COMP-xxx-xxx`). | **🔵 CANONICAL SPEC**: Giữ làm tài liệu Content Schema. |
| `06_AI/` *(acs_standard, aiob_blueprint, aips_framework, agent_registry/)* | Hệ thống sản xuất AI AIPS, chuẩn hợp đồng Agent ACS, đặc tả Story Agent, Boss Agent, Assessment Agent. | **Đã tích hợp vào `wiki/02_TEMPLATES/`** | Mô hình điều phối 100+ AI Agents phối hợp với con người (Human-in-the-loop). | **🔵 CANONICAL SPEC**: Giữ làm tài liệu AI Architecture. |
| `07_ENGINEERING/` *(technical_architecture, cms_specifications.md)* | Đặc tả kiến trúc kỹ thuật (React, Capacitor, Neon PostgreSQL, Cloudflare Workers/R2). | **Đã tích hợp vào Tech Stack** | Sơ đồ hạ tầng Serverless Edge và Headless CMS. | **🔵 CANONICAL SPEC**: Giữ làm tài liệu Kỹ thuật nền tảng. |
| `08_OPERATIONS/` *(content_factory_sop, qa_framework, deployment_protocols.md)* | Quy trình vận hành nhà máy nội dung, 5 Cổng duyệt chất lượng (5 Review Gates), phát hành. | **Đã tích hợp vào `wiki/00_CORE/pedagogical_guardrails.md`** | Bộ tiêu chí kiểm định 5 bước trước khi publish bài học. | **🔵 CANONICAL SPEC**: Giữ làm tài liệu QA/Operations. |
| `09_LIBRARY/` *(standard_page_template.md)* | Mẫu Markdown chuẩn có YAML Frontmatter để tạo tài liệu mới. | **Chưa tích hợp** (Không cần thiết cho AI Wiki) | Template tài liệu cho đội ngũ con người viết doc. | **🔵 CANONICAL SPEC**: Giữ nguyên trong thư viện mẫu. |
| `10_GLOSSARY/` *(master_glossary.md)* | Bảng từ điển thuật ngữ toàn hệ thống (NLAS, AIPS, ACS, SEL, XP, Tier A/B/C...). | **Đã tích hợp ngữ nghĩa vào `wiki/`** | Giải nghĩa chính xác tất cả từ viết tắt trong dự án. | **🔵 CANONICAL SPEC**: Giữ làm từ điển đối chiếu. |
| `11_ADR/` *(adr_index.md, records/ ADR-0001 $\rightarrow$ ADR-0005)* | 5 Quyết định Kiến trúc: YAML Frontmatter, Atomic Knowledge, SemVer, và Techstack React/Capacitor/Neon. | **Đã phản ánh trong Codebase** | Lịch sử và lý do tại sao chọn React + Capacitor + Neon DB. | **🔵 CANONICAL SPEC**: Rất quan trọng, bắt buộc giữ để hiểu rationale. |

---

### 📂 NHÓM III: TÀI LIỆU THIẾT KẾ GIAI ĐOẠN 1 (`00_Project Charter` $\rightarrow$ `09_Roadmap`)
*10 thư mục thiết kế ban đầu (V1) trước khi được nâng cấp lên NovaStars OS V2.*

| Thư Mục / File | Mục Đích & Nội Dung Cốt Lõi | Tình Trạng Tích Hợp | Giá Trị Đặc Thù Cần Lưu Ý | Khuyến Nghị & Quyết Định |
| :--- | :--- | :--- | :--- | :--- |
| `00_Project Charter/README.md` | Hiến chương dự án, phân vai đội ngũ (CPO, CLO, Game Director, AI Architect). | **Đã tích hợp triết lý vào `wiki/INDEX.md`** | Định nghĩa công thức năng lực: $\text{Competency} = \text{Story} + \text{Game} + \text{AI} + \text{Reflection} + \text{Mission}$. | **🟡 V1 ARCHIVE**: Đã được kế thừa vào `01_VISION`. Nên gom vào `_archive/legacy_v1_docs/`. |
| `01_Product Foundation/` *(PRODUCT_FOUNDATION.md, PRODUCT_BLUEPRINT.md)* | Blueprint chi tiết cho Epic 1, kịch bản hành trình học sinh. | **Đã tích hợp vào `wiki/00_CORE/`** | Chi tiết kịch bản tương tác ban đầu giữa Su và Sao Nova. | **🟡 V1 ARCHIVE**: Đã được kế thừa vào `02_PRODUCT`. Nên gom vào `_archive/legacy_v1_docs/`. |
| `02_Curriculum Framework/` *(UNIVERSAL_COMPETENCY_FRAMEWORK, DATABASE_SCHEMA, SKILL_TEMPLATE.md)* | Khung 40 kỹ năng LSCAF ban đầu, mẫu thiết kế skill. | **Đã tích hợp & mở rộng thành 125 skills trong `wiki/01_DOMAINS/`** | Cấu trúc 40 skills phân theo 3 Tiers (Biết - Dụng - Ngộ). | **🟡 V1 ARCHIVE**: Đã được mở rộng trong V2 & `wiki/`. Nên gom vào `_archive/legacy_v1_docs/`. |
| `03_Game Design Bible/` *(GAME_DESIGN_BIBLE.md)* | Bản thiết kế game V1, bối cảnh Hành tinh Nova Land và 5 Đảo. | **Đã tích hợp vào `wiki/00_CORE/`** | Tên và chủ đề của 5 đảo (Đảo Dũng Cảm, Đảo Sáng Tạo, Đảo Tài Chính...). | **🟡 V1 ARCHIVE**: Đã được kế thừa vào `04_GAME`. Nên gom vào `_archive/legacy_v1_docs/`. |
| `04_AI Bible/` *(AI_AGENT_CONTRACT, AI_ORGANIZATION_BLUEPRINT.md)* | Hợp đồng Agent V1, hàng rào bảo vệ Zero-Toxic, thuật toán IRIS. | **Đã tích hợp vào `wiki/00_CORE/pedagogical_guardrails.md`** | Quy tắc điều chỉnh độ khó bài tập dựa trên tốc độ phản hồi của trẻ. | **🟡 V1 ARCHIVE**: Đã được kế thừa vào `06_AI`. Nên gom vào `_archive/legacy_v1_docs/`. |
| `05_Design System/README.md` | Bảng màu UI/UX (Nova Blue, Star Yellow, Emerald Green), font Fredoka/Quicksand. | **Đã áp dụng vào `client/src/index.css`** | Định nghĩa mã màu Hex và kích thước nút bấm tối thiểu 48x48px. | **🟡 V1 ARCHIVE**: Đã nằm trong code CSS. Nên gom vào `_archive/legacy_v1_docs/`. |
| `06_Technical Architecture/README.md` | Kiến trúc PWA/SPA và Firebase/Firestore cũ (trước khi chuyển sang Neon/Capacitor). | **ĐÃ LỖI THỜI (Superseded by ADR-0005)** | Kiến trúc cũ dùng Firebase, đã được thay thế bằng Neon DB + Capacitor. | **🔴 V1 LEGACY**: Giữ làm lịch sử trong `_archive/legacy_v1_docs/`. |
| `07_Content Production SOP/README.md` | Quy trình biên soạn nội dung 6 bước V1. | **Đã tích hợp vào `wiki/02_TEMPLATES/`** | Luồng 6 bước: Curriculum $\rightarrow$ AI Draft $\rightarrow$ Review $\rightarrow$ Verify $\rightarrow$ DB $\rightarrow$ Visual QA. | **🟡 V1 ARCHIVE**: Đã nâng cấp vào `08_OPERATIONS`. Nên gom vào `_archive/legacy_v1_docs/`. |
| `08_Decision Log/README.md` | 3 Quyết định cũ: DEC-2026-001 (40 skills), DEC-2026-002 (LSCAF 3 Tiers), DEC-2026-003 (Static questions_data.js). | **Đã tích hợp vào `11_ADR`** | 3 quyết định ban đầu của dự án. | **🟡 V1 ARCHIVE**: Đã được chuẩn hóa thành ADR-0001 đến 0005. Gom vào `_archive/legacy_v1_docs/`. |
| `09_Roadmap/README.md` | Kế hoạch 4 Phase cũ (Phase 1 Blueprint, Phase 2 Prototype, Phase 3 AI, Phase 4 Launch). | **Đã hoàn thành Phase 1 & 2** | Mốc tiến độ cũ năm 2026. | **🟡 V1 ARCHIVE**: Nên gom vào `_archive/legacy_v1_docs/`. |

---

### 📂 NHÓM IV: DỮ LIỆU NGUỒN & NGÂN HÀNG CÂU HỎI (DATA SOURCES)

| Thư Mục / File | Mục Đích & Nội Dung Cốt Lõi | Tình Trạng Tích Hợp | Giá Trị Đặc Thù Cần Lưu Ý | Khuyến Nghị & Quyết Định |
| :--- | :--- | :--- | :--- | :--- |
| `extracted_skills.json` | Danh mục hơn 100 kỹ năng chi tiết từ Lớp 1 đến Lớp 5 trích xuất từ Excel. | **Đã tích hợp vào 5 file `wiki/01_DOMAINS/`** | Cực kỳ giá trị: Chứa các mốc kỹ năng thực tế (Dậy thì, ăn uống 4 nhóm chất, bảo vệ mắt...). | **🔵 DATA SOURCE**: Giữ nguyên làm Database nguồn. |
| `Hệ thống kiến thức...xlsx` & `danhsachkinang.xlsx` | File Excel bảng kỹ năng gốc của chuyên gia giáo dục. | **Đã trích xuất ra JSON & Wiki** | Chứa ghi chú gốc của chuyên gia sư phạm. | **🔵 RAW SOURCE**: Giữ nguyên làm bằng chứng gốc. |
| `question_bank/` *(group1 $\rightarrow$ group6.md, questions_data.js, compile scripts)* | Ngân hàng 680 câu hỏi tình huống mẫu phân theo 6 nhóm kỹ năng và 3 tầng nhận thức. | **Chưa tích hợp vào `wiki/` (và KHÔNG NÊN tích hợp hết vì quá lớn)** | Kho 680 câu hỏi tình huống có sẵn đáp án và lời khuyên phụ huynh. | **🟢 ACTIVE QUESTION BANK**: Giữ nguyên làm kho câu hỏi cho các tính năng Quiz/Explorer. |

---

### 📂 NHÓM V: MÃ NGUỒN THỰC THI (CODEBASE & PIPELINES)

| Thư Mục / File | Mục Đích & Nội Dung Cốt Lõi | Tình Trạng Tích Hợp | Giá Trị Đặc Thù Cần Lưu Ý | Khuyến Nghị & Quyết Định |
| :--- | :--- | :--- | :--- | :--- |
| `client/` | Toàn bộ ứng dụng di động React 18 + Capacitor + 10-Stage Lesson Runner + E2E Playwright. | **Đang thực thi trực tiếp** | Toàn bộ giao diện di động, âm thanh Web Audio, Haptics, Canvas phi thuyền. | **🟢 ACTIVE CODEBASE**: Tiếp tục phát triển. |
| `server/` | Project Cloudflare Workers + Wrangler config cho backend serverless. | **Sẵn sàng kết nối** | Khung backend sẵn sàng để kết nối Neon DB và Cloudflare R2. | **🟢 ACTIVE BACKEND**: Giữ nguyên để kích hoạt Phase sau. |
| `content-pipeline/` | Bộ công cụ script điều phối sinh nội dung tự động (`orchestrator/`, `prompts/`, `schemas/`). | **Đang chuẩn bị** | Khung code Python/Node để tự động hóa sinh hàng loạt bài học. | **🟢 ACTIVE TOOLING**: Giữ lại để tích hợp với `wiki/`. |
| `scripts/serve_review.js` | Script Node.js chạy HTTP review server trên cổng 8080. | **Đang sử dụng** | Phục vụ xem review trực quan trên trình duyệt. | **🟢 ACTIVE TOOLING**: Giữ nguyên. |

---

### 📂 NHÓM VI: CÁC FILE ĐƠN LẺ & FILE REVIEW HTML TẠI ROOT

| Tên File | Mục Đích & Nguồn Gốc | Tình Trạng Tích Hợp | Giá Trị Đặc Thù | Khuyến Nghị & Quyết Định |
| :--- | :--- | :--- | :--- | :--- |
| `project_knowledge_wiki_review.html` | Dashboard review tổng thể mới nhất đang chạy trên localhost:8080. | **Phản ánh 100% Wiki mới** | Giao diện tra cứu 5 tab trực quan, lọc kỹ năng Lớp 1-5. | **🟢 ACTIVE**: Giữ nguyên để review. |
| `wiki.html`, `novastars_os_portal.html`, `novastars_os_review.html` | Các trang HTML portal cũ tạo ở mốc trước. | **Đã được thay thế bởi file review mới** | Giao diện HTML xem doc cũ. | **🔴 LEGACY**: Gom vào `_archive/legacy_html/`. |
| `review_standalone.html`, `review.html`, `framework_review.html`, `blueprint_review.html`, `experience_framework_review.html`, `nlas_review.html`, `pkb_review.html` *(7 files)* | Các file snapshot review HTML tạo ra trong quá khứ để review từng module V1 riêng lẻ. | **Đã hoàn thành mục đích review ở quá khứ** | Bản render tĩnh của các file markdown cũ. | **🔴 LEGACY**: Gom vào `_archive/legacy_html/`. |
| `WIKI.md`, `SUMMARY.md`, `SYSTEM.md` | Các file tóm tắt markdown cũ ở thư mục gốc. | **Đã phân rã và hoàn thiện trong `wiki/` mới** | Tóm tắt sơ bộ ban đầu. | **🔴 REDUNDANT**: Gom vào `_archive/legacy_drafts/`. |
| `PROJECT CHARTER.docx` | Bản thảo Word gốc của dự án. | **Đã có markdown trong `00_Project Charter` & `01_VISION`** | File Word lưu trữ. | **🔴 ARCHIVE**: Gom vào `_archive/legacy_drafts/`. |
| `scratch_test.js` | Script chạy test tạm thời của lập trình viên trước. | **Không còn dùng** | Test nháp. | **🔴 REDUNDANT**: Gom vào `_archive/legacy_drafts/`. |
