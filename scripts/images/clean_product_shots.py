"""제품 컷에서 파일명 캡션과 흰 여백을 잘라냅니다.

40장 배치로 받은 이미지 일부에 "14_old_table.png" 같은 파일명이 그림 안에
찍혀 있었습니다. 구성 요소 상세 화면에 그대로 떠서 잘라내야 합니다.

여백도 같이 잘라 제품이 프레임을 채우게 합니다. 화면에서는 작게 표시되지만,
여백이 절반이면 실제로 보이는 제품은 그 절반이라 흐려 보입니다.

턴테이블은 4프레임이 반드시 같은 영역으로 잘려야 합니다. 프레임마다 다르게
자르면 드래그해서 돌릴 때 물건이 튑니다. 그래서 4장의 내용 영역을 합친
하나의 상자로 네 장을 똑같이 자릅니다.

원본은 assets/_originals/_raw/ 로 옮겨 보관합니다.

    python scripts/images/clean_product_shots.py          # 미리보기
    python scripts/images/clean_product_shots.py --apply  # 실제 적용
"""

import json
import re
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
ORIGINALS = ROOT / "assets" / "_originals"
RAW = ORIGINALS / "_raw"
MANIFEST = ROOT / "assets" / "visual-assets.json"

# 캡션이 이보다 크면 제품의 일부일 수 있으므로 건드리지 않습니다.
MAX_CAPTION_RATIO = 0.16
# 잘라낸 뒤 제품 주위에 남길 여백.
PAD_RATIO = 0.04


def ink_bands(image: Image.Image, threshold: int = 238) -> list[tuple[int, int]]:
    """세로로 훑어 내용이 있는 구간들을 찾습니다."""
    gray = np.array(image.convert("L"))
    ink = (gray < threshold).sum(axis=1)
    rows = ink > max(2, gray.shape[1] * 0.0015)

    bands, start = [], None
    for index, filled in enumerate(rows):
        if filled and start is None:
            start = index
        elif not filled and start is not None:
            bands.append((start, index))
            start = None
    if start is not None:
        bands.append((start, len(rows)))
    return bands


def caption_cut(image: Image.Image) -> int | None:
    """제품 덩어리 아래에 따로 떨어져 있는 얇은 띠(=캡션)의 시작 y."""
    height = image.height
    bands = ink_bands(image)
    if len(bands) < 2:
        return None

    body = [b for b in bands if (b[1] - b[0]) > height * 0.15]
    if not body:
        return None

    tail = [b for b in bands if b[0] >= body[-1][1]]
    if not tail:
        return None
    if any((b[1] - b[0]) >= height * 0.12 for b in tail):
        return None

    cut = tail[0][0] - 2
    if (height - cut) / height > MAX_CAPTION_RATIO:
        return None  # 너무 많이 잘립니다 — 제품의 일부일 가능성
    return cut


def content_box(image: Image.Image, threshold: int = 238):
    gray = np.array(image.convert("L"))
    mask = gray < threshold
    if not mask.any():
        return None
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    return int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1


def pad_box(box, size, pad):
    x0, y0, x1, y1 = box
    return (
        max(0, x0 - pad),
        max(0, y0 - pad),
        min(size[0], x1 + pad),
        min(size[1], y1 + pad),
    )


def source_of(path: Path) -> Path:
    """자를 대상의 원본. _raw 에 보관본이 있으면 그쪽을 씁니다.

    이미 잘린 파일을 다시 자르면 여백이 조금씩 더 깎여 나갑니다. 항상 원본에서
    출발해야 몇 번을 실행해도 결과가 같습니다.
    """
    kept = RAW / path.name
    return kept if kept.exists() else path


def plan(asset_ids: set[str]):
    """자산 id → (원본 경로, 자를 상자). 턴테이블은 4프레임을 묶어 같은 상자를 씁니다."""
    singles, groups = {}, {}

    for path in sorted(ORIGINALS.glob("*.png")):
        if path.stem not in asset_ids:
            continue
        if not re.match(r"^(product|material|turntable)_", path.stem):
            continue

        with Image.open(source_of(path)) as raw:
            image = raw.convert("RGB")
            cut = caption_cut(image)
            if cut:
                image = image.crop((0, 0, image.width, cut))
            box = content_box(image)
            if not box:
                continue

        match = re.match(r"^(turntable_.+)_(\d\d)$", path.stem)
        if match:
            groups.setdefault(match.group(1), []).append((path, cut, box, image.size))
        else:
            singles[path.stem] = (path, cut, box, image.size)

    tasks = []
    for stem, (path, cut, box, size) in singles.items():
        pad = round(min(size) * PAD_RATIO)
        tasks.append((stem, path, cut, pad_box(box, size, pad)))

    for name, frames in groups.items():
        # 네 장의 내용 영역을 합쳐 하나의 상자로 — 돌릴 때 튀지 않게.
        xs0 = min(f[2][0] for f in frames)
        ys0 = min(f[2][1] for f in frames)
        xs1 = max(f[2][2] for f in frames)
        ys1 = max(f[2][3] for f in frames)
        size = frames[0][3]
        pad = round(min(size) * PAD_RATIO)
        union = pad_box((xs0, ys0, xs1, ys1), size, pad)
        for path, cut, _, _ in frames:
            tasks.append((path.stem, path, cut, union))

    return sorted(tasks)


def main() -> int:
    apply = "--apply" in sys.argv
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    asset_ids = set(manifest["assets"])

    tasks = plan(asset_ids)
    if apply:
        RAW.mkdir(exist_ok=True)

    changed = 0
    print(f"{'자산':34}{'캡션':>7}{'크기 변화':>22}")
    print("-" * 66)
    for stem, path, cut, box in tasks:
        with Image.open(source_of(path)) as raw:
            image = raw.convert("RGB")
            before = image.size
            if cut:
                image = image.crop((0, 0, image.width, cut))
            cropped = image.crop(box)

        if cropped.size == before and not cut:
            continue
        changed += 1
        print(f"{stem:34}{'있음' if cut else '-':>7}{f'{before[0]}x{before[1]} → {cropped.size[0]}x{cropped.size[1]}':>22}")

        if apply:
            if not (RAW / path.name).exists():
                shutil.copy2(path, RAW / path.name)
            cropped.save(path)  # 원본은 _raw 에 그대로 남습니다

    print(f"\n{'적용' if apply else '미리보기'} — 대상 {changed}장")
    if not apply and changed:
        print("실제로 바꾸려면 --apply 를 붙여 다시 실행하세요.")
    if apply:
        print(f"원본은 {RAW.relative_to(ROOT)} 에 보관했습니다.")
        print("이어서 process_assets.py 를 실행하세요.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
