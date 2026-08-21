# PRD v1.1 — MINI GAME: CHIẾN HẠM NOVA – VƯỢT DẢI THIÊN THẠCH

> Trạng thái: **MVP đã khóa phạm vi — sẵn sàng triển khai**
>
> Tên tiếng Anh: **Nova Fleet: Asteroid Runner 3D**
>
> Cập nhật: 21/08/2026

---

## 0. QUYẾT ĐỊNH ĐÃ KHÓA CHO MVP

PRD gốc bên dưới mô tả tầm nhìn đầy đủ. MVP đầu tiên là một **vertical slice arcade có độ hoàn thiện cao**, với các quyết định bắt buộc sau:

1. Chỉ dùng 5 tàu đã có model 3D thật: Bạch Đằng, Chi Lăng, Điện Biên Phủ, Ngọc Hồi và Quảng Trị. Người chơi chỉ chọn được tàu đã sở hữu.
2. Năm vũ khí MVP tương ứng là W1, W2, W5, W6 và W7. W3, W4, W8 cùng ba tàu placeholder để Phase 2.
3. Một màn Normal duy nhất, thời lượng mục tiêu 2–3 phút gồm chặng thiên thạch và Titan cuối màn.
4. Ba kích thước thiên thạch (Small/Medium/Large), ba chất liệu (Rock/Hard Rock/Crystal) và ba power-up (Heal/Time Slow/Orbiter).
5. Game chạy portrait immersive fullscreen; ẩn app header/bottom navigation trong lobby và trận đấu; tôn trọng toàn bộ safe area.
6. Cân bằng chung cho lớp 1–5 với hitbox nhỏ hơn hình tàu, pickup magnet, telegraph rõ ràng và hỗ trợ ngầm khi HP thấp.
7. Lượt đầu mỗi ngày miễn phí; các lượt tiếp theo tốn 10 Energy; Continue tốn 10 Energy.
8. Không tích hợp quảng cáo trong MVP. `instant_refuel` tiếp tục dùng theo hành vi hiện có của app.
9. Âm thanh hybrid: synth/sample/BGM được phép, nhưng mọi nguồn phải đi qua Audio Safety Graph và tôn trọng cài đặt SFX/BGM của app.
10. Easy, Hard, Bullet Hell, Blackhole, Team Summon, Mid-stage Wormhole và ba tàu placeholder thuộc roadmap sau MVP.

### 0.1. Luồng MVP

`Home CTA → Lobby chọn tàu → Tutorial ngắn → Asteroid Run → Titan → Wormhole → Result → Home/Chơi lại`

- Rời trận hoặc thất bại nhận 50% số xu đã nhặt; chiến thắng nhận 100% và thưởng hoàn thành.
- Xu nhận trong một run có giới hạn để tránh farm bằng cách thoát sớm.
- Game tự pause khi ứng dụng mất focus/đi background và không tiếp tục mô phỏng thời gian khi bị pause.

### 0.2. Tiêu chí nghiệm thu MVP

- Chạy ở kích thước chuẩn iPhone X `375 × 812`, portrait, không che notch/home indicator và không cuộn trang.
- Mục tiêu 60 FPS; không tụt dưới 45 FPS liên tục quá 2 giây trong stress run trên iPhone X thật.
- Pointer Events hoạt động với touch/mouse; có `pointercancel`; WASD/arrow/Space hoạt động trên desktop.
- Có giới hạn số asteroid, bullet và particle; tất cả đối tượng gameplay tái sử dụng hoặc được dọn dẹp đúng hạn.
- Có đủ lobby, HUD, pause/resume, damage feedback, game over/continue, victory và reward persistence.
- Không có âm thanh phát trực tiếp ra `Tone.Destination`; build phải qua `npm run check:audio-safety`.
- Có E2E viewport iPhone X cho entry, safe-area/fullscreen shell, touch drag, pause và reward-once.

---

## 1. TỔNG QUAN DỰ ÁN (PRODUCT OVERVIEW)

