# Tổng hợp bằng chứng pain

> Điền ở guide bước 1.2, xong trước **CP3 10:00 Thứ Bảy 28/11**. Chấm ở rubric R1.
> Ba nguồn ngang nhau — tối thiểu **≥1 nguồn đạt ngưỡng**. Mạnh nhất: đào data ra insight → hỏi người dùng để kiểm lại (hoặc ngược lại).
> Phụ trách: Hưng (ghi biên bản, tổng hợp) · Phúc (hỏi, rà lại). Mọi số ở đây truy được về `interviews/P1–P5.md`, `survey/results.csv` / `survey/results-khach.csv` (đếm bằng `survey/tally.py`) hoặc dòng data có số.

## 1. Nguồn đã dùng

| Nguồn | Đạt ngưỡng? | File | Ghi chú |
|---|---|---|---|
| Đào data (x/N, %, cách đếm chạy lại được, ≥5 ví dụ) | ☐ | `evidence/data-mining.md` | Số sơ bộ 5.236 / 515.738 (regex rộng); chưa có script trong repo nên chưa chạy lại được; chỉ là tiếng nói khách |
| Phỏng vấn (≥3 người ngoài nhóm, đúng người dùng) | ☑ | `evidence/interviews/P1.md` … `P5.md` | **5 người**: 3 lễ tân (2 đang làm, 1 từng làm) + 2 trưởng ca. Người hỏi ghi câu trả lời theo bộ câu của form lễ tân; bảng gộp ở `survey/results.csv` |
| Khảo sát (≥20 người ngoài nhóm, đúng người dùng) | ☐ | `evidence/survey/results-khach.csv` | Form khách: 19 phản hồi (thiếu 1 so với ngưỡng), là **phía khách**, dùng để kiểm lại, không phải người dùng chính |

## 2. Số chính

**Quy tắc đếm — chốt trước khi đọc biên bản** (theo `hypothesis.md`):

- **"Gặp pain"** = trong 1 tháng qua kể được **một lần cụ thể** khách đang ở xin đổi / nâng hạng mà phải **tra ≥2 nguồn hoặc hỏi thêm người** mới trả lời được khách.
- Lần gần nhất cũ hơn 1 tháng → không tính vào x (vẫn ghi lại). Đếm theo từng vai, không cộng chung.
- Tần suất hỏi theo **tuần**; số / tháng = × 4 tuần *(tự ước tính)*.
- **Giả thuyết đúng** nếu ≥2/3 lễ tân được hỏi gặp pain.

**Số:**

- **Phỏng vấn — lễ tân: 2/3 gặp pain** (P1, P3; P4 có hỏi 2–3 người nhưng lần gần nhất cũ hơn 1 tháng → không tính) · **trưởng ca: 2/2** (P2, P5) *(n nhỏ, không ghi %)*
- Số yêu cầu / tuần: P1 3 · P2 6 · P3 4 · P4 1 · P5 5 → trung vị 4 *(≈4–24 / tháng, tự ước tính ×4)*
- Thời gian báo được phương án lần gần nhất: dưới 5 phút → trên 30 phút; **2/5 từ 15 phút trở lên** (P3 chờ quản lý, P4 chờ đồng nghiệp xác nhận phòng)
- Quầy có báo sai phí / tình trạng phòng trong 1 tháng qua: **2/5** (P2 1 lần, P3 từ 2 lần; P4 không nhớ)
- Chỗ vướng chính kể ở câu 9 *(nhóm phân loại từ biên bản)*: **xác nhận phòng đã dọn / sẵn sàng 2/5** (P1, P4) · tính phí nhiều đêm, giá theo ngày 1/5 (P2) · chờ quản lý duyệt 1/5 (P3) · hết phòng, phải tìm phương án thay thế 1/5 (P5)
- Đào data: 5.236 / 515.738 review (1,0%) có từ khoá đổi phòng / nâng hạng *(regex rộng, chưa lọc tay)*
- **Khảo sát khách** (`tally.py khach`): n = 18 (bỏ 1 người chưa ở khách sạn lần nào) · từng muốn đổi / nâng hạng khi đang ở **14/18 (78%)** · muốn nhưng **không đề nghị 6/18 (33%)** — lý do: ngại làm phiền 6/6, không rõ phí / sợ đắt 5/6, nghĩ phải chờ lâu 4/6, nghĩ đã hết phòng 4/6 · trong **8 người đã đề nghị**: chờ từ 15 phút **7/8**, phí báo không rõ cách tính **4/8**, phí hoặc phòng bị đổi lại sau khi đã báo **7/8**, nhận phương án khác (không đúng ý ban đầu) 6/8

