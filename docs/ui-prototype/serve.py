"""Máy chủ demo cho bản thử giao diện (chỉ thư viện chuẩn).

    python docs/ui-prototype/serve.py            # cổng 8000
    python docs/ui-prototype/serve.py 8080

- Phục vụ khach.html / nhan-vien.html trong thư mục này.
- Lưu yêu cầu trong bộ nhớ (tắt máy chủ là mất) để điện thoại của khách và máy lễ tân cùng mạng Wi-Fi thấy nhau.
- POST /api/answer chạy codebase/agent.py answer() thật (theo cấu hình model trong .env) để lễ tân đối chiếu.
Chỉ dùng trong mạng nội bộ khi demo: không có đăng nhập, không mã hoá.
"""
import json
import os
import socket
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
CODEBASE = os.path.join(ROOT, "codebase")

_requests = {}
_lock = threading.Lock()
_agent = None


def _load_agent():
    global _agent
    if _agent is None:
        sys.path.insert(0, CODEBASE)
        import tracing  # noqa: E402  (khung ghi trace của repo)
        from agent import answer  # noqa: E402
        _agent = (tracing, answer)
    return _agent


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=HERE, **kw)

    def log_message(self, fmt, *args):  # gọn log: bỏ các lần thăm dò định kỳ
        if "/api/requests" in (args[0] if args else "") and "GET" in (args[0] if args else ""):
            return
        super().log_message(fmt, *args)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _body(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n > 1_000_000:
            raise ValueError("body quá lớn")
        return json.loads(self.rfile.read(n) or b"null")

    def do_GET(self):
        if self.path.startswith("/api/ping"):
            return self._json(200, {"ok": True})
        if self.path.startswith("/api/requests"):
            with _lock:
                items = sorted(_requests.values(), key=lambda r: -r.get("createdAt", 0))
            return self._json(200, items)
        if self.path in ("/", ""):
            self.path = "/nhan-vien.html"
        return super().do_GET()

    def do_PUT(self):
        if not self.path.startswith("/api/requests/"):
            return self._json(404, {"error": "not found"})
        try:
            req = self._body()
            rid = str(req.get("id", ""))[:20]
            if not rid:
                raise ValueError("thiếu id")
            with _lock:
                _requests[rid] = req
            return self._json(200, {"ok": True})
        except Exception as e:  # dữ liệu hỏng từ trình duyệt
            return self._json(400, {"error": str(e)})

    def do_DELETE(self):
        if self.path.startswith("/api/requests"):
            with _lock:
                _requests.clear()
            return self._json(200, {"ok": True})
        return self._json(404, {"error": "not found"})

    def do_POST(self):
        if not self.path.startswith("/api/answer"):
            return self._json(404, {"error": "not found"})
        try:
            text = str((self._body() or {}).get("text", ""))[:2000]
            tracing, answer = _load_agent()
            tracing.begin("ui-demo")
            try:
                out = answer(text)
            finally:
                s, _ = tracing.end()
            summary = "model: %s · gọi model %d lần · công cụ %d lần · token vào %d / ra %d" % (
                ", ".join(s["models"]) or "—", s["model_calls"], s["tool_calls"], s["tokens_in"], s["tokens_out"])
            return self._json(200, {"output": out.get("output", "") if isinstance(out, dict) else str(out), "summary": summary})
        except Exception as e:  # lỗi model / cấu hình
            return self._json(200, {"error": "%s: %s" % (type(e).__name__, e)})


def _lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("10.255.255.255", 1))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return "127.0.0.1"


def main():
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    srv = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    ip = _lan_ip()
    print("Máy chủ demo đang chạy. Ctrl+C để dừng.")
    print("  Lễ tân  : http://localhost:%d/nhan-vien.html" % port)
    print("  Khách   : http://localhost:%d/khach.html" % port)
    print("  Điện thoại cùng Wi-Fi: http://%s:%d/khach.html" % (ip, port))
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print()


if __name__ == "__main__":
    main()
