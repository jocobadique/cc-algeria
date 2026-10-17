"""Copy src/cc-algeria.js -> dist/cc-algeria.js with a version banner.

Usage: python build.py [version]   (for example: python build.py v1.0.0)
"""
import sys
from pathlib import Path

root = Path(__file__).parent
version = sys.argv[1] if len(sys.argv) > 1 else "dev"
src = (root / "src" / "cc-algeria.js").read_text(encoding="utf-8")
out = f"/*! cc-algeria {version} */\n{src}"
(root / "dist").mkdir(exist_ok=True)
(root / "dist" / "cc-algeria.js").write_text(out, encoding="utf-8")
print(f"dist/cc-algeria.js {len(out.encode()) / 1024:.1f} KB ({version})")
