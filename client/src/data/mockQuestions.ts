import { DomainInfo, QuestionItem } from '../types';

export const DOMAINS_DATA: DomainInfo[] = [
  {
    id: 'DOM-FIN',
    name: 'Financial & Resource Literacy',
    nameVi: 'Tài chính & Quản lý Tài nguyên',
    icon: '💰',
    color: '#fbbf24',
    accentBg: 'from-amber-500/20 to-yellow-500/10',
    description: 'Học cách tiết kiệm, chi tiêu thông minh và trân trọng giá trị lao động.',
    subdomainCount: 5,
  },
  {
    id: 'DOM-SEL',
    name: 'Emotional & Social Intelligence',
    nameVi: 'Trí tuệ Cảm xúc & Xã hội',
    icon: '❤️',
    color: '#f43f5e',
    accentBg: 'from-rose-500/20 to-pink-500/10',
    description: 'Nhận diện cảm xúc, thực hành thấu cảm và giao tiếp hòa nhã.',
    subdomainCount: 5,
  },
  {
    id: 'DOM-CRT',
    name: 'Critical Thinking & Problem Solving',
    nameVi: 'Tư duy Phản biện & Sáng tạo',
    icon: '🧠',
    color: '#8b5cf6',
    accentBg: 'from-purple-500/20 to-indigo-500/10',
    description: 'Rèn luyện suy luận logic, giải quyết thử thách và tư duy khoa học.',
    subdomainCount: 5,
  },
  {
    id: 'DOM-DIG',
    name: 'Digital Citizenship & Safety',
    nameVi: 'Công dân Số & An toàn Mạng',
    icon: '🛡️',
    color: '#06b6d4',
    accentBg: 'from-cyan-500/20 to-blue-500/10',
    description: 'Bảo vệ quyền riêng tư, an toàn khi online và sử dụng thiết bị lành mạnh.',
    subdomainCount: 5,
  },
  {
    id: 'DOM-HAB',
    name: 'Self-Management & Daily Habits',
    nameVi: 'Tự quản lý & Thói quen Tốt',
    icon: '🌱',
    color: '#10b981',
    accentBg: 'from-emerald-500/20 to-teal-500/10',
    description: 'Xây dựng thói quen tự lập, quản lý thời gian và giữ gìn sức khỏe.',
    subdomainCount: 5,
  },
];

