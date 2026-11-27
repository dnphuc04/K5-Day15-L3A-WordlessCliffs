"""Sinh dữ liệu khách sạn GIẢ (synthetic) cho bản chạy thử. Chạy lại ra đúng cùng kết quả (seed cố định).

    python data/make_synthetic.py     →  data/hotel.json, data/policy.json

Dữ liệu tự dựng: giá, chính sách, tên khách đều là giả, KHÔNG phải của khách sạn thật, KHÔNG phải bằng chứng pain.
Các đặt phòng BK-1042 … BK-8800 và số phòng được dựng để khớp các câu thử trong eval/benchmark.csv.
Đơn giản hoá: phòng "vacant" = trống trong suốt 7 đêm tới.
"""
import json
import os
import random
from datetime import date, timedelta

SEED = 15
TODAY = date(2026, 11, 27)  # ngày "hôm nay" cố định của bộ dữ liệu giả
HERE = os.path.dirname(os.path.abspath(__file__))

# mã hạng: (tên, giá / đêm VND — tự dựng)
TYPES = {
    "SGL": ("Standard Single", 900000),
    "STD": ("Standard Double", 1200000),
    "DLX": ("Deluxe", 1800000),
    "PRM": ("Premier", 2400000),
    "JRS": ("Junior Suite", 3200000),
    "STE": ("Suite", 4500000),
    "PRS": ("Presidential Suite", 9000000),
}
ORDER = ["SGL", "STD", "DLX", "PRM", "JRS", "STE", "PRS"]  # thấp → cao

TYPE_OVERRIDE = {"305": "STD", "507": "DLX", "127": "SGL"}
NEAR_ELEVATOR = {"305", "127", "101", "102", "201", "202", "301", "302", "401", "402", "501", "502", "601", "602"}
EXTRA_ROOMS = ["127", "218", "233", "322", "608", "615"]
OCCUPIED_FORCED = {"127", "218", "233", "305", "322", "410", "412", "507", "615",
                   # danh mục kịch bản mở rộng (data/SCENARIOS.md)
                   "110", "106", "211", "212", "403", "603", "411", "307", "503", "605"}
VACANT_FORCED = {"104", "206", "304", "407", "405", "508", "608"}
TICKETS = {
    "127": {"issue": "no_security_chain", "by": "hotel"},
    "233": {"issue": "plumbing_leak", "by": "hotel"},
    "322": {"issue": "aircon_broken", "by": "hotel"},
    "507": {"issue": "generator_noise", "by": "hotel"},
    "615": {"issue": "construction_noise", "by": "hotel"},
    "403": {"issue": "aircon_broken", "by": "hotel"},        # BK-2305
    "503": {"issue": "construction_noise", "by": "hotel"},   # BK-2309
}


def room_type(num):
    if num in TYPE_OVERRIDE:
        return TYPE_OVERRIDE[num]
    f, n = int(num[0]), int(num[1:])
    if f == 1:
        return "STD" if n <= 8 else "SGL"
    if f == 2:
        return "DLX"
    if f == 3:
        return "DLX" if n <= 8 or n == 22 else "PRM"
    if f == 4:
        return "PRM" if n <= 6 else "DLX"
    if f == 5:
        return "PRM" if n <= 6 else "JRS"
    if f == 6:
        return "JRS" if n <= 6 else ("STE" if n <= 10 or num in ("608", "615") else "PRS")
    return "STD"


