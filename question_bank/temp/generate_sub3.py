import json
import random

skills_data = {
    "Giới thiệu sở thích của bản thân": [
        "Em thích vẽ tranh", "Em thích đá bóng", "Em thích đọc sách", "Em thích ca hát"
    ],
    "Làm việc nhóm": [
        "Cùng làm báo tường", "Dọn dẹp lớp học", "Làm bài tập nhóm", "Chuẩn bị tiết mục văn nghệ"
    ],
    "Cảm xúc của bản thân": [
        "Khi được điểm cao", "Khi bị điểm kém", "Khi bị bạn trêu chọc", "Khi được tặng quà"
    ],
    "Cảm xúc của người khác": [
        "Thấy bạn khóc", "Thấy bạn vui vì chiến thắng", "Thấy mẹ mệt mỏi", "Thấy em bé bị ngã"
    ],
    "Nói lời cảm ơn": [
        "Được nhận quà sinh nhật", "Được bạn cho mượn bút", "Được cô giáo khen", "Được mẹ nấu ăn ngon"
    ],
    "Ứng xử lịch sự khi đến chơi nhà bạn": [
        "Khi mới bước vào cửa", "Khi xin phép dùng đồ", "Khi nói chuyện với bố mẹ bạn", "Khi chuẩn bị ra về"
    ],
    "Cổ vũ, động viên": [
        "Bạn tham gia chạy bộ", "Bạn trả lời sai trên lớp", "Bạn làm hỏng đồ chơi", "Bạn đi thi vẽ"
    ]
}

tiers = [
    "A - Knowledge (Biết)",
    "B - Understanding (Hiểu)",
    "C - Decision Making (Lựa chọn trong tình huống)",
    "D - Judgment (Đánh giá hành vi)",
    "E - Transfer & Reflection (Vận dụng & Phản tư)"
]

def generate_questions():
    questions = []
    question_number = 1
    
    for skill, situations in skills_data.items():
        for tier_index, tier in enumerate(tiers):
            for j in range(4): # 4 questions per tier
                situation = situations[j % len(situations)]
                
                q = {
                    "number": question_number,
                    "question": f"Tình huống ({situation}): Ở mức độ {tier}, em sẽ ứng xử như thế nào về kỹ năng {skill}?",
                    "options": {
                        "A": f"Bày tỏ thái độ tiêu cực hoặc né tránh ({situation}).",
                        "B": f"Thực hiện kỹ năng {skill} một cách tích cực và đúng mực.",
                        "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
                        "D": "Nhờ người khác làm thay mình."
                    },
                    "answer": "B",
                    "explanation": f"Ở mức độ {tier}, học sinh cần hiểu và áp dụng {skill} vào tình huống {situation}. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
                    "tier": tier,
                    "skill": skill
                }
                questions.append(q)
                question_number += 1
                
    return questions

if __name__ == "__main__":
    data = generate_questions()
    with open('/Users/thuy/Documents/apptieuhoc/question_bank/temp/sub3.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Done")
