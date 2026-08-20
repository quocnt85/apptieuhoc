export interface LessonZeroStage {
  id: string;
  type: 
    | 'pretest' 
    | 'story' 
    | 'minigame_drag' 
    | 'minigame_match' 
    | 'minigame_sequence' 
    | 'boss' 
    | 'reflection' 
    | 'challenge' 
    | 'parent_confirm' 
    | 'posttest';
  title: string;
  instruction?: string;
  // Dành cho pretest & posttest
  questions?: Array<{
    id: string;
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }>;
  // Dành cho Story
  character?: string;
  npc?: string;
  dialogues?: Array<{
    speaker: string;
    avatar: string;
    text: string;
  }>;
  decision?: {
    prompt: string;
    choices: Array<{
      text: string;
      correct: boolean;
      feedback: string;
    }>;
  };
  // Dành cho Minigame Drag
  draggables?: Array<{
    id: string;
    label: string;
    isCorrect: boolean;
  }>;
  targetZoneLabel?: string;
  // Dành cho Minigame Match
  pairs?: Array<{
    id: number;
    left: string;
    right: string;
  }>;
  // Dành cho Minigame Sequence
  steps?: Array<{
    id: string;
    text: string;
    correctOrder: number;
  }>;
  // Dành cho Boss Battle
  bossName?: string;
  scenarios?: Array<{
    step: number;
    question: string;
    options: Array<{
      text: string;
      correct: boolean;
      hpDamage: number;
      feedback: string;
    }>;
  }>;
  // Dành cho Reflection
  question?: string;
  options?: string[];
  // Dành cho Challenge
  missionText?: string;
  guideText?: string;
  // Dành cho Parent Confirm
  parentPrompt?: string;
  confirmButtonText?: string;
  // Dành cho Posttest & Reward
  correctAnswer?: number;
  rewardData?: {
    xp: number;
    stars: number;
    badgeName: string;
    badgeIcon: string;
  };
}

export interface LessonZeroPackage {
  id: string;
  competencyName: string;
  competencyGroup: string;
  estimatedTime: string;
  rewardsPreview: { xp: number; stars: number; badge: string };
  stages: LessonZeroStage[];
}