### 1.1. Bối cảnh & Mục tiêu
- **Tên trò chơi**: Chiến Hạm Nova: Thám Hiểm Thiên Thạch (*Nova Fleet: Asteroid Striker 3D*).
- **Thể loại**: Vertical Scrolling Shoot 'Em Up (Shmup Top-Down 2.5D) định hướng giáo dục, không bạo lực.
- **Nền tảng**: Web App (React 18 + TypeScript + Three.js / React Three Fiber Engine 60FPS), tối ưu 100% cảm ứng đa điểm trên mobile/tablet và bàn phím/chuột trên desktop.
- **Điểm truy cập**: Thẻ Card 3D nổi bật tại **Trang chủ (`HomeView`)** và mục Mini Game trong thanh điều hướng.
- **Đối tượng người dùng**: Học sinh tiểu học (Lớp 1 – Lớp 5) và phụ huynh.
- **Mục tiêu cốt lõi**:
  - Tạo sân chơi giải trí bổ ích, rèn luyện phản xạ nhanh nhạy và tư duy chiến thuật.
  - Tận dụng toàn bộ đội tàu 3D Three.js người chơi đã sở hữu (`OriginalCinematicFleet`).
  - Là nguồn kiếm **Xu Nova (`novaCoins`)** năng động để học sinh có động lực tích lũy và mở khóa các phi thuyền lịch sử Việt Nam mới trong Garage/Showroom.

### 1.2. Định hướng Thiết kế Thân thiện & Không bạo lực (Non-Violent & Kid-Friendly)
- **Không có kẻ địch dạng sinh vật/người/quân sự đối đầu**: Học sinh không tiêu diệt quân địch hay bắn nhau, mà nhập vai phi hành gia dọn dẹp và khai thác các dải thiên thạch (Asteroids) & rác vũ trụ để mở đường cho hạm đội thám hiểm.
- **Cơ chế phân rã vật chất (Material Fragmentation)**: Thiên thạch lớn khi bị bắn trúng sẽ vỡ đôi thành các mảnh nhỏ hơn, vỡ tiếp thành mảnh vụn rồi tan biến thành bụi sao lấp lánh và giải phóng khoáng thạch, xu Nova cùng năng lượng.
- **Hiệu ứng thị giác tươi sáng, rực rỡ**: Đồ họa phong cách sci-fi tươi sáng (Cyan, Gold, Neon Violet), hiệu ứng hạt (particles) long lanh, không có hiệu ứng cháy nổ máu me rùng rợn.

---

## 2. TRẢI NGHIỆM ĐIỀU KHIỂN & CƠ CHẾ CAMERA (CORE MECHANICS & CONTROLS)

### 2.1. Đa Chế Độ Điều Khiển (Mobile Touch & Desktop Keyboard)
1. **Cảm ứng Di Động / Chuột (One-Finger Touch & Drag)**:
   - **Chạm bất kỳ đâu (Touch Anywhere / Relative Drag)**: Đặt ngón tay vào bất kỳ điểm nào trên màn hình để điều khiển phi thuyền theo độ dịch chuyển ($\Delta X, \Delta Y$), không bị ngón tay che khuất tầm nhìn.
   - **Tự động khai hỏa khi chạm (Autofire on Touch)**: Chạm/giữ tay là tàu tự động bắn liên tục theo nhịp bắn chuẩn (*Fire Rate*); nhấc tay là tàu dừng bắn và đứng yên.
2. **Bàn Phím Máy Tính (Desktop Controls)**:
   - **Di chuyển**: Phím **W, A, S, D** hoặc **4 Phím Mũi Tên** ($\uparrow, \leftarrow, \downarrow, \rightarrow$).
   - **Khai hỏa**: Giữ **Phím Space (Cách)** để bắn đạn liên tục.

