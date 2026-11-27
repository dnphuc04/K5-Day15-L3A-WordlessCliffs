"""Đếm kết quả hai form khảo sát theo đúng cách đếm ghi trong questions.md / questions-khach.md.

Cách dùng (từ thư mục gốc repo):
    python evidence/survey/tally.py le-tan evidence/survey/results.csv
    python evidence/survey/tally.py khach  evidence/survey/results-khach.csv

Đầu vào: file CSV xuất từ Google Sheet nhận kết quả (File → Download → CSV),
đã xoá cột liên hệ. Cột được nhận theo số câu ở đầu tiêu đề ("1.", "2b.", ...),
nên đổi chữ trong tiêu đề không làm hỏng script, miễn giữ số câu.

Chỉ dùng thư viện chuẩn. Không ghi gì ra đĩa — chép số in ra vào evidence/summary.md.
"""
import csv
import re
import statistics
import sys

PCT_MIN_N = 10  # dưới ngưỡng này chỉ ghi x/n, không ghi %

# Đáp án nhiều lựa chọn của câu 5 (lễ tân). Khớp nguyên chuỗi vì vài đáp án có dấu phẩy.
LT_Q5_OPTIONS = [
    "Phần mềm quản lý khách sạn (PMS)",
    "Bảng giá / file Excel",
    "Văn bản chính sách đổi – nâng hạng",
    "Hỏi buồng phòng về tình trạng phòng",
    "Hỏi quản lý ca",
    "Hỏi đồng nghiệp",
    "Nhóm chat nội bộ (Zalo, Messenger…)",
]
LT_Q5_SELF = "Tự nhớ, không cần tra"
LT_RECENT = {"Hôm nay", "Trong tuần này", "Tuần trước", "Trong tháng này"}
SLOW = {"15–30 phút", "Trên 30 phút", "30 phút – 2 giờ", "Trên 2 giờ / hôm sau",
        "Trên 2 giờ hoặc hôm sau", "Không được báo"}  # form thật dùng "hoặc"; giữ cả bản trong .gs


