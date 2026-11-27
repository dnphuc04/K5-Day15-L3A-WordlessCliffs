"""Sinh data.js cho bản thử giao diện từ dữ liệu giả lập của nhóm (data/hotel.json, data/policy.json).

Chạy lại mỗi khi data/make_synthetic.py sinh dữ liệu mới:
    python docs/ui-prototype/build_data.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(os.path.dirname(os.path.dirname(HERE)), "data")


def main():
    with open(os.path.join(DATA, "hotel.json"), encoding="utf-8") as f:
        hotel = json.load(f)
    with open(os.path.join(DATA, "policy.json"), encoding="utf-8") as f:
        policy = json.load(f)
    out = os.path.join(HERE, "data.js")
    with open(out, "w", encoding="utf-8") as f:
        f.write("// Sinh tự động bởi build_data.py từ data/hotel.json và data/policy.json (dữ liệu giả lập). Không sửa tay.\n")
        f.write("window.HOTEL = %s;\n" % json.dumps(hotel, ensure_ascii=False))
        f.write("window.POLICY = %s;\n" % json.dumps(policy, ensure_ascii=False))
    print("Đã ghi", out)


if __name__ == "__main__":
    main()