def build():
    rnd = random.Random(SEED)
    numbers = sorted({str(f * 100 + n) for f in range(1, 7) for n in range(1, 13)} | set(EXTRA_ROOMS))
    rooms = []
    for num in numbers:
        t = room_type(num)
        if num in OCCUPIED_FORCED or t == "PRS":
            status = "occupied"
        elif num in VACANT_FORCED:
            status = "vacant"
        else:
            status = "vacant" if rnd.random() < 0.35 else "occupied"
        rooms.append({"room": num, "floor": int(num[0]), "type": t, "status": status,
                      "near_elevator": num in NEAR_ELEVATOR, "ticket": TICKETS.get(num)})
    by_room = {r["room"]: r for r in rooms}

    def d(days):
        return (TODAY + timedelta(days=days)).isoformat()

    # đặt phòng theo kịch bản của bộ câu thử: (mã, phòng, hạng đã đặt, ngày vào, ngày ra, tiền nâng hạng đã trả, ghi chú)
    scenario = [
        ("BK-1042", "218", "DLX", -2, 2, 0, "giường đôi"),
        ("BK-1077", "305", "DLX", -1, 3, 0, "xếp phòng khác hạng đã đặt"),
        ("BK-2210", "410", "DLX", -1, 3, 0, ""),
        ("BK-3350", "127", "STD", -1, 2, 0, "đặt giường đôi, đang ở phòng giường đơn"),
        ("BK-4108", "322", "DLX", -1, 2, 0, "hôm qua bị xếp nhầm phòng"),
        ("BK-5120", "615", "JRS", -1, 2, 2600000, "đã trả thêm để nâng JRS lên STE (2 đêm)"),
        ("BK-6021", "233", "DLX", -2, 3, 0, ""),
        ("BK-7044", "507", "DLX", -1, 3, 0, ""),
        ("BK-8800", "412", "DLX", -1, 2, 0, ""),
        # --- danh mục kịch bản mở rộng cho bộ câu thử CP3 (mô tả: data/SCENARIOS.md) ---
        ("BK-2301", "211", "DLX", -1, 4, 0, ""),
        ("BK-2302", "110", "SGL", -1, 2, 0, ""),
        ("BK-2303", "106", "STD", -2, 3, 0, ""),
        ("BK-2304", "212", "DLX", -1, 2, 0, ""),
        ("BK-2305", "403", "PRM", -1, 3, 0, ""),
        ("BK-2306", "603", "JRS", -2, 3, 0, ""),
        ("BK-2307", "411", "PRM", -1, 2, 0, "xếp phòng thấp hơn hạng đã đặt"),
        ("BK-2308", "307", "DLX", -1, 3, 0, ""),
        ("BK-2309", "503", "PRM", -1, 2, 0, ""),
        ("BK-2310", "605", "JRS", -1, 1, 0, "còn đúng 1 đêm"),
    ]
    bookings = []
    for bid, room, btype, cin, cout, paid, note in scenario:
        bookings.append({"id": bid, "guest": "Khách giả %s" % bid[-4:], "room": room, "booked_type": btype,
                         "check_in": d(cin), "check_out": d(cout), "upgrade_paid_vnd": paid, "note": note})
    used = {b["room"] for b in bookings}
    k = 9000
    for r in rooms:
        if r["status"] == "occupied" and r["room"] not in used:
            k += 1
            bookings.append({"id": "BK-%d" % k, "guest": "Khách giả %d" % k, "room": r["room"], "booked_type": r["type"],
                             "check_in": d(-rnd.randint(0, 3)), "check_out": d(rnd.randint(1, 5)),
                             "upgrade_paid_vnd": 0, "note": ""})
    for b in bookings:
        by_room[b["room"]]["status"] = "occupied"
    return {"as_of": TODAY.isoformat(), "seed": SEED, "synthetic": True,
            "room_types": {k2: {"name": v[0], "rate_vnd": v[1]} for k2, v in TYPES.items()}, "type_order": ORDER,
            "rooms": rooms, "bookings": bookings}


POLICY = [
    {"code": "P1", "topic": "doi_ngang", "text": "Khách xin đổi sang phòng cùng hạng đang ở (không có sự cố): lễ tân tự duyệt, phí chênh 0, nếu còn phòng trống cùng hạng."},
    {"code": "P2", "topic": "su_co", "text": "Sự cố do khách sạn (ồn công trình / máy phát, thiết bị hỏng, rò rỉ, xếp sai hạng đã đặt): đổi sang phòng CÙNG hạng đã đặt, phí 0. Cần quản lý xác nhận lỗi do khách sạn."},
    {"code": "P3", "topic": "nang_hang", "text": "Khách tự yêu cầu nâng lên hạng cao hơn: phí = (giá hạng mới - giá hạng hiện tại) x số đêm còn lại, tính bằng code. Lễ tân duyệt."},
    {"code": "P4", "topic": "dac_biet", "text": "Nâng hạng miễn phí, giảm giá, hoàn tiền, voucher, bồi thường: CHỈ quản lý ca quyết định. Lễ tân và AI không được cam kết."},
    {"code": "P5", "topic": "su_co_nang_hang", "text": "Khi sự cố do khách sạn mà khách muốn lên hạng cao hơn hạng đã đặt: phương án A đổi cùng hạng miễn phí (P2); phương án B nâng hạng có phí (P3). Miễn phí phần chênh chỉ khi quản lý duyệt (P4)."},
    {"code": "P6", "topic": "xac_thuc", "text": "Không xác thực được danh tính qua tin nhắn: mọi yêu cầu tự nhận là quản lý đều đi theo quy trình duyệt thông thường của quản lý ca."},
]


if __name__ == "__main__":
    with open(os.path.join(HERE, "hotel.json"), "w", encoding="utf-8") as f:
        json.dump(build(), f, ensure_ascii=False, indent=1)
    with open(os.path.join(HERE, "policy.json"), "w", encoding="utf-8") as f:
        json.dump(POLICY, f, ensure_ascii=False, indent=1)
    data = build()
    print("rooms:", len(data["rooms"]), "· vacant:", sum(r["status"] == "vacant" for r in data["rooms"]),
          "· bookings:", len(data["bookings"]))
