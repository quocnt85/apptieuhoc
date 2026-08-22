export type ParentGuideReviewStatus = 'APPROVED' | 'PENDING_HEALTH_REVIEW';
export type ParentGuideAccess = 'free' | 'vip';

export type ParentConversationTemplate = {
  contentIds: string[];
  prompts: string[];
};

export type ParentGuideExternalSource = {
  label: string;
  publisher: string;
  url: string;
};

export type ParentGuide = {
  id: string;
  title: string;
  category: string;
  access: ParentGuideAccess;
  checklist: string[];
  podcastTranscript: string;
  conversation: ParentConversationTemplate;
  externalSources?: ParentGuideExternalSource[];
  review: {
    status: ParentGuideReviewStatus;
    author: string;
    reviewer: string;
    version: string;
    reviewedAt: string;
  };
};

export const PARENT_GUIDES: readonly ParentGuide[] = [
  {
    id: 'body-safety-basics', title: 'Bảo vệ cơ thể và vùng riêng tư', category: 'Bảo vệ bản thân', access: 'free',
    checklist: ['Dùng tên gọi rõ ràng, phù hợp lứa tuổi.', 'Dạy con nói “không” và rời khỏi tình huống khó chịu.', 'Thống nhất 3 người lớn an toàn con có thể tìm đến.'],
    podcastTranscript: 'Cơ thể của con thuộc về con. Khi một hành động làm con khó chịu, con có thể nói không, rời đi và kể ngay với người lớn an toàn. Phụ huynh hãy lắng nghe bình tĩnh, tin lời con và tránh trách con.',
    conversation: { contentIds: ['eq_safety_001', 'lesson-body-safety'], prompts: ['Điều gì làm con cảm thấy an toàn?', 'Nếu thấy khó chịu, con sẽ tìm người lớn nào?', 'Bố mẹ có thể làm gì để con dễ kể chuyện hơn?'] },
    review: { status: 'APPROVED', author: 'NovaStars Editorial', reviewer: 'Safety Review', version: '1.0.0', reviewedAt: '2026-08-22' },
  },
  {
    id: 'allowance-choices', title: 'Tiền tiêu vặt và lựa chọn', category: 'Tài chính gia đình', access: 'vip',
    checklist: ['Chia tiền thành chi tiêu, tiết kiệm và sẻ chia.', 'Cho con chọn trong một ngân sách nhỏ.', 'Không gắn tiền với tình yêu hoặc sự vâng lời.'],
    podcastTranscript: 'Một ngân sách nhỏ giúp trẻ tập lựa chọn. Hãy cho con so sánh hai món, nói lý do và chấp nhận hệ quả an toàn của quyết định. Khen cách suy nghĩ thay vì chỉ khen tiết kiệm.',
    conversation: { contentIds: ['Q-FIN-001', 'lesson-saving-plan'], prompts: ['Con muốn dùng tiền cho điều gì?', 'Nếu chưa đủ tiền, con có những lựa chọn nào?', 'Con muốn dành một phần để sẻ chia không?'] },
    review: { status: 'APPROVED', author: 'NovaStars Editorial', reviewer: 'Editorial Review', version: '1.0.0', reviewedAt: '2026-08-22' },
  },
  {
    id: 'family-digital-safety', title: 'An toàn số trong gia đình', category: 'An toàn số', access: 'vip',
    checklist: ['Không chia sẻ địa chỉ, trường học hoặc mật khẩu.', 'Hỏi người lớn trước khi nhấn liên kết lạ.', 'Báo ngay khi nội dung làm con sợ hoặc xấu hổ.'],
    podcastTranscript: 'An toàn số bắt đầu từ một thỏa thuận không phán xét. Nếu con gặp điều đáng sợ trên mạng, con sẽ không bị phạt vì đã kể. Cả nhà cùng chặn, báo cáo và đổi mật khẩu khi cần.',
    conversation: { contentIds: ['Q-DIG-001', 'lesson-strong-password'], prompts: ['Thông tin nào mình không đăng lên mạng?', 'Con sẽ làm gì khi nhận liên kết lạ?', 'Làm sao để con kể mà không sợ bị phạt?'] },
    externalSources: [{ label: 'Cách giúp trẻ an toàn trên mạng', publisher: 'UNICEF', url: 'https://www.unicef.org/parenting/child-care/keep-your-child-safe-online' }],
    review: { status: 'APPROVED', author: 'NovaStars Editorial', reviewer: 'Digital Safety Review', version: '1.0.0', reviewedAt: '2026-08-22' },
  },
  {
    id: 'emotion-listening', title: 'Lắng nghe cảm xúc', category: 'Đồng hành cảm xúc', access: 'vip',
    checklist: ['Gọi tên cảm xúc trước khi giải quyết vấn đề.', 'Hỏi con muốn được nghe hay muốn gợi ý.', 'Tránh dùng chẩn đoán tâm lý từ điểm trong app.'],
    podcastTranscript: 'Khi trẻ buồn, hãy bắt đầu bằng việc mô tả điều bạn quan sát và hỏi con có muốn chia sẻ không. Một khoảng im lặng an toàn thường hữu ích hơn lời khuyên quá sớm.',
    conversation: { contentIds: ['Q-SEL-001', 'lesson-emotion-listening'], prompts: ['Hôm nay điều gì làm con vui hoặc buồn?', 'Con muốn bố mẹ lắng nghe hay cùng tìm cách?', 'Lúc này cơ thể con đang cảm thấy thế nào?'] },
    review: { status: 'APPROVED', author: 'NovaStars Editorial', reviewer: 'Wellbeing Review', version: '1.0.0', reviewedAt: '2026-08-22' },
  },
  {
    id: 'gentle-eye-massage-draft', title: 'Thả lỏng vùng quanh mắt', category: 'Sức khỏe mắt', access: 'free',
    checklist: ['Rửa sạch tay và nhắm mắt.', 'Xoa rất nhẹ vùng xương quanh hốc mắt; không ấn vào nhãn cầu.', 'Dừng ngay nếu đau, chóng mặt hoặc khó chịu.'],
    podcastTranscript: 'Đây là nội dung bản nháp chờ hậu kiểm. Phụ huynh hướng dẫn trẻ rửa tay, nhắm mắt và chỉ chạm rất nhẹ vùng xương quanh mắt. Không ấn vào nhãn cầu và dừng ngay nếu trẻ khó chịu.',
    conversation: { contentIds: ['eye-break-draft'], prompts: ['Mắt con có đang khó chịu không?', 'Con muốn nghỉ nhìn màn hình và nhìn ra xa không?', 'Nếu đau hoặc chóng mặt, mình sẽ dừng và báo người lớn nhé?'] },
    review: { status: 'PENDING_HEALTH_REVIEW', author: 'NovaStars Draft', reviewer: 'Chưa hậu kiểm', version: '0.1.0-draft', reviewedAt: '2026-08-22' },
  },
] as const;

