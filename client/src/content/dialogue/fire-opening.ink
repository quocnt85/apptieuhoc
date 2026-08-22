VAR approach = "undecided"
VAR readiness_style = "undecided"

-> opening

=== opening ===
# scene_id: fire.opening
# line_id: fire.opening.001
# speaker: bo
# emotion: concerned
# background: smoke_station
# sfx: warning_ping
Bảo, nhìn kìa! Trạm Khói Mù vừa gửi một tín hiệu cảnh báo màu cam.

# line_id: fire.opening.002
# speaker: bao
# emotion: surprised
Tín hiệu này cứ chớp liên tục. Có vẻ một khu vực trên trạm đang gặp rắc rối.

# line_id: fire.opening.003
# speaker: bo
# emotion: thinking
Màn hình chỉ hiện một mê cung mờ và dòng chữ: “Hãy chứng minh em đã sẵn sàng.”

# line_id: fire.opening.004
# speaker: bao
# emotion: curious
Nếu là chỉ huy của đội, cậu muốn chúng ta bắt đầu thế nào?

* [Quan sát kỹ nguồn tín hiệu trước. # choice_id: fire.opening.choice.observe]
    ~ approach = "observe"
    -> approach_observe

* [Gọi cả đội lại để cùng chuẩn bị. # choice_id: fire.opening.choice.team]
    ~ approach = "teamwork"
    -> approach_team

=== approach_observe ===
# line_id: fire.opening.005a
# speaker: bo
# emotion: happy
Tớ cũng muốn nhìn kỹ trước. Một chi tiết nhỏ có thể giúp cả đội hiểu chuyện gì đang xảy ra.
-> approach_join

=== approach_team ===
# line_id: fire.opening.005b
# speaker: bao
# emotion: happy
Ý hay đấy! Khi mọi người cùng sẵn sàng, chúng ta sẽ bình tĩnh hơn trước một nhiệm vụ khó.
-> approach_join

=== approach_join ===
# line_id: fire.opening.006
# speaker: bo
# emotion: serious
# background: smoke_station_map
Mê cung vừa sáng lên. Nó muốn kiểm tra điều cậu đã biết trước khi mở đường khám phá.

# line_id: fire.opening.007
# speaker: bao
# emotion: encourage
Cậu muốn tự mình thử sức, hay muốn bọn tớ đứng cạnh theo dõi?

* [Mình muốn tự thử sức. # choice_id: fire.opening.choice.solo]
    ~ readiness_style = "solo"
    -> readiness_solo

* [Hai bạn hãy đứng cạnh mình. # choice_id: fire.opening.choice.together]
    ~ readiness_style = "together"
    -> readiness_together

=== readiness_solo ===
# line_id: fire.opening.008a
# speaker: bao
# emotion: proud
Được! Bọn tớ sẽ giữ liên lạc và để cậu tự đưa ra quyết định.
-> challenge_rules

=== readiness_together ===
# line_id: fire.opening.008b
# speaker: bo
# emotion: encourage
Tất nhiên. Bọn tớ sẽ ở đây, nhưng các lựa chọn trong thử thách vẫn là của cậu.
-> challenge_rules

=== challenge_rules ===
# line_id: fire.opening.009
# speaker: bo
# emotion: serious
Đây là lượt thử duy nhất trước khi luyện tập. Kết quả chỉ hiện tổng điểm, không bật mí từng câu.

# line_id: fire.opening.010
# speaker: bao
# emotion: excited
Nếu đủ điểm, cậu sẽ đi thẳng tới nhiệm vụ thực tế cùng gia đình.

# line_id: fire.opening.011
# speaker: bo
# emotion: encourage
Nếu chưa đủ, chúng ta sẽ khám phá từng tọa độ, luyện kỹ năng rồi cùng đối mặt Final Boss.

# line_id: fire.opening.012
# speaker: bao
# emotion: encourage
# command: OPEN_CHALLENGE
Bình tĩnh nhé. Khi cậu sẵn sàng, chúng ta bắt đầu!

-> END
