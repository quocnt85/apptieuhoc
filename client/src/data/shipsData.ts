export interface SpaceshipModelData {
  id: string;
  name: string;
  nameVi: string;
  classType: string;
  price: number;
  badge: string;
  description: string;
  
  // Aerodynamic & Engineering Specs
  dragCoefficientCd: number; // Hệ số cản khí động học
  liftToDragRatio: number;   // Tỉ số lực nâng / lực cản (L/D)
  maxMachSpeed: number;      // Vận tốc tối đa (Mach)
  wingspanMeters: number;    // Sải cánh (m)
  lengthMeters: number;      // Chiều dài thân tàu (m)
  aerodynamicProfile: string;// Kiểu cấu hình cánh / thân
  engineType: string;        // Loại động cơ
  
  // Detailed Analysis
  aeroFeatures: string[];    // Các đặc tính khí động học chính
  idealRole: string;         // Vai trò tối ưu trong nhiệm vụ
}

export const SHIPS_DATA: SpaceshipModelData[] = [
  {
    id: 'explorer_v1',
    name: 'Nova Falcon V1',
    nameVi: 'Tiêm Kích Siêu Thanh Nova Falcon',
    classType: 'Supersonic Delta Interceptor',
    price: 0,
    badge: 'Cơ Bản & Nhanh Nhẹn',
    description: 'Phi thuyền tiêm kích siêu thanh với cánh tam giác Delta swept-back 58° và mũi nhọn chóp nón kim, tối ưu khả năng xuyên phá sóng xung kích âm thanh.',
    dragCoefficientCd: 0.018,
    liftToDragRatio: 5.2,
    maxMachSpeed: 3.5,
    wingspanMeters: 11.4,
    lengthMeters: 18.2,
    aerodynamicProfile: 'Delta-Wing Swept 58° + Needle Nose',
    engineType: 'Động cơ Turbojet Đốt Sau Kép (Twin Afterburners)',
    aeroFeatures: [
      'Mũi nhọn xuyên âm (Supersonic Needle Nose) triệt tiêu sóng chấn động',
      'Cánh tam giác Delta swept-back giảm diện tích tiếp xúc sóng âm',
      'Cặp cánh đuôi đứng nghiêng 15° (Canted Twin Stabilizers) ổn định góc tấn lớn',
      'Cửa hút khí hông hình nón đối xứng dòng khí nén vào buồng đốt'
    ],
    idealRole: 'Trinh sát nhanh, bay hành trình khí quyển và quỹ đạo thấp'
  },
  {
    id: 'falcon_apex',
    name: 'Apex Phantom X',
    nameVi: 'Tiêm Kích Tàng Hình Apex Phantom',
    classType: 'Stealth Hypersonic Fighter',
    price: 300,
    badge: 'Siêu Thanh Tàng Hình',
    description: 'Thiết kế thân liền cánh (Blended Wing-Body) kết hợp cánh thoi vát cạnh đa giác, giảm thiểu tối đa lực cản bề mặt và tán xạ sóng radar.',
    dragCoefficientCd: 0.014,
    liftToDragRatio: 6.8,
    maxMachSpeed: 4.8,
    wingspanMeters: 13.8,
    lengthMeters: 19.5,
    aerodynamicProfile: 'Blended Wing-Body (BWB) + Diamond Wing',
    engineType: 'Động cơ Scramjet Siêu Âm Kèm Ống Phun Vector 2D Dẹt',
    aeroFeatures: [
      'Thân liền khối cánh (BWB) tạo lực nâng phân bố đều toàn thân tàu',
      'Cánh thoi kim cương vát góc cản thấp chịu gia tốc tải lực g-force cao',
      'Ống xả dẹt đổi hướng lực đẩy 2 chiều (2D Thrust Vectoring Nozzles)',
      'Viền thân tàng hình góc cạnh tán xạ luồng khí mượt mà'
    ],
    idealRole: 'Đột kích tốc độ cao, xuyên qua tầng đối lưu bão tố của hành tinh'
  },
  {
    id: 'solar_phoenix',
    name: 'Solar Phoenix S',
    nameVi: 'Trinh Sát Tiên Phong Cánh Ngược Tiến',
    classType: 'Forward-Swept Agile Scout',
    price: 450,
    badge: 'Linh Hoạt Tuyệt Đối',
    description: 'Cấu hình cánh ngược tiến (Forward-Swept Wings) 25° kết hợp cánh mũi vịt (Canards), triệt tiêu hoàn toàn hiện tượng trôi luồng khí ở đầu cánh khi lượn vòng gấp.',
    dragCoefficientCd: 0.021,
    liftToDragRatio: 7.5,
    maxMachSpeed: 3.2,
    wingspanMeters: 14.2,
    lengthMeters: 17.8,
    aerodynamicProfile: 'Forward-Swept 25° + Canard Foreplanes + Winglets',
    engineType: 'Động cơ Phản Vật Chất Tinh Thể Kèm Bộ Đốt Plasma',
    aeroFeatures: [
      'Cánh ngược tiến chuyển xoáy khí vào gốc cánh, giữ cánh lái luôn bám khí',
      'Cánh mũi vịt (Canard) phía trước kiểm soát chúc ngóc nhạy bén',
      'Đầu cánh uốn cong (Aerodynamic Winglets) giảm 30% lực cản cảm ứng',
      'Buồng lái vòm pha lê năng lượng toàn cảnh 360 độ'
    ],
    idealRole: 'Cơ động không chiến tầm gần và thám hiểm địa hình hiểm trở'
  },
  {
    id: 'starlight_runner',
    name: 'Hyperion Dreadnought D-5',
    nameVi: 'Chiến Hạm Thân Nâng Hyperion D-5',
    classType: 'Heavy Armored Lifting Body',
    price: 600,
    badge: 'Chiến Hạm Hạng Nặng',
    description: 'Tuần dương hạm đa giác bọc giáp titan dày, áp dụng nguyên lý thân nâng (Lifting Body) với 4 cánh ổn định chữ X và 4 cụm động cơ ion phản lực đẩy cực mạnh.',
    dragCoefficientCd: 0.036,
    liftToDragRatio: 4.5,
    maxMachSpeed: 2.2,
    wingspanMeters: 22.0,
    lengthMeters: 32.5,
    aerodynamicProfile: 'Armored Lifting Fuselage + X-Config Dihedral Fins',
    engineType: 'Cụm 4 Động Cơ Đẩy Ion Hạt Nặng Đa Buồng Đốt',
    aeroFeatures: [
      'Thân tàu đa giác vát góc tạo lực nâng trực tiếp từ thân giáp dày',
      '4 cánh ổn định chữ X (Dihedral & Anhedral Fins) giữ thăng bằng tuyệt đối',
      'Lớp gốm tản nhiệt đa tầng chịu ma sát khí quyển đậm đặc',
      'Hệ thống xả khí phản lực phân tầng triệt tiêu rung chấn hồi quyển'
    ],
    idealRole: 'Chiến hạm chỉ huy, phòng hộ kiên cố và vận tải chiến thuật'
  },
  {
    id: 'astral_shuttle',
    name: 'Astral Shuttle Orbiter',
    nameVi: 'Tàu Con Thoi Quỹ Đạo Astral',
    classType: 'Orbital Trans-Atmospheric Shuttle',
    price: 750,
    badge: 'Chinh Phục Quỹ Đạo',
    description: 'Tàu con thoi không gian thế hệ mới với thân nâng lượn sóng, mũi tròn gốm tản nhiệt ma sát hồi quyển và cụm 3 động cơ tên lửa đẩy chính tam giác.',
    dragCoefficientCd: 0.028,
    liftToDragRatio: 5.8,
    maxMachSpeed: 25.0, // Re-entry orbital velocity
    wingspanMeters: 16.5,
    lengthMeters: 24.0,
    aerodynamicProfile: 'Trans-Atmospheric Wave Rider Lifting Body',
    engineType: 'Bộ 3 Động Cơ Tên Lửa Nhiên Liệu Lỏng Tri-Engine RS-30',
    aeroFeatures: [
      'Mũi tù tản nhiệt (Thermal Blunt Nose) tạo sóng nén đệm cách ly nhiệt lượng',
      'Đáy thân phẳng cong lượn sóng (Wave-rider underside) lướt trên sóng xung kích',
      'Cánh tam giác kép chịu tải trọng nhiệt hồi quyển tới 1800°C',
      '3 vòi phun tên lửa chính hình tam giác cân bằng trọng tâm đa quỹ đạo'
    ],
    idealRole: 'Chuyển tiếp giữa quỹ đạo vũ trụ và khí quyển mọi hành tinh'
  }
];
