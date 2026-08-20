import json
import os

skills = [
    "Chúc tết",
    "Kĩ năng thuyết trình",
    "Lắng nghe",
    "Thể hiện sự tôn trọng với thầy cô",
    "Thể hiện tình yêu thương với thầy cô giáo",
    "Chia sẻ ý tưởng",
    "Trách nhiệm cá nhân"
]

tiers = [
    "A - Knowledge (Biết)",
    "B - Understanding (Hiểu)",
    "C - Decision Making (Lựa chọn trong tình huống)",
    "D - Judgment (Đánh giá hành vi)",
    "E - Transfer & Reflection (Vận dụng & Phản tư)"
]

questions = []
q_id = 1

templates = {
    "Chúc tết": {
        "A": ("Câu hỏi về việc nhận biết phong tục chúc tết", "Biết được phong tục", "Không biết", "Chưa rõ", "Sai", "A", "Học sinh cần biết phong tục cơ bản."),
        "B": ("Câu hỏi hiểu ý nghĩa của lời chúc", "Hiểu ý nghĩa mong bình an", "Chỉ để nhận lì xì", "Là bắt buộc", "Không có ý nghĩa", "A", "Hiểu được giá trị tinh thần của lời chúc."),
        "C": ("Khi đến nhà người lớn, em sẽ làm gì đầu tiên?", "Khoanh tay chúc tết", "Chạy đi chơi", "Đòi lì xì", "Im lặng", "A", "Lựa chọn hành vi lễ phép khi gặp người lớn."),
        "D": ("Bạn A nhận lì xì và xé ngay trước mặt khách. Em đánh giá thế nào?", "Rất vô lễ", "Bình thường", "Nên làm thế", "Không sao", "A", "Đánh giá hành vi sai trái khi nhận lì xì."),
        "E": ("Em sẽ áp dụng cách chúc tết ông bà thế nào vào năm nay?", "Tự chuẩn bị câu chúc ý nghĩa", "Đợi bố mẹ nhắc", "Chỉ chúc khi có lì xì", "Không chúc", "A", "Vận dụng kỹ năng vào thực tế của bản thân.")
    },
    "Kĩ năng thuyết trình": {
        "A": ("Thuyết trình là gì?", "Trình bày thông tin trước người khác", "Đọc sách một mình", "Hát karaoke", "Viết bài", "A", "Biết khái niệm cơ bản về thuyết trình."),
        "B": ("Tại sao cần giao tiếp bằng mắt khi thuyết trình?", "Để kết nối với khán giả", "Để dọa khán giả", "Để nhìn trần nhà", "Không cần thiết", "A", "Hiểu lý do của ngôn ngữ cơ thể."),
        "C": ("Khi quên lời lúc thuyết trình, em nên làm gì?", "Bình tĩnh xem lại dàn ý", "Khóc", "Bỏ chạy", "Đứng im mãi mãi", "A", "Xử lý tình huống khi gặp sự cố."),
        "D": ("Bạn B nói rất nhỏ và cúi gằm mặt. Đánh giá kỹ năng của B?", "Cần tự tin và nói to hơn", "Rất xuất sắc", "Nên giữ nguyên", "Tốt rồi", "A", "Nhận xét và rút kinh nghiệm từ bạn."),
        "E": ("Để thuyết trình tốt bài tập ngày mai, em sẽ làm gì tối nay?", "Luyện tập trước gương", "Chơi game", "Đi ngủ sớm không cần chuẩn bị", "Nhờ bạn làm hộ", "A", "Chuẩn bị thực tiễn cho nhiệm vụ.")
    },
    "Lắng nghe": {
        "A": ("Biểu hiện của việc lắng nghe là gì?", "Mắt nhìn người nói", "Bấm điện thoại", "Nói chuyện riêng", "Ngủ gật", "A", "Nhận biết hành vi lắng nghe tích cực."),
        "B": ("Lắng nghe giúp chúng ta điều gì?", "Hiểu đúng vấn đề", "Mất thời gian", "Cãi nhau dễ hơn", "Không có tác dụng", "A", "Hiểu lợi ích của việc lắng nghe."),
        "C": ("Khi bạn đang kể chuyện buồn, em sẽ?", "Im lặng lắng nghe và an ủi", "Cười to", "Kể chuyện khác", "Bỏ đi", "A", "Chọn phản ứng phù hợp với cảm xúc của bạn."),
        "D": ("Bạn C vừa nghe giảng vừa vẽ bậy. Hành vi này đúng hay sai?", "Sai, không tôn trọng giáo viên", "Đúng", "Bình thường", "Rất sáng tạo", "A", "Đánh giá sự tập trung trong học tập."),
        "E": ("Em áp dụng kỹ năng lắng nghe ở nhà như thế nào?", "Chú ý nghe lời bố mẹ dặn dò", "Bật tivi to khi mẹ nói", "Chỉ nghe điều mình thích", "Bỏ ngoài tai", "A", "Vận dụng vào đời sống gia đình.")
    },
    "Thể hiện sự tôn trọng với thầy cô": {
        "A": ("Hành động nào thể hiện sự tôn trọng thầy cô?", "Chào hỏi lễ phép", "Lờ đi", "Trêu đùa quá trớn", "Nói leo", "A", "Nhận biết hành vi chuẩn mực."),
        "B": ("Tại sao phải tôn trọng thầy cô?", "Vì thầy cô dạy dỗ chúng ta", "Vì sợ bị phạt", "Vì bị bắt buộc", "Không cần thiết", "A", "Hiểu đạo lý tôn sư trọng đạo."),
        "C": ("Thầy giáo đang xách nhiều đồ nặng, em sẽ làm gì?", "Chạy lại giúp thầy", "Đứng nhìn", "Tránh đi đường khác", "Chỉ trỏ", "A", "Hành động thực tế thể hiện sự quan tâm."),
        "D": ("Bạn D cãi lại cô giáo khi bị nhắc nhở. Em thấy sao?", "Hành vi sai, cần xin lỗi cô", "Rất dũng cảm", "Bình thường", "Nên làm vậy", "A", "Phân biệt đúng sai trong giao tiếp."),
        "E": ("Em sẽ làm gì để thể hiện sự tôn trọng cô giáo mới?", "Lắng nghe cô giảng bài và phát biểu", "Nói chuyện riêng", "Kiểm tra kiến thức của cô", "Không quan tâm", "A", "Áp dụng thái độ tích cực trong môi trường học.")
    },
    "Thể hiện tình yêu thương với thầy cô giáo": {
        "A": ("Cách thể hiện tình yêu thương thầy cô là?", "Tặng thiệp do mình tự làm", "Trốn học", "Phá đồ của lớp", "Làm ồn", "A", "Nhận biết cách biểu đạt tình cảm."),
        "B": ("Tình yêu thương thầy cô mang lại điều gì?", "Sự gắn kết và niềm vui", "Sự mệt mỏi", "Điểm số cao", "Không gì cả", "A", "Hiểu giá trị của tình cảm thầy trò."),
        "C": ("Cô giáo bị ốm giọng khàn, em nên làm gì?", "Giữ trật tự để cô không phải nói to", "La hét", "Bắt cô giảng lại nhiều lần", "Không học nữa", "A", "Lựa chọn hành vi chia sẻ khó khăn với thầy cô."),
        "D": ("Nhóm bạn E cùng nhau làm thơ tặng thầy nhân ngày 20/11. Đánh giá?", "Rất đáng khen ngợi", "Lãng phí thời gian", "Không cần thiết", "Kém cỏi", "A", "Đánh giá hoạt động tri ân."),
        "E": ("Hằng ngày, em làm gì để thầy cô vui lòng?", "Chăm chỉ làm bài tập", "Đến lớp trễ", "Hay cãi bạn", "Quên sách vở", "A", "Biến tình yêu thương thành hành động học tập tốt.")
    },
    "Chia sẻ ý tưởng": {
        "A": ("Chia sẻ ý tưởng là gì?", "Nói ra suy nghĩ của mình cho người khác", "Giấu kín không cho ai biết", "Lấy ý tưởng của bạn", "Chép bài", "A", "Biết định nghĩa về chia sẻ ý tưởng."),
        "B": ("Vì sao chúng ta nên chia sẻ ý tưởng trong làm việc nhóm?", "Để có nhiều sáng kiến hay hơn", "Để cãi nhau", "Để khoe khoang", "Để được cô khen", "A", "Hiểu lợi ích của trí tuệ tập thể."),
        "C": ("Khi có một cách giải toán mới, em sẽ làm gì?", "Giơ tay phát biểu chia sẻ với lớp", "Giấu đi", "Sợ sai không dám nói", "Bắt bạn phải làm theo", "A", "Dũng cảm thể hiện sáng kiến cá nhân."),
        "D": ("Bạn F chê cười ý tưởng của người khác. Đánh giá hành vi?", "Không tốt, cần tôn trọng mọi ý kiến", "Rất ngầu", "Bình thường", "Đúng đắn", "A", "Xây dựng thái độ tôn trọng ý tưởng."),
        "E": ("Em có một ý tưởng trang trí lớp học, em sẽ làm gì?", "Vẽ phác thảo và trình bày với cô giáo", "Ngồi im", "Làm hỏng tường", "Chê lớp xấu", "A", "Biến suy nghĩ thành kế hoạch cụ thể.")
    },
    "Trách nhiệm cá nhân": {
        "A": ("Trách nhiệm cá nhân là gì?", "Tự giác hoàn thành nhiệm vụ của mình", "Đổ lỗi cho người khác", "Nhờ người khác làm hộ", "Bỏ cuộc", "A", "Nhận biết khái niệm trách nhiệm."),
        "B": ("Người có trách nhiệm sẽ nhận được gì?", "Sự tin tưởng của mọi người", "Sự ghét bỏ", "Hình phạt", "Không có gì", "A", "Hiểu kết quả của lối sống có trách nhiệm."),
        "C": ("Em lỡ làm vỡ bình hoa của lớp, em sẽ làm gì?", "Tự nhận lỗi và dọn dẹp", "Đổ cho con mèo", "Khóc lóc ăn vạ", "Chạy trốn", "A", "Lựa chọn dũng cảm đối mặt với sai lầm."),
        "D": ("Bạn G quên làm bài tập và nói dối là để quên vở. Đánh giá?", "Thiếu trung thực và vô trách nhiệm", "Rất thông minh", "Nên học tập", "Không sao", "A", "Phê phán hành vi trốn tránh trách nhiệm."),
        "E": ("Để rèn luyện tính trách nhiệm, em sẽ bắt đầu từ đâu?", "Tự giác gấp chăn màn mỗi sáng", "Chờ mẹ nhắc", "Làm qua loa", "Không làm gì", "A", "Áp dụng vào công việc nhỏ hằng ngày.")
    }
}

for skill in skills:
    temp_skill = templates.get(skill, templates["Chúc tết"])
    for i, tier in enumerate(tiers):
        t_key = ["A", "B", "C", "D", "E"][i]
        q_data = temp_skill[t_key]
        for j in range(4):
            # Biến tấu câu hỏi một chút để tránh trùng lặp hoàn toàn
            question_text = f"{q_data[0]} (Tình huống {j+1})"
            q = {
                "number": q_id,
                "question": question_text,
                "options": {
                    "A": q_data[1],
                    "B": q_data[2],
                    "C": q_data[3],
                    "D": q_data[4]
                },
                "answer": q_data[5],
                "explanation": q_data[6],
                "tier": tier,
                "skill": skill
            }
            questions.append(q)
            q_id += 1

output_path = "/Users/thuy/Documents/apptieuhoc/question_bank/temp/sub4.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Generated {len(questions)} questions in {output_path}")