### 2.2. Độ Phản Hồi & Cơ Chế Va Chạm (Responsiveness, Damage & Knockback)
- **Độ nhạy (Responsiveness)**: Vận tốc di chuyển của tàu bám theo thao tác người chơi bằng hàm Lerp mượt mà với hệ số $\lambda_{speed}$ tỷ lệ thuận với chỉ số **Tốc độ (`speed`)** của tàu (Tàu nhẹ phản hồi cực nhanh, tàu nặng có độ trễ quán tính nhẹ).
- **Máu của Phi Thuyền**: **$\text{Max HP} = \text{Chỉ số Giáp (Shield)}$** của phi thuyền (Ví dụ: *Bạch Đằng Pioneer: 42 HP; Điện Biên Phủ Carrier: 99 HP; Thánh Gióng: 100 HP*).
- **Sát thương khi Va chạm Thiên thạch**:
  - **Mảnh vụn (Debris)**: Trừ **$10\text{ HP}$**.
  - **Thiên thạch Nhỏ (Small)**: Trừ **$15\text{ HP}$**.
  - **Thiên thạch Vừa (Medium)**: Trừ **$25\text{ HP}$**.
  - **Thiên thạch Cổ đại / Khổng lồ (Titan / Huge)**: Trừ **$100\text{ HP}$** (nguy hiểm chết người).
- **Quy tắc Va chạm**:
  - Thiên thạch sau khi va vào tàu **vẫn tiếp tục trôi xuống**, không bị biến mất.
  - Phi thuyền khi bị va chạm sẽ **bị giật nảy (Knockback) lùi lại 1 chút** kèm hiệu ứng chớp đỏ bảo vệ tạm thời (0.5s invulnerable).

### 2.3. Hiệu ứng Nghiêng 2.5D (Cosmetic 3D Tilting Animations)
Góc nhìn chính diện từ trên xuống (Top-down 2.5D Three.js). Khi phi thuyền di chuyển, thân tàu thực hiện hoạt ảnh nghiêng mô phỏng không gian 3 chiều:
- **Di chuyển sang Trái / Phải**: Nghiêng thân phi thuyền góc **$30^\circ$** về hướng rẽ (*Roll Axis*).
- **Di chuyển Tiến lên phía trước**: Mũi phi thuyền chúi xuống **$10^\circ$** (*Pitch Down*).
- **Di chuyển Lùi lại phía sau**: Mũi phi thuyền ngửa lên **$10^\circ$** (*Pitch Up*).
- **Đặc tính hoạt ảnh**:
  - Có **Ease-In / Ease-Out** mềm mại (thời gian chuyển trạng thái $\approx 150\text{ms}$).
  - Khi đứng yên hoặc giảm tốc: Thân tàu từ từ trở về trạng thái cân bằng phẳng ($0^\circ$).
  - **Hoàn toàn mang tính thẩm mỹ (Cosmetic Only)**: Không làm thay đổi kích thước Hitbox và không làm lệch trục bắn thẳng của đạn.

---

## 3. HỆ THỐNG PHI THUYỀN, SẢNH CHỜ & BẢNG VŨ KHÍ (SHIPS & WEAPONS)

### 3.1. Sảnh Chờ Đổi Tàu (Lobby Ship Selector)
- Ngay tại màn hình bắt đầu Mini Game (Lobby Modal), học sinh có thể:
  - Xem trước mô hình 3D xoay tròn của tàu đang chọn.
  - Xem chi tiết các chỉ số: Tốc độ (Speed), Giáp (HP), Sức mạnh (Power) và Loại đạn trang bị.
  - Bấm nút chuyển đổi qua lại giữa các phi thuyền mình đã sở hữu (`unlockedShips`) và chọn trang bị ngay (`equipShip`).

### 3.2. Bảng 8 Loại Vũ khí Cơ bản Ánh Xạ Theo Phi Thuyền

