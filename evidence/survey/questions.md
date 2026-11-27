# Khảo sát lễ tân — bộ câu hỏi

> Lát cắt: lễ tân xử lý yêu cầu **đổi / nâng hạng phòng của khách đang ở** (Track C · C2, xem `canvas.md`).
> Form được tạo tự động bằng `create_form.gs` (Google Apps Script). Sửa câu hỏi thì sửa **cả hai file** cho khớp.

## Thông tin gửi

- Link form (người trả lời): __
- Link sheet kết quả (chỉ nhóm): __ — **không** commit link này nếu sheet còn cột liên hệ
- Kênh đã gửi: __ (vd nhóm Facebook lễ tân / Zalo lớp nghiệp vụ / người quen làm khách sạn)
- Giờ mở: __ · Giờ chốt: __
- Ngưỡng: **≥20 người ngoài nhóm, đúng người dùng** (lễ tân / quản lý ca đang làm hoặc làm trong 12 tháng qua)

## Câu hỏi

Hỏi **chuyện đã xảy ra**, không hỏi "có thích / có muốn dùng AI không".

| # | Câu hỏi | Kiểu trả lời | Rẽ nhánh |
|---|---|---|---|
| 1 | Công việc hiện tại của bạn là gì? | Chọn một: Lễ tân đang làm · Trưởng ca / quản lý ca tiền sảnh · Từng làm lễ tân trong 12 tháng qua · Khác (không làm lễ tân) | "Khác" → kết thúc form |
| 2 | Nơi bạn làm (hoặc làm gần nhất) thuộc loại nào? | Chọn một: Khách sạn ≤3 sao · Khách sạn 4–5 sao · Resort · Homestay / căn hộ dịch vụ · Khác | |
| 3 | Lần gần nhất có **khách đang lưu trú** xin đổi phòng hoặc nâng hạng phòng tại quầy của bạn là khi nào? | Chọn một: Hôm nay · Trong tuần này · Tuần trước · Trong tháng này · Lâu hơn 1 tháng · Chưa bao giờ | "Chưa bao giờ" → kết thúc form |
| 4 | Trong 1 tuần làm việc gần nhất, bạn nhận khoảng bao nhiêu yêu cầu như vậy? | Số nguyên | |
| 5 | Lần gần nhất đó, để trả lời khách bạn đã phải xem / hỏi những gì? | Chọn nhiều: Phần mềm quản lý (PMS) · Bảng giá / file Excel · Văn bản chính sách đổi – nâng hạng · Hỏi buồng phòng về tình trạng phòng · Hỏi quản lý ca · Hỏi đồng nghiệp · Nhóm chat nội bộ · Tự nhớ, không cần tra · Khác | |
| 6 | Lần đó, từ lúc khách yêu cầu đến lúc bạn báo được phương án (phòng + phí) mất khoảng bao lâu? | Chọn một: Dưới 5 phút · 5–15 phút · 15–30 phút · Trên 30 phút | |
| 7 | Kết quả của lần đó? | Chọn một: Giải quyết ngay tại quầy · Phải chờ quản lý duyệt · Khách phải chờ / quay lại sau · Không đáp ứng được · Khác | |
| 8 | Trong 1 tháng qua, ở quầy của bạn (bạn hoặc đồng nghiệp) có lần nào báo khách **sai phí chênh hoặc sai tình trạng phòng** rồi phải sửa lại không? | Chọn một: Có, 1 lần · Có, từ 2 lần · Không · Không nhớ | |
| 9 | Điều gì khó chịu hoặc mất thời gian nhất ở lần gần nhất đó? | Đoạn văn | |
| 10 | (tuỳ chọn) Bạn có sẵn lòng cho nhóm hỏi thêm 10 phút không? + cách liên hệ | Có / Không + ô văn bản không bắt buộc | |

Không thu tên, email, tên khách sạn (tắt "Thu thập email" trong form). Chỉ câu 10 có thể chứa liên hệ nếu người trả lời tự để lại.

## Câu nào kiểm giả thuyết nào

Giả thuyết (`canvas.md` dòng 4): *≥2/3 lễ tân được hỏi kể được một lần trong 1 tháng qua phải tra ≥2 nguồn hoặc hỏi thêm người mới trả lời được khách.*

| Đo | Cách đếm từ `results.csv` |
|---|---|
| Mẫu hợp lệ n | Câu 1 ≠ "Khác" **và** câu 3 ∈ {Hôm nay … Trong tháng này} |
| **Số chính** | Trong n: số người ở câu 5 chọn **≥2 mục**, không tính "Tự nhớ" → x/n |
| Tần suất | Trung vị câu 4 |
| Thời gian | Phân bố câu 6; tỷ lệ "15 phút trở lên" |
| Phụ thuộc quản lý | Tỷ lệ câu 7 = "Phải chờ quản lý duyệt" |
| Rủi ro sai | Tỷ lệ câu 8 = "Có, …" |
| Trích dẫn | ≥3 câu nguyên văn từ câu 9 → `evidence/summary.md` |

Dưới khoảng 10 người hợp lệ thì chỉ ghi x/n, không ghi %.

## Lưu kết quả

- Xuất sheet → xoá cột câu 10 (liên hệ) và cột thời gian nếu cần → lưu `evidence/survey/results.csv`.
- Bản gốc còn liên hệ thì **không** commit.
