"""Supabase Storage 에 올릴 파일을 버킷 구조 그대로 모아둡니다.

Storage 는 폴더째 드래그해서 올릴 수 있는데, 그러려면 버킷 안에서 쓸 경로와
같은 모양으로 폴더가 준비되어 있어야 합니다. 매니페스트에 적힌 경로를 그대로
따라 복사하므로, 화면이 찾는 주소와 실제 파일 위치가 어긋날 일이 없습니다.

    python scripts/supabase/stage_upload.py
    python scripts/supabase/stage_upload.py --out D:/어딘가

만들어진 폴더 안의 6개 하위 폴더를 Storage 버킷 안으로 통째로 끌어다 놓으면
됩니다. 버킷 이름은 src/data/supabaseConfig.js 의 bucket 과 같아야 합니다.
"""

import argparse
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "assets" / "visual-assets.json"
DEFAULT_OUT = Path.home() / "Desktop" / "Supabase_업로드"


def bucket_path(url: str) -> str:
    """assets/products/x.webp → products/x.webp (버킷 안에서 쓸 경로)"""
    return url.split("?")[0].removeprefix("assets/")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = ap.parse_args()

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assets = manifest["assets"]

    if args.out.exists():
        shutil.rmtree(args.out)

    copied, missing, total = 0, [], 0
    for asset_id, entry in sorted(assets.items()):
        # 본 이미지와 썸네일 둘 다 올려야 합니다. 목록 화면이 썸네일을 씁니다.
        for key in ("url", "thumbnailUrl"):
            rel = entry.get(key)
            if not rel:
                continue
            src = ROOT / rel.split("?")[0]
            if not src.exists():
                missing.append(f"{asset_id} · {key}")
                continue
            dst = args.out / bucket_path(rel)
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            copied += 1
            total += src.stat().st_size

    print(f"파일 {copied}개 · {total / 1024 / 1024:.1f}MB\n")
    for folder in sorted(p for p in args.out.iterdir() if p.is_dir()):
        print(f"  {folder.name}/  {len(list(folder.glob('*')))}개")

    if missing:
        print(f"\n파일이 없어 건너뛴 항목 {len(missing)}건")
        for m in missing:
            print(f"  - {m}")
        print("  → python scripts/images/process_assets.py 를 먼저 실행하세요.")

    print(f"\n→ {args.out}")
    print("  이 안의 폴더들을 Storage 버킷 안으로 통째로 끌어다 놓으면 됩니다.")
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