| | Vai | Gặp pain? | Số lần / 1 tháng qua | Lần gần nhất mất | Đang xoay xở bằng |
|---|---|---|---|---|---|
| P1 | Lễ tân · KS ≤3 sao | Có | 3 / tuần (≈12) | 5–15 phút | Bảng giá Excel + gọi / nhắn buồng phòng xác nhận phòng đã dọn |
| P2 | Trưởng ca · KS 4–5 sao | Có | 6 / tuần (≈24) | Dưới 5 phút | PMS + văn bản chính sách, tự tính giá từng đêm |
| P3 | Lễ tân · Resort | Có | 4 / tuần (≈16) | 15–30 phút | PMS + chờ quản lý ca duyệt trước khi báo giá |
| P4 | Từng làm lễ tân · Homestay | Một phần (lần gần nhất > 1 tháng) | 1 / tuần (≈4) | Trên 30 phút | Nhóm Zalo + hỏi 2–3 đồng nghiệp |
| P5 | Trưởng ca · KS 4–5 sao | Có | 5 / tuần (≈20) | 5–15 phút | PMS + bảng giá, tự tìm phòng thay thế khi hết phòng |

## 3. ≥5 trích dẫn hoặc ví dụ nguyên văn (có nguồn, bỏ tên)

1. "Tuy nhiên, thông tin phòng trống chưa chắc đồng nghĩa với việc phòng đã được dọn xong và sẵn sàng đón khách." — P1 (lễ tân, KS ≤3 sao)
2. "Ở khách sạn 4–5 sao, khách có thể lưu trú nhiều đêm nên việc tính phí nâng hạng không đơn giản chỉ là lấy giá phòng mới trừ giá phòng cũ rồi nhân với số đêm." — P2 (trưởng ca, KS 4–5 sao)
3. "Điều khiến tôi mất thời gian nhất là phải chờ quản lý ca phê duyệt, nhất là khi quản lý đang bận xử lý công việc khác." — P3 (lễ tân, resort)
4. "Thậm chí phải hỏi hai, ba người mới biết chính xác phòng nào có thể bàn giao cho khách." — P4 (từng làm lễ tân, homestay)
5. "Khi loại phòng khách muốn đã hết, nhân viên có thể nhanh chóng đưa ra một hoặc hai phương án khác, kèm thông tin về khác biệt và mức phí, thay vì chỉ thông báo rằng khách sạn không còn phòng." — P5 (trưởng ca, KS 4–5 sao)
6. "Điều khó chịu và mất thời gian nhất khi đổi hoặc nâng hạng phòng trong lúc đang lưu trú là phải chờ khách sạn kiểm tra phòng trống, xác nhận chi phí phát sinh và sắp xếp phòng mới." — phiếu khảo sát khách dòng 11 · *phía khách*
7. "First room had an awful bathroom with tired and shabby decor including peeling paint on walls Bedroom was cold and basic On request was moved to much better room with great bathroom" — dòng data 4324, `Hotel_Reviews.csv` (515K Hotel Reviews, Kaggle, CC0) · *phía khách*

## 4. Các nguồn có khớp nhau không

