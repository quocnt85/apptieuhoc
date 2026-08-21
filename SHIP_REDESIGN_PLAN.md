# Kế hoạch nâng cấp đội phi thuyền Three.js

## 1. Hiện trạng đã xác nhận

- Ứng dụng dùng React 18, Three.js, React Three Fiber và Drei.
- Ba nơi hiển thị tàu (bản đồ hành tinh, showroom, hangar) cùng đi qua `AerodynamicShipRenderer`.
- Renderer đang chạy nằm trong `client/src/components/3d/ships/OriginalCinematicFleet.tsx`; `AerodynamicShips.tsx` chỉ là lớp export.
- Năm tàu hiện tại được ghép chủ yếu từ box/cylinder/cone đơn giản. Silhouette còn vuông, cánh dày, vật liệu chưa thống nhất, hiệu ứng động cơ còn là cone phẳng.
- `shipColor` hiện chỉ thực sự ảnh hưởng tàu đầu tiên; bốn tàu còn lại chưa nhận màu tùy biến. `showStreamlines` cũng chưa được renderer hiện tại sử dụng.
- Repo đang có thay đổi dở dang ở một số file khác; phần nâng cấp sẽ tránh chạm vào chúng.

## 2. Mục tiêu hình ảnh

Tạo một đội tàu đồng nhất theo ngôn ngữ “Nova Fleet”: thân tàu hard-surface khí động học, nhiều lớp giáp, khe sáng năng lượng, kính cockpit có chiều sâu, động cơ nhiều tầng và silhouette nhận diện rõ ngay cả trên màn hình nhỏ.

### Năm thiết kế riêng biệt

1. **Nova Apex Hunter** — interceptor mũi nhọn, cánh ngược chữ V, hai nacelle lớn, cảm giác nhanh và hung hãn.
2. **Chrono Voyager** — tàu viễn du dạng crescent/saucer, lõi lượng tử phát sáng, radar quay và bốn động cơ ion.
3. **Orion Sky-Carrier** — chiến hạm nặng, thân nhiều tầng, hai boong drone hai bên, cầu chỉ huy sáng và cụm động cơ lớn.
4. **AeroShuttle X-9** — lifting-body/double-delta liền khối, bụng chống nhiệt tối, cockpit dài và ba động cơ tên lửa.
5. **Hyperion Star-Lifter V** — tàu phóng liên hành tinh thân dài, nhiều tầng, grid-fin, vòng khóa tầng và cụm năm động cơ.

## 3. Hướng triển khai

### Giai đoạn A — Xây bộ kit hình học và vật liệu dùng chung

- Tạo helper sinh `BufferGeometry` cho cánh/giáp dạng polygon extrude để thay các khối box thô.
- Tạo các component dùng lại: panel giáp, canopy, engine/nozzle nhiều tầng, đèn navigation, energy strip, decal cờ Việt Nam và flame lõi kép.
- Chuẩn hóa palette vật liệu: hull theo `shipColor`, giáp tối, kim loại gunmetal, kính xanh tím, accent emissive.
- Dùng geometry/material tái sử dụng và chi tiết có kiểm soát, không nhập GLB hay texture nặng.

### Giai đoạn B — Dựng lại năm tàu

- Dựng silhouette chính trước, sau đó thêm lớp giáp, đường panel, intake, turbine, antenna và chi tiết nhận diện.
- Giữ cùng quy ước hướng: mũi tàu về `-Z`, động cơ về `+Z`, để camera preset và animation bay hiện tại tiếp tục đúng.
- Chuẩn hóa kích thước/bounding box để đổi tàu không bị nhảy tỷ lệ trong showroom và hangar.
- Mọi tàu đều nhận `shipColor`, `hasVnFlag` và `showStreamlines`.

### Giai đoạn C — Hiệu ứng chuyển động

- Flame động cơ gồm lõi trắng, plasma màu và halo trong suốt; pulse mượt theo thời gian, không dùng `Math.random()` mỗi frame.
- Turbine/radar/energy core có animation riêng nhưng biên độ nhỏ để tàu trông sống động, không gây rối.
- `showStreamlines` tạo các vệt khí động học mảnh chạy dọc thân/cánh; chỉ bật khi người dùng yêu cầu hoặc tàu đang bay.
- Giữ animation bay hiện tại trên bản đồ và kiểm tra lại orientation khi tàu bám theo bề mặt hành tinh.

### Giai đoạn D — Ánh sáng và trình bày

- Chỉnh nhẹ lighting trong showroom/hangar nếu cần để đọc rõ form kim loại, rim light và cockpit.
- Không đổi UI, dữ liệu giá/stats, luồng mua/trang bị hay ảnh thumbnail trong phạm vi đầu tiên.
- Nếu model mới lệch với thumbnail JPG hiện tại, xử lý thumbnail là bước tùy chọn sau khi bạn duyệt model 3D.

## 4. Giới hạn hiệu năng

- Không thêm dependency và không tải model/texture ngoài.
- Ưu tiên khoảng 80–160 draw calls cho một tàu ở showroom; bản đồ hành tinh dùng cùng model nhưng chi tiết nhỏ được giản lược theo prop `detailLevel` nếu phép đo cho thấy cần thiết.
- Không cấp phát `Vector3`, material hoặc geometry mới trong vòng lặp `useFrame`.
- Giữ DPR hiện tại, tránh shadow map thời gian thực và post-processing nặng để phù hợp thiết bị di động.

## 5. Kiểm thử và nghiệm thu

- Chạy TypeScript build và Vite production build.
- Chạy E2E showroom hiện có để xác nhận đủ năm tàu, camera preset, màu sơn, cờ Việt Nam và streamlines.
- Mở app trong browser panel, chụp/quan sát từng tàu ở góc tổng thể, mũi, cạnh và động cơ; kiểm tra desktop và viewport di động.
- Kiểm tra hangar modal và tàu thu nhỏ trên bản đồ hành tinh để bảo đảm không clipping, không sai hướng và vẫn dễ nhận diện.

## 6. Phạm vi file dự kiến

- Sửa chính: `client/src/components/3d/ships/OriginalCinematicFleet.tsx`.
- Có thể tách thêm một file kit dùng chung trong cùng thư mục nếu renderer trở nên quá dài.
- Chỉ chỉnh `SpaceShowroomView.tsx`, `SpaceHangarView.tsx` hoặc `SpaceCanvas.tsx` khi kiểm tra trực quan cho thấy lighting/camera cần tinh chỉnh.
- Không chạm các file đang có thay đổi dở dang ngoài phạm vi tàu.

## 7. Điểm bạn duyệt

Sau khi được duyệt, mình sẽ triển khai trọn gói A–D, tự build/test và gửi ảnh kiểm tra trực quan của cả năm tàu. Mặc định mình giữ phong cách **cinematic hard-surface, ngầu nhưng thân thiện với học sinh**, không biến tàu thành thiết kế quân sự quá tối hoặc đáng sợ.
