# Runbook — chạy lại một lượt benchmark

> Dùng khi **phải đổi cột `input`** của câu thử sau khi lượt chính đã chạy, hoặc khi lượt chính có lỗi kỹ thuật (cột `error` không trống).
> Chỉ sửa `expected`, `pass_criterion`, `pass`, `ghi_chu` thì **không cần** chạy lại: kết quả một lượt chỉ phụ thuộc `input` + code agent + model.

## 0. Trước khi chạy

```
git pull
python run.py check                    # benchmark đủ cột, đủ câu
python data/check_benchmark_refs.py    # mọi mã BK-xxxx / số phòng trong câu thử có trong data/hotel.json
```

- Câu mới cần mã đặt chưa có: xem `data/SCENARIOS.md` mục 4 trước. Không có thì thêm vào `data/make_synthetic.py`, chạy `python data/make_synthetic.py`, ghi thêm dòng vào `data/SCENARIOS.md`.
- Báo nhóm "đang chạy lượt": trong lúc chạy không ai sửa `eval/benchmark.csv`.

## 1. Điền `.env` (một lần trên mỗi máy)

```
copy .env.example .env        # Windows PowerShell
cp .env.example .env          # macOS / Linux
```

Mở `.env`, điền 3 dòng, **một** trong hai cấu hình:

| Dùng | `MODEL_PROVIDER` | `MODEL_NAME` | `API_KEY` |
|---|---|---|---|
| Cùng model lượt chính (nên dùng, kết quả so được với `run-2`) | `openai` | `gpt-5.4-mini` | key OpenAI (nhờ Tiến chạy nếu không có) |
| Key Gemini miễn phí của mình | `gemini` | `gemini-3.1-flash-lite` | key từ Google AI Studio |

- Đổi model so với lượt chính thì ghi rõ model trong bảng lượt (`eval/README.md` mục 5). Kết quả khác model không so trực tiếp được với `run-2`.
- **Không commit `.env`**, không dán key vào code, chat nhóm, ảnh chụp màn hình.

## 2. Thử 3 câu

```
python run.py eval --try
```

Đạt khi: không báo "chưa nối model", mỗi câu có `tokens_in` > 0 và đúng tên model. File thử `eval/run-try.csv` không tính lượt và không commit (đã có trong `.gitignore`).

Lỗi `HTTP 429` / `503`: `codebase/ai.py` tự thử lại tối đa 3 lần. Vẫn lỗi thì đợi vài phút rồi chạy lại.

## 3. Chạy cả bộ

```
python run.py eval
```

- Ghi lại **run ID** in ra (dạng `run-N@YYYYMMDD-HHMMSS`). Khung tự tạo `eval/run-N.csv` và `traces/run-N.jsonl`.
- Mở `eval/run-N.csv`, xem cột `error`. Có câu lỗi kỹ thuật thì **chạy lại thành lượt mới** (lệnh trên lần nữa). Không xoá, không sửa file lượt lỗi. Ghi lượt lỗi thành một dòng "lỗi kỹ thuật, không tính" ở `eval/README.md` mục 5.

## 4. Chấm

1. Điền cột `pass` (1 / 0) và `ghi_chu` theo `pass_criterion` và `eval/metric_spec.yaml`. **Chỉ sửa hai cột này.**
2. `python run.py score eval/run-N.csv` → chép số vào `eval/README.md` mục 5 và `eval/report.md` mục 1.

## 5. Commit

```
git status                     # KHÔNG được thấy .env
git add eval/run-N.csv traces/run-N.jsonl eval/README.md eval/report.md
git add eval/benchmark.csv spec.md      # nếu đã đổi input: ghi thêm 1 dòng changelog ở spec.md §10
git commit -m "Lượt N: run-N@<run ID>, <model>, X/Y đạt"
git push
```

Nhắn nhóm: run ID, model, số câu chạy xong, số lỗi, kết quả score.
