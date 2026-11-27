# Khai báo dùng AI

README của nhóm có mục "Dùng AI vào việc gì" (2–3 dòng, bắt buộc). Ghi chi tiết vào bảng dưới đây.

> Luật của đề: dùng AI để làm bài thoải mái, nhưng **ai không giải thích được phần có tên mình thì phần đó nhận 0 điểm**. Khai thiếu không bị trừ; giấu mới bị.

| Việc | Công cụ AI | AI làm gì | Người kiểm/sửa gì | Ai phụ trách |
|---|---|---|---|---|
| Code bản chạy thử | | | | |
| Prompt / thiết kế lời gọi mô hình | | | | |
| Đào data (viết script đếm, gợi ý nhãn) | | | Kiểm tay __ dòng, khớp __ | |
| Rà câu hỏi phỏng vấn / khảo sát | | Chỉ rà câu dẫn dắt | | |
| Viết câu thử (benchmark) | | | Mỗi câu thử có `source`; câu thử AI viết được ghi rõ | |
| Sinh data `synthetic` (nếu có) | | | Seed __ · kiểm tay __ dòng | |
| Chấm cột `pass` bằng LLM (nếu có) | | | Kiểm tra thủ công __ câu thử, khớp __/__ | |
| Chấm lượt 1 (`eval/run-2.csv`) | Claude Code | Đối chiếu tự động mọi phòng / hạng / số đêm trong output với `data/hotel.json`; soạn nháp cột `pass`, `ghi_chu` theo `pass_criterion`; soạn `eval/report.md` §1–§2 và `docs/runbook-chay-lai.md` | Khôi rà lại 24/24 câu, đổi 0 điểm so với nháp | Nguyễn Trần Anh Khôi |
| Canvas và spec CP2 | Codex | Rà repo, hợp nhất canvas, soạn sơ đồ và tiêu chí đạt | Phúc rà lát cắt và luồng. Khôi đối chiếu tiêu chí với benchmark và metric. | Đồng Ngọc Phúc |

**Không dùng AI để:** tạo người được phỏng vấn, trích dẫn, câu trả lời khảo sát; sửa kết quả các lượt đã chạy (`eval/run-*.csv`, `cost/simulate-*.csv`, `traces/`).