| ID Vũ Khí | Tên Vũ Khí | Đặc Tính Kỹ Thuật (Power, Speed, AOE, Fire Rate) | Cơ Chế Đường Đạn | Phi Thuyền Trang Bị (Trong Game) |
| :--- | :--- | :--- | :--- | :--- |
| **W1** | **Đạn đơn (Single Shot)** | - Power: `1.0`<br>- Speed: `8`<br>- Fire Rate: `0.18s`<br>- AOE: `0` | Bắn 1 tia đạn plasma thẳng phía trước. Ổn định, cơ bản. | 🚀 **Bạch Đằng Pioneer** *(Tàu Mặc Định, Giá 0 Xu)* |
| **W2** | **Đạn đôi (Twin Shot)** | - Power: `1.5` (0.75 x 2)<br>- Speed: `6`<br>- Fire Rate: `0.22s`<br>- AOE: `0` | Bắn 2 luồng đạn song song từ 2 bên mạn cánh. Phủ làn đạn rộng hơn. | 🛰️ **Chi Lăng Cruiser** *(300 Xu Nova)* |
| **W3** | **Đạn Laser Xuyên Thấu (Piercing Laser)** | - Power: `1.2`<br>- Speed: `4`<br>- Fire Rate: `0.25s`<br>- AOE: `Xuyên Thấu` | Bắn chùm tia laser xuyên qua mọi thiên thạch trên đường bay. | 🛸 **Chương Dương Cruiser** *(900 Xu Nova)* |
| **W4** | **Plasma Năng Lượng (Plasma Charge Shot)** | - Power: `5.0`<br>- Speed: `2`<br>- Fire Rate: `0.70s`<br>- AOE: `Nhỏ (35px)` | Bắn quả cầu plasma cực lớn, tốc độ chậm nhưng sát thương cực khủng, nổ lan khi va chạm. | 🏔️ **Sơn Tinh Titan** *(1200 Xu Nova)* |
| **W5** | **Bom Chùm Tầm Ngắn (Cluster Bomb)** | - Power: `3.0`<br>- Speed: `3`<br>- Fire Rate: `0.50s`<br>- AOE: `Rộng (80px)` | Bắn đầu đạn bay tối đa 1/4 chiều dài màn hình rồi phát nổ tỏa mảnh phá hủy diện rộng. | 🚢 **Điện Biên Phủ Carrier** *(450 Xu Nova)* |
| **W6** | **Đạn Chùm Rẻ Quạt (Spread Fan Shot)** | - Power: `0.5` x 3 tia<br>- Speed: `8`<br>- Fire Rate: `0.20s`<br>- AOE: `Rẻ Quạt 30°` | Bắn đồng thời 3 tia đạn tỏa ra hình nan quạt, quét sạch các mảnh vụn nhỏ. | 🛩️ **Ngọc Hồi Shuttle** *(600 Xu Nova)* |
| **W7** | **Tên Lửa Thẳng (Straight Missile)** | - Power: `2.0`<br>- Speed: `6`<br>- Fire Rate: `0.30s`<br>- AOE: `Hẹp (45px)` | Phóng tên lửa bay thẳng có vệt khói, kích nổ sát thương diện vừa. | 🚀 **Quảng Trị Destroyer** *(750 Xu Nova)* |
| **W8** | **Tên Lửa Tầm Nhiệt (Homing Missile)** | - Power: `1.5`<br>- Speed: `5`<br>- Fire Rate: `0.28s`<br>- AOE: `Hẹp (40px)` | Tên lửa tự động chuyển hướng tìm mục tiêu thiên thạch gần nhất trong tầm mắt. | ⚡ **Thánh Gióng Colossus** *(1500 Xu Nova)* |

---

## 4. CHƯỚNG NGẠI VẬT, 6 CHẤT LIỆU & THIÊN THẠCH CỔ ĐẠI CUỐI MÀN (BOSS ASTEROID)

### 4.1. Cấp độ Kích thước & Quá trình Phân mảnh
1. **Thiên thạch Khổng lồ (Huge - Bán kính 48px)**: Bị phá hủy $\rightarrow$ Tách thành **2 Thiên thạch Lớn** văng ra 2 hướng chếch $45^\circ$ + Rớt Xu to/Power-up.
2. **Thiên thạch Lớn (Medium - Bán kính 32px)**: Bị phá hủy $\rightarrow$ Tách thành **2 Thiên thạch Nhỏ**.
3. **Thiên thạch Nhỏ (Small - Bán kính 18px)**: Bị phá hủy $\rightarrow$ Tách thành **2-3 Mảnh Vụn Sao**.
4. **Mảnh Vụn (Debris - Bán kính 10px)**: Bị bắn trúng $\rightarrow$ Biến mất hoàn toàn, giải phóng bụi sao và rớt xu nhỏ.

