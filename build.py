"""Copy each element in src/ to dist/ with a version banner.

Usage: python build.py [version]   (for example: python build.py v1.1.0)
"""
import sys
from pathlib import Path

root = Path(__file__).parent
version = sys.argv[1] if len(sys.argv) > 1 else "dev"
(root / "dist").mkdir(exist_ok=True)
for path in sorted((root / "src").glob("cc-*.js")):
    src = path.read_text(encoding="utf-8")
    out = f"/*! {path.stem} {version} */\n{src}"
    (root / "dist" / path.name).write_text(out, encoding="utf-8")
    print(f"dist/{path.name} {len(out.encode()) / 1024:.1f} KB ({version})")
