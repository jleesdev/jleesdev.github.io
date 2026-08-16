#!/usr/bin/env python3
"""
로컬 미리보기용 정적 서버.

`python3 -m http.server` 는 캐시 헤더를 주지 않아서 브라우저가 낡은 CSS/JS를 계속
붙들고 있는 일이 생긴다. 고친 게 화면에 반영이 안 되는 것처럼 보이므로 캐시를 끈다.
배포(GitHub Pages)와는 무관한 개발용 스크립트다.

    python3 tools/dev_server.py [port]
"""

import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        SimpleHTTPRequestHandler.end_headers(self)

    def log_message(self, fmt, *args):
        # 404 와 에러만 남긴다.
        if args and str(args[1]).startswith(("4", "5")):
            super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"http://localhost:{port} (no-store)")
    ThreadingHTTPServer(("", port), NoCacheHandler).serve_forever()


if __name__ == "__main__":
    main()
