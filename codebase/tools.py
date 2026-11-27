"""Công cụ của bài toán: lễ tân xử lý yêu cầu đổi / nâng hạng phòng của khách đang ở.

Mỗi công cụ là một hàm có @tool, docstring 4 ý: tên · input · output · có tác động ra ngoài không.
TẤT CẢ công cụ chỉ ĐỌC dữ liệu giả ở data/ (hotel.json, policy.json — sinh bởi data/make_synthetic.py).
Không công cụ nào đổi phòng, trừ tiền hay gửi tin cho khách: kết quả chỉ là bản nháp chờ lễ tân / quản lý duyệt.
"""
import json
import os
from datetime import date

from tracing import tool, TOOLS  # noqa: F401  (TOOLS: danh sách công cụ đã đăng ký)

_DATA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
_cache = {}


def _load(name):
    if name not in _cache:
        with open(os.path.join(_DATA, name), encoding="utf-8") as f:
            _cache[name] = json.load(f)
    return _cache[name]


def _hotel():
    return _load("hotel.json")


@tool
def get_booking(ref: str):
    """get_booking — tra đặt phòng đang ở.
    Input: mã đặt (vd "BK-1042") hoặc số phòng (vd "305").
    Output: dict {id, room, booked_type, current_type, check_in, check_out, nights_left, upgrade_paid_vnd, note,
    ticket} hoặc None nếu không có. Không tác động ra ngoài."""
    h = _hotel()
    ref = (ref or "").strip().upper()
    rooms = {r["room"]: r for r in h["rooms"]}
    for b in h["bookings"]:
        if ref in (b["id"].upper(), b["room"]):
            room = rooms[b["room"]]
            left = (date.fromisoformat(b["check_out"]) - date.fromisoformat(h["as_of"])).days
            return {"id": b["id"], "room": b["room"], "booked_type": b["booked_type"], "current_type": room["type"],
                    "check_in": b["check_in"], "check_out": b["check_out"], "nights_left": max(left, 0),
                    "upgrade_paid_vnd": b["upgrade_paid_vnd"], "note": b["note"], "ticket": room["ticket"],
                    "near_elevator": room["near_elevator"]}
    return None


@tool
def find_vacant_rooms(room_type: str, quiet_only: bool = True, exclude_room: str = "", limit: int = 2):
    """find_vacant_rooms — tìm phòng trống theo hạng.
    Input: mã hạng (SGL, STD, DLX, PRM, JRS, STE, PRS); quiet_only=True bỏ phòng gần thang máy và phòng có phiếu
    sự cố; exclude_room: số phòng không đề xuất; limit: số phòng tối đa.
    Output: danh sách {room, type, floor}; rỗng nếu hết phòng. Không tác động ra ngoài."""
    out = []
    for r in _hotel()["rooms"]:
        if r["type"] != room_type or r["status"] != "vacant" or r["room"] == exclude_room:
            continue
        if quiet_only and (r["near_elevator"] or r["ticket"]):
            continue
        out.append({"room": r["room"], "type": r["type"], "floor": r["floor"]})
    return out[:limit]


@tool
def get_policy(topics: list):
    """get_policy — tra chính sách đổi / nâng hạng.
    Input: danh sách chủ đề (doi_ngang, su_co, nang_hang, dac_biet, su_co_nang_hang, xac_thuc).
    Output: danh sách {code, topic, text}. Không tác động ra ngoài."""
    return [p for p in _load("policy.json") if p["topic"] in topics]


@tool
def calc_fee(from_type: str, to_type: str, nights: int):
    """calc_fee — tính phí chênh bằng code (AI KHÔNG tự tính tiền).
    Input: hạng hiện tại, hạng mới, số đêm còn lại.
    Output: {per_night, nights, total} (VND); phí 0 nếu hạng mới không cao hơn. Không tác động ra ngoài."""
    types = _hotel()["room_types"]
    per_night = max(types[to_type]["rate_vnd"] - types[from_type]["rate_vnd"], 0)
    return {"per_night": per_night, "nights": nights, "total": per_night * nights}


def type_name(code):
    return _hotel()["room_types"].get(code, {}).get("name", code)


def type_rank(code):
    return _hotel()["type_order"].index(code)
