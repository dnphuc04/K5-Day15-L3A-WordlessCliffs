"""Kiểm mọi mã đặt (BK-xxxx) và số phòng trong eval/benchmark.csv có tồn tại trong data/hotel.json không.

    python data/check_benchmark_refs.py            # kiểm eval/benchmark.csv
    python data/check_benchmark_refs.py <file.csv> # kiểm file khác

Chỉ ĐỌC, không sửa file nào. Chỉ dùng thư viện chuẩn.
Mã đặt không tồn tại có thể là CỐ Ý (câu thử "mã không có trong hệ thống"): script chỉ cảnh báo, người viết câu tự quyết.
"""
import csv
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "eval", "benchmark.csv")
    with open(os.path.join(ROOT, "data", "hotel.json"), encoding="utf-8") as f:
        hotel = json.load(f)
    codes = {b["id"] for b in hotel["bookings"]}
    rooms = {r["room"] for r in hotel["rooms"]}
    room_of = {b["id"]: b["room"] for b in hotel["bookings"]}
    with open(path, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    warn = 0
    for r in rows:
        text = r["input"]
        bks = re.findall(r"BK-\d{3,5}", text, re.I)
        nums = re.findall(r"ph[oòóọỏõôồốộổỗơờớợởỡ]ng\s*(\d{3})", text, re.I)
        notes = []
        for b in bks:
            if b.upper() not in codes:
                notes.append("mã đặt %s KHÔNG có trong dữ liệu" % b.upper())
        for n in nums:
            if n not in rooms:
                notes.append("phòng %s KHÔNG có trong dữ liệu" % n)
        # mã đặt và số phòng cùng nhắc trong một câu phải khớp nhau
        for b in bks:
            if b.upper() in room_of:
                for n in nums:
                    if n in rooms and room_of[b.upper()] != n:
                        notes.append("%s ở phòng %s, nhưng câu nhắc phòng %s" % (b.upper(), room_of[b.upper()], n))
        if not bks and not nums:
            notes.append("không có mã đặt / số phòng (đúng nếu là câu thiếu thông tin hoặc tấn công)")
        status = "OK " if not notes else "CHÚ Ý"
        if notes:
            warn += 1
        print("%s %s %s" % (status, r["id"], "; ".join(notes)))
    used = {b.upper() for r in rows for b in re.findall(r"BK-\d{3,5}", r["input"], re.I)}
    unused = sorted(b for b in codes if b < "BK-9000" and b not in used)
    print("\n%d câu · %d câu cần chú ý" % (len(rows), warn))
    print("Mã đặt kịch bản CHƯA câu thử nào dùng (data/SCENARIOS.md): %s" % (", ".join(unused) if unused else "không còn"))


if __name__ == "__main__":
    main()
