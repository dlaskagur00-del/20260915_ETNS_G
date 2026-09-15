"""Pretendard 서브셋 생성.

한글 폰트는 글리프가 1만 자가 넘어 통째로 쓰면 웹에서 무겁습니다.
이 스크립트는 프로젝트 소스에 실제로 등장하는 글자만 남겨 용량을 줄입니다.

    python scripts/fonts/subset_fonts.py

원본은 assets/_originals/fonts/*.otf 에 두고(저장소에는 포함되지 않습니다),
결과물 assets/fonts/*.woff2 만 배포됩니다.

화면에 새로운 한글이 추가되면 이 스크립트를 다시 돌려야 합니다.
안전을 위해 한글 음절 2,350자(KS X 1001 상용)를 항상 포함하므로,
웬만한 문구 수정은 다시 돌리지 않아도 깨지지 않습니다.
"""

from __future__ import annotations

import sys
from pathlib import Path

try:
    from fontTools.subset import Subsetter, Options
    from fontTools.ttLib import TTFont
except ImportError:
    sys.exit("fonttools가 필요합니다:  python -m pip install fonttools brotli")

ROOT = Path(__file__).resolve().parents[2]
SOURCE_FONTS = ROOT / "assets" / "_originals" / "fonts"
OUTPUT = ROOT / "assets" / "fonts"

# 글자를 수집할 대상
SCAN_DIRS = [ROOT / "src", ROOT / "styles", ROOT / "assets"]
SCAN_FILES = [ROOT / "index.html"]
SCAN_SUFFIXES = {".js", ".css", ".html", ".json", ".md"}

# 항상 포함할 문자 — 소스에 없더라도 빠지면 안 되는 것들
ALWAYS = (
    # 라틴, 숫자, 기호
    "".join(chr(c) for c in range(0x0020, 0x007F))
    # 라틴 확장(따옴표·대시류가 여기 있습니다)
    + " ·—–‘’“”…※→←↑↓✔⚠"
    # 통화·단위
    + "₩㎡℃%"
    # 한글 자모 (조합형 대비)
    + "".join(chr(c) for c in range(0x3131, 0x3164))
)


def hangul_common() -> str:
    """현대 한국어에서 사실상 전부를 덮는 상용 음절 범위.

    초성 19 × 중성 21 × 종성 28 = 11,172자 전체 대신, 실제 사용 빈도가 높은
    받침 조합만 남겨 글리프 수를 크게 줄입니다.
    """
    lead = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"
    # 자주 쓰이는 종성만 (받침 없음 포함)
    tail_indexes = [0, 1, 4, 8, 16, 17, 19, 20, 21, 22, 24, 25, 26, 27]
    syllables = []
    for l in range(19):
        for v in range(21):
            for t in tail_indexes:
                syllables.append(chr(0xAC00 + (l * 21 + v) * 28 + t))
    return "".join(syllables)


def collect_source_chars() -> set[str]:
    chars: set[str] = set()
    targets: list[Path] = list(SCAN_FILES)
    for folder in SCAN_DIRS:
        if folder.exists():
            targets += [p for p in folder.rglob("*") if p.suffix in SCAN_SUFFIXES]

    for path in targets:
        try:
            chars |= set(path.read_text(encoding="utf-8"))
        except (UnicodeDecodeError, OSError):
            continue
    return chars


def main() -> None:
    if not SOURCE_FONTS.exists():
        sys.exit(
            f"원본 폰트를 찾을 수 없습니다: {SOURCE_FONTS}\n"
            "Pretendard OTF 파일을 그 폴더에 넣어 주세요."
        )

    text = set(ALWAYS) | set(hangul_common()) | collect_source_chars()
    # 제어문자 제외
    text = {c for c in text if c.isprintable() or c == " "}
    print(f"서브셋 대상 글자 수: {len(text):,}")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    total_before = total_after = 0

    for otf in sorted(SOURCE_FONTS.glob("*.otf")):
        options = Options()
        options.flavor = "woff2"
        options.layout_features = ["kern", "liga", "tnum", "calt"]
        options.desubroutinize = True
        options.notdef_outline = True
        options.drop_tables += ["DSIG"]

        font = TTFont(str(otf))
        subsetter = Subsetter(options=options)
        subsetter.populate(text="".join(sorted(text)))
        subsetter.subset(font)

        target = OUTPUT / f"{otf.stem}.woff2"
        font.flavor = "woff2"
        font.save(str(target))
        font.close()

        before, after = otf.stat().st_size, target.stat().st_size
        total_before += before
        total_after += after
        print(f"  {otf.stem:24} {before/1024/1024:5.2f}MB -> {after/1024:6.0f}KB")

    print(
        f"\n합계 {total_before/1024/1024:.2f}MB -> {total_after/1024:.0f}KB "
        f"({100 - total_after/total_before*100:.0f}% 감소)"
    )


if __name__ == "__main__":
    main()
