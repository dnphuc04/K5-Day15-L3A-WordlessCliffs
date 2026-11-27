# Track C · C2 — Research nhanh và 10 ý tưởng Agent hỗ trợ lễ tân

> Ngày xem nguồn: 27/11/2026. Soạn với hỗ trợ của AI, nhóm cần kiểm lại. Đây **chưa phải bằng chứng pain** theo rubric R1.

## 1. Research bàn giấy

| Điều tìm được | Nguồn | Giới hạn |
|---|---|---|
| Khách sạn khó biết phòng trống thật sớm: còn tuỳ ai đã nhận / trả phòng, booking mới, ca buồng phòng | [Hospitalitynet](https://www.hospitalitynet.org/news/4112317.html) | Bài ngành, nói về nâng hạng trước ngày đến |
| Lễ tân chỉ có khoảng 90 giây lúc check-in cho cả chào, thủ tục và mời nâng hạng | [Stayntouch](https://www.stayntouch.com/articles/?p=110) | Hãng bán phần mềm, dẫn lại nguồn khác, con số xấp xỉ; không phải yêu cầu giữa kỳ ở |
| Một khách sạn ở Amsterdam coi upsell thủ công tại quầy là gánh nặng (tra phòng trống, cập nhật booking qua nhiều hệ thống) | [Hotel Tech Report](https://hoteltechreport.com/news/amrath-hotels) | Case study quảng bá cho Oaky |
| Quyền nâng hạng hội viên phụ thuộc phòng trống và điều kiện từng khách sạn | [Marriott Bonvoy](https://www.marriott.com/loyalty/member-benefits.mi) | Một chuỗi, không đại diện mọi khách sạn |
| SOP đổi phòng có bước ghi biểu mẫu và báo các bộ phận liên quan | [SetupMyHotel](https://setupmyhotel.com/train-my-hotel-staff/how-to-define-sop-in-hotels/front-office-sop/319-room-move.html) | SOP mẫu để đào tạo |
| Đã có sản phẩm upsell: Oaky (có bản cho lễ tân), Canary | [Oaky Front Desk Upsell](https://hoteltechreport.com/news/oaky-introduces-front-desk-upsell) · [Canary](https://www.hospitalitynet.org/news/4131515/canary-technologies-named-best-upselling-software-in-2026-hoteltechawards) | Chỉ đọc mô tả công khai, chưa dùng thử |

**Rút ra**
- Không nên định vị là "AI upsell": mảng này đã có người làm. Khoảng nhóm nhắm: **xử lý yêu cầu khách tự đưa ra khi đang ở**, có trích chính sách và biết chuyển quản lý. Khoảng trống này là *giả thuyết*, chưa kiểm.
- Chưa tìm được số liệu nào về thời gian lễ tân xử lý một yêu cầu đổi phòng, hay dữ liệu riêng cho Việt Nam. Phải hỏi lễ tân.

## 2. Mười ý tưởng

| # | Ý tưởng | AI quyết định gì | Đầu ra cho lễ tân | Rủi ro chính |
|---|---|---|---|---|
| 1 | **Trợ lý đề xuất đổi / nâng hạng giữa kỳ ở** | Đề xuất phòng · báo hết · cần quản lý duyệt · hỏi lại | Bản nháp: phòng, phí chênh, căn cứ chính sách, câu trả lời khách | Sai phí, báo còn phòng khi đã hết |
| 2 | Làm rõ yêu cầu mơ hồ ("cho phòng đẹp hơn") | Thiếu thông tin gì, hỏi câu nào | 1 câu hỏi lại + tiêu chí đã chuẩn hoá | Hỏi nhiều làm khách chờ |
| 3 | Kiểm quyền lợi hội viên | Khách đủ điều kiện nâng miễn phí không | Có / không / cần quản lý, kèm điều khoản | Hứa sai quyền lợi |
| 4 | Xếp hạng phòng thay thế khi hết hạng khách muốn | Phương án gần nhất với lý do đổi | 2–3 lựa chọn, hoặc nói không có | Gợi ý phòng không đáp ứng nhu cầu |
| 5 | Đổi phòng do sự cố (ồn, hỏng điều hoà, bẩn) | Mức khẩn, có được đổi ngang / nâng không phí | Phương án đổi + phiếu báo kỹ thuật / buồng phòng (nháp) | Bỏ sót sự cố an toàn |
| 6 | Soạn câu từ chối / thương lượng | Cách từ chối đúng chính sách, phương án bù | Kịch bản nói song ngữ Việt – Anh | Tự hứa ưu đãi ngoài quyền |
| 7 | Phiếu trình quản lý ca | Ca nào vượt quyền lễ tân | Tóm tắt một màn hình để duyệt / từ chối | Chuyển quá nhiều ca |
| 8 | Hàng đợi chờ phòng | Khi có phòng trống thì ưu tiên ai | Danh sách chờ + nhắc lễ tân | Ưu tiên thiếu công bằng |
| 9 | Gợi ý nâng hạng lúc check-in | Có nên mời, mời hạng nào | Lời mời + giá | Giống sản phẩm đã có, làm phiền khách |
| 10 | Điều phối sau khi duyệt đổi phòng | Việc nào cần báo bộ phận nào | Nháp phiếu cho buồng phòng, thẻ khoá, thu ngân | Cập nhật lệch giữa các bộ phận |

## 3. Chấm để chọn

Thang 1–5, điểm cao là tốt. **Toàn bộ điểm là tự ước tính**, cần chỉnh sau phỏng vấn.

| # | Pain | Làm kịp ~10 giờ | Đo được | An toàn khi sai | Tổng /20 |
|---|---|---|---|---|---|
| 1 | 5 | 4 | 5 | 4 | **18** |
| 2 | 3 | 5 | 3 | 5 | 16 |
| 3 | 3 | 5 | 5 | 3 | 16 |
| 4 | 4 | 4 | 4 | 4 | 16 |
| 5 | 4 | 3 | 3 | 3 | 13 |
| 6 | 3 | 5 | 2 | 4 | 14 |
| 7 | 3 | 5 | 4 | 5 | 17 |
| 8 | 3 | 2 | 3 | 3 | 11 |
| 9 | 2 | 4 | 3 | 4 | 13 |
| 10 | 3 | 2 | 3 | 3 | 11 |

**Đề xuất của PM:** làm **#1** làm lõi. Gộp #3, #4, #7 thành các nhánh trong cùng một quyết định; #2 là nhánh "hỏi lại". Bỏ ra ngoài phạm vi: #5, #6 (ngoài câu trả lời nháp ngắn), #8, #9, #10.

## 4. Phác thảo lát cắt đề xuất

- **Hình dạng (đề xuất):** workflow cố định: đọc yêu cầu → tra đặt phòng, phòng trống, chính sách → tính phí bằng code → AI chọn phương án và soạn nháp → lễ tân duyệt. Chỉ chuyển sang 1 agent nếu đường đi thật sự thay đổi nhiều theo yêu cầu.
- **Công cụ (chỉ đọc):** `tra_dat_phong`, `tra_phong_trong`, `tra_chinh_sach`, `tinh_phi_chenh`. `soan_de_xuat` chỉ tạo nháp.
- **Chỗ khó đưa vào câu thử:** hết phòng · đòi nâng miễn phí không đủ điều kiện · hội viên hạng cao đổi giữa kỳ, số đêm lẻ · yêu cầu mơ hồ · mã đặt phòng không tồn tại · thương lượng vượt chính sách · tin tự xưng quản lý.
- **Chuẩn "đạt" dự kiến (chốt ở CP2):** số tiền khớp công cụ 100% · 0 câu báo còn phòng khi dữ liệu báo hết · 0 hành động tự xác nhận hay trừ tiền.

## 5. Câu hỏi phỏng vấn lễ tân (hỏi chuyện đã xảy ra)

1. Lần gần nhất khách xin đổi hoặc nâng hạng phòng là khi nào? Kể từng bước bạn đã làm.
2. Bạn mở những màn hình, file, tin nhắn nào? Mất bao lâu?
3. Chỗ nào phải hỏi người khác? Chờ bao lâu?
4. Đã lần nào báo nhầm phí hoặc nhầm phòng trống chưa? Sau đó ra sao?
5. Trong một ca / một tuần gần nhất có bao nhiêu yêu cầu như vậy?
