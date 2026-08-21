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
  competencyName: "Chào Hỏi Tự Tin",
  competencyGroup: "Giao Tiếp & Cảm Xúc (SEL)",
  estimatedTime: "10 phút",
  rewardsPreview: { xp: 100, stars: 3, badge: "Ngôi Sao Giao Tiếp" },

  stages: [
    /* Chặng 1: Thử tài */
    {
      id: "stage_1_pretest",
      type: "pretest",
      title: "Chặng 1: Thử tài",
      instruction: "Thử tài suy nghĩ nhanh của em nhé!",
      questions: [
        {
          id: "q1",
          question: "Gặp người lớn ở trường, em làm gì?",
          options: [
            "A. Quay đi chỗ khác",
            "B. Mỉm cười và chào lễ phép",
            "C. Hét thật to từ xa",
            "D. Chạy lại vỗ vai"
          ],
          answer: 1,
          explanation: "Mỉm cười và chào lễ phép giúp mọi người vui vẻ, yêu quý em!"
        }
      ]
    },

    /* Chặng 2: Câu chuyện */
    {
      id: "stage_2_story",
      type: "story",
      title: "Chặng 2: Câu chuyện",
      character: "Su",
      npc: "Sao Nova",
      dialogues: [
        {
          speaker: "Sao Nova",
          avatar: "🌟",
          text: "Chào Su! Bạn Kem mới chuyển đến xóm mình đấy, em qua chào bạn nhé!"
        },
        {
          speaker: "Su",
          avatar: "👧",
          text: "Em hơi ngại... Không biết nên nói gì với bạn Kem trước ạ!"
        },
        {
          speaker: "Sao Nova",
          avatar: "🌟",
          text: "Chỉ cần 3 bước 'Lời Chào Ngôi Sao' là em sẽ cực kỳ tự tin ngay!"
        }
      ],
      decision: {
        prompt: "Giúp Su chọn cách làm đúng nào:",
        choices: [
          { text: "Mỉm cười lại gần chào bạn Kem", correct: true, feedback: "Tuyệt vời! Nụ cười mở đầu tình bạn đẹp!" },
          { text: "Trốn sau cây nhìn từ xa", correct: false, feedback: "Trốn sau cây sẽ làm bạn bối rối đấy. Hãy tự tin lại gần nhé!" }
        ]
      }
    },

    /* Chặng 3: Chọn hành động đúng */
    {
      id: "stage_3_minigame1",
      type: "minigame_drag",
      title: "Chặng 3: Chọn hành động đúng",
      instruction: "Chạm chọn 2 hành động đúng để chào lịch sự:",
      draggables: [
        { id: "d1", label: "😊 Mỉm cười ấm áp", isCorrect: true },
        { id: "d2", label: "👀 Nhìn thẳng mắt bạn", isCorrect: true },
        { id: "d3", label: "😠 Nhăn mặt tức giận", isCorrect: false },
        { id: "d4", label: "🙈 Quay lưng bỏ đi", isCorrect: false }
      ],
      targetZoneLabel: "Bí Kíp Chào Lịch Sự"
    },

    /* Chặng 4: Nối cặp */
    {
      id: "stage_4_minigame2",
      type: "minigame_match",
      title: "Chặng 4: Nối cặp",
      instruction: "Nối tình huống với lời chào đúng:",
      pairs: [
        { id: 1, left: "Gặp thầy cô", right: "Em chào thầy/cô ạ!" },
        { id: 2, left: "Gặp bạn mới", right: "Chào bạn, tớ là Su!" },
        { id: 3, left: "Bác hàng xóm", right: "Cháu chào bác ạ!" }
      ]
    },

    /* Chặng 5: Xếp thứ tự */
    {
      id: "stage_5_minigame3",
      type: "minigame_sequence",
      title: "Chặng 5: Xếp thứ tự",
      instruction: "Sắp xếp 3 bước chào hỏi đúng thứ tự:",
      steps: [
        { id: "s1", text: "Bước 1: Mỉm cười và nhìn bạn", correctOrder: 1 },
        { id: "s2", text: "Bước 2: Cất lời chào lễ phép", correctOrder: 2 },
        { id: "s3", text: "Bước 3: Tự giới thiệu tên mình", correctOrder: 3 }
      ]
    },

    /* Chặng 6: Đấu Boss */
    {
      id: "stage_6_boss",
      type: "boss",
      title: "Chặng 6: Đấu Boss",
      bossName: "Rồng Kết Bạn Công Viên",
      instruction: "Giúp Su hòa nhập cùng nhóm bạn đang chơi nhảy dây:",
      scenarios: [
        {
          step: 1,
          question: "Các bạn đang chơi rất vui. Su nên làm gì?",
          options: [
            { text: "Chạy thẳng vào cắt ngang dây nhảy", correct: false, hpDamage: 20, feedback: "Như vậy sẽ làm ngắt quãng lượt chơi của các bạn!" },
            { text: "Mỉm cười chờ các bạn nhảy xong lượt rồi xin vào chơi", correct: true, hpDamage: 0, feedback: "Chính xác! Kiên nhẫn chờ đợi rất lịch sự." }
          ]
        }
      ]
    },

    /* Chặng 7: Bài học */
    {
      id: "stage_7_reflection",
      type: "reflection",
      title: "Chặng 7: Bài học",
      question: "Sau bài học này, em cảm thấy thế nào khi chào hỏi mọi người?",
      options: [
        "A. Tự tin và thấy rất vui vẻ!",
        "B. Sẵn sàng kết thêm nhiều bạn mới!",
        "C. Em sẽ thực hành ngay hôm nay!"
      ]
    },

    /* Chặng 8: Việc tốt hôm nay */
    {
      id: "stage_8_challenge",
      type: "challenge",
      title: "Chặng 8: Việc tốt hôm nay",
      missionText: "Hôm nay, em hãy mỉm cười và chào lễ phép 1 người lớn hoặc 1 người bạn!",
      guideText: "3 bước: 1. Mỉm cười -> 2. Nhìn mắt -> 3. Chào lễ phép"
    },

    /* Chặng 9: Bố mẹ duyệt */
    {
      id: "stage_9_parent",
      type: "parent_confirm",
      title: "Chặng 9: Bố mẹ duyệt",
      parentPrompt: "Bố/mẹ xác nhận bé đã mỉm cười chào hỏi lễ phép hôm nay:",
      confirmButtonText: "Bố/Mẹ Xác Nhận ✨"
    },

    /* Chặng 10: Nhận huy chương */
    {
      id: "stage_10_posttest",
      type: "posttest",
      title: "Chặng 10: Nhận huy chương",
      question: "Chiều nay gặp bạn mới ở sân chơi, em làm gì?",
      options: [
        "A. Mỉm cười và tự tin chào, giới thiệu tên",
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