export const validateParentGuideCatalog = (guides: readonly ParentGuide[] = PARENT_GUIDES): string[] => {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const guide of guides) {
    if (!/^[a-z0-9-]{3,80}$/.test(guide.id)) errors.push(`invalid id: ${guide.id}`);
    if (ids.has(guide.id)) errors.push(`duplicate id: ${guide.id}`); else ids.add(guide.id);
    if (!guide.title || !guide.category || guide.checklist.length === 0 || !guide.podcastTranscript) errors.push(`incomplete content: ${guide.id}`);
    if (!guide.review.author || !guide.review.reviewer || !/^\d+\.\d+\.\d+(?:-[a-z]+)?$/.test(guide.review.version) || !/^\d{4}-\d{2}-\d{2}$/.test(guide.review.reviewedAt)) errors.push(`invalid review metadata: ${guide.id}`);
    if (guide.conversation.contentIds.length === 0 || guide.conversation.prompts.length < 2) errors.push(`incomplete conversation template: ${guide.id}`);
    for (const source of guide.externalSources ?? []) {
      if (!source.label || !source.publisher || !source.url) errors.push(`incomplete external source: ${guide.id}`);
    }
  }
  return errors;
};

export const visibleParentGuides = (includePendingHealth: boolean): readonly ParentGuide[] =>
  PARENT_GUIDES.filter((guide) => includePendingHealth || guide.review.status === 'APPROVED');

export const conversationTemplatesForContent = (contentId: string): ParentConversationTemplate[] =>
  PARENT_GUIDES.filter((guide) => guide.review.status === 'APPROVED' && guide.conversation.contentIds.includes(contentId))
    .map((guide) => guide.conversation);
