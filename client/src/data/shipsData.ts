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
    name: 'Nova X-Wing Explorer',
    nameVi: 'Chiến Hạm Cánh X-Wing',
    classType: 'Tàu Thám Hiểm Cánh Kép S-Foil',
    icon: '🚀',
    price: 0,
    badge: 'Star Wars X-Wing',
    aestheticStyle: 'Star Wars Incom T-65 (Cánh Kép S-Foil & 4 Động Cơ Tuabin)',
    description: 'Chiến hạm thám hiểm cánh kép hình chữ X huyền thoại với 4 cụm động cơ tuabin khổng lồ và 4 cột ăng-ten viễn thám.',
    scientificInstruments: [
      'Cơ cấu 4 cánh mở chéo chữ X (S-Foil Mechanism)',
      '4 Động cơ Tuabin nén khí phản lực ở 4 gốc cánh',
      '4 Cột ăng-ten cảm biến quang học quét tinh cầu ở đầu cánh',
      'Khoang chứa Robot trợ thủ thông minh phía sau buồng lái'
    ],
    speed: 92,
    shield: 80,
    power: 88,
    specialFeature: 'Mở rộng 4 cánh chữ X ổn định hướng bay siêu tốc'
  },
  {
    id: 'falcon_apex',
    name: 'Centurion Falcon',
    nameVi: 'Phi Thuyền Đĩa Khám Phá Falcon',
    classType: 'Tàu Viễn Chinh Thân Đĩa Elip',
    icon: '🚀',
    price: 300,
    badge: 'Millennium Falcon',
    aestheticStyle: 'Corellian YT-1300 (Thân Đĩa Elip, Móng Kẹp & Buồng Lái Lệch Tâm)',
    description: 'Phi thuyền thân đĩa elip trứ danh dải ngân hà với buồng lái lệch tâm, cặp móng kẹp hàng hóa và đĩa radar xoay 360°.',
    scientificInstruments: [
      'Buồng lái vòm hình trụ lệch tâm bên phải có ống thông nối',
      'Đĩa Radar Parabol siêu trường xoay 360° quét tín hiệu',
      'Cặp móng kẹp khoang hàng phía trước chứa thiết bị quét địa chấn',
      'Động cơ phản lực dải cong Sublight phát sáng xanh Cyan'
    ],
    speed: 98,
    shield: 85,
    power: 94,
    specialFeature: 'Động cơ siêu không gian Hyperdrive bứt tốc ngoạn mục'
  },
  {
    id: 'solar_phoenix',
    name: 'Pegasus Star-Carrier',
    nameVi: 'Siêu Chiến Hạm Mẹ Pegasus',
    classType: 'Chiến Hạm Mẹ Gundam',
    icon: '🚀',
    price: 450,
    badge: 'Gundam White Base',
    aestheticStyle: 'Pegasus-Class Mothership (Sàn Catapult, Tháp Chỉ Huy & V-Fin)',
    description: 'Siêu hạm mẹ vĩ đại với tháp chỉ huy cao tầng, 2 cánh vươn sàn phóng Catapult và 2 khối động cơ phản lực Mecha khổng lồ.',
    scientificInstruments: [
      'Tháp đài chỉ huy nhô cao có cửa kính toàn cảnh xanh ngọc',
      '2 Sàn phóng tàu con Catapult hai bên hông có đường ray',
      '2 Khối động cơ phản lực hộp Mecha khổng lồ phía sau',
      'Ăng-ten chữ V vàng kim (V-Fin) tiếp sóng viễn thông'
    ],
    speed: 80,
    shield: 99,
    power: 99,
    specialFeature: 'Sàn phóng Catapult triển khai thiết bị thăm dò siêu xa'
  },
  {
    id: 'starlight_runner',
    name: 'NASA Space Shuttle Orbiter',
    nameVi: 'Tàu Con Thoi Không Gian NASA',
    classType: 'Tàu Con Thoi Khí Động Học NASA',
    icon: '🚀',
    price: 600,
    badge: 'NASA Space Shuttle',
    aestheticStyle: 'NASA Orbiter (Bụng Gạch Đen, Cánh Double-Delta & 3 Động Cơ RS-25)',
    description: 'Tàu con thoi huyền thoại của NASA với lớp gạch đen chịu nhiệt dưới bụng, vây đuôi đứng lớn và cụm 3 động cơ tên lửa RS-25.',
    scientificInstruments: [
      'Bụng dưới bọc lớp gạch gốm đen chống nhiệt khí quyển',
      'Cánh Double-Delta khí động học lướt gió hạ cánh',
      'Cụm tam giác 3 động cơ tên lửa chính RS-25 SSME',
      'Khoang chứa hàng mở rộng mang kính viễn vọng không gian'
    ],
    speed: 94,
    shield: 90,
    power: 92,
    specialFeature: 'Hạ cánh lướt gió chính xác xuống đường băng mọi hành tinh'
  },
  {
    id: 'astral_shuttle',
    name: 'NASA Saturn V Apollo Rocket',
    nameVi: 'Siêu Tên Lửa Mặt Trăng Saturn V',
    classType: 'Tên Lửa Đẩy 3 Tầng Apollo',
    icon: '🚀',
    price: 750,
    badge: 'NASA Saturn V',
    aestheticStyle: 'Apollo Moon Rocket (3 Tầng Tên Lửa, 5 Động Cơ F-1 & Tháp Escape)',
    description: 'Siêu tên lửa mặt trăng vĩ đại nhất lịch sử nhân loại với 3 tầng tên lửa, 5 động cơ F-1 uy lực và tháp cứu hộ trên đỉnh.',
    scientificInstruments: [
      'Cụm 5 động cơ tên lửa khổng lồ Rocketdyne F-1 đốt cháy rực lửa',
      'Thân tên lửa 3 tầng với hoa văn kẻ sọc đen trắng Roll Pattern',
      'Khoang điều khiển phi hành gia Apollo Command Module',
      'Tháp giàn giáo cứu hộ khẩn cấp Launch Escape System (LES)'
    ],
    speed: 100,
    shield: 95,
    power: 100,
    specialFeature: 'Lực đẩy 5 động cơ F-1 phóng thẳng lên mặt trăng và quỹ đạo'
  }
];
