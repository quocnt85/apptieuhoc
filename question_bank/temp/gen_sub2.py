import json
import itertools

skills = [
    "Kĩ năng phòng tránh nguy cơ bị đuối nước",
    "Quan sát",
    "Sắp xếp",
    "So sánh",
    "Phân loại",
    "Sáng tạo",
    "Chào hỏi"
]

tiers = [
    "A - Knowledge (Biết)",
    "B - Understanding (Hiểu)",
    "C - Decision Making (Lựa chọn trong tình huống)",
    "D - Judgment (Đánh giá hành vi)",
    "E - Transfer & Reflection (Vận dụng & Phản tư)"
]

data = []

# To ensure the content is meaningful but we don't exceed limits writing it manually, 
# I will generate 140 unique questions using a structured template logic.
# However, as an AI, I should provide real pedagogical questions.
# I will output the questions explicitly in this script.

questions = {
    8: [
        # Biết
        {"q":"Đâu là nơi an toàn để bơi lội?","opts":["Sông có dòng chảy xiết","Hồ bơi có cứu hộ","Ao làng vắng vẻ","Biển lúc có bão"],"ans":"B","exp":"Hồ bơi có nhân viên cứu hộ là nơi an toàn nhất."},
        {"q":"Vật dụng nào giúp nổi trên mặt nước?","opts":["Cục gạch","Áo phao","Balo nặng","Giày thể thao"],"ans":"B","exp":"Áo phao được thiết kế để giữ cơ thể nổi."},
        {"q":"Màu cờ nào ở bãi biển báo hiệu KHÔNG ĐƯỢC tắm?","opts":["Cờ xanh","Cờ vàng","Cờ đỏ","Cờ trắng"],"ans":"C","exp":"Cờ đỏ là biển báo nguy hiểm cấm tắm."},
        {"q":"Số điện thoại khẩn cấp gọi cứu nạn ở Việt Nam là?","opts":["112","113","114","115"],"ans":"C","exp":"114 là số cứu nạn cứu hộ."},
        # Hiểu
        {"q":"Tại sao phải khởi động trước khi xuống nước?","opts":["Để bơi nhanh hơn","Tránh bị chuột rút (vọp bẻ)","Để nước không vào tai","Để được khen"],"ans":"B","exp":"Khởi động giúp làm nóng cơ bắp, tránh co rút."},
        {"q":"Tại sao không nên bơi khi vừa ăn no?","opts":["Vì sẽ bị chìm","Dễ gây đau dạ dày và khó thở","Làm bẩn nước","Không ai bơi lúc no"],"ans":"B","exp":"Bơi lúc no làm tăng áp lực dạ dày, gây mệt."},
        {"q":"Hành động nào gây nguy hiểm khi ở hồ bơi?","opts":["Chạy nhảy đùa giỡn trên bờ","Mặc đồ bơi","Tắm tráng trước khi bơi","Khởi động"],"ans":"A","exp":"Sàn hồ bơi trơn trợt dễ gây té ngã."},
        {"q":"Biển báo 'Khu vực nước sâu' có ý nghĩa gì?","opts":["Nước ở đây rất trong","Dành cho người không biết bơi","Chỉ người bơi giỏi mới được vào","Nước sâu nguy hiểm"],"ans":"D","exp":"Cảnh báo độ sâu nguy hiểm cho người bơi yếu."},
        # Lựa chọn
        {"q":"Thấy bạn bị ngã xuống ao, em nên làm gì ĐẦU TIÊN?","opts":["Nhảy xuống cứu bạn ngay","Hét to kêu cứu người lớn","Chạy về nhà trốn","Khóc lóc"],"ans":"B","exp":"Trẻ em không đủ sức cứu người, cần gọi người lớn."},
        {"q":"Đang bơi thì thấy mệt, em sẽ làm gì?","opts":["Cố bơi tiếp","Bơi nhanh hơn","Bơi vào bờ hoặc gọi cứu hộ","Lặn xuống đáy"],"ans":"C","exp":"Khi mệt cần vào bờ nghỉ ngơi ngay."},
        {"q":"Bạn rủ em ra sông tắm vào buổi trưa vắng, em chọn cách nào?","opts":["Đồng ý ngay","Rủ thêm người khác","Từ chối và khuyên bạn không đi","Chỉ ra xem bạn tắm"],"ans":"C","exp":"Tắm sông vắng rất nguy hiểm, cần từ chối."},
        {"q":"Em nhặt được đồ chơi rơi xuống hồ nước, em làm gì?","opts":["Cố với lấy","Dùng cây ngắn khều","Báo cho người lớn hoặc cứu hộ","Lội xuống lấy"],"ans":"C","exp":"Tránh tự ý với đồ gần mép nước dễ té ngã."},
        # Đánh giá
        {"q":"Nam hay giả vờ kêu cứu khi đi bơi để trêu bạn. Hành vi này:","opts":["Rất vui nhộn","Giúp Nam bơi giỏi hơn","Nguy hiểm, cứu hộ sẽ không tin khi gặp nạn thật","Bình thường"],"ans":"C","exp":"Đùa giỡn kêu cứu làm mất lòng tin của cứu hộ."},
        {"q":"Lan luôn mặc áo phao khi đi ghe thuyền dù biết bơi. Em thấy Lan:","opts":["Nhát gan","Thực hiện đúng quy tắc an toàn","Không cần thiết","Tốn thời gian"],"ans":"B","exp":"Mặc áo phao khi đi phương tiện thủy là bắt buộc."},
        {"q":"Một nhóm bạn thi xem ai nín thở dưới nước lâu nhất. Hành vi này:","opts":["Giúp tăng sức khỏe","Rất dũng cảm","Nguy hiểm, dễ gây ngạt nước","Nên khuyến khích"],"ans":"C","exp":"Nín thở quá lâu dưới nước có thể gây ngất xỉu."},
        {"q":"Tuấn xô bạn xuống nước để đùa. Em đánh giá hành vi của Tuấn?","opts":["Đùa vui","Thân thiện","Rất nguy hiểm, có thể làm bạn sặc nước","Sáng tạo"],"ans":"C","exp":"Xô đẩy ở hồ bơi có thể gây chấn thương và đuối nước."},
        # Vận dụng & Phản tư
        {"q":"Nếu gia đình em đi du lịch biển, em sẽ chuẩn bị gì để an toàn?","opts":["Chỉ mang đồ ăn","Mang phao bơi, áo phao và kem chống nắng","Mang sách vở","Chỉ mang điện thoại"],"ans":"B","exp":"Chuẩn bị đồ an toàn là cần thiết khi đi biển."},
        {"q":"Sau khóa học bơi, em rút ra bài học gì quan trọng nhất?","opts":["Có thể bơi ở bất cứ đâu","Luôn tuân thủ quy tắc an toàn nước","Bơi để thi đấu","Không cần mặc áo phao nữa"],"ans":"B","exp":"Quy tắc an toàn luôn phải đặt lên hàng đầu."},
        {"q":"Khi thấy biển báo cấm tắm nhưng nước rất nông, em làm gì?","opts":["Cứ tắm vì nước nông","Chụp ảnh dưới nước","Tuân thủ biển báo và không tắm","Rủ bạn cùng xuống"],"ans":"C","exp":"Biển cấm có thể vì lý do khác như sụt lún, ô nhiễm."},
        {"q":"Em sẽ khuyên em út điều gì khi chơi gần ao hồ?","opts":["Không được tới gần mép nước một mình","Ném đá xuống ao cho vui","Tự lấy đồ chơi nếu rớt xuống","Rủ bạn ra đó chơi"],"ans":"A","exp":"Trẻ nhỏ tuyệt đối không chơi gần nước một mình."}
    ],
    9: [
        {"q":"Quan sát là sử dụng giác quan nào?","opts":["Chỉ dùng mắt","Dùng mắt, tai, mũi và các giác quan khác","Chỉ dùng tay","Chỉ dùng tai"],"ans":"B","exp":"Quan sát bao gồm việc thu thập thông tin bằng nhiều giác quan."},
        {"q":"Khi quan sát một bông hoa, em thấy được điều gì bằng mắt?","opts":["Mùi hương","Độ mềm","Màu sắc","Tiếng lá reo"],"ans":"C","exp":"Mắt dùng để nhận biết màu sắc, hình dáng."},
        {"q":"Đâu là công cụ hỗ trợ quan sát?","opts":["Cái búa","Kính lúp","Cái kéo","Cây bút"],"ans":"B","exp":"Kính lúp giúp phóng to vật để nhìn rõ hơn."},
        {"q":"Quan sát thời tiết để làm gì?","opts":["Để biết mặc đồ phù hợp","Để học giỏi toán","Để ăn ngon","Để chơi game"],"ans":"A","exp":"Quan sát thời tiết giúp chọn trang phục và chuẩn bị ra ngoài."},
        {"q":"Tại sao khi sang đường cần quan sát kỹ?","opts":["Để xem có ai quen không","Để tránh xe cộ, đảm bảo an toàn","Để nhìn đèn đường","Để đi chậm lại"],"ans":"B","exp":"Quan sát giúp phát hiện chướng ngại vật và xe cộ."},
        {"q":"Sự khác nhau giữa 'nhìn' và 'quan sát' là gì?","opts":["Nhìn tốn sức hơn","Quan sát là nhìn có chủ đích và ghi nhớ chi tiết","Không có gì khác","Nhìn dùng mắt, quan sát dùng mũi"],"ans":"B","exp":"Quan sát sâu sắc và có phân tích hơn việc chỉ nhìn qua."},
        {"q":"Quan sát bức tranh cẩn thận giúp em điều gì?","opts":["Hiểu được ý nghĩa và chi tiết","Vẽ nhanh hơn","Bức tranh đẹp hơn","Mắt sáng hơn"],"ans":"A","exp":"Quan sát kỹ giúp thu thập đủ thông tin."},
        {"q":"Tại sao bác sĩ cần quan sát sắc mặt bệnh nhân?","opts":["Để khen bệnh nhân","Để chẩn đoán tình trạng sức khỏe","Để vẽ chân dung","Để hỏi tên"],"ans":"B","exp":"Sắc mặt phản ánh một phần tình trạng bệnh lý."},
        {"q":"Mẹ đang bận nấu ăn, em thấy nước trong nồi trào ra. Em làm gì?","opts":["Đứng nhìn","Chạy đi chơi","Gọi mẹ hoặc giúp mẹ tắt bếp (nếu biết cách an toàn)","Khóc"],"ans":"C","exp":"Quan sát thấy sự cố cần có hành động phản hồi kịp thời."},
        {"q":"Đi dã ngoại, em thấy bầu trời đen kịt và gió lớn. Em làm gì?","opts":["Chạy ra bãi cỏ chơi","Rủ bạn đi bơi","Tìm nơi trú ẩn an toàn vì sắp mưa to","Lấy diều ra thả"],"ans":"C","exp":"Bầu trời đen kịt là dấu hiệu trời chuyển mưa dông."},
        {"q":"Đọc đề bài toán, em thấy mình hay làm sai. Lần này em nên làm gì?","opts":["Làm thật nhanh","Nhờ bạn làm hộ","Quan sát kỹ từng chữ, số liệu trước khi làm","Bỏ qua"],"ans":"C","exp":"Quan sát kỹ giúp tránh nhầm lẫn dữ kiện."},
        {"q":"Bước vào phòng tối, em sẽ làm gì đầu tiên?","opts":["Chạy nhanh vào trong","Quan sát tìm công tắc đèn","Nhắm mắt lại","Ngồi thụp xuống"],"ans":"B","exp":"Quan sát xung quanh để tìm công tắc hoặc nguồn sáng."},
        {"q":"Bạn Lan luôn nhìn trước ngó sau khi đi đường. Em đánh giá thế nào?","opts":["Lan bị sợ hãi quá mức","Lan mất tập trung","Lan cẩn thận và có kỹ năng quan sát tốt","Lan đi chậm"],"ans":"C","exp":"Quan sát khi đi đường là thói quen tốt để an toàn."},
        {"q":"Minh tìm đồ chơi nhưng chỉ liếc qua rồi bảo không thấy. Lỗi của Minh là?","opts":["Mắt kém","Chưa biết cách quan sát kỹ càng","Đồ chơi bị mất","Minh lười"],"ans":"B","exp":"Liếc qua không đủ để tìm đồ, cần quan sát kỹ."},
        {"q":"Hoa nhận ra bạn buồn vì thấy bạn ít nói và hay cúi đầu. Hoa có kỹ năng gì?","opts":["Quan sát và thấu hiểu tinh tế","Sáng tạo tốt","Sắp xếp giỏi","Phân loại giỏi"],"ans":"A","exp":"Quan sát nét mặt, cử chỉ giúp nhận biết cảm xúc."},
        {"q":"Nam sang đường chỉ nhìn một bên trái. Đánh giá hành vi của Nam?","opts":["Đúng, chỉ cần nhìn trái","Sai, chưa quan sát toàn diện, dễ gặp nguy hiểm","Nhanh nhẹn","Rất tốt"],"ans":"B","exp":"Sang đường cần quan sát cả hai bên."},
        {"q":"Từ việc quan sát cây con héo, em rút ra bài học gì?","opts":["Cây không cần nước","Cần phải tưới nước và chăm sóc cây thường xuyên","Nhổ cây đi","Cây thích nắng gắt"],"ans":"B","exp":"Phản tư từ quan sát giúp điều chỉnh hành động chăm sóc."},
        {"q":"Làm sao để rèn luyện kỹ năng quan sát tốt hơn mỗi ngày?","opts":["Chơi game nhiều","Chú ý tiểu tiết và đặt câu hỏi về mọi thứ xung quanh","Nhắm mắt nhiều hơn","Đọc truyện tranh"],"ans":"B","exp":"Tập trung chú ý giúp nâng cao khả năng quan sát."},
        {"q":"Vận dụng kỹ năng quan sát vào việc dọn phòng, em sẽ làm gì?","opts":["Gom tất cả vào một góc","Nhìn xem món nào đang để sai chỗ và cất lại","Nhờ mẹ dọn","Tắt đèn đi ngủ"],"ans":"B","exp":"Quan sát giúp phát hiện sự lộn xộn để xử lý."},
        {"q":"Quan sát giúp em phòng tránh nguy hiểm như thế nào?","opts":["Làm em dũng cảm hơn","Nhận biết sớm các rủi ro (ổ gà, biển báo) để tránh","Giúp em chạy nhanh","Làm em khỏe hơn"],"ans":"B","exp":"Nhận diện rủi ro sớm là cốt lõi của việc phòng tránh."}
    ],
    10: [
        {"q":"Sắp xếp là gì?","opts":["Làm lộn xộn mọi thứ","Bố trí đồ vật theo một trật tự nhất định","Giấu đồ vật đi","Vứt đồ đạc đi"],"ans":"B","exp":"Sắp xếp là đặt mọi thứ vào đúng vị trí và trật tự."},
        {"q":"Đâu là một cách sắp xếp sách vở phổ biến?","opts":["Theo kích thước (từ lớn đến nhỏ)","Theo màu sắc một cách ngẫu nhiên","Trộn lẫn lộn","Để dưới gầm giường"],"ans":"A","exp":"Sắp xếp theo kích thước giúp gọn gàng và dễ lấy."},
        {"q":"Dụng cụ nào dùng để sắp xếp quần áo?","opts":["Tủ, móc treo","Hộp bút","Giỏ rác","Tủ lạnh"],"ans":"A","exp":"Tủ và móc thiết kế riêng cho quần áo."},
        {"q":"Lợi ích của việc sắp xếp góc học tập là gì?","opts":["Tốn thời gian","Dễ tìm đồ và học tập tập trung hơn","Làm mất đồ","Làm phòng nhỏ lại"],"ans":"B","exp":"Góc học tập gọn gàng giúp tăng hiệu quả."},
        {"q":"Tại sao trong siêu thị hàng hóa phải được sắp xếp theo khu vực?","opts":["Để đẹp mắt","Để khách hàng dễ tìm kiếm và mua sắm","Để nhân viên nghỉ ngơi","Để tránh chuột"],"ans":"B","exp":"Phân khu hàng hóa giúp định vị sản phẩm nhanh chóng."},
        {"q":"Sắp xếp thời gian (lập thời gian biểu) có tác dụng gì?","opts":["Làm em bận rộn hơn","Giúp cân bằng việc học, chơi và nghỉ ngơi","Làm em mệt mỏi","Để bố mẹ vui"],"ans":"B","exp":"Quản lý thời gian tốt giúp cuộc sống nề nếp hơn."},
        {"q":"Điều gì xảy ra nếu không sắp xếp đồ dùng cá nhân?","opts":["Thất lạc đồ và tốn thời gian tìm kiếm","Đồ dùng tự gọn gàng","Tiết kiệm thời gian","Được khen"],"ans":"A","exp":"Sự bừa bộn dẫn đến mất mát và lãng phí thời gian."},
        {"q":"Nguyên tắc 'đồ hay dùng để bên ngoài' khi sắp xếp giúp gì?","opts":["Đẹp tủ","Lấy nhanh chóng, thuận tiện","Bảo vệ đồ vật","Tiết kiệm tiền"],"ans":"B","exp":"Đồ thường xuyên dùng cần dễ tiếp cận nhất."},
        {"q":"Bàn học của em đầy giấy nháp và bút. Em sẽ làm gì?","opts":["Để nguyên đó","Vứt hết giấy nháp, bỏ bút vào ống bút","Gom tất cả vào cặp","Chuyển sang giường học"],"ans":"B","exp":"Loại bỏ rác và cất đồ dùng đúng chỗ để gọn gàng."},
        {"q":"Có 5 việc cần làm buổi tối. Em chọn cách sắp xếp nào?","opts":["Làm việc mình thích nhất trước","Làm theo thứ tự ưu tiên (việc gấp làm trước)","Làm cùng lúc 5 việc","Không làm việc nào"],"ans":"B","exp":"Sắp xếp công việc theo mức độ quan trọng mang lại hiệu quả cao."},
        {"q":"Đi dã ngoại, em sắp xếp balo như thế nào?","opts":["Nhét mọi thứ vào","Đồ nặng ở đáy, đồ hay dùng ở ngăn ngoài","Đồ ăn để dưới cùng","Để balo trống"],"ans":"B","exp":"Cách xếp balo chuẩn giúp mang vác nhẹ và dễ lấy đồ."},
        {"q":"Tủ giày bị lộn xộn. Em nên phân chia thế nào?","opts":["Giày đi học 1 ngăn, dép đi chơi 1 ngăn","Xếp chồng lên nhau","Cất vào túi nilon","Bỏ bớt giày"],"ans":"A","exp":"Phân chia theo mục đích sử dụng giúp tủ giày khoa học."},
        {"q":"Bạn Huy luôn xếp sách truyện theo vần A, B, C. Đánh giá thói quen này?","opts":["Mất thời gian vô ích","Rất khoa học, giúp tìm kiếm siêu nhanh","Không cần thiết","Chỉ thủ thư mới làm"],"ans":"B","exp":"Sắp xếp theo thứ tự chữ cái là phương pháp tối ưu."},
        {"q":"Mẹ dọn phòng giúp nhưng Nam lại vứt đồ bừa bãi. Nam đang thiếu kỹ năng gì?","opts":["Kỹ năng hát","Kỹ năng tự phục vụ và sắp xếp","Kỹ năng giao tiếp","Kỹ năng tính toán"],"ans":"B","exp":"Giữ gìn trật tự là biểu hiện của kỹ năng sắp xếp."},
        {"q":"Lan để quần áo bẩn lẫn quần áo sạch. Hành động này:","opts":["Đúng, tiết kiệm chỗ","Sai, mất vệ sinh và bừa bộn","Sáng tạo","Không sao cả"],"ans":"B","exp":"Quần áo bẩn cần để riêng để không lây mùi sang đồ sạch."},
        {"q":"Một học sinh lập kế hoạch học tập chi tiết nhưng không thực hiện. Đánh giá?","opts":["Giỏi sắp xếp","Biết sắp xếp trên giấy nhưng thiếu kỷ luật thực hành","Kém sắp xếp","Rất tốt"],"ans":"B","exp":"Sắp xếp kế hoạch phải đi đôi với hành động."},
        {"q":"Em vận dụng kỹ năng sắp xếp vào máy tính như thế nào?","opts":["Để mọi file ở Desktop","Tạo các thư mục (Học tập, Giải trí) để lưu trữ","Xóa hết file","Không dùng máy tính"],"ans":"B","exp":"Tạo thư mục giúp quản lý dữ liệu số hiệu quả."},
        {"q":"Sau một tuần gọn gàng, bàn học lại bừa. Em rút ra bài học gì?","opts":["Không cần dọn nữa","Phải duy trì thói quen cất đồ ngay sau khi dùng","Đổ lỗi cho em bé","Dọn 1 năm 1 lần"],"ans":"B","exp":"Sắp xếp là quá trình cần được duy trì liên tục."},
        {"q":"Làm thế nào để việc dọn dẹp, sắp xếp trở nên thú vị hơn?","opts":["Vừa dọn vừa bật nhạc yêu thích","Vừa dọn vừa khóc","Bắt người khác dọn cùng","Dọn thật chậm"],"ans":"A","exp":"Âm nhạc tạo cảm hứng và niềm vui khi làm việc nhà."},
        {"q":"Sắp xếp tốt giúp ích gì cho tư duy của em?","opts":["Tư duy logic, rành mạch hơn","Tư duy chậm lại","Không có tác dụng","Mất khả năng sáng tạo"],"ans":"A","exp":"Không gian ngăn nắp phản ánh và rèn luyện tư duy logic."}
    ],
    11: [
        {"q":"So sánh là làm gì?","opts":["Tìm ra điểm giống và khác nhau giữa các sự vật","Cắt đôi đồ vật","Trộn mọi thứ lại","Vứt bỏ đồ cũ"],"ans":"A","exp":"So sánh giúp nhận diện đặc điểm đặc trưng của đối tượng."},
        {"q":"Để so sánh độ dài 2 chiếc bút, em dùng gì?","opts":["Cái cân","Thước kẻ","Nhiệt kế","Kính lúp"],"ans":"B","exp":"Thước kẻ là công cụ đo độ dài chuẩn xác."},
        {"q":"Khi so sánh quả cam và quả chanh, điểm khác biệt rõ nhất là?","opts":["Đều có hạt","Vị (ngọt/chua) và kích thước","Đều là trái cây","Đều có vỏ"],"ans":"B","exp":"Vị và kích thước là đặc điểm phân biệt cam và chanh."},
        {"q":"Phép toán nào thường dùng để so sánh số lượng?","opts":["Cộng","Lớn hơn (>), nhỏ hơn (<), bằng (=)","Nhân","Chia"],"ans":"B","exp":"Các dấu >, <, = là ký hiệu của phép so sánh."},
        {"q":"Tại sao chúng ta cần kỹ năng so sánh khi đi mua hàng?","opts":["Để xem hàng hóa có đẹp không","Để chọn được sản phẩm tốt nhất với giá hợp lý (so sánh giá và chất lượng)","Để mua được hàng đắt nhất","Để cửa hàng vui"],"ans":"B","exp":"So sánh giúp người tiêu dùng đưa ra lựa chọn thông minh."},
        {"q":"So sánh mùa hè và mùa đông ở miền Bắc có điểm gì khác nhau cốt lõi?","opts":["Mùa hè nóng, mùa đông lạnh","Mùa hè có tuyết","Mùa đông đi bơi","Không có gì khác"],"ans":"A","exp":"Nhiệt độ là đặc trưng cơ bản phân biệt hai mùa này."},
        {"q":"So sánh giúp em nhận ra điều gì trong học tập?","opts":["Thấy mình kém cỏi","Nhận ra sự tiến bộ của bản thân so với hôm qua","Thấy bạn bè xấu","Thấy mệt mỏi"],"ans":"B","exp":"So sánh bản thân với quá khứ giúp nhận diện sự phát triển."},
        {"q":"Đâu là ví dụ của việc so sánh để tìm điểm giống nhau?","opts":["Chó sủa, mèo kêu","Cả con mèo và con hổ đều thuộc họ Mèo","Gà có lông, cá có vảy","Cây có lá, hòn đá không có"],"ans":"B","exp":"Tìm điểm giống nhau để đưa vào cùng một nhóm phân loại."},
        {"q":"Em được cho 2 đôi giày, 1 chật và 1 vừa chân. Em so sánh và chọn?","opts":["Đôi chật vì nó đẹp","Đôi vừa chân để đi lại thoải mái","Lấy cả hai","Không lấy đôi nào"],"ans":"B","exp":"So sánh mức độ phù hợp để đưa ra quyết định tốt nhất."},
        {"q":"Đứng trước 2 con đường về nhà: đường ngắn nhưng nhiều xe, đường dài nhưng an toàn. Em chọn?","opts":["Đường ngắn cho nhanh","Đường an toàn dù xa hơn một chút","Đứng im","Đi nhắm mắt"],"ans":"B","exp":"So sánh rủi ro an toàn quan trọng hơn thời gian."},
        {"q":"Bạn rủ em chơi game và mẹ nhắc em làm bài tập. Em so sánh lợi hại thế nào?","opts":["Chơi game vui hơn nên chơi","Làm bài tập mang lợi ích lâu dài nên chọn làm bài","Bỏ nhà đi","Vừa chơi vừa làm"],"ans":"B","exp":"So sánh ưu tiên giúp ra quyết định đúng đắn."},
        {"q":"Khi so sánh hai cuốn sách truyện để mua, em nên dựa vào tiêu chí nào?","opts":["Cuốn nào nặng hơn","Nội dung, thể loại mình thích và giá tiền","Cuốn nào có màu đỏ","Cuốn nào cũ hơn"],"ans":"B","exp":"Nội dung và giá tiền là tiêu chí phù hợp để chọn sách."},
        {"q":"Minh hay so sánh quần áo của mình kém hàng hiệu của bạn. Đánh giá việc này?","opts":["Minh rất giỏi so sánh","So sánh vật chất gây tự ti, không nên khuyến khích","Minh nghèo","Nên so sánh nhiều hơn"],"ans":"B","exp":"So sánh vật chất với người khác dễ sinh tiêu cực."},
        {"q":"Lan so sánh kết quả kiểm tra của mình tháng này cao hơn tháng trước để cố gắng. Đánh giá?","opts":["Rất tích cực, so sánh để tự hoàn thiện","Lan kiêu ngạo","Lan rảnh rỗi","Không nên so sánh thế"],"ans":"A","exp":"So sánh dọc (với chính mình) là động lực phát triển."},
        {"q":"Người bán hàng nói trái cây này ngon nhất. Em nên làm gì?","opts":["Tin ngay","Quan sát và so sánh với các sạp khác để đánh giá khách quan","Cãi lại","Bỏ đi"],"ans":"B","exp":"So sánh khách quan giúp tránh bị lừa dối."},
        {"q":"Một bạn chê tranh của em xấu hơn tranh của bạn ấy. Em đánh giá hành vi đó?","opts":["Bạn ấy đúng","So sánh mang tính chê bai là thiếu tôn trọng","Mình phải xé tranh","Bạn ấy vẽ giỏi"],"ans":"B","exp":"So sánh để hạ thấp người khác là hành vi kém văn minh."},
        {"q":"Vận dụng kỹ năng so sánh, làm sao để viết một bài văn miêu tả hay?","opts":["Chép trên mạng","Dùng các hình ảnh so sánh (vd: mặt trời như quả cầu lửa)","Viết ngắn lại","Viết chữ to"],"ans":"B","exp":"Biện pháp tu từ so sánh làm câu văn sinh động."},
        {"q":"Khi gặp hai thông tin trái chiều trên mạng, em sẽ làm gì?","opts":["Tin tin nào đọc trước","So sánh nguồn gốc, độ tin cậy để tìm sự thật","Chia sẻ ngay","Không tin ai"],"ans":"B","exp":"Kỹ năng so sánh giúp đánh giá tính xác thực của thông tin."},
        {"q":"Sau một tuần ăn nhiều rau và một tuần ăn đồ ngọt, em phản tư điều gì?","opts":["Ăn đồ ngọt khỏe hơn","So sánh thấy ăn rau giúp cơ thể nhẹ nhàng, tiêu hóa tốt hơn","Không thấy gì","Ăn rau làm mệt"],"ans":"B","exp":"So sánh trải nghiệm cá nhân giúp hình thành thói quen tốt."},
        {"q":"Bài học lớn nhất khi học kỹ năng so sánh là gì?","opts":["Để đi cãi nhau","Để nhận thức đúng đắn và đưa ra lựa chọn sáng suốt","Để thấy mình giỏi nhất","Để thi toán"],"ans":"B","exp":"Mục đích cuối cùng của so sánh là ra quyết định."}
    ],
    12: [
        {"q":"Phân loại là gì?","opts":["Xếp các vật có chung đặc điểm vào cùng một nhóm","Cắt nhỏ đồ vật","Vứt đồ đạc đi","Trộn mọi thứ vào nhau"],"ans":"A","exp":"Phân loại là nhóm các đối tượng theo tiêu chí chung."},
        {"q":"Khi phân loại rác, ta thường chia làm mấy loại chính?","opts":["Không chia","Rác vô cơ, rác hữu cơ, rác tái chế","Chỉ rác nhựa","Chỉ rác giấy"],"ans":"B","exp":"Ba nhóm cơ bản giúp xử lý rác thải hiệu quả."},
        {"q":"Động vật nào sau đây thuộc nhóm gia cầm?","opts":["Bò","Chó","Gà","Cá"],"ans":"C","exp":"Gà là động vật có lông vũ, có cánh, được chăn nuôi."},
        {"q":"Trái cây được phân loại vào nhóm thực phẩm nào?","opts":["Nhiều đạm","Nhiều vitamin và khoáng chất","Nhiều chất béo","Nhiều tinh bột"],"ans":"B","exp":"Trái cây cung cấp nguồn vitamin dồi dào."},
        {"q":"Vì sao việc phân loại rác thải lại quan trọng?","opts":["Để thùng rác đẹp hơn","Bảo vệ môi trường và tái chế tài nguyên","Để tốn túi rác","Để người thu gom mệt hơn"],"ans":"B","exp":"Phân loại rác giúp giảm thiểu ô nhiễm và tận dụng phế liệu."},
        {"q":"Mục đích của việc phân loại sách trong thư viện là gì?","opts":["Để sách không bị mốc","Giúp người đọc dễ dàng tra cứu theo môn loại","Để thư viện to hơn","Để trang trí"],"ans":"B","exp":"Hệ thống phân loại giúp việc tìm kiếm nhanh chóng."},
        {"q":"Khi dọn tủ quần áo, tiêu chí phân loại phổ biến là gì?","opts":["Theo kích cỡ người khác","Đồ mùa đông - đồ mùa hè","Trộn lẫn lộn","Đồ sạch - đồ mới"],"ans":"B","exp":"Phân loại theo mùa giúp dễ chọn trang phục hàng ngày."},
        {"q":"Trong toán học, số chẵn và số lẻ là kết quả của việc phân loại theo tiêu chí nào?","opts":["Chia hết cho 2 hay không","Số lớn hay số nhỏ","Số đẹp hay số xấu","Màu sắc số"],"ans":"A","exp":"Dấu hiệu chia hết cho 2 là tiêu chí phân biệt chẵn/lẻ."},
        {"q":"Có một rổ đồ chơi gồm lego, ô tô, búp bê. Em sẽ chia nhóm thế nào để cất?","opts":["Cho hết vào 1 hộp","Chia 3 hộp: lego, xe cộ, búp bê","Bỏ bớt búp bê","Chia làm 2 hộp bừa"],"ans":"B","exp":"Phân nhóm theo đặc tính đồ chơi giúp dễ tìm lại."},
        {"q":"Khi phụ mẹ nhặt rau, em sẽ phân loại thế nào?","opts":["Phần rau non để ăn, phần lá già và cuống để bỏ (hữu cơ)","Cắt vụn tất cả","Trộn lẫn vào nhau","Vứt hết"],"ans":"A","exp":"Phân loại phần sử dụng được và phần bỏ đi là việc làm bếp cơ bản."},
        {"q":"Mẹ đi chợ mua về cá, thịt lợn, rau cải. Em sẽ cất vào tủ lạnh ra sao?","opts":["Cất chung một ngăn","Thịt, cá ngăn đá; rau củ ngăn mát dưới cùng","Rau vào ngăn đá","Để ngoài hết"],"ans":"B","exp":"Phân loại thực phẩm để bảo quản đúng nhiệt độ."},
        {"q":"Em được giao phân loại các loại bút trong lớp. Em chọn cách nào?","opts":["Bút viết được, bút hết mực, bút màu","Chia bừa","Đập vỡ bút","Không chia"],"ans":"A","exp":"Chia theo chức năng và tình trạng sử dụng là hợp lý nhất."},
        {"q":"Hành động vứt vỏ chuối vào thùng rác nhựa là:","opts":["Đúng","Sai, vỏ chuối là rác hữu cơ","Bình thường","Sáng tạo"],"ans":"B","exp":"Phân loại sai nhóm rác làm hỏng nỗ lực tái chế."},
        {"q":"Mai luôn chia bài tập thành: cần làm ngay, làm sau. Đánh giá thói quen này?","opts":["Lãng phí thời gian","Rất khoa học, biết phân loại mức độ ưu tiên","Không có ích","Mai làm màu"],"ans":"B","exp":"Phân loại ưu tiên giúp quản lý thời gian cực tốt."},
        {"q":"Một cửa hàng để xà phòng chung với bánh kẹo. Em thấy sao?","opts":["Rất tiện lợi","Nguy hiểm, hóa chất có thể lẫn vào thực phẩm","Bình thường","Đẹp mắt"],"ans":"B","exp":"Hóa chất và thực phẩm phải được phân loại và tách biệt."},
        {"q":"Bạn Tuấn cất chung sách giáo khoa và truyện tranh. Em khuyên bạn thế nào?","opts":["Cứ để vậy","Nên phân loại ra 2 góc để lúc học không bị phân tâm","Đốt truyện tranh","Mua thêm sách"],"ans":"B","exp":"Phân loại tài liệu học và giải trí giúp tập trung."},
        {"q":"Áp dụng kỹ năng phân loại, em lập danh sách đi siêu thị thế nào?","opts":["Viết lộn xộn","Chia theo nhóm: Rau củ, Thịt cá, Đồ dùng cá nhân","Nhớ trong đầu","Ghi bừa"],"ans":"B","exp":"Danh sách theo nhóm giúp đi siêu thị không bị bỏ sót và nhanh chóng."},
        {"q":"Phân loại cảm xúc (vui, buồn, giận dữ) giúp ích gì cho em?","opts":["Gọi tên và kiểm soát cảm xúc tốt hơn","Trở nên vô cảm","Hay khóc hơn","Giấu cảm xúc"],"ans":"A","exp":"Nhận diện và phân loại cảm xúc là bước đầu của trí tuệ cảm xúc."},
        {"q":"Sau khi học bài Phân loại, em sẽ thay đổi gì ở tủ sách của mình?","opts":["Gộp tất cả vào","Sắp xếp lại thành từng nhóm: SGK, Vở bài tập, Truyện đọc","Bán tủ sách","Chẳng làm gì"],"ans":"B","exp":"Hành động thực tế minh chứng cho việc tiếp thu bài học."},
        {"q":"Kỹ năng phân loại có liên quan mật thiết với kỹ năng nào?","opts":["Bơi lội","Quan sát và Sắp xếp","Nhảy múa","Ca hát"],"ans":"B","exp":"Phải quan sát mới có tiêu chí phân loại, rồi sau đó sắp xếp."}
    ],
    13: [
        {"q":"Sáng tạo có nghĩa là gì?","opts":["Làm giống hệt người khác","Nghĩ ra ý tưởng mới mẻ hoặc cách làm mới hữu ích","Chép bài của bạn","Ngồi im"],"ans":"B","exp":"Sáng tạo mang tính mới mẻ và có giá trị ứng dụng."},
        {"q":"Hoạt động nào sau đây đòi hỏi nhiều sự sáng tạo?","opts":["Làm toán cộng","Vẽ một bức tranh tự do","Chép chính tả","Quét nhà"],"ans":"B","exp":"Vẽ tự do cho phép trí tưởng tượng bay bổng."},
        {"q":"Sáng tạo từ vật liệu tái chế là làm gì?","opts":["Vứt rác","Dùng chai nhựa cũ làm chậu cây","Mua đồ chơi mới","Đốt rác"],"ans":"B","exp":"Tái sinh vòng đời mới cho vật liệu là một hình thức sáng tạo."},
        {"q":"Ai có thể sáng tạo?","opts":["Chỉ họa sĩ","Chỉ nhà khoa học","Tất cả mọi người, kể cả trẻ em","Chỉ người lớn"],"ans":"C","exp":"Sáng tạo là khả năng tiềm ẩn trong mỗi con người."},
        {"q":"Vì sao trong học tập cần sự sáng tạo?","opts":["Để viết chữ xấu đi","Giúp tìm ra nhiều cách giải quyết bài toán nhanh và hay hơn","Để khỏi phải học","Để giáo viên mắng"],"ans":"B","exp":"Tư duy sáng tạo giúp linh hoạt trong giải quyết vấn đề."},
        {"q":"'Suy nghĩ ra ngoài chiếc hộp' (Think outside the box) nghĩa là gì?","opts":["Ngồi ngoài hộp cacton","Suy nghĩ vượt ra khỏi lối mòn thông thường","Không suy nghĩ gì","Mở hộp ra"],"ans":"B","exp":"Đây là thành ngữ chỉ cách tư duy độc đáo, không theo khuôn mẫu."},
        {"q":"Nếu em sợ sai thì em có dễ sáng tạo không?","opts":["Rất dễ","Khó, vì sáng tạo cần sự dũng cảm thử nghiệm cái mới","Không liên quan","Chắc chắn có"],"ans":"B","exp":"Nỗi sợ sai lầm cản trở bước chân của sự sáng tạo."},
        {"q":"Lợi ích của trò chơi đóng vai (bác sĩ, cảnh sát) đối với trẻ em?","opts":["Tốn thời gian","Phát triển trí tưởng tượng và sự sáng tạo ngôn ngữ","Gây bạo lực","Làm hư đồ chơi"],"ans":"B","exp":"Trò chơi nhập vai kích thích não bộ sáng tạo bối cảnh."},
        {"q":"Khi cái cặp sách bị đứt quai, em sáng tạo cách sửa thế nào tạm thời?","opts":["Vứt cặp đi","Dùng một sợi dây dù chắc chắn buộc làm quai tạm thời","Khóc ở nhà","Đeo cặp bằng răng"],"ans":"B","exp":"Dùng vật dụng thay thế là giải pháp sáng tạo linh hoạt."},
        {"q":"Lớp yêu cầu làm thiệp 20/11, em hết giấy màu. Em chọn cách nào?","opts":["Không làm nữa","Dùng lá cây khô, hoa ép hoặc họa báo cũ để trang trí","Xin tiền mua ngay","Khóc lóc với cô"],"ans":"B","exp":"Sáng tạo bằng vật liệu có sẵn thể hiện sự khéo léo."},
        {"q":"Trời mưa, em không có ô nhưng cần ra vườn lấy đồ. Em sẽ?","opts":["Chạy ra để ướt","Dùng một tàu lá chuối to hoặc đội chậu nhựa","Bỏ không lấy nữa","Đợi đến mai"],"ans":"B","exp":"Ứng biến linh hoạt với môi trường xung quanh là sáng tạo."},
        {"q":"Em được giao làm nhóm trưởng nhưng các bạn không nghe. Em làm gì?","opts":["Mắng các bạn","Nghĩ ra một trò chơi nhỏ gắn với nhiệm vụ để các bạn hứng thú","Bỏ nhóm","Tự làm hết"],"ans":"B","exp":"Đổi mới cách quản lý nhóm bằng trò chơi kích thích tinh thần."},
        {"q":"Nam lấy chổi quét nhà làm đàn ghi-ta để biểu diễn văn nghệ. Hành động này:","opts":["Đáng bị phạt","Thể hiện trí tưởng tượng và sự sáng tạo vui nhộn","Hư hỏng chổi","Không hay"],"ans":"B","exp":"Gắn chức năng mới cho vật quen thuộc là tư duy sáng tạo."},
        {"q":"Bạn Mai vẽ bầu trời màu cam thay vì màu xanh. Ý kiến của em?","opts":["Mai vẽ sai bét","Mai đang sáng tạo bầu trời lúc hoàng hôn hoặc theo trí tưởng tượng","Mai bị mù màu","Không chấm điểm bức tranh đó"],"ans":"B","exp":"Nghệ thuật không có giới hạn màu sắc, đó là sáng tạo."},
        {"q":"Hùng chế tạo 'thuyền' bằng giấy nháp nhưng thả xuống nước chìm ngay. Đánh giá?","opts":["Hùng rất ngu ngốc","Hùng có ý tưởng sáng tạo, chỉ cần cải tiến vật liệu chống nước","Phạt Hùng tội xả rác","Cấm Hùng chơi"],"ans":"B","exp":"Thất bại là một phần của quá trình thử nghiệm sáng tạo."},
        {"q":"Sáng tạo nhưng vi phạm nội quy trường lớp (ví dụ: vẽ bậy lên tường) là:","opts":["Tốt, đáng biểu dương","Sai, sáng tạo phải đặt đúng lúc, đúng chỗ và không phá hoại","Rất nghệ thuật","Nên khuyến khích"],"ans":"B","exp":"Sáng tạo không đồng nghĩa với phá hoại chuẩn mực chung."},
        {"q":"Để kích thích não bộ sáng tạo, em nên làm gì mỗi ngày?","opts":["Chỉ xem điện thoại","Đọc sách, quan sát thiên nhiên và luôn đặt câu hỏi 'Tại sao?'","Ngủ 15 tiếng","Nhịn ăn"],"ans":"B","exp":"Nuôi dưỡng trí tò mò là thức ăn của sáng tạo."},
        {"q":"Từ câu chuyện Tấm Cám, em sáng tạo viết lại một kết cục khác. Việc này giúp gì?","opts":["Làm sai lệch lịch sử","Phát triển tư duy phản biện và khả năng viết lách sáng tạo","Bị cô giáo trừ điểm","Mất thời gian"],"ans":"B","exp":"Sáng tác ngoại truyện (fanfiction) rèn luyện tư duy ngôn ngữ."},
        {"q":"Làm thế nào để kết hợp kỹ năng sáng tạo và làm việc nhóm?","opts":["Mỗi người làm một ý, cãi nhau","Tổ chức 'bão não' (Brainstorming) để gom nhiều ý tưởng độc đáo","Chỉ nghe nhóm trưởng","Không ai nói gì"],"ans":"B","exp":"Brainstorming là phương pháp tuyệt vời để sáng tạo tập thể."},
        {"q":"Sáng tạo quan trọng thế nào đối với tương lai của em?","opts":["Không quan trọng","Giúp em linh hoạt thích nghi và giải quyết những vấn đề chưa từng có","Chỉ để làm họa sĩ","Để chơi game giỏi"],"ans":"B","exp":"Trong thế giới thay đổi nhanh, sáng tạo là chìa khóa sinh tồn."}
    ],
    14: [
        {"q":"Chào hỏi là gì?","opts":["Quay mặt đi nơi khác","Hành vi thể hiện sự tôn trọng, lịch sự khi gặp gỡ người khác","Im lặng lườm người khác","Chỉ là vẫy tay"],"ans":"B","exp":"Chào hỏi là phép lịch sự tối thiểu trong giao tiếp."},
        {"q":"Khi chào người lớn tuổi, em cần có thái độ như thế nào?","opts":["Cười lớn","Khoanh tay, cúi đầu và nói lời chào rõ ràng","Nói lí nhí","Vừa chạy vừa chào"],"ans":"B","exp":"Khoanh tay và cúi đầu thể hiện sự lễ phép của trẻ nhỏ."},
        {"q":"Câu ca dao nào nói về việc chào hỏi?","opts":["Lời chào cao hơn mâm cỗ","Có công mài sắt có ngày nên kim","Uống nước nhớ nguồn","Gần mực thì đen"],"ans":"A","exp":"'Lời chào cao hơn mâm cỗ' đề cao giá trị của sự lễ phép."},
        {"q":"Hành động nào kèm theo lời chào thể hiện sự thân thiện với bạn bè?","opts":["Đánh bạn","Nở nụ cười và vẫy tay","Nheo mắt","Nhăn mặt"],"ans":"B","exp":"Nụ cười là ngôn ngữ toàn cầu của sự thân thiện."},
        {"q":"Tại sao chúng ta nên chào hỏi người khác?","opts":["Để xin tiền","Tạo thiện cảm, xây dựng mối quan hệ tốt đẹp","Để chứng tỏ mình ngoan","Bị bắt buộc"],"ans":"B","exp":"Chào hỏi mở đầu cho mọi sự giao tiếp tích cực."},
        {"q":"Chào hỏi khác nhau thế nào giữa bạn bè và thầy cô?","opts":["Chào bạn bè thì lễ phép, chào thầy cô thì thoải mái","Chào thầy cô cần nghiêm túc, lễ phép; chào bạn thì tự nhiên, vui vẻ","Giống hệt nhau","Không cần chào bạn"],"ans":"B","exp":"Đối tượng giao tiếp quyết định mức độ trang trọng của lời chào."},
        {"q":"Khi khách đến nhà chơi, em làm gì?","opts":["Chạy trốn vào phòng","Ra mở cửa, chào hỏi lễ phép và mời khách vào nhà","Đứng nhìn khách","Đuổi khách đi"],"ans":"B","exp":"Chào hỏi khách đến nhà là thể hiện lòng hiếu khách."},
        {"q":"Vì sao không nên vừa nhai thức ăn vừa nói lời chào?","opts":["Vì ăn sẽ ngon hơn","Mất lịch sự và có thể bị sặc, rơi thức ăn","Để tiết kiệm thời gian","Mọi người đều làm vậy"],"ans":"B","exp":"Vừa ăn vừa nói vi phạm quy tắc thanh lịch."},
        {"q":"Đang đi xe đạp trên đường, em thấy cô giáo. Em nên làm gì?","opts":["Gọi to từ xa","Dừng xe sát lề, đứng xuống xe và cúi chào cô","Cứ đạp xe qua nhanh","Quay đầu đi hướng khác"],"ans":"B","exp":"Dừng xe lại chào thể hiện sự tôn trọng tuyệt đối."},
        {"q":"Vào lớp trễ, thầy giáo đang giảng bài. Em sẽ làm gì?","opts":["Lẻn vào chỗ ngồi","Đứng ở cửa, gõ cửa và xin phép thầy cho vào lớp","Gọi to các bạn","Khóc"],"ans":"B","exp":"Gõ cửa xin phép là cách chào khi có lỗi đi muộn."},
        {"q":"Gặp một người nước ngoài nói 'Hello', em sẽ phản hồi thế nào?","opts":["Lờ đi","Nói lại 'Hello' kèm nụ cười thân thiện","Bỏ chạy","Nói tiếng Việt thật to"],"ans":"B","exp":"Đáp lại bằng ngôn ngữ chung (tiếng Anh) lịch sự."},
        {"q":"Đến chơi nhà bạn, lúc về em cần làm gì?","opts":["Cứ thế đi về","Chào tạm biệt bạn và xin phép bố mẹ bạn để về","Lấy đồ chơi của bạn rồi về","Chạy vụt ra cửa"],"ans":"B","exp":"Chào ra về quan trọng như lúc chào đến."},
        {"q":"Huy gặp bác hàng xóm nhưng cúi gằm mặt lí nhí trong miệng. Đánh giá?","opts":["Huy ngoan","Huy chưa tự tin và cách chào chưa đạt chuẩn lịch sự","Huy bị ốm","Không cần thiết"],"ans":"B","exp":"Chào hỏi cần rõ ràng, ánh mắt nhìn thẳng tôn trọng."},
        {"q":"Lan luôn tươi cười chào các bác lao công trong trường. Đánh giá?","opts":["Lan giả tạo","Lan rất đáng khen, biết tôn trọng mọi người không phân biệt nghề nghiệp","Lan rảnh rỗi","Không cần thiết"],"ans":"B","exp":"Lịch sự với tất cả mọi người là nhân cách tốt."},
        {"q":"Một nhóm bạn trêu chọc việc Nam khoanh tay chào thầy. Em nghĩ gì?","opts":["Các bạn đúng, lớn rồi không cần khoanh tay","Nam đúng, lễ phép không bao giờ là thừa hay đáng xấu hổ","Nam hèn nhát","Nam nên bỏ khoanh tay"],"ans":"B","exp":"Lễ phép luôn là một giá trị cốt lõi, không đáng bị trêu chọc."},
        {"q":"Khách vẫy tay chào bé My, My quay mặt đi không đáp lại. Hành vi này:","opts":["Bình thường","Thiếu lễ phép và làm người khác buồn","Rất cá tính","Nhút nhát nên được chấp nhận"],"ans":"B","exp":"Không đáp lại lời chào là một sự thiếu tôn trọng."},
        {"q":"Làm sao để tập thói quen chào hỏi tự tin hơn?","opts":["Giam mình trong phòng","Bắt đầu bằng việc nhìn vào mắt và mỉm cười chào người thân mỗi sáng","Bắt người khác chào mình trước","Chỉ chào khi bị ép"],"ans":"B","exp":"Luyện tập từ những việc nhỏ trong gia đình."},
        {"q":"Ngoài lời nói, em có thể vận dụng cách chào nào khác (ngôn ngữ cơ thể)?","opts":["Đá chân","Cúi đầu, vẫy tay, hoặc bắt tay (khi phù hợp)","Nhe răng","Nhắm mắt"],"ans":"B","exp":"Ngôn ngữ cơ thể làm phong phú biểu đạt giao tiếp."},
        {"q":"Đi thang máy gặp hàng xóm, em vận dụng bài học thế nào?","opts":["Nhìn điện thoại liên tục","Chủ động mỉm cười và chào hỏi lịch sự","Quay lưng lại","Bấm nút đóng cửa nhanh"],"ans":"B","exp":"Không gian hẹp như thang máy là cơ hội giao tiếp lịch sự."},
        {"q":"Em nhận ra điều gì sau khi chủ động chào hỏi mọi người trong một tuần?","opts":["Mệt mỏi","Mọi người vui vẻ, thân thiện với em hơn và em cũng thấy tự tin hơn","Chẳng ai quan tâm","Mất thời gian"],"ans":"B","exp":"Chào hỏi mang lại năng lượng tích cực cho cả đôi bên."}
    ]
}

for s_idx, skill_name in enumerate(skills):
    key = s_idx + 8
    q_list = questions[key]
    for i, item in enumerate(q_list):
        tier_idx = i // 4
        obj = {
            "number": i + 1,
            "question": item["q"],
            "options": {
                "A": item["opts"][0],
                "B": item["opts"][1],
                "C": item["opts"][2],
                "D": item["opts"][3]
            },
            "answer": item["ans"],
            "explanation": item["exp"],
            "tier": tiers[tier_idx],
            "skill": skill_name
        }
        data.append(obj)

with open("/Users/thuy/Documents/apptieuhoc/question_bank/temp/sub2.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

