# Master Content Schema & TypeScript Contracts

> **Mục tiêu**: Định nghĩa kiểu dữ liệu TypeScript và Schema JSON bắt buộc cho gói dữ liệu bài học NovaStars (`LessonZeroPackage`). Tất cả các bài học được tạo ra bắt buộc phải khớp 100% với schema này.

---

## 1. Khai Báo TypeScript Interfaces

```typescript
export interface LessonZeroPackage {
  id: string; // Định dạng: "lesson_<number>_<slug>", ví dụ: "lesson_1_polite_greetings"
  competencyName: string; // Tên bài học, ví dụ: "Chào Hỏi Lịch Sự & Tự Tin"
  competencyGroup: string; // Tên nhóm, ví dụ: "Trí Tuệ Cảm Xúc & Xã Hội (SEL)"
  estimatedTime: string; // "15 phút"
  rewardsPreview: { 
    xp: number; // e.g. 100
    stars: number; // e.g. 3
    badge: string; // e.g. "Ngôi Sao Giao Tiếp"
  };
  stages: LessonZeroStage[]; // Bắt buộc đúng 10 stages theo thứ tự
}

export type StageType = 
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

export interface LessonZeroStage {
  id: string; // "stage_1_pretest", "stage_2_story", ..., "stage_10_posttest"
  type: StageType;
  title: string;
  instruction?: string;

  // Dành cho Stage 1: Pretest & Stage 10: Posttest
  questions?: Array<{
    id: string;
    question: string;
    options: string[]; // Mảng 4 lựa chọn (Pretest) hoặc 2 lựa chọn (Posttest)
    answer: number; // Chỉ mục đáp án đúng (0, 1, 2, 3)
    explanation: string; // Giải thích sư phạm
  }>;

  // Dành cho Stage 2: Story
  character?: string; // Tên nhân vật bé (e.g. "Su", "Kem")
  npc?: string; // Tên nhân vật AI/Đồng hành (e.g. "Sao Nova")
  dialogues?: Array<{
    speaker: string;
    avatar: string; // Emoji hoặc icon
    text: string; // Tối đa 25 từ
  }>;
  decision?: {
    prompt: string;
    choices: Array<{
      text: string;
      correct: boolean;
      feedback: string;
    }>;
  };

  // Dành cho Stage 3: Minigame Cử chỉ
  draggables?: Array<{
    id: string;
    label: string;
    isCorrect: boolean;
  }>;
  targetZoneLabel?: string;

  // Dành cho Stage 4: Minigame Matching
  pairs?: Array<{
    id: number;
    left: string;
    right: string;
  }>;

  // Dành cho Stage 5: Minigame Sequence Reorder
  steps?: Array<{
    id: string;
    text: string;
    correctOrder: number; // 1, 2, 3
  }>;

  // Dành cho Stage 6: Boss Battle
  bossName?: string;
  scenarios?: Array<{
    step: number;
    question: string;
    options: Array<{
      text: string;
      correct: boolean;
      hpDamage: number; // Sát thương khi chọn sai (e.g. 20)
      feedback: string;
    }>;
  }>;

  // Dành cho Stage 7: Reflection
  question?: string;
  options?: string[];

  // Dành cho Stage 8: Real-life Challenge
  missionText?: string;
  guideText?: string;

  // Dành cho Stage 9: Parent Confirm
  parentPrompt?: string;
  confirmButtonText?: string;

  // Dành cho Stage 10: Posttest Reward Data
  correctAnswer?: number;
  rewardData?: {
    xp: number;
    stars: number;
    badgeName: string;
    badgeIcon: string;
  };
}
```

---

## 2. Quy Tắc Validation (Constraint Rules)

1. **Mảng `stages`**: Bắt buộc phải có đúng **10 phần tử** theo đúng thứ tự types:
   `['pretest', 'story', 'minigame_drag', 'minigame_match', 'minigame_sequence', 'boss', 'reflection', 'challenge', 'parent_confirm', 'posttest']`.
2. **Độ dài chuỗi**:
   - `dialogues[i].text`: Không quá **25 từ** (đảm bảo hiển thị gọn gàng trên mobile).
   - `title`: Không quá **60 ký tự**.
3. **Tính nhất quán**:
   - Nhân vật trong `story` (Stage 2) và tình huống ở `boss` (Stage 6) phải đồng nhất về chủ đề kỹ năng.
