# Báo cáo đánh giá — lượt 1 → một cải tiến → lượt 2

> Điền ở guide bước 4.1. Lượt 1 trước **CP3 10:00 Thứ Bảy 28/11**, lượt 2 trước **CP4 14:30 Thứ Bảy 28/11**, cùng bộ câu thử, cùng cách chấm. Chấm ở rubric R5.
> Số lấy từ `python run.py score eval/run-1.csv` (và `run-2.csv`) sau khi điền cột `pass`. **Kết quả thấp ghi thật vẫn đủ điểm.**
> Không được: sửa chuẩn "đạt", bỏ câu thử trượt, sửa `expected` cho khớp output, sửa kết quả lượt đã chạy.

## 1. Kết quả

| Lượt | Run ID | Đạt / tổng | % | thuong | kho | tu_choi | So với chuẩn "đạt" |
|---|---|---|---|---|---|---|---|
| 1 | `run-2@20261127-222834` | __/24 | | __/__ | __/__ | __/__ | đạt / chưa |
| 2 | | __/__ | | __/__ | __/__ | __/__ | đạt / chưa |

> **Cách đánh số:** `run-1` (Gemini, 14 câu) là lượt **lỗi kỹ thuật** (B03 lỗi HTTP 503), không tính, giữ lại làm hồ sơ. Lượt 1 chính thức là `run-2`; lượt 2 sẽ là `run-3`.

Kết quả từng câu: `eval/run-2.csv` (lượt 1), `eval/run-3.csv` (lượt 2). Trace: `traces/run-2.jsonl`, `traces/run-3.jsonl`. Hồ sơ lượt lỗi: `eval/run-1.csv`, `traces/run-1.jsonl`.

## 2. Lỗi lượt 1 — gom thành nhóm có tên

| Nhóm lỗi | Số câu | Câu |
|---|---|---|
| vd: bịa nguồn *(ví dụ)* | | |
| vd: đoán khi thiếu thông tin *(ví dụ)* | | |
| | | |

**≥3 lỗi cụ thể:**

| Câu | Input | Output | Vì sao sai |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

## 3. Một lần cải tiến

- Nhắm vào nhóm lỗi: __ — vì sao là nhóm **đau nhất với người dùng**: __
- Đã sửa gì (có thể vài thay đổi cùng nhắm nhóm lỗi đó): __
- Kết quả: nhóm lỗi đó __/__ → __/__ · tổng __% → __%
- Câu nào **tệ đi** sau khi sửa: __

## 4. Còn lại

- Lỗi chưa sửa + nguy hiểm thế nào: __
- Nếu có thêm 1 tuần: __
