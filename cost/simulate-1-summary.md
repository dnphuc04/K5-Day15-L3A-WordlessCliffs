# Tóm tắt mô phỏng simulate-1@20261128-124347

Do `python run.py simulate` sinh ra — không sửa tay. Chép bảng sang `cost/cost-estimate.md`.

| Persona | Số phiên mô phỏng | Lượt hỏi / phiên | Token vào / phiên | Token ra / phiên | Gọi model / phiên | Gọi công cụ / phiên |
|---|---:|---:|---:|---:|---:|---:|
| le_tan_it_ca | 13 | 1 | 452 | 39 | 1.0 | 4.4 |
| le_tan_truc_ca | 30 | 1 | 453 | 39 | 1.0 | 4.3 |
| truong_ca | 7 | 1 | 448 | 39 | 1.0 | 4.4 |

Tỉ lệ đạt dùng để tính: 24/24 (100%) — lượt run-2@20261127-222834

- Tự chọn: lượt run-N mới nhất đã chấm xong, chạy bằng đúng model đang đo (run-2.csv). Muốn dùng lượt khác (vd lượt 2): thêm `--rate-from eval/run-2.csv`. Lượt mới hơn nhưng chưa chấm xong hoặc khác model, nên KHÔNG dùng: run-3.

| Model (giá) | Chi phí / phiên | Chi phí / task thành công | Chi phí / câu hỏi đạt | Chi phí / tháng — thấp (2 người) | Chi phí / tháng — cơ sở (5 người) | Chi phí / tháng — cao (10 người) | Chi phí / người / tháng (cơ sở) |
|---|---:|---:|---:|---:|---:|---:|---:|
| gpt-5.4-mini (vào 0.75 · ra 4.5 $/1M) | $0.00051 | $0.00051 | $0.00051 | $0.0140 | $0.0349 | $0.0698 | $0.0070 |
| gpt-5.4-nano (vào 0.2 · ra 1.25 $/1M) | $0.00014 | $0.00014 | $0.00014 | $0.0038 | $0.0094 | $0.0189 | $0.0019 |

- Chi phí / task thành công = chi phí / phiên ÷ tỉ lệ đạt. Chi phí / câu hỏi đạt = chi phí / phiên ÷ số lượt hỏi trung bình mỗi phiên (1.0) ÷ tỉ lệ đạt — tỉ lệ đạt đo theo từng câu thử.
- Token đo trên model: gpt-5.4-mini. Giá tính theo từng model trong bảng — model khác bộ tách token thì số token thật có thể lệch; ghi rõ "đo trên model X, tính giá model Y" trong cost/cost-estimate.md.
- Phiên lỗi (không tính vào trung bình): 0/50.
