# Chi phí khi dùng thật

## 1. Đầu vào

- **Ba persona:** lễ tân ít ca 4 phiên/tháng (P4 dùng làm mốc thấp), lễ tân trực ca 14 (P1, P3), trưởng ca 22 (P2, P5). Quy đổi bốn tuần. Tỷ trọng 20% / 60% / 20% và một lượt hỏi mỗi phiên là giả định thử nghiệm. [Cấu hình persona](personas.yaml) · [Phỏng vấn](../evidence/summary.md)
- **Quy mô:** thấp 2, cơ sở 5, cao 10 người dùng. Đây là ước tính cho triển khai thử ở quầy, không phải số khách hàng đã triển khai.
- **Giá USD/1 triệu token:** Mini 0,75 vào và 4,50 ra. Nano 0,20 vào và 1,25 ra. Kiểm tra ngày 28/11/2026. [Giá Mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) · [Giá Nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano)
- **Tỷ lệ đạt để tính chi phí mỗi task:** 24/24 = 100% đo ở lượt 2 của Mini, `run-4@20261128-124419`. [CSV đã chấm](../eval/run-4.csv)

## 2. Kết quả mô phỏng

**simulate-2@20261128-124507** chạy **50 phiên thật**, seed **42**, **0 lỗi**. Mỗi phiên một câu hỏi. Số phiên theo persona lần lượt 13, 30 và 7. [CSV](simulate-2.csv) · [Tóm tắt tự động](simulate-2-summary.md) · [Trace](../traces/simulate-2.jsonl)

| Model | USD / phiên | USD / task thành công | USD / tháng, thấp | USD / tháng, cơ sở | USD / tháng, cao | USD / người / tháng, cơ sở |
|---|---:|---:|---:|---:|---:|---:|
| gpt-5.4-mini, đo thật | $0.00051 | $0.00051 | $0.0140 | $0.0349 | $0.0699 | $0.0070 |
| gpt-5.4-nano, dự phóng giá | $0.00014 | Chưa đo | $0.0038 | $0.0094 | $0.0189 | $0.0019 |

Chi phí trên mỗi task thành công là chi phí trung bình một phiên chia tỷ lệ đạt của cùng model. Khung mô phỏng áp tỷ lệ đạt của Mini cho cả hai dòng giá trong tóm tắt tự động. Báo cáo chỉ dùng mẫu số đó cho Mini. Dòng Nano áp đơn giá Nano lên lượng token đo bằng Mini để so giá, chưa có tỷ lệ đạt lượt 2 của Nano.

Lượt [simulate-1](simulate-1-summary.md) là đo trung gian trước khi chấm lượt 2, lưu để truy vết. Số chính lấy từ `python run.py simulate --rate-from eval/run-4.csv`.

## 3. So với impact

- Hai lễ tân P1 và P3 ước tính xử lý tổng **300–660 phút/tháng** (trung bình **150–330 phút/người/tháng** ở hai người này). Đây là thời gian xử lý hiện tại, gồm cả thời gian chờ, chưa đo thời gian tiết kiệm. [Spec §2](../spec.md)
- Ở kịch bản cơ sở, Mini tốn **$0.0070/người/tháng**, chỉ tính token. Chi phí máy chủ, tích hợp và thời gian duyệt chưa được tính.
- **Kết luận:** Tiếp tục thử quy mô nhỏ. Chi phí model thấp theo mô phỏng. Cần đo thời gian xử lý và số lần sửa nháp ở quầy trước khi kết luận về lợi ích thực tế.
