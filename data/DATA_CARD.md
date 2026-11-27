# Data card — dữ liệu bản chạy thử dùng

> Điền ở guide bước 2.4 (bản đầu ở CP2, đủ ở CP3). Ôn lại: ngày 6 · lab ngày 6. Chấm ở rubric R4.
> Một trang. Mỗi dataset một mục. Dữ liệu chạy thử (bài mẫu, thông báo mẫu, đoạn transcript…) để trong thư mục `data/` này.
> Không commit tài liệu khoá, dữ liệu cá nhân thật hay nguyên file data BTC cấp — chỉ đoạn trích ngắn, bản viết lại, hoặc số đã tổng hợp.
> Hai bộ Kaggle dưới đây là data công khai, **không commit nguyên file**: để ở máy, ngoài repo (`D:\AI26\kaggle-data\`). Mỗi thành viên tự tải lại bằng lệnh ghi trong từng mục.

## Dataset 1 · Hotel Booking Demand (Kaggle)

| | |
|---|---|
| Dùng để làm gì | Hiệu chỉnh dữ liệu giả của công cụ tra đặt phòng / tính phí chênh (cấu trúc hạng phòng, `adr`, số đêm, loại khách) · tham khảo tỉ lệ xếp phòng khác hạng đã đặt. **Không dùng làm bằng chứng pain** |
| Từ đâu | Kaggle: https://www.kaggle.com/datasets/jessemostipak/hotel-booking-demand · license **CC BY 4.0** (phải ghi nguồn) · tác giả gốc: Antonio, Almeida, Nunes (Data in Brief, 2019) — *nhóm kiểm lại trên trang dataset* |
| Xử lý những bước gì | Tải bằng `kaggle datasets download -d jessemostipak/hotel-booking-demand -p D:\AI26\kaggle-data\hotel-booking-demand --unzip` · chưa làm sạch · chỉ đọc bằng thư viện chuẩn `csv`. Mới đếm sơ bộ: 14.917 / 119.390 đặt phòng (12,5%) có `reserved_room_type` khác `assigned_room_type` *(đếm một lần để khảo sát cấu trúc, chưa có script trong repo)* |
| Số dòng / số đoạn | 119.390 dòng · 32 cột (file `hotel_bookings.csv`, ~16,9 MB) |
| Phiên bản / ngày lấy | Bản đăng Kaggle cập nhật lần cuối 2020-02-13 · tải ngày 2026-11-27 |
| Nhãn | thật (công khai) |
| Giới hạn | Hai khách sạn ở Bồ Đào Nha (City Hotel, Resort Hotel), giai đoạn 2015-2017. Hạng phòng chỉ là chữ cái ẩn danh (A…P), không có tên hạng và không có bảng giá niêm yết theo hạng. Không có yêu cầu đổi / nâng hạng khi khách đang ở: khác hạng chủ yếu do khách sạn tự xếp phòng, chưa chắc khách yêu cầu. Cột `adr` có giá trị 0. **Không** suy ra "khách hay xin đổi phòng" từ bộ này |

**Các trường dữ liệu** *(tên cột lấy từ file thật; phần nghĩa nhóm nên đối chiếu lại với tab Data trên Kaggle)*

| Nhóm | Cột | Ý nghĩa | Dùng trong dự án? |
|---|---|---|---|
| Khách sạn | `hotel` | City Hotel hoặc Resort Hotel | không |
| Trạng thái | `is_canceled` | 1 nếu đặt phòng bị hủy | không |
| | `reservation_status`, `reservation_status_date` | Trạng thái cuối (Check-Out, Canceled, No-Show) và ngày cập nhật | không |
| Thời gian | `lead_time` | Số ngày từ lúc đặt đến lúc đến | không |
| | `arrival_date_year`, `arrival_date_month`, `arrival_date_week_number`, `arrival_date_day_of_month` | Ngày đến | không |
| | `stays_in_weekend_nights`, `stays_in_week_nights` | Số đêm cuối tuần / trong tuần | không |
| Người ở | `adults`, `children`, `babies` | Số người lớn, trẻ em, em bé | không |
| | `country` | Quốc gia (mã ISO) | không |
| | `is_repeated_guest`, `previous_cancellations`, `previous_bookings_not_canceled` | Khách quen, số lần hủy / đặt thành công trước đó | không |
| | `customer_type` | Contract, Group, Transient, Transient-party | không |
| Kênh đặt | `market_segment`, `distribution_channel` | Phân khúc thị trường, kênh phân phối | không |
| | `agent`, `company` | Mã đại lý / công ty (ẩn danh, `NULL` nếu không có) | không |
| **Phòng** | **`reserved_room_type`** | Hạng phòng **đã đặt** (chữ cái ẩn danh A, B, C…) | **có** — đếm tỉ lệ khác hạng (12,5%) |
| | **`assigned_room_type`** | Hạng phòng **được xếp** thật | **có** — như trên |
| | `booking_changes` | Số lần thay đổi đặt phòng | không |
| Giá, dịch vụ | `adr` | Giá trung bình mỗi đêm (có dòng bằng 0) | chưa — giá trong `data/hotel.json` là tự dựng, **chưa** hiệu chỉnh từ cột này |
| | `meal`, `deposit_type`, `days_in_waiting_list` | Gói ăn, loại đặt cọc, số ngày chờ xác nhận | không |
| | `required_car_parking_spaces`, `total_of_special_requests` | Số chỗ đỗ xe, số yêu cầu đặc biệt | không |

Tóm lại, bộ này mới đóng góp **một con số tham khảo** (tỉ lệ khác hạng); 30/32 cột chưa dùng.

## Dataset 2 · 515K Hotel Reviews Data in Europe (Kaggle)

| | |
|---|---|
| Dùng để làm gì | Nguồn câu thử `data_that` trong `eval/benchmark.csv` (9/14 câu, B01-B09) · tham khảo kịch bản đổi phòng, nâng hạng, sự cố. **Chỉ là tiếng nói của khách, không thay phỏng vấn lễ tân** |
| Từ đâu | Kaggle: https://www.kaggle.com/datasets/jiashenliu/515k-hotel-reviews-data-in-europe · license **CC0 1.0** (phạm vi công cộng; vẫn ghi nguồn) · nguồn gốc review theo mô tả trên trang dataset *(nhóm kiểm lại)* |
| Xử lý những bước gì | Tải bằng `kaggle datasets download -d jiashenliu/515k-hotel-reviews-data-in-europe -p D:\AI26\kaggle-data\hotel-reviews-europe --unzip` · **lọc** `Negative_Review` có chữ "room", dài 20-90 từ, bỏ review "No Negative" · **khớp từ khoá** (regex) nhóm xin đổi phòng / nâng hạng / nhận sai phòng → 3.072 ứng viên (xáo ngẫu nhiên, seed 15) · **chọn tay** 9 review và **viết lại** thành lời khách bằng tiếng Việt, bỏ tên khách sạn, thêm mã đặt giả; số dòng gốc ghi ở cột `source` của benchmark · script lọc: *chưa đưa vào repo (việc cần làm)* |
| Số dòng / số đoạn | 515.738 dòng · 17 cột (file `Hotel_Reviews.csv`, ~238 MB) · 3.072 ứng viên sau lọc · 9 câu dùng |
| Phiên bản / ngày lấy | Bản đăng Kaggle cập nhật lần cuối 2017-08-21 · tải ngày 2026-11-27 |
| Nhãn | thật (công khai), bản dùng trong benchmark là **bản viết lại** |
| Giới hạn | Review bằng tiếng Anh, khách sạn châu Âu; chỉ review tiêu cực dài 20-90 từ nên lệch về phàn nàn rõ ràng. Regex rộng: nhóm "upgrade" lẫn nhiều review khách được tặng nâng hạng. Review cho biết khách phàn nàn gì, không cho biết lễ tân xử lý thế nào hay mất bao lâu. Con số 3.072 chỉ là kết quả lọc từ khoá, **không phải số liệu bằng chứng pain** |

**Các trường dữ liệu** *(tên cột lấy từ file thật; phần nghĩa nhóm nên đối chiếu lại với tab Data trên Kaggle)*

| Nhóm | Cột | Ý nghĩa | Dùng trong dự án? |
|---|---|---|---|
| Khách sạn | `Hotel_Name`, `Hotel_Address`, `lat`, `lng` | Tên, địa chỉ, tọa độ khách sạn | không (tên khách sạn bị bỏ khi viết lại câu thử) |
| | `Average_Score` | Điểm trung bình của khách sạn | không |
| | `Total_Number_of_Reviews` | Tổng số review của khách sạn | không |
| | `Additional_Number_of_Scoring` | Số lượt chấm điểm không kèm review | không |
| Review | **`Negative_Review`** | Nội dung phần tiêu cực (đã bỏ dấu câu); ô trống ghi là "No Negative" | **có** — lọc và làm nguồn câu thử |
| | `Review_Total_Negative_Word_Counts` | Số từ phần tiêu cực | không (tự đếm lại để lọc 20-90 từ) |
| | `Positive_Review` | Nội dung phần tích cực; ô trống ghi là "No Positive" | không |
| | `Review_Total_Positive_Word_Counts` | Số từ phần tích cực | không |
| | `Review_Date`, `days_since_review` | Ngày viết review, số ngày kể từ đó | không |
| Người viết | `Reviewer_Nationality` | Quốc tịch người viết | không |
| | `Total_Number_of_Reviews_Reviewer_Has_Given` | Số review người này đã viết | không |
| | `Reviewer_Score` | Điểm người viết chấm (thang 10) | có — chép vào file ứng viên để tham khảo |
| | `Tags` | Danh sách nhãn: loại chuyến đi, nhóm khách, loại phòng, số đêm | có — chép vào file ứng viên để tham khảo |
| (không phải cột) | `file_line` | Số thứ tự dòng trong file CSV, dùng làm mã truy nguồn ở cột `source` của `eval/benchmark.csv` | **có** |

Lưu ý khi đọc: văn bản review có khoảng trắng đầu, không có dấu câu; phần trống là chuỗi "No Negative" / "No Positive", không phải ô rỗng.

## Dataset 3 · Dữ liệu khách sạn giả (nhóm tự dựng)

| | |
|---|---|
| Dùng để làm gì | Nguồn cho các công cụ tra đặt phòng, phòng trống, chính sách, tính phí chênh (`codebase/tools.py`, chỉ đọc). Chứa đủ các mã đặt và số phòng được nhắc trong `eval/benchmark.csv` (BK-1042, BK-1077, BK-2210, BK-3350, BK-4108, BK-5120, BK-6021, BK-7044, BK-8800; phòng 127, 218, 233, 305, 322, 410, 412, 507, 615) |
| Từ đâu | nhóm tự viết + sinh có seed bằng script `data/make_synthetic.py` → `data/hotel.json`, `data/policy.json` |
| Xử lý những bước gì | Dựng 7 hạng phòng (SGL, STD, DLX, PRM, JRS, STE, PRS) với giá / đêm tự đặt · sinh phòng theo tầng · phòng "vacant" = trống 7 đêm tới (đơn giản hoá) · đặt phòng kịch bản khớp bộ câu thử + đặt phòng nền sinh ngẫu nhiên · 6 điều chính sách P1-P6 viết tay · ngày "hôm nay" cố định 2026-11-27 |
| Số dòng / số đoạn | 77 phòng (28 trống) · 49 đặt phòng (9 kịch bản + 40 nền) · 6 điều chính sách |
| Phiên bản / ngày lấy | Sinh ngày 2026-11-27, seed 15 (chạy lại `python data/make_synthetic.py` ra đúng cùng kết quả) |
| Nhãn | `synthetic` |
| Giới hạn | Giá và chính sách là **tự dựng**, không phải của khách sạn thật, chưa kiểm với lễ tân. Chính sách mặc định: đổi ngang cùng hạng lễ tân tự duyệt (P1) · sự cố do khách sạn đổi cùng hạng đã đặt phí 0, cần quản lý xác nhận (P2) · nâng hạng khách tự yêu cầu tính phí chênh × số đêm còn lại (P3) · miễn phí / hoàn tiền / voucher chỉ quản lý quyết định (P4). Cần Hưng kiểm lại các điều này với lễ tân thật khi phỏng vấn. Không phải bằng chứng pain |

**Data `synthetic`:** cách sinh: script `data/make_synthetic.py` (thư viện chuẩn, không gọi model) · seed 15 · người kiểm: *(Tiến — chưa kiểm tay; hiện mới đối chiếu tự động: 14 câu thử chạy qua dữ liệu cho hành vi khớp `expected`, mỗi hạng có phòng trống trừ Presidential)* · số dòng đã kiểm tay: __ / 9 đặt phòng kịch bản. Tên khách là nhãn giả ("Khách giả 1042"…), không có dữ liệu cá nhân thật.
