"""OFFICE HISTORY — Visual Asset 처리 파이프라인.

assets/_originals/ 에 넣은 원본 이미지를 웹용으로 변환하고 매니페스트를 갱신합니다.

    python scripts/images/process_assets.py            # 처리 + 매니페스트 갱신
    python scripts/images/process_assets.py --check    # 검증만 (파일 변경 없음)

원본 파일명은 Asset ID와 같아야 합니다. 예) product_meeting_table.png

Python 3.12 / 3.13 모두에서 동작합니다. Pillow가 필요합니다.
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime
import sys
from pathlib import Path

try:
    from PIL import Image, ImageStat, ImageChops
except ImportError:
    sys.exit(
        "Pillow가 필요합니다.\n"
        "  py -3.12 -m pip install Pillow   (3.12.5로 고정하려는 경우)\n"
        "  python -m pip install Pillow"
    )

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "assets"
ORIGINALS = ASSETS / "_originals"
MANIFEST = ASSETS / "visual-assets.json"

FOLDER_BY_TYPE = {
    "office": "office",
    "floorplan": "floorplans",
    "product": "products",
    "material": "materials",
    "project": "projects",
    "proposed": "proposed",
}

# 최소 가로 해상도. 미달하면 확대하지 않고 실패 처리합니다.
MIN_WIDTH = {
    "office": 1200,
    "floorplan": 1400,
    "proposed": 1200,
    "project": 800,
    "product": 800,
    "material": 800,
}

# 웹 배포용 최대 가로. 이보다 크면 줄이고, 작으면 그대로 둡니다.
MAX_WIDTH = {
    "office": 1920,
    "floorplan": 2400,
    "proposed": 1920,
    "project": 1600,
    "product": 1200,
    "material": 1000,
}

# 깨진 이미지의 진짜 신호는 "밋밋함"이 아니라 "흰 캔버스에 피사체가 조그맣게
# 박혀 있음"이었습니다. 실제로 도장 마감 벽은 정상인데도 밋밋해서(표준편차 8.6)
# 밋밋함만 보면 멀쩡한 이미지를 떨어뜨립니다.
BLANK_RATIO = 0.30      # 이보다 작으면 사실상 빈 이미지 — 처리 중단
SMALL_RATIO = 0.60      # 이보다 작으면 확대 시 흐림 — 경고만
BLANK_STDDEV = 4        # 완전한 단색만 걸러내는 최후 방어선

THUMB_WIDTH = 480

# 발표 화면에서 확대해 보기 때문에 본 이미지는 높게 잡습니다. 썸네일은 작게
# 표시되어 차이가 보이지 않으므로 낮게 유지해 용량을 아낍니다.
WEBP_QUALITY = 92
THUMB_QUALITY = 82
SUPPORTED = {".png", ".jpg", ".jpeg", ".webp"}


def load_manifest() -> dict:
    if not MANIFEST.exists():
        sys.exit(f"매니페스트를 찾을 수 없습니다: {MANIFEST}")
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def find_original(asset_id: str) -> Path | None:
    for suffix in (".png", ".jpg", ".jpeg", ".webp"):
        candidate = ORIGINALS / f"{asset_id}{suffix}"
        if candidate.exists():
            return candidate
    return None


# 생성 이미지는 흰 여백이 넓게 남는 경우가 많습니다. 공간 이미지는 여백을 잘라내야
# 화면에서 충분히 크게 보입니다.
TRIM_TYPES = {"office", "floorplan", "proposed", "project"}


def trim_whitespace(image: Image.Image, tolerance: int = 8) -> Image.Image:
    """거의 흰색인 바깥 여백을 잘라냅니다. 여백이 없으면 원본 그대로 둡니다."""
    rgb = image.convert("RGB")
    background = Image.new("RGB", rgb.size, (255, 255, 255))
    diff = ImageChops.difference(rgb, background)
    box = diff.convert("L").point(lambda v: 255 if v > tolerance else 0).getbbox()
    if not box:
        return image

    pad = round(min(rgb.size) * 0.015)
    left = max(0, box[0] - pad)
    top = max(0, box[1] - pad)
    right = min(rgb.width, box[2] + pad)
    bottom = min(rgb.height, box[3] + pad)
    if (right - left) < rgb.width * 0.08 or (bottom - top) < rgb.height * 0.08:
        return image  # 잘못 잡힌 경우 원본 유지
    return image.crop((left, top, right, bottom))


def content_ratio(image: Image.Image) -> float:
    """흰 배경을 뺀 실제 내용이 가로폭의 몇 퍼센트를 차지하는지."""
    rgb = image.convert("RGB")
    blank = Image.new("RGB", rgb.size, (255, 255, 255))
    mask = ImageChops.difference(rgb, blank).convert("L").point(lambda v: 255 if v > 8 else 0)
    box = mask.getbbox()
    return 1.0 if not box else (box[2] - box[0]) / rgb.width


def looks_blank(image: Image.Image) -> bool:
    """사실상 빈 이미지인지.

    흰 배경 한가운데 파일 아이콘과 파일명만 박힌 이미지가 마감재 스와치로 들어간
    적이 있습니다. materials·product 타입은 여백 제거 대상이 아니라 잘리지도,
    여백 검사에 걸리지도 않아 화면까지 올라갔습니다.

    처음에는 표준편차만 봤는데, 그러면 정상인 도장 마감 벽(원래 밋밋합니다)까지
    떨어집니다. 실제 신호는 "피사체가 프레임을 거의 안 채운다" 쪽이라 그것을
    기준으로 삼고, 표준편차는 완전한 단색만 잡는 보조로 남겼습니다.
    """
    return content_ratio(image) < BLANK_RATIO or ImageStat.Stat(image.convert("L")).stddev[0] < BLANK_STDDEV


def to_webp(image: Image.Image, target: Path, width: int, quality: int = WEBP_QUALITY) -> tuple[int, int]:
    resized = image
    if image.width > width:
        height = round(image.height * width / image.width)
        resized = image.resize((width, height), Image.LANCZOS)

    target.parent.mkdir(parents=True, exist_ok=True)
    rgb = resized.convert("RGB") if resized.mode in ("RGBA", "P", "LA") else resized
    rgb.save(target, "WEBP", quality=quality, method=6)
    return resized.width, resized.height


def process(check_only: bool = False) -> int:
    manifest = load_manifest()
    assets = manifest["assets"]

    processed, skipped, failed, low_res = [], [], [], []
    small_subject = []

    for asset_id, entry in assets.items():
        original = find_original(asset_id)
        if original is None:
            if entry.get("status") == "ready":
                # 원본이 사라졌으면 다시 required로 되돌립니다.
                entry["status"] = "required"
                entry["width"] = entry["height"] = None
            skipped.append(asset_id)
            continue

        if original.suffix.lower() not in SUPPORTED:
            failed.append((asset_id, f"지원하지 않는 형식: {original.suffix}"))
            continue

        with Image.open(original) as raw:
            image = trim_whitespace(raw) if entry["type"] in TRIM_TYPES else raw

            # 내용이 거의 없는 이미지는 여기서 멈춥니다. 통과시키면 화면까지
            # 올라가고, 발표 중에야 비어 보이는 것을 알게 됩니다.
            if looks_blank(image):
                failed.append((asset_id, "사실상 빈 이미지 — 흰 배경에 내용이 거의 없습니다"))
                continue

            ratio = content_ratio(image)
            if ratio < SMALL_RATIO:
                small_subject.append((asset_id, ratio))

            min_width = MIN_WIDTH.get(entry["type"], 800)
            trimmed = entry["type"] in TRIM_TYPES and image.width < raw.width
            if image.width < min_width:
                if not trimmed:
                    failed.append(
                        (asset_id, f"해상도 부족: {image.width}px < 최소 {min_width}px — 확대하지 않고 건너뜁니다")
                    )
                    continue
                low_res.append((asset_id, image.width, min_width))

            if check_only:
                processed.append((asset_id, image.width, image.height))
                continue

            folder = ASSETS / FOLDER_BY_TYPE[entry["type"]]
            width, height = to_webp(image, folder / f"{asset_id}.webp", MAX_WIDTH.get(entry["type"], 1200))
            to_webp(image, folder / f"{asset_id}_thumb.webp", THUMB_WIDTH, THUMB_QUALITY)

        entry["status"] = "ready"
        entry["width"] = width
        entry["height"] = height
        processed.append((asset_id, width, height))

    if not check_only:
        # 파일명은 그대로인 채 내용만 바뀌므로, 이 값이 캐시 무효화 키가 됩니다.
        # 화면은 이미지 URL 뒤에 ?v=<generatedAt> 를 붙여 옛 이미지를 잡아두지 않습니다.
        manifest["generatedAt"] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    ready = sum(1 for e in assets.values() if e.get("status") == "ready")
    print(f"\n{'검증' if check_only else '처리'} 완료 — 확보 {ready} / 전체 {len(assets)}\n")

    for asset_id, width, height in processed:
        print(f"  [OK]   {asset_id}  {width}x{height}")
    for asset_id, reason in failed:
        print(f"  [FAIL] {asset_id}  {reason}")
    if small_subject:
        print("")
        print(f"  피사체가 작음 {len(small_subject)}건 — 흰 여백이 많아 확대하면 흐립니다.")
        for asset_id, ratio in small_subject:
            print(f"    - {asset_id}: 프레임의 {ratio:.0%}만 차지")

    if low_res:
        print("")
        print(f"  해상도 낮음 {len(low_res)}건 — 흰 여백을 잘라낸 뒤 내용이 작습니다.")
        print("  발표 화면에서 흐리게 보입니다. 피사체가 프레임을 채우도록 재생성을 권합니다.")
        for asset_id, w, need in low_res:
            print(f"    - {asset_id}: {w}px (권장 {need}px 이상)")
    if skipped:
        print(f"\n  대기 중 {len(skipped)}건 — assets/_originals/ 에 원본을 넣으면 처리됩니다.")
        for asset_id in skipped[:10]:
            print(f"    - {asset_id}")
        if len(skipped) > 10:
            print(f"    ... 외 {len(skipped) - 10}건")

    return 1 if failed else 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Visual Asset 처리")
    parser.add_argument("--check", action="store_true", help="검증만 수행 (파일 변경 없음)")
    args = parser.parse_args()
    ORIGINALS.mkdir(parents=True, exist_ok=True)
    sys.exit(process(check_only=args.check))


if __name__ == "__main__":
    main()