def load(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    for i, r in enumerate(rows, start=2):  # số dòng gốc trong CSV (dòng 1 là tiêu đề)
        r["_line"] = i
    cols = {}
    for name in (rows[0].keys() if rows else []):
        m = re.match(r"\s*(\d+b?)\.", name or "")
        if m and m.group(1) not in cols:
            cols[m.group(1)] = name
    return rows, cols


def get(row, cols, q):
    return (row.get(cols.get(q, ""), "") or "").strip()


def frac(x, n):
    if n == 0:
        return "0/0"
    if n < PCT_MIN_N:
        return f"{x}/{n}"
    return f"{x}/{n} ({100 * x / n:.0f}%)"


def dist(rows, cols, q):
    out = {}
    for r in rows:
        v = get(r, cols, q) or "(trống)"
        out[v] = out.get(v, 0) + 1
    return sorted(out.items(), key=lambda kv: -kv[1])


def count_sources(answer):
    """Số nguồn ở câu 5, không tính 'Tự nhớ'. Phần chữ còn dư (mục 'Khác') tính là 1 nguồn."""
    rest = answer.replace(LT_Q5_SELF, "")
    n = 0
    for opt in LT_Q5_OPTIONS:
        if opt in rest:
            n += 1
            rest = rest.replace(opt, "")
    if re.sub(r"[\s,;]", "", rest):
        n += 1
    return n


def quotes(rows, cols, q):
    for r in rows:
        t = get(r, cols, q)
        if t:
            print(f'  - phiếu dòng {r["_line"]}: "{t}"')


def le_tan(rows, cols):
    print(f"Phản hồi thô: {len(rows)}")
    valid = [r for r in rows
             if not get(r, cols, "1").startswith("Khác") and get(r, cols, "3") in LT_RECENT]
    n = len(valid)
    print(f"Mẫu hợp lệ n (câu 1 ≠ Khác, câu 3 trong tháng này): {n}")
    if n == 0:
        return
    main = sum(1 for r in valid if count_sources(get(r, cols, "5")) >= 2)
    print(f"SỐ CHÍNH — tra ≥2 nguồn / hỏi thêm người (câu 5): {frac(main, n)}")
    nums = []
    for r in valid:
        try:
            nums.append(int(get(r, cols, "4")))
        except ValueError:
            pass
    if nums:
        print(f"Yêu cầu / tuần (câu 4): trung vị {statistics.median(nums)} · min {min(nums)} · max {max(nums)} · n={len(nums)}")
    slow = sum(1 for r in valid if get(r, cols, "6") in SLOW)
    print(f"Mất từ 15 phút (câu 6): {frac(slow, n)}")
    wait = sum(1 for r in valid if get(r, cols, "7") == "Phải chờ quản lý duyệt")
    print(f"Phải chờ quản lý duyệt (câu 7): {frac(wait, n)}")
    wrong = sum(1 for r in valid if get(r, cols, "8").startswith("Có"))
    print(f"Có báo sai phí / phòng trong 1 tháng (câu 8): {frac(wrong, n)}")
    for q in ("1", "2", "6", "7", "8"):
        print(f"Phân bố câu {q}: {dist(rows if q in ('1', '2') else valid, cols, q)}")
    print("Trích nguyên văn câu 9 (mẫu hợp lệ):")
    quotes(valid, cols, "9")


def khach(rows, cols):
    print(f"Phản hồi thô: {len(rows)}")
    base = [r for r in rows if get(r, cols, "1") and get(r, cols, "1") != "Chưa lần nào"]
    n = len(base)
    print(f"Mẫu n (câu 1 ≠ Chưa lần nào): {n}")
    if n == 0:
        return
    need = sum(1 for r in base if get(r, cols, "2").startswith("Có"))
    silent = [r for r in base if get(r, cols, "2") == "Có, nhưng không đề nghị"]
    asked = [r for r in base if get(r, cols, "2") == "Có, và đã đề nghị với khách sạn"]
    m = len(asked)
    print(f"Có nhu cầu đổi / nâng hạng (câu 2 = Có…): {frac(need, n)}")
    print(f"Muốn nhưng không đề nghị: {frac(len(silent), n)}")
    print(f"Lý do không đề nghị (câu 2b): {dist(silent, cols, '2b')}")
    print(f"Mẫu đã đề nghị m: {m}")
    if m:
        slow = sum(1 for r in asked if get(r, cols, "5") in SLOW)
        print(f"Chờ từ 15 phút / không được báo (câu 5): {frac(slow, m)}")
        unclear = sum(1 for r in asked
                      if get(r, cols, "6") in {"Có báo nhưng không rõ cách tính", "Chỉ biết khi thanh toán"})
        print(f"Phí không minh bạch (câu 6): {frac(unclear, m)}")
        wrong = sum(1 for r in asked if get(r, cols, "7").startswith("Có"))
        print(f"Phí / phòng bị đổi lại sau khi báo (câu 7): {frac(wrong, m)}")
        for q in ("4", "5", "6", "8"):
            print(f"Phân bố câu {q}: {dist(asked, cols, q)}")
        print("Trích nguyên văn câu 9:")
        quotes(asked, cols, "9")


def main():
    sys.stdout.reconfigure(encoding="utf-8")  # console Windows mặc định không in được tiếng Việt
    if len(sys.argv) != 3 or sys.argv[1] not in ("le-tan", "khach"):
        print(__doc__)
        sys.exit(1)
    rows, cols = load(sys.argv[2])
    order = sorted(cols, key=lambda k: (int(re.sub(r"\D", "", k)), k))
    print("Cột nhận được: " + ", ".join(order))
    (le_tan if sys.argv[1] == "le-tan" else khach)(rows, cols)


if __name__ == "__main__":
    main()
