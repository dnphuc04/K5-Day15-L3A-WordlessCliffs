# Bản thử giao diện: khách và lễ tân

Hai màn hình dùng chung một kho yêu cầu, để cho khách dùng thử và quan sát lễ tân xử lý:

| File | Ai dùng | Làm gì |
|---|---|---|
| `khach.html` | Khách đang lưu trú (điện thoại) | Xác nhận phòng → chọn đổi / nâng hạng / báo sự cố → xem giá công bố, tình trạng còn phòng → gửi → theo dõi tiến độ, chọn phương án, đồng ý |
| `nhan-vien.html` | Lễ tân (máy tính quầy) | Nhận yêu cầu ngay khi khách gửi → AI phân tích (đặt phòng, phòng trống, phí, chính sách) → lễ tân chọn phương án, sửa nháp, gửi; ca cần duyệt thì chuyển quản lý ca → khách đồng ý → lễ tân hoàn tất |
| `le-tan.html` | Bản trước | Màn hình lễ tân với 6 ca mẫu cố định |

## Chạy

**Cùng một máy (nhanh nhất):** mở `nhan-vien.html` và `khach.html` ở hai tab của Chrome hoặc Edge. Hai tab đồng bộ qua localStorage.

**Khách dùng điện thoại thật:** chạy máy chủ demo rồi mở địa chỉ nó in ra trên điện thoại cùng Wi-Fi.

```
python docs/ui-prototype/serve.py
```

Ở chế độ này, trang lễ tân có thêm nút **Chạy agent.py** để đối chiếu với `codebase/agent.py` thật (theo cấu hình model trong `.env`). Máy chủ không có đăng nhập; chỉ dùng trong mạng nội bộ khi demo.

## Dữ liệu và luật

- `data.js` sinh từ `data/hotel.json`, `data/policy.json` (dữ liệu giả lập) bằng `python docs/ui-prototype/build_data.py`. Sinh lại khi dữ liệu đổi.
- `engine.js` chép lại luật quyết định của `agent.py` (luồng luật từ khoá, không gọi model) và công cụ chỉ-đọc của `tools.py`. Đã đối chiếu: 24/24 câu trong `eval/benchmark.csv` cho cùng nhãn quyết định, cùng phòng, cùng phí với `agent.py` chạy model giả.
- Yêu cầu từ trang khách dùng lựa chọn có cấu trúc trên form; yêu cầu ghi tại quầy dùng luật từ khoá trên lời khách.
- Câu nháp gửi khách được viết lại cho dễ đọc với khách, khác câu nháp trong `agent.py`.

## Giới hạn

- AI chỉ soạn đề xuất; lễ tân bấm gửi thì khách mới thấy. Hệ thống không đổi phòng trong PMS, không thu tiền.
- Quyết định của quản lý ca là **mô phỏng** (nút bấm trên trang lễ tân).
- Kênh khách tự gửi yêu cầu nằm ngoài lát cắt ở `spec.md` §4; đây là bản thử để quan sát người dùng, không phải bản được chấm bằng bộ câu thử.
- Dữ liệu yêu cầu lưu trong trình duyệt hoặc bộ nhớ máy chủ demo, tắt là mất.