### 4.2. Hệ thống 6 Chất liệu Khoáng sản
- **Rock (Đá thường)**: Hệ số máu **x1** (Base HP: 2 / 6 / 14).
- **Hard Rock (Đá cứng)**: Hệ số máu **x2** (Base HP: 4 / 12 / 28).
- **Silver (Khoáng Bạc)**: Hệ số máu **x4** (Base HP: 8 / 24 / 56).
- **Gold (Khoáng Vàng)**: Hệ số máu **x8** (Base HP: 16 / 48 / 112).
- **Platinum (Bạch Kim)**: Hệ số máu **x16** (Base HP: 32 / 96 / 224).
- **Diamond (Kim Cương)**: Hệ số máu **x32** (Base HP: 64 / 192 / 448).

### 4.3. Thiên Thạch Cổ Đại Cuối Màn (Titan Asteroid & Victory Wormhole)
- Khi thanh tiến độ màn chơi đạt **$100\%$**:
  - Toàn bộ thiên thạch nhỏ ngừng sinh ra.
  - Một **Khối Thiên Thạch Cổ Đại Khổng Lồ (Titan Asteroid)** trôi chậm xuống, chiếm trọn **toàn bộ chiều ngang màn hình (Full Width)**.
  - Người chơi bắt buộc phải tập trung hỏa lực bắn phá hủy toàn bộ thanh máu của khối thiên thạch cổ đại này.
  - **Sau khi nổ tung**: Một cổng **Wormhole Chiến Thắng (Victory Wormhole)** rực rỡ sẽ xuất hiện ngay tại vị trí khối đá vỡ. Phi thuyền bay vào tâm Wormhole để chính thức chiến thắng màn chơi và mở màn tiếp theo.

---

## 5. HỆ SINH THÁI POWER-UPS & SỰ KIỆN ĐẶC BIỆT

### 5.1. Nâng Cấp Vĩnh Viễn Trong Ván (Permanent Upgrades - Cumulative)
- **+20% Tốc độ bắn (Attack Speed)** (cộng dồn).
- **+15% Tốc độ di chuyển tàu (Move Speed)** (cộng dồn).
- **+10% Sức mạnh đạn (Bullet Damage)** (cộng dồn).
- **Vệ tinh Orbiter (Tối đa 2 Orbiter)**: Bắn cùng loại đạn với tàu mẹ với $50\%$ Power và $50\%$ AOE.

### 5.2. Power-ups Tức Thời & Thời Gian (Active Power-ups)
- **Hồi Máu (Healing Kits)**: Hồi $20\%$, $50\%$ hoặc $100\%$ HP.
- **Hố Đen Vũ Trụ (Blackhole Event - 6s)**: Hút và nghiền nát toàn bộ chướng ngại vật trên đỉnh màn hình.
- **Làm Chậm Thời Gian (Time Slow - 10s)**: Giảm $50\%$ tốc độ bay của mọi thiên thạch.
- **Vô Hình Xuyên Không (Phase Cloak - 10s)**: Tàu bán trong suốt, xuyên qua mọi thiên thạch mà không mất máu.
- **Biên Đội Viện Trợ (Team Summon - 15s)**: 2 tàu đồng đội ngẫu nhiên (DPS $\ge$ tàu hiện tại) yểm trợ hỏa lực.

### 5.3. Sự Kiện Ngẫu Nhiên Trong Trận
- **Tàu Đồng Đội Tiếp Tế (Resupply Ship)**: Bay ngang qua thả túi máu/power-up (trung bình 120s/lần, min 30s, max 210s).
- **Cổng Wormhole Phụ (Mid-Stage Wormhole)**: Xuất hiện ngẫu nhiên sau vật cản lớn, bay vào nhảy cóc $+20\%$ tiến độ màn chơi.

---

## 6. QUẢN LÝ NĂNG LƯỢNG & LUỒNG KẾT THÚC TRẬN ĐẤU (ENERGY & GAME OVER FLOW)

