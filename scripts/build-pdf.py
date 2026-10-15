"""Render dist/ to dist/sharks-again-portfolio.pdf (A4 landscape, 7 pages).

The print layout lives in the `@media print` block of dist/style.css, so the
PDF and the website stay the same design. Photographs are converted to JPEG
for the PDF only -- Chromium embeds images as-is, and the PNGs would make the
file ten times bigger for no visible gain.

    pip install playwright pillow && playwright install chromium
    python scripts/build-pdf.py
"""

import http.server
import pathlib
import re
import shutil
import socketserver
import tempfile
import threading

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
OUT = DIST / "sharks-again-portfolio.pdf"
PORT = 8749
MAX_WIDTH = 1500
QUALITY = 86


def build_print_copy(target: pathlib.Path) -> None:
    """Copy the site, re-encoding every PNG photograph as a JPEG."""
    shutil.copytree(DIST, target, ignore=shutil.ignore_patterns("*.pdf"))
    for png in sorted((target / "assets").glob("*.png")):
        image = Image.open(png).convert("RGB")
        if image.width > MAX_WIDTH:
            image = image.resize(
                (MAX_WIDTH, round(image.height * MAX_WIDTH / image.width)),
                Image.LANCZOS,
            )
        image.save(png.with_suffix(".jpg"), "JPEG", quality=QUALITY,
                   optimize=True, progressive=True)
        png.unlink()
    index = target / "index.html"
    index.write_text(
        re.sub(r"(assets/[0-9a-z-]+)\.png", r"\1.jpg",
               index.read_text(encoding="utf-8")),
        encoding="utf-8", newline="\n",
    )


def serve(directory: pathlib.Path) -> socketserver.TCPServer:
    handler = type("Handler", (http.server.SimpleHTTPRequestHandler,),
                   {"directory": str(directory),
                    "log_message": lambda *a, **k: None})
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        target = pathlib.Path(tmp) / "site"
        build_print_copy(target)
        httpd = serve(target)
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page(viewport={"width": 1123, "height": 794})
                page.emulate_media(media="print")
                page.goto(f"http://127.0.0.1:{PORT}/index.html",
                          wait_until="networkidle")
                # every photograph and poster frame must be decoded before printing
                page.evaluate(
                    "() => Promise.all([...document.images]"
                    ".map(i => i.decode().catch(() => {})))"
                )
                page.wait_for_timeout(2500)
                page.pdf(path=str(OUT), width="297mm", height="210mm",
                         print_background=True, prefer_css_page_size=True,
                         margin={"top": "13mm", "bottom": "13mm",
                                 "left": "15mm", "right": "15mm"})
                browser.close()
        finally:
            httpd.shutdown()
    print(f"wrote {OUT.relative_to(ROOT)} "
          f"({OUT.stat().st_size / 1048576:.2f} MB)")


if __name__ == "__main__":
    main()
