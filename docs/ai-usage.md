# Khai báo dùng AI

README của nhóm có mục "Dùng AI vào việc gì" (2–3 dòng, bắt buộc). Ghi chi tiết vào bảng dưới đây.

> Luật của đề: dùng AI để làm bài thoải mái, nhưng **ai không giải thích được phần có tên mình thì phần đó nhận 0 điểm**. Khai thiếu không bị trừ; giấu mới bị.

| Việc | Công cụ AI | AI làm gì | Người kiểm/sửa gì | Ai phụ trách |
|---|---|---|---|---|
| Code bản chạy thử | Claude Code (Claude Sonnet 5.5) | Viết `codebase/agent.py` (workflow cố định 4 bước), `codebase/tools.py` (4 công cụ chỉ đọc), `codebase/ai.py` (gọi Gemini và OpenAI, thử lại lỗi tạm thời) | Tiến chạy `python run.py`, `eval --try` và `eval` trên máy với model thật (`run-2`: 24/24 câu, 0 lỗi). AI hỗ trợ Tiến kiểm offline và đối chiếu với kết quả chuẩn trước khi push | Nguyễn Trần Tiến |
| Prompt / thiết kế lời gọi mô hình | Claude Code (Claude Sonnet 5.5) | Soạn và chỉnh `SYSTEM` prompt (phân loại yêu cầu, sự cố, nâng hạng, tấn công) sau khi so sánh output `run-1` và hai model nhỏ trên 14 câu; thêm lớp chặn tấn công bằng luật từ khoá | Tiến chạy `eval --try 24` và `eval` để kiểm kết quả. Mọi thay đổi sau CP2 ghi ở `spec.md` §10. Chọn `gpt-5.4-mini` vì `gpt-5.4-nano` bỏ sót câu tấn công B13 | Nguyễn Trần Tiến |
| Đào data (viết script đếm, gợi ý nhãn) | Claude Code (Claude Sonnet 5.5) | Viết regex lọc review Kaggle và đếm 5.236 / 515.738 review có từ khoá (số sơ bộ ở `canvas.md`); script lọc chưa đưa vào repo | Xác minh 13/13 dòng nguồn khớp file Kaggle (bằng script, không đọc tay). Số đếm chưa lọc tay, ghi rõ là sơ bộ | Nguyễn Trần Tiến |
| Rà câu hỏi phỏng vấn / khảo sát | | Chỉ rà câu dẫn dắt | | |
| Viết câu thử (benchmark) | Claude Code (Claude Sonnet 5.5) | Lọc 3.072 review ứng viên; soạn B01–B14 (9 câu viết lại từ review, 5 câu tự viết) và B15–B24 (4 câu viết lại từ review, 6 câu tự viết); tính số tiền ở `expected` bằng bảng giá | Mỗi câu có `source` (`data_that … (viết lại)` hoặc `tu_viet`); 13 dòng nguồn đã xác minh khớp file Kaggle. Khôi soát lại `expected` của B01–B14 (commit `3d3bb00`) | Nguyễn Trần Tiến (B01–B14 cùng Nguyễn Trần Anh Khôi) |
| Sinh data `synthetic` (nếu có) | Claude Code (Claude Sonnet 5.5) | Viết `data/make_synthetic.py` (7 hạng phòng, 77 phòng, 52 đặt phòng, chính sách P1–P6), `data/SCENARIOS.md`, `data/check_benchmark_refs.py` | Seed 15 · kiểm 19/19 đặt phòng kịch bản bằng script độc lập với bảng giá chép tay, không phải đọc tay từng dòng (xem `data/DATA_CARD.md`) | Nguyễn Trần Tiến |
| Chấm cột `pass` bằng LLM (nếu có) | | | Kiểm tra thủ công __ câu thử, khớp __/__ | |
| Chấm lượt 1 (`eval/run-2.csv`) | Claude Code | Đối chiếu tự động mọi phòng / hạng / số đêm trong output với `data/hotel.json`; soạn nháp cột `pass`, `ghi_chu` theo `pass_criterion`; soạn `eval/report.md` §1–§2 và `docs/runbook-chay-lai.md` | Khôi rà lại 24/24 câu, đổi 0 điểm so với nháp | Nguyễn Trần Anh Khôi |
| Canvas và spec CP2 | Codex | Rà repo, hợp nhất canvas, soạn sơ đồ và tiêu chí đạt | Phúc rà lát cắt và luồng. Khôi đối chiếu tiêu chí với benchmark và metric. | Đồng Ngọc Phúc |

**Không dùng AI để:** tạo người được phỏng vấn, trích dẫn, câu trả lời khảo sát; sửa kết quả các lượt đã chạy (`eval/run-*.csv`, `cost/simulate-*.csv`, `traces/`).

| Việc CP4 | Công cụ | Phần hỗ trợ | Trạng thái rà |
|---|---|---|---|
| Cải tiến B07, lượt 2, mô phỏng và slide | Codex | Chỉnh diễn giải phí theo chính sách, chạy model thật, rà kết quả theo tiêu chí cố định, tổng hợp báo cáo và dựng slide | Đầu ra CP4 chạy trên máy Phúc. Codex chấm thử lượt 2, nhóm chưa xác nhận rà chéo lượt này. |