export const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: 'Q-FIN-001',
    domainId: 'DOM-FIN',
    subdomainId: 'SUB-FIN-SAVE',
    domainNameVi: 'Tài chính & Quản lý Tài nguyên',
    subdomainNameVi: 'Tiết kiệm & Mục tiêu',
    gradeLevel: 2,
    difficulty: 'easy',
    title: 'Heo Đất Thông Thái',
    situation: 'Bé nhận được 20.000đ tiền lì xì từ ông bà. Bé đang rất thích một cuốn truyện tranh giá 50.000đ.',
    characterDialogue: 'Bé ơi, mình nên làm gì với số tiền này để sớm mua được cuốn truyện tranh yêu thích nhỉ?',
    questionType: 'single_choice',
    options: [
      { id: 'opt1', text: 'Bỏ ngay 20.000đ vào heo đất và tích lũy thêm cho đủ 50.000đ', isCorrect: true, explanation: 'Chính xác! Tiết kiệm kiên trì giúp bé đạt được món đồ mơ ước.' },
      { id: 'opt2', text: 'Đi mua ngay kẹo mút ăn hết 20.000đ', isCorrect: false, explanation: 'Nếu ăn kẹo ngay, bé sẽ không còn tiền để mua cuốn truyện tranh nữa.' },
      { id: 'opt3', text: 'Đưa cho bạn mượn mà không hỏi bố mẹ', isCorrect: false, explanation: 'Bé nên trao đổi với bố mẹ trước khi cho ai mượn tiền nhé.' }
    ],
    advice: 'Muốn mua đồ giá trị lớn, bé hãy chia tiền vào heo đất và kiên nhẫn tích lũy từng ngày.',
    realLifeTask: 'Hôm nay bé hãy cùng bố mẹ ghi lại một món đồ bé mong muốn và lên kế hoạch nuôi heo đất nhé!'
  },
  {
    id: 'Q-SEL-001',
    domainId: 'DOM-SEL',
    subdomainId: 'SUB-SEL-RECG',
    domainNameVi: 'Trí tuệ Cảm xúc & Xã hội',
    subdomainNameVi: 'Quản lý Cơn giận',
    gradeLevel: 3,
    difficulty: 'easy',
    title: 'Hít Thở Bình Tĩnh',
    situation: 'Khi đang vẽ tranh, bạn lỡ tay làm đổ nước làm ướt bức tranh của em. Em cảm thấy mặt nóng bừng và rất tức giận.',
    characterDialogue: 'Mình đang rất bực mình! Hành động nào dưới đây là thông minh nhất?',
    questionType: 'single_choice',
    options: [
      { id: 'opt1', text: 'Hít sâu 3 nhịp, đếm từ 1 đến 5 và nói với bạn: "Mình buồn vì tranh bị ướt, lần sau bạn cẩn thận hơn nhé"', isCorrect: true, explanation: 'Tuyệt vời! Bình tĩnh giúp giải quyết vấn đề mà không làm rạn nứt tình bạn.' },
      { id: 'opt2', text: 'Lập tức giật lấy tranh của bạn xé nát để trả đũa', isCorrect: false, explanation: 'Làm vậy sẽ gây ra xung đột và làm tổn thương bạn bè.' },
      { id: 'opt3', text: 'Hét thật to và ném bút màu xuống sàn', isCorrect: false, explanation: 'Ném đồ chơi có thể làm hỏng đồ và không sửa được bức tranh.' }
    ],
    advice: 'Khi giận dữ, bí quyết là "Dừng lại 5 giây - Hít thở sâu - Nói ra cảm xúc bằng lời lịch sự".',
    realLifeTask: 'Thực hành bài tập thở 4 nhịp (hít vào 4 giây, giữ 4 giây, thở ra 4 giây) trước khi đi ngủ.'
  },
  {
    id: 'Q-CRT-001',
    domainId: 'DOM-CRT',
    subdomainId: 'SUB-CRT-LOGIC',
    domainNameVi: 'Tư duy Phản biện & Sáng tạo',
    subdomainNameVi: 'Phân biệt Sự thật và Ý kiến',
    gradeLevel: 3,
    difficulty: 'medium',
    title: 'Thám Tử Nhí Tìm Sự Thật',
    situation: 'Nam nói: "Trái Đất quay quanh Mặt Trời". Hoàng nói: "Môn Toán là môn học vui nhất thế giới".',
    characterDialogue: 'Theo em, câu nói nào là SỰ THẬT (Fact) và câu nào là Ý KIẾN RIÊNG (Opinion)?',
    questionType: 'single_choice',
    options: [
      { id: 'opt1', text: 'Câu của Nam là Sự thật (khoa học chứng minh), câu của Hoàng là Ý kiến cá nhân', isCorrect: true, explanation: 'Rất chính xác! Sự thật có thể kiểm chứng bằng khoa học, còn ý kiến tùy thuộc sở thích mỗi người.' },
      { id: 'opt2', text: 'Cả hai câu đều là Sự thật', isCorrect: false, explanation: 'Không phải ai cũng thấy môn Toán là vui nhất, đó chỉ là cảm nhận của Hoàng.' },
      { id: 'opt3', text: 'Cả hai câu đều là Ý kiến', isCorrect: false, explanation: 'Việc Trái Đất quay quanh Mặt Trời là quy luật khoa học chính xác.' }
    ],
    advice: 'Luôn kiểm tra bằng chứng trước khi tin vào một thông tin nào đó.',
    realLifeTask: 'Tìm 1 sự thật khoa học trong sách Tự nhiên xã hội và kể lại cho người thân.'
  },
  {
    id: 'Q-DIG-001',
    domainId: 'DOM-DIG',
    subdomainId: 'SUB-DIG-PRIV',
    domainNameVi: 'Công dân Số & An toàn Mạng',
    subdomainNameVi: 'Bảo vệ Mật khẩu & Thông tin',
    gradeLevel: 4,
    difficulty: 'medium',
    title: 'Lá Chắn Mật Khẩu',
    situation: 'Khi chơi game online, một tài khoản lạ nhắn tin: "Cho mình xin mật khẩu để mình nạp kim cương miễn phí giúp bạn nhé!"',
    characterDialogue: 'Bé ơi, có nên gửi mật khẩu tài khoản cho người lạ trên mạng không?',
    questionType: 'single_choice',
    options: [
      { id: 'opt1', text: 'Tuyệt đối KHÔNG chia sẻ mật khẩu và báo ngay cho bố mẹ biết', isCorrect: true, explanation: 'Đúng chuẩn! Mật khẩu là chìa khóa bí mật, chỉ có bố mẹ và bé được biết.' },
      { id: 'opt2', text: 'Gửi ngay vì muốn có thật nhiều kim cương miễn phí', isCorrect: false, explanation: 'Rất nguy hiểm! Kẻ xấu có thể chiếm đoạt tài khoản của bé.' },
      { id: 'opt3', text: 'Đổi mật khẩu thành "123456" rồi gửi cho họ', isCorrect: false, explanation: 'Kẻ xấu vẫn sẽ đăng nhập được và lấy mất tài khoản.' }
    ],
    advice: 'Không có quà tặng miễn phí từ người lạ trên mạng. Mật khẩu phải giữ kín như bàn chải đánh răng của bạn!',
    realLifeTask: 'Kiểm tra mật khẩu cùng bố mẹ xem đã đủ mạnh (có chữ, số, ký tự đặc biệt) chưa.'
  },
  {
    id: 'Q-HAB-001',
    domainId: 'DOM-HAB',
    subdomainId: 'SUB-HAB-TIME',
    domainNameVi: 'Tự quản lý & Thói quen Tốt',
    subdomainNameVi: 'Quản lý Thời gian',
    gradeLevel: 2,
    difficulty: 'easy',
    title: 'Bàn Học Ngăn Nắp',
    situation: 'Tối nay bé có bài tập về nhà môn Tiếng Việt và chương trình hoạt hình yêu thích bắt đầu chiếu lúc 8h tối.',
    characterDialogue: 'Làm thế nào để vừa xem được phim vừa hoàn thành bài tập đầy đủ nhỉ?',
    questionType: 'single_choice',
    options: [
      { id: 'opt1', text: 'Tập trung làm bài tập lúc 7h đến 7h45, xong sớm rồi thảnh thơi xem hoạt hình lúc 8h', isCorrect: true, explanation: 'Xuất sắc! Làm xong việc quan trọng trước giúp tinh thần thoải mái khi giải trí.' },
      { id: 'opt2', text: 'Vừa xem hoạt hình vừa mở vở ra làm bài tập', isCorrect: false, explanation: 'Vừa xem vừa học sẽ mất tập trung, dễ làm sai và xem cũng không vui.' },
      { id: 'opt3', text: 'Xem hoạt hình xong rồi đi ngủ luôn, mai lên lớp mượn bài bạn chép', isCorrect: false, explanation: 'Như vậy là thiếu trung thực và không tự giác làm bài tập.' }
    ],
    advice: 'Quy tắc vàng: "Việc hôm nay chớ để ngày mai - Xong việc trước, giải trí sau".',
    realLifeTask: 'Lập thời gian biểu buổi tối gồm 3 khung giờ: Học bài - Giải trí - Chuẩn bị đồ dùng cho ngày mai.'
  }
];
