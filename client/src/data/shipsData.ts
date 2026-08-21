export interface SpaceshipModelData {
  id: string;
  name: string;
  nameVi: string;
  classType: string;
  icon: string;
  image: string;
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
  isPlaceholder?: boolean; // Tàu tương lai đang phát triển
}

export const SHIPS_DATA: SpaceshipModelData[] = [
  {
    id: 'explorer_v1',
    name: 'Bạch Đằng Pioneer',
    nameVi: 'Tàu Tiên Phong Bạch Đằng',
    classType: 'Tàu Tiên Phong Trinh Sát Siêu Thanh',
    icon: '🚀',
    image: '/assets/ships/explorer_v1.jpg',
    price: 0,
    badge: 'Bạch Đằng',
    aestheticStyle: 'Forward-Swept Aerodynamic Interceptor (Cánh Ngược & Tuabin Đôi Sáng)',
    description: 'Tàu tiên phong thám hiểm siêu thanh mang tên chiến thắng Bạch Đằng lừng lẫy. Đôi cánh xuôi ngược vuốt cong khí động học, bứt tốc né vật cản chớp nhoáng.',
    scientificInstruments: [
      'Cánh xuôi ngược khí động học (Forward-Swept Wings) linh hoạt',
      '2 Động cơ phản lực kép có tuabin 24 lá xoay sáng rõ',
      'Buồng lái vòm kính bo tròn trong suốt nhìn thấy bảng taplo HUD',
      'Que đo cảm biến siêu thanh Pitot Probe và 2 cánh tà canards'
    ],
    speed: 98,
    shield: 42,
    power: 65,
    specialFeature: 'Lượn cánh xuôi ngược bứt tốc né vật cản chớp nhoáng'
  },
  {
    id: 'falcon_apex',
    name: 'Chi Lăng Cruiser',
    nameVi: 'Tuần Dương Hạm Chi Lăng',
    classType: 'Tuần Dương Hạm Thân Đĩa Lượng Tử',
    icon: '🚀',
    image: '/assets/ships/falcon_apex.jpg',
    price: 300,
    badge: 'Chi Lăng',
    aestheticStyle: 'Hybrid Crescent-Saucer Cruiser (Thân Đĩa Lai Cánh Cung & Đĩa Radar Lượng Tử)',
    description: 'Tuần dương hạm viễn du dải ngân hà mang tên thung lũng Chi Lăng hiểm trở. Sở hữu đĩa radar lượng tử xoay 360° quét dữ liệu tinh cầu không gian sâu.',
    scientificInstruments: [
      'Thân đĩa elip kết hợp 2 cánh vòm hình cung ôm sát thân',
      'Đĩa Radar lượng tử đa trục xoay 360° quét tín hiệu tinh cầu',
      'Buồng lái bán cầu bo tròn phía trước mạ nano chống bức xạ',
      'Cụm 4 động cơ ion đa tầng có vòng tản nhiệt đồng và dải Cyan'
    ],
    speed: 78,
    shield: 60,
    power: 95,
    specialFeature: 'Đĩa radar lượng tử lập bản đồ toàn cảnh dải ngân hà'
  },
  {
    id: 'solar_phoenix',
    name: 'Điện Biên Phủ Carrier',
    nameVi: 'Chiến Hạm Điện Biên Phủ',
    classType: 'Siêu Mẫu Hạm Chỉ Huy Quỹ Đạo',
    icon: '🚀',
    image: '/assets/ships/solar_phoenix.jpg',
    price: 450,
    badge: 'Điện Biên Phủ',
    aestheticStyle: 'Heavy Orbital Sky-Carrier (Sàn Đáp Drone Mini & Đài Chỉ Huy Vòm Kính)',
    description: 'Siêu mẫu hạm không gian khổng lồ mang tên chiến thắng Điện Biên Phủ lừng lẫy. Sở hữu lớp giáp kiên cố bất khả xâm phạm và 2 sàn triển khai phi đội drone mini.',
    scientificInstruments: [
      'Đài chỉ huy vòm kính toàn cảnh bo tròn trên đỉnh có HUD xanh ngọc',
      '2 Sàn hạ cánh drone thám hiểm mini ở 2 mạn có đèn dẫn đường',
      '4 Khối động cơ phản lực hạt nhân nhiệt hạch siêu công suất',
      'Cột ăng-ten mạ vàng tiếp sóng viễn thám không gian sâu'
    ],
    speed: 40,
    shield: 99,
    power: 90,
    specialFeature: 'Sàn đáp triển khai mạng lưới drone thám hiểm không gian'
  },
  {
    id: 'starlight_runner',
    name: 'Ngọc Hồi Shuttle',
    nameVi: 'Tàu Con Thoi Ngọc Hồi',
    classType: 'Tàu Con Thoi Khí Động Học Thế Hệ Mới',
    icon: '🚀',
    image: '/assets/ships/starlight_runner.jpg',
    price: 600,
    badge: 'Ngọc Hồi',
    aestheticStyle: 'Lifting-Body Double-Delta (Bụng Gạch Đen, Vây Chữ V & 3 Động Cơ Tên Lửa)',
    description: 'Tàu con thoi không gian thế hệ mới mang tên chiến thắng thần tốc Ngọc Hồi - Đống Đa. Thân nâng Double-Delta liền cánh chống nhiệt khí quyển siêu ổn định.',
    scientificInstruments: [
      'Thân nâng Double-Delta liền cánh lướt gió khí quyển mượt mà',
      'Bụng dưới bọc lớp gạch composite đen chống nhiệt khí quyển',
      'Buồng lái vòm kính bo tròn trong suốt có màn hình HUD phi công',
      'Cụm 3 động cơ tên lửa De Laval mạ crom và 2 vây đuôi chữ V'
    ],
    speed: 85,
    shield: 75,
    power: 58,
    specialFeature: 'Thân nâng Double-Delta hạ cánh mượt mà xuống mọi hành tinh'
  },
  {
    id: 'astral_shuttle',
    name: 'Quảng Trị Destroyer',
    nameVi: 'Tàu Khu Trục Quảng Trị',
    classType: 'Tàu Khu Trục Tên Lửa Không Gian Sâu',
    icon: '🚀',
    image: '/assets/ships/astral_shuttle.jpg',
    price: 750,
    badge: 'Quảng Trị',
    aestheticStyle: 'Multi-Stage Planetary Star-Lifter (Vây Lưới Gập & 5 Động Cơ Aerospike)',
    description: 'Tàu khu trục không gian mang tinh thần kiên cường của Thành cổ Quảng Trị. 5 động cơ Aerospike cực đại sinh ra lực đẩy vô song thoát khỏi lực hút mọi hành tinh.',
    scientificInstruments: [
      'Cụm 5 động cơ tên lửa Aerospike / De Laval phun lửa plasma cam',
      '4 Vây lưới gập (Grid Fins) điều hướng luồng khí quyển hạ cánh',
      'Khoang lái phi hành gia bo tròn hình capsule trên tầng 3',
      'Tháp giàn giáo cảm biến viễn thám lượng tử trên đỉnh'
    ],
    speed: 92,
    shield: 88,
    power: 100,
    specialFeature: 'Lực đẩy 5 động cơ Aerospike vượt qua mọi lực hút tinh cầu'
  },
  // --- 3 Placeholder Ships (Chương Dương, Sơn Tinh, Thánh Gióng) ---
  {
    id: 'chuong_duong',
    name: 'Chương Dương Cruiser',
    nameVi: 'Tuần Dương Hạm Chương Dương',
    classType: 'Tuần Dương Hạm Hộ Vệ Quỹ Đạo',
    icon: '🛸',
    image: '/assets/ships/explorer_v1.jpg',
    price: 900,
    badge: 'Chương Dương',
    aestheticStyle: 'Orbital Guardian Cruiser (Lá Chắn Đa Tần & Pháo Phòng Không Không Gian)',
    description: 'Tuần dương hạm hộ vệ quỹ đạo mang tên bến Chương Dương lịch sử. Được trang bị lá chắn năng lượng đa tần bảo vệ biên đội viễn chinh.',
    scientificInstruments: [
      'Máy phát trường lực bảo vệ năng lượng đa tần',
      'Tháp pháo phòng không phản ứng nhanh tầm nhiệt',
      'Radar dẫn bắn hạm đội tầm xa',
      'Động cơ phản lực ion công nghệ tương lai'
    ],
    speed: 75,
    shield: 90,
    power: 85,
    specialFeature: 'Lá chắn năng lượng đa tần bảo vệ toàn biên đội',
    isPlaceholder: true
  },
  {
    id: 'son_tinh',
    name: 'Sơn Tinh Titan',
    nameVi: 'Tàu Khảo Sát Sơn Tinh',
    classType: 'Tàu Khảo Sát Địa Hình & Vực Thẳm',
    icon: '🏔️',
    image: '/assets/ships/falcon_apex.jpg',
    price: 1200,
    badge: 'Sơn Tinh',
    aestheticStyle: 'Heavy Terrestrial Crawler-Ship (Càng Hạ Cánh Thủy Lực & Lưỡi Khoan Titan)',
    description: 'Tàu khảo sát địa hình mang sức mạnh thần thoại Sơn Tinh dời non lấp biển. Chuyên vượt qua các rặng núi dung nham và vực sâu tinh cầu.',
    scientificInstruments: [
      'Chân đế thủy lực neo giữ bề mặt đá núi nghiêng dốc',
      'Mũi khoan kim cương thăm dò địa chất khoáng sản quý',
      'Hệ thống giảm xóc từ trường triệt tiêu rung chấn động đất',
      'Cảm biến quang phổ phát hiện lõi khoáng vật'
    ],
    speed: 60,
    shield: 95,
    power: 92,
    specialFeature: 'Định hình địa hình hạ cánh vững chắc trên mọi bề mặt',
    isPlaceholder: true
  },
  {
    id: 'thanh_giong',
    name: 'Thánh Gióng Colossus',
    nameVi: 'Thiết Giáp Hạm Thánh Gióng',
    classType: 'Siêu Thiết Giáp Hạm Thiết Mã Không Gian',
    icon: '⚡',
    image: '/assets/ships/solar_phoenix.jpg',
    price: 1500,
    badge: 'Thánh Gióng',
    aestheticStyle: 'Legendary Iron-Horse Dreadnought (Giáp Sắt Bất Tử & Động Cơ Lôi Đình)',
    description: 'Siêu thiết giáp hạm mang khí phách Phù Đổng Thiên Vương. Sở hữu động cơ Lôi Đình sấm sét và giáp sắt phi thường, vượt qua mọi giới hạn vũ trụ.',
    scientificInstruments: [
      'Lõi năng lượng nhiệt hạch Lôi Đình sấm sét bất diệt',
      'Lớp giáp hợp kim Thiết Mã dát nano phản xạ bức xạ vũ trụ',
      'Hệ thống đẩy siêu không gian bẻ cong trường hấp dẫn',
      'Đài quan sát thiên hà siêu viễn vọng 360 độ'
    ],
    speed: 99,
    shield: 100,
    power: 100,
    specialFeature: 'Lực đẩy Thiết Mã phi thiên vượt mọi ranh giới vũ trụ',
    isPlaceholder: true
  }
];
