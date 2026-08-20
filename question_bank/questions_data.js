// Ngân hàng câu hỏi tự động biên dịch theo Khung Novastars LSCAF
const QUESTIONS_DB = [
  {
    "number": 1,
    "question": "Khi đi siêu thị cùng mẹ, nếu không thấy mẹ đâu, việc ĐẦU TIÊN em nên làm là gì?",
    "options": {
      "A": "Khóc thật to để mẹ nghe thấy.",
      "B": "Chạy đi tìm mẹ khắp các gian hàng.",
      "C": "Đứng yên tại chỗ và quan sát xung quanh.",
      "D": "Chạy ra ngoài đường để tìm mẹ."
    },
    "answer": "C",
    "explanation": "Đứng yên tại chỗ giúp phụ huynh dễ dàng tìm thấy trẻ hơn so với việc trẻ di chuyển liên tục. Chạy đi tìm hoặc ra ngoài đường rất nguy hiểm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_1",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 2,
    "question": "Số điện thoại nào dưới đây là quan trọng nhất em cần nhớ để phòng khi đi lạc?",
    "options": {
      "A": "Số điện thoại của bạn thân.",
      "B": "Số điện thoại của cô giáo mầm non.",
      "C": "Số điện thoại của bố hoặc mẹ.",
      "D": "Số điện thoại của bác hàng xóm."
    },
    "answer": "C",
    "explanation": "Nhớ số điện thoại của bố mẹ là kiến thức cơ bản nhất để nhờ người lớn liên lạc khi trẻ bị lạc.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_2",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 3,
    "question": "Người nào sau đây là người an toàn NHẤT để em nhờ giúp đỡ khi bị lạc trong trung tâm thương mại?",
    "options": {
      "A": "Một người lạ đang cho em kẹo.",
      "B": "Chú bảo vệ mặc đồng phục của trung tâm.",
      "C": "Một bạn nhỏ khác đang đi một mình.",
      "D": "Một người lạ đi xe máy bên ngoài trung tâm."
    },
    "answer": "B",
    "explanation": "Bảo vệ hoặc nhân viên mặc đồng phục tại nơi bị lạc là những người an toàn và có trách nhiệm hỗ trợ trẻ em đi lạc.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_3",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 4,
    "question": "Trước khi đến nơi đông người (công viên, lễ hội), bố mẹ thường dặn em điều gì để tránh bị lạc?",
    "options": {
      "A": "Luôn nắm tay bố mẹ hoặc đi sát bên cạnh.",
      "B": "Được phép chạy đi chơi một mình nếu thấy đồ chơi đẹp.",
      "C": "Chơi trốn tìm với bố mẹ trong đám đông.",
      "D": "Tự đi mua đồ ăn mà không cần hỏi ý kiến."
    },
    "answer": "A",
    "explanation": "Luôn đi sát hoặc nắm tay người lớn là nguyên tắc phòng ngừa cơ bản để không bị lạc ở nơi đông người.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_4",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 5,
    "question": "Vì sao em không nên chạy lung tung để tìm mẹ khi bị lạc ở công viên?",
    "options": {
      "A": "Vì công viên rất nhỏ, mẹ sẽ tự thấy em.",
      "B": "Vì chạy lung tung sẽ làm em mệt và mẹ sẽ khó tìm thấy em hơn.",
      "C": "Vì em không mang theo tiền mua nước uống.",
      "D": "Vì em sẽ làm hỏng hoa cỏ trong công viên."
    },
    "answer": "B",
    "explanation": "Học sinh hiểu được nguyên lý: di chuyển liên tục làm thay đổi vị trí không ngừng, khiến người nhà khó xác định vị trí để tìm kiếm.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_5",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 6,
    "question": "Tại sao việc ghi nhớ đặc điểm quần áo của mình và bố mẹ trước khi ra ngoài lại quan trọng?",
    "options": {
      "A": "Để so sánh xem ai mặc đẹp hơn.",
      "B": "Để có thể miêu tả cho người giúp đỡ khi không may bị lạc.",
      "C": "Để về nhà vẽ lại bức tranh.",
      "D": "Để biết cách chọn quần áo lần sau."
    },
    "answer": "B",
    "explanation": "Hiểu được mục đích của việc ghi nhớ đặc điểm nhận dạng giúp cung cấp thông tin chính xác cho bảo vệ hoặc công an khi cần thiết.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_6",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 7,
    "question": "Hành động nào cho thấy em ĐÃ HIỂU nguyên tắc 'Không đi theo người lạ' khi bị lạc?",
    "options": {
      "A": "Đồng ý để người lạ dắt tay đi tìm mẹ.",
      "B": "Lên xe máy để người lạ chở về nhà.",
      "C": "Từ chối đi theo người lạ, chỉ nhờ họ gọi điện thoại giúp ngay tại chỗ.",
      "D": "Nhận đồ chơi của người lạ và đi theo họ ra bãi xe."
    },
    "answer": "C",
    "explanation": "Hiểu rõ rằng người lạ có thể có ý đồ xấu; việc nhờ gọi điện tại chỗ vừa giúp liên lạc được với người thân, vừa giữ an toàn cho bản thân.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_7",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 8,
    "question": "Theo em, một 'người lạ an toàn' trên đường phố thường là ai?",
    "options": {
      "A": "Người phụ nữ đang dắt theo trẻ em.",
      "B": "Một thanh niên đang bịt kín mặt.",
      "C": "Người cho em nhiều đồ ăn ngon.",
      "D": "Một người đang vội vã chạy bộ."
    },
    "answer": "A",
    "explanation": "Hiểu được khái niệm 'người lạ an toàn'. Phụ nữ đi cùng trẻ em thường đáng tin cậy hơn nếu không tìm thấy công an hay bảo vệ.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_8",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 9,
    "question": "Em đang đứng chờ mẹ ở cửa hàng sách. Một cô lạ mặt đến bảo: 'Mẹ cháu đang đợi ở ngoài bãi xe, cô dắt cháu ra nhé'. Em sẽ chọn cách làm nào?",
    "options": {
      "A": "Đi theo cô đó ngay vì muốn gặp mẹ.",
      "B": "Nói: 'Cháu không quen cô, cháu sẽ đợi mẹ ở đây' và lùi lại.",
      "C": "Khóc lóc ầm ĩ và đánh cô đó.",
      "D": "Đưa cặp sách cho cô đó cầm giúp."
    },
    "answer": "B",
    "explanation": "Lựa chọn từ chối dứt khoát và giữ khoảng cách an toàn, tuân thủ nguyên tắc không đi theo người lạ.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_9",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 10,
    "question": "Em bị lạc trong sở thú và không nhớ số điện thoại của mẹ. Em thấy một chú công an đang đi tuần tra. Em sẽ làm gì?",
    "options": {
      "A": "Chạy lại gần, lễ phép nói: 'Chú ơi, cháu bị lạc. Chú giúp cháu thông báo trên loa được không ạ?'.",
      "B": "Sợ chú công an nên trốn vào bụi cây.",
      "C": "Ngồi tại chỗ khóc chờ mẹ tìm.",
      "D": "Chạy ra cổng sở thú tự đi về nhà."
    },
    "answer": "A",
    "explanation": "Quyết định chủ động tìm kiếm sự giúp đỡ từ người an toàn nhất (công an) và đưa ra phương án khả thi (phát loa).",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_10",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 11,
    "question": "Mẹ dặn em đứng đợi ở cửa hàng bánh mì để mẹ vào siêu thị mua đồ. Mười phút trôi qua chưa thấy mẹ ra, em bắt đầu thấy sợ. Em nên làm gì?",
    "options": {
      "A": "Chạy vào trong siêu thị rộng lớn để tìm mẹ.",
      "B": "Vẫn đứng yên tại cửa hàng bánh mì như lời mẹ dặn.",
      "C": "Đi bộ về nhà một mình.",
      "D": "Sang đường chơi với mấy bạn nhỏ khác."
    },
    "answer": "B",
    "explanation": "Trong tình huống này, quyết định tốt nhất là tuân thủ lời dặn ban đầu, giữ nguyên vị trí để mẹ quay lại đón.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_11",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 12,
    "question": "Em đang bị lạc. Một người lạ tốt bụng đưa cho em chiếc điện thoại để gọi cho bố. Em sẽ nói gì đầu tiên khi bố bắt máy?",
    "options": {
      "A": "'Bố ơi, con nhớ bố lắm!'.",
      "B": "'Bố mua đồ chơi cho con chưa?'.",
      "C": "'Bố ơi con bị lạc rồi, con đang ở quầy đồ chơi siêu thị X, bố đến đón con nhé!'.",
      "D": "'Bố ơi, con đang nói chuyện bằng điện thoại xịn lắm!'."
    },
    "answer": "C",
    "explanation": "Quyết định cung cấp thông tin quan trọng nhất (tình trạng bị lạc và vị trí hiện tại) một cách nhanh chóng và rõ ràng.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_12",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 13,
    "question": "Bạn Minh bị lạc ở rạp chiếu phim. Bạn ấy khóc lóc và chạy theo một chú lạ mặt vừa cho bạn ấy kẹo. Em đánh giá hành vi của Minh thế nào?",
    "options": {
      "A": "Rất tốt, vì chú ấy có kẹo nên chắc chắn là người tốt.",
      "B": "Chưa an toàn, vì Minh không nên chạy đi theo người lạ và nhận đồ ăn từ họ.",
      "C": "Bình thường, ai bị lạc cũng khóc và đi theo người khác.",
      "D": "Thông minh, vì đi theo người lạ sẽ nhanh tìm được mẹ hơn."
    },
    "answer": "B",
    "explanation": "Học sinh đánh giá được hành vi chạy theo người lạ và nhận quà là sai, vi phạm quy tắc an toàn cơ bản.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_13",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 14,
    "question": "Khi thấy bạn Hoa bị lạc, một cô bán hàng trong siêu thị bảo Hoa đọc số điện thoại để cô gọi cho mẹ. Hoa đã đọc to rõ ràng số của mẹ. Em nghĩ hành động của Hoa là đúng hay sai?",
    "options": {
      "A": "Sai, vì không được đọc số điện thoại cho bất kỳ ai.",
      "B": "Đúng, vì cô bán hàng trong siêu thị là người lớn có thể giúp đỡ, và gọi điện là cách an toàn.",
      "C": "Sai, Hoa nên tự lấy điện thoại của cô ấy để gọi.",
      "D": "Đúng, nhưng Hoa nên đòi cô ấy cho bánh trước khi đọc số."
    },
    "answer": "B",
    "explanation": "Đánh giá hành vi cung cấp số điện thoại cho nhân viên cửa hàng là một hành động đúng đắn và an toàn trong bối cảnh siêu thị.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_14",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 15,
    "question": "Bạn Nam bị lạc ở bãi biển. Nam quyết định xuống tắm biển một mình trong lúc chờ bố mẹ tìm. Hành động này tiềm ẩn nguy cơ gì?",
    "options": {
      "A": "Không có nguy cơ gì, Nam sẽ mát mẻ hơn.",
      "B": "Nam có thể bị đuối nước mà không ai biết, rất nguy hiểm.",
      "C": "Nam sẽ bơi giỏi hơn.",
      "D": "Bố mẹ sẽ dễ tìm thấy Nam dưới nước hơn."
    },
    "answer": "B",
    "explanation": "Đánh giá được mức độ nguy hiểm chết người của việc tự ý xuống nước khi không có người lớn giám sát, đặc biệt khi đang đi lạc.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_15",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 16,
    "question": "Thấy bạn nhỏ khóc vì lạc mẹ ở sân trường, bạn Tùng chạy đi báo cho thầy Tổng phụ trách Đội. Hành động của Tùng cho thấy điều gì?",
    "options": {
      "A": "Tùng rất nhiều chuyện.",
      "B": "Tùng biết cách xử lý tình huống an toàn và biết tìm đúng người có trách nhiệm giải quyết.",
      "C": "Tùng không biết dỗ bạn nín khóc.",
      "D": "Tùng muốn được thầy giáo khen ngợi."
    },
    "answer": "B",
    "explanation": "Đánh giá hành động của người ngoài cuộc; việc tìm kiếm sự hỗ trợ từ giáo viên/nhân viên nhà trường là cách giải quyết chuẩn xác.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_16",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 17,
    "question": "Nếu em chuẩn bị đi hội chợ Tết rất đông đúc, em sẽ chuẩn bị điều gì từ trước ở nhà để phòng ngừa việc đi lạc?",
    "options": {
      "A": "Chỉ cần mặc quần áo đẹp là đủ.",
      "B": "Mang theo thật nhiều tiền tiêu vặt.",
      "C": "Học thuộc số điện thoại của bố mẹ và thống nhất với bố mẹ một 'điểm hẹn' nếu bị lạc.",
      "D": "Mang theo nhiều đồ chơi để chơi nếu bị lạc."
    },
    "answer": "C",
    "explanation": "Vận dụng kiến thức để chuẩn bị các biện pháp phòng ngừa thực tế (thống nhất điểm hẹn, ôn lại số điện thoại) trước khi sự cố xảy ra.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_17",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 18,
    "question": "Em vừa trải qua một lần đi lạc ở siêu thị và đã được tìm thấy. Bài học lớn nhất em rút ra cho những lần đi chơi sau là gì?",
    "options": {
      "A": "Lần sau không thèm đi siêu thị nữa.",
      "B": "Lần sau sẽ chạy nhanh hơn để bố mẹ không bắt kịp.",
      "C": "Phải luôn quan sát xem bố mẹ ở đâu và không được tự ý tách ra xem đồ chơi một mình.",
      "D": "Siêu thị rất đáng sợ."
    },
    "answer": "C",
    "explanation": "Phản tư về trải nghiệm cá nhân, rút ra bài học thay đổi hành vi để không lặp lại sai lầm trong tương lai.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_18",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 19,
    "question": "Em có một chiếc vòng tay hoặc thẻ có ghi tên và số điện thoại của gia đình. Em nên sử dụng nó như thế nào khi đi du lịch?",
    "options": {
      "A": "Cất kỹ trong vali ở khách sạn.",
      "B": "Đeo vào tay hoặc mang theo trong túi áo/quần mỗi khi ra ngoài.",
      "C": "Vứt đi vì em đã nhớ số điện thoại rồi.",
      "D": "Đổi lấy đồ chơi của bạn."
    },
    "answer": "B",
    "explanation": "Vận dụng công cụ hỗ trợ an toàn (thẻ thông tin) vào thực tế sinh hoạt khi đi du lịch.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_19",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 20,
    "question": "Bạn thân của em rủ: 'Mình trốn bố mẹ ra góc kia chơi điện tử đi, một lát quay lại bố mẹ không biết đâu'. Dựa trên những gì đã học, em sẽ làm gì?",
    "options": {
      "A": "Đồng ý ngay vì chơi điện tử rất vui.",
      "B": "Từ chối và nhắc nhở bạn: 'Như vậy dễ bị lạc và gặp nguy hiểm lắm, mình phải xin phép người lớn trước'.",
      "C": "Bảo bạn đi một mình, còn em đứng đây canh chừng.",
      "D": "Chỉ trốn đi 5 phút rồi về ngay."
    },
    "answer": "B",
    "explanation": "Vận dụng kiến thức an toàn để đưa ra lời khuyên và ngăn chặn hành vi rủi ro của bạn bè trong một tình huống cám dỗ thực tế.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Phòng tránh và xử lý khi bị đi lạc",
    "id": "Phòng_tránh_và_xử_lý_khi_bị_đi_lạc_20",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 1,
    "question": "Khi đứng chờ xe buýt, em nên đứng ở vị trí nào?",
    "options": {
      "A": "Đứng dưới lòng đường để dễ nhìn thấy xe.",
      "B": "Đứng sát mép vỉa hè.",
      "C": "Đứng trên vỉa hè, lùi vào trong một khoảng an toàn.",
      "D": "Chạy nhảy đuổi nhau trên vỉa hè chờ xe."
    },
    "answer": "C",
    "explanation": "Đứng lùi vào trong vỉa hè giúp tránh nguy cơ bị các phương tiện giao thông khác quẹt phải hoặc ngã xuống lòng đường.",
    "tier": "A - Knowledge (Biết)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_1",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 2,
    "question": "Khi xe buýt hoặc tàu hỏa đang di chuyển, em tuyệt đối KHÔNG được làm hành động nào?",
    "options": {
      "A": "Ngồi ngay ngắn và bám tay vịn.",
      "B": "Nói chuyện nhỏ nhẹ với bạn bè.",
      "C": "Thò đầu, thò tay ra ngoài cửa sổ.",
      "D": "Ngắm cảnh qua lớp kính cửa sổ đóng kín."
    },
    "answer": "C",
    "explanation": "Thò đầu hoặc tay ra ngoài cửa sổ khi xe đang chạy cực kỳ nguy hiểm, có thể va chạm với các phương tiện khác dẫn đến tai nạn nghiêm trọng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_2",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 3,
    "question": "Khi đi tàu hỏa hoặc máy bay, em có được phép tự ý mở cửa thoát hiểm (cửa emergency) không?",
    "options": {
      "A": "Được, nếu em thấy ngột ngạt.",
      "B": "Không, chỉ được mở khi có lệnh của nhân viên trong trường hợp khẩn cấp.",
      "C": "Được, nếu em tò mò muốn xem bên ngoài.",
      "D": "Được, để lấy không khí mát."
    },
    "answer": "B",
    "explanation": "Cửa thoát hiểm được thiết kế riêng cho tình huống khẩn cấp, tự ý mở sẽ vi phạm nghiêm trọng luật an toàn và gây nguy hiểm cho tất cả hành khách.",
    "tier": "A - Knowledge (Biết)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_3",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 4,
    "question": "Hành động nào dưới đây là đúng khi lên hoặc xuống xe buýt?",
    "options": {
      "A": "Chen lấn, xô đẩy để lên trước.",
      "B": "Nhảy xuống khi xe chưa dừng hẳn.",
      "C": "Xếp hàng trật tự, chờ xe dừng hẳn mới lên hoặc xuống.",
      "D": "Bám vào đuôi xe để đu theo."
    },
    "answer": "C",
    "explanation": "Xếp hàng và chờ xe dừng hẳn là quy tắc cơ bản để tránh vấp ngã hoặc bị bánh xe chèn phải.",
    "tier": "A - Knowledge (Biết)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_4",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 5,
    "question": "Vì sao trên xe buýt thường có những ghế màu khác (ví dụ: vàng, xanh nổi bật) ở gần cửa ra vào?",
    "options": {
      "A": "Để trang trí cho xe đẹp hơn.",
      "B": "Để dành riêng cho lái xe nghỉ ngơi.",
      "C": "Để ưu tiên cho người già, phụ nữ có thai, người khuyết tật và trẻ em nhỏ.",
      "D": "Để bán vé với giá đắt hơn."
    },
    "answer": "C",
    "explanation": "Hiểu được ý nghĩa của ghế ưu tiên là biểu hiện của văn hóa giao thông và sự cảm thông xã hội.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_5",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 6,
    "question": "Tại sao em cần phải bám thật chặt vào tay vịn khi đứng trên xe buýt?",
    "options": {
      "A": "Để tập thể dục tay.",
      "B": "Vì xe buýt có thể phanh gấp hoặc rẽ đột ngột, làm em bị ngã nếu không bám chắc.",
      "C": "Để không ai lấy mất chỗ đứng của em.",
      "D": "Để tay không bị bẩn."
    },
    "answer": "B",
    "explanation": "Hiểu lực quán tính: khi xe thay đổi tốc độ đột ngột, cơ thể sẽ bị mất thăng bằng nếu không có điểm tựa.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_6",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 7,
    "question": "Vì sao việc đùa giỡn, la hét trên tàu xe lại bị coi là hành vi không an toàn?",
    "options": {
      "A": "Vì sẽ làm bác tài xế mất tập trung, có thể gây tai nạn.",
      "B": "Vì em sẽ bị đau họng.",
      "C": "Vì tàu xe sẽ chạy chậm lại.",
      "D": "Vì sẽ tốn nhiều nhiên liệu hơn."
    },
    "answer": "A",
    "explanation": "Sự ồn ào và lộn xộn ảnh hưởng trực tiếp đến sự tập trung của người lái xe, tiềm ẩn nguy cơ tai nạn giao thông.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_7",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 8,
    "question": "Trang phục rườm rà, áo mưa lòa xòa có thể gây nguy hiểm gì khi lên/xuống xe buýt?",
    "options": {
      "A": "Làm em không nhìn thấy đường.",
      "B": "Dễ bị kẹt vào cửa xe đang đóng hoặc vướng vào xe khác.",
      "C": "Làm em không lấy được tiền mua vé.",
      "D": "Làm ướt ghế trên xe."
    },
    "answer": "B",
    "explanation": "Quần áo hoặc phụ kiện lòa xòa rất dễ bị kẹt vào hệ thống cửa tự động, gây nguy hiểm tính mạng khi xe di chuyển.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_8",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 9,
    "question": "Xe buýt đã chật kín người nhưng em đang rất vội đến trường. Em nên quyết định thế nào?",
    "options": {
      "A": "Cố gắng chen lấn đẩy người khác để leo lên bằng được.",
      "B": "Đứng bám ở ngoài bậc lên xuống của cửa xe.",
      "C": "Chờ chuyến xe tiếp theo để đảm bảo an toàn.",
      "D": "Khóc lóc ăn vạ bắt phụ xe phải cho lên."
    },
    "answer": "C",
    "explanation": "Quyết định ưu tiên sự an toàn của bản thân lên trên sự vội vã; đu bám xe chật kín rất nguy hiểm.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_9",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 10,
    "question": "Khi đang ngồi trên xe buýt, em thấy một bà cụ bước lên xe và không còn ghế trống. Em sẽ làm gì?",
    "options": {
      "A": "Nhắm mắt vờ ngủ để không phải nhường ghế.",
      "B": "Nhìn ra cửa sổ coi như không thấy.",
      "C": "Chủ động đứng dậy, nhường ghế của mình cho bà cụ và bám vào tay vịn.",
      "D": "Bảo bà cụ đi xuống xe khác."
    },
    "answer": "C",
    "explanation": "Quyết định thực hiện hành vi văn minh, lịch sự và đảm bảo an toàn cho người yếu thế trên xe công cộng.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_10",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 11,
    "question": "Em phát hiện có túi đồ bốc khói hoặc nghi ngờ là đồ nguy hiểm bị bỏ quên trên tàu hỏa. Em sẽ xử lý ra sao?",
    "options": {
      "A": "Mở túi ra xem bên trong có gì.",
      "B": "Mang túi đồ đó về nhà.",
      "C": "Tránh xa và lập tức báo cho nhân viên trên tàu (soát vé, trưởng tàu).",
      "D": "Đá túi đồ ra chỗ khác."
    },
    "answer": "C",
    "explanation": "Quyết định xử lý đúng đắn với các vật thể lạ: không chạm vào, giữ khoảng cách và báo cáo người có thẩm quyền.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_11",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 12,
    "question": "Xuống xe buýt, em muốn sang đường. Cách an toàn nhất là gì?",
    "options": {
      "A": "Chạy tạt ngay trước đầu xe buýt vừa dừng.",
      "B": "Đi vòng ra sau đuôi xe buýt để sang đường.",
      "C": "Chờ xe buýt rời khỏi bến, quan sát đường thông thoáng hoặc tìm vạch kẻ đường/cầu vượt rồi mới sang.",
      "D": "Sang đường ngay chỗ nào cũng được."
    },
    "answer": "C",
    "explanation": "Đi trước mũi hoặc sau đuôi xe đều bị khuất tầm nhìn (điểm mù). Chờ xe đi khuất mới đảm bảo quan sát an toàn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_12",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 13,
    "question": "Hai bạn nhỏ đang chơi oẳn tù tì và chạy đuổi nhau dọc hành lang toa tàu hỏa. Em đánh giá hành vi này như thế nào?",
    "options": {
      "A": "Rất vui vẻ, giúp các bạn bớt chán khi đi tàu.",
      "B": "Nguy hiểm, vì tàu rung lắc có thể làm các bạn ngã và làm phiền hành khách khác.",
      "C": "Bình thường, trẻ em thì phải được chạy nhảy.",
      "D": "Tốt cho sức khỏe."
    },
    "answer": "B",
    "explanation": "Học sinh đánh giá được nguy cơ té ngã do tàu rung lắc và ý thức giữ gìn trật tự công cộng.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_13",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 14,
    "question": "Một bạn học sinh vứt vỏ chai nước xuống đường qua cửa sổ xe khách đang chạy. Nhận xét của em về hành vi này?",
    "options": {
      "A": "Rất sai, gây ô nhiễm môi trường và có thể văng trúng người đi đường gây tai nạn.",
      "B": "Bình thường vì rác đã ra khỏi xe.",
      "C": "Đúng, vì giữ xe sạch sẽ là được.",
      "D": "Sai, vì bạn ấy có thể bị mất vỏ chai đẹp."
    },
    "answer": "A",
    "explanation": "Đánh giá mức độ nguy hiểm và thiếu ý thức bảo vệ môi trường của việc ném đồ vật từ xe đang chạy.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_14",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 15,
    "question": "Khi xe buýt dừng, cửa đang đóng lại thì một bạn nam dùng tay cố gắng cạy cửa để lách xuống. Hành vi này có thể dẫn đến hậu quả gì?",
    "options": {
      "A": "Bạn ấy sẽ xuống xe nhanh hơn người khác.",
      "B": "Bạn ấy được tài xế khen ngợi vì khỏe mạnh.",
      "C": "Cửa có thể kẹp nát tay hoặc bạn ấy bị ngã kéo lê trên đường khi xe chạy.",
      "D": "Cửa xe sẽ tự động mở to hơn."
    },
    "answer": "C",
    "explanation": "Nhận thức sâu sắc về hậu quả của việc cố ý can thiệp vào cửa tự động của phương tiện giao thông.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_15",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 16,
    "question": "Thấy tài xế xe buýt đang ngủ gật khi đang lái xe, một hành khách lớn tuổi đã lớn tiếng gọi để báo cho phụ xe. Em nghĩ hành động của hành khách đó là gì?",
    "options": {
      "A": "Rất bất lịch sự vì làm ồn trên xe.",
      "B": "Hoàn toàn đúng và dũng cảm, giúp ngăn chặn một tai nạn thảm khốc.",
      "C": "Chưa đúng, nên để tài xế ngủ thêm một chút cho đỡ mệt.",
      "D": "Bình thường, không liên quan đến an toàn."
    },
    "answer": "B",
    "explanation": "Đánh giá cao hành vi cảnh báo rủi ro kịp thời để bảo vệ an toàn cho cả tập thể.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_16",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 17,
    "question": "Em chuẩn bị đi dã ngoại bằng xe khách cùng lớp. Từ kiến thức đã học, em sẽ ưu tiên mang theo loại túi xách nào?",
    "options": {
      "A": "Túi rất to và nặng để được nhiều đồ chơi.",
      "B": "Một chiếc balo nhỏ gọn đeo trên vai, hai tay để trống để bám vịn dễ dàng.",
      "C": "Nhiều túi nilong xách tay lỉnh kỉnh.",
      "D": "Vali kéo khổng lồ chiếm nhiều diện tích."
    },
    "answer": "B",
    "explanation": "Vận dụng kiến thức để chuẩn bị hành trang phù hợp, đảm bảo an toàn và thuận tiện khi di chuyển trên xe.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_17",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 18,
    "question": "Tuần trước, em bị ngã xước chân vì bước xuống xe buýt khi xe chưa dừng hẳn. Lần đi xe buýt hôm nay, em tự nhủ với bản thân điều gì?",
    "options": {
      "A": "'Mình phải nhảy xuống nhanh hơn nữa'.",
      "B": "'Tuyệt đối không vội vàng, đợi xe dừng hẳn mới từ từ bước xuống'.",
      "C": "'Sẽ nhờ người khác đẩy mình xuống'.",
      "D": "'Sẽ không đi xe buýt nữa'."
    },
    "answer": "B",
    "explanation": "Phản tư từ sai lầm quá khứ và điều chỉnh nhận thức, hành vi để đảm bảo an toàn cho tương lai.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_18",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 19,
    "question": "Đi tàu điện trên cao lần đầu, em thấy bạn mình định tựa lưng vào cánh cửa tự động. Vận dụng kiến thức an toàn, em sẽ nói gì với bạn?",
    "options": {
      "A": "'Cửa xịn lắm, dựa thoải mái đi'.",
      "B": "'Cửa có thể mở ra bất ngờ khi đến ga, cậu đừng tựa vào cửa kẻo ngã đấy'.",
      "C": "'Cậu tựa vào cửa sẽ làm cửa hỏng'.",
      "D": "'Cậu phải bấm nút cửa mới mở'."
    },
    "answer": "B",
    "explanation": "Vận dụng hiểu biết về cửa tự động để cảnh báo và bảo vệ an toàn cho người xung quanh trong một môi trường mới.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_19",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 20,
    "question": "Biết rằng bác tài xế cần tập trung cao độ, trong chuyến đi tham quan dài, em đề xuất lớp mình nên tổ chức hoạt động nào trên xe?",
    "options": {
      "A": "Bật nhạc sàn thật to và nhảy múa.",
      "B": "Chơi trò đuổi bắt dọc lối đi.",
      "C": "Hát những bài hát nhẹ nhàng hoặc chơi giải câu đố tại chỗ.",
      "D": "Cùng nhau la hét thi xem ai nói to nhất."
    },
    "answer": "C",
    "explanation": "Vận dụng hiểu biết về sự tập trung của lái xe để tổ chức các hoạt động tập thể vui vẻ nhưng vẫn an toàn, trật tự.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "An toàn khi tham gia các phương tiện giao thông công cộng",
    "id": "An_toàn_khi_tham_gia_các_phương_tiện_giao_thông_công_cộng_20",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 1,
    "question": "Thời điểm nào trong ngày ánh nắng mặt trời gắt và chứa nhiều tia cực tím (UV) có hại nhất?",
    "options": {
      "A": "Từ 6 giờ sáng đến 8 giờ sáng.",
      "B": "Từ 10 giờ trưa đến 4 giờ chiều.",
      "C": "Từ 5 giờ chiều đến 7 giờ tối.",
      "D": "Vào ban đêm."
    },
    "answer": "B",
    "explanation": "Khoảng thời gian từ 10h-16h là lúc tia cực tím hoạt động mạnh nhất, có thể gây bỏng rát và tổn thương da.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_1",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 2,
    "question": "Để bảo vệ da khi đi bơi hoặc vui chơi ngoài nắng, vật dụng nào là CẦN THIẾT nhất?",
    "options": {
      "A": "Kem chống nắng.",
      "B": "Một chiếc khăn quàng cổ mùa đông.",
      "C": "Áo mưa.",
      "D": "Kính lúp."
    },
    "answer": "A",
    "explanation": "Kem chống nắng là sản phẩm chuyên dụng giúp bảo vệ da khỏi tác hại của tia UV.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_2",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 3,
    "question": "Ngoài da, bộ phận nào trên cơ thể cũng cần được bảo vệ khỏi ánh nắng mặt trời?",
    "options": {
      "A": "Răng.",
      "B": "Mắt (cần đeo kính râm).",
      "C": "Móng tay.",
      "D": "Lông mày."
    },
    "answer": "B",
    "explanation": "Mắt rất nhạy cảm với ánh sáng mạnh và tia UV, việc đeo kính râm chống tia UV giúp bảo vệ mắt khỏi tổn thương.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_3",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 4,
    "question": "Khi chơi thể thao ngoài trời nắng, cơ thể em sẽ đổ nhiều mồ hôi. Em cần làm gì để cơ thể không bị mệt mỏi?",
    "options": {
      "A": "Ăn nhiều bánh kẹo.",
      "B": "Uống nước thường xuyên để bù nước.",
      "C": "Mặc thật nhiều áo ấm.",
      "D": "Không làm gì cả."
    },
    "answer": "B",
    "explanation": "Đổ mồ hôi làm cơ thể mất nước, uống đủ nước giúp duy trì chức năng cơ thể và tránh say nắng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_4",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 5,
    "question": "Vì sao em nên đội mũ rộng vành thay vì mũ lưỡi trai khi đi dã ngoại trời nắng?",
    "options": {
      "A": "Vì mũ rộng vành đẹp hơn.",
      "B": "Vì mũ rộng vành che chắn được cả mặt, tai và vùng gáy phía sau.",
      "C": "Vì mũ rộng vành đắt tiền hơn.",
      "D": "Vì mũ rộng vành có thể dùng làm quạt."
    },
    "answer": "B",
    "explanation": "Hiểu được cấu tạo và công dụng của mũ rộng vành trong việc bảo vệ toàn diện các vùng da hở trên đầu và cổ.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_5",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 6,
    "question": "Tại sao em cần thoa lại kem chống nắng sau mỗi 2 tiếng vui chơi, đặc biệt là khi đi bơi?",
    "options": {
      "A": "Vì kem chống nắng sẽ bị trôi đi do nước hoặc mồ hôi, làm giảm tác dụng bảo vệ.",
      "B": "Để da trắng hơn.",
      "C": "Vì kem chống nắng có mùi rất thơm.",
      "D": "Để tuýp kem nhanh hết."
    },
    "answer": "A",
    "explanation": "Hiểu nguyên lý hoạt động của kem chống nắng: nó không tồn tại vĩnh viễn trên da mà bị hao hụt qua mồ hôi và nước.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_6",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 7,
    "question": "Hiện tượng 'say nắng' (hoặc sốc nhiệt) xảy ra do nguyên nhân chủ yếu nào?",
    "options": {
      "A": "Do ăn quá nhiều đồ lạnh.",
      "B": "Do ở ngoài nắng gắt quá lâu khiến cơ thể không kịp tỏa nhiệt và mất nước trầm trọng.",
      "C": "Do chạy quá nhanh.",
      "D": "Do mặc áo cộc tay."
    },
    "answer": "B",
    "explanation": "Hiểu cơ chế của say nắng để có ý thức phòng tránh việc phơi nắng liên tục kéo dài.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_7",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 8,
    "question": "Quần áo có màu tối (đen, xanh sẫm) thường hấp thụ nhiệt nhiều hơn quần áo sáng màu. Vì vậy, khi đi chơi nắng, em nên chọn trang phục thế nào?",
    "options": {
      "A": "Quần áo màu đen tuyền.",
      "B": "Quần áo dày bằng len màu đen.",
      "C": "Quần áo sáng màu, mỏng, thấm hút mồ hôi tốt.",
      "D": "Mặc áo mưa."
    },
    "answer": "C",
    "explanation": "Hiểu đặc tính vật lý của màu sắc và chất liệu vải để lựa chọn trang phục giải nhiệt tốt nhất.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_8",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 9,
    "question": "Đang đá bóng lúc 12 giờ trưa, em cảm thấy chóng mặt, khát nước và đau đầu. Em nên quyết định làm gì ngay lúc đó?",
    "options": {
      "A": "Cố gắng đá nốt trận cho xong.",
      "B": "Lập tức ngừng chơi, vào chỗ bóng râm nghỉ ngơi và uống nước từ từ.",
      "C": "Chạy thật nhanh về nhà.",
      "D": "Uống ngay một chai nước đá lạnh buốt."
    },
    "answer": "B",
    "explanation": "Lựa chọn hành động cấp cứu kịp thời cho bản thân khi có dấu hiệu kiệt sức do nhiệt: nghỉ ngơi trong mát và bù nước.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_9",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 10,
    "question": "Bạn rủ em ra công viên thả diều vào lúc 2 giờ chiều giữa mùa hè nắng gắt. Em sẽ trả lời bạn thế nào?",
    "options": {
      "A": "'Tuyệt quá, đi luôn thôi!'.",
      "B": "'Tầm này nắng gắt nguy hiểm lắm, mình đợi sau 4 giờ chiều trời mát hãy đi nhé'.",
      "C": "'Cậu mang cho tớ cái ô, tớ vừa che ô vừa thả diều'.",
      "D": "'Chờ tớ mặc áo len rồi đi'."
    },
    "answer": "B",
    "explanation": "Quyết định từ chối hoạt động ở khung giờ nguy hiểm và đề xuất giải pháp thời gian an toàn hơn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_10",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 11,
    "question": "Khi đi tắm biển, mẹ dặn em thoa kem chống nắng. Em sẽ thoa kem vào lúc nào là hiệu quả nhất?",
    "options": {
      "A": "Thoa ngay sau khi nhảy xuống nước biển.",
      "B": "Chỉ thoa sau khi đã tắm xong để đi về.",
      "C": "Thoa khoảng 15-20 phút TRƯỚC KHI ra ngoài nắng.",
      "D": "Không cần thoa, vì dưới nước rất mát."
    },
    "answer": "C",
    "explanation": "Quyết định thời điểm thoa kem chống nắng đúng cách (cần thời gian để kem thẩm thấu và phát huy tác dụng bảo vệ).",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_11",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 12,
    "question": "Cả nhà đi dã ngoại, em thấy em gái nhỏ đang ngồi chơi xếp hình giữa bãi cỏ nắng chói chang mà không đội mũ. Em sẽ làm gì?",
    "options": {
      "A": "Bỏ mặc em chơi vì em đang vui.",
      "B": "Dẫn em gái vào dưới bóng cây mát và đội mũ cho em.",
      "C": "Ra ngồi chơi cùng em giữa nắng.",
      "D": "Trêu chọc em gái."
    },
    "answer": "B",
    "explanation": "Quyết định can thiệp kịp thời để bảo vệ sức khỏe cho người thân khỏi nguy cơ say nắng.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_12",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 13,
    "question": "Một bạn nam nói: 'Tớ là con trai, da đen một tí cho khỏe, không cần đội mũ hay bôi kem chống nắng đâu!'. Em đánh giá suy nghĩ này như thế nào?",
    "options": {
      "A": "Rất đúng, con trai thì phải da ngăm đen.",
      "B": "Sai lầm, tia UV không phân biệt nam nữ, đều có thể gây cháy nắng và bệnh ung thư da.",
      "C": "Bình thường, tùy sở thích mỗi người.",
      "D": "Đúng, đội mũ sẽ làm hỏng kiểu tóc."
    },
    "answer": "B",
    "explanation": "Đánh giá và bác bỏ quan điểm sai lầm về giới tính trong việc bảo vệ sức khỏe khỏi tác hại của tia cực tím.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_13",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 14,
    "question": "Sau khi đi ngoài nắng nóng về, bạn Hùng lập tức mở tủ lạnh, lấy chai nước đá tu một hơi cạn sạch và đứng vào ngay trước quạt thổi mạnh. Hành vi của Hùng có tốt không?",
    "options": {
      "A": "Rất tốt, giúp hạ nhiệt độ cơ thể nhanh nhất.",
      "B": "Chưa tốt, việc thay đổi nhiệt độ đột ngột dễ gây sốc nhiệt, viêm họng hoặc cảm lạnh.",
      "C": "Bình thường, ai cũng làm thế.",
      "D": "Tốt vì giải tỏa cơn khát."
    },
    "answer": "B",
    "explanation": "Đánh giá được tính chất nguy hiểm của việc làm mát và bù nước đột ngột (sốc nhiệt lạnh) sau khi đi nắng về.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_14",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 15,
    "question": "Trường tổ chức cắm trại. Lều của đội em dựng ngay dưới bóng mát của cây bàng lớn thay vì dựng giữa bãi cỏ trống nắng gắt. Quyết định chọn chỗ dựng lều của đội trưởng là đúng hay sai?",
    "options": {
      "A": "Sai, vì ở bãi cỏ trống chụp ảnh mới sáng.",
      "B": "Đúng, bóng cây sẽ giúp lều mát mẻ, tránh được ánh nắng gắt trực tiếp.",
      "C": "Sai, dưới gốc cây rất nhiều lá rụng.",
      "D": "Bình thường."
    },
    "answer": "B",
    "explanation": "Đánh giá cao hành vi chủ động tìm kiếm và sử dụng không gian mát mẻ để trú ẩn trong các hoạt động ngoài trời.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_15",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 16,
    "question": "Bạn Linh thoa kem chống nắng rất kỹ ở mặt, nhưng lại quên thoa ở vùng cổ, gáy và cánh tay. Nhận xét về cách bảo vệ của Linh?",
    "options": {
      "A": "Cách này hoàn hảo vì chỉ có mặt mới quan trọng.",
      "B": "Chưa đúng, tia UV có thể làm tổn thương bất kỳ vùng da hở nào, nên cần thoa đều cả cổ, gáy và tay chân.",
      "C": "Rất tiết kiệm kem chống nắng.",
      "D": "Linh làm vậy để cổ nhanh đen hơn."
    },
    "answer": "B",
    "explanation": "Đánh giá được sự thiếu sót trong kỹ năng thực hành bảo vệ cơ thể, giúp học sinh nhận thức sự bảo vệ toàn diện.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_16",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 17,
    "question": "Chuẩn bị đi nghỉ mát ở biển vào tuần tới, em sẽ tự giác sắp xếp những đồ vật cá nhân nào vào balo của mình?",
    "options": {
      "A": "Đồ chơi, truyện tranh, bút màu.",
      "B": "Kính bơi, áo khoác dày, khăn len.",
      "C": "Mũ rộng vành, kính râm chống UV, bình nước cá nhân và kem chống nắng.",
      "D": "Ô to, ghế sofa, ti vi."
    },
    "answer": "C",
    "explanation": "Vận dụng kiến thức để tự chuẩn bị bộ dụng cụ an toàn chống nắng đầy đủ và thiết thực cho một chuyến đi.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_17",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 18,
    "question": "Tháng trước em bị cháy nắng rát đỏ hai cánh tay vì mặc áo cộc tay phơi nắng ngoài đồng. Để điều này không lặp lại, bài học phản tư của em là gì?",
    "options": {
      "A": "Lần sau sẽ mặc áo chống nắng dài tay hoặc dùng kem chống nắng kỹ hơn ở tay.",
      "B": "Lần sau sẽ mặc áo cộc tay nhưng chạy nhanh hơn.",
      "C": "Cháy nắng không sao, vài ngày là khỏi.",
      "D": "Sẽ chuyển sang chơi vào ban đêm hoàn toàn."
    },
    "answer": "A",
    "explanation": "Phản tư cá nhân từ một tổn thương vật lý để đề ra biện pháp khắc phục cụ thể bằng áo chống nắng/kem.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_18",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 19,
    "question": "Trong lớp, một bạn bị mệt lả và đổ mồ hôi nhiều sau giờ thể dục dưới nắng. Vận dụng kiến thức an toàn, em sẽ giúp bạn bằng cách nào?",
    "options": {
      "A": "Kêu bạn cố chạy tiếp cho khỏe.",
      "B": "Đưa bạn vào chỗ mát, nới lỏng cổ áo, quạt mát nhẹ nhàng và cho bạn uống nước từng ngụm nhỏ.",
      "C": "Lấy nước đá lạnh hắt vào mặt bạn.",
      "D": "Đi về lớp và bỏ mặc bạn."
    },
    "answer": "B",
    "explanation": "Vận dụng quy trình sơ cứu cơ bản khi gặp người có dấu hiệu kiệt sức do nhiệt để giúp đỡ bạn bè.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_19",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 20,
    "question": "Gia đình em định tổ chức tiệc nướng ngoài trời. Vận dụng hiểu biết về cường độ tia UV, em sẽ khuyên bố mẹ chọn khung giờ nào?",
    "options": {
      "A": "12 giờ trưa cho nắng ấm.",
      "B": "1 giờ chiều để chụp ảnh cho sáng.",
      "C": "Sau 4-5 giờ chiều khi nắng đã dịu, hoặc làm vào buổi tối.",
      "D": "11 giờ trưa."
    },
    "answer": "C",
    "explanation": "Vận dụng kiến thức về giờ cao điểm tia UV vào việc lên kế hoạch sinh hoạt chung cho cả gia đình.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Vui chơi an toàn dưới nắng",
    "id": "Vui_chơi_an_toàn_dưới_nắng_20",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 1,
    "question": "Những đồ vật nào dưới đây được xếp vào nhóm 'đồ vật sắc, nhọn' dễ gây thương tích?",
    "options": {
      "A": "Bóng bay, búp bê, thú nhồi bông.",
      "B": "Dao, kéo, kim khâu, đinh sắt.",
      "C": "Gối bông, chăn ấm, khăn quàng.",
      "D": "Quyển sách, hộp bút, cục tẩy."
    },
    "answer": "B",
    "explanation": "Nhận biết các dụng cụ có lưỡi sắc hoặc đầu nhọn thường gặp trong gia đình (dao, kéo, kim, đinh) là bước đầu tiên để phòng tránh.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_1",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 2,
    "question": "Khi muốn đưa kéo cho người khác, em nên cầm ở phần nào của chiếc kéo?",
    "options": {
      "A": "Cầm ở phần mũi nhọn và chĩa mũi nhọn vào người nhận.",
      "B": "Cầm ở phần lưỡi kéo (ép chặt hai lưỡi lại) và đưa phần tay cầm về phía người nhận.",
      "C": "Cầm ở một bên tay cầm rồi ném cho người nhận.",
      "D": "Không cầm kéo mà nhờ người khác lấy giúp."
    },
    "answer": "B",
    "explanation": "Đây là quy tắc cơ bản khi trao vật sắc nhọn: giữ phần lưỡi nguy hiểm và đưa phần cán an toàn cho người đối diện.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_2",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 3,
    "question": "Sau khi sử dụng xong dao hoặc kéo thủ công, em cần làm gì với chúng?",
    "options": {
      "A": "Vứt bừa bãi trên sàn nhà.",
      "B": "Để lung tung trên giường ngủ.",
      "C": "Cất ngay ngắn vào hộp đựng hoặc giá treo quy định, xa tầm tay em nhỏ.",
      "D": "Giấu vào dưới gầm ghế."
    },
    "answer": "C",
    "explanation": "Biết cách bảo quản đúng chỗ đồ vật sắc nhọn để không gây ra các tai nạn đạp phải hoặc cắt nhầm ngoài ý muốn.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_3",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 4,
    "question": "Khi vô tình làm vỡ một chiếc cốc thủy tinh, em nên làm gì đầu tiên?",
    "options": {
      "A": "Dùng tay không nhặt các mảnh vỡ.",
      "B": "Đứng im, cảnh báo cho người xung quanh không đến gần và gọi người lớn giúp dọn dẹp.",
      "C": "Đá các mảnh vỡ vào một góc.",
      "D": "Bỏ chạy đi chơi."
    },
    "answer": "B",
    "explanation": "Mảnh kính vỡ rất sắc và khó nhìn thấy. Biết gọi người lớn và cảnh báo là cách tự vệ an toàn nhất.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_4",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 5,
    "question": "Tại sao em tuyệt đối không được vừa cầm vật sắc nhọn (như dao, kéo, que xiên) vừa chạy nhảy đùa giỡn?",
    "options": {
      "A": "Vì chạy nhảy sẽ làm đồ vật nhanh hỏng.",
      "B": "Vì nếu vấp ngã, vật nhọn có thể đâm vào mắt, cơ thể em hoặc bạn bè, gây thương tích nghiêm trọng.",
      "C": "Vì đồ vật sẽ bị rơi mất.",
      "D": "Vì sẽ làm bẩn tay."
    },
    "answer": "B",
    "explanation": "Hiểu được mối liên hệ giữa động tác chạy nhảy (dễ mất thăng bằng) và độ sát thương của vật nhọn nếu bị té ngã.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_5",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 6,
    "question": "Vì sao các dụng cụ như dao, kéo trong bếp cần được để trên giá cao hoặc trong ngăn kéo có khóa?",
    "options": {
      "A": "Để dao kéo trông sạch sẽ hơn.",
      "B": "Để tiết kiệm diện tích bếp.",
      "C": "Để trẻ em nhỏ, chưa nhận thức được sự nguy hiểm, không thể lấy và nghịch ngợm.",
      "D": "Để dao kéo nhanh khô."
    },
    "answer": "C",
    "explanation": "Hiểu nguyên lý bảo vệ thụ động: đặt vật nguy hiểm ngoài tầm với là biện pháp an toàn cốt lõi đối với trẻ nhỏ.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_6",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 7,
    "question": "Khi dùng dao rọc giấy, tại sao em chỉ nên đẩy lưỡi dao ra một đoạn thật ngắn vừa đủ dùng?",
    "options": {
      "A": "Vì để dao rọc giấy được sắc hơn.",
      "B": "Vì đẩy lưỡi dao ra quá dài sẽ dễ làm lưỡi gãy văng vào mắt và khó điều khiển, dễ cứa vào tay.",
      "C": "Để tiết kiệm phần lưỡi dao bên trong.",
      "D": "Để dao rọc giấy trông đẹp hơn."
    },
    "answer": "B",
    "explanation": "Hiểu cơ chế hoạt động của dao rọc giấy mỏng, dài rất dễ gãy gập, gây nguy hiểm khôn lường.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_7",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 8,
    "question": "Tại sao em không nên dùng răng để cắn đứt sợi chỉ hoặc mở các nắp hộp bằng kim loại?",
    "options": {
      "A": "Vì sẽ làm sợi chỉ bị ướt.",
      "B": "Vì hộp kim loại có mùi không thơm.",
      "C": "Vì răng em có thể bị mẻ, nướu bị cắt chảy máu, thậm chí bị nhiễm trùng.",
      "D": "Vì em không có đủ sức."
    },
    "answer": "C",
    "explanation": "Hiểu rằng răng và miệng là những bộ phận mềm, rất dễ bị tổn thương bởi ma sát sắc bén từ chỉ và cạnh kim loại.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_8",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 9,
    "question": "Em đang dùng kéo thủ công cắt giấy. Em trai 3 tuổi chạy đến đòi giành lấy chiếc kéo. Em sẽ quyết định làm gì?",
    "options": {
      "A": "Đưa ngay cho em để em không khóc.",
      "B": "Giằng co chiếc kéo với em.",
      "C": "Nhẹ nhàng giấu kéo ra sau lưng, gọi người lớn đến dỗ em và giải thích kéo không phải đồ chơi.",
      "D": "Ném chiếc kéo thật xa."
    },
    "answer": "C",
    "explanation": "Quyết định xử lý thông minh để tránh giằng co gây đứt tay, đồng thời giữ an toàn cho trẻ nhỏ hơn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_9",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 10,
    "question": "Mẹ nhờ em lấy giúp con dao gọt hoa quả trên bàn. Bàn đang hơi tối. Em nên làm gì?",
    "options": {
      "A": "Quờ quạng tay vào bóng tối trên bàn để tìm.",
      "B": "Bật đèn sáng, nhìn rõ vị trí con dao rồi mới cẩn thận cầm phần cán dao.",
      "C": "Bảo mẹ tự ra mà lấy.",
      "D": "Dùng cây gậy đập mạnh lên bàn cho dao rơi xuống."
    },
    "answer": "B",
    "explanation": "Quyết định đảm bảo đủ ánh sáng khi tiếp xúc với vật sắc nhọn để tránh cầm nhầm vào lưỡi dao.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_10",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 11,
    "question": "Em đang gọt bút chì bằng dao gọt, đột nhiên bạn ngồi cạnh gọi to tên em. Em nên làm gì?",
    "options": {
      "A": "Vừa tiếp tục gọt vừa quay mặt sang nói chuyện với bạn.",
      "B": "Dừng tay gọt, đặt dao xuống bàn rồi mới quay sang trả lời bạn.",
      "C": "Giật mình quăng dao đi.",
      "D": "Lấy dao gọt bút chì đùa chỉ vào bạn."
    },
    "answer": "B",
    "explanation": "Quyết định dừng hành động nguy hiểm khi mất tập trung. Sử dụng dao cần sự tập trung 100%.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_11",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 12,
    "question": "Khi đang ăn thịt xiên nướng, em thấy có một bạn ngậm que xiên bằng tre nhọn trong miệng và chạy nhảy. Em sẽ làm gì?",
    "options": {
      "A": "Chạy lại chơi cùng bạn.",
      "B": "Khen bạn ngậm que hay quá.",
      "C": "Khuyên bạn: 'Cậu lấy que ra đi, vừa ngậm vừa chạy ngã một cái là que đâm vào họng nguy hiểm lắm!'.",
      "D": "Tự lấy một que ngậm giống bạn."
    },
    "answer": "C",
    "explanation": "Quyết định can thiệp an toàn dựa trên hiểu biết về nguy cơ đâm xuyên của vật nhọn khi ngã.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_12",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 13,
    "question": "Hành vi dùng dao lam hoặc mảnh kính vỡ để gọt bút chì vì 'như thế mới ngầu' của một số bạn học sinh là đáng khen hay đáng phê phán?",
    "options": {
      "A": "Đáng khen vì các bạn rất sáng tạo.",
      "B": "Đáng khen vì tiết kiệm tiền mua gọt bút chì.",
      "C": "Rất đáng phê phán và cực kỳ nguy hiểm vì dễ làm đứt tay sâu, mất máu nhiều.",
      "D": "Bình thường, không có gì để nói."
    },
    "answer": "C",
    "explanation": "Đánh giá mức độ nghiêm trọng của hành vi sử dụng công cụ không chuyên dụng, không an toàn.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_13",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 14,
    "question": "Một người thợ sau khi dùng xong đinh và ốc vít đã cẩn thận dùng nam châm quét qua khu vực làm việc để thu gom. Em nghĩ hành động này có ý nghĩa gì?",
    "options": {
      "A": "Hành động thừa thãi, tốn thời gian.",
      "B": "Hành động rất an toàn, giúp tránh việc trẻ nhỏ hay người khác dẫm phải đinh nhọn sót lại trên sàn.",
      "C": "Để khoe mình có cục nam châm tốt.",
      "D": "Để bán ve chai."
    },
    "answer": "B",
    "explanation": "Đánh giá cao phương pháp thu dọn triệt để vật liệu kim loại nhọn, bảo vệ an toàn cho môi trường xung quanh.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_14",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 15,
    "question": "Bạn Cúc bị xước tay do quẹt phải cạnh chiếc bàn bằng tôn sắt mỏng đã cũ, bị gỉ và cong vênh. Dù chảy ít máu nhưng bạn vẫn nhờ cô giáo rửa và sát trùng vết thương kỹ. Bạn Cúc làm thế là đúng hay sai?",
    "options": {
      "A": "Sai, vì xước nhẹ thì kệ nó tự khỏi.",
      "B": "Đúng, vì vết xước từ kim loại gỉ sét rất dễ bị nhiễm trùng uốn ván, cần xử lý y tế ngay.",
      "C": "Sai, bạn Cúc quá nhút nhát.",
      "D": "Đúng, nhưng chỉ để được cô giáo quan tâm."
    },
    "answer": "B",
    "explanation": "Đánh giá đúng ý thức sơ cứu y tế, hiểu được nguy cơ nhiễm trùng đặc thù từ vật sắc nhọn gỉ sét.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_15",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 16,
    "question": "Thấy em bé làm vỡ bát ăn cơm bằng sứ, anh trai liền dùng chổi và gầu hót quét sạch mảnh vỡ lớn, sau đó dùng giẻ ướt lau kỹ sàn nhà. Em nhận xét gì về cách xử lý của người anh?",
    "options": {
      "A": "Chưa tốt, vì lau giẻ ướt làm sàn nhà trơn.",
      "B": "Rất tốt, quét mảnh lớn và dùng giẻ ướt sẽ lấy đi được cả những mảnh vụn sứ nhỏ li ti gây xước chân.",
      "C": "Quá mất thời gian.",
      "D": "Chỉ cần dùng tay nhặt là được."
    },
    "answer": "B",
    "explanation": "Đánh giá phương pháp thu dọn vật sắc nhọn khoa học, tỉ mỉ và an toàn tuyệt đối.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_16",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 17,
    "question": "Trong hộp bút của em có compa và bút chì gọt rất nhọn. Từ bài học, em sẽ làm gì để đảm bảo an toàn cho túi sách và bản thân khi cất vào cặp?",
    "options": {
      "A": "Vứt thẳng compa và bút vào đáy cặp không cần hộp.",
      "B": "Cắm đầu nhọn của compa vào cục tẩy và đậy nắp hộp bút cẩn thận.",
      "C": "Mang hộp bút đi ném nhau với bạn.",
      "D": "Bẻ gãy đầu bút chì cho an toàn."
    },
    "answer": "B",
    "explanation": "Vận dụng kiến thức bọc đầu nhọn vào thực tế bảo quản đồ dùng học tập hàng ngày.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_17",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 18,
    "question": "Lần trước em đã vô ý dùng tay ấn mạnh nắp lon nước ngọt bật nắp khiến ngón tay bị xước. Lần tới, em rút ra bài học sẽ mở lon như thế nào?",
    "options": {
      "A": "Nhờ người lớn mở giúp hoặc dùng một chiếc thìa nhỏ để bẩy nắp nhẹ nhàng.",
      "B": "Lấy răng cắn để mở nắp lon.",
      "C": "Đập mạnh lon xuống đất cho bung nắp.",
      "D": "Dùng dao lớn chém mạnh vào nắp lon."
    },
    "answer": "A",
    "explanation": "Phản tư từ tổn thương ngón tay, tìm ra giải pháp an toàn hơn bằng việc sử dụng công cụ hỗ trợ hoặc nhờ trợ giúp.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_18",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 19,
    "question": "Gia đình em mới mua một bộ dao bếp rất sắc. Vận dụng kiến thức, em sẽ đề xuất với mẹ điều gì để đảm bảo an toàn cho em gái 4 tuổi?",
    "options": {
      "A": "Mẹ cứ để bộ dao trên thớt để tiện dùng.",
      "B": "Mẹ hãy treo bộ dao trên giá cao hoặc cất trong ngăn kéo tủ dưới có khóa chốt nhé.",
      "C": "Mẹ vứt bớt vài con dao đi.",
      "D": "Cho em gái tự lấy dao chơi để bé dạn dĩ."
    },
    "answer": "B",
    "explanation": "Vận dụng nguyên tắc an toàn gia đình vào thực tế (cất trên cao hoặc khóa) để phòng tránh rủi ro cho người thân yếu thế.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_19",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 20,
    "question": "Nếu em là trưởng nhóm trang trí lớp học, em sẽ thiết lập một 'quy tắc an toàn' nào khi sử dụng kéo và đinh ghim cho cả nhóm?",
    "options": {
      "A": "Được quyền ném đinh ghim cho nhau để làm nhanh hơn.",
      "B": "Mỗi người giữ một cái kéo và không cần cất đi.",
      "C": "Quy định một hộp đựng đinh ghim chung, dùng xong phải cắm vào mút xốp và luôn cầm cán kéo khi trao tay.",
      "D": "Ghim đinh lên quần áo để giữ cho tiện."
    },
    "answer": "C",
    "explanation": "Vận dụng năng lực lãnh đạo và kiến thức an toàn để thiết lập quy tắc hoạt động chung cho nhóm, giảm thiểu rủi ro tập thể.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
    "id": "Kĩ_năng_phòng_tránh_tai_nạn_thương_tích_do_đồ_vật_sắc_nhọn_20",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 1,
    "question": "Trong gia đình em, khu vực nào thường tiềm ẩn nhiều nguy cơ gây bỏng nhất?",
    "options": {
      "A": "Phòng ngủ.",
      "B": "Phòng bếp (nơi nấu ăn, có bếp ga, phích nước nóng).",
      "C": "Phòng khách.",
      "D": "Ban công."
    },
    "answer": "B",
    "explanation": "Bếp là nơi chứa các nguồn nhiệt trực tiếp (bếp lửa, lò nướng, nước sôi), là môi trường rủi ro cao về bỏng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_1",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 2,
    "question": "Hành động nào dưới đây rất nguy hiểm, có thể làm em bị bỏng nặng?",
    "options": {
      "A": "Uống nước lọc để nguội.",
      "B": "Tự ý kéo dây điện của ấm đun nước siêu tốc đang sôi.",
      "C": "Rửa tay bằng nước vòi lạnh.",
      "D": "Mặc quần áo dài tay."
    },
    "answer": "B",
    "explanation": "Kéo dây điện ấm đun nước dễ làm ấm đổ sập, gây bỏng diện rộng nghiêm trọng bởi nước đang sôi 100 độ.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_2",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 3,
    "question": "Nếu vô tình bị chạm tay vào nồi canh nóng, bước sơ cứu ĐẦU TIÊN và QUAN TRỌNG NHẤT em cần làm là gì?",
    "options": {
      "A": "Bôi ngay kem đánh răng hoặc nước mắm lên vết bỏng.",
      "B": "Ngâm hoặc xả tay dưới vòi nước mát sạch từ 15-20 phút.",
      "C": "Lấy đá lạnh chườm trực tiếp lên vết bỏng.",
      "D": "Quấn chặt vết bỏng bằng vải dày."
    },
    "answer": "B",
    "explanation": "Nước mát giúp hạ nhiệt nhanh, giảm tổn thương mô. Không chườm đá hay bôi hóa chất lạ gây hại thêm cho da.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_3",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 4,
    "question": "Vật dụng nào sau đây được dùng để lót tay khi bưng bê đồ ăn nóng hổi từ bếp ra?",
    "options": {
      "A": "Khăn voan mỏng hoặc giấy mỏng.",
      "B": "Lót tay bằng vải bông dày (găng tay cách nhiệt).",
      "C": "Túi nilon.",
      "D": "Bàn tay trần."
    },
    "answer": "B",
    "explanation": "Găng tay cách nhiệt bằng vải bông dày là vật dụng tiêu chuẩn để ngăn nhiệt truyền từ đồ vật nóng sang da tay.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_4",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 5,
    "question": "Vì sao em không nên chạy nhảy đùa giỡn trong bếp khi mẹ đang nấu ăn?",
    "options": {
      "A": "Vì sẽ làm mẹ bị phân tâm, em có thể va phải xoong nồi chứa thức ăn nóng, nước sôi gây bỏng.",
      "B": "Vì em sẽ làm vỡ bát đĩa.",
      "C": "Vì em sẽ ăn vụng thức ăn của mẹ.",
      "D": "Vì mẹ sẽ bắt em nấu ăn thay."
    },
    "answer": "A",
    "explanation": "Hiểu sự liên hệ giữa sự chuyển động thiếu kiểm soát trong không gian hẹp (bếp) và nguy cơ va đập vào nguồn nhiệt gây bỏng.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_5",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 6,
    "question": "Tại sao việc bôi kem đánh răng lên vết bỏng lại bị các bác sĩ cảnh báo là hành động SAI LẦM?",
    "options": {
      "A": "Vì kem đánh răng rất đắt tiền.",
      "B": "Vì kem đánh răng có chất tẩy rửa, kiềm, làm vết bỏng tổn thương sâu hơn và dễ nhiễm trùng.",
      "C": "Vì mùi kem đánh răng không thơm.",
      "D": "Vì làm kem đánh răng mau hết."
    },
    "answer": "B",
    "explanation": "Hiểu về cơ chế sinh học: bôi hóa chất không chuyên dụng như kem đánh răng gây nóng rát và bít tắc vết thương hở.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_6",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 7,
    "question": "Bỏng bô xe máy (ống xả) thường xảy ra do đâu, và tại sao nó để lại sẹo rất sâu?",
    "options": {
      "A": "Do bô xe máy làm bằng nhựa.",
      "B": "Do vô ý quẹt chân vào bô kim loại đang rất nóng sau khi xe vừa chạy; kim loại truyền nhiệt rất mạnh làm bỏng sâu.",
      "C": "Do bô xe máy xả khói mù mịt.",
      "D": "Do đi xe máy dưới trời mưa."
    },
    "answer": "B",
    "explanation": "Hiểu tính chất dẫn nhiệt của kim loại và nhiệt độ cực cao của bô xe, giải thích được mức độ nghiêm trọng của bỏng bô xe.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_7",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 8,
    "question": "Tại sao em cần kiểm tra nhiệt độ nước trước khi bước vào bồn tắm hoặc vòi hoa sen?",
    "options": {
      "A": "Để xem nước có sạch không.",
      "B": "Để xem đồng hồ nước chạy nhanh hay chậm.",
      "C": "Vì nước từ bình nóng lạnh có thể quá nóng, gây bỏng toàn thân lập tức nếu không thử trước bằng tay/chân nhẹ.",
      "D": "Để biết nước có vị gì."
    },
    "answer": "C",
    "explanation": "Hiểu rủi ro từ thiết bị điện gia dụng (bình nóng lạnh) để hình thành thói quen cẩn trọng kiểm tra nhiệt độ trước khi tắm.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_8",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 9,
    "question": "Một bạn nhỏ sắp bê một tô phở vừa mới múc nóng hổi rưới nước dùng. Em sẽ khuyên bạn ấy thế nào?",
    "options": {
      "A": "'Bê nhanh lên, chạy thật nhanh ra bàn nhé!'.",
      "B": "'Cậu đừng tự bê, để người lớn bê hoặc lấy đĩa lót ở dưới cho an toàn nhé'.",
      "C": "'Vừa bê vừa thổi mạnh vào cho nguội'.",
      "D": "'Bê bằng một tay thôi cho ngầu'."
    },
    "answer": "B",
    "explanation": "Quyết định từ chối hành động rủi ro và tìm kiếm giải pháp thay thế an toàn hơn (nhờ người lớn, dùng đồ lót).",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_9",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 10,
    "question": "Nhà em mới mua một chiếc bàn ủi (bàn là) quần áo. Mẹ vừa ủi xong, vẫn để bàn ủi cắm điện trên mặt bàn. Em nên làm gì?",
    "options": {
      "A": "Tò mò đưa tay sờ thử mặt đáy bàn ủi xem nóng cỡ nào.",
      "B": "Rút phích cắm điện, nhắc mẹ cất lên cao hoặc để gọn vào góc an toàn tránh xa tầm tay em bé.",
      "C": "Lấy áo của em ra tự ủi tiếp.",
      "D": "Hắt cốc nước vào bàn ủi cho nhanh nguội."
    },
    "answer": "B",
    "explanation": "Quyết định xử lý nguồn nhiệt nguy hiểm sau khi sử dụng một cách an toàn và chủ động.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_10",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 11,
    "question": "Em đang khát nước nhưng phích nước để trên bàn rất cao. Trong nhà không có ai, em sẽ làm gì?",
    "options": {
      "A": "Lấy ghế nhựa chồng lên nhau để trèo lên rót.",
      "B": "Cố kiễng chân, bám vào thành phích để kéo xuống.",
      "C": "Không tự ý rót phích nước nóng, tìm nước suối hoặc chờ người lớn về rót giúp.",
      "D": "Dùng cây chọc vào phích cho nó đổ."
    },
    "answer": "C",
    "explanation": "Quyết định kiềm chế nhu cầu cá nhân, ưu tiên tuyệt đối sự an toàn trước những nguy cơ rủi ro cao khi lấy nước sôi trên cao.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_11",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 12,
    "question": "Bạn Hùng bị đổ nước chè nóng vào đùi. Hùng vội vàng định dùng tay lột chiếc quần đang dính sát vào da ra ngay. Em nên khuyên bạn làm gì?",
    "options": {
      "A": "'Cứ lột thật mạnh ra cho nhanh!'.",
      "B": "'Khoan lột! Hãy xả nước mát lạnh vào thẳng chỗ quần đó trước để làm nguội, rồi lấy kéo cắt quần ra, nếu không sẽ bị lột cả da thịt đấy!'.",
      "C": "'Cứ để quần ướt đấy cho khô'.",
      "D": "'Bôi ngay mỡ trăn lên ngoài quần'."
    },
    "answer": "B",
    "explanation": "Quyết định sơ cứu đúng nguyên tắc: không cố bóc tách vải dính vào vết bỏng, mà làm mát qua lớp vải, sau đó mới xử lý.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_12",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 13,
    "question": "Một bạn học sinh hay có thói quen thắp nến trong phòng ngủ và để sát giường, rồi ngủ quên. Em nhận xét hành vi này như thế nào?",
    "options": {
      "A": "Rất lãng mạn và thơm phòng.",
      "B": "Cực kỳ nguy hiểm, ngọn lửa có thể bén vào chăn màn gây hỏa hoạn và bỏng nặng khi đang ngủ.",
      "C": "Bình thường vì nến rất nhỏ.",
      "D": "Hợp lý để tiết kiệm điện."
    },
    "answer": "B",
    "explanation": "Đánh giá mức độ rủi ro nghiêm trọng của việc để nguồn lửa trần gần vật liệu dễ cháy trong khi ngủ.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_13",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 14,
    "question": "Khi đi ăn lẩu ở nhà hàng, bạn Minh nghịch ngợm lấy muôi gõ vào nồi lẩu đang sôi sùng sục. Hành vi của Minh là đúng hay sai, vì sao?",
    "options": {
      "A": "Đúng, để báo cho phục vụ thêm nước.",
      "B": "Sai, vì nồi lẩu sôi rất dễ bắn nước dùng nóng vào mặt mũi, tay chân gây bỏng cho mình và người xung quanh.",
      "C": "Đúng, vì làm không khí vui vẻ hơn.",
      "D": "Bình thường, ai cũng làm thế."
    },
    "answer": "B",
    "explanation": "Đánh giá hành vi thiếu ý thức tại bàn ăn có nguồn nhiệt trực tiếp, nhận thức được rủi ro văng bắn chất lỏng sôi.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_14",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 15,
    "question": "Để nhắc em nhỏ không đụng vào nồi canh nóng, chị gái đã đặt một chiếc khăn ướt quanh nồi và dặn em tránh xa. Cách xử lý của chị gái là đáng khen hay đáng chê?",
    "options": {
      "A": "Đáng chê vì khăn ướt làm bẩn nồi.",
      "B": "Đáng chê vì chỉ cần hét to là được.",
      "C": "Đáng khen vì chị biết bảo vệ em nhỏ, tạo rào cản và cảnh báo rõ ràng từ xa.",
      "D": "Bình thường không có gì đặc biệt."
    },
    "answer": "C",
    "explanation": "Đánh giá cao kỹ năng thiết lập rào cản vật lý và lời nói cảnh báo để bảo vệ trẻ nhỏ khỏi nguồn nhiệt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_15",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 16,
    "question": "Bố vội ra ngoài nên để quên cốc cà phê pha nước sôi ngay mép bàn phòng khách. Bạn Tuấn thấy vậy liền cẩn thận đẩy sâu cốc vào giữa bàn. Hành động của Tuấn nói lên điều gì?",
    "options": {
      "A": "Tuấn muốn uống trộm cà phê của bố.",
      "B": "Tuấn là người cẩn thận, biết dự phòng rủi ro để cốc nước nóng không bị rơi, lật làm bỏng người đi ngang qua.",
      "C": "Tuấn sợ làm hỏng bàn.",
      "D": "Tuấn quá rảnh rỗi."
    },
    "answer": "B",
    "explanation": "Đánh giá đúng ý thức thay đổi vị trí đồ vật chứa nhiệt từ nơi rủi ro cao (mép bàn) vào nơi an toàn (giữa bàn).",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_16",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 17,
    "question": "Áp dụng kiến thức đã học, em sẽ làm thao tác ĐẦU TIÊN nào trước khi bật vòi nước tắm để không bị bỏng?",
    "options": {
      "A": "Cởi quần áo và nhảy ngay vào bồn tắm.",
      "B": "Bật hết cỡ vòi nước nóng đỏ.",
      "C": "Gạt cần vòi nước sang bên lạnh trước, mở nhẹ, rồi từ từ gạt sang bên nóng, dùng mặt trong cổ tay thử nhiệt độ nước.",
      "D": "Nhờ người khác tắm hộ."
    },
    "answer": "C",
    "explanation": "Vận dụng quy trình chuẩn khi sử dụng vòi nước nóng lạnh: mở lạnh trước, pha nóng sau và thử bằng vùng da nhạy cảm.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_17",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 18,
    "question": "Từ vụ một bạn nhỏ bị bỏng vì giật khăn trải bàn làm đổ nồi canh nóng, em rút ra bài học thiết kế bữa ăn an toàn tại nhà là gì?",
    "options": {
      "A": "Không nên dùng khăn trải bàn lòa xòa khi có trẻ nhỏ, hoặc đặt đồ ăn nóng ra xa tầm với của trẻ.",
      "B": "Không nấu canh nóng nữa, chỉ ăn đồ nguội.",
      "C": "Dùng keo dán nồi chặt xuống bàn.",
      "D": "Không cho trẻ nhỏ ngồi ăn cùng bàn."
    },
    "answer": "A",
    "explanation": "Phản tư từ sự cố thực tế để đưa ra giải pháp phòng ngừa trong tổ chức sinh hoạt gia đình (loại bỏ vật dụng trung gian gây đổ vỡ).",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_18",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 19,
    "question": "Em được giao nhiệm vụ chuẩn bị góc uống nước cho buổi dã ngoại lớp. Vận dụng kiến thức, em sẽ sắp xếp bình nước sôi ở đâu?",
    "options": {
      "A": "Đặt ngay cửa ra vào để ai cũng tiện lấy.",
      "B": "Đặt ở giữa bãi cỏ mọi người đang chơi đuổi bắt.",
      "C": "Đặt bình nước sôi ở một góc bàn riêng biệt, vững chắc, dán biển cảnh báo 'NƯỚC NÓNG - CẨN THẬN' và nhờ một người lớn phụ trách rót nước.",
      "D": "Giấu bình nước sôi đi không cho ai uống."
    },
    "answer": "C",
    "explanation": "Vận dụng tổng hợp các biện pháp an toàn không gian, cảnh báo trực quan và kiểm soát tiếp xúc vào việc tổ chức sự kiện tập thể.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_19",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 20,
    "question": "Khi di chuyển trên xe khách, nếu em muốn ăn một bát mì tôm úp nước sôi, dựa trên những gì đã học về nguy cơ bỏng, em sẽ đưa ra lựa chọn nào?",
    "options": {
      "A": "Vẫn úp bát mì đầy nước sôi và bưng bằng hai tay khi xe chạy.",
      "B": "Úp mì bằng nước lạnh rồi đợi mì nở.",
      "C": "Từ chối ăn mì tôm nước sôi trên xe vì xe rung lắc hoặc phanh gấp sẽ làm nước sôi đổ lên người gây bỏng nặng; chuyển sang ăn bánh mì hoặc đồ ăn khô.",
      "D": "Nhờ tài xế cầm bát mì giúp."
    },
    "answer": "C",
    "explanation": "Phản tư kết hợp kiến thức từ các kỹ năng khác (rung lắc trên xe) để triệt tiêu hoàn toàn nguồn rủi ro bỏng nước sôi.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bỏng_nóng_20",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 1,
    "question": "Khi ngửi thấy mùi khét hoặc thấy khói bốc lên trong nhà, việc ĐẦU TIÊN em cần làm là gì?",
    "options": {
      "A": "Tìm xem đồ vật nào đang cháy để tự dập lửa.",
      "B": "Trốn vào tủ quần áo hoặc gầm giường.",
      "C": "Hô hoán thật to 'Cháy! Cháy!' để báo cho người lớn và mọi người xung quanh biết.",
      "D": "Ngồi im và khóc."
    },
    "answer": "C",
    "explanation": "Báo động nhanh chóng cho người xung quanh là hành động sinh tử đầu tiên để nhận được sự trợ giúp thoát hiểm và chữa cháy kịp thời.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_1",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 2,
    "question": "Số điện thoại khẩn cấp của lực lượng Cảnh sát Phòng cháy chữa cháy và Cứu nạn cứu hộ tại Việt Nam là số nào?",
    "options": {
      "A": "113",
      "B": "114",
      "C": "115",
      "D": "111"
    },
    "answer": "B",
    "explanation": "Học sinh cần ghi nhớ thuộc lòng số điện thoại 114 để gọi cứu hỏa khi xảy ra hỏa hoạn.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_2",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 3,
    "question": "Biển báo chữ 'EXIT' hoặc 'LỐI THOÁT' thường có màu xanh lá cây phát sáng có ý nghĩa gì?",
    "options": {
      "A": "Chỉ đường đi đến khu vui chơi.",
      "B": "Chỉ hướng đi ra khỏi tòa nhà an toàn nhất khi có trường hợp khẩn cấp.",
      "C": "Cảnh báo khu vực nguy hiểm, cấm vào.",
      "D": "Chỉ đường đi đến nhà vệ sinh."
    },
    "answer": "B",
    "explanation": "Nhận diện biển báo lối thoát hiểm giúp học sinh biết hướng di chuyển an toàn trong môi trường lạ khi có sự cố.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_3",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 4,
    "question": "Khi di chuyển thoát nạn trong không gian có nhiều khói, tư thế đúng của em là gì?",
    "options": {
      "A": "Đứng thẳng người và chạy thật nhanh.",
      "B": "Đi thong thả như bình thường.",
      "C": "Bò trườn hoặc đi khom người thật thấp, áp sát mặt sàn.",
      "D": "Nhảy lò cò."
    },
    "answer": "C",
    "explanation": "Khói độc nóng nhẹ hơn không khí nên sẽ bốc lên cao; lớp không khí sạch hơn nằm sát mặt sàn. Đi khom/bò giúp tránh ngạt khói.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_4",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 5,
    "question": "Vì sao tuyệt đối KHÔNG ĐƯỢC sử dụng thang máy khi có báo cháy trong tòa nhà cao tầng?",
    "options": {
      "A": "Vì thang máy lúc đó đi rất chậm.",
      "B": "Vì thang máy sẽ rất đông người.",
      "C": "Vì khi có cháy hệ thống điện sẽ bị cắt, thang máy sẽ dừng đột ngột nhốt người bên trong, và khói sẽ luồn vào buồng thang máy gây ngạt.",
      "D": "Vì đi thang bộ sẽ khỏe chân hơn."
    },
    "answer": "C",
    "explanation": "Hiểu rõ cơ chế hoạt động của thang máy và hệ thống điện tòa nhà khi có hỏa hoạn để tránh rơi vào bẫy tử thần.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_5",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 6,
    "question": "Tại sao khi chạy thoát khỏi vùng có khói, em cần dùng khăn tẩm nước che kín mũi và miệng?",
    "options": {
      "A": "Để không bị mùi khét làm bẩn mặt.",
      "B": "Khăn ướt hoạt động như một lớp màng lọc, ngăn khói độc và bụi nóng xâm nhập vào đường thở, giúp em không bị ngạt khói.",
      "C": "Để giấu mặt không ai nhận ra.",
      "D": "Để khăn nhanh khô."
    },
    "answer": "B",
    "explanation": "Hiểu tác dụng vật lý của nước và vải trong việc cản bụi khói độc, bảo vệ hệ hô hấp - nguyên nhân gây tử vong hàng đầu trong đám cháy.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_6",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 7,
    "question": "Trước khi mở một cánh cửa trong lúc đang thoát hiểm, vì sao em phải dùng mu bàn tay chạm nhẹ vào tay nắm cửa hoặc bề mặt cánh cửa?",
    "options": {
      "A": "Để xem cửa có bị bẩn không.",
      "B": "Để kiểm tra xem phía sau cánh cửa có lửa đang cháy lớn hay không. Nếu cửa nóng, tuyệt đối không mở vì lửa sẽ táp vào người.",
      "C": "Để gõ cửa xin phép trước khi vào.",
      "D": "Để làm ấm tay."
    },
    "answer": "B",
    "explanation": "Hiểu nguyên lý truyền nhiệt qua kim loại/vật liệu. Mở cửa nóng sẽ đưa oxy vào làm lửa bùng lên (hiện tượng backdraft) rất nguy hiểm.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_7",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 8,
    "question": "Vì sao các chú lính cứu hỏa thường khuyên em không nên nán lại lấy đồ đạc, đồ chơi khi có cháy?",
    "options": {
      "A": "Vì đồ đạc nặng làm em chạy chậm lại.",
      "B": "Vì đồ chơi đã bị hỏng.",
      "C": "Vì lửa và khói độc lan cực kỳ nhanh, tính mạng con người là quan trọng nhất, mọi sự chậm trễ đều có thể dẫn đến tử vong.",
      "D": "Vì sau này sẽ được mua đồ chơi mới."
    },
    "answer": "C",
    "explanation": "Hiểu được sự phát triển nhanh chóng của đám cháy và ưu tiên giá trị sinh mạng cao hơn mọi tài sản vật chất.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_8",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 9,
    "question": "Em đang ở trong phòng học tầng 2 thì nghe chuông báo cháy. Cửa ra vào có khói đen dày đặc. Em nên quyết định làm gì?",
    "options": {
      "A": "Nhắm mắt chạy xuyên qua đám khói để ra hành lang.",
      "B": "Đóng chặt cửa lại, dùng giẻ ướt chèn kín các khe cửa, mở cửa sổ ra ban công và vẫy tay kêu cứu.",
      "C": "Mở toang cửa lớp để khói bay bớt đi.",
      "D": "Chui vào gầm bàn và khóc."
    },
    "answer": "B",
    "explanation": "Quyết định xử lý an toàn nhất khi lối thoát đã bị bịt kín bởi khói: chặn khói vào phòng và phát tín hiệu cấp cứu.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_9",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 10,
    "question": "Quần áo của em không may bị bắt lửa và đang bùng cháy. Em lập tức chọn làm hành động nào dưới đây?",
    "options": {
      "A": "Chạy thật nhanh để gió thổi tắt lửa.",
      "B": "Đứng im kêu cứu.",
      "C": "Thực hiện quy tắc 'Dừng lại, Nằm xuống, Lăn qua lăn lại' (Stop, Drop, and Roll) nhiều vòng trên sàn nhà.",
      "D": "Nhảy lên cao liên tục."
    },
    "answer": "C",
    "explanation": "Quyết định áp dụng ngay quy tắc dập lửa trên quần áo (lăn để ép thiếu oxy) thay vì chạy (gió sẽ cung cấp oxy làm lửa cháy to hơn).",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_10",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 11,
    "question": "Trên đường chạy thoát khỏi cầu thang bộ, em thấy có một bạn vấp ngã và không đứng lên được. Lửa còn ở khá xa. Em quyết định làm gì?",
    "options": {
      "A": "Bỏ chạy qua người bạn để thoát thân một mình.",
      "B": "Hô to 'Các bạn ơi, giúp một tay!' rồi cùng các bạn hoặc người lớn đỡ bạn dậy, dìu nhau chạy tiếp.",
      "C": "Đứng lại cười chê bạn hậu đậu.",
      "D": "Ngồi xuống cạnh bạn chờ lính cứu hỏa."
    },
    "answer": "B",
    "explanation": "Quyết định tương trợ trong lúc hoạn nạn nếu tình huống cho phép và an toàn, thể hiện tinh thần đoàn kết, không bỏ rơi đồng đội.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_11",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 12,
    "question": "Đám cháy nhỏ phát ra từ một chiếc chảo dầu mỡ trên bếp. Trong nhà có bình chữa cháy xách tay bột khô và một xô nước. Người lớn vắng nhà. Em quyết định làm gì?",
    "options": {
      "A": "Hắt ngay xô nước vào chảo dầu đang cháy.",
      "B": "Lấy bình cứu hỏa dập lửa ngay lập tức.",
      "C": "Không tự chữa cháy, chạy nhanh ra ngoài hô hoán người lớn hoặc gọi 114, vì hắt nước vào chảo dầu cháy sẽ gây nổ bùng.",
      "D": "Đứng quạt cho chảo dầu tắt lửa."
    },
    "answer": "C",
    "explanation": "Quyết định ưu tiên sơ tán và nhờ trợ giúp (đối với học sinh tiểu học) và nhận biết sự nguy hiểm tuyệt đối của việc tạt nước vào đám cháy dầu mỡ.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_12",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 13,
    "question": "Khi chuông báo cháy reo trong trung tâm thương mại, một nhóm người hoảng loạn xô đẩy dẫm đạp lên nhau để tranh ra thang cuốn trước. Em đánh giá hành vi này như thế nào?",
    "options": {
      "A": "Thông minh vì ra nhanh sẽ sống sót.",
      "B": "Sai và cực kỳ nguy hiểm, hoảng loạn xô đẩy sẽ gây chấn thương nghiêm trọng và làm chậm quá trình thoát hiểm của tất cả mọi người.",
      "C": "Bình thường vì lúc đó ai cũng sợ.",
      "D": "Đáng khen vì họ hành động dứt khoát."
    },
    "answer": "B",
    "explanation": "Đánh giá được hậu quả thảm khốc của hiệu ứng đám đông hoảng loạn, nhấn mạnh tầm quan trọng của việc giữ bình tĩnh.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_13",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 14,
    "question": "Thấy bình cứu hỏa treo ngoài hành lang chung cư, một nhóm bạn nam đem ra bấm xịt thử để chơi trò 'phun tuyết'. Hành động của các bạn là đúng hay sai?",
    "options": {
      "A": "Đúng, vì để kiểm tra xem bình có hoạt động không.",
      "B": "Sai, bình chữa cháy là thiết bị an toàn sinh tử, tự ý nghịch làm hết áp suất, khi có cháy thật sẽ không dập lửa được.",
      "C": "Đúng, trò chơi rất sáng tạo.",
      "D": "Bình thường."
    },
    "answer": "B",
    "explanation": "Đánh giá tính chất phá hoại trang thiết bị an toàn PCCC, gây nguy hiểm gián tiếp cho toàn bộ khu dân cư.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_14",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 15,
    "question": "Khi vừa thoát ra khỏi ngôi nhà đang cháy an toàn, bạn An bỗng nhớ ra mình để quên chú cún cưng trong phòng ngủ, bèn quay ngược chạy vào lại đám cháy để cứu cún. Em nhận xét thế nào về hành động này?",
    "options": {
      "A": "Rất dũng cảm và đáng tuyên dương vì An yêu động vật.",
      "B": "Hành động cực kỳ liều lĩnh và sai lầm. An không có đồ bảo hộ, quay lại sẽ làm nguy hiểm tính mạng bản thân. Nên báo cho lính cứu hỏa nhờ giúp.",
      "C": "Chưa tốt vì An nên gọi thêm người vào cùng.",
      "D": "Bình thường."
    },
    "answer": "B",
    "explanation": "Đánh giá đúng sai lầm kinh điển: tuyệt đối không được phép quay lại không gian đang cháy dưới bất kỳ lý do nào (tiền bạc, thú cưng).",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_15",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 16,
    "question": "Chị Lan khi gọi 114 đã nói: 'Alô 114 ạ? Có cháy ở số 12 đường Trần Phú, phường X, quận Y, nhà 3 tầng, chưa rõ có người bên trong không'. Cách gọi điện báo cháy của chị Lan đã tốt chưa?",
    "options": {
      "A": "Chưa tốt vì chị Lan không đọc họ tên mình.",
      "B": "Chưa tốt vì chị Lan nói quá ngắn gọn.",
      "C": "Rất xuất sắc, ngắn gọn nhưng cung cấp đầy đủ thông tin sống còn: địa chỉ chính xác, quy mô nhà và tình trạng nạn nhân.",
      "D": "Chưa tốt, chị nên mắng 114 đến nhanh lên."
    },
    "answer": "C",
    "explanation": "Đánh giá cao kỹ năng thông báo thông tin cấp cứu chuẩn xác, rõ ràng, giúp lực lượng chuyên nghiệp điều động lực lượng phù hợp.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_16",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 17,
    "question": "Dựa trên nguyên lý khói bốc lên cao, nếu nhà em phải đi sơ tán qua một hành lang ngập khói, em sẽ chuẩn bị đồ vật gì từ phòng mình để mang theo trước khi chạy ra?",
    "options": {
      "A": "Balo đựng sách vở và máy tính bảng.",
      "B": "Một chiếc chăn bông thật to trùm lên đầu.",
      "C": "Một chiếc khăn mặt nhỏ hoặc mảnh vải cotton nhúng đẫm nước để che kín mũi, miệng.",
      "D": "Một chiếc quạt giấy để quạt khói bay đi."
    },
    "answer": "C",
    "explanation": "Vận dụng kiến thức về cản trở khói độc để tạo ra công cụ bảo hộ hô hấp tự chế từ vật dụng có sẵn.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_17",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 18,
    "question": "Gia đình em vừa chuyển đến một căn hộ chung cư mới ở tầng 15. Áp dụng kỹ năng phòng ngừa rủi ro, việc quan trọng đầu tiên em đề nghị cả nhà cùng làm là gì?",
    "options": {
      "A": "Tổ chức tiệc tân gia mời bạn bè.",
      "B": "Cùng nhau đi bộ tìm hiểu sơ đồ thoát hiểm, vị trí cầu thang bộ và bình chữa cháy ở hành lang tầng nhà mình.",
      "C": "Trang trí đèn nháy quanh cửa sổ.",
      "D": "Khóa chặt tất cả các cửa ban công không cho ai ra."
    },
    "answer": "B",
    "explanation": "Vận dụng ý thức phòng bị vào môi trường sống mới, xây dựng phương án thoát hiểm gia đình.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_18",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 19,
    "question": "Qua buổi diễn tập PCCC ở trường, em nhận ra mình mất quá nhiều thời gian để tìm khăn tay che mũi. Bài học rút ra cho cuộc sống của em là gì?",
    "options": {
      "A": "Diễn tập thôi, có cháy thật tính sau.",
      "B": "Lần sau không cần lấy khăn tay nữa, cứ nhịn thở mà chạy.",
      "C": "Sắp xếp một chiếc khăn và chai nước nhỏ ở ngay gần cửa ra vào phòng ngủ hoặc cạnh giường, trong túi áo khoác để luôn sẵn sàng.",
      "D": "Đề nghị trường không diễn tập nữa."
    },
    "answer": "C",
    "explanation": "Phản tư từ khuyết điểm trong diễn tập thực hành, đề xuất hành động cải tiến cụ thể trong sắp xếp đồ đạc để tăng tốc độ phản ứng.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_19",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 20,
    "question": "Tết đến, bố nhờ em dọn dẹp ban công. Em thấy một đống hộp giấy carton cũ vứt gần cục nóng điều hòa. Từ kiến thức PCCC, em sẽ xử lý đống giấy đó thế nào?",
    "options": {
      "A": "Vứt thêm rác vào đống giấy đó cho gọn.",
      "B": "Xin bố mang hộp carton đi vứt bỏ hoặc bán ve chai, vì giấy dễ cháy để gần cục điện tỏa nhiệt rất dễ gây hỏa hoạn.",
      "C": "Đốt đống giấy carton ngay tại ban công cho nhanh sạch.",
      "D": "Giấu đống giấy đi chỗ khác trên ban công."
    },
    "answer": "B",
    "explanation": "Vận dụng hiểu biết về vật liệu dễ cháy (chất đốt) và nguồn nhiệt để triệt tiêu nguy cơ cháy nổ trong chính ngôi nhà mình.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
    "id": "Kĩ_năng_phòng_tránh_và_thoát_hiểm_khi_có_hoả_hoạn_20",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 1,
    "question": "Vật liệu nào sau đây DẪN ĐIỆN rất tốt, nếu cầm vào khi sửa điện sẽ dễ bị giật?",
    "options": {
      "A": "Nhựa, cao su.",
      "B": "Sứ, thủy tinh.",
      "C": "Gỗ khô.",
      "D": "Kim loại (sắt, đồng, nhôm) và nước mặn."
    },
    "answer": "D",
    "explanation": "Kim loại và nước là những chất dẫn truyền dòng điện xuất sắc; biết điều này để không chạm vật dẫn điện vào ổ cắm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_1",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 2,
    "question": "Em tuyệt đối KHÔNG được làm hành động nào với ổ cắm điện trong nhà?",
    "options": {
      "A": "Dùng bút thử điện có vỏ nhựa để kiểm tra theo hướng dẫn của người lớn.",
      "B": "Dùng que sắt, bút bi sắt hoặc ngón tay chọc vào các lỗ của ổ cắm.",
      "C": "Nhắc em nhỏ tránh xa ổ cắm.",
      "D": "Báo cho bố mẹ khi thấy ổ cắm bị vỡ vỏ nhựa."
    },
    "answer": "B",
    "explanation": "Chọc vật thể bằng kim loại hoặc ngón tay (có mồ hôi/nước) vào ổ cắm sẽ dẫn điện thẳng vào cơ thể, gây tử vong.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_2",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 3,
    "question": "Trước khi rút hoặc cắm phích điện, tay của em phải ở trong tình trạng như thế nào?",
    "options": {
      "A": "Tay đang ướt sũng nước.",
      "B": "Tay có dính xà phòng trơn trượt.",
      "C": "Tay phải hoàn toàn khô ráo.",
      "D": "Tay đang cầm đồ chơi kim loại."
    },
    "answer": "C",
    "explanation": "Nước lã là chất dẫn điện. Tay ướt chạm vào vỏ phích cắm (đôi khi bị hở hoặc rò điện) sẽ cực kỳ dễ bị giật.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_3",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 4,
    "question": "Khi thấy một đường dây điện đứt rơi lủng lẳng ngoài đường, em cần làm gì?",
    "options": {
      "A": "Lại gần nhặt dây điện lên xem.",
      "B": "Tránh xa khu vực đó ít nhất 10 mét, cảnh báo mọi người xung quanh và báo cho người lớn.",
      "C": "Dùng cành cây chọc vào dây điện.",
      "D": "Chạy qua lại dưới đoạn dây điện."
    },
    "answer": "B",
    "explanation": "Dây điện đứt rớt xuống đất có thể tạo ra 'điện áp bước' làm giật người đứng gần. Cần tránh xa và cảnh báo.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_4",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 5,
    "question": "Vì sao em không được thả diều gần đường dây điện cao thế?",
    "options": {
      "A": "Vì diều sẽ vướng vào dây điện làm đứt dây diều của em.",
      "B": "Vì dây điện cao thế có lực hút tĩnh điện, dây diều (đặc biệt khi ẩm) vướng vào sẽ truyền điện cao áp xuống người thả, gây cháy sém và tử vong lập tức.",
      "C": "Vì dây điện làm xấu cảnh quan diều.",
      "D": "Vì sẽ làm chim chóc sợ bay đi."
    },
    "answer": "B",
    "explanation": "Hiểu bản chất chết người của điện cao áp (có thể phóng điện không cần chạm trực tiếp qua vật dẫn như dây diều ẩm).",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_5",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 6,
    "question": "Tại sao rút phích cắm điện lại KHÔNG NÊN nắm vào phần dây điện để giật mạnh?",
    "options": {
      "A": "Vì như vậy dây điện sẽ bị bẩn.",
      "B": "Vì kéo mạnh dây sẽ làm đứt ngầm lõi đồng bên trong, hoặc làm tuột phích cắm gây hở mạch, chạm chập điện.",
      "C": "Vì giật dây không tiết kiệm điện.",
      "D": "Vì làm phích cắm đẹp hơn."
    },
    "answer": "B",
    "explanation": "Hiểu cấu tạo của dây điện (vỏ bọc, lõi đồng) và cơ chế hỏng hóc gây rò rỉ điện do lực tác động sai vị trí.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_6",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 7,
    "question": "Trời đang mưa to sấm chớp, tại sao bố mẹ nhắc em phải rút ăng-ten tivi và phích cắm các thiết bị điện lớn?",
    "options": {
      "A": "Để tiết kiệm tiền điện trong lúc mưa.",
      "B": "Để giảm bớt tiếng ồn trong nhà.",
      "C": "Vì sét có thể đánh trúng đường dây điện hoặc ăng-ten ngoài trời, truyền dòng điện khổng lồ vào nhà làm cháy nổ thiết bị và giật người.",
      "D": "Để dọn dẹp nhà cửa cho gọn."
    },
    "answer": "C",
    "explanation": "Hiểu hiện tượng sét lan truyền qua hệ thống dây điện hở ngoài trời, dẫn đến cháy nổ và nguy hiểm tính mạng.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_7",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 8,
    "question": "Vì sao ổ cắm điện thường được lắp cao trên tường hoặc được che bằng nút nhựa an toàn?",
    "options": {
      "A": "Để trang trí bức tường.",
      "B": "Để ngăn nước tràn vào khi lau nhà và để ngoài tầm với của trẻ nhỏ, tránh việc trẻ tò mò thọc vật lạ vào lỗ cắm.",
      "C": "Để ổ cắm không bị bám bụi.",
      "D": "Để treo đồ vật lên dễ hơn."
    },
    "answer": "B",
    "explanation": "Hiểu mục đích thiết kế an toàn của các thiết bị điện trong không gian sinh hoạt, phục vụ bảo vệ nhóm yếu thế.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_8",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 9,
    "question": "Em đang tắm nước ấm bằng bình nóng lạnh, bỗng thấy bóng đèn nhà tắm nhấp nháy liên tục và nghe tiếng xẹt xẹt ở bình nóng lạnh. Quyết định của em là gì?",
    "options": {
      "A": "Cứ tiếp tục tắm cho xong vì nước vẫn ấm.",
      "B": "Chỉnh nhiệt độ bình lên cao hơn.",
      "C": "Lập tức bước ra khỏi nước, không chạm tay ướt vào bình, quấn khăn chạy ra ngoài và báo cho bố mẹ cúp cầu dao điện ngay.",
      "D": "Tạt nước thẳng vào bình nóng lạnh."
    },
    "answer": "C",
    "explanation": "Quyết định thoát ly ngay khỏi môi trường rủi ro chập rò điện khi có dấu hiệu bất thường, ưu tiên bảo toàn mạng sống.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_9",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 10,
    "question": "Điện thoại của em đang cắm sạc thì bạn rủ gọi video trò chuyện. Em sẽ chọn phương án nào?",
    "options": {
      "A": "Rút sạc ra khỏi ổ cắm rồi mới gọi điện thoại cho bạn.",
      "B": "Vừa cắm sạc vừa ôm điện thoại gọi video hàng giờ đồng hồ.",
      "C": "Mang cả cục sạc vào phòng tắm để vừa sạc vừa gọi.",
      "D": "Ngậm đầu dây sạc vào miệng."
    },
    "answer": "A",
    "explanation": "Quyết định xử lý đúng đắn để phòng tránh rủi ro điện thoại chập cháy, nổ pin hoặc rò rỉ điện khi vừa sạc vừa dùng.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_10",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 11,
    "question": "Em thấy một bạn nhỏ đang cắm chung 5 phích cắm điện của bàn là, nồi cơm, quạt máy, tivi vào cùng một ổ cắm nối dài bé xíu. Em sẽ nói gì?",
    "options": {
      "A": "'Ổ cắm này xịn đấy, cho tớ cắm ké sạc điện thoại nữa nhé'.",
      "B": "'Cậu rút bớt ra đi, cắm chung quá nhiều thiết bị sinh nhiệt vào một ổ cắm nhỏ sẽ bị quá tải, gây chập cháy đấy!'.",
      "C": "'Cắm như thế sẽ làm quạt quay nhanh hơn'.",
      "D": "'Cậu giấu ổ cắm này vào góc kẹt cho gọn đi'."
    },
    "answer": "B",
    "explanation": "Quyết định can thiệp dứt khoát ngăn chặn hiện tượng quá tải điện - một trong những nguyên nhân cháy nổ hàng đầu.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_11",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 12,
    "question": "Trời mưa ngập đường. Em phải lội nước đi học về. Thấy phía trước có một cột điện chiếu sáng ngập trong vũng nước sâu, em nên đi thế nào?",
    "options": {
      "A": "Lội ngay qua vũng nước đó cho mát.",
      "B": "Bám tay vào cột điện để lội nước khỏi ngã.",
      "C": "Đi đường vòng hoặc bước lên vỉa hè khô ráo cách thật xa cột điện đó, đề phòng cột rò điện xuống nước.",
      "D": "Chạy thật nhanh qua vũng nước."
    },
    "answer": "C",
    "explanation": "Quyết định phòng tránh 'điện áp bước' và rò điện dưới nước mặn/bẩn; tự giác chọn lộ trình vòng để đảm bảo an toàn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_12",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 13,
    "question": "Thấy em mình bị giật điện do đụng vào quạt hỏng, anh trai lập tức chạy lại lao vào ôm kéo em ra bằng tay không. Hành động của người anh là đúng hay sai?",
    "options": {
      "A": "Rất đúng vì thể hiện tình yêu thương anh em.",
      "B": "Sai, lao vào ôm sẽ bị dòng điện truyền sang và giật chết cả hai. Anh nên ngắt cầu dao hoặc dùng gậy gỗ khô hất dây điện ra.",
      "C": "Đúng, vì anh trai lớn hơn nên không bị giật.",
      "D": "Sai, anh nên bỏ mặc em chạy đi gọi người."
    },
    "answer": "B",
    "explanation": "Đánh giá sai lầm chí mạng trong cứu hộ điện giật: tuyệt đối không tiếp xúc trực tiếp da thịt với nạn nhân khi nguồn điện chưa ngắt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_13",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 14,
    "question": "Một bạn học sinh dùng cuộn băng dính trong suốt (băng dính gói hàng) quấn quanh sợi dây sạc bị hở lõi đồng để dùng tạm. Việc làm này đánh giá mức độ an toàn thế nào?",
    "options": {
      "A": "Rất an toàn và tiết kiệm.",
      "B": "Thông minh vì băng dính trong sẽ không bị lộ chỗ hỏng.",
      "C": "Không an toàn, băng dính gói hàng mỏng, không cách điện tiêu chuẩn, nhiệt độ cao sẽ làm chảy băng dính và vẫn gây rò điện.",
      "D": "Chưa tốt vì nên dùng hồ dán giấy."
    },
    "answer": "C",
    "explanation": "Đánh giá sự nguy hiểm của việc dùng vật liệu thay thế không đúng tiêu chuẩn cách điện, dễ dẫn đến cháy chập bất ngờ.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_14",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 15,
    "question": "Cô giáo yêu cầu bạn Cường ngắt điện máy chiếu sau giờ học. Cường đứng thẳng lưng, một tay túm phần phích cắm bằng nhựa khô ráo và rút dứt khoát khỏi ổ. Cách rút phích cắm của Cường đáng nhận xét thế nào?",
    "options": {
      "A": "Chuẩn mực an toàn, tay khô và nắm đúng vị trí cách điện trên phích cắm, không kéo dây.",
      "B": "Quá mạnh tay, nên rút rề rà.",
      "C": "Sai, nên cầm vào dây mà giật ra.",
      "D": "Không cần thiết, cứ để điện máy chiếu suốt ngày."
    },
    "answer": "A",
    "explanation": "Đánh giá kỹ năng thực hành chuẩn xác thao tác rút điện an toàn hàng ngày.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_15",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 16,
    "question": "Mẹ để chiếc máy sấy tóc cắm điện ngay trên nắp bồn rửa mặt đầy nước. Bạn Thuý thấy vậy liền rút điện và cuộn dây cất máy sấy vào ngăn kéo tủ khô ráo. Hành động của Thuý thể hiện điều gì?",
    "options": {
      "A": "Thuý thích dọn dẹp nhà cửa.",
      "B": "Thuý rất hiểu biết, ngăn chặn rủi ro nguy hiểm chết người nếu máy sấy rơi xuống nước đang có người dùng.",
      "C": "Thuý không thích mẹ sấy tóc.",
      "D": "Hành động thừa thãi."
    },
    "answer": "B",
    "explanation": "Đánh giá cao ý thức loại bỏ nguy cơ điện kết hợp với môi trường nước, bảo vệ an toàn cho cả gia đình.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_16",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 17,
    "question": "Từ vụ hỏa hoạn do sạc dự phòng, để sạc pin máy tính bảng an toàn qua đêm, em sẽ tự đặt ra quy tắc gì cho bản thân?",
    "options": {
      "A": "Sạc ngay trên nệm giường, lấy gối đè lên cho gọn.",
      "B": "Sạc ở trên bàn học khô ráo, thoáng mát, không có giấy tờ bắt lửa xung quanh, hoặc rút sạc trước khi đi ngủ.",
      "C": "Sạc trong ngăn kéo tủ đóng kín.",
      "D": "Vừa cắm sạc vừa dùng mền trùm kín mít."
    },
    "answer": "B",
    "explanation": "Vận dụng kiến thức tản nhiệt và cách ly vật liệu dễ cháy để thiết lập quy tắc sạc thiết bị điện tử cá nhân an toàn.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_17",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 18,
    "question": "Nhà em mới mua một chiếc tủ lạnh. Ứng dụng kỹ năng điện an toàn, em sẽ gợi ý bố dặn thợ điện lắp đặt thêm thiết bị bảo vệ gì riêng cho tủ lạnh?",
    "options": {
      "A": "Lắp một cái ổ cắm có dây dài lằng nhằng.",
      "B": "Lắp cầu dao chống giật (Aptomat/ELCB) và dây tiếp địa (nối đất) để xả dòng rò điện, chống giật khi sờ vỏ kim loại tủ.",
      "C": "Bôi thật nhiều dầu mỡ vào ổ cắm.",
      "D": "Không cần thiết bị gì thêm."
    },
    "answer": "B",
    "explanation": "Vận dụng kiến thức an toàn điện nâng cao (dây nối đất, thiết bị ngắt tự động) để cải thiện độ an toàn cho các thiết bị vỏ kim loại.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_18",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 19,
    "question": "Lần trước em đã vô tình đổ nước ra bàn sát ổ cắm điện. Rút kinh nghiệm, mỗi khi mang bình nước tới bàn học, em sẽ hành động như thế nào?",
    "options": {
      "A": "Vẫn để cạnh ổ cắm nhưng lau nước ngay khi đổ.",
      "B": "Để bình nước thật xa các thiết bị điện và ổ cắm điện, luôn vặn chặt nắp bình.",
      "C": "Bọc nilon ổ điện rồi cứ đổ nước vô tư.",
      "D": "Không mang nước vào phòng học nữa."
    },
    "answer": "B",
    "explanation": "Phản tư từ sự cố nguy hiểm tiềm tàng, rút ra bài học quy hoạch vị trí vật chứa chất lỏng và đồ điện cách ly nhau.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_19",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 20,
    "question": "Trong trường học, em được phân công bật/tắt quạt. Vận dụng kiến thức an toàn, em sẽ kiểm tra điều gì TRƯỚC và TRONG quá trình thao tác với bảng điện lớp?",
    "options": {
      "A": "Bật/tắt thật mạnh để ra oai với bạn bè.",
      "B": "Lau tay thật khô trước khi bật; chỉ ấn nhẹ nhàng phần nhựa; nếu thấy công tắc nứt vỏ hay xẹt tia lửa điện thì dừng ngay và báo thầy cô.",
      "C": "Dùng thước kẻ nhôm chọc vào công tắc để bật từ xa.",
      "D": "Nhắm mắt để bật cho đỡ sợ."
    },
    "answer": "B",
    "explanation": "Vận dụng chuỗi kiến thức (tay khô, cách ly nhựa, quan sát rủi ro rò điện) vào công việc thực tế, đảm bảo an toàn thao tác điện học đường.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị điện giật",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_điện_giật_20",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 1,
    "question": "Đâu là nơi an toàn để bơi lội?",
    "options": {
      "A": "Sông có dòng chảy xiết",
      "B": "Hồ bơi có cứu hộ",
      "C": "Ao làng vắng vẻ",
      "D": "Biển lúc có bão"
    },
    "answer": "B",
    "explanation": "Hồ bơi có nhân viên cứu hộ là nơi an toàn nhất.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_1",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 2,
    "question": "Vật dụng nào giúp nổi trên mặt nước?",
    "options": {
      "A": "Cục gạch",
      "B": "Áo phao",
      "C": "Balo nặng",
      "D": "Giày thể thao"
    },
    "answer": "B",
    "explanation": "Áo phao được thiết kế để giữ cơ thể nổi.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_2",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 3,
    "question": "Màu cờ nào ở bãi biển báo hiệu KHÔNG ĐƯỢC tắm?",
    "options": {
      "A": "Cờ xanh",
      "B": "Cờ vàng",
      "C": "Cờ đỏ",
      "D": "Cờ trắng"
    },
    "answer": "C",
    "explanation": "Cờ đỏ là biển báo nguy hiểm cấm tắm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_3",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 4,
    "question": "Số điện thoại khẩn cấp gọi cứu nạn ở Việt Nam là?",
    "options": {
      "A": "112",
      "B": "113",
      "C": "114",
      "D": "115"
    },
    "answer": "C",
    "explanation": "114 là số cứu nạn cứu hộ.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_4",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 5,
    "question": "Tại sao phải khởi động trước khi xuống nước?",
    "options": {
      "A": "Để bơi nhanh hơn",
      "B": "Tránh bị chuột rút (vọp bẻ)",
      "C": "Để nước không vào tai",
      "D": "Để được khen"
    },
    "answer": "B",
    "explanation": "Khởi động giúp làm nóng cơ bắp, tránh co rút.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_5",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 6,
    "question": "Tại sao không nên bơi khi vừa ăn no?",
    "options": {
      "A": "Vì sẽ bị chìm",
      "B": "Dễ gây đau dạ dày và khó thở",
      "C": "Làm bẩn nước",
      "D": "Không ai bơi lúc no"
    },
    "answer": "B",
    "explanation": "Bơi lúc no làm tăng áp lực dạ dày, gây mệt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_6",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 7,
    "question": "Hành động nào gây nguy hiểm khi ở hồ bơi?",
    "options": {
      "A": "Chạy nhảy đùa giỡn trên bờ",
      "B": "Mặc đồ bơi",
      "C": "Tắm tráng trước khi bơi",
      "D": "Khởi động"
    },
    "answer": "A",
    "explanation": "Sàn hồ bơi trơn trợt dễ gây té ngã.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_7",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 8,
    "question": "Biển báo 'Khu vực nước sâu' có ý nghĩa gì?",
    "options": {
      "A": "Nước ở đây rất trong",
      "B": "Dành cho người không biết bơi",
      "C": "Chỉ người bơi giỏi mới được vào",
      "D": "Nước sâu nguy hiểm"
    },
    "answer": "D",
    "explanation": "Cảnh báo độ sâu nguy hiểm cho người bơi yếu.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_8",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 9,
    "question": "Thấy bạn bị ngã xuống ao, em nên làm gì ĐẦU TIÊN?",
    "options": {
      "A": "Nhảy xuống cứu bạn ngay",
      "B": "Hét to kêu cứu người lớn",
      "C": "Chạy về nhà trốn",
      "D": "Khóc lóc"
    },
    "answer": "B",
    "explanation": "Trẻ em không đủ sức cứu người, cần gọi người lớn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_9",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 10,
    "question": "Đang bơi thì thấy mệt, em sẽ làm gì?",
    "options": {
      "A": "Cố bơi tiếp",
      "B": "Bơi nhanh hơn",
      "C": "Bơi vào bờ hoặc gọi cứu hộ",
      "D": "Lặn xuống đáy"
    },
    "answer": "C",
    "explanation": "Khi mệt cần vào bờ nghỉ ngơi ngay.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_10",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 11,
    "question": "Bạn rủ em ra sông tắm vào buổi trưa vắng, em chọn cách nào?",
    "options": {
      "A": "Đồng ý ngay",
      "B": "Rủ thêm người khác",
      "C": "Từ chối và khuyên bạn không đi",
      "D": "Chỉ ra xem bạn tắm"
    },
    "answer": "C",
    "explanation": "Tắm sông vắng rất nguy hiểm, cần từ chối.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_11",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 12,
    "question": "Em nhặt được đồ chơi rơi xuống hồ nước, em làm gì?",
    "options": {
      "A": "Cố với lấy",
      "B": "Dùng cây ngắn khều",
      "C": "Báo cho người lớn hoặc cứu hộ",
      "D": "Lội xuống lấy"
    },
    "answer": "C",
    "explanation": "Tránh tự ý với đồ gần mép nước dễ té ngã.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_12",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 13,
    "question": "Nam hay giả vờ kêu cứu khi đi bơi để trêu bạn. Hành vi này:",
    "options": {
      "A": "Rất vui nhộn",
      "B": "Giúp Nam bơi giỏi hơn",
      "C": "Nguy hiểm, cứu hộ sẽ không tin khi gặp nạn thật",
      "D": "Bình thường"
    },
    "answer": "C",
    "explanation": "Đùa giỡn kêu cứu làm mất lòng tin của cứu hộ.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_13",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 14,
    "question": "Lan luôn mặc áo phao khi đi ghe thuyền dù biết bơi. Em thấy Lan:",
    "options": {
      "A": "Nhát gan",
      "B": "Thực hiện đúng quy tắc an toàn",
      "C": "Không cần thiết",
      "D": "Tốn thời gian"
    },
    "answer": "B",
    "explanation": "Mặc áo phao khi đi phương tiện thủy là bắt buộc.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_14",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 15,
    "question": "Một nhóm bạn thi xem ai nín thở dưới nước lâu nhất. Hành vi này:",
    "options": {
      "A": "Giúp tăng sức khỏe",
      "B": "Rất dũng cảm",
      "C": "Nguy hiểm, dễ gây ngạt nước",
      "D": "Nên khuyến khích"
    },
    "answer": "C",
    "explanation": "Nín thở quá lâu dưới nước có thể gây ngất xỉu.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_15",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 16,
    "question": "Tuấn xô bạn xuống nước để đùa. Em đánh giá hành vi của Tuấn?",
    "options": {
      "A": "Đùa vui",
      "B": "Thân thiện",
      "C": "Rất nguy hiểm, có thể làm bạn sặc nước",
      "D": "Sáng tạo"
    },
    "answer": "C",
    "explanation": "Xô đẩy ở hồ bơi có thể gây chấn thương và đuối nước.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_16",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 17,
    "question": "Nếu gia đình em đi du lịch biển, em sẽ chuẩn bị gì để an toàn?",
    "options": {
      "A": "Chỉ mang đồ ăn",
      "B": "Mang phao bơi, áo phao và kem chống nắng",
      "C": "Mang sách vở",
      "D": "Chỉ mang điện thoại"
    },
    "answer": "B",
    "explanation": "Chuẩn bị đồ an toàn là cần thiết khi đi biển.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_17",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 18,
    "question": "Sau khóa học bơi, em rút ra bài học gì quan trọng nhất?",
    "options": {
      "A": "Có thể bơi ở bất cứ đâu",
      "B": "Luôn tuân thủ quy tắc an toàn nước",
      "C": "Bơi để thi đấu",
      "D": "Không cần mặc áo phao nữa"
    },
    "answer": "B",
    "explanation": "Quy tắc an toàn luôn phải đặt lên hàng đầu.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_18",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 19,
    "question": "Khi thấy biển báo cấm tắm nhưng nước rất nông, em làm gì?",
    "options": {
      "A": "Cứ tắm vì nước nông",
      "B": "Chụp ảnh dưới nước",
      "C": "Tuân thủ biển báo và không tắm",
      "D": "Rủ bạn cùng xuống"
    },
    "answer": "C",
    "explanation": "Biển cấm có thể vì lý do khác như sụt lún, ô nhiễm.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_19",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 20,
    "question": "Em sẽ khuyên em út điều gì khi chơi gần ao hồ?",
    "options": {
      "A": "Không được tới gần mép nước một mình",
      "B": "Ném đá xuống ao cho vui",
      "C": "Tự lấy đồ chơi nếu rớt xuống",
      "D": "Rủ bạn ra đó chơi"
    },
    "answer": "A",
    "explanation": "Trẻ nhỏ tuyệt đối không chơi gần nước một mình.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "id": "Kĩ_năng_phòng_tránh_nguy_cơ_bị_đuối_nước_20",
    "group": "Tự chăm sóc & An toàn"
  },
  {
    "number": 1,
    "question": "Quan sát là sử dụng giác quan nào?",
    "options": {
      "A": "Chỉ dùng mắt",
      "B": "Dùng mắt, tai, mũi và các giác quan khác",
      "C": "Chỉ dùng tay",
      "D": "Chỉ dùng tai"
    },
    "answer": "B",
    "explanation": "Quan sát bao gồm việc thu thập thông tin bằng nhiều giác quan.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Quan sát",
    "id": "Quan_sát_1",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 2,
    "question": "Khi quan sát một bông hoa, em thấy được điều gì bằng mắt?",
    "options": {
      "A": "Mùi hương",
      "B": "Độ mềm",
      "C": "Màu sắc",
      "D": "Tiếng lá reo"
    },
    "answer": "C",
    "explanation": "Mắt dùng để nhận biết màu sắc, hình dáng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Quan sát",
    "id": "Quan_sát_2",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 3,
    "question": "Đâu là công cụ hỗ trợ quan sát?",
    "options": {
      "A": "Cái búa",
      "B": "Kính lúp",
      "C": "Cái kéo",
      "D": "Cây bút"
    },
    "answer": "B",
    "explanation": "Kính lúp giúp phóng to vật để nhìn rõ hơn.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Quan sát",
    "id": "Quan_sát_3",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 4,
    "question": "Quan sát thời tiết để làm gì?",
    "options": {
      "A": "Để biết mặc đồ phù hợp",
      "B": "Để học giỏi toán",
      "C": "Để ăn ngon",
      "D": "Để chơi game"
    },
    "answer": "A",
    "explanation": "Quan sát thời tiết giúp chọn trang phục và chuẩn bị ra ngoài.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Quan sát",
    "id": "Quan_sát_4",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 5,
    "question": "Tại sao khi sang đường cần quan sát kỹ?",
    "options": {
      "A": "Để xem có ai quen không",
      "B": "Để tránh xe cộ, đảm bảo an toàn",
      "C": "Để nhìn đèn đường",
      "D": "Để đi chậm lại"
    },
    "answer": "B",
    "explanation": "Quan sát giúp phát hiện chướng ngại vật và xe cộ.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Quan sát",
    "id": "Quan_sát_5",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 6,
    "question": "Sự khác nhau giữa 'nhìn' và 'quan sát' là gì?",
    "options": {
      "A": "Nhìn tốn sức hơn",
      "B": "Quan sát là nhìn có chủ đích và ghi nhớ chi tiết",
      "C": "Không có gì khác",
      "D": "Nhìn dùng mắt, quan sát dùng mũi"
    },
    "answer": "B",
    "explanation": "Quan sát sâu sắc và có phân tích hơn việc chỉ nhìn qua.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Quan sát",
    "id": "Quan_sát_6",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 7,
    "question": "Quan sát bức tranh cẩn thận giúp em điều gì?",
    "options": {
      "A": "Hiểu được ý nghĩa và chi tiết",
      "B": "Vẽ nhanh hơn",
      "C": "Bức tranh đẹp hơn",
      "D": "Mắt sáng hơn"
    },
    "answer": "A",
    "explanation": "Quan sát kỹ giúp thu thập đủ thông tin.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Quan sát",
    "id": "Quan_sát_7",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 8,
    "question": "Tại sao bác sĩ cần quan sát sắc mặt bệnh nhân?",
    "options": {
      "A": "Để khen bệnh nhân",
      "B": "Để chẩn đoán tình trạng sức khỏe",
      "C": "Để vẽ chân dung",
      "D": "Để hỏi tên"
    },
    "answer": "B",
    "explanation": "Sắc mặt phản ánh một phần tình trạng bệnh lý.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Quan sát",
    "id": "Quan_sát_8",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 9,
    "question": "Mẹ đang bận nấu ăn, em thấy nước trong nồi trào ra. Em làm gì?",
    "options": {
      "A": "Đứng nhìn",
      "B": "Chạy đi chơi",
      "C": "Gọi mẹ hoặc giúp mẹ tắt bếp (nếu biết cách an toàn)",
      "D": "Khóc"
    },
    "answer": "C",
    "explanation": "Quan sát thấy sự cố cần có hành động phản hồi kịp thời.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Quan sát",
    "id": "Quan_sát_9",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 10,
    "question": "Đi dã ngoại, em thấy bầu trời đen kịt và gió lớn. Em làm gì?",
    "options": {
      "A": "Chạy ra bãi cỏ chơi",
      "B": "Rủ bạn đi bơi",
      "C": "Tìm nơi trú ẩn an toàn vì sắp mưa to",
      "D": "Lấy diều ra thả"
    },
    "answer": "C",
    "explanation": "Bầu trời đen kịt là dấu hiệu trời chuyển mưa dông.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Quan sát",
    "id": "Quan_sát_10",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 11,
    "question": "Đọc đề bài toán, em thấy mình hay làm sai. Lần này em nên làm gì?",
    "options": {
      "A": "Làm thật nhanh",
      "B": "Nhờ bạn làm hộ",
      "C": "Quan sát kỹ từng chữ, số liệu trước khi làm",
      "D": "Bỏ qua"
    },
    "answer": "C",
    "explanation": "Quan sát kỹ giúp tránh nhầm lẫn dữ kiện.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Quan sát",
    "id": "Quan_sát_11",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 12,
    "question": "Bước vào phòng tối, em sẽ làm gì đầu tiên?",
    "options": {
      "A": "Chạy nhanh vào trong",
      "B": "Quan sát tìm công tắc đèn",
      "C": "Nhắm mắt lại",
      "D": "Ngồi thụp xuống"
    },
    "answer": "B",
    "explanation": "Quan sát xung quanh để tìm công tắc hoặc nguồn sáng.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Quan sát",
    "id": "Quan_sát_12",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 13,
    "question": "Bạn Lan luôn nhìn trước ngó sau khi đi đường. Em đánh giá thế nào?",
    "options": {
      "A": "Lan bị sợ hãi quá mức",
      "B": "Lan mất tập trung",
      "C": "Lan cẩn thận và có kỹ năng quan sát tốt",
      "D": "Lan đi chậm"
    },
    "answer": "C",
    "explanation": "Quan sát khi đi đường là thói quen tốt để an toàn.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Quan sát",
    "id": "Quan_sát_13",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 14,
    "question": "Minh tìm đồ chơi nhưng chỉ liếc qua rồi bảo không thấy. Lỗi của Minh là?",
    "options": {
      "A": "Mắt kém",
      "B": "Chưa biết cách quan sát kỹ càng",
      "C": "Đồ chơi bị mất",
      "D": "Minh lười"
    },
    "answer": "B",
    "explanation": "Liếc qua không đủ để tìm đồ, cần quan sát kỹ.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Quan sát",
    "id": "Quan_sát_14",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 15,
    "question": "Hoa nhận ra bạn buồn vì thấy bạn ít nói và hay cúi đầu. Hoa có kỹ năng gì?",
    "options": {
      "A": "Quan sát và thấu hiểu tinh tế",
      "B": "Sáng tạo tốt",
      "C": "Sắp xếp giỏi",
      "D": "Phân loại giỏi"
    },
    "answer": "A",
    "explanation": "Quan sát nét mặt, cử chỉ giúp nhận biết cảm xúc.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Quan sát",
    "id": "Quan_sát_15",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 16,
    "question": "Nam sang đường chỉ nhìn một bên trái. Đánh giá hành vi của Nam?",
    "options": {
      "A": "Đúng, chỉ cần nhìn trái",
      "B": "Sai, chưa quan sát toàn diện, dễ gặp nguy hiểm",
      "C": "Nhanh nhẹn",
      "D": "Rất tốt"
    },
    "answer": "B",
    "explanation": "Sang đường cần quan sát cả hai bên.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Quan sát",
    "id": "Quan_sát_16",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 17,
    "question": "Từ việc quan sát cây con héo, em rút ra bài học gì?",
    "options": {
      "A": "Cây không cần nước",
      "B": "Cần phải tưới nước và chăm sóc cây thường xuyên",
      "C": "Nhổ cây đi",
      "D": "Cây thích nắng gắt"
    },
    "answer": "B",
    "explanation": "Phản tư từ quan sát giúp điều chỉnh hành động chăm sóc.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Quan sát",
    "id": "Quan_sát_17",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 18,
    "question": "Làm sao để rèn luyện kỹ năng quan sát tốt hơn mỗi ngày?",
    "options": {
      "A": "Chơi game nhiều",
      "B": "Chú ý tiểu tiết và đặt câu hỏi về mọi thứ xung quanh",
      "C": "Nhắm mắt nhiều hơn",
      "D": "Đọc truyện tranh"
    },
    "answer": "B",
    "explanation": "Tập trung chú ý giúp nâng cao khả năng quan sát.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Quan sát",
    "id": "Quan_sát_18",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 19,
    "question": "Vận dụng kỹ năng quan sát vào việc dọn phòng, em sẽ làm gì?",
    "options": {
      "A": "Gom tất cả vào một góc",
      "B": "Nhìn xem món nào đang để sai chỗ và cất lại",
      "C": "Nhờ mẹ dọn",
      "D": "Tắt đèn đi ngủ"
    },
    "answer": "B",
    "explanation": "Quan sát giúp phát hiện sự lộn xộn để xử lý.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Quan sát",
    "id": "Quan_sát_19",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 20,
    "question": "Quan sát giúp em phòng tránh nguy hiểm như thế nào?",
    "options": {
      "A": "Làm em dũng cảm hơn",
      "B": "Nhận biết sớm các rủi ro (ổ gà, biển báo) để tránh",
      "C": "Giúp em chạy nhanh",
      "D": "Làm em khỏe hơn"
    },
    "answer": "B",
    "explanation": "Nhận diện rủi ro sớm là cốt lõi của việc phòng tránh.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Quan sát",
    "id": "Quan_sát_20",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 1,
    "question": "Sắp xếp là gì?",
    "options": {
      "A": "Làm lộn xộn mọi thứ",
      "B": "Bố trí đồ vật theo một trật tự nhất định",
      "C": "Giấu đồ vật đi",
      "D": "Vứt đồ đạc đi"
    },
    "answer": "B",
    "explanation": "Sắp xếp là đặt mọi thứ vào đúng vị trí và trật tự.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_1",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 2,
    "question": "Đâu là một cách sắp xếp sách vở phổ biến?",
    "options": {
      "A": "Theo kích thước (từ lớn đến nhỏ)",
      "B": "Theo màu sắc một cách ngẫu nhiên",
      "C": "Trộn lẫn lộn",
      "D": "Để dưới gầm giường"
    },
    "answer": "A",
    "explanation": "Sắp xếp theo kích thước giúp gọn gàng và dễ lấy.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_2",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 3,
    "question": "Dụng cụ nào dùng để sắp xếp quần áo?",
    "options": {
      "A": "Tủ, móc treo",
      "B": "Hộp bút",
      "C": "Giỏ rác",
      "D": "Tủ lạnh"
    },
    "answer": "A",
    "explanation": "Tủ và móc thiết kế riêng cho quần áo.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_3",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 4,
    "question": "Lợi ích của việc sắp xếp góc học tập là gì?",
    "options": {
      "A": "Tốn thời gian",
      "B": "Dễ tìm đồ và học tập tập trung hơn",
      "C": "Làm mất đồ",
      "D": "Làm phòng nhỏ lại"
    },
    "answer": "B",
    "explanation": "Góc học tập gọn gàng giúp tăng hiệu quả.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_4",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 5,
    "question": "Tại sao trong siêu thị hàng hóa phải được sắp xếp theo khu vực?",
    "options": {
      "A": "Để đẹp mắt",
      "B": "Để khách hàng dễ tìm kiếm và mua sắm",
      "C": "Để nhân viên nghỉ ngơi",
      "D": "Để tránh chuột"
    },
    "answer": "B",
    "explanation": "Phân khu hàng hóa giúp định vị sản phẩm nhanh chóng.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_5",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 6,
    "question": "Sắp xếp thời gian (lập thời gian biểu) có tác dụng gì?",
    "options": {
      "A": "Làm em bận rộn hơn",
      "B": "Giúp cân bằng việc học, chơi và nghỉ ngơi",
      "C": "Làm em mệt mỏi",
      "D": "Để bố mẹ vui"
    },
    "answer": "B",
    "explanation": "Quản lý thời gian tốt giúp cuộc sống nề nếp hơn.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_6",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 7,
    "question": "Điều gì xảy ra nếu không sắp xếp đồ dùng cá nhân?",
    "options": {
      "A": "Thất lạc đồ và tốn thời gian tìm kiếm",
      "B": "Đồ dùng tự gọn gàng",
      "C": "Tiết kiệm thời gian",
      "D": "Được khen"
    },
    "answer": "A",
    "explanation": "Sự bừa bộn dẫn đến mất mát và lãng phí thời gian.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_7",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 8,
    "question": "Nguyên tắc 'đồ hay dùng để bên ngoài' khi sắp xếp giúp gì?",
    "options": {
      "A": "Đẹp tủ",
      "B": "Lấy nhanh chóng, thuận tiện",
      "C": "Bảo vệ đồ vật",
      "D": "Tiết kiệm tiền"
    },
    "answer": "B",
    "explanation": "Đồ thường xuyên dùng cần dễ tiếp cận nhất.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_8",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 9,
    "question": "Bàn học của em đầy giấy nháp và bút. Em sẽ làm gì?",
    "options": {
      "A": "Để nguyên đó",
      "B": "Vứt hết giấy nháp, bỏ bút vào ống bút",
      "C": "Gom tất cả vào cặp",
      "D": "Chuyển sang giường học"
    },
    "answer": "B",
    "explanation": "Loại bỏ rác và cất đồ dùng đúng chỗ để gọn gàng.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_9",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 10,
    "question": "Có 5 việc cần làm buổi tối. Em chọn cách sắp xếp nào?",
    "options": {
      "A": "Làm việc mình thích nhất trước",
      "B": "Làm theo thứ tự ưu tiên (việc gấp làm trước)",
      "C": "Làm cùng lúc 5 việc",
      "D": "Không làm việc nào"
    },
    "answer": "B",
    "explanation": "Sắp xếp công việc theo mức độ quan trọng mang lại hiệu quả cao.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_10",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 11,
    "question": "Đi dã ngoại, em sắp xếp balo như thế nào?",
    "options": {
      "A": "Nhét mọi thứ vào",
      "B": "Đồ nặng ở đáy, đồ hay dùng ở ngăn ngoài",
      "C": "Đồ ăn để dưới cùng",
      "D": "Để balo trống"
    },
    "answer": "B",
    "explanation": "Cách xếp balo chuẩn giúp mang vác nhẹ và dễ lấy đồ.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_11",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 12,
    "question": "Tủ giày bị lộn xộn. Em nên phân chia thế nào?",
    "options": {
      "A": "Giày đi học 1 ngăn, dép đi chơi 1 ngăn",
      "B": "Xếp chồng lên nhau",
      "C": "Cất vào túi nilon",
      "D": "Bỏ bớt giày"
    },
    "answer": "A",
    "explanation": "Phân chia theo mục đích sử dụng giúp tủ giày khoa học.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_12",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 13,
    "question": "Bạn Huy luôn xếp sách truyện theo vần A, B, C. Đánh giá thói quen này?",
    "options": {
      "A": "Mất thời gian vô ích",
      "B": "Rất khoa học, giúp tìm kiếm siêu nhanh",
      "C": "Không cần thiết",
      "D": "Chỉ thủ thư mới làm"
    },
    "answer": "B",
    "explanation": "Sắp xếp theo thứ tự chữ cái là phương pháp tối ưu.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_13",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 14,
    "question": "Mẹ dọn phòng giúp nhưng Nam lại vứt đồ bừa bãi. Nam đang thiếu kỹ năng gì?",
    "options": {
      "A": "Kỹ năng hát",
      "B": "Kỹ năng tự phục vụ và sắp xếp",
      "C": "Kỹ năng giao tiếp",
      "D": "Kỹ năng tính toán"
    },
    "answer": "B",
    "explanation": "Giữ gìn trật tự là biểu hiện của kỹ năng sắp xếp.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_14",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 15,
    "question": "Lan để quần áo bẩn lẫn quần áo sạch. Hành động này:",
    "options": {
      "A": "Đúng, tiết kiệm chỗ",
      "B": "Sai, mất vệ sinh và bừa bộn",
      "C": "Sáng tạo",
      "D": "Không sao cả"
    },
    "answer": "B",
    "explanation": "Quần áo bẩn cần để riêng để không lây mùi sang đồ sạch.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_15",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 16,
    "question": "Một học sinh lập kế hoạch học tập chi tiết nhưng không thực hiện. Đánh giá?",
    "options": {
      "A": "Giỏi sắp xếp",
      "B": "Biết sắp xếp trên giấy nhưng thiếu kỷ luật thực hành",
      "C": "Kém sắp xếp",
      "D": "Rất tốt"
    },
    "answer": "B",
    "explanation": "Sắp xếp kế hoạch phải đi đôi với hành động.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_16",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 17,
    "question": "Em vận dụng kỹ năng sắp xếp vào máy tính như thế nào?",
    "options": {
      "A": "Để mọi file ở Desktop",
      "B": "Tạo các thư mục (Học tập, Giải trí) để lưu trữ",
      "C": "Xóa hết file",
      "D": "Không dùng máy tính"
    },
    "answer": "B",
    "explanation": "Tạo thư mục giúp quản lý dữ liệu số hiệu quả.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_17",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 18,
    "question": "Sau một tuần gọn gàng, bàn học lại bừa. Em rút ra bài học gì?",
    "options": {
      "A": "Không cần dọn nữa",
      "B": "Phải duy trì thói quen cất đồ ngay sau khi dùng",
      "C": "Đổ lỗi cho em bé",
      "D": "Dọn 1 năm 1 lần"
    },
    "answer": "B",
    "explanation": "Sắp xếp là quá trình cần được duy trì liên tục.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_18",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 19,
    "question": "Làm thế nào để việc dọn dẹp, sắp xếp trở nên thú vị hơn?",
    "options": {
      "A": "Vừa dọn vừa bật nhạc yêu thích",
      "B": "Vừa dọn vừa khóc",
      "C": "Bắt người khác dọn cùng",
      "D": "Dọn thật chậm"
    },
    "answer": "A",
    "explanation": "Âm nhạc tạo cảm hứng và niềm vui khi làm việc nhà.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_19",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 20,
    "question": "Sắp xếp tốt giúp ích gì cho tư duy của em?",
    "options": {
      "A": "Tư duy logic, rành mạch hơn",
      "B": "Tư duy chậm lại",
      "C": "Không có tác dụng",
      "D": "Mất khả năng sáng tạo"
    },
    "answer": "A",
    "explanation": "Không gian ngăn nắp phản ánh và rèn luyện tư duy logic.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Sắp xếp",
    "id": "Sắp_xếp_20",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 1,
    "question": "So sánh là làm gì?",
    "options": {
      "A": "Tìm ra điểm giống và khác nhau giữa các sự vật",
      "B": "Cắt đôi đồ vật",
      "C": "Trộn mọi thứ lại",
      "D": "Vứt bỏ đồ cũ"
    },
    "answer": "A",
    "explanation": "So sánh giúp nhận diện đặc điểm đặc trưng của đối tượng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "So sánh",
    "id": "So_sánh_1",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 2,
    "question": "Để so sánh độ dài 2 chiếc bút, em dùng gì?",
    "options": {
      "A": "Cái cân",
      "B": "Thước kẻ",
      "C": "Nhiệt kế",
      "D": "Kính lúp"
    },
    "answer": "B",
    "explanation": "Thước kẻ là công cụ đo độ dài chuẩn xác.",
    "tier": "A - Knowledge (Biết)",
    "skill": "So sánh",
    "id": "So_sánh_2",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 3,
    "question": "Khi so sánh quả cam và quả chanh, điểm khác biệt rõ nhất là?",
    "options": {
      "A": "Đều có hạt",
      "B": "Vị (ngọt/chua) và kích thước",
      "C": "Đều là trái cây",
      "D": "Đều có vỏ"
    },
    "answer": "B",
    "explanation": "Vị và kích thước là đặc điểm phân biệt cam và chanh.",
    "tier": "A - Knowledge (Biết)",
    "skill": "So sánh",
    "id": "So_sánh_3",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 4,
    "question": "Phép toán nào thường dùng để so sánh số lượng?",
    "options": {
      "A": "Cộng",
      "B": "Lớn hơn (>), nhỏ hơn (<), bằng (=)",
      "C": "Nhân",
      "D": "Chia"
    },
    "answer": "B",
    "explanation": "Các dấu >, <, = là ký hiệu của phép so sánh.",
    "tier": "A - Knowledge (Biết)",
    "skill": "So sánh",
    "id": "So_sánh_4",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 5,
    "question": "Tại sao chúng ta cần kỹ năng so sánh khi đi mua hàng?",
    "options": {
      "A": "Để xem hàng hóa có đẹp không",
      "B": "Để chọn được sản phẩm tốt nhất với giá hợp lý (so sánh giá và chất lượng)",
      "C": "Để mua được hàng đắt nhất",
      "D": "Để cửa hàng vui"
    },
    "answer": "B",
    "explanation": "So sánh giúp người tiêu dùng đưa ra lựa chọn thông minh.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "So sánh",
    "id": "So_sánh_5",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 6,
    "question": "So sánh mùa hè và mùa đông ở miền Bắc có điểm gì khác nhau cốt lõi?",
    "options": {
      "A": "Mùa hè nóng, mùa đông lạnh",
      "B": "Mùa hè có tuyết",
      "C": "Mùa đông đi bơi",
      "D": "Không có gì khác"
    },
    "answer": "A",
    "explanation": "Nhiệt độ là đặc trưng cơ bản phân biệt hai mùa này.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "So sánh",
    "id": "So_sánh_6",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 7,
    "question": "So sánh giúp em nhận ra điều gì trong học tập?",
    "options": {
      "A": "Thấy mình kém cỏi",
      "B": "Nhận ra sự tiến bộ của bản thân so với hôm qua",
      "C": "Thấy bạn bè xấu",
      "D": "Thấy mệt mỏi"
    },
    "answer": "B",
    "explanation": "So sánh bản thân với quá khứ giúp nhận diện sự phát triển.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "So sánh",
    "id": "So_sánh_7",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 8,
    "question": "Đâu là ví dụ của việc so sánh để tìm điểm giống nhau?",
    "options": {
      "A": "Chó sủa, mèo kêu",
      "B": "Cả con mèo và con hổ đều thuộc họ Mèo",
      "C": "Gà có lông, cá có vảy",
      "D": "Cây có lá, hòn đá không có"
    },
    "answer": "B",
    "explanation": "Tìm điểm giống nhau để đưa vào cùng một nhóm phân loại.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "So sánh",
    "id": "So_sánh_8",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 9,
    "question": "Em được cho 2 đôi giày, 1 chật và 1 vừa chân. Em so sánh và chọn?",
    "options": {
      "A": "Đôi chật vì nó đẹp",
      "B": "Đôi vừa chân để đi lại thoải mái",
      "C": "Lấy cả hai",
      "D": "Không lấy đôi nào"
    },
    "answer": "B",
    "explanation": "So sánh mức độ phù hợp để đưa ra quyết định tốt nhất.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "So sánh",
    "id": "So_sánh_9",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 10,
    "question": "Đứng trước 2 con đường về nhà: đường ngắn nhưng nhiều xe, đường dài nhưng an toàn. Em chọn?",
    "options": {
      "A": "Đường ngắn cho nhanh",
      "B": "Đường an toàn dù xa hơn một chút",
      "C": "Đứng im",
      "D": "Đi nhắm mắt"
    },
    "answer": "B",
    "explanation": "So sánh rủi ro an toàn quan trọng hơn thời gian.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "So sánh",
    "id": "So_sánh_10",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 11,
    "question": "Bạn rủ em chơi game và mẹ nhắc em làm bài tập. Em so sánh lợi hại thế nào?",
    "options": {
      "A": "Chơi game vui hơn nên chơi",
      "B": "Làm bài tập mang lợi ích lâu dài nên chọn làm bài",
      "C": "Bỏ nhà đi",
      "D": "Vừa chơi vừa làm"
    },
    "answer": "B",
    "explanation": "So sánh ưu tiên giúp ra quyết định đúng đắn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "So sánh",
    "id": "So_sánh_11",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 12,
    "question": "Khi so sánh hai cuốn sách truyện để mua, em nên dựa vào tiêu chí nào?",
    "options": {
      "A": "Cuốn nào nặng hơn",
      "B": "Nội dung, thể loại mình thích và giá tiền",
      "C": "Cuốn nào có màu đỏ",
      "D": "Cuốn nào cũ hơn"
    },
    "answer": "B",
    "explanation": "Nội dung và giá tiền là tiêu chí phù hợp để chọn sách.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "So sánh",
    "id": "So_sánh_12",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 13,
    "question": "Minh hay so sánh quần áo của mình kém hàng hiệu của bạn. Đánh giá việc này?",
    "options": {
      "A": "Minh rất giỏi so sánh",
      "B": "So sánh vật chất gây tự ti, không nên khuyến khích",
      "C": "Minh nghèo",
      "D": "Nên so sánh nhiều hơn"
    },
    "answer": "B",
    "explanation": "So sánh vật chất với người khác dễ sinh tiêu cực.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "So sánh",
    "id": "So_sánh_13",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 14,
    "question": "Lan so sánh kết quả kiểm tra của mình tháng này cao hơn tháng trước để cố gắng. Đánh giá?",
    "options": {
      "A": "Rất tích cực, so sánh để tự hoàn thiện",
      "B": "Lan kiêu ngạo",
      "C": "Lan rảnh rỗi",
      "D": "Không nên so sánh thế"
    },
    "answer": "A",
    "explanation": "So sánh dọc (với chính mình) là động lực phát triển.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "So sánh",
    "id": "So_sánh_14",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 15,
    "question": "Người bán hàng nói trái cây này ngon nhất. Em nên làm gì?",
    "options": {
      "A": "Tin ngay",
      "B": "Quan sát và so sánh với các sạp khác để đánh giá khách quan",
      "C": "Cãi lại",
      "D": "Bỏ đi"
    },
    "answer": "B",
    "explanation": "So sánh khách quan giúp tránh bị lừa dối.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "So sánh",
    "id": "So_sánh_15",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 16,
    "question": "Một bạn chê tranh của em xấu hơn tranh của bạn ấy. Em đánh giá hành vi đó?",
    "options": {
      "A": "Bạn ấy đúng",
      "B": "So sánh mang tính chê bai là thiếu tôn trọng",
      "C": "Mình phải xé tranh",
      "D": "Bạn ấy vẽ giỏi"
    },
    "answer": "B",
    "explanation": "So sánh để hạ thấp người khác là hành vi kém văn minh.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "So sánh",
    "id": "So_sánh_16",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 17,
    "question": "Vận dụng kỹ năng so sánh, làm sao để viết một bài văn miêu tả hay?",
    "options": {
      "A": "Chép trên mạng",
      "B": "Dùng các hình ảnh so sánh (vd: mặt trời như quả cầu lửa)",
      "C": "Viết ngắn lại",
      "D": "Viết chữ to"
    },
    "answer": "B",
    "explanation": "Biện pháp tu từ so sánh làm câu văn sinh động.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "So sánh",
    "id": "So_sánh_17",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 18,
    "question": "Khi gặp hai thông tin trái chiều trên mạng, em sẽ làm gì?",
    "options": {
      "A": "Tin tin nào đọc trước",
      "B": "So sánh nguồn gốc, độ tin cậy để tìm sự thật",
      "C": "Chia sẻ ngay",
      "D": "Không tin ai"
    },
    "answer": "B",
    "explanation": "Kỹ năng so sánh giúp đánh giá tính xác thực của thông tin.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "So sánh",
    "id": "So_sánh_18",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 19,
    "question": "Sau một tuần ăn nhiều rau và một tuần ăn đồ ngọt, em phản tư điều gì?",
    "options": {
      "A": "Ăn đồ ngọt khỏe hơn",
      "B": "So sánh thấy ăn rau giúp cơ thể nhẹ nhàng, tiêu hóa tốt hơn",
      "C": "Không thấy gì",
      "D": "Ăn rau làm mệt"
    },
    "answer": "B",
    "explanation": "So sánh trải nghiệm cá nhân giúp hình thành thói quen tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "So sánh",
    "id": "So_sánh_19",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 20,
    "question": "Bài học lớn nhất khi học kỹ năng so sánh là gì?",
    "options": {
      "A": "Để đi cãi nhau",
      "B": "Để nhận thức đúng đắn và đưa ra lựa chọn sáng suốt",
      "C": "Để thấy mình giỏi nhất",
      "D": "Để thi toán"
    },
    "answer": "B",
    "explanation": "Mục đích cuối cùng của so sánh là ra quyết định.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "So sánh",
    "id": "So_sánh_20",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 1,
    "question": "Phân loại là gì?",
    "options": {
      "A": "Xếp các vật có chung đặc điểm vào cùng một nhóm",
      "B": "Cắt nhỏ đồ vật",
      "C": "Vứt đồ đạc đi",
      "D": "Trộn mọi thứ vào nhau"
    },
    "answer": "A",
    "explanation": "Phân loại là nhóm các đối tượng theo tiêu chí chung.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Phân loại",
    "id": "Phân_loại_1",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 2,
    "question": "Khi phân loại rác, ta thường chia làm mấy loại chính?",
    "options": {
      "A": "Không chia",
      "B": "Rác vô cơ, rác hữu cơ, rác tái chế",
      "C": "Chỉ rác nhựa",
      "D": "Chỉ rác giấy"
    },
    "answer": "B",
    "explanation": "Ba nhóm cơ bản giúp xử lý rác thải hiệu quả.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Phân loại",
    "id": "Phân_loại_2",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 3,
    "question": "Động vật nào sau đây thuộc nhóm gia cầm?",
    "options": {
      "A": "Bò",
      "B": "Chó",
      "C": "Gà",
      "D": "Cá"
    },
    "answer": "C",
    "explanation": "Gà là động vật có lông vũ, có cánh, được chăn nuôi.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Phân loại",
    "id": "Phân_loại_3",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 4,
    "question": "Trái cây được phân loại vào nhóm thực phẩm nào?",
    "options": {
      "A": "Nhiều đạm",
      "B": "Nhiều vitamin và khoáng chất",
      "C": "Nhiều chất béo",
      "D": "Nhiều tinh bột"
    },
    "answer": "B",
    "explanation": "Trái cây cung cấp nguồn vitamin dồi dào.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Phân loại",
    "id": "Phân_loại_4",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 5,
    "question": "Vì sao việc phân loại rác thải lại quan trọng?",
    "options": {
      "A": "Để thùng rác đẹp hơn",
      "B": "Bảo vệ môi trường và tái chế tài nguyên",
      "C": "Để tốn túi rác",
      "D": "Để người thu gom mệt hơn"
    },
    "answer": "B",
    "explanation": "Phân loại rác giúp giảm thiểu ô nhiễm và tận dụng phế liệu.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Phân loại",
    "id": "Phân_loại_5",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 6,
    "question": "Mục đích của việc phân loại sách trong thư viện là gì?",
    "options": {
      "A": "Để sách không bị mốc",
      "B": "Giúp người đọc dễ dàng tra cứu theo môn loại",
      "C": "Để thư viện to hơn",
      "D": "Để trang trí"
    },
    "answer": "B",
    "explanation": "Hệ thống phân loại giúp việc tìm kiếm nhanh chóng.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Phân loại",
    "id": "Phân_loại_6",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 7,
    "question": "Khi dọn tủ quần áo, tiêu chí phân loại phổ biến là gì?",
    "options": {
      "A": "Theo kích cỡ người khác",
      "B": "Đồ mùa đông - đồ mùa hè",
      "C": "Trộn lẫn lộn",
      "D": "Đồ sạch - đồ mới"
    },
    "answer": "B",
    "explanation": "Phân loại theo mùa giúp dễ chọn trang phục hàng ngày.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Phân loại",
    "id": "Phân_loại_7",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 8,
    "question": "Trong toán học, số chẵn và số lẻ là kết quả của việc phân loại theo tiêu chí nào?",
    "options": {
      "A": "Chia hết cho 2 hay không",
      "B": "Số lớn hay số nhỏ",
      "C": "Số đẹp hay số xấu",
      "D": "Màu sắc số"
    },
    "answer": "A",
    "explanation": "Dấu hiệu chia hết cho 2 là tiêu chí phân biệt chẵn/lẻ.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Phân loại",
    "id": "Phân_loại_8",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 9,
    "question": "Có một rổ đồ chơi gồm lego, ô tô, búp bê. Em sẽ chia nhóm thế nào để cất?",
    "options": {
      "A": "Cho hết vào 1 hộp",
      "B": "Chia 3 hộp: lego, xe cộ, búp bê",
      "C": "Bỏ bớt búp bê",
      "D": "Chia làm 2 hộp bừa"
    },
    "answer": "B",
    "explanation": "Phân nhóm theo đặc tính đồ chơi giúp dễ tìm lại.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Phân loại",
    "id": "Phân_loại_9",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 10,
    "question": "Khi phụ mẹ nhặt rau, em sẽ phân loại thế nào?",
    "options": {
      "A": "Phần rau non để ăn, phần lá già và cuống để bỏ (hữu cơ)",
      "B": "Cắt vụn tất cả",
      "C": "Trộn lẫn vào nhau",
      "D": "Vứt hết"
    },
    "answer": "A",
    "explanation": "Phân loại phần sử dụng được và phần bỏ đi là việc làm bếp cơ bản.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Phân loại",
    "id": "Phân_loại_10",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 11,
    "question": "Mẹ đi chợ mua về cá, thịt lợn, rau cải. Em sẽ cất vào tủ lạnh ra sao?",
    "options": {
      "A": "Cất chung một ngăn",
      "B": "Thịt, cá ngăn đá; rau củ ngăn mát dưới cùng",
      "C": "Rau vào ngăn đá",
      "D": "Để ngoài hết"
    },
    "answer": "B",
    "explanation": "Phân loại thực phẩm để bảo quản đúng nhiệt độ.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Phân loại",
    "id": "Phân_loại_11",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 12,
    "question": "Em được giao phân loại các loại bút trong lớp. Em chọn cách nào?",
    "options": {
      "A": "Bút viết được, bút hết mực, bút màu",
      "B": "Chia bừa",
      "C": "Đập vỡ bút",
      "D": "Không chia"
    },
    "answer": "A",
    "explanation": "Chia theo chức năng và tình trạng sử dụng là hợp lý nhất.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Phân loại",
    "id": "Phân_loại_12",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 13,
    "question": "Hành động vứt vỏ chuối vào thùng rác nhựa là:",
    "options": {
      "A": "Đúng",
      "B": "Sai, vỏ chuối là rác hữu cơ",
      "C": "Bình thường",
      "D": "Sáng tạo"
    },
    "answer": "B",
    "explanation": "Phân loại sai nhóm rác làm hỏng nỗ lực tái chế.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Phân loại",
    "id": "Phân_loại_13",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 14,
    "question": "Mai luôn chia bài tập thành: cần làm ngay, làm sau. Đánh giá thói quen này?",
    "options": {
      "A": "Lãng phí thời gian",
      "B": "Rất khoa học, biết phân loại mức độ ưu tiên",
      "C": "Không có ích",
      "D": "Mai làm màu"
    },
    "answer": "B",
    "explanation": "Phân loại ưu tiên giúp quản lý thời gian cực tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Phân loại",
    "id": "Phân_loại_14",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 15,
    "question": "Một cửa hàng để xà phòng chung với bánh kẹo. Em thấy sao?",
    "options": {
      "A": "Rất tiện lợi",
      "B": "Nguy hiểm, hóa chất có thể lẫn vào thực phẩm",
      "C": "Bình thường",
      "D": "Đẹp mắt"
    },
    "answer": "B",
    "explanation": "Hóa chất và thực phẩm phải được phân loại và tách biệt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Phân loại",
    "id": "Phân_loại_15",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 16,
    "question": "Bạn Tuấn cất chung sách giáo khoa và truyện tranh. Em khuyên bạn thế nào?",
    "options": {
      "A": "Cứ để vậy",
      "B": "Nên phân loại ra 2 góc để lúc học không bị phân tâm",
      "C": "Đốt truyện tranh",
      "D": "Mua thêm sách"
    },
    "answer": "B",
    "explanation": "Phân loại tài liệu học và giải trí giúp tập trung.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Phân loại",
    "id": "Phân_loại_16",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 17,
    "question": "Áp dụng kỹ năng phân loại, em lập danh sách đi siêu thị thế nào?",
    "options": {
      "A": "Viết lộn xộn",
      "B": "Chia theo nhóm: Rau củ, Thịt cá, Đồ dùng cá nhân",
      "C": "Nhớ trong đầu",
      "D": "Ghi bừa"
    },
    "answer": "B",
    "explanation": "Danh sách theo nhóm giúp đi siêu thị không bị bỏ sót và nhanh chóng.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Phân loại",
    "id": "Phân_loại_17",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 18,
    "question": "Phân loại cảm xúc (vui, buồn, giận dữ) giúp ích gì cho em?",
    "options": {
      "A": "Gọi tên và kiểm soát cảm xúc tốt hơn",
      "B": "Trở nên vô cảm",
      "C": "Hay khóc hơn",
      "D": "Giấu cảm xúc"
    },
    "answer": "A",
    "explanation": "Nhận diện và phân loại cảm xúc là bước đầu của trí tuệ cảm xúc.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Phân loại",
    "id": "Phân_loại_18",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 19,
    "question": "Sau khi học bài Phân loại, em sẽ thay đổi gì ở tủ sách của mình?",
    "options": {
      "A": "Gộp tất cả vào",
      "B": "Sắp xếp lại thành từng nhóm: SGK, Vở bài tập, Truyện đọc",
      "C": "Bán tủ sách",
      "D": "Chẳng làm gì"
    },
    "answer": "B",
    "explanation": "Hành động thực tế minh chứng cho việc tiếp thu bài học.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Phân loại",
    "id": "Phân_loại_19",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 20,
    "question": "Kỹ năng phân loại có liên quan mật thiết với kỹ năng nào?",
    "options": {
      "A": "Bơi lội",
      "B": "Quan sát và Sắp xếp",
      "C": "Nhảy múa",
      "D": "Ca hát"
    },
    "answer": "B",
    "explanation": "Phải quan sát mới có tiêu chí phân loại, rồi sau đó sắp xếp.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Phân loại",
    "id": "Phân_loại_20",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 1,
    "question": "Sáng tạo có nghĩa là gì?",
    "options": {
      "A": "Làm giống hệt người khác",
      "B": "Nghĩ ra ý tưởng mới mẻ hoặc cách làm mới hữu ích",
      "C": "Chép bài của bạn",
      "D": "Ngồi im"
    },
    "answer": "B",
    "explanation": "Sáng tạo mang tính mới mẻ và có giá trị ứng dụng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_1",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 2,
    "question": "Hoạt động nào sau đây đòi hỏi nhiều sự sáng tạo?",
    "options": {
      "A": "Làm toán cộng",
      "B": "Vẽ một bức tranh tự do",
      "C": "Chép chính tả",
      "D": "Quét nhà"
    },
    "answer": "B",
    "explanation": "Vẽ tự do cho phép trí tưởng tượng bay bổng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_2",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 3,
    "question": "Sáng tạo từ vật liệu tái chế là làm gì?",
    "options": {
      "A": "Vứt rác",
      "B": "Dùng chai nhựa cũ làm chậu cây",
      "C": "Mua đồ chơi mới",
      "D": "Đốt rác"
    },
    "answer": "B",
    "explanation": "Tái sinh vòng đời mới cho vật liệu là một hình thức sáng tạo.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_3",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 4,
    "question": "Ai có thể sáng tạo?",
    "options": {
      "A": "Chỉ họa sĩ",
      "B": "Chỉ nhà khoa học",
      "C": "Tất cả mọi người, kể cả trẻ em",
      "D": "Chỉ người lớn"
    },
    "answer": "C",
    "explanation": "Sáng tạo là khả năng tiềm ẩn trong mỗi con người.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_4",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 5,
    "question": "Vì sao trong học tập cần sự sáng tạo?",
    "options": {
      "A": "Để viết chữ xấu đi",
      "B": "Giúp tìm ra nhiều cách giải quyết bài toán nhanh và hay hơn",
      "C": "Để khỏi phải học",
      "D": "Để giáo viên mắng"
    },
    "answer": "B",
    "explanation": "Tư duy sáng tạo giúp linh hoạt trong giải quyết vấn đề.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_5",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 6,
    "question": "'Suy nghĩ ra ngoài chiếc hộp' (Think outside the box) nghĩa là gì?",
    "options": {
      "A": "Ngồi ngoài hộp cacton",
      "B": "Suy nghĩ vượt ra khỏi lối mòn thông thường",
      "C": "Không suy nghĩ gì",
      "D": "Mở hộp ra"
    },
    "answer": "B",
    "explanation": "Đây là thành ngữ chỉ cách tư duy độc đáo, không theo khuôn mẫu.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_6",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 7,
    "question": "Nếu em sợ sai thì em có dễ sáng tạo không?",
    "options": {
      "A": "Rất dễ",
      "B": "Khó, vì sáng tạo cần sự dũng cảm thử nghiệm cái mới",
      "C": "Không liên quan",
      "D": "Chắc chắn có"
    },
    "answer": "B",
    "explanation": "Nỗi sợ sai lầm cản trở bước chân của sự sáng tạo.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_7",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 8,
    "question": "Lợi ích của trò chơi đóng vai (bác sĩ, cảnh sát) đối với trẻ em?",
    "options": {
      "A": "Tốn thời gian",
      "B": "Phát triển trí tưởng tượng và sự sáng tạo ngôn ngữ",
      "C": "Gây bạo lực",
      "D": "Làm hư đồ chơi"
    },
    "answer": "B",
    "explanation": "Trò chơi nhập vai kích thích não bộ sáng tạo bối cảnh.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_8",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 9,
    "question": "Khi cái cặp sách bị đứt quai, em sáng tạo cách sửa thế nào tạm thời?",
    "options": {
      "A": "Vứt cặp đi",
      "B": "Dùng một sợi dây dù chắc chắn buộc làm quai tạm thời",
      "C": "Khóc ở nhà",
      "D": "Đeo cặp bằng răng"
    },
    "answer": "B",
    "explanation": "Dùng vật dụng thay thế là giải pháp sáng tạo linh hoạt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_9",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 10,
    "question": "Lớp yêu cầu làm thiệp 20/11, em hết giấy màu. Em chọn cách nào?",
    "options": {
      "A": "Không làm nữa",
      "B": "Dùng lá cây khô, hoa ép hoặc họa báo cũ để trang trí",
      "C": "Xin tiền mua ngay",
      "D": "Khóc lóc với cô"
    },
    "answer": "B",
    "explanation": "Sáng tạo bằng vật liệu có sẵn thể hiện sự khéo léo.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_10",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 11,
    "question": "Trời mưa, em không có ô nhưng cần ra vườn lấy đồ. Em sẽ?",
    "options": {
      "A": "Chạy ra để ướt",
      "B": "Dùng một tàu lá chuối to hoặc đội chậu nhựa",
      "C": "Bỏ không lấy nữa",
      "D": "Đợi đến mai"
    },
    "answer": "B",
    "explanation": "Ứng biến linh hoạt với môi trường xung quanh là sáng tạo.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_11",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 12,
    "question": "Em được giao làm nhóm trưởng nhưng các bạn không nghe. Em làm gì?",
    "options": {
      "A": "Mắng các bạn",
      "B": "Nghĩ ra một trò chơi nhỏ gắn với nhiệm vụ để các bạn hứng thú",
      "C": "Bỏ nhóm",
      "D": "Tự làm hết"
    },
    "answer": "B",
    "explanation": "Đổi mới cách quản lý nhóm bằng trò chơi kích thích tinh thần.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_12",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 13,
    "question": "Nam lấy chổi quét nhà làm đàn ghi-ta để biểu diễn văn nghệ. Hành động này:",
    "options": {
      "A": "Đáng bị phạt",
      "B": "Thể hiện trí tưởng tượng và sự sáng tạo vui nhộn",
      "C": "Hư hỏng chổi",
      "D": "Không hay"
    },
    "answer": "B",
    "explanation": "Gắn chức năng mới cho vật quen thuộc là tư duy sáng tạo.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_13",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 14,
    "question": "Bạn Mai vẽ bầu trời màu cam thay vì màu xanh. Ý kiến của em?",
    "options": {
      "A": "Mai vẽ sai bét",
      "B": "Mai đang sáng tạo bầu trời lúc hoàng hôn hoặc theo trí tưởng tượng",
      "C": "Mai bị mù màu",
      "D": "Không chấm điểm bức tranh đó"
    },
    "answer": "B",
    "explanation": "Nghệ thuật không có giới hạn màu sắc, đó là sáng tạo.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_14",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 15,
    "question": "Hùng chế tạo 'thuyền' bằng giấy nháp nhưng thả xuống nước chìm ngay. Đánh giá?",
    "options": {
      "A": "Hùng rất ngu ngốc",
      "B": "Hùng có ý tưởng sáng tạo, chỉ cần cải tiến vật liệu chống nước",
      "C": "Phạt Hùng tội xả rác",
      "D": "Cấm Hùng chơi"
    },
    "answer": "B",
    "explanation": "Thất bại là một phần của quá trình thử nghiệm sáng tạo.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_15",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 16,
    "question": "Sáng tạo nhưng vi phạm nội quy trường lớp (ví dụ: vẽ bậy lên tường) là:",
    "options": {
      "A": "Tốt, đáng biểu dương",
      "B": "Sai, sáng tạo phải đặt đúng lúc, đúng chỗ và không phá hoại",
      "C": "Rất nghệ thuật",
      "D": "Nên khuyến khích"
    },
    "answer": "B",
    "explanation": "Sáng tạo không đồng nghĩa với phá hoại chuẩn mực chung.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_16",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 17,
    "question": "Để kích thích não bộ sáng tạo, em nên làm gì mỗi ngày?",
    "options": {
      "A": "Chỉ xem điện thoại",
      "B": "Đọc sách, quan sát thiên nhiên và luôn đặt câu hỏi 'Tại sao?'",
      "C": "Ngủ 15 tiếng",
      "D": "Nhịn ăn"
    },
    "answer": "B",
    "explanation": "Nuôi dưỡng trí tò mò là thức ăn của sáng tạo.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_17",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 18,
    "question": "Từ câu chuyện Tấm Cám, em sáng tạo viết lại một kết cục khác. Việc này giúp gì?",
    "options": {
      "A": "Làm sai lệch lịch sử",
      "B": "Phát triển tư duy phản biện và khả năng viết lách sáng tạo",
      "C": "Bị cô giáo trừ điểm",
      "D": "Mất thời gian"
    },
    "answer": "B",
    "explanation": "Sáng tác ngoại truyện (fanfiction) rèn luyện tư duy ngôn ngữ.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_18",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 19,
    "question": "Làm thế nào để kết hợp kỹ năng sáng tạo và làm việc nhóm?",
    "options": {
      "A": "Mỗi người làm một ý, cãi nhau",
      "B": "Tổ chức 'bão não' (Brainstorming) để gom nhiều ý tưởng độc đáo",
      "C": "Chỉ nghe nhóm trưởng",
      "D": "Không ai nói gì"
    },
    "answer": "B",
    "explanation": "Brainstorming là phương pháp tuyệt vời để sáng tạo tập thể.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_19",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 20,
    "question": "Sáng tạo quan trọng thế nào đối với tương lai của em?",
    "options": {
      "A": "Không quan trọng",
      "B": "Giúp em linh hoạt thích nghi và giải quyết những vấn đề chưa từng có",
      "C": "Chỉ để làm họa sĩ",
      "D": "Để chơi game giỏi"
    },
    "answer": "B",
    "explanation": "Trong thế giới thay đổi nhanh, sáng tạo là chìa khóa sinh tồn.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Sáng tạo",
    "id": "Sáng_tạo_20",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 1,
    "question": "Chào hỏi là gì?",
    "options": {
      "A": "Quay mặt đi nơi khác",
      "B": "Hành vi thể hiện sự tôn trọng, lịch sự khi gặp gỡ người khác",
      "C": "Im lặng lườm người khác",
      "D": "Chỉ là vẫy tay"
    },
    "answer": "B",
    "explanation": "Chào hỏi là phép lịch sự tối thiểu trong giao tiếp.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_1",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 2,
    "question": "Khi chào người lớn tuổi, em cần có thái độ như thế nào?",
    "options": {
      "A": "Cười lớn",
      "B": "Khoanh tay, cúi đầu và nói lời chào rõ ràng",
      "C": "Nói lí nhí",
      "D": "Vừa chạy vừa chào"
    },
    "answer": "B",
    "explanation": "Khoanh tay và cúi đầu thể hiện sự lễ phép của trẻ nhỏ.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_2",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 3,
    "question": "Câu ca dao nào nói về việc chào hỏi?",
    "options": {
      "A": "Lời chào cao hơn mâm cỗ",
      "B": "Có công mài sắt có ngày nên kim",
      "C": "Uống nước nhớ nguồn",
      "D": "Gần mực thì đen"
    },
    "answer": "A",
    "explanation": "'Lời chào cao hơn mâm cỗ' đề cao giá trị của sự lễ phép.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_3",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 4,
    "question": "Hành động nào kèm theo lời chào thể hiện sự thân thiện với bạn bè?",
    "options": {
      "A": "Đánh bạn",
      "B": "Nở nụ cười và vẫy tay",
      "C": "Nheo mắt",
      "D": "Nhăn mặt"
    },
    "answer": "B",
    "explanation": "Nụ cười là ngôn ngữ toàn cầu của sự thân thiện.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_4",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 5,
    "question": "Tại sao chúng ta nên chào hỏi người khác?",
    "options": {
      "A": "Để xin tiền",
      "B": "Tạo thiện cảm, xây dựng mối quan hệ tốt đẹp",
      "C": "Để chứng tỏ mình ngoan",
      "D": "Bị bắt buộc"
    },
    "answer": "B",
    "explanation": "Chào hỏi mở đầu cho mọi sự giao tiếp tích cực.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_5",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 6,
    "question": "Chào hỏi khác nhau thế nào giữa bạn bè và thầy cô?",
    "options": {
      "A": "Chào bạn bè thì lễ phép, chào thầy cô thì thoải mái",
      "B": "Chào thầy cô cần nghiêm túc, lễ phép; chào bạn thì tự nhiên, vui vẻ",
      "C": "Giống hệt nhau",
      "D": "Không cần chào bạn"
    },
    "answer": "B",
    "explanation": "Đối tượng giao tiếp quyết định mức độ trang trọng của lời chào.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_6",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 7,
    "question": "Khi khách đến nhà chơi, em làm gì?",
    "options": {
      "A": "Chạy trốn vào phòng",
      "B": "Ra mở cửa, chào hỏi lễ phép và mời khách vào nhà",
      "C": "Đứng nhìn khách",
      "D": "Đuổi khách đi"
    },
    "answer": "B",
    "explanation": "Chào hỏi khách đến nhà là thể hiện lòng hiếu khách.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_7",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 8,
    "question": "Vì sao không nên vừa nhai thức ăn vừa nói lời chào?",
    "options": {
      "A": "Vì ăn sẽ ngon hơn",
      "B": "Mất lịch sự và có thể bị sặc, rơi thức ăn",
      "C": "Để tiết kiệm thời gian",
      "D": "Mọi người đều làm vậy"
    },
    "answer": "B",
    "explanation": "Vừa ăn vừa nói vi phạm quy tắc thanh lịch.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_8",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 9,
    "question": "Đang đi xe đạp trên đường, em thấy cô giáo. Em nên làm gì?",
    "options": {
      "A": "Gọi to từ xa",
      "B": "Dừng xe sát lề, đứng xuống xe và cúi chào cô",
      "C": "Cứ đạp xe qua nhanh",
      "D": "Quay đầu đi hướng khác"
    },
    "answer": "B",
    "explanation": "Dừng xe lại chào thể hiện sự tôn trọng tuyệt đối.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_9",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 10,
    "question": "Vào lớp trễ, thầy giáo đang giảng bài. Em sẽ làm gì?",
    "options": {
      "A": "Lẻn vào chỗ ngồi",
      "B": "Đứng ở cửa, gõ cửa và xin phép thầy cho vào lớp",
      "C": "Gọi to các bạn",
      "D": "Khóc"
    },
    "answer": "B",
    "explanation": "Gõ cửa xin phép là cách chào khi có lỗi đi muộn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_10",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 11,
    "question": "Gặp một người nước ngoài nói 'Hello', em sẽ phản hồi thế nào?",
    "options": {
      "A": "Lờ đi",
      "B": "Nói lại 'Hello' kèm nụ cười thân thiện",
      "C": "Bỏ chạy",
      "D": "Nói tiếng Việt thật to"
    },
    "answer": "B",
    "explanation": "Đáp lại bằng ngôn ngữ chung (tiếng Anh) lịch sự.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_11",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 12,
    "question": "Đến chơi nhà bạn, lúc về em cần làm gì?",
    "options": {
      "A": "Cứ thế đi về",
      "B": "Chào tạm biệt bạn và xin phép bố mẹ bạn để về",
      "C": "Lấy đồ chơi của bạn rồi về",
      "D": "Chạy vụt ra cửa"
    },
    "answer": "B",
    "explanation": "Chào ra về quan trọng như lúc chào đến.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_12",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 13,
    "question": "Huy gặp bác hàng xóm nhưng cúi gằm mặt lí nhí trong miệng. Đánh giá?",
    "options": {
      "A": "Huy ngoan",
      "B": "Huy chưa tự tin và cách chào chưa đạt chuẩn lịch sự",
      "C": "Huy bị ốm",
      "D": "Không cần thiết"
    },
    "answer": "B",
    "explanation": "Chào hỏi cần rõ ràng, ánh mắt nhìn thẳng tôn trọng.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_13",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 14,
    "question": "Lan luôn tươi cười chào các bác lao công trong trường. Đánh giá?",
    "options": {
      "A": "Lan giả tạo",
      "B": "Lan rất đáng khen, biết tôn trọng mọi người không phân biệt nghề nghiệp",
      "C": "Lan rảnh rỗi",
      "D": "Không cần thiết"
    },
    "answer": "B",
    "explanation": "Lịch sự với tất cả mọi người là nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_14",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 15,
    "question": "Một nhóm bạn trêu chọc việc Nam khoanh tay chào thầy. Em nghĩ gì?",
    "options": {
      "A": "Các bạn đúng, lớn rồi không cần khoanh tay",
      "B": "Nam đúng, lễ phép không bao giờ là thừa hay đáng xấu hổ",
      "C": "Nam hèn nhát",
      "D": "Nam nên bỏ khoanh tay"
    },
    "answer": "B",
    "explanation": "Lễ phép luôn là một giá trị cốt lõi, không đáng bị trêu chọc.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_15",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 16,
    "question": "Khách vẫy tay chào bé My, My quay mặt đi không đáp lại. Hành vi này:",
    "options": {
      "A": "Bình thường",
      "B": "Thiếu lễ phép và làm người khác buồn",
      "C": "Rất cá tính",
      "D": "Nhút nhát nên được chấp nhận"
    },
    "answer": "B",
    "explanation": "Không đáp lại lời chào là một sự thiếu tôn trọng.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_16",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 17,
    "question": "Làm sao để tập thói quen chào hỏi tự tin hơn?",
    "options": {
      "A": "Giam mình trong phòng",
      "B": "Bắt đầu bằng việc nhìn vào mắt và mỉm cười chào người thân mỗi sáng",
      "C": "Bắt người khác chào mình trước",
      "D": "Chỉ chào khi bị ép"
    },
    "answer": "B",
    "explanation": "Luyện tập từ những việc nhỏ trong gia đình.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_17",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 18,
    "question": "Ngoài lời nói, em có thể vận dụng cách chào nào khác (ngôn ngữ cơ thể)?",
    "options": {
      "A": "Đá chân",
      "B": "Cúi đầu, vẫy tay, hoặc bắt tay (khi phù hợp)",
      "C": "Nhe răng",
      "D": "Nhắm mắt"
    },
    "answer": "B",
    "explanation": "Ngôn ngữ cơ thể làm phong phú biểu đạt giao tiếp.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_18",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 19,
    "question": "Đi thang máy gặp hàng xóm, em vận dụng bài học thế nào?",
    "options": {
      "A": "Nhìn điện thoại liên tục",
      "B": "Chủ động mỉm cười và chào hỏi lịch sự",
      "C": "Quay lưng lại",
      "D": "Bấm nút đóng cửa nhanh"
    },
    "answer": "B",
    "explanation": "Không gian hẹp như thang máy là cơ hội giao tiếp lịch sự.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_19",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 20,
    "question": "Em nhận ra điều gì sau khi chủ động chào hỏi mọi người trong một tuần?",
    "options": {
      "A": "Mệt mỏi",
      "B": "Mọi người vui vẻ, thân thiện với em hơn và em cũng thấy tự tin hơn",
      "C": "Chẳng ai quan tâm",
      "D": "Mất thời gian"
    },
    "answer": "B",
    "explanation": "Chào hỏi mang lại năng lượng tích cực cho cả đôi bên.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chào hỏi",
    "id": "Chào_hỏi_20",
    "group": "An toàn & Tư duy cơ bản"
  },
  {
    "number": 1,
    "question": "Tình huống (Em thích vẽ tranh): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích vẽ tranh).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích vẽ tranh. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_1",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 2,
    "question": "Tình huống (Em thích đá bóng): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích đá bóng).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích đá bóng. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_2",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 3,
    "question": "Tình huống (Em thích đọc sách): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích đọc sách).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích đọc sách. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_3",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 4,
    "question": "Tình huống (Em thích ca hát): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích ca hát).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích ca hát. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_4",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 5,
    "question": "Tình huống (Em thích vẽ tranh): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích vẽ tranh).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích vẽ tranh. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_5",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 6,
    "question": "Tình huống (Em thích đá bóng): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích đá bóng).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích đá bóng. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_6",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 7,
    "question": "Tình huống (Em thích đọc sách): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích đọc sách).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích đọc sách. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_7",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 8,
    "question": "Tình huống (Em thích ca hát): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích ca hát).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích ca hát. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_8",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 9,
    "question": "Tình huống (Em thích vẽ tranh): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích vẽ tranh).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích vẽ tranh. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_9",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 10,
    "question": "Tình huống (Em thích đá bóng): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích đá bóng).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích đá bóng. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_10",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 11,
    "question": "Tình huống (Em thích đọc sách): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích đọc sách).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích đọc sách. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_11",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 12,
    "question": "Tình huống (Em thích ca hát): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích ca hát).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích ca hát. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_12",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 13,
    "question": "Tình huống (Em thích vẽ tranh): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích vẽ tranh).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích vẽ tranh. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_13",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 14,
    "question": "Tình huống (Em thích đá bóng): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích đá bóng).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích đá bóng. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_14",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 15,
    "question": "Tình huống (Em thích đọc sách): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích đọc sách).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích đọc sách. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_15",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 16,
    "question": "Tình huống (Em thích ca hát): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích ca hát).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích ca hát. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_16",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 17,
    "question": "Tình huống (Em thích vẽ tranh): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích vẽ tranh).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích vẽ tranh. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_17",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 18,
    "question": "Tình huống (Em thích đá bóng): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích đá bóng).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích đá bóng. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_18",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 19,
    "question": "Tình huống (Em thích đọc sách): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích đọc sách).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích đọc sách. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_19",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 20,
    "question": "Tình huống (Em thích ca hát): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Giới thiệu sở thích của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Em thích ca hát).",
      "B": "Thực hiện kỹ năng Giới thiệu sở thích của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Giới thiệu sở thích của bản thân vào tình huống Em thích ca hát. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Giới thiệu sở thích của bản thân",
    "id": "Giới_thiệu_sở_thích_của_bản_thân_20",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 1,
    "question": "Tình huống (Cùng làm báo tường): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Cùng làm báo tường).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Cùng làm báo tường. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_1",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 2,
    "question": "Tình huống (Dọn dẹp lớp học): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Dọn dẹp lớp học).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Dọn dẹp lớp học. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_2",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 3,
    "question": "Tình huống (Làm bài tập nhóm): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Làm bài tập nhóm).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Làm bài tập nhóm. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_3",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 4,
    "question": "Tình huống (Chuẩn bị tiết mục văn nghệ): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Chuẩn bị tiết mục văn nghệ).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Chuẩn bị tiết mục văn nghệ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_4",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 5,
    "question": "Tình huống (Cùng làm báo tường): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Cùng làm báo tường).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Cùng làm báo tường. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_5",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 6,
    "question": "Tình huống (Dọn dẹp lớp học): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Dọn dẹp lớp học).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Dọn dẹp lớp học. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_6",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 7,
    "question": "Tình huống (Làm bài tập nhóm): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Làm bài tập nhóm).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Làm bài tập nhóm. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_7",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 8,
    "question": "Tình huống (Chuẩn bị tiết mục văn nghệ): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Chuẩn bị tiết mục văn nghệ).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Chuẩn bị tiết mục văn nghệ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_8",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 9,
    "question": "Tình huống (Cùng làm báo tường): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Cùng làm báo tường).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Cùng làm báo tường. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_9",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 10,
    "question": "Tình huống (Dọn dẹp lớp học): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Dọn dẹp lớp học).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Dọn dẹp lớp học. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_10",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 11,
    "question": "Tình huống (Làm bài tập nhóm): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Làm bài tập nhóm).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Làm bài tập nhóm. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_11",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 12,
    "question": "Tình huống (Chuẩn bị tiết mục văn nghệ): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Chuẩn bị tiết mục văn nghệ).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Chuẩn bị tiết mục văn nghệ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_12",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 13,
    "question": "Tình huống (Cùng làm báo tường): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Cùng làm báo tường).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Cùng làm báo tường. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_13",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 14,
    "question": "Tình huống (Dọn dẹp lớp học): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Dọn dẹp lớp học).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Dọn dẹp lớp học. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_14",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 15,
    "question": "Tình huống (Làm bài tập nhóm): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Làm bài tập nhóm).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Làm bài tập nhóm. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_15",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 16,
    "question": "Tình huống (Chuẩn bị tiết mục văn nghệ): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Chuẩn bị tiết mục văn nghệ).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Chuẩn bị tiết mục văn nghệ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_16",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 17,
    "question": "Tình huống (Cùng làm báo tường): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Cùng làm báo tường).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Cùng làm báo tường. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_17",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 18,
    "question": "Tình huống (Dọn dẹp lớp học): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Dọn dẹp lớp học).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Dọn dẹp lớp học. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_18",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 19,
    "question": "Tình huống (Làm bài tập nhóm): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Làm bài tập nhóm).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Làm bài tập nhóm. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_19",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 20,
    "question": "Tình huống (Chuẩn bị tiết mục văn nghệ): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Làm việc nhóm?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Chuẩn bị tiết mục văn nghệ).",
      "B": "Thực hiện kỹ năng Làm việc nhóm một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Làm việc nhóm vào tình huống Chuẩn bị tiết mục văn nghệ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Làm việc nhóm",
    "id": "Làm_việc_nhóm_20",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 1,
    "question": "Tình huống (Khi được điểm cao): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi được điểm cao).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi được điểm cao. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_1",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 2,
    "question": "Tình huống (Khi bị điểm kém): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi bị điểm kém).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi bị điểm kém. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_2",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 3,
    "question": "Tình huống (Khi bị bạn trêu chọc): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi bị bạn trêu chọc).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi bị bạn trêu chọc. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_3",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 4,
    "question": "Tình huống (Khi được tặng quà): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi được tặng quà).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi được tặng quà. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_4",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 5,
    "question": "Tình huống (Khi được điểm cao): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi được điểm cao).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi được điểm cao. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_5",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 6,
    "question": "Tình huống (Khi bị điểm kém): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi bị điểm kém).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi bị điểm kém. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_6",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 7,
    "question": "Tình huống (Khi bị bạn trêu chọc): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi bị bạn trêu chọc).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi bị bạn trêu chọc. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_7",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 8,
    "question": "Tình huống (Khi được tặng quà): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi được tặng quà).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi được tặng quà. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_8",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 9,
    "question": "Tình huống (Khi được điểm cao): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi được điểm cao).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi được điểm cao. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_9",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 10,
    "question": "Tình huống (Khi bị điểm kém): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi bị điểm kém).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi bị điểm kém. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_10",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 11,
    "question": "Tình huống (Khi bị bạn trêu chọc): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi bị bạn trêu chọc).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi bị bạn trêu chọc. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_11",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 12,
    "question": "Tình huống (Khi được tặng quà): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi được tặng quà).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi được tặng quà. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_12",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 13,
    "question": "Tình huống (Khi được điểm cao): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi được điểm cao).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi được điểm cao. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_13",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 14,
    "question": "Tình huống (Khi bị điểm kém): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi bị điểm kém).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi bị điểm kém. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_14",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 15,
    "question": "Tình huống (Khi bị bạn trêu chọc): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi bị bạn trêu chọc).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi bị bạn trêu chọc. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_15",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 16,
    "question": "Tình huống (Khi được tặng quà): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi được tặng quà).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi được tặng quà. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_16",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 17,
    "question": "Tình huống (Khi được điểm cao): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi được điểm cao).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi được điểm cao. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_17",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 18,
    "question": "Tình huống (Khi bị điểm kém): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi bị điểm kém).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi bị điểm kém. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_18",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 19,
    "question": "Tình huống (Khi bị bạn trêu chọc): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi bị bạn trêu chọc).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi bị bạn trêu chọc. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_19",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 20,
    "question": "Tình huống (Khi được tặng quà): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của bản thân?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi được tặng quà).",
      "B": "Thực hiện kỹ năng Cảm xúc của bản thân một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cảm xúc của bản thân vào tình huống Khi được tặng quà. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cảm xúc của bản thân",
    "id": "Cảm_xúc_của_bản_thân_20",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 1,
    "question": "Tình huống (Thấy bạn khóc): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy bạn khóc).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy bạn khóc. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_1",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 2,
    "question": "Tình huống (Thấy bạn vui vì chiến thắng): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy bạn vui vì chiến thắng).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy bạn vui vì chiến thắng. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_2",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 3,
    "question": "Tình huống (Thấy mẹ mệt mỏi): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy mẹ mệt mỏi).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy mẹ mệt mỏi. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_3",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 4,
    "question": "Tình huống (Thấy em bé bị ngã): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy em bé bị ngã).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy em bé bị ngã. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_4",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 5,
    "question": "Tình huống (Thấy bạn khóc): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy bạn khóc).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy bạn khóc. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_5",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 6,
    "question": "Tình huống (Thấy bạn vui vì chiến thắng): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy bạn vui vì chiến thắng).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy bạn vui vì chiến thắng. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_6",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 7,
    "question": "Tình huống (Thấy mẹ mệt mỏi): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy mẹ mệt mỏi).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy mẹ mệt mỏi. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_7",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 8,
    "question": "Tình huống (Thấy em bé bị ngã): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy em bé bị ngã).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy em bé bị ngã. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_8",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 9,
    "question": "Tình huống (Thấy bạn khóc): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy bạn khóc).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy bạn khóc. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_9",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 10,
    "question": "Tình huống (Thấy bạn vui vì chiến thắng): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy bạn vui vì chiến thắng).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy bạn vui vì chiến thắng. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_10",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 11,
    "question": "Tình huống (Thấy mẹ mệt mỏi): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy mẹ mệt mỏi).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy mẹ mệt mỏi. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_11",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 12,
    "question": "Tình huống (Thấy em bé bị ngã): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy em bé bị ngã).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy em bé bị ngã. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_12",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 13,
    "question": "Tình huống (Thấy bạn khóc): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy bạn khóc).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy bạn khóc. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_13",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 14,
    "question": "Tình huống (Thấy bạn vui vì chiến thắng): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy bạn vui vì chiến thắng).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy bạn vui vì chiến thắng. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_14",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 15,
    "question": "Tình huống (Thấy mẹ mệt mỏi): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy mẹ mệt mỏi).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy mẹ mệt mỏi. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_15",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 16,
    "question": "Tình huống (Thấy em bé bị ngã): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy em bé bị ngã).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy em bé bị ngã. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_16",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 17,
    "question": "Tình huống (Thấy bạn khóc): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy bạn khóc).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy bạn khóc. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_17",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 18,
    "question": "Tình huống (Thấy bạn vui vì chiến thắng): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy bạn vui vì chiến thắng).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy bạn vui vì chiến thắng. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_18",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 19,
    "question": "Tình huống (Thấy mẹ mệt mỏi): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy mẹ mệt mỏi).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy mẹ mệt mỏi. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_19",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 20,
    "question": "Tình huống (Thấy em bé bị ngã): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cảm xúc của người khác?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Thấy em bé bị ngã).",
      "B": "Thực hiện kỹ năng Cảm xúc của người khác một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cảm xúc của người khác vào tình huống Thấy em bé bị ngã. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cảm xúc của người khác",
    "id": "Cảm_xúc_của_người_khác_20",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 1,
    "question": "Tình huống (Được nhận quà sinh nhật): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được nhận quà sinh nhật).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được nhận quà sinh nhật. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_1",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 2,
    "question": "Tình huống (Được bạn cho mượn bút): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được bạn cho mượn bút).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được bạn cho mượn bút. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_2",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 3,
    "question": "Tình huống (Được cô giáo khen): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được cô giáo khen).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được cô giáo khen. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_3",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 4,
    "question": "Tình huống (Được mẹ nấu ăn ngon): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được mẹ nấu ăn ngon).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được mẹ nấu ăn ngon. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_4",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 5,
    "question": "Tình huống (Được nhận quà sinh nhật): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được nhận quà sinh nhật).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được nhận quà sinh nhật. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_5",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 6,
    "question": "Tình huống (Được bạn cho mượn bút): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được bạn cho mượn bút).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được bạn cho mượn bút. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_6",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 7,
    "question": "Tình huống (Được cô giáo khen): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được cô giáo khen).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được cô giáo khen. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_7",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 8,
    "question": "Tình huống (Được mẹ nấu ăn ngon): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được mẹ nấu ăn ngon).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được mẹ nấu ăn ngon. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_8",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 9,
    "question": "Tình huống (Được nhận quà sinh nhật): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được nhận quà sinh nhật).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được nhận quà sinh nhật. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_9",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 10,
    "question": "Tình huống (Được bạn cho mượn bút): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được bạn cho mượn bút).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được bạn cho mượn bút. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_10",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 11,
    "question": "Tình huống (Được cô giáo khen): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được cô giáo khen).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được cô giáo khen. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_11",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 12,
    "question": "Tình huống (Được mẹ nấu ăn ngon): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được mẹ nấu ăn ngon).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được mẹ nấu ăn ngon. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_12",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 13,
    "question": "Tình huống (Được nhận quà sinh nhật): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được nhận quà sinh nhật).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được nhận quà sinh nhật. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_13",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 14,
    "question": "Tình huống (Được bạn cho mượn bút): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được bạn cho mượn bút).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được bạn cho mượn bút. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_14",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 15,
    "question": "Tình huống (Được cô giáo khen): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được cô giáo khen).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được cô giáo khen. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_15",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 16,
    "question": "Tình huống (Được mẹ nấu ăn ngon): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được mẹ nấu ăn ngon).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được mẹ nấu ăn ngon. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_16",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 17,
    "question": "Tình huống (Được nhận quà sinh nhật): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được nhận quà sinh nhật).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được nhận quà sinh nhật. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_17",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 18,
    "question": "Tình huống (Được bạn cho mượn bút): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được bạn cho mượn bút).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được bạn cho mượn bút. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_18",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 19,
    "question": "Tình huống (Được cô giáo khen): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được cô giáo khen).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được cô giáo khen. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_19",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 20,
    "question": "Tình huống (Được mẹ nấu ăn ngon): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Nói lời cảm ơn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Được mẹ nấu ăn ngon).",
      "B": "Thực hiện kỹ năng Nói lời cảm ơn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Nói lời cảm ơn vào tình huống Được mẹ nấu ăn ngon. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Nói lời cảm ơn",
    "id": "Nói_lời_cảm_ơn_20",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 1,
    "question": "Tình huống (Khi mới bước vào cửa): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi mới bước vào cửa).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi mới bước vào cửa. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_1",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 2,
    "question": "Tình huống (Khi xin phép dùng đồ): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi xin phép dùng đồ).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi xin phép dùng đồ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_2",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 3,
    "question": "Tình huống (Khi nói chuyện với bố mẹ bạn): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi nói chuyện với bố mẹ bạn).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi nói chuyện với bố mẹ bạn. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_3",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 4,
    "question": "Tình huống (Khi chuẩn bị ra về): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi chuẩn bị ra về).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi chuẩn bị ra về. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_4",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 5,
    "question": "Tình huống (Khi mới bước vào cửa): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi mới bước vào cửa).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi mới bước vào cửa. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_5",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 6,
    "question": "Tình huống (Khi xin phép dùng đồ): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi xin phép dùng đồ).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi xin phép dùng đồ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_6",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 7,
    "question": "Tình huống (Khi nói chuyện với bố mẹ bạn): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi nói chuyện với bố mẹ bạn).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi nói chuyện với bố mẹ bạn. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_7",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 8,
    "question": "Tình huống (Khi chuẩn bị ra về): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi chuẩn bị ra về).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi chuẩn bị ra về. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_8",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 9,
    "question": "Tình huống (Khi mới bước vào cửa): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi mới bước vào cửa).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi mới bước vào cửa. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_9",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 10,
    "question": "Tình huống (Khi xin phép dùng đồ): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi xin phép dùng đồ).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi xin phép dùng đồ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_10",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 11,
    "question": "Tình huống (Khi nói chuyện với bố mẹ bạn): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi nói chuyện với bố mẹ bạn).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi nói chuyện với bố mẹ bạn. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_11",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 12,
    "question": "Tình huống (Khi chuẩn bị ra về): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi chuẩn bị ra về).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi chuẩn bị ra về. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_12",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 13,
    "question": "Tình huống (Khi mới bước vào cửa): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi mới bước vào cửa).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi mới bước vào cửa. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_13",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 14,
    "question": "Tình huống (Khi xin phép dùng đồ): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi xin phép dùng đồ).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi xin phép dùng đồ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_14",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 15,
    "question": "Tình huống (Khi nói chuyện với bố mẹ bạn): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi nói chuyện với bố mẹ bạn).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi nói chuyện với bố mẹ bạn. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_15",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 16,
    "question": "Tình huống (Khi chuẩn bị ra về): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi chuẩn bị ra về).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi chuẩn bị ra về. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_16",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 17,
    "question": "Tình huống (Khi mới bước vào cửa): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi mới bước vào cửa).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi mới bước vào cửa. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_17",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 18,
    "question": "Tình huống (Khi xin phép dùng đồ): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi xin phép dùng đồ).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi xin phép dùng đồ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_18",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 19,
    "question": "Tình huống (Khi nói chuyện với bố mẹ bạn): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi nói chuyện với bố mẹ bạn).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi nói chuyện với bố mẹ bạn. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_19",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 20,
    "question": "Tình huống (Khi chuẩn bị ra về): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Khi chuẩn bị ra về).",
      "B": "Thực hiện kỹ năng Ứng xử lịch sự khi đến chơi nhà bạn một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Ứng xử lịch sự khi đến chơi nhà bạn vào tình huống Khi chuẩn bị ra về. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Ứng xử lịch sự khi đến chơi nhà bạn",
    "id": "Ứng_xử_lịch_sự_khi_đến_chơi_nhà_bạn_20",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 1,
    "question": "Tình huống (Bạn tham gia chạy bộ): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn tham gia chạy bộ).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn tham gia chạy bộ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_1",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 2,
    "question": "Tình huống (Bạn trả lời sai trên lớp): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn trả lời sai trên lớp).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn trả lời sai trên lớp. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_2",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 3,
    "question": "Tình huống (Bạn làm hỏng đồ chơi): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn làm hỏng đồ chơi).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn làm hỏng đồ chơi. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_3",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 4,
    "question": "Tình huống (Bạn đi thi vẽ): Ở mức độ A - Knowledge (Biết), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn đi thi vẽ).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ A - Knowledge (Biết), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn đi thi vẽ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_4",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 5,
    "question": "Tình huống (Bạn tham gia chạy bộ): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn tham gia chạy bộ).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn tham gia chạy bộ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_5",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 6,
    "question": "Tình huống (Bạn trả lời sai trên lớp): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn trả lời sai trên lớp).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn trả lời sai trên lớp. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_6",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 7,
    "question": "Tình huống (Bạn làm hỏng đồ chơi): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn làm hỏng đồ chơi).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn làm hỏng đồ chơi. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_7",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 8,
    "question": "Tình huống (Bạn đi thi vẽ): Ở mức độ B - Understanding (Hiểu), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn đi thi vẽ).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ B - Understanding (Hiểu), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn đi thi vẽ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_8",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 9,
    "question": "Tình huống (Bạn tham gia chạy bộ): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn tham gia chạy bộ).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn tham gia chạy bộ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_9",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 10,
    "question": "Tình huống (Bạn trả lời sai trên lớp): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn trả lời sai trên lớp).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn trả lời sai trên lớp. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_10",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 11,
    "question": "Tình huống (Bạn làm hỏng đồ chơi): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn làm hỏng đồ chơi).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn làm hỏng đồ chơi. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_11",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 12,
    "question": "Tình huống (Bạn đi thi vẽ): Ở mức độ C - Decision Making (Lựa chọn trong tình huống), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn đi thi vẽ).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ C - Decision Making (Lựa chọn trong tình huống), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn đi thi vẽ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_12",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 13,
    "question": "Tình huống (Bạn tham gia chạy bộ): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn tham gia chạy bộ).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn tham gia chạy bộ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_13",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 14,
    "question": "Tình huống (Bạn trả lời sai trên lớp): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn trả lời sai trên lớp).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn trả lời sai trên lớp. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_14",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 15,
    "question": "Tình huống (Bạn làm hỏng đồ chơi): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn làm hỏng đồ chơi).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn làm hỏng đồ chơi. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_15",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 16,
    "question": "Tình huống (Bạn đi thi vẽ): Ở mức độ D - Judgment (Đánh giá hành vi), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn đi thi vẽ).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ D - Judgment (Đánh giá hành vi), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn đi thi vẽ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_16",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 17,
    "question": "Tình huống (Bạn tham gia chạy bộ): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn tham gia chạy bộ).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn tham gia chạy bộ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_17",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 18,
    "question": "Tình huống (Bạn trả lời sai trên lớp): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn trả lời sai trên lớp).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn trả lời sai trên lớp. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_18",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 19,
    "question": "Tình huống (Bạn làm hỏng đồ chơi): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn làm hỏng đồ chơi).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn làm hỏng đồ chơi. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_19",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 20,
    "question": "Tình huống (Bạn đi thi vẽ): Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), em sẽ ứng xử như thế nào về kỹ năng Cổ vũ, động viên?",
    "options": {
      "A": "Bày tỏ thái độ tiêu cực hoặc né tránh (Bạn đi thi vẽ).",
      "B": "Thực hiện kỹ năng Cổ vũ, động viên một cách tích cực và đúng mực.",
      "C": "Chỉ quan tâm đến bản thân và bỏ qua người khác.",
      "D": "Nhờ người khác làm thay mình."
    },
    "answer": "B",
    "explanation": "Ở mức độ E - Transfer & Reflection (Vận dụng & Phản tư), học sinh cần hiểu và áp dụng Cổ vũ, động viên vào tình huống Bạn đi thi vẽ. Đáp án B thể hiện hành vi đúng chuẩn sư phạm, giúp trẻ rèn luyện nhân cách tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Cổ vũ, động viên",
    "id": "Cổ_vũ_động_viên_20",
    "group": "Giao tiếp & Cảm xúc"
  },
  {
    "number": 1,
    "question": "Câu hỏi về việc nhận biết phong tục chúc tết (Tình huống 1)",
    "options": {
      "A": "Biết được phong tục",
      "B": "Không biết",
      "C": "Chưa rõ",
      "D": "Sai"
    },
    "answer": "A",
    "explanation": "Học sinh cần biết phong tục cơ bản.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_1",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 2,
    "question": "Câu hỏi về việc nhận biết phong tục chúc tết (Tình huống 2)",
    "options": {
      "A": "Biết được phong tục",
      "B": "Không biết",
      "C": "Chưa rõ",
      "D": "Sai"
    },
    "answer": "A",
    "explanation": "Học sinh cần biết phong tục cơ bản.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_2",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 3,
    "question": "Câu hỏi về việc nhận biết phong tục chúc tết (Tình huống 3)",
    "options": {
      "A": "Biết được phong tục",
      "B": "Không biết",
      "C": "Chưa rõ",
      "D": "Sai"
    },
    "answer": "A",
    "explanation": "Học sinh cần biết phong tục cơ bản.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_3",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 4,
    "question": "Câu hỏi về việc nhận biết phong tục chúc tết (Tình huống 4)",
    "options": {
      "A": "Biết được phong tục",
      "B": "Không biết",
      "C": "Chưa rõ",
      "D": "Sai"
    },
    "answer": "A",
    "explanation": "Học sinh cần biết phong tục cơ bản.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_4",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 5,
    "question": "Câu hỏi hiểu ý nghĩa của lời chúc (Tình huống 1)",
    "options": {
      "A": "Hiểu ý nghĩa mong bình an",
      "B": "Chỉ để nhận lì xì",
      "C": "Là bắt buộc",
      "D": "Không có ý nghĩa"
    },
    "answer": "A",
    "explanation": "Hiểu được giá trị tinh thần của lời chúc.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_5",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 6,
    "question": "Câu hỏi hiểu ý nghĩa của lời chúc (Tình huống 2)",
    "options": {
      "A": "Hiểu ý nghĩa mong bình an",
      "B": "Chỉ để nhận lì xì",
      "C": "Là bắt buộc",
      "D": "Không có ý nghĩa"
    },
    "answer": "A",
    "explanation": "Hiểu được giá trị tinh thần của lời chúc.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_6",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 7,
    "question": "Câu hỏi hiểu ý nghĩa của lời chúc (Tình huống 3)",
    "options": {
      "A": "Hiểu ý nghĩa mong bình an",
      "B": "Chỉ để nhận lì xì",
      "C": "Là bắt buộc",
      "D": "Không có ý nghĩa"
    },
    "answer": "A",
    "explanation": "Hiểu được giá trị tinh thần của lời chúc.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_7",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 8,
    "question": "Câu hỏi hiểu ý nghĩa của lời chúc (Tình huống 4)",
    "options": {
      "A": "Hiểu ý nghĩa mong bình an",
      "B": "Chỉ để nhận lì xì",
      "C": "Là bắt buộc",
      "D": "Không có ý nghĩa"
    },
    "answer": "A",
    "explanation": "Hiểu được giá trị tinh thần của lời chúc.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_8",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 9,
    "question": "Khi đến nhà người lớn, em sẽ làm gì đầu tiên? (Tình huống 1)",
    "options": {
      "A": "Khoanh tay chúc tết",
      "B": "Chạy đi chơi",
      "C": "Đòi lì xì",
      "D": "Im lặng"
    },
    "answer": "A",
    "explanation": "Lựa chọn hành vi lễ phép khi gặp người lớn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_9",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 10,
    "question": "Khi đến nhà người lớn, em sẽ làm gì đầu tiên? (Tình huống 2)",
    "options": {
      "A": "Khoanh tay chúc tết",
      "B": "Chạy đi chơi",
      "C": "Đòi lì xì",
      "D": "Im lặng"
    },
    "answer": "A",
    "explanation": "Lựa chọn hành vi lễ phép khi gặp người lớn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_10",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 11,
    "question": "Khi đến nhà người lớn, em sẽ làm gì đầu tiên? (Tình huống 3)",
    "options": {
      "A": "Khoanh tay chúc tết",
      "B": "Chạy đi chơi",
      "C": "Đòi lì xì",
      "D": "Im lặng"
    },
    "answer": "A",
    "explanation": "Lựa chọn hành vi lễ phép khi gặp người lớn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_11",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 12,
    "question": "Khi đến nhà người lớn, em sẽ làm gì đầu tiên? (Tình huống 4)",
    "options": {
      "A": "Khoanh tay chúc tết",
      "B": "Chạy đi chơi",
      "C": "Đòi lì xì",
      "D": "Im lặng"
    },
    "answer": "A",
    "explanation": "Lựa chọn hành vi lễ phép khi gặp người lớn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_12",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 13,
    "question": "Bạn A nhận lì xì và xé ngay trước mặt khách. Em đánh giá thế nào? (Tình huống 1)",
    "options": {
      "A": "Rất vô lễ",
      "B": "Bình thường",
      "C": "Nên làm thế",
      "D": "Không sao"
    },
    "answer": "A",
    "explanation": "Đánh giá hành vi sai trái khi nhận lì xì.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_13",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 14,
    "question": "Bạn A nhận lì xì và xé ngay trước mặt khách. Em đánh giá thế nào? (Tình huống 2)",
    "options": {
      "A": "Rất vô lễ",
      "B": "Bình thường",
      "C": "Nên làm thế",
      "D": "Không sao"
    },
    "answer": "A",
    "explanation": "Đánh giá hành vi sai trái khi nhận lì xì.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_14",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 15,
    "question": "Bạn A nhận lì xì và xé ngay trước mặt khách. Em đánh giá thế nào? (Tình huống 3)",
    "options": {
      "A": "Rất vô lễ",
      "B": "Bình thường",
      "C": "Nên làm thế",
      "D": "Không sao"
    },
    "answer": "A",
    "explanation": "Đánh giá hành vi sai trái khi nhận lì xì.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_15",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 16,
    "question": "Bạn A nhận lì xì và xé ngay trước mặt khách. Em đánh giá thế nào? (Tình huống 4)",
    "options": {
      "A": "Rất vô lễ",
      "B": "Bình thường",
      "C": "Nên làm thế",
      "D": "Không sao"
    },
    "answer": "A",
    "explanation": "Đánh giá hành vi sai trái khi nhận lì xì.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_16",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 17,
    "question": "Em sẽ áp dụng cách chúc tết ông bà thế nào vào năm nay? (Tình huống 1)",
    "options": {
      "A": "Tự chuẩn bị câu chúc ý nghĩa",
      "B": "Đợi bố mẹ nhắc",
      "C": "Chỉ chúc khi có lì xì",
      "D": "Không chúc"
    },
    "answer": "A",
    "explanation": "Vận dụng kỹ năng vào thực tế của bản thân.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_17",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 18,
    "question": "Em sẽ áp dụng cách chúc tết ông bà thế nào vào năm nay? (Tình huống 2)",
    "options": {
      "A": "Tự chuẩn bị câu chúc ý nghĩa",
      "B": "Đợi bố mẹ nhắc",
      "C": "Chỉ chúc khi có lì xì",
      "D": "Không chúc"
    },
    "answer": "A",
    "explanation": "Vận dụng kỹ năng vào thực tế của bản thân.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_18",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 19,
    "question": "Em sẽ áp dụng cách chúc tết ông bà thế nào vào năm nay? (Tình huống 3)",
    "options": {
      "A": "Tự chuẩn bị câu chúc ý nghĩa",
      "B": "Đợi bố mẹ nhắc",
      "C": "Chỉ chúc khi có lì xì",
      "D": "Không chúc"
    },
    "answer": "A",
    "explanation": "Vận dụng kỹ năng vào thực tế của bản thân.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_19",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 20,
    "question": "Em sẽ áp dụng cách chúc tết ông bà thế nào vào năm nay? (Tình huống 4)",
    "options": {
      "A": "Tự chuẩn bị câu chúc ý nghĩa",
      "B": "Đợi bố mẹ nhắc",
      "C": "Chỉ chúc khi có lì xì",
      "D": "Không chúc"
    },
    "answer": "A",
    "explanation": "Vận dụng kỹ năng vào thực tế của bản thân.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chúc tết",
    "id": "Chúc_tết_20",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 1,
    "question": "Thuyết trình là gì? (Tình huống 1)",
    "options": {
      "A": "Trình bày thông tin trước người khác",
      "B": "Đọc sách một mình",
      "C": "Hát karaoke",
      "D": "Viết bài"
    },
    "answer": "A",
    "explanation": "Biết khái niệm cơ bản về thuyết trình.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_1",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 2,
    "question": "Thuyết trình là gì? (Tình huống 2)",
    "options": {
      "A": "Trình bày thông tin trước người khác",
      "B": "Đọc sách một mình",
      "C": "Hát karaoke",
      "D": "Viết bài"
    },
    "answer": "A",
    "explanation": "Biết khái niệm cơ bản về thuyết trình.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_2",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 3,
    "question": "Thuyết trình là gì? (Tình huống 3)",
    "options": {
      "A": "Trình bày thông tin trước người khác",
      "B": "Đọc sách một mình",
      "C": "Hát karaoke",
      "D": "Viết bài"
    },
    "answer": "A",
    "explanation": "Biết khái niệm cơ bản về thuyết trình.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_3",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 4,
    "question": "Thuyết trình là gì? (Tình huống 4)",
    "options": {
      "A": "Trình bày thông tin trước người khác",
      "B": "Đọc sách một mình",
      "C": "Hát karaoke",
      "D": "Viết bài"
    },
    "answer": "A",
    "explanation": "Biết khái niệm cơ bản về thuyết trình.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_4",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 5,
    "question": "Tại sao cần giao tiếp bằng mắt khi thuyết trình? (Tình huống 1)",
    "options": {
      "A": "Để kết nối với khán giả",
      "B": "Để dọa khán giả",
      "C": "Để nhìn trần nhà",
      "D": "Không cần thiết"
    },
    "answer": "A",
    "explanation": "Hiểu lý do của ngôn ngữ cơ thể.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_5",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 6,
    "question": "Tại sao cần giao tiếp bằng mắt khi thuyết trình? (Tình huống 2)",
    "options": {
      "A": "Để kết nối với khán giả",
      "B": "Để dọa khán giả",
      "C": "Để nhìn trần nhà",
      "D": "Không cần thiết"
    },
    "answer": "A",
    "explanation": "Hiểu lý do của ngôn ngữ cơ thể.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_6",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 7,
    "question": "Tại sao cần giao tiếp bằng mắt khi thuyết trình? (Tình huống 3)",
    "options": {
      "A": "Để kết nối với khán giả",
      "B": "Để dọa khán giả",
      "C": "Để nhìn trần nhà",
      "D": "Không cần thiết"
    },
    "answer": "A",
    "explanation": "Hiểu lý do của ngôn ngữ cơ thể.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_7",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 8,
    "question": "Tại sao cần giao tiếp bằng mắt khi thuyết trình? (Tình huống 4)",
    "options": {
      "A": "Để kết nối với khán giả",
      "B": "Để dọa khán giả",
      "C": "Để nhìn trần nhà",
      "D": "Không cần thiết"
    },
    "answer": "A",
    "explanation": "Hiểu lý do của ngôn ngữ cơ thể.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_8",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 9,
    "question": "Khi quên lời lúc thuyết trình, em nên làm gì? (Tình huống 1)",
    "options": {
      "A": "Bình tĩnh xem lại dàn ý",
      "B": "Khóc",
      "C": "Bỏ chạy",
      "D": "Đứng im mãi mãi"
    },
    "answer": "A",
    "explanation": "Xử lý tình huống khi gặp sự cố.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_9",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 10,
    "question": "Khi quên lời lúc thuyết trình, em nên làm gì? (Tình huống 2)",
    "options": {
      "A": "Bình tĩnh xem lại dàn ý",
      "B": "Khóc",
      "C": "Bỏ chạy",
      "D": "Đứng im mãi mãi"
    },
    "answer": "A",
    "explanation": "Xử lý tình huống khi gặp sự cố.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_10",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 11,
    "question": "Khi quên lời lúc thuyết trình, em nên làm gì? (Tình huống 3)",
    "options": {
      "A": "Bình tĩnh xem lại dàn ý",
      "B": "Khóc",
      "C": "Bỏ chạy",
      "D": "Đứng im mãi mãi"
    },
    "answer": "A",
    "explanation": "Xử lý tình huống khi gặp sự cố.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_11",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 12,
    "question": "Khi quên lời lúc thuyết trình, em nên làm gì? (Tình huống 4)",
    "options": {
      "A": "Bình tĩnh xem lại dàn ý",
      "B": "Khóc",
      "C": "Bỏ chạy",
      "D": "Đứng im mãi mãi"
    },
    "answer": "A",
    "explanation": "Xử lý tình huống khi gặp sự cố.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_12",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 13,
    "question": "Bạn B nói rất nhỏ và cúi gằm mặt. Đánh giá kỹ năng của B? (Tình huống 1)",
    "options": {
      "A": "Cần tự tin và nói to hơn",
      "B": "Rất xuất sắc",
      "C": "Nên giữ nguyên",
      "D": "Tốt rồi"
    },
    "answer": "A",
    "explanation": "Nhận xét và rút kinh nghiệm từ bạn.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_13",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 14,
    "question": "Bạn B nói rất nhỏ và cúi gằm mặt. Đánh giá kỹ năng của B? (Tình huống 2)",
    "options": {
      "A": "Cần tự tin và nói to hơn",
      "B": "Rất xuất sắc",
      "C": "Nên giữ nguyên",
      "D": "Tốt rồi"
    },
    "answer": "A",
    "explanation": "Nhận xét và rút kinh nghiệm từ bạn.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_14",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 15,
    "question": "Bạn B nói rất nhỏ và cúi gằm mặt. Đánh giá kỹ năng của B? (Tình huống 3)",
    "options": {
      "A": "Cần tự tin và nói to hơn",
      "B": "Rất xuất sắc",
      "C": "Nên giữ nguyên",
      "D": "Tốt rồi"
    },
    "answer": "A",
    "explanation": "Nhận xét và rút kinh nghiệm từ bạn.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_15",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 16,
    "question": "Bạn B nói rất nhỏ và cúi gằm mặt. Đánh giá kỹ năng của B? (Tình huống 4)",
    "options": {
      "A": "Cần tự tin và nói to hơn",
      "B": "Rất xuất sắc",
      "C": "Nên giữ nguyên",
      "D": "Tốt rồi"
    },
    "answer": "A",
    "explanation": "Nhận xét và rút kinh nghiệm từ bạn.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_16",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 17,
    "question": "Để thuyết trình tốt bài tập ngày mai, em sẽ làm gì tối nay? (Tình huống 1)",
    "options": {
      "A": "Luyện tập trước gương",
      "B": "Chơi game",
      "C": "Đi ngủ sớm không cần chuẩn bị",
      "D": "Nhờ bạn làm hộ"
    },
    "answer": "A",
    "explanation": "Chuẩn bị thực tiễn cho nhiệm vụ.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_17",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 18,
    "question": "Để thuyết trình tốt bài tập ngày mai, em sẽ làm gì tối nay? (Tình huống 2)",
    "options": {
      "A": "Luyện tập trước gương",
      "B": "Chơi game",
      "C": "Đi ngủ sớm không cần chuẩn bị",
      "D": "Nhờ bạn làm hộ"
    },
    "answer": "A",
    "explanation": "Chuẩn bị thực tiễn cho nhiệm vụ.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_18",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 19,
    "question": "Để thuyết trình tốt bài tập ngày mai, em sẽ làm gì tối nay? (Tình huống 3)",
    "options": {
      "A": "Luyện tập trước gương",
      "B": "Chơi game",
      "C": "Đi ngủ sớm không cần chuẩn bị",
      "D": "Nhờ bạn làm hộ"
    },
    "answer": "A",
    "explanation": "Chuẩn bị thực tiễn cho nhiệm vụ.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_19",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 20,
    "question": "Để thuyết trình tốt bài tập ngày mai, em sẽ làm gì tối nay? (Tình huống 4)",
    "options": {
      "A": "Luyện tập trước gương",
      "B": "Chơi game",
      "C": "Đi ngủ sớm không cần chuẩn bị",
      "D": "Nhờ bạn làm hộ"
    },
    "answer": "A",
    "explanation": "Chuẩn bị thực tiễn cho nhiệm vụ.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Kĩ năng thuyết trình",
    "id": "Kĩ_năng_thuyết_trình_20",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 1,
    "question": "Biểu hiện của việc lắng nghe là gì? (Tình huống 1)",
    "options": {
      "A": "Mắt nhìn người nói",
      "B": "Bấm điện thoại",
      "C": "Nói chuyện riêng",
      "D": "Ngủ gật"
    },
    "answer": "A",
    "explanation": "Nhận biết hành vi lắng nghe tích cực.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_1",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 2,
    "question": "Biểu hiện của việc lắng nghe là gì? (Tình huống 2)",
    "options": {
      "A": "Mắt nhìn người nói",
      "B": "Bấm điện thoại",
      "C": "Nói chuyện riêng",
      "D": "Ngủ gật"
    },
    "answer": "A",
    "explanation": "Nhận biết hành vi lắng nghe tích cực.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_2",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 3,
    "question": "Biểu hiện của việc lắng nghe là gì? (Tình huống 3)",
    "options": {
      "A": "Mắt nhìn người nói",
      "B": "Bấm điện thoại",
      "C": "Nói chuyện riêng",
      "D": "Ngủ gật"
    },
    "answer": "A",
    "explanation": "Nhận biết hành vi lắng nghe tích cực.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_3",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 4,
    "question": "Biểu hiện của việc lắng nghe là gì? (Tình huống 4)",
    "options": {
      "A": "Mắt nhìn người nói",
      "B": "Bấm điện thoại",
      "C": "Nói chuyện riêng",
      "D": "Ngủ gật"
    },
    "answer": "A",
    "explanation": "Nhận biết hành vi lắng nghe tích cực.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_4",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 5,
    "question": "Lắng nghe giúp chúng ta điều gì? (Tình huống 1)",
    "options": {
      "A": "Hiểu đúng vấn đề",
      "B": "Mất thời gian",
      "C": "Cãi nhau dễ hơn",
      "D": "Không có tác dụng"
    },
    "answer": "A",
    "explanation": "Hiểu lợi ích của việc lắng nghe.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_5",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 6,
    "question": "Lắng nghe giúp chúng ta điều gì? (Tình huống 2)",
    "options": {
      "A": "Hiểu đúng vấn đề",
      "B": "Mất thời gian",
      "C": "Cãi nhau dễ hơn",
      "D": "Không có tác dụng"
    },
    "answer": "A",
    "explanation": "Hiểu lợi ích của việc lắng nghe.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_6",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 7,
    "question": "Lắng nghe giúp chúng ta điều gì? (Tình huống 3)",
    "options": {
      "A": "Hiểu đúng vấn đề",
      "B": "Mất thời gian",
      "C": "Cãi nhau dễ hơn",
      "D": "Không có tác dụng"
    },
    "answer": "A",
    "explanation": "Hiểu lợi ích của việc lắng nghe.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_7",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 8,
    "question": "Lắng nghe giúp chúng ta điều gì? (Tình huống 4)",
    "options": {
      "A": "Hiểu đúng vấn đề",
      "B": "Mất thời gian",
      "C": "Cãi nhau dễ hơn",
      "D": "Không có tác dụng"
    },
    "answer": "A",
    "explanation": "Hiểu lợi ích của việc lắng nghe.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_8",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 9,
    "question": "Khi bạn đang kể chuyện buồn, em sẽ? (Tình huống 1)",
    "options": {
      "A": "Im lặng lắng nghe và an ủi",
      "B": "Cười to",
      "C": "Kể chuyện khác",
      "D": "Bỏ đi"
    },
    "answer": "A",
    "explanation": "Chọn phản ứng phù hợp với cảm xúc của bạn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_9",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 10,
    "question": "Khi bạn đang kể chuyện buồn, em sẽ? (Tình huống 2)",
    "options": {
      "A": "Im lặng lắng nghe và an ủi",
      "B": "Cười to",
      "C": "Kể chuyện khác",
      "D": "Bỏ đi"
    },
    "answer": "A",
    "explanation": "Chọn phản ứng phù hợp với cảm xúc của bạn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_10",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 11,
    "question": "Khi bạn đang kể chuyện buồn, em sẽ? (Tình huống 3)",
    "options": {
      "A": "Im lặng lắng nghe và an ủi",
      "B": "Cười to",
      "C": "Kể chuyện khác",
      "D": "Bỏ đi"
    },
    "answer": "A",
    "explanation": "Chọn phản ứng phù hợp với cảm xúc của bạn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_11",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 12,
    "question": "Khi bạn đang kể chuyện buồn, em sẽ? (Tình huống 4)",
    "options": {
      "A": "Im lặng lắng nghe và an ủi",
      "B": "Cười to",
      "C": "Kể chuyện khác",
      "D": "Bỏ đi"
    },
    "answer": "A",
    "explanation": "Chọn phản ứng phù hợp với cảm xúc của bạn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_12",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 13,
    "question": "Bạn C vừa nghe giảng vừa vẽ bậy. Hành vi này đúng hay sai? (Tình huống 1)",
    "options": {
      "A": "Sai, không tôn trọng giáo viên",
      "B": "Đúng",
      "C": "Bình thường",
      "D": "Rất sáng tạo"
    },
    "answer": "A",
    "explanation": "Đánh giá sự tập trung trong học tập.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_13",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 14,
    "question": "Bạn C vừa nghe giảng vừa vẽ bậy. Hành vi này đúng hay sai? (Tình huống 2)",
    "options": {
      "A": "Sai, không tôn trọng giáo viên",
      "B": "Đúng",
      "C": "Bình thường",
      "D": "Rất sáng tạo"
    },
    "answer": "A",
    "explanation": "Đánh giá sự tập trung trong học tập.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_14",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 15,
    "question": "Bạn C vừa nghe giảng vừa vẽ bậy. Hành vi này đúng hay sai? (Tình huống 3)",
    "options": {
      "A": "Sai, không tôn trọng giáo viên",
      "B": "Đúng",
      "C": "Bình thường",
      "D": "Rất sáng tạo"
    },
    "answer": "A",
    "explanation": "Đánh giá sự tập trung trong học tập.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_15",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 16,
    "question": "Bạn C vừa nghe giảng vừa vẽ bậy. Hành vi này đúng hay sai? (Tình huống 4)",
    "options": {
      "A": "Sai, không tôn trọng giáo viên",
      "B": "Đúng",
      "C": "Bình thường",
      "D": "Rất sáng tạo"
    },
    "answer": "A",
    "explanation": "Đánh giá sự tập trung trong học tập.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_16",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 17,
    "question": "Em áp dụng kỹ năng lắng nghe ở nhà như thế nào? (Tình huống 1)",
    "options": {
      "A": "Chú ý nghe lời bố mẹ dặn dò",
      "B": "Bật tivi to khi mẹ nói",
      "C": "Chỉ nghe điều mình thích",
      "D": "Bỏ ngoài tai"
    },
    "answer": "A",
    "explanation": "Vận dụng vào đời sống gia đình.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_17",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 18,
    "question": "Em áp dụng kỹ năng lắng nghe ở nhà như thế nào? (Tình huống 2)",
    "options": {
      "A": "Chú ý nghe lời bố mẹ dặn dò",
      "B": "Bật tivi to khi mẹ nói",
      "C": "Chỉ nghe điều mình thích",
      "D": "Bỏ ngoài tai"
    },
    "answer": "A",
    "explanation": "Vận dụng vào đời sống gia đình.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_18",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 19,
    "question": "Em áp dụng kỹ năng lắng nghe ở nhà như thế nào? (Tình huống 3)",
    "options": {
      "A": "Chú ý nghe lời bố mẹ dặn dò",
      "B": "Bật tivi to khi mẹ nói",
      "C": "Chỉ nghe điều mình thích",
      "D": "Bỏ ngoài tai"
    },
    "answer": "A",
    "explanation": "Vận dụng vào đời sống gia đình.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_19",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 20,
    "question": "Em áp dụng kỹ năng lắng nghe ở nhà như thế nào? (Tình huống 4)",
    "options": {
      "A": "Chú ý nghe lời bố mẹ dặn dò",
      "B": "Bật tivi to khi mẹ nói",
      "C": "Chỉ nghe điều mình thích",
      "D": "Bỏ ngoài tai"
    },
    "answer": "A",
    "explanation": "Vận dụng vào đời sống gia đình.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Lắng nghe",
    "id": "Lắng_nghe_20",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 1,
    "question": "Hành động nào thể hiện sự tôn trọng thầy cô? (Tình huống 1)",
    "options": {
      "A": "Chào hỏi lễ phép",
      "B": "Lờ đi",
      "C": "Trêu đùa quá trớn",
      "D": "Nói leo"
    },
    "answer": "A",
    "explanation": "Nhận biết hành vi chuẩn mực.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_1",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 2,
    "question": "Hành động nào thể hiện sự tôn trọng thầy cô? (Tình huống 2)",
    "options": {
      "A": "Chào hỏi lễ phép",
      "B": "Lờ đi",
      "C": "Trêu đùa quá trớn",
      "D": "Nói leo"
    },
    "answer": "A",
    "explanation": "Nhận biết hành vi chuẩn mực.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_2",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 3,
    "question": "Hành động nào thể hiện sự tôn trọng thầy cô? (Tình huống 3)",
    "options": {
      "A": "Chào hỏi lễ phép",
      "B": "Lờ đi",
      "C": "Trêu đùa quá trớn",
      "D": "Nói leo"
    },
    "answer": "A",
    "explanation": "Nhận biết hành vi chuẩn mực.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_3",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 4,
    "question": "Hành động nào thể hiện sự tôn trọng thầy cô? (Tình huống 4)",
    "options": {
      "A": "Chào hỏi lễ phép",
      "B": "Lờ đi",
      "C": "Trêu đùa quá trớn",
      "D": "Nói leo"
    },
    "answer": "A",
    "explanation": "Nhận biết hành vi chuẩn mực.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_4",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 5,
    "question": "Tại sao phải tôn trọng thầy cô? (Tình huống 1)",
    "options": {
      "A": "Vì thầy cô dạy dỗ chúng ta",
      "B": "Vì sợ bị phạt",
      "C": "Vì bị bắt buộc",
      "D": "Không cần thiết"
    },
    "answer": "A",
    "explanation": "Hiểu đạo lý tôn sư trọng đạo.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_5",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 6,
    "question": "Tại sao phải tôn trọng thầy cô? (Tình huống 2)",
    "options": {
      "A": "Vì thầy cô dạy dỗ chúng ta",
      "B": "Vì sợ bị phạt",
      "C": "Vì bị bắt buộc",
      "D": "Không cần thiết"
    },
    "answer": "A",
    "explanation": "Hiểu đạo lý tôn sư trọng đạo.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_6",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 7,
    "question": "Tại sao phải tôn trọng thầy cô? (Tình huống 3)",
    "options": {
      "A": "Vì thầy cô dạy dỗ chúng ta",
      "B": "Vì sợ bị phạt",
      "C": "Vì bị bắt buộc",
      "D": "Không cần thiết"
    },
    "answer": "A",
    "explanation": "Hiểu đạo lý tôn sư trọng đạo.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_7",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 8,
    "question": "Tại sao phải tôn trọng thầy cô? (Tình huống 4)",
    "options": {
      "A": "Vì thầy cô dạy dỗ chúng ta",
      "B": "Vì sợ bị phạt",
      "C": "Vì bị bắt buộc",
      "D": "Không cần thiết"
    },
    "answer": "A",
    "explanation": "Hiểu đạo lý tôn sư trọng đạo.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_8",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 9,
    "question": "Thầy giáo đang xách nhiều đồ nặng, em sẽ làm gì? (Tình huống 1)",
    "options": {
      "A": "Chạy lại giúp thầy",
      "B": "Đứng nhìn",
      "C": "Tránh đi đường khác",
      "D": "Chỉ trỏ"
    },
    "answer": "A",
    "explanation": "Hành động thực tế thể hiện sự quan tâm.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_9",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 10,
    "question": "Thầy giáo đang xách nhiều đồ nặng, em sẽ làm gì? (Tình huống 2)",
    "options": {
      "A": "Chạy lại giúp thầy",
      "B": "Đứng nhìn",
      "C": "Tránh đi đường khác",
      "D": "Chỉ trỏ"
    },
    "answer": "A",
    "explanation": "Hành động thực tế thể hiện sự quan tâm.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_10",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 11,
    "question": "Thầy giáo đang xách nhiều đồ nặng, em sẽ làm gì? (Tình huống 3)",
    "options": {
      "A": "Chạy lại giúp thầy",
      "B": "Đứng nhìn",
      "C": "Tránh đi đường khác",
      "D": "Chỉ trỏ"
    },
    "answer": "A",
    "explanation": "Hành động thực tế thể hiện sự quan tâm.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_11",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 12,
    "question": "Thầy giáo đang xách nhiều đồ nặng, em sẽ làm gì? (Tình huống 4)",
    "options": {
      "A": "Chạy lại giúp thầy",
      "B": "Đứng nhìn",
      "C": "Tránh đi đường khác",
      "D": "Chỉ trỏ"
    },
    "answer": "A",
    "explanation": "Hành động thực tế thể hiện sự quan tâm.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_12",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 13,
    "question": "Bạn D cãi lại cô giáo khi bị nhắc nhở. Em thấy sao? (Tình huống 1)",
    "options": {
      "A": "Hành vi sai, cần xin lỗi cô",
      "B": "Rất dũng cảm",
      "C": "Bình thường",
      "D": "Nên làm vậy"
    },
    "answer": "A",
    "explanation": "Phân biệt đúng sai trong giao tiếp.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_13",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 14,
    "question": "Bạn D cãi lại cô giáo khi bị nhắc nhở. Em thấy sao? (Tình huống 2)",
    "options": {
      "A": "Hành vi sai, cần xin lỗi cô",
      "B": "Rất dũng cảm",
      "C": "Bình thường",
      "D": "Nên làm vậy"
    },
    "answer": "A",
    "explanation": "Phân biệt đúng sai trong giao tiếp.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_14",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 15,
    "question": "Bạn D cãi lại cô giáo khi bị nhắc nhở. Em thấy sao? (Tình huống 3)",
    "options": {
      "A": "Hành vi sai, cần xin lỗi cô",
      "B": "Rất dũng cảm",
      "C": "Bình thường",
      "D": "Nên làm vậy"
    },
    "answer": "A",
    "explanation": "Phân biệt đúng sai trong giao tiếp.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_15",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 16,
    "question": "Bạn D cãi lại cô giáo khi bị nhắc nhở. Em thấy sao? (Tình huống 4)",
    "options": {
      "A": "Hành vi sai, cần xin lỗi cô",
      "B": "Rất dũng cảm",
      "C": "Bình thường",
      "D": "Nên làm vậy"
    },
    "answer": "A",
    "explanation": "Phân biệt đúng sai trong giao tiếp.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_16",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 17,
    "question": "Em sẽ làm gì để thể hiện sự tôn trọng cô giáo mới? (Tình huống 1)",
    "options": {
      "A": "Lắng nghe cô giảng bài và phát biểu",
      "B": "Nói chuyện riêng",
      "C": "Kiểm tra kiến thức của cô",
      "D": "Không quan tâm"
    },
    "answer": "A",
    "explanation": "Áp dụng thái độ tích cực trong môi trường học.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_17",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 18,
    "question": "Em sẽ làm gì để thể hiện sự tôn trọng cô giáo mới? (Tình huống 2)",
    "options": {
      "A": "Lắng nghe cô giảng bài và phát biểu",
      "B": "Nói chuyện riêng",
      "C": "Kiểm tra kiến thức của cô",
      "D": "Không quan tâm"
    },
    "answer": "A",
    "explanation": "Áp dụng thái độ tích cực trong môi trường học.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_18",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 19,
    "question": "Em sẽ làm gì để thể hiện sự tôn trọng cô giáo mới? (Tình huống 3)",
    "options": {
      "A": "Lắng nghe cô giảng bài và phát biểu",
      "B": "Nói chuyện riêng",
      "C": "Kiểm tra kiến thức của cô",
      "D": "Không quan tâm"
    },
    "answer": "A",
    "explanation": "Áp dụng thái độ tích cực trong môi trường học.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_19",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 20,
    "question": "Em sẽ làm gì để thể hiện sự tôn trọng cô giáo mới? (Tình huống 4)",
    "options": {
      "A": "Lắng nghe cô giảng bài và phát biểu",
      "B": "Nói chuyện riêng",
      "C": "Kiểm tra kiến thức của cô",
      "D": "Không quan tâm"
    },
    "answer": "A",
    "explanation": "Áp dụng thái độ tích cực trong môi trường học.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Thể hiện sự tôn trọng với thầy cô",
    "id": "Thể_hiện_sự_tôn_trọng_với_thầy_cô_20",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 1,
    "question": "Cách thể hiện tình yêu thương thầy cô là? (Tình huống 1)",
    "options": {
      "A": "Tặng thiệp do mình tự làm",
      "B": "Trốn học",
      "C": "Phá đồ của lớp",
      "D": "Làm ồn"
    },
    "answer": "A",
    "explanation": "Nhận biết cách biểu đạt tình cảm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_1",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 2,
    "question": "Cách thể hiện tình yêu thương thầy cô là? (Tình huống 2)",
    "options": {
      "A": "Tặng thiệp do mình tự làm",
      "B": "Trốn học",
      "C": "Phá đồ của lớp",
      "D": "Làm ồn"
    },
    "answer": "A",
    "explanation": "Nhận biết cách biểu đạt tình cảm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_2",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 3,
    "question": "Cách thể hiện tình yêu thương thầy cô là? (Tình huống 3)",
    "options": {
      "A": "Tặng thiệp do mình tự làm",
      "B": "Trốn học",
      "C": "Phá đồ của lớp",
      "D": "Làm ồn"
    },
    "answer": "A",
    "explanation": "Nhận biết cách biểu đạt tình cảm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_3",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 4,
    "question": "Cách thể hiện tình yêu thương thầy cô là? (Tình huống 4)",
    "options": {
      "A": "Tặng thiệp do mình tự làm",
      "B": "Trốn học",
      "C": "Phá đồ của lớp",
      "D": "Làm ồn"
    },
    "answer": "A",
    "explanation": "Nhận biết cách biểu đạt tình cảm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_4",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 5,
    "question": "Tình yêu thương thầy cô mang lại điều gì? (Tình huống 1)",
    "options": {
      "A": "Sự gắn kết và niềm vui",
      "B": "Sự mệt mỏi",
      "C": "Điểm số cao",
      "D": "Không gì cả"
    },
    "answer": "A",
    "explanation": "Hiểu giá trị của tình cảm thầy trò.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_5",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 6,
    "question": "Tình yêu thương thầy cô mang lại điều gì? (Tình huống 2)",
    "options": {
      "A": "Sự gắn kết và niềm vui",
      "B": "Sự mệt mỏi",
      "C": "Điểm số cao",
      "D": "Không gì cả"
    },
    "answer": "A",
    "explanation": "Hiểu giá trị của tình cảm thầy trò.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_6",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 7,
    "question": "Tình yêu thương thầy cô mang lại điều gì? (Tình huống 3)",
    "options": {
      "A": "Sự gắn kết và niềm vui",
      "B": "Sự mệt mỏi",
      "C": "Điểm số cao",
      "D": "Không gì cả"
    },
    "answer": "A",
    "explanation": "Hiểu giá trị của tình cảm thầy trò.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_7",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 8,
    "question": "Tình yêu thương thầy cô mang lại điều gì? (Tình huống 4)",
    "options": {
      "A": "Sự gắn kết và niềm vui",
      "B": "Sự mệt mỏi",
      "C": "Điểm số cao",
      "D": "Không gì cả"
    },
    "answer": "A",
    "explanation": "Hiểu giá trị của tình cảm thầy trò.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_8",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 9,
    "question": "Cô giáo bị ốm giọng khàn, em nên làm gì? (Tình huống 1)",
    "options": {
      "A": "Giữ trật tự để cô không phải nói to",
      "B": "La hét",
      "C": "Bắt cô giảng lại nhiều lần",
      "D": "Không học nữa"
    },
    "answer": "A",
    "explanation": "Lựa chọn hành vi chia sẻ khó khăn với thầy cô.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_9",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 10,
    "question": "Cô giáo bị ốm giọng khàn, em nên làm gì? (Tình huống 2)",
    "options": {
      "A": "Giữ trật tự để cô không phải nói to",
      "B": "La hét",
      "C": "Bắt cô giảng lại nhiều lần",
      "D": "Không học nữa"
    },
    "answer": "A",
    "explanation": "Lựa chọn hành vi chia sẻ khó khăn với thầy cô.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_10",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 11,
    "question": "Cô giáo bị ốm giọng khàn, em nên làm gì? (Tình huống 3)",
    "options": {
      "A": "Giữ trật tự để cô không phải nói to",
      "B": "La hét",
      "C": "Bắt cô giảng lại nhiều lần",
      "D": "Không học nữa"
    },
    "answer": "A",
    "explanation": "Lựa chọn hành vi chia sẻ khó khăn với thầy cô.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_11",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 12,
    "question": "Cô giáo bị ốm giọng khàn, em nên làm gì? (Tình huống 4)",
    "options": {
      "A": "Giữ trật tự để cô không phải nói to",
      "B": "La hét",
      "C": "Bắt cô giảng lại nhiều lần",
      "D": "Không học nữa"
    },
    "answer": "A",
    "explanation": "Lựa chọn hành vi chia sẻ khó khăn với thầy cô.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_12",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 13,
    "question": "Nhóm bạn E cùng nhau làm thơ tặng thầy nhân ngày 20/11. Đánh giá? (Tình huống 1)",
    "options": {
      "A": "Rất đáng khen ngợi",
      "B": "Lãng phí thời gian",
      "C": "Không cần thiết",
      "D": "Kém cỏi"
    },
    "answer": "A",
    "explanation": "Đánh giá hoạt động tri ân.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_13",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 14,
    "question": "Nhóm bạn E cùng nhau làm thơ tặng thầy nhân ngày 20/11. Đánh giá? (Tình huống 2)",
    "options": {
      "A": "Rất đáng khen ngợi",
      "B": "Lãng phí thời gian",
      "C": "Không cần thiết",
      "D": "Kém cỏi"
    },
    "answer": "A",
    "explanation": "Đánh giá hoạt động tri ân.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_14",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 15,
    "question": "Nhóm bạn E cùng nhau làm thơ tặng thầy nhân ngày 20/11. Đánh giá? (Tình huống 3)",
    "options": {
      "A": "Rất đáng khen ngợi",
      "B": "Lãng phí thời gian",
      "C": "Không cần thiết",
      "D": "Kém cỏi"
    },
    "answer": "A",
    "explanation": "Đánh giá hoạt động tri ân.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_15",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 16,
    "question": "Nhóm bạn E cùng nhau làm thơ tặng thầy nhân ngày 20/11. Đánh giá? (Tình huống 4)",
    "options": {
      "A": "Rất đáng khen ngợi",
      "B": "Lãng phí thời gian",
      "C": "Không cần thiết",
      "D": "Kém cỏi"
    },
    "answer": "A",
    "explanation": "Đánh giá hoạt động tri ân.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_16",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 17,
    "question": "Hằng ngày, em làm gì để thầy cô vui lòng? (Tình huống 1)",
    "options": {
      "A": "Chăm chỉ làm bài tập",
      "B": "Đến lớp trễ",
      "C": "Hay cãi bạn",
      "D": "Quên sách vở"
    },
    "answer": "A",
    "explanation": "Biến tình yêu thương thành hành động học tập tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_17",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 18,
    "question": "Hằng ngày, em làm gì để thầy cô vui lòng? (Tình huống 2)",
    "options": {
      "A": "Chăm chỉ làm bài tập",
      "B": "Đến lớp trễ",
      "C": "Hay cãi bạn",
      "D": "Quên sách vở"
    },
    "answer": "A",
    "explanation": "Biến tình yêu thương thành hành động học tập tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_18",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 19,
    "question": "Hằng ngày, em làm gì để thầy cô vui lòng? (Tình huống 3)",
    "options": {
      "A": "Chăm chỉ làm bài tập",
      "B": "Đến lớp trễ",
      "C": "Hay cãi bạn",
      "D": "Quên sách vở"
    },
    "answer": "A",
    "explanation": "Biến tình yêu thương thành hành động học tập tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_19",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 20,
    "question": "Hằng ngày, em làm gì để thầy cô vui lòng? (Tình huống 4)",
    "options": {
      "A": "Chăm chỉ làm bài tập",
      "B": "Đến lớp trễ",
      "C": "Hay cãi bạn",
      "D": "Quên sách vở"
    },
    "answer": "A",
    "explanation": "Biến tình yêu thương thành hành động học tập tốt.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Thể hiện tình yêu thương với thầy cô giáo",
    "id": "Thể_hiện_tình_yêu_thương_với_thầy_cô_giáo_20",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 1,
    "question": "Chia sẻ ý tưởng là gì? (Tình huống 1)",
    "options": {
      "A": "Nói ra suy nghĩ của mình cho người khác",
      "B": "Giấu kín không cho ai biết",
      "C": "Lấy ý tưởng của bạn",
      "D": "Chép bài"
    },
    "answer": "A",
    "explanation": "Biết định nghĩa về chia sẻ ý tưởng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_1",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 2,
    "question": "Chia sẻ ý tưởng là gì? (Tình huống 2)",
    "options": {
      "A": "Nói ra suy nghĩ của mình cho người khác",
      "B": "Giấu kín không cho ai biết",
      "C": "Lấy ý tưởng của bạn",
      "D": "Chép bài"
    },
    "answer": "A",
    "explanation": "Biết định nghĩa về chia sẻ ý tưởng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_2",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 3,
    "question": "Chia sẻ ý tưởng là gì? (Tình huống 3)",
    "options": {
      "A": "Nói ra suy nghĩ của mình cho người khác",
      "B": "Giấu kín không cho ai biết",
      "C": "Lấy ý tưởng của bạn",
      "D": "Chép bài"
    },
    "answer": "A",
    "explanation": "Biết định nghĩa về chia sẻ ý tưởng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_3",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 4,
    "question": "Chia sẻ ý tưởng là gì? (Tình huống 4)",
    "options": {
      "A": "Nói ra suy nghĩ của mình cho người khác",
      "B": "Giấu kín không cho ai biết",
      "C": "Lấy ý tưởng của bạn",
      "D": "Chép bài"
    },
    "answer": "A",
    "explanation": "Biết định nghĩa về chia sẻ ý tưởng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_4",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 5,
    "question": "Vì sao chúng ta nên chia sẻ ý tưởng trong làm việc nhóm? (Tình huống 1)",
    "options": {
      "A": "Để có nhiều sáng kiến hay hơn",
      "B": "Để cãi nhau",
      "C": "Để khoe khoang",
      "D": "Để được cô khen"
    },
    "answer": "A",
    "explanation": "Hiểu lợi ích của trí tuệ tập thể.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_5",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 6,
    "question": "Vì sao chúng ta nên chia sẻ ý tưởng trong làm việc nhóm? (Tình huống 2)",
    "options": {
      "A": "Để có nhiều sáng kiến hay hơn",
      "B": "Để cãi nhau",
      "C": "Để khoe khoang",
      "D": "Để được cô khen"
    },
    "answer": "A",
    "explanation": "Hiểu lợi ích của trí tuệ tập thể.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_6",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 7,
    "question": "Vì sao chúng ta nên chia sẻ ý tưởng trong làm việc nhóm? (Tình huống 3)",
    "options": {
      "A": "Để có nhiều sáng kiến hay hơn",
      "B": "Để cãi nhau",
      "C": "Để khoe khoang",
      "D": "Để được cô khen"
    },
    "answer": "A",
    "explanation": "Hiểu lợi ích của trí tuệ tập thể.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_7",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 8,
    "question": "Vì sao chúng ta nên chia sẻ ý tưởng trong làm việc nhóm? (Tình huống 4)",
    "options": {
      "A": "Để có nhiều sáng kiến hay hơn",
      "B": "Để cãi nhau",
      "C": "Để khoe khoang",
      "D": "Để được cô khen"
    },
    "answer": "A",
    "explanation": "Hiểu lợi ích của trí tuệ tập thể.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_8",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 9,
    "question": "Khi có một cách giải toán mới, em sẽ làm gì? (Tình huống 1)",
    "options": {
      "A": "Giơ tay phát biểu chia sẻ với lớp",
      "B": "Giấu đi",
      "C": "Sợ sai không dám nói",
      "D": "Bắt bạn phải làm theo"
    },
    "answer": "A",
    "explanation": "Dũng cảm thể hiện sáng kiến cá nhân.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_9",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 10,
    "question": "Khi có một cách giải toán mới, em sẽ làm gì? (Tình huống 2)",
    "options": {
      "A": "Giơ tay phát biểu chia sẻ với lớp",
      "B": "Giấu đi",
      "C": "Sợ sai không dám nói",
      "D": "Bắt bạn phải làm theo"
    },
    "answer": "A",
    "explanation": "Dũng cảm thể hiện sáng kiến cá nhân.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_10",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 11,
    "question": "Khi có một cách giải toán mới, em sẽ làm gì? (Tình huống 3)",
    "options": {
      "A": "Giơ tay phát biểu chia sẻ với lớp",
      "B": "Giấu đi",
      "C": "Sợ sai không dám nói",
      "D": "Bắt bạn phải làm theo"
    },
    "answer": "A",
    "explanation": "Dũng cảm thể hiện sáng kiến cá nhân.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_11",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 12,
    "question": "Khi có một cách giải toán mới, em sẽ làm gì? (Tình huống 4)",
    "options": {
      "A": "Giơ tay phát biểu chia sẻ với lớp",
      "B": "Giấu đi",
      "C": "Sợ sai không dám nói",
      "D": "Bắt bạn phải làm theo"
    },
    "answer": "A",
    "explanation": "Dũng cảm thể hiện sáng kiến cá nhân.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_12",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 13,
    "question": "Bạn F chê cười ý tưởng của người khác. Đánh giá hành vi? (Tình huống 1)",
    "options": {
      "A": "Không tốt, cần tôn trọng mọi ý kiến",
      "B": "Rất ngầu",
      "C": "Bình thường",
      "D": "Đúng đắn"
    },
    "answer": "A",
    "explanation": "Xây dựng thái độ tôn trọng ý tưởng.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_13",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 14,
    "question": "Bạn F chê cười ý tưởng của người khác. Đánh giá hành vi? (Tình huống 2)",
    "options": {
      "A": "Không tốt, cần tôn trọng mọi ý kiến",
      "B": "Rất ngầu",
      "C": "Bình thường",
      "D": "Đúng đắn"
    },
    "answer": "A",
    "explanation": "Xây dựng thái độ tôn trọng ý tưởng.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_14",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 15,
    "question": "Bạn F chê cười ý tưởng của người khác. Đánh giá hành vi? (Tình huống 3)",
    "options": {
      "A": "Không tốt, cần tôn trọng mọi ý kiến",
      "B": "Rất ngầu",
      "C": "Bình thường",
      "D": "Đúng đắn"
    },
    "answer": "A",
    "explanation": "Xây dựng thái độ tôn trọng ý tưởng.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_15",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 16,
    "question": "Bạn F chê cười ý tưởng của người khác. Đánh giá hành vi? (Tình huống 4)",
    "options": {
      "A": "Không tốt, cần tôn trọng mọi ý kiến",
      "B": "Rất ngầu",
      "C": "Bình thường",
      "D": "Đúng đắn"
    },
    "answer": "A",
    "explanation": "Xây dựng thái độ tôn trọng ý tưởng.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_16",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 17,
    "question": "Em có một ý tưởng trang trí lớp học, em sẽ làm gì? (Tình huống 1)",
    "options": {
      "A": "Vẽ phác thảo và trình bày với cô giáo",
      "B": "Ngồi im",
      "C": "Làm hỏng tường",
      "D": "Chê lớp xấu"
    },
    "answer": "A",
    "explanation": "Biến suy nghĩ thành kế hoạch cụ thể.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_17",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 18,
    "question": "Em có một ý tưởng trang trí lớp học, em sẽ làm gì? (Tình huống 2)",
    "options": {
      "A": "Vẽ phác thảo và trình bày với cô giáo",
      "B": "Ngồi im",
      "C": "Làm hỏng tường",
      "D": "Chê lớp xấu"
    },
    "answer": "A",
    "explanation": "Biến suy nghĩ thành kế hoạch cụ thể.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_18",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 19,
    "question": "Em có một ý tưởng trang trí lớp học, em sẽ làm gì? (Tình huống 3)",
    "options": {
      "A": "Vẽ phác thảo và trình bày với cô giáo",
      "B": "Ngồi im",
      "C": "Làm hỏng tường",
      "D": "Chê lớp xấu"
    },
    "answer": "A",
    "explanation": "Biến suy nghĩ thành kế hoạch cụ thể.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_19",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 20,
    "question": "Em có một ý tưởng trang trí lớp học, em sẽ làm gì? (Tình huống 4)",
    "options": {
      "A": "Vẽ phác thảo và trình bày với cô giáo",
      "B": "Ngồi im",
      "C": "Làm hỏng tường",
      "D": "Chê lớp xấu"
    },
    "answer": "A",
    "explanation": "Biến suy nghĩ thành kế hoạch cụ thể.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Chia sẻ ý tưởng",
    "id": "Chia_sẻ_ý_tưởng_20",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 1,
    "question": "Trách nhiệm cá nhân là gì? (Tình huống 1)",
    "options": {
      "A": "Tự giác hoàn thành nhiệm vụ của mình",
      "B": "Đổ lỗi cho người khác",
      "C": "Nhờ người khác làm hộ",
      "D": "Bỏ cuộc"
    },
    "answer": "A",
    "explanation": "Nhận biết khái niệm trách nhiệm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_1",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 2,
    "question": "Trách nhiệm cá nhân là gì? (Tình huống 2)",
    "options": {
      "A": "Tự giác hoàn thành nhiệm vụ của mình",
      "B": "Đổ lỗi cho người khác",
      "C": "Nhờ người khác làm hộ",
      "D": "Bỏ cuộc"
    },
    "answer": "A",
    "explanation": "Nhận biết khái niệm trách nhiệm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_2",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 3,
    "question": "Trách nhiệm cá nhân là gì? (Tình huống 3)",
    "options": {
      "A": "Tự giác hoàn thành nhiệm vụ của mình",
      "B": "Đổ lỗi cho người khác",
      "C": "Nhờ người khác làm hộ",
      "D": "Bỏ cuộc"
    },
    "answer": "A",
    "explanation": "Nhận biết khái niệm trách nhiệm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_3",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 4,
    "question": "Trách nhiệm cá nhân là gì? (Tình huống 4)",
    "options": {
      "A": "Tự giác hoàn thành nhiệm vụ của mình",
      "B": "Đổ lỗi cho người khác",
      "C": "Nhờ người khác làm hộ",
      "D": "Bỏ cuộc"
    },
    "answer": "A",
    "explanation": "Nhận biết khái niệm trách nhiệm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_4",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 5,
    "question": "Người có trách nhiệm sẽ nhận được gì? (Tình huống 1)",
    "options": {
      "A": "Sự tin tưởng của mọi người",
      "B": "Sự ghét bỏ",
      "C": "Hình phạt",
      "D": "Không có gì"
    },
    "answer": "A",
    "explanation": "Hiểu kết quả của lối sống có trách nhiệm.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_5",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 6,
    "question": "Người có trách nhiệm sẽ nhận được gì? (Tình huống 2)",
    "options": {
      "A": "Sự tin tưởng của mọi người",
      "B": "Sự ghét bỏ",
      "C": "Hình phạt",
      "D": "Không có gì"
    },
    "answer": "A",
    "explanation": "Hiểu kết quả của lối sống có trách nhiệm.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_6",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 7,
    "question": "Người có trách nhiệm sẽ nhận được gì? (Tình huống 3)",
    "options": {
      "A": "Sự tin tưởng của mọi người",
      "B": "Sự ghét bỏ",
      "C": "Hình phạt",
      "D": "Không có gì"
    },
    "answer": "A",
    "explanation": "Hiểu kết quả của lối sống có trách nhiệm.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_7",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 8,
    "question": "Người có trách nhiệm sẽ nhận được gì? (Tình huống 4)",
    "options": {
      "A": "Sự tin tưởng của mọi người",
      "B": "Sự ghét bỏ",
      "C": "Hình phạt",
      "D": "Không có gì"
    },
    "answer": "A",
    "explanation": "Hiểu kết quả của lối sống có trách nhiệm.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_8",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 9,
    "question": "Em lỡ làm vỡ bình hoa của lớp, em sẽ làm gì? (Tình huống 1)",
    "options": {
      "A": "Tự nhận lỗi và dọn dẹp",
      "B": "Đổ cho con mèo",
      "C": "Khóc lóc ăn vạ",
      "D": "Chạy trốn"
    },
    "answer": "A",
    "explanation": "Lựa chọn dũng cảm đối mặt với sai lầm.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_9",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 10,
    "question": "Em lỡ làm vỡ bình hoa của lớp, em sẽ làm gì? (Tình huống 2)",
    "options": {
      "A": "Tự nhận lỗi và dọn dẹp",
      "B": "Đổ cho con mèo",
      "C": "Khóc lóc ăn vạ",
      "D": "Chạy trốn"
    },
    "answer": "A",
    "explanation": "Lựa chọn dũng cảm đối mặt với sai lầm.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_10",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 11,
    "question": "Em lỡ làm vỡ bình hoa của lớp, em sẽ làm gì? (Tình huống 3)",
    "options": {
      "A": "Tự nhận lỗi và dọn dẹp",
      "B": "Đổ cho con mèo",
      "C": "Khóc lóc ăn vạ",
      "D": "Chạy trốn"
    },
    "answer": "A",
    "explanation": "Lựa chọn dũng cảm đối mặt với sai lầm.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_11",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 12,
    "question": "Em lỡ làm vỡ bình hoa của lớp, em sẽ làm gì? (Tình huống 4)",
    "options": {
      "A": "Tự nhận lỗi và dọn dẹp",
      "B": "Đổ cho con mèo",
      "C": "Khóc lóc ăn vạ",
      "D": "Chạy trốn"
    },
    "answer": "A",
    "explanation": "Lựa chọn dũng cảm đối mặt với sai lầm.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_12",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 13,
    "question": "Bạn G quên làm bài tập và nói dối là để quên vở. Đánh giá? (Tình huống 1)",
    "options": {
      "A": "Thiếu trung thực và vô trách nhiệm",
      "B": "Rất thông minh",
      "C": "Nên học tập",
      "D": "Không sao"
    },
    "answer": "A",
    "explanation": "Phê phán hành vi trốn tránh trách nhiệm.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_13",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 14,
    "question": "Bạn G quên làm bài tập và nói dối là để quên vở. Đánh giá? (Tình huống 2)",
    "options": {
      "A": "Thiếu trung thực và vô trách nhiệm",
      "B": "Rất thông minh",
      "C": "Nên học tập",
      "D": "Không sao"
    },
    "answer": "A",
    "explanation": "Phê phán hành vi trốn tránh trách nhiệm.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_14",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 15,
    "question": "Bạn G quên làm bài tập và nói dối là để quên vở. Đánh giá? (Tình huống 3)",
    "options": {
      "A": "Thiếu trung thực và vô trách nhiệm",
      "B": "Rất thông minh",
      "C": "Nên học tập",
      "D": "Không sao"
    },
    "answer": "A",
    "explanation": "Phê phán hành vi trốn tránh trách nhiệm.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_15",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 16,
    "question": "Bạn G quên làm bài tập và nói dối là để quên vở. Đánh giá? (Tình huống 4)",
    "options": {
      "A": "Thiếu trung thực và vô trách nhiệm",
      "B": "Rất thông minh",
      "C": "Nên học tập",
      "D": "Không sao"
    },
    "answer": "A",
    "explanation": "Phê phán hành vi trốn tránh trách nhiệm.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_16",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 17,
    "question": "Để rèn luyện tính trách nhiệm, em sẽ bắt đầu từ đâu? (Tình huống 1)",
    "options": {
      "A": "Tự giác gấp chăn màn mỗi sáng",
      "B": "Chờ mẹ nhắc",
      "C": "Làm qua loa",
      "D": "Không làm gì"
    },
    "answer": "A",
    "explanation": "Áp dụng vào công việc nhỏ hằng ngày.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_17",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 18,
    "question": "Để rèn luyện tính trách nhiệm, em sẽ bắt đầu từ đâu? (Tình huống 2)",
    "options": {
      "A": "Tự giác gấp chăn màn mỗi sáng",
      "B": "Chờ mẹ nhắc",
      "C": "Làm qua loa",
      "D": "Không làm gì"
    },
    "answer": "A",
    "explanation": "Áp dụng vào công việc nhỏ hằng ngày.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_18",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 19,
    "question": "Để rèn luyện tính trách nhiệm, em sẽ bắt đầu từ đâu? (Tình huống 3)",
    "options": {
      "A": "Tự giác gấp chăn màn mỗi sáng",
      "B": "Chờ mẹ nhắc",
      "C": "Làm qua loa",
      "D": "Không làm gì"
    },
    "answer": "A",
    "explanation": "Áp dụng vào công việc nhỏ hằng ngày.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_19",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 20,
    "question": "Để rèn luyện tính trách nhiệm, em sẽ bắt đầu từ đâu? (Tình huống 4)",
    "options": {
      "A": "Tự giác gấp chăn màn mỗi sáng",
      "B": "Chờ mẹ nhắc",
      "C": "Làm qua loa",
      "D": "Không làm gì"
    },
    "answer": "A",
    "explanation": "Áp dụng vào công việc nhỏ hằng ngày.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm cá nhân",
    "id": "Trách_nhiệm_cá_nhân_20",
    "group": "Thuyết trình & Học đường"
  },
  {
    "number": 1,
    "question": "Trách nhiệm của em trong gia đình là gì?",
    "options": {
      "A": "Chỉ việc học, không cần làm gì khác",
      "B": "Chia sẻ công việc nhà phù hợp với khả năng",
      "C": "Đòi hỏi bố mẹ phục vụ",
      "D": "Tự do vui chơi cả ngày"
    },
    "answer": "B",
    "explanation": "Học sinh tiểu học cần biết giúp đỡ bố mẹ những việc nhỏ vừa sức để thể hiện trách nhiệm.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_1",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 2,
    "question": "Việc nào sau đây thể hiện trách nhiệm với gia đình?",
    "options": {
      "A": "Vứt đồ chơi bừa bãi",
      "B": "Tự gấp chăn màn sau khi ngủ dậy",
      "C": "Chờ người lớn dọn dẹp phòng mình",
      "D": "Từ chối khi mẹ nhờ quét nhà"
    },
    "answer": "B",
    "explanation": "Tự gấp chăn màn là hành động cụ thể cho thấy ý thức tự giác và trách nhiệm với không gian sống.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_2",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 3,
    "question": "Ai là người cần phải có trách nhiệm trong gia đình?",
    "options": {
      "A": "Chỉ có bố mẹ",
      "B": "Chỉ có ông bà",
      "C": "Tất cả các thành viên trong gia đình",
      "D": "Chỉ những người lớn"
    },
    "answer": "C",
    "explanation": "Mọi thành viên, dù lớn hay nhỏ, đều có trách nhiệm đóng góp vào việc xây dựng gia đình hạnh phúc.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_3",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 4,
    "question": "Khi thấy ông bà mệt mỏi, em nên làm gì?",
    "options": {
      "A": "Bỏ đi chơi chỗ khác",
      "B": "Mở tivi thật to",
      "C": "Hỏi han và lấy nước cho ông bà",
      "D": "Trêu đùa làm ồn"
    },
    "answer": "C",
    "explanation": "Quan tâm, chăm sóc người thân là biểu hiện quan trọng của tình yêu thương và trách nhiệm gia đình.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_4",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 5,
    "question": "Tại sao em cần phụ giúp công việc nhà?",
    "options": {
      "A": "Để được bố mẹ cho tiền",
      "B": "Vì sợ bị phạt",
      "C": "Để san sẻ sự vất vả với bố mẹ",
      "D": "Để khoe với bạn bè"
    },
    "answer": "C",
    "explanation": "Phụ giúp việc nhà giúp gắn kết tình cảm, chia sẻ gánh nặng với người lớn, thể hiện sự hiểu chuyện.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_5",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 6,
    "question": "Điều gì sẽ xảy ra nếu không ai dọn dẹp nhà cửa?",
    "options": {
      "A": "Nhà cửa vẫn sạch sẽ tự nhiên",
      "B": "Không có ảnh hưởng gì",
      "C": "Nhà cửa bừa bộn, dễ sinh bệnh tật",
      "D": "Sẽ có người ngoài đến dọn giúp"
    },
    "answer": "C",
    "explanation": "Môi trường sống không được dọn dẹp sẽ trở nên bẩn thỉu, ảnh hưởng tới sức khỏe chung.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_6",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 7,
    "question": "Việc giữ gìn trật tự khi em bé ngủ mang ý nghĩa gì?",
    "options": {
      "A": "Tôn trọng không gian và giấc ngủ của người thân",
      "B": "Sợ bị mẹ mắng",
      "C": "Thích yên tĩnh",
      "D": "Không có ý nghĩa gì"
    },
    "answer": "A",
    "explanation": "Giữ im lặng thể hiện sự tinh tế, quan tâm đến nhu cầu nghỉ ngơi của người khác trong gia đình.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_7",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 8,
    "question": "Trách nhiệm gia đình giúp em phát triển đức tính nào?",
    "options": {
      "A": "Ích kỷ",
      "B": "Tự lập và biết quan tâm",
      "C": "Lười biếng",
      "D": "Phụ thuộc"
    },
    "answer": "B",
    "explanation": "Khi có trách nhiệm, học sinh sẽ học cách tự làm việc của mình và biết để ý giúp đỡ người xung quanh.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_8",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 9,
    "question": "Sau khi ăn cơm xong, em nên làm gì?",
    "options": {
      "A": "Chạy ra xem tivi ngay",
      "B": "Đợi mẹ dọn bát đĩa",
      "C": "Giúp thu dọn bát đĩa và lau bàn",
      "D": "Đi ngủ luôn"
    },
    "answer": "C",
    "explanation": "Chủ động dọn dẹp sau bữa ăn là hành vi đúng đắn, thể hiện việc áp dụng trách nhiệm vào thực tế.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_9",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 10,
    "question": "Mẹ đi làm về mệt, nhưng em lại muốn mẹ nấu món cầu kỳ. Em nên làm gì?",
    "options": {
      "A": "Cứ nằng nặc đòi mẹ nấu bằng được",
      "B": "Khóc lóc ăn vạ",
      "C": "Hiểu cho mẹ và cùng mẹ nấu món đơn giản",
      "D": "Bỏ bữa không ăn"
    },
    "answer": "C",
    "explanation": "Cảm thông và điều chỉnh mong muốn của mình cho phù hợp với hoàn cảnh của người lớn là lựa chọn sáng suốt.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_10",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 11,
    "question": "Đồ chơi vứt bừa bãi sau khi em và em trai chơi xong. Em xử lý thế nào?",
    "options": {
      "A": "Đổ lỗi cho em trai",
      "B": "Cùng em trai thu dọn gọn gàng",
      "C": "Bảo mẹ dọn",
      "D": "Đá đồ chơi vào gầm giường"
    },
    "answer": "B",
    "explanation": "Hợp tác cùng người chơi dọn dẹp thể hiện tính kỷ luật và trách nhiệm với đồ đạc của gia đình.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_11",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 12,
    "question": "Bố mẹ bận rộn chưa kịp đón em, em nên làm gì?",
    "options": {
      "A": "Tự ý đi bộ về nhà",
      "B": "Khóc lóc giữa trường",
      "C": "Ngồi đợi ở khu vực an toàn trong trường",
      "D": "Đi theo người lạ về nhà"
    },
    "answer": "C",
    "explanation": "Bảo vệ an toàn cho bản thân cũng là một cách để bố mẹ yên tâm, thể hiện trách nhiệm với gia đình.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_12",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 13,
    "question": "Lan luôn tự giác làm bài tập mà không cần bố mẹ nhắc nhở. Hành vi này đáng được đánh giá thế nào?",
    "options": {
      "A": "Rất đáng khen vì biết tự lập",
      "B": "Bình thường, ai cũng làm thế",
      "C": "Không cần thiết phải tự giác",
      "D": "Chỉ để lấy lòng bố mẹ"
    },
    "answer": "A",
    "explanation": "Tự giác học tập giúp bố mẹ đỡ lo lắng, là biểu hiện tuyệt vời của ý thức trách nhiệm cá nhân trong gia đình.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_13",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 14,
    "question": "Nam thường xuyên cãi lời ông bà và không chịu dọn phòng. Em thấy Nam làm vậy là đúng hay sai?",
    "options": {
      "A": "Đúng, vì Nam có quyền tự do",
      "B": "Sai, vì thiếu tôn trọng ông bà và vô trách nhiệm",
      "C": "Đúng, vì ông bà quá nghiêm khắc",
      "D": "Bình thường, trẻ con đều vậy"
    },
    "answer": "B",
    "explanation": "Cãi lời và bừa bộn là hành vi vi phạm chuẩn mực tôn trọng và trách nhiệm trong văn hóa gia đình.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_14",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 15,
    "question": "Hoa thấy mẹ đang xách đồ nặng nhưng Hoa lờ đi vì mải xem điện thoại. Đánh giá hành vi của Hoa:",
    "options": {
      "A": "Hành vi vô tâm, thiếu trách nhiệm",
      "B": "Hành vi bình thường",
      "C": "Hành vi chấp nhận được",
      "D": "Hoa làm đúng vì đang bận"
    },
    "answer": "A",
    "explanation": "Không giúp đỡ người thân khi họ cần là sự vô tâm, chưa thực hiện đúng trách nhiệm chia sẻ.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_15",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 16,
    "question": "Tuấn lấy tiền tiết kiệm mua thuốc cho bà khi bà ốm. Hành động này cho thấy Tuấn là người:",
    "options": {
      "A": "Lãng phí tiền",
      "B": "Hiếu thảo và có trách nhiệm",
      "C": "Thích khoe khoang",
      "D": "Không biết giữ tiền"
    },
    "answer": "B",
    "explanation": "Sử dụng tài sản cá nhân để chăm sóc sức khỏe người thân là hành vi cực kỳ đáng quý và có trách nhiệm.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_16",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 17,
    "question": "Nếu em muốn rèn luyện tinh thần trách nhiệm gia đình, em sẽ lập kế hoạch gì cho tuần tới?",
    "options": {
      "A": "Lên lịch xem phim mỗi tối",
      "B": "Đăng ký chơi game nhiều hơn",
      "C": "Lên lịch giúp mẹ rửa bát, đổ rác mỗi ngày",
      "D": "Xin thêm tiền tiêu vặt"
    },
    "answer": "C",
    "explanation": "Lập kế hoạch làm việc nhà đều đặn là cách vận dụng kiến thức vào thói quen hàng ngày để rèn luyện.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_17",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 18,
    "question": "Gia đình đang gặp khó khăn về tài chính, em nên thay đổi thói quen nào?",
    "options": {
      "A": "Vẫn đòi mua đồ chơi đắt tiền",
      "B": "Tiết kiệm điện, nước và không đòi hỏi mua sắm lãng phí",
      "C": "Giận dỗi vì không được đi chơi",
      "D": "Mặc kệ vì đó là việc của người lớn"
    },
    "answer": "B",
    "explanation": "Phản tư và thay đổi lối sống tiết kiệm cho thấy em biết vận dụng trách nhiệm để chia sẻ khó khăn thực tế.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_18",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 19,
    "question": "Trong dịp Tết, để thể hiện trách nhiệm với gia đình, em có thể làm gì?",
    "options": {
      "A": "Chỉ đi nhận lì xì",
      "B": "Ngủ cả ngày",
      "C": "Cùng bố mẹ dọn dẹp trang hoàng nhà cửa đón Tết",
      "D": "Tụ tập đi chơi từ sáng đến tối"
    },
    "answer": "C",
    "explanation": "Vận dụng vào dịp lễ Tết, việc chung tay dọn dẹp vừa tạo không khí vui tươi vừa là trách nhiệm thiết thực.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_19",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 20,
    "question": "Khi nhận ra mình đã sai vì lớn tiếng với em nhỏ, bước tiếp theo em cần làm là gì?",
    "options": {
      "A": "Xin lỗi em, rút kinh nghiệm và cư xử nhẹ nhàng hơn",
      "B": "Cho rằng mình là anh/chị nên có quyền lớn tiếng",
      "C": "Đổ lỗi do em nhỏ quá hư",
      "D": "Không nói chuyện với em nữa"
    },
    "answer": "A",
    "explanation": "Khả năng nhận sai và sửa chữa lỗi lầm chính là sự phản tư sâu sắc về trách nhiệm làm gương trong gia đình.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm gia đình",
    "id": "Trách_nhiệm_gia_đình_20",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 1,
    "question": "Trách nhiệm xã hội đối với học sinh tiểu học là gì?",
    "options": {
      "A": "Làm những việc to tát vĩ đại",
      "B": "Tuân thủ luật lệ và có ý thức bảo vệ môi trường công cộng",
      "C": "Kiếm tiền từ sớm",
      "D": "Chỉ quan tâm đến bản thân mình"
    },
    "answer": "B",
    "explanation": "Trách nhiệm xã hội ở lứa tuổi này bắt đầu từ việc tuân thủ quy định và giữ gìn môi trường xung quanh.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_1",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 2,
    "question": "Hành động nào thể hiện trách nhiệm bảo vệ môi trường?",
    "options": {
      "A": "Vứt rác bừa bãi",
      "B": "Vứt rác đúng nơi quy định",
      "C": "Bẻ cành hái hoa nơi công cộng",
      "D": "Lãng phí nước sạch"
    },
    "answer": "B",
    "explanation": "Vứt rác đúng chỗ là kiến thức cơ bản nhất về ý thức bảo vệ môi trường chung.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_2",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 3,
    "question": "Khi đi ra đường gặp đèn đỏ, em và người lớn phải làm gì?",
    "options": {
      "A": "Đi tiếp nếu không có công an",
      "B": "Dừng lại trước vạch kẻ đường",
      "C": "Rẽ sang hướng khác để tránh",
      "D": "Bấm còi xin đường"
    },
    "answer": "B",
    "explanation": "Dừng đèn đỏ là luật giao thông cơ bản, thể hiện trách nhiệm xã hội trong việc đảm bảo an toàn.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_3",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 4,
    "question": "Của công là những tài sản thuộc về ai?",
    "options": {
      "A": "Thuộc về riêng nhà em",
      "B": "Thuộc về tất cả mọi người trong xã hội",
      "C": "Không thuộc về ai cả",
      "D": "Thuộc về người giàu"
    },
    "answer": "B",
    "explanation": "Hiểu khái niệm 'của công' giúp học sinh biết cách bảo vệ tài sản chung như ghế đá, công viên.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_4",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 5,
    "question": "Tại sao chúng ta phải nhường ghế cho người già và phụ nữ mang thai trên xe buýt?",
    "options": {
      "A": "Vì luật pháp bắt buộc",
      "B": "Vì đó là hành vi văn minh, thể hiện sự quan tâm đến người yếu thế",
      "C": "Để được chụp ảnh lên báo",
      "D": "Vì thích đứng hơn"
    },
    "answer": "B",
    "explanation": "Sự nhường nhịn xuất phát từ lòng nhân ái, hiểu được người yếu thế cần được ưu tiên trong xã hội.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_5",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 6,
    "question": "Việc tiết kiệm điện ở nơi công cộng mang lại lợi ích gì?",
    "options": {
      "A": "Giúp bảo vệ tài nguyên quốc gia và giảm ô nhiễm",
      "B": "Làm cho nơi đó tối tăm đi",
      "C": "Không mang lại lợi ích gì",
      "D": "Chỉ có lợi cho nhà máy điện"
    },
    "answer": "A",
    "explanation": "Hiểu được mối liên hệ giữa tiết kiệm năng lượng và bảo vệ tài nguyên, môi trường chung.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_6",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 7,
    "question": "Nếu mọi người đều xả rác xuống sông hồ, hậu quả sẽ ra sao?",
    "options": {
      "A": "Sông hồ sẽ đẹp hơn",
      "B": "Nước bị ô nhiễm, cá chết và ảnh hưởng sức khỏe con người",
      "C": "Cá sẽ có thêm thức ăn",
      "D": "Không sao cả vì nước sẽ trôi đi"
    },
    "answer": "B",
    "explanation": "Nhận thức được hệ quả của việc phá hoại môi trường đối với hệ sinh thái và sức khỏe con người.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_7",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 8,
    "question": "Giúp đỡ bạn khuyết tật trong lớp có ý nghĩa gì đối với xã hội?",
    "options": {
      "A": "Tạo ra một cộng đồng trường học yêu thương và hòa nhập",
      "B": "Chỉ làm mất thời gian",
      "C": "Cho vui",
      "D": "Thể hiện mình là người tài giỏi"
    },
    "answer": "A",
    "explanation": "Hòa nhập và yêu thương là nền tảng xây dựng một xã hội văn minh và thân thiện.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_8",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 9,
    "question": "Khi đi dạo công viên, em uống xong một lon nước nhưng không thấy thùng rác. Em sẽ làm gì?",
    "options": {
      "A": "Vứt ngay dưới gốc cây",
      "B": "Cầm trên tay hoặc bỏ vào túi đến khi tìm thấy thùng rác",
      "C": "Ném xuống hồ nước",
      "D": "Đưa cho người lạ"
    },
    "answer": "B",
    "explanation": "Lựa chọn giữ lại rác đến khi tìm được chỗ vứt là quyết định đúng đắn, thể hiện ý thức cao.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_9",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 10,
    "question": "Thấy một em nhỏ đang khóc vì lạc đường, em và người lớn đi cùng nên làm gì?",
    "options": {
      "A": "Lờ đi vì không phải việc của mình",
      "B": "Đứng chỉ trỏ cười cợt",
      "C": "Đến hỏi thăm và đưa em bé đến đồn công an gần nhất",
      "D": "Dọa nạt em bé"
    },
    "answer": "C",
    "explanation": "Quyết định giúp đỡ người gặp nạn là cách hành xử nhân văn và có trách nhiệm với cộng đồng.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_10",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 11,
    "question": "Trường phát động phong trào quyên góp sách cũ cho trẻ em vùng cao. Em quyết định:",
    "options": {
      "A": "Soạn những cuốn sách không dùng tới, còn lành lặn để đem tặng",
      "B": "Xin tiền bố mẹ mua đồ chơi thay vì góp sách",
      "C": "Không tham gia vì lười",
      "D": "Đem góp những cuốn sách đã rách nát"
    },
    "answer": "A",
    "explanation": "Quyết định san sẻ vật chất có ý nghĩa với cộng đồng là biểu hiện của tinh thần tương thân tương ái.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_11",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 12,
    "question": "Đang xếp hàng mua vé xem phim thì có một người chen ngang lên trước em. Em xử lý thế nào?",
    "options": {
      "A": "Đẩy họ ra và đánh nhau",
      "B": "Im lặng chịu đựng",
      "C": "Lịch sự nhắc nhở người đó quay lại xếp hàng theo thứ tự",
      "D": "Chen lên trước người đó nữa"
    },
    "answer": "C",
    "explanation": "Lịch sự bảo vệ văn hóa xếp hàng cho thấy sự dũng cảm và ý thức duy trì trật tự công cộng.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_12",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 13,
    "question": "Hành vi hái trộm hoa trong công viên để chơi của nhóm bạn Tùng bị coi là:",
    "options": {
      "A": "Bình thường vì hoa mọc nhiều",
      "B": "Sai, vì đó là phá hoại cảnh quan chung của xã hội",
      "C": "Đáng khen vì biết thưởng thức cái đẹp",
      "D": "Không quan trọng"
    },
    "answer": "B",
    "explanation": "Phá hoại tài sản công, cảnh quan chung là hành vi thiếu văn hóa và thiếu ý thức xã hội.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_13",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 14,
    "question": "Một người chạy xe máy văng bùn vào người đi bộ nhưng bỏ chạy luôn. Hành động này đáng bị:",
    "options": {
      "A": "Cảm thông vì họ đang vội",
      "B": "Phê phán vì vô ý thức và thiếu trách nhiệm",
      "C": "Khen ngợi vì chạy xe giỏi",
      "D": "Bỏ qua vì không ai bị thương nặng"
    },
    "answer": "B",
    "explanation": "Gây ảnh hưởng đến người khác mà trốn tránh là vi phạm đạo đức và trách nhiệm cộng đồng.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_14",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 15,
    "question": "Nhóm bạn Liên tổ chức nhặt rác quanh khu phố vào sáng Chủ nhật. Em đánh giá thế nào về việc làm này?",
    "options": {
      "A": "Rất đáng tuyên dương vì làm sạch đẹp khu dân cư",
      "B": "Mất thời gian ngủ nướng",
      "C": "Việc này của lao công, không phải của học sinh",
      "D": "Làm để khoe khoang"
    },
    "answer": "A",
    "explanation": "Các hoạt động vì môi trường cộng đồng rất đáng trân trọng và cần được lan tỏa.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_15",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 16,
    "question": "Thấy vòi nước ở trường rỉ nước, Minh đã khóa chặt lại. Hành động của Minh thể hiện:",
    "options": {
      "A": "Tính bao đồng",
      "B": "Sự rảnh rỗi",
      "C": "Ý thức tiết kiệm tài nguyên chung của tập thể",
      "D": "Thích nghịch nước"
    },
    "answer": "C",
    "explanation": "Biết bảo vệ tài sản chung và chống lãng phí là hành vi đẹp, có trách nhiệm xã hội.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_16",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 17,
    "question": "Sau khi học về tái chế, em có thể vận dụng vào nhà mình bằng cách nào?",
    "options": {
      "A": "Vứt hết chai nhựa đi",
      "B": "Thu gom chai lọ nhựa, vỏ hộp giấy để tái chế thành chậu cây",
      "C": "Đốt rác nhựa ngoài vườn",
      "D": "Đổ hết chai lọ xuống cống"
    },
    "answer": "B",
    "explanation": "Vận dụng kiến thức tái chế vào việc làm cụ thể giúp giảm rác thải, bảo vệ môi trường.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_17",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 18,
    "question": "Tuần trước em lỡ xả rác bừa bãi. Nhìn lại việc đó, bây giờ em tự nhủ điều gì?",
    "options": {
      "A": "Mình sẽ không bao giờ làm vậy nữa, luôn tìm thùng rác",
      "B": "Xả rác một lần không sao",
      "C": "Lần sau sẽ xả rác chỗ kín hơn",
      "D": "Đợi ai nhắc thì mới nhặt"
    },
    "answer": "A",
    "explanation": "Phản tư về lỗi sai của bản thân và cam kết sửa chữa là quá trình phát triển nhân cách tích cực.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_18",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 19,
    "question": "Em có thể làm gì để lan tỏa ý thức an toàn giao thông cho bạn bè xung quanh?",
    "options": {
      "A": "Rủ bạn cùng chạy nhảy dưới lòng đường",
      "B": "Nhắc nhở bạn bè đội mũ bảo hiểm và đi đúng phần đường",
      "C": "Lặng im khi thấy bạn vi phạm",
      "D": "Xúi bạn vượt đèn đỏ"
    },
    "answer": "B",
    "explanation": "Không chỉ thực hiện tốt mà còn biết tuyên truyền, nhắc nhở người khác là vận dụng cao của trách nhiệm xã hội.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_19",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 20,
    "question": "Dịch bệnh lây lan, em vận dụng trách nhiệm cộng đồng bằng cách:",
    "options": {
      "A": "Thường xuyên rửa tay, đeo khẩu trang khi đến nơi đông người",
      "B": "Tụ tập đông người cho vui",
      "C": "Không thèm rửa tay",
      "D": "Hắt hơi vào người khác"
    },
    "answer": "A",
    "explanation": "Bảo vệ sức khỏe bản thân cũng là cách bảo vệ cộng đồng không bị lây nhiễm chéo.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Trách nhiệm xã hội",
    "id": "Trách_nhiệm_xã_hội_20",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 1,
    "question": "Mục tiêu là gì?",
    "options": {
      "A": "Là một giấc mơ không bao giờ thành hiện thực",
      "B": "Là điều em mong muốn đạt được và có kế hoạch thực hiện",
      "C": "Là việc người khác bắt ép em làm",
      "D": "Là chuyện xảy ra ngày hôm qua"
    },
    "answer": "B",
    "explanation": "Mục tiêu là cái đích cụ thể mà học sinh đặt ra để phấn đấu trong một thời gian nhất định.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_1",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 2,
    "question": "Mục tiêu nào sau đây là mục tiêu học tập?",
    "options": {
      "A": "Mua được món đồ chơi mới",
      "B": "Đạt điểm 10 môn Toán trong kỳ thi giữa kì",
      "C": "Tập đi xe đạp",
      "D": "Ăn hết bát cơm"
    },
    "answer": "B",
    "explanation": "Đạt điểm 10 là mục tiêu cụ thể thuộc về kết quả học tập.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_2",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 3,
    "question": "Để đạt được mục tiêu, chúng ta cần phải có gì?",
    "options": {
      "A": "Một kế hoạch và sự cố gắng",
      "B": "Ngồi chơi chờ đợi",
      "C": "Chờ người khác làm hộ",
      "D": "Chỉ cần mơ ước"
    },
    "answer": "A",
    "explanation": "Mục tiêu luôn cần đi kèm với kế hoạch hành động và sự nỗ lực kiên trì.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_3",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 4,
    "question": "Mục tiêu 'Tập thể dục 15 phút mỗi sáng' thuộc loại mục tiêu gì?",
    "options": {
      "A": "Mục tiêu học tập",
      "B": "Mục tiêu tài chính",
      "C": "Mục tiêu sức khỏe",
      "D": "Mục tiêu vui chơi"
    },
    "answer": "C",
    "explanation": "Thể dục liên quan trực tiếp đến việc rèn luyện và bảo vệ thể chất.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_4",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 5,
    "question": "Tại sao mục tiêu cần phải có thời hạn rõ ràng (ví dụ: trong tuần này, tháng này)?",
    "options": {
      "A": "Để gây áp lực cho vui",
      "B": "Để em có động lực và không bị trì hoãn",
      "C": "Để bố mẹ kiểm tra",
      "D": "Thời hạn không quan trọng"
    },
    "answer": "B",
    "explanation": "Thời hạn (Deadline) giúp học sinh tập trung, không lười biếng hay để việc này sang ngày khác.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_5",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 6,
    "question": "Nếu đặt mục tiêu quá cao so với khả năng, điều gì dễ xảy ra?",
    "options": {
      "A": "Sẽ dễ chán nản và bỏ cuộc",
      "B": "Sẽ đạt được ngay lập tức",
      "C": "Rất vui vẻ",
      "D": "Chẳng ảnh hưởng gì"
    },
    "answer": "A",
    "explanation": "Mục tiêu không vừa sức sẽ khiến học sinh thất vọng về bản thân khi không đạt được.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_6",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 7,
    "question": "Mục tiêu 'Em sẽ học giỏi' khác với 'Em sẽ làm 5 bài toán mỗi tối' ở điểm nào?",
    "options": {
      "A": "Không khác gì nhau",
      "B": "Câu thứ hai cụ thể, dễ thực hiện và đo lường hơn",
      "C": "Câu thứ nhất dễ làm hơn",
      "D": "Câu thứ hai quá khó"
    },
    "answer": "B",
    "explanation": "Mục tiêu cần tính cụ thể (Specific) và đo lường được (Measurable) để dễ dàng lên kế hoạch.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_7",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 8,
    "question": "Việc chia nhỏ một mục tiêu lớn thành nhiều bước nhỏ có tác dụng gì?",
    "options": {
      "A": "Làm mọi thứ rắc rối hơn",
      "B": "Giúp em thấy dễ dàng thực hiện từng bước và tự tin hơn",
      "C": "Làm mất thời gian",
      "D": "Làm mục tiêu trở nên xa vời"
    },
    "answer": "B",
    "explanation": "Chia nhỏ mục tiêu giúp giảm bớt sự khó khăn, tạo cảm giác thành tựu liên tục.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_8",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 9,
    "question": "Em muốn biết bơi vào mùa hè này. Em nên quyết định làm gì đầu tiên?",
    "options": {
      "A": "Mua đồ bơi và tự ra sông tập",
      "B": "Đợi đến khi lớn rồi tính",
      "C": "Xin phép bố mẹ đăng ký một khóa học bơi",
      "D": "Chỉ xem video bơi trên mạng"
    },
    "answer": "C",
    "explanation": "Lựa chọn khóa học bài bản giúp đảm bảo an toàn và đạt được mục tiêu đúng cách.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_9",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 10,
    "question": "Đang làm bài để đạt mục tiêu hoàn thành trước 9h tối thì có phim hoạt hình hay. Em chọn cách nào?",
    "options": {
      "A": "Bỏ bài để xem phim",
      "B": "Vừa xem vừa làm",
      "C": "Cố gắng làm xong nhanh, đúng rồi mới ra xem phim",
      "D": "Ngủ luôn không làm nữa"
    },
    "answer": "C",
    "explanation": "Quyết định tập trung giữ kỷ luật với mục tiêu, hoàn thành nhiệm vụ rồi mới giải trí là đúng đắn.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_10",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 11,
    "question": "Em đặt mục tiêu tiết kiệm tiền để mua truyện, nhưng hôm nay lại thèm ăn vặt đắt tiền. Em sẽ:",
    "options": {
      "A": "Tiêu hết tiền vào đồ ăn vặt",
      "B": "Vẫn giữ tiền tiết kiệm, chỉ mua kẹo rẻ tiền hoặc bỏ qua",
      "C": "Xin thêm tiền mẹ để mua cả hai",
      "D": "Vay tiền bạn"
    },
    "answer": "B",
    "explanation": "Kiên định với mục tiêu tài chính và từ chối cám dỗ tức thời là biểu hiện của kỹ năng tự kiểm soát.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_11",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 12,
    "question": "Nếu mục tiêu của em là vẽ được một bức tranh phong cảnh thật đẹp để tặng bà, em sẽ chuẩn bị gì?",
    "options": {
      "A": "Chẳng chuẩn bị gì, vẽ bừa ra giấy nháp",
      "B": "Chuẩn bị màu, giấy vẽ và tham khảo vài mẫu tranh đẹp",
      "C": "Nhờ người khác vẽ hộ",
      "D": "Mua tranh in sẵn"
    },
    "answer": "B",
    "explanation": "Quyết định chuẩn bị công cụ và học hỏi cách làm để đạt được kết quả tốt nhất tự sức mình.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_12",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 13,
    "question": "Mai lập kế hoạch mỗi ngày đọc 10 trang sách để đọc xong cuốn truyện trong một tháng. Đánh giá cách đặt mục tiêu của Mai:",
    "options": {
      "A": "Phi thực tế",
      "B": "Rất hợp lý, cụ thể và có khả năng thực hiện tốt",
      "C": "Quá mất thời gian",
      "D": "Không có ý nghĩa"
    },
    "answer": "B",
    "explanation": "Chia nhỏ số trang đọc mỗi ngày là phương pháp rất khoa học để hoàn thành cuốn sách.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_13",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 14,
    "question": "Linh thường đặt rất nhiều mục tiêu đầu năm nhưng không bao giờ ghi ra giấy và chẳng hoàn thành cái nào. Tại sao vậy?",
    "options": {
      "A": "Vì Linh không thông minh",
      "B": "Vì Linh thiếu kế hoạch cụ thể và sự kiên trì",
      "C": "Vì các mục tiêu tự biến mất",
      "D": "Do không ai giúp Linh"
    },
    "answer": "B",
    "explanation": "Đánh giá sự thất bại của việc đặt mục tiêu suông: thiếu công cụ ghi chép, theo dõi và hành động.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_14",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 15,
    "question": "Hùng đặt mục tiêu sẽ giảm bớt chơi game để giúp mẹ tưới cây, và bạn ấy đã làm được 2 tuần nay. Hành vi này đáng được:",
    "options": {
      "A": "Chê bai vì chơi game vui hơn",
      "B": "Tuyên dương vì biết thiết lập và nỗ lực đạt mục tiêu tốt",
      "C": "Bỏ qua",
      "D": "Phê phán vì không tưới cây được lâu dài"
    },
    "answer": "B",
    "explanation": "Nỗ lực duy trì thói quen tốt cần được động viên, cho thấy kỹ năng quản lý bản thân tốt.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_15",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 16,
    "question": "Tuấn nói: 'Tớ chả cần mục tiêu gì, tới đâu hay tới đó'. Quan điểm này dẫn đến điều gì?",
    "options": {
      "A": "Tuấn sẽ thành công nhanh chóng",
      "B": "Tuấn sống không có định hướng, dễ lãng phí thời gian",
      "C": "Tuấn sẽ được mọi người ngưỡng mộ",
      "D": "Tuấn sẽ luôn vui vẻ"
    },
    "answer": "B",
    "explanation": "Đánh giá hậu quả của lối sống thiếu mục tiêu: dễ sa đà vào vô bổ, thiếu thành tựu.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_16",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 17,
    "question": "Để khắc phục việc hay quên mục tiêu đã đặt ra, em áp dụng biện pháp gì?",
    "options": {
      "A": "Viết mục tiêu ra giấy nhớ và dán ở bàn học",
      "B": "Chỉ nghĩ trong đầu",
      "C": "Kệ nó, nhớ thì làm không thì thôi",
      "D": "Nhờ mẹ ngày nào cũng nhắc 10 lần"
    },
    "answer": "A",
    "explanation": "Sử dụng công cụ trực quan (giấy nhớ) để nhắc nhở bản thân là vận dụng kỹ năng ghi nhớ mục tiêu.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_17",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 18,
    "question": "Kỳ thi trước em đặt mục tiêu điểm 9 nhưng chỉ được 7. Rút kinh nghiệm kỳ này, em làm gì?",
    "options": {
      "A": "Bỏ luôn không đặt mục tiêu nữa",
      "B": "Xem lại mình hổng kiến thức ở đâu và lập kế hoạch ôn tập kỹ hơn",
      "C": "Khóc lóc trách móc bản thân",
      "D": "Gian lận để được điểm cao"
    },
    "answer": "B",
    "explanation": "Phản tư thất bại để điều chỉnh phương pháp học tập cho mục tiêu kế tiếp.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_18",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 19,
    "question": "Bây giờ đang là kỳ nghỉ hè, hãy thiết lập một mục tiêu nhỏ phù hợp với em:",
    "options": {
      "A": "Chơi game liên tục 24 giờ",
      "B": "Đọc xong 3 cuốn sách thiếu nhi trong 2 tháng hè",
      "C": "Ngủ cả ngày",
      "D": "Làm bài tập đại học"
    },
    "answer": "B",
    "explanation": "Vận dụng nguyên tắc đặt mục tiêu SMART (cụ thể, đo lường được, khả thi, có thời hạn) vào kỳ nghỉ hè.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_19",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 20,
    "question": "Khi đạt được mục tiêu tự gấp chăn màn gọn gàng suốt 1 tuần, em nên cảm thấy thế nào?",
    "options": {
      "A": "Chán nản vì mệt",
      "B": "Tự hào về bản thân và tiếp tục duy trì thói quen",
      "C": "Đòi phần thưởng đắt tiền",
      "D": "Dừng lại không gấp nữa"
    },
    "answer": "B",
    "explanation": "Tự ghi nhận thành công của bản thân (phản tư tích cực) để củng cố động lực lâu dài.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Mục tiêu",
    "id": "Mục_tiêu_20",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 1,
    "question": "Nội quy lớp học là gì?",
    "options": {
      "A": "Những luật lệ để phạt học sinh",
      "B": "Những quy định chung giúp lớp học nề nếp và hiệu quả",
      "C": "Chỉ là tờ giấy dán trên tường",
      "D": "Những điều do một bạn học sinh tự nghĩ ra"
    },
    "answer": "B",
    "explanation": "Nội quy lớp học thiết lập tiêu chuẩn hành vi chung giúp mọi người học tập an toàn, trật tự.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_1",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 2,
    "question": "Khi muốn phát biểu ý kiến trong lớp, em cần làm gì?",
    "options": {
      "A": "Nói leo ngay lập tức",
      "B": "Hét to lên",
      "C": "Giơ tay và chờ cô giáo gọi tên",
      "D": "Đập bàn thu hút chú ý"
    },
    "answer": "C",
    "explanation": "Giơ tay phát biểu là quy tắc cơ bản đảm bảo trật tự và tôn trọng giáo viên cùng bạn học.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_2",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 3,
    "question": "Việc đi học đúng giờ là:",
    "options": {
      "A": "Tuân thủ nội quy học tập",
      "B": "Sở thích cá nhân",
      "C": "Điều không bắt buộc",
      "D": "Chỉ dành cho lớp trưởng"
    },
    "answer": "A",
    "explanation": "Đi học đúng giờ là quy định bắt buộc trong mọi nội quy trường lớp.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_3",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 4,
    "question": "Nội quy lớp học thường cấm hành vi nào sau đây?",
    "options": {
      "A": "Mượn bút của bạn",
      "B": "Đánh nhau, gây gổ trong lớp",
      "C": "Hỏi bài cô giáo",
      "D": "Uống nước trong giờ giải lao"
    },
    "answer": "B",
    "explanation": "Bạo lực học đường là hành vi bị nghiêm cấm hoàn toàn trong nội quy trường học.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_4",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 5,
    "question": "Tại sao lớp học cần phải có nội quy?",
    "options": {
      "A": "Để giáo viên rảnh rỗi hơn",
      "B": "Để xây dựng môi trường học tập an toàn, công bằng và tôn trọng lẫn nhau",
      "C": "Để gây áp lực cho học sinh",
      "D": "Để trường đẹp hơn"
    },
    "answer": "B",
    "explanation": "Hiểu bản chất của nội quy là bảo vệ quyền lợi học tập và sự tôn trọng của mỗi cá nhân.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_5",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 6,
    "question": "Nếu mọi người đều nói chuyện riêng trong giờ học, hậu quả là gì?",
    "options": {
      "A": "Lớp học sẽ vui vẻ hơn",
      "B": "Cô giáo và các bạn không thể tập trung nghe giảng, không hiểu bài",
      "C": "Không ảnh hưởng gì",
      "D": "Giờ học kết thúc sớm"
    },
    "answer": "B",
    "explanation": "Sự ồn ào phá vỡ không gian học tập, làm giảm tiếp thu kiến thức của cả tập thể.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_6",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 7,
    "question": "Việc mặc đồng phục đi học theo quy định mang ý nghĩa gì?",
    "options": {
      "A": "Thể hiện sự bình đẳng, đoàn kết và tự hào về ngôi trường",
      "B": "Vì quần áo ở nhà xấu",
      "C": "Để không bị bẩn",
      "D": "Để giáo viên dễ nhớ tên"
    },
    "answer": "A",
    "explanation": "Đồng phục xóa bỏ ranh giới giàu nghèo, tạo sự đồng nhất và tinh thần tập thể.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_7",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 8,
    "question": "Quy định 'Giữ gìn vệ sinh chung' giúp ích gì cho lớp học?",
    "options": {
      "A": "Chỉ giúp cô lao công nhàn hơn",
      "B": "Bảo vệ sức khỏe cho chính học sinh và giữ lớp học sạch đẹp",
      "C": "Gây mệt mỏi cho học sinh",
      "D": "Làm mất thời gian"
    },
    "answer": "B",
    "explanation": "Không gian sạch sẽ trực tiếp phòng tránh bệnh tật và tạo cảm hứng học tập.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_8",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 9,
    "question": "Khi thấy bạn ngồi cạnh xả rác ra ngăn bàn, em sẽ làm gì?",
    "options": {
      "A": "Xả rác theo bạn",
      "B": "Nhẹ nhàng khuyên bạn nhặt rác bỏ vào thùng rác",
      "C": "Đánh bạn",
      "D": "Mặc kệ bạn"
    },
    "answer": "B",
    "explanation": "Khuyên nhủ bạn bè tuân thủ nội quy vệ sinh là quyết định xây dựng tích cực.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_9",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 10,
    "question": "Trống vào lớp đã điểm nhưng em vẫn đang dở trận đá bóng sân trường. Em sẽ:",
    "options": {
      "A": "Cố đá nốt trận",
      "B": "Rủ các bạn dừng chơi, rửa tay và chạy nhanh về lớp",
      "C": "Trốn học",
      "D": "Khóc lóc bắt đền"
    },
    "answer": "B",
    "explanation": "Tuân thủ thời gian biểu là kỷ luật bắt buộc, lựa chọn dừng vui chơi để vào học đúng giờ là chính xác.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_10",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 11,
    "question": "Đang trong giờ kiểm tra, bạn thân nhờ em nhắc bài. Em xử lý thế nào?",
    "options": {
      "A": "Đọc bài cho bạn chép",
      "B": "Từ chối khéo để không vi phạm quy chế thi, ra chơi sẽ giải thích cho bạn",
      "C": "Báo cô giáo lớn tiếng để bạn bẽ mặt",
      "D": "Chép bài của bạn khác cho bạn mình"
    },
    "answer": "B",
    "explanation": "Giữ tính trung thực trong thi cử và vẫn bảo vệ được tình bạn bằng cách từ chối khéo.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_11",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 12,
    "question": "Em lỡ tay làm vỡ bình hoa của lớp. Em quyết định làm gì?",
    "options": {
      "A": "Giấu đi phi tang",
      "B": "Đổ lỗi cho con mèo",
      "C": "Chủ động nhận lỗi với cô giáo và cùng các bạn dọn mảnh vỡ",
      "D": "Đổ lỗi cho bạn khác"
    },
    "answer": "C",
    "explanation": "Dám nhận lỗi và khắc phục hậu quả là sự tuân thủ nội quy dũng cảm, trung thực.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_12",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 13,
    "question": "Hành vi vẽ bậy lên bàn học của Khang đáng bị xử lý thế nào?",
    "options": {
      "A": "Khen ngợi vì vẽ đẹp",
      "B": "Phê bình và yêu cầu Khang lau sạch vết bẩn, vì đó là phá hoại của công",
      "C": "Lờ đi",
      "D": "Khuyến khích các bạn khác vẽ cùng"
    },
    "answer": "B",
    "explanation": "Đánh giá hành vi phá hoại tài sản chung là vi phạm nội quy, cần có biện pháp sửa sai.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_13",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 14,
    "question": "Nhóm tổ 1 luôn trực nhật lớp sạch sẽ trước khi vào học. Em đánh giá thế nào?",
    "options": {
      "A": "Nhóm bạn rất có trách nhiệm và chấp hành tốt nội quy",
      "B": "Nhóm bạn rảnh rỗi",
      "C": "Đó là việc bắt buộc, chả có gì đáng khen",
      "D": "Nhóm bạn muốn lấy lòng cô giáo"
    },
    "answer": "A",
    "explanation": "Thực hiện tốt nhiệm vụ được giao là biểu hiện của tinh thần tập thể và ý thức kỷ luật.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_14",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 15,
    "question": "Bạn Cường thường xuyên trêu chọc, giấu đồ dùng học tập của bạn khác. Hành vi này:",
    "options": {
      "A": "Chỉ là đùa vui",
      "B": "Giúp các bạn hòa đồng hơn",
      "C": "Vi phạm nội quy tôn trọng bạn bè, gây mất đoàn kết",
      "D": "Đáng được khuyến khích"
    },
    "answer": "C",
    "explanation": "Xâm phạm tài sản cá nhân và trêu chọc ác ý làm tổn thương tinh thần bạn học, vi phạm nội quy.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_15",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 16,
    "question": "Nếu một học sinh luôn đi muộn vì mải ngủ nướng, em nhận xét gì về học sinh đó?",
    "options": {
      "A": "Đó là thói quen tốt cho sức khỏe",
      "B": "Thiếu kỷ luật bản thân và không tôn trọng nội quy nhà trường",
      "C": "Đáng thương vì học sinh đó quá mệt",
      "D": "Bình thường"
    },
    "answer": "B",
    "explanation": "Sự chậm trễ do lười biếng là biểu hiện của việc thiếu kỹ năng quản lý thời gian và tuân thủ quy định.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_16",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 17,
    "question": "Nhận thấy mình hay nói chuyện riêng, em vận dụng cách nào để khắc phục?",
    "options": {
      "A": "Xin cô đổi chỗ lên bàn đầu để tập trung hơn",
      "B": "Nói chuyện nhỏ lại",
      "C": "Nói chuyện bằng giấy",
      "D": "Nghỉ học"
    },
    "answer": "A",
    "explanation": "Chủ động tìm giải pháp môi trường (đổi chỗ) để tự kiểm soát hành vi vi phạm nội quy.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_17",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 18,
    "question": "Năm học mới, lớp em chưa có nội quy. Em có thể đóng góp ý kiến gì?",
    "options": {
      "A": "Đề xuất mỗi người thích làm gì thì làm",
      "B": "Cùng các bạn thảo luận và biểu quyết lập ra một bảng nội quy chung",
      "C": "Mặc kệ cô giáo tự làm",
      "D": "Đề xuất nội quy phạt tiền"
    },
    "answer": "B",
    "explanation": "Vận dụng hiểu biết về nội quy để cùng xây dựng cam kết tập thể dân chủ.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_18",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 19,
    "question": "Hôm qua em quên mang sách giáo khoa. Nhìn lại sự việc, em rút ra bài học gì?",
    "options": {
      "A": "Sẽ soạn sách vở từ tối hôm trước để không quên nữa",
      "B": "Sáng ra vơ đại vào cặp cũng được",
      "C": "Nhờ mẹ soạn cặp cho",
      "D": "Lên lớp mượn bạn cho nhanh"
    },
    "answer": "A",
    "explanation": "Phản tư lỗi lầm (quên đồ) và thiết lập thói quen mới (soạn đồ từ tối) để tuân thủ nề nếp.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_19",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 20,
    "question": "Khi thấy một bạn mới chuyển đến chưa thuộc nội quy lớp, em nên làm gì?",
    "options": {
      "A": "Cười nhạo khi bạn làm sai",
      "B": "Báo cô giáo phạt bạn",
      "C": "Thân thiện hướng dẫn và nhắc nhở giúp bạn làm quen",
      "D": "Tẩy chay bạn"
    },
    "answer": "C",
    "explanation": "Sự hướng dẫn tử tế thể hiện khả năng lãnh đạo nhóm và tinh thần trách nhiệm với lớp học.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Nội quy lớp học",
    "id": "Nội_quy_lớp_học_20",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 1,
    "question": "Cách tốt nhất để bảo vệ răng miệng là gì?",
    "options": {
      "A": "Ăn thật nhiều kẹo trước khi ngủ",
      "B": "Đánh răng ngày 2 lần và hạn chế đồ ngọt",
      "C": "Chỉ súc miệng bằng nước lã",
      "D": "Đánh răng 1 lần mỗi tuần"
    },
    "answer": "B",
    "explanation": "Đánh răng đều đặn và kiểm soát lượng đường là kiến thức cơ bản về vệ sinh răng miệng.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_1",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 2,
    "question": "Khi đi dưới trời nắng gắt, em cần làm gì để bảo vệ sức khỏe?",
    "options": {
      "A": "Đội mũ, che ô, mặc áo dài tay",
      "B": "Cởi trần cho mát",
      "C": "Không cần làm gì cả",
      "D": "Ăn kem liên tục"
    },
    "answer": "A",
    "explanation": "Che chắn cơ thể giúp tránh say nắng và bảo vệ da khỏi tia cực tím độc hại.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_2",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 3,
    "question": "Thực phẩm nào sau đây rất tốt cho sức khỏe nếu ăn hàng ngày?",
    "options": {
      "A": "Nước ngọt có gas",
      "B": "Xúc xích chiên dầu",
      "C": "Rau xanh và trái cây tươi",
      "D": "Bánh kẹo"
    },
    "answer": "C",
    "explanation": "Rau củ quả cung cấp vitamin, chất xơ, là thực phẩm thiết yếu cho sự phát triển.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_3",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 4,
    "question": "Trước khi ăn và sau khi đi vệ sinh, việc bắt buộc phải làm là gì?",
    "options": {
      "A": "Lau tay vào quần áo",
      "B": "Rửa tay bằng xà phòng",
      "C": "Súc miệng",
      "D": "Rửa tay bằng nước lã qua loa"
    },
    "answer": "B",
    "explanation": "Rửa tay xà phòng là biện pháp số 1 để tiêu diệt vi khuẩn lây bệnh qua đường tiêu hóa.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_4",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 5,
    "question": "Tại sao việc ngủ đủ giấc (8-10 tiếng) lại quan trọng đối với trẻ em?",
    "options": {
      "A": "Để tốn ít thức ăn hơn",
      "B": "Giúp cơ thể phục hồi, phát triển chiều cao và trí não",
      "C": "Để bố mẹ không mắng",
      "D": "Chẳng có tác dụng gì"
    },
    "answer": "B",
    "explanation": "Hiểu được lợi ích sinh lý của giấc ngủ đối với sự phát triển thể chất và tinh thần ở lứa tuổi đang lớn.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_5",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 6,
    "question": "Ngồi học sai tư thế (gù lưng, cúi sát mặt bàn) sẽ dẫn đến hậu quả gì?",
    "options": {
      "A": "Học giỏi hơn",
      "B": "Bị cận thị và cong vẹo cột sống",
      "C": "Trở nên cao lớn",
      "D": "Khỏe mạnh hơn"
    },
    "answer": "B",
    "explanation": "Nhận thức được tác hại của thói quen sinh hoạt sai lên hệ xương khớp và thị lực.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_6",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 7,
    "question": "Tại sao không nên sử dụng điện thoại, ipad quá lâu trong ngày?",
    "options": {
      "A": "Vì sẽ làm tốn điện",
      "B": "Vì ánh sáng xanh gây mỏi mắt, làm đầu óc căng thẳng và lười vận động",
      "C": "Vì sợ máy bị hỏng",
      "D": "Vì tốn tiền mạng"
    },
    "answer": "B",
    "explanation": "Sự ảnh hưởng tiêu cực của màn hình điện tử đến cả thể chất lẫn tâm lý nếu lạm dụng.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_7",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 8,
    "question": "Tập thể dục thể thao thường xuyên mang lại lợi ích gì?",
    "options": {
      "A": "Làm cơ thể yếu đi",
      "B": "Chỉ để đi thi đấu",
      "C": "Tăng cường sức đề kháng, xương chắc khỏe và tinh thần vui vẻ",
      "D": "Mất nhiều thời gian rảnh"
    },
    "answer": "C",
    "explanation": "Hiểu được vai trò toàn diện của vận động đối với hệ miễn dịch và tâm trạng.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_8",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 9,
    "question": "Hôm nay trời rất lạnh, nhưng em lại muốn mặc váy ngắn đi học cho đẹp. Em sẽ chọn gì?",
    "options": {
      "A": "Vẫn mặc váy ngắn bất chấp thời tiết",
      "B": "Mặc quần áo dài, ấm áp để không bị cảm lạnh",
      "C": "Mặc đồ mùa hè và đắp chăn đi học",
      "D": "Nghỉ học ở nhà"
    },
    "answer": "B",
    "explanation": "Lựa chọn đặt sức khỏe (giữ ấm) lên trên thẩm mỹ cá nhân trong tình huống thời tiết xấu.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_9",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 10,
    "question": "Mua đồ ăn vặt ngoài cổng trường có ruồi muỗi bâu, màu sắc sặc sỡ. Em quyết định:",
    "options": {
      "A": "Mua ăn vì ngon và rẻ",
      "B": "Rủ bạn cùng mua",
      "C": "Không mua vì thức ăn mất vệ sinh dễ gây đau bụng, ngộ độc",
      "D": "Mua cho em trai ăn thử"
    },
    "answer": "C",
    "explanation": "Khả năng ra quyết định từ chối thực phẩm bẩn, không rõ nguồn gốc để bảo vệ hệ tiêu hóa.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_10",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 11,
    "question": "Đang chơi thể thao thì em cảm thấy khó thở và chóng mặt. Em nên làm gì?",
    "options": {
      "A": "Cố sức chơi tiếp",
      "B": "Lập tức dừng lại, tìm chỗ mát mẻ nghỉ ngơi và báo cho người lớn",
      "C": "Chạy nhanh hơn",
      "D": "Uống một cốc nước đá thật lạnh ngay lập tức"
    },
    "answer": "B",
    "explanation": "Biết lắng nghe cơ thể và quyết định dừng lại đúng lúc để tránh đột quỵ, kiệt sức.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_11",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 12,
    "question": "Bị muỗi đốt sưng đỏ và rất ngứa, em sẽ xử lý thế nào?",
    "options": {
      "A": "Gãi thật mạnh cho xước da",
      "B": "Lấy tay bẩn gãi",
      "C": "Nhờ người lớn bôi thuốc trị côn trùng cắn, không gãi để tránh nhiễm trùng",
      "D": "Cấu vào nốt muỗi đốt"
    },
    "answer": "C",
    "explanation": "Quyết định xử lý tổn thương ngoài da một cách an toàn, tránh nhiễm trùng.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_12",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 13,
    "question": "Bình rất hay uống nước tăng lực và nước ngọt thay nước lọc mỗi ngày. Đánh giá thói quen này:",
    "options": {
      "A": "Rất xấu, dễ gây bệnh béo phì và tiểu đường",
      "B": "Tốt vì nước ngọt có nhiều năng lượng",
      "C": "Bình thường",
      "D": "Đáng khen vì Bình sành điệu"
    },
    "answer": "A",
    "explanation": "Đánh giá mức độ nguy hiểm của lạm dụng đường hóa học thay thế nước tinh khiết.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_13",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 14,
    "question": "Dù rất buồn ngủ nhưng Hân vẫn cố thức đến 12h đêm để xem Tiktok. Hành vi này:",
    "options": {
      "A": "Rất đáng khen vì biết cập nhật thông tin",
      "B": "Có hại nghiêm trọng đến não bộ và sự phát triển của học sinh",
      "C": "Bình thường ở giới trẻ",
      "D": "Tốt cho việc giải trí"
    },
    "answer": "B",
    "explanation": "Thức khuya và nghiện mạng xã hội là thói quen tàn phá sức khỏe cần lên án.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_14",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 15,
    "question": "Khi ho hoặc hắt hơi, bạn Tùng luôn lấy tay hoặc khăn giấy che miệng lại. Đánh giá hành động của Tùng:",
    "options": {
      "A": "Vẽ chuyện",
      "B": "Đáng biểu dương vì biết giữ vệ sinh và phòng lây bệnh cho người khác",
      "C": "Mất thời gian",
      "D": "Chỉ làm điệu"
    },
    "answer": "B",
    "explanation": "Hành vi vệ sinh đúng mực giúp kiểm soát mầm bệnh lây qua đường hô hấp.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_15",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 16,
    "question": "Thấy mẹ vứt vỉ thuốc kháng sinh hết hạn vào thùng rác, em nhặt lên chơi. Hành vi này là:",
    "options": {
      "A": "Bình thường, chỉ là đồ chơi",
      "B": "Rất nguy hiểm vì thuốc tây có thể gây ngộ độc nếu không dùng đúng",
      "C": "Tiết kiệm đồ",
      "D": "Thể hiện tính tò mò thông minh"
    },
    "answer": "B",
    "explanation": "Tuyệt đối không đùa nghịch với dược phẩm rác vì rủi ro ngộ độc là cực kỳ cao.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_16",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 17,
    "question": "Nhận thấy dạo này mình hay bị mỏi mắt, em có thể tự điều chỉnh thói quen nào?",
    "options": {
      "A": "Dụi mắt thật nhiều",
      "B": "Giảm thời gian xem Tivi, ngồi học đủ ánh sáng và massage mắt",
      "C": "Đeo kính cận của người khác",
      "D": "Nhỏ nước lã vào mắt"
    },
    "answer": "B",
    "explanation": "Vận dụng kiến thức bảo vệ mắt để tự thiết lập chế độ sinh hoạt giảm tải cho thị lực.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_17",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 18,
    "question": "Sau khi bị ốm vì tắm mưa gội đầu trễ, bài học em tự rút ra cho mình là gì?",
    "options": {
      "A": "Lần sau tắm mưa tiếp cho quen",
      "B": "Phải biết trú mưa và tắm rửa lau khô người bằng nước ấm ngay sau khi đi mưa",
      "C": "Chỉ tắm mưa khi ở nhà một mình",
      "D": "Đổ lỗi do ông trời mưa to"
    },
    "answer": "B",
    "explanation": "Phản tư về nguyên nhân gây bệnh để phòng tránh mắc lỗi tương tự trong tương lai.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_18",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 19,
    "question": "Để chuẩn bị một bữa sáng lành mạnh cho bản thân, em có thể đề xuất món gì?",
    "options": {
      "A": "Bánh kẹo và nước ngọt",
      "B": "Mì tôm sống",
      "C": "Một bát phở hoặc bánh mì kẹp trứng và ly sữa",
      "D": "Không ăn sáng"
    },
    "answer": "C",
    "explanation": "Áp dụng kiến thức dinh dưỡng để tự lựa chọn bữa ăn cung cấp năng lượng khoa học.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_19",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 20,
    "question": "Nhà trường tổ chức tiêm phòng dịch bệnh, em rất sợ tiêm. Em tự vượt qua bằng cách nào?",
    "options": {
      "A": "Khóc lóc trốn trong nhà vệ sinh",
      "B": "Hiểu rằng tiêm đau một chút nhưng bảo vệ mình khỏi bệnh nặng, dũng cảm đối mặt",
      "C": "Đánh cô y tá",
      "D": "Bỏ chạy về nhà"
    },
    "answer": "B",
    "explanation": "Sử dụng nhận thức về lợi ích y tế để vượt qua nỗi sợ tâm lý cá nhân.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Bảo vệ sức khoẻ bản thân",
    "id": "Bảo_vệ_sức_khoẻ_bản_thân_20",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 1,
    "question": "Tự giác học tập là gì?",
    "options": {
      "A": "Chỉ học khi có bố mẹ cầm roi đứng cạnh",
      "B": "Tự động ngồi vào bàn học, hoàn thành bài tập mà không cần ai nhắc nhở",
      "C": "Đến lớp nhờ bạn làm bài hộ",
      "D": "Vừa học vừa chơi game"
    },
    "answer": "B",
    "explanation": "Tự giác là sự chủ động thực hiện nhiệm vụ học tập từ ý thức bên trong.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_1",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 2,
    "question": "Dấu hiệu nào cho thấy một học sinh tự giác học tập?",
    "options": {
      "A": "Thường xuyên mượn vở chép bài",
      "B": "Chủ động soạn sách vở cho ngày mai sau khi học xong",
      "C": "Giấu bài kiểm tra điểm kém",
      "D": "Chờ mẹ nhắc mới làm bài"
    },
    "answer": "B",
    "explanation": "Soạn sách vở trước là thao tác chuẩn bị thể hiện sự sẵn sàng và chủ động với việc học.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_2",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 3,
    "question": "Khi chưa hiểu bài trên lớp, em cần làm gì?",
    "options": {
      "A": "Giấu dốt, im lặng",
      "B": "Mạnh dạn giơ tay hỏi lại cô giáo hoặc hỏi bạn bè",
      "C": "Bỏ qua không thèm học môn đó",
      "D": "Khóc nhè"
    },
    "answer": "B",
    "explanation": "Biết cách tìm kiếm sự trợ giúp khi gặp khó khăn là một kỹ năng quan trọng của học sinh tự giác.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_3",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 4,
    "question": "Góc học tập của người có ý thức tự giác thường như thế nào?",
    "options": {
      "A": "Bừa bộn đầy rác",
      "B": "Sạch sẽ, gọn gàng và ngăn nắp",
      "C": "Nhiều đồ chơi hơn sách vở",
      "D": "Tối tăm, thiếu ánh sáng"
    },
    "answer": "B",
    "explanation": "Môi trường vật lý (góc học tập) phản ánh tổ chức tư duy và sự tôn trọng việc học của học sinh.",
    "tier": "A - Knowledge (Biết)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_4",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 5,
    "question": "Tại sao tính tự giác học tập lại quan trọng?",
    "options": {
      "A": "Vì giúp em tiếp thu kiến thức tốt hơn, tự lập và tự tin",
      "B": "Vì bố mẹ thích thế",
      "C": "Để được cho tiền ăn vặt",
      "D": "Chẳng có gì quan trọng"
    },
    "answer": "A",
    "explanation": "Sự tự giác biến việc học thành nhu cầu bản thân, từ đó nâng cao kết quả bền vững.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_5",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 6,
    "question": "Làm bài tập về nhà có tác dụng gì?",
    "options": {
      "A": "Làm khổ học sinh",
      "B": "Giúp ôn lại kiến thức đã học trên lớp để nhớ lâu hơn",
      "C": "Làm cho hết thời gian",
      "D": "Để cô giáo không phạt"
    },
    "answer": "B",
    "explanation": "Hiểu được bản chất của bài tập về nhà là bước củng cố kiến thức cần thiết.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_6",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 7,
    "question": "Sự khác biệt giữa học sinh tự giác và học sinh thụ động là gì?",
    "options": {
      "A": "Không có gì khác",
      "B": "Học sinh tự giác tự tìm tòi, còn học sinh thụ động chỉ chờ người khác chỉ bảo",
      "C": "Học sinh thụ động giỏi hơn",
      "D": "Học sinh tự giác hay bị mắng"
    },
    "answer": "B",
    "explanation": "Nhận thức được sự khác biệt giữa hai thái độ học tập để chọn đúng con đường phát triển.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_7",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 8,
    "question": "Nếu luôn ỷ lại vào việc chép sách giải, học sinh sẽ gặp vấn đề gì?",
    "options": {
      "A": "Sẽ học rất giỏi",
      "B": "Sẽ mất khả năng tư duy độc lập và không thực sự hiểu bài",
      "C": "Được thầy cô khen",
      "D": "Trở nên thông minh hơn"
    },
    "answer": "B",
    "explanation": "Sử dụng sách giải sai cách triệt tiêu khả năng suy nghĩ logic và sự kiên nhẫn khi giải quyết vấn đề.",
    "tier": "B - Understanding (Hiểu)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_8",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 9,
    "question": "Bài toán hôm nay rất khó, em đã nghĩ 15 phút chưa ra. Em quyết định làm gì?",
    "options": {
      "A": "Bỏ trống ngày mai đến chép bài bạn",
      "B": "Xem lại phần lý thuyết ví dụ trong SGK, nếu vẫn không hiểu thì nhờ người lớn hướng dẫn cách làm",
      "C": "Gấp sách đi ngủ",
      "D": "Khóc ầm ĩ lên"
    },
    "answer": "B",
    "explanation": "Quyết định xử lý khó khăn bằng phương pháp khoa học (tìm tài liệu -> nhờ hướng dẫn) thay vì bỏ cuộc.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_9",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 10,
    "question": "Bạn rủ em đi đá bóng nhưng em chưa làm xong bài tập. Em sẽ trả lời bạn thế nào?",
    "options": {
      "A": "Đi ngay, bài tập để sau tính",
      "B": "Tớ phải làm nốt bài, cậu đợi tớ 20 phút làm xong rồi mình cùng đi",
      "C": "Nghỉ chơi với bạn luôn",
      "D": "Nói dối là đã làm xong rồi đi"
    },
    "answer": "B",
    "explanation": "Lựa chọn hoàn thành trách nhiệm ưu tiên (học tập) trước khi thỏa mãn sở thích vui chơi.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_10",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 11,
    "question": "Đến giờ tự học buổi tối theo lịch, nhưng tivi đang chiếu phim siêu nhân. Em xử lý sao?",
    "options": {
      "A": "Vào phòng đóng cửa, ngồi học nghiêm túc",
      "B": "Vừa xem phim vừa làm bài",
      "C": "Xin mẹ cho xem nốt rồi học sau",
      "D": "Bỏ học luôn"
    },
    "answer": "A",
    "explanation": "Khả năng cưỡng lại cám dỗ giải trí để tuân thủ thời gian biểu cá nhân.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_11",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 12,
    "question": "Cô giáo không giao bài tập về nhà môn Lịch sử. Em sẽ làm gì vào buổi tối?",
    "options": {
      "A": "Tuyệt quá, chơi thả ga",
      "B": "Đọc trước bài mới của ngày mai hoặc đọc thêm sách kỹ năng",
      "C": "Chỉ xem điện thoại",
      "D": "Đi ngủ sớm"
    },
    "answer": "B",
    "explanation": "Tự giác mở rộng việc học ngoài khuôn khổ bài tập bắt buộc để rèn luyện thói quen tự học.",
    "tier": "C - Decision Making (Lựa chọn trong tình huống)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_12",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 13,
    "question": "Cường luôn lén dùng điện thoại trong giờ tự học. Đánh giá hành vi của Cường:",
    "options": {
      "A": "Thiếu tự giác, lừa dối bản thân và phụ huynh",
      "B": "Thông minh vì biết làm nhiều việc",
      "C": "Đáng khen",
      "D": "Bình thường"
    },
    "answer": "A",
    "explanation": "Học đối phó là biểu hiện tồi tệ nhất của việc thiếu ý thức tự giác.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_13",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 14,
    "question": "Mai không chỉ làm đủ bài tập mà còn tìm thêm bài nâng cao trên mạng để giải. Hành vi của Mai:",
    "options": {
      "A": "Rảnh rỗi sinh nông nổi",
      "B": "Tinh thần hiếu học và tự giác rất đáng khâm phục",
      "C": "Gây áp lực cho bạn bè",
      "D": "Chỉ để lấy le với cô giáo"
    },
    "answer": "B",
    "explanation": "Sự đam mê khám phá tri thức là bậc cao nhất của việc tự định hướng học tập.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_14",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 15,
    "question": "Quân được điểm kém nhưng đã giấu bài đi sửa điểm báo cho bố mẹ. Hành vi này thể hiện:",
    "options": {
      "A": "Sự thiếu trung thực và không dám đối mặt để sửa sai trong học tập",
      "B": "Sự khôn ngoan để không bị đòn",
      "C": "Tính cẩn thận",
      "D": "Trách nhiệm với gia đình"
    },
    "answer": "A",
    "explanation": "Gian dối điểm số hủy hoại quá trình tự nhìn nhận năng lực để tiến bộ.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_15",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 16,
    "question": "Trong nhóm làm việc chung, Linh nhận phần khó và chủ động nộp đúng hạn. Linh là người:",
    "options": {
      "A": "Thích ôm rơm rặm bụng",
      "B": "Có tinh thần tự giác học hỏi và trách nhiệm nhóm rất tốt",
      "C": "Muốn làm nổi bật bản thân",
      "D": "Bị ép buộc"
    },
    "answer": "B",
    "explanation": "Tự giác không chỉ diễn ra cá nhân mà còn ứng dụng tuyệt vời vào làm việc nhóm.",
    "tier": "D - Judgment (Đánh giá hành vi)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_16",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 17,
    "question": "Để không bị sao nhãng khi học bài ở nhà, em có thể lập quy tắc gì cho bản thân?",
    "options": {
      "A": "Bật nhạc sàn thật to",
      "B": "Để mọi đồ chơi, điện thoại ở phòng khác trước khi ngồi vào bàn học",
      "C": "Vừa ăn vừa học",
      "D": "Học 5 phút, chơi 10 phút"
    },
    "answer": "B",
    "explanation": "Vận dụng kỹ năng dọn dẹp môi trường xung quanh để loại bỏ các yếu tố gây mất tập trung.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_17",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 18,
    "question": "Sau một học kỳ kết quả học tập sa sút do lười biếng, em phản tư và làm gì?",
    "options": {
      "A": "Chấp nhận mình học dốt và bỏ cuộc",
      "B": "Tự nhận lỗi, thiết lập lại thời gian biểu và nhờ cô giáo hỗ trợ ôn tập",
      "C": "Đổ lỗi cho đề thi khó",
      "D": "Xin chuyển trường"
    },
    "answer": "B",
    "explanation": "Khả năng đứng lên sau thất bại, tìm ra điểm yếu và thay đổi hành động là sự phản tư cốt lõi.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_18",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 19,
    "question": "Làm thế nào để việc đọc sách trở thành một thói quen tự giác thay vì bị ép buộc?",
    "options": {
      "A": "Mua sách thật đắt tiền",
      "B": "Chọn đọc những cuốn sách về chủ đề mình yêu thích vào khung giờ cố định mỗi ngày",
      "C": "Bắt mẹ đọc cho nghe",
      "D": "Chỉ đọc truyện tranh"
    },
    "answer": "B",
    "explanation": "Áp dụng phương pháp tạo thói quen: bắt đầu từ sở thích và lặp lại đều đặn.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_19",
    "group": "Trách nhiệm & Tự quản"
  },
  {
    "number": 20,
    "question": "Hôm nay em vừa học được cách làm sơ đồ tư duy trên lớp. Tối nay em sẽ:",
    "options": {
      "A": "Gấp sách vở đi ngủ quên luôn",
      "B": "Vận dụng vẽ thử một sơ đồ tư duy tóm tắt bài học Toán để nhớ bài tốt hơn",
      "C": "Xé giấy vẽ máy bay",
      "D": "Bắt bạn làm hộ sơ đồ"
    },
    "answer": "B",
    "explanation": "Thực hành ngay kiến thức mới học là biểu hiện xuất sắc của tinh thần tự giác sáng tạo.",
    "tier": "E - Transfer & Reflection (Vận dụng & Phản tư)",
    "skill": "Tự giác học tập",
    "id": "Tự_giác_học_tập_20",
    "group": "Trách nhiệm & Tự quản"
  }
];