Data nói: khách có xin đổi phòng khi đang ở và phàn nàn về phòng (1,0% review có từ khoá, ví dụ dòng 4324). Khách nói: 14/18 từng muốn đổi; người đã đề nghị gần như đều phải chờ từ 15 phút (7/8) và bị đổi lại phí / phòng sau khi đã được báo (7/8). Lễ tân nói: 4/5 phải tra ≥2 nguồn hoặc hỏi người, 2/5 quầy đã báo sai trong tháng.

- **Khớp:** cả ba phía đều chỉ ra **báo trước rồi phải sửa** — lễ tân 2/5 quầy báo sai, khách 7/8 bị đổi lại phí hoặc phòng. Câu khách dòng 11 nêu đúng ba bước lễ tân kể: kiểm tra phòng trống (P1, P4), xác nhận chi phí (P2), sắp xếp phòng mới (P3, P5). "Không rõ phí" là lý do 5/6 khách không dám đề nghị, khớp với P2 kể giá thay đổi theo từng đêm.
- **Lệch:** thời gian. Lễ tân chỉ 2/5 kể từ 15 phút, khách 7/8. Có thể vì khách tính cả lúc chờ dọn / chuyển phòng, còn lễ tân tính đến lúc báo được phương án; và khách nhớ lại trong 12 tháng ở nhiều khách sạn khác nhau. Mẫu khách nhỏ, tự chọn tham gia nên có thể lệch về người từng gặp chuyện khó chịu.

## 5. Kết luận

Giả thuyết ở `evidence/hypothesis.md`: **đúng về hiện tượng, phải đổi về nguyên nhân** — 2/3 lễ tân và 2/2 trưởng ca phải tra ≥2 nguồn hoặc hỏi thêm người trong 1 tháng qua (đạt ngưỡng ≥2/3). Nhưng nhóm nghĩ chỗ vướng là tra **chính sách và tính phí**; thực tế việc này chỉ là chỗ vướng chính của 1/5 (P2). Chỗ chậm hay gặp hơn là **xác nhận phòng đã dọn / sẵn sàng** (P1, P4), **chờ quản lý duyệt** (P3) và **tìm phương án thay thế khi hết phòng** (P5) — đúng "cách giải thích khác" đã ghi trong giả thuyết.

Hệ quả cho bản chạy thử (đề xuất ghi `spec.md` §10, báo Tiến cho dữ liệu giả):
- Tra phòng trống nên trả cả **trạng thái dọn phòng** (đang dọn / sạch / đã kiểm), hoặc soạn nháp tin hỏi buồng phòng thay vì báo "còn phòng" ngay.
- Phí chênh nên tính theo **giá từng đêm còn lại** (P2); công thức P3 hiện dùng một mức giá / hạng cho mọi đêm.
- Một số ca nâng hạng **có phí** cũng cần quản lý duyệt trước khi báo giá (P3) — P3 giả lập đang cho lễ tân tự duyệt.
- Nhánh **"hết phòng → 1–2 phương án kèm khác biệt và phí"** được P5 xác nhận là cần.

Điều vẫn chưa biết: chính sách P1, P2, P4 (đổi cùng hạng, sự cố, miễn phí) ở nơi người được hỏi làm — chưa hỏi, cả 5 người không nhận hỏi thêm; thời gian thật mới chỉ là ước lượng theo khoảng; ngày giờ và hình thức từng buổi phỏng vấn chưa ghi; form khách còn thiếu 1 phản hồi để đạt ngưỡng 20; P4 (homestay, không có PMS) nằm ngoài đối tượng chính.

## Lịch hẹn (chỉ ghi vai và giờ, không tên)

| Vai | Giờ hẹn | Đã xong? |
|---|---|---|
| Lễ tân · KS ≤3 sao (P1) | __ | ☑ |
| Trưởng ca · KS 4–5 sao (P2) | __ | ☑ |
| Lễ tân · Resort (P3) | __ | ☑ |
| Từng làm lễ tân · Homestay (P4) | __ | ☑ |
| Trưởng ca · KS 4–5 sao (P5) | __ | ☑ |