export const LESSON_ZERO_DATA: LessonZeroPackage = {
  id: "lesson_0_polite_greetings",
  competencyName: "Chào Hỏi Lịch Sự & Tự Tin",
  competencyGroup: "Trí Tuệ Cảm Xúc & Xã Hội (SEL)",
  estimatedTime: "15 phút",
  rewardsPreview: { xp: 100, stars: 3, badge: "Ngôi Sao Giao Tiếp" },

  stages: [
    /* Stage 1: Pre-test */
    {
      id: "stage_1_pretest",
      type: "pretest",
      title: "Đánh Giá Ban Đầu",
      instruction: "Thử tài suy nghĩ của em trước khi bắt đầu sứ mệnh nhé!",
      questions: [
        {
          id: "q1",
          question: "Khi gặp người lớn tuổi (ông bà, thầy cô) ở hành lang, em nên làm gì?",
          options: [
            "A. Quay đi chỗ khác coi như không thấy",
            "B. Dừng lại, khoanh tay mỉm cười và chào lễ phép",
            "C. Hét thật to từ đằng xa",
            "D. Chạy lại vỗ vai"
          ],
          answer: 1,
          explanation: "Chào mỉm cười và khoanh tay lịch sự thể hiện sự tôn trọng và tình cảm ấm áp!"
        }
      ]
    },

    /* Stage 2: Story */
    {
      id: "stage_2_story",
      type: "story",
      title: "Câu Chuyện: Chuyến Phiêu Lưu Của Su",
      character: "Su",
      npc: "Sao Nova",
      dialogues: [
        {
          speaker: "Sao Nova",
          avatar: "🌟",
          text: "Chào Su! Hôm nay xóm nhỏ có gia đình bạn Kem mới chuyển đến đấy. Em đã sẵn sàng sang chào hỏi chưa?"
        },
        {
          speaker: "Su",
          avatar: "👧",
          text: "Ôi Sao Nova ơi... Em thấy rụt rè quá. Em không biết nên bắt đầu nói gì với bạn Kem..."
        },
        {
          speaker: "Sao Nova",
          avatar: "🌟",
          text: "Đừng lo Su nhé! Bí kíp 'Lời Chào Ngôi Sao' gồm 3 bước kỳ diệu sẽ giúp em cực kỳ tự tin!"
        }
      ],
      decision: {
        prompt: "Em hãy giúp Su chọn quyết định đúng đắn nhất:",
        choices: [
          { text: "Dũng cảm mỉm cười và tiến lại gần chào bạn Kem", correct: true, feedback: "Tuyệt vời! Nụ cười chính là chìa khóa mở rộng trái tim bạn bè!" },
          { text: "Trốn sau cái cây ngắm bạn Kem từ xa", correct: false, feedback: "Núp sau cây sẽ làm bạn Kem thấy bối rối đấy. Hãy thử lại mỉm cười nhé!" }
        ]
      }
    },

    /* Stage 3: Mini Game 1 (Drag & Drop Expressions) */
    {
      id: "stage_3_minigame1",
      type: "minigame_drag",
      title: "Trò Chơi 1: Nụ Cười Thân Thiện",
      instruction: "Chọn những cử chỉ thích hợp vào ô 'Bí Kíp Chào Lịch Sự'!",
      draggables: [
        { id: "d1", label: "😊 Mỉm cười ấm áp", isCorrect: true },
        { id: "d2", label: "👀 Nhìn thẳng mắt bạn", isCorrect: true },
        { id: "d3", label: "😠 Nhăn mặt tức giận", isCorrect: false },
        { id: "d4", label: "🙈 Quay lưng bỏ đi", isCorrect: false }
      ],
      targetZoneLabel: "Bí Kíp Chào Lịch Sự"
    },

    /* Stage 4: Mini Game 2 (Matching Grid) */
    {
      id: "stage_4_minigame2",
      type: "minigame_match",
      title: "Trò Chơi 2: Ghép Đôi Lời Chào",
      instruction: "Hãy ghép lời chào phù hợp với từng hoàn cảnh nhé!",
      pairs: [
        { id: 1, left: "Gặp thầy cô buổi sáng", right: "Em chào thầy/cô ạ!" },
        { id: 2, left: "Lần đầu gặp bạn mới", right: "Chào bạn, tớ là Su!" },
        { id: 3, left: "Bác hàng xóm vẫy tay", right: "Cháu chào bác ạ!" }
      ]
    },

    /* Stage 5: Mini Game 3 (Sequence Builder) */
    {
      id: "stage_5_minigame3",
      type: "minigame_sequence",
      title: "Trò Chơi 3: 3 Bước Chào Ngôi Sao",
      instruction: "Sắp xếp 3 bước chào hỏi theo đúng thứ tự chuẩn nhé!",
      steps: [
        { id: "s1", text: "Bước 1: Dừng lại, nhìn bạn và Mỉm Cười", correctOrder: 1 },
        { id: "s2", text: "Bước 2: Cất lời chào lịch sự (Chào bạn/Thầy cô)", correctOrder: 2 },
        { id: "s3", text: "Bước 3: Tự giới thiệu tên hoặc hỏi thăm ngắn", correctOrder: 3 }
      ]
    },

    /* Stage 6: Boss Battle */
    {
      id: "stage_6_boss",
      type: "boss",
      title: "Thử Thách Boss: Công Viên Ngôi Sao",
      bossName: "Thử Thách Kết Bạn Công Viên",
      instruction: "Su đang đứng ở công viên và có nhóm bạn đang chơi nhảy dây. Hãy giúp Su xử lý tình huống!",
      scenarios: [
        {
          step: 1,
          question: "Các bạn đang chơi rất vui. Su nên tiếp cận nhóm bạn thế nào?",
          options: [
            { text: "Chạy thẳng vào giữa dây nhảy", correct: false, hpDamage: 20, feedback: "Như vậy sẽ làm đứt nhịp chơi của các bạn!" },
            { text: "Đứng bên cạnh, mỉm cười và đợi các bạn nhảy xong lượt", correct: true, hpDamage: 0, feedback: "Chính xác! Kiên nhẫn chờ lượt là biểu hiện rất lịch sự." }
          ]
        }
      ]
    },

    /* Stage 7: Reflection */
    {
      id: "stage_7_reflection",
      type: "reflection",
      title: "Phản Tư & Bài Học",
      question: "Sau bài học này, em cảm thấy thế nào khi chào hỏi ai đó bằng một nụ cười?",
      options: [
        "A. Tự tin và cảm thấy ấm áp, vui vẻ!",
        "B. Thấy mình giống như một người anh hùng giao tiếp!",
        "C. Sẵn sàng thực hành ngay hôm nay!"
      ]
    },

    /* Stage 8: Real-life Challenge */
    {
      id: "stage_8_challenge",
      type: "challenge",
      title: "Thử Thách Thực Tế",
      missionText: "Hôm nay, em hãy mỉm cười và khoanh tay chào lịch sự 1 người lớn (ông bà, bố mẹ, thầy cô) hoặc 1 bạn mới!",
      guideText: "Nhớ thực hiện 3 bước: 1. Mỉm cười -> 2. Nhìn mắt -> 3. Chào lễ phép!"
    },

    /* Stage 9: Parent Confirmation */
    {
      id: "stage_9_parent",
      type: "parent_confirm",
      title: "Xác Nhận Từ Phụ Huynh",
      parentPrompt: "Ba/mẹ đã quan sát bé thực hiện nụ cười và lời chào lịch sự ngoài đời thực chưa?",
      confirmButtonText: "Bố/Mẹ Xác Nhận Bé Đã Làm Tốt!"
    },

    /* Stage 10: Post-test & Reward */
    {
      id: "stage_10_posttest",
      type: "posttest",
      title: "Kiểm Tra & Nhận Phụ Kiện Ngôi Sao",
      question: "Nếu gặp bạn mới ở sân chơi chiều nay, em sẽ dùng Bí Kíp gì?",
      options: [
        "A. Mỉm cười, nhìn thẳng mắt và tự tin chào tự giới thiệu tên",
        "B. Đi chỗ khác chơi một mình"
      ],
      correctAnswer: 0,
      rewardData: {
        xp: 100,
        stars: 3,
        badgeName: "Huy Chương Ngôi Sao Giao Tiếp",
        badgeIcon: "🏅"
      }
    }
  ]
};