### 6.1. Chi Phí Năng Lượng (Energy Economy)
- **Bắt đầu ván chơi mới**: Trừ **$10\text{ Năng lượng}$**.
- **Mỗi ván chơi có duy nhất 1 Mạng (1 Life)**.

### 6.2. Luồng Khi Thua Trận (HP = 0 - Game Over Modal)
Khi HP về 0, hiển thị Game Over Modal với 3 lựa chọn:
1. **Hồi Sinh Tiếp Tục (Continue)**:
   - Chi phí: **$15\text{ Năng lượng}$**.
   - Quyền lợi: Hồi đầy $100\%$ HP + $3\text{ giây}$ bất tử (invulnerable) để tiếp tục tiến độ màn chơi hiện tại.
2. **Chơi Lại Từ Đầu (Restart)**:
   - Chi phí: **$10\text{ Năng lượng}$**.
   - Quyền lợi: Khởi động lại màn chơi từ $0\%$ tiến độ.
3. **Bỏ Cuộc (Quit)**:
   - Không tốn năng lượng.
   - Toàn bộ số Xu Nova nhặt được trong ván chơi sẽ được cộng dồn vào tài khoản ví người chơi (`useGameStore`). Trở về sảnh Trang chủ.

### 6.3. Giải Pháp Khi Hết Năng Lượng (Out of Energy Solutions)
Khi học sinh không đủ 10 hoặc 15 năng lượng, hệ thống cung cấp 3 giải pháp thân thiện:
1. 🎬 **Xem Quảng Cáo Nhận Năng Lượng**: Xem 1 video quảng cáo ngắn (tối đa 3 lần/ngày) để nhận ngay **$+10\text{ Năng lượng}$** (tương đương 1 lượt chơi).
2. 🎒 **Dùng Vật Phẩm Trong Kho Đồ**: Sử dụng thẻ nạp năng lượng nhanh (`instant_refuel`) trong túi đồ để hồi phục $100\%$ ($50/50$ năng lượng).
3. ⏳ **Chờ Nạp Tự Nhiên**: Tự động hồi 1 năng lượng mỗi chu kỳ thời gian quy định.

---

## 7. ÂM THANH WEB AUDIO & HIỆU ỨNG VFX

- **Web Audio API SFX**: 100% tự tổng hợp thời gian thực, 8 tiếng súng riêng biệt, tiếng kim loại va chạm, tiếng nổ thiên thạch, tiếng chuông nhặt xu C-E-G-C, tiếng kích hoạt hố đen/wormhole, an toàn thính giác học sinh.
- **VFX 3D**: Đạn phát sáng đổi màu theo sức mạnh (Cyan $\rightarrow$ Purple $\rightarrow$ Gold), hào quang Phase mờ ảo, sóng nổ shockwave, bụi sao lấp lánh khi thiên thạch vỡ.

---

## 8. LỘ TRÌNH TRIỂN KHAI THEO GIAI ĐOẠN

- **Phase 1**: Dữ liệu vũ khí, thiên thạch, cân bằng stats & Web Audio API sound synthesizer.
- **Phase 2**: Three.js Canvas 2.5D, Tàu 3D Three.js, bộ điều khiển 1 chạm mobile + phím WASD/Space desktop, 2.5D tilt roll/pitch.
- **Phase 3**: 8 hệ thống đạn, thiên thạch 3D phân rã 4 cấp & 6 chất liệu, cơ chế va chạm trừ máu theo kích thước & knockback.
- **Phase 4**: Power-ups, 2 Vệ tinh Orbiter, sự kiện tàu tiếp tế thả quà, Wormhole nhảy cóc $20\%$ & Thiên thạch Cổ đại Boss cuối màn.
- **Phase 5**: HUD hiển thị trực quan, Modal Game Over (Hồi sinh 15 Năng lượng / Chơi lại 10 / Bỏ cuộc), cơ chế xem Ads & dùng vật phẩm nạp năng lượng.
- **Phase 6**: Tích hợp sảnh chờ đổi tàu 3D tại `HomeView`, đồng bộ ví xu Nova, kiểm thử E2E Playwright và tối ưu 60 FPS.
