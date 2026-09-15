"""로컬 매니페스트를 Supabase seed SQL로 변환.

assets/visual-assets.json 의 내용을 visual_assets 테이블 INSERT 문으로 만듭니다.
결과 파일을 Supabase SQL Editor에 붙여넣기만 하면 메타데이터가 들어갑니다.

    python scripts/supabase/generate_seed.py

키를 다루지 않으므로 이 스크립트는 네트워크에 접속하지 않습니다.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "assets" / "visual-assets.json"
OUTPUT = ROOT / "supabase" / "seed.sql"

FOLDER_BY_TYPE = {
    "office": "office",
    "floorplan": "floorplans",
    "product": "products",
    "material": "materials",
    "project": "projects",
    "proposed": "proposed",
}


def q(value) -> str:
    """SQL 문자열 리터럴. 작은따옴표를 이스케이프합니다."""
    if value is None:
        return "null"
    return "'" + str(value).replace("'", "''") + "'"


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    rows = []

    for asset_id, entry in manifest["assets"].items():
        folder = FOLDER_BY_TYPE[entry["type"]]
        storage_path = f"{folder}/{asset_id}.webp"
        thumb_path = f"{folder}/{asset_id}_thumb.webp"

        rows.append(
            "  ("
            + ", ".join(
                [
                    q(asset_id),
                    q(entry["type"]),
                    q(entry["name"]),
                    q(storage_path),
                    q(thumb_path),
                    q(entry.get("alt", "")),
                    q(entry.get("ratio", "4:3")),
                    str(entry["width"]) if entry.get("width") else "null",
                    str(entry["height"]) if entry.get("height") else "null",
                    q(entry.get("source")),
                    q(entry.get("sourceUrl")),
                    q(entry.get("license")),
                    q(entry.get("purpose")),
                ]
            )
            + ")"
        )

    sql = f"""-- OFFICE HISTORY — Visual Asset 메타데이터 seed
-- scripts/supabase/generate_seed.py 가 생성했습니다. 직접 수정하지 마세요.
-- schema.sql 을 먼저 실행한 뒤 이 파일을 SQL Editor에 붙여넣으세요.
--
-- 이미 있는 id는 최신 값으로 덮어씁니다 (여러 번 실행해도 안전합니다).

insert into public.visual_assets
  (id, asset_type, name, storage_path, thumbnail_path, alt_text, ratio,
   width, height, source, source_url, license, purpose)
values
{",\n".join(rows)}
on conflict (id) do update set
  asset_type     = excluded.asset_type,
  name           = excluded.name,
  storage_path   = excluded.storage_path,
  thumbnail_path = excluded.thumbnail_path,
  alt_text       = excluded.alt_text,
  ratio          = excluded.ratio,
  width          = excluded.width,
  height         = excluded.height,
  purpose        = excluded.purpose;
"""

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(sql, encoding="utf-8")
    ready = sum(1 for e in manifest["assets"].values() if e.get("status") == "ready")
    print(f"생성 완료: {OUTPUT.relative_to(ROOT)}")
    print(f"  전체 {len(rows)}건 (이미지 확보 {ready}건)")


if __name__ == "__main__":
    main()
