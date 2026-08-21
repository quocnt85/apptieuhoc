export interface SpaceshipModelData {
  id: string;
  name: string;
  nameVi: string;
  classType: string;
  icon: string;
  price: number;
  badge: string;
  description: string;
  aestheticStyle?: string;
  scientificInstruments?: string[];
  
  // Game Stats cho học sinh tiểu học
  speed: number;        // ⚡ Tốc độ (1-100)
  shield: number;       // 🛡️ Giáp (1-100)
  power: number;        // 💥 Sức mạnh (1-100)
  specialFeature: string; // Kỹ năng đặc biệt ngắn gọn
}

export const SHIPS_DATA: SpaceshipModelData[] = [
  {
    id: 'explorer_v1',
    name: 'Nova Apex Hunter',
    nameVi: 'Tiêm Kích Thám Hiểm Nova Apex',
    classType: 'Tàu Tiêm Kích Cánh Ngược Siêu Thanh',
    icon: '🚀',
    price: 0,
    badge: 'Nova Apex Forward-Swept',
    aestheticStyle: 'Forward-Swept Aerodynamic Interceptor (Cánh Ngược & Tuabin Đôi Sáng)',
    description: 'Tiêm kích thám hiểm siêu thanh với đôi cánh xuôi ngược vuốt cong khí động học, buồng lái kính giọt nước bo tròn và 2 động cơ phản lực kép có tuabin sáng rực.',
    scientificInstruments: [
      'Cánh xuôi ngược khí động học (Forward-Swept Wings) linh hoạt',
      '2 Động cơ phản lực kép có tuabin 24 lá xoay sáng rõ',
      'Buồng lái vòm kính bo tròn trong suốt nhìn thấy bảng taplo HUD',
      'Que đo cảm biến siêu thanh Pitot Probe và 2 cánh tà canards'
    ],
    speed: 95,
    shield: 82,
    power: 90,
    specialFeature: 'Lượn cánh xuôi ngược bứt tốc né vật cản chớp nhoáng'
  },
  {
    id: 'falcon_apex',
    name: 'Chrono Voyager',
    nameVi: 'Phi Thuyền Viễn Du Chrono',
    classType: 'Tàu Viễn Du Thân Đĩa Lai Cánh Cung',
    icon: '🚀',
    price: 300,
    badge: 'Chrono Crescent Saucer',
    aestheticStyle: 'Hybrid Crescent-Saucer Cruiser (Thân Đĩa Lai Cánh Cung & Đĩa Radar Lượng Tử)',
    description: 'Phi thuyền viễn du dải ngân hà với thân đĩa khí động học kết hợp 2 cánh vòm hình cánh cung, đĩa radar lượng tử xoay 360° và 4 động cơ ion đa tầng.',
    scientificInstruments: [
      'Thân đĩa elip kết hợp 2 cánh vòm hình cung ôm sát thân',
      'Đĩa Radar lượng tử đa trục xoay 360° quét tín hiệu tinh cầu',
      'Buồng lái bán cầu bo tròn phía trước mạ nano chống bức xạ',
      'Cụm 4 động cơ ion đa tầng có vòng tản nhiệt đồng và dải Cyan'
    ],
    speed: 98,
    shield: 88,
    power: 96,
    specialFeature: 'Đĩa radar lượng tử lập bản đồ toàn cảnh dải ngân hà'
  },
  {
    id: 'solar_phoenix',
    name: 'Orion Sky-Carrier',
    nameVi: 'Chiến Hạm Chỉ Huy Quỹ Đạo Orion',
    classType: 'Chiến Hạm Chỉ Huy Quỹ Đạo Đa Năng',
    icon: '🚀',
    price: 450,
    badge: 'Orion Command Carrier',
    aestheticStyle: 'Heavy Orbital Sky-Carrier (Sàn Đáp Drone Mini & Đài Chỉ Huy Vòm Kính)',
    description: 'Chiến hạm mẹ vĩ đại với thân nâng đa tầng, đài chỉ huy vòm kính toàn cảnh trên đỉnh, 2 sàn hạ cánh drone mini ở 2 mạn và 4 động cơ nhiệt hạch.',
    scientificInstruments: [
      'Đài chỉ huy vòm kính toàn cảnh bo tròn trên đỉnh có HUD xanh ngọc',
      '2 Sàn hạ cánh drone thám hiểm mini ở 2 mạn có đèn dẫn đường',
      '4 Khối động cơ phản lực hạt nhân nhiệt hạch siêu công suất',
      'Cột ăng-ten mạ vàng tiếp sóng viễn thám không gian sâu'
    ],
    speed: 82,
    shield: 100,
    power: 98,
    specialFeature: 'Sàn đáp triển khai mạng lưới drone thám hiểm không gian'
  },
  {
    id: 'starlight_runner',
    name: 'AeroShuttle X-9',
    nameVi: 'Con Thoi Khí Động Học AeroShuttle',
    classType: 'Tàu Con Thoi Khí Động Học Thế Hệ Mới',
    icon: '🚀',
    price: 600,
    badge: 'AeroShuttle Lifting-Body',
    aestheticStyle: 'Lifting-Body Double-Delta (Bụng Gạch Đen, Vây Chữ V & 3 Động Cơ Tên Lửa)',
    description: 'Con thoi không gian thế hệ mới với thân nâng Double-Delta liền cánh, bụng gạch đen composite chống nhiệt, vây đuôi chữ V và 3 động cơ tên lửa De Laval.',
    scientificInstruments: [
      'Thân nâng Double-Delta liền cánh lướt gió khí quyển mượt mà',
      'Bụng dưới bọc lớp gạch composite đen chống nhiệt khí quyển',
      'Buồng lái vòm kính bo tròn trong suốt có màn hình HUD phi công',
      'Cụm 3 động cơ tên lửa De Laval mạ crom và 2 vây đuôi chữ V'
    ],
    speed: 94,
    shield: 92,
    power: 94,
    specialFeature: 'Thân nâng Double-Delta hạ cánh mượt mà xuống mọi hành tinh'
  },
  {
    id: 'astral_shuttle',
    name: 'Hyperion Star-Lifter V',
    nameVi: 'Tàu Phóng Thám Hiểm Hyperion V',
    classType: 'Tàu Phóng Thám Hiểm Liên Hành Tinh',
    icon: '🚀',
    price: 750,
    badge: 'Hyperion Multi-Stage',
    aestheticStyle: 'Multi-Stage Planetary Star-Lifter (Vây Lưới Gập & 5 Động Cơ Aerospike)',
    description: 'Tàu phóng thám hiểm liên hành tinh 3 tầng với 4 vây lưới gập (Grid Fins), 4 càng hạ cánh tự động, 5 động cơ Aerospike phun lửa plasma và khoang capsule phi hành gia.',
    scientificInstruments: [
      'Cụm 5 động cơ tên lửa Aerospike / De Laval phun lửa plasma cam',
      '4 Vây lưới gập (Grid Fins) điều hướng luồng khí quyển hạ cánh',
      'Khoang lái phi hành gia bo tròn hình capsule trên tầng 3',
      'Tháp giàn giáo cảm biến viễn thám lượng tử trên đỉnh'
    ],
    speed: 100,
    shield: 96,
    power: 100,
    specialFeature: 'Lực đẩy 5 động cơ Aerospike vượt qua mọi lực hút tinh cầu'
  }
];
