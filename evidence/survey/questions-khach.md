# Khảo sát khách — bộ câu hỏi

> Lát cắt: lễ tân xử lý yêu cầu **đổi / nâng hạng phòng của khách đang ở** (Track C · C2, xem `canvas.md`).
> Người dùng chính vẫn là **lễ tân** (`questions.md`). Form này là **nguồn kiểm lại từ phía khách**, cùng vai trò với việc đào review ở `evidence/data-mining.md`. Số của hai form **đếm riêng, không cộng chung**.
> Form được tạo tự động bằng `create_form_khach.gs`. Sửa câu hỏi thì sửa **cả hai file** cho khớp.

## Thông tin gửi

- Link form (người trả lời): __
- Link sheet kết quả (chỉ nhóm): __ — **không** commit link này nếu sheet còn cột liên hệ
- Kênh đã gửi: __ (vd nhóm du lịch / review khách sạn trên Facebook, bạn bè người thân hay đi du lịch)
- Giờ mở: __ · Giờ chốt: __
- Ngưỡng: **≥20 người ngoài nhóm** đã ở khách sạn / resort trong 12 tháng qua

## Câu hỏi

Hỏi **chuyện đã xảy ra**, không hỏi "có muốn dùng AI không".

| # | Câu hỏi | Kiểu trả lời | Rẽ nhánh |
|---|---|---|---|
| 1 | Trong 12 tháng qua, bạn đã ở khách sạn / resort bao nhiêu lần? | Chọn một: Chưa lần nào · 1 lần · 2–3 lần · Từ 4 lần | "Chưa lần nào" → kết thúc |
| 2 | Trong 12 tháng qua, có lần nào khi **đang lưu trú** bạn muốn đổi phòng hoặc nâng hạng phòng không? | Chọn một: Có, và đã đề nghị với khách sạn · Có, nhưng không đề nghị · Không | "Có, nhưng không đề nghị" → câu 2b rồi kết thúc · "Không" → kết thúc |
| 2b | Vì sao bạn không đề nghị? | Chọn nhiều: Không rõ phí, sợ đắt · Ngại làm phiền · Nghĩ sẽ phải chờ lâu · Nghĩ đã hết phòng · Không biết là có thể đề nghị · Khác | |
| 3 | Lần gần nhất, lý do bạn muốn đổi / nâng hạng là gì? | Chọn nhiều: Sự cố trong phòng (ồn, hỏng, bẩn) · Phòng không giống mô tả / ảnh · Muốn phòng rộng hơn / view đẹp hơn · Thay đổi số người ở · Khác | |
| 4 | Bạn đề nghị bằng cách nào? | Chọn một: Ra quầy lễ tân · Gọi điện từ phòng · Nhắn tin (app, OTA, Zalo…) · Khác | |
| 5 | Từ lúc đề nghị đến lúc được báo phương án (phòng nào, phí bao nhiêu) mất khoảng bao lâu? | Chọn một: Dưới 5 phút · 5–15 phút · 15–30 phút · 30 phút – 2 giờ · Trên 2 giờ / hôm sau · Không được báo | |
| 6 | Phí chênh (nếu có) được báo thế nào? | Chọn một: Báo rõ trước khi tôi đồng ý · Có báo nhưng không rõ cách tính · Chỉ biết khi thanh toán · Được miễn phí · Không nhớ | |
| 7 | Sau khi đã được báo, phí hoặc phòng có bị **thay đổi lại** không? | Chọn một: Có, phí khác với lúc báo · Có, phòng khác / hoá ra không còn phòng · Không · Không nhớ | |
| 8 | Kết quả cuối cùng? | Chọn một: Được đổi đúng như mong muốn · Được phương án khác, chấp nhận được · Không được đổi · Tôi bỏ, không đổi nữa | |
| 9 | Điều gì khó chịu hoặc mất thời gian nhất ở lần đó? | Đoạn văn | |
| 10 | (tuỳ chọn) Bạn có sẵn lòng cho nhóm hỏi thêm 10 phút không? + cách liên hệ | Có / Không + ô văn bản không bắt buộc | |

Không thu tên, email, tên khách sạn (tắt "Thu thập email"). Chỉ câu 10 có thể chứa liên hệ nếu người trả lời tự để lại.

## Câu nào cho insight gì

| Đo | Cách đếm từ `results-khach.csv` |
|---|---|
| Mẫu n | Câu 1 ≠ "Chưa lần nào" |
| Tần suất nhu cầu | Câu 2 ≠ "Không" → x/n |
| Nhu cầu bị bỏ lỡ | Câu 2 = "Có, nhưng không đề nghị" → x/n; lý do phổ biến nhất ở câu 2b |
| Mẫu đã đề nghị m | Câu 2 = "Có, và đã đề nghị" |
| Chờ lâu (kiểm lại pain) | Trong m: câu 5 từ "15–30 phút" trở lên → x/m |
| Phí không minh bạch | Trong m: câu 6 ∈ {không rõ cách tính, chỉ biết khi thanh toán} → x/m |
| Báo sai (rủi ro AI phải tránh) | Trong m: câu 7 = "Có, …" → x/m |
| Kênh đề nghị | Phân bố câu 4 (quầy vs gọi điện vs nhắn tin) |
| Trích dẫn | ≥3 câu nguyên văn từ câu 9 → `evidence/summary.md` |

Dưới khoảng 10 người thì chỉ ghi x/n, không ghi %.

## Lưu kết quả

- Xuất sheet → xoá cột câu 10 (liên hệ) → lưu `evidence/survey/results-khach.csv`.
- Bản gốc còn liên hệ thì **không** commit.
