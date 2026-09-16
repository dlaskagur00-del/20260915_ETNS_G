"""assets/visual-assets.json 에서 supabase/setup.sql 을 다시 만듭니다.

Asset 이 늘어날 때마다 SQL 을 손으로 고치면 금방 어긋납니다. 실제로 매니페스트가
68건이 된 뒤에도 SQL 은 28건짜리로 남아 있었습니다. 매니페스트를 하나의 원천으로
두고 SQL 은 여기서 생성합니다.

    python scripts/supabase/build_setup_sql.py
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "assets" / "visual-assets.json"
OUT = ROOT / "supabase" / "setup.sql"

HEADER = """-- OFFICE HISTORY — Supabase 초기 설정 (한 번에 실행)
--
-- Supabase 대시보드 → SQL Editor → New query 에 이 파일 전체를 붙여넣고 Run 하세요.
-- 테이블 생성과 메타데이터 입력이 함께 처리됩니다. 여러 번 실행해도 안전합니다.
--
-- 이 파일은 scripts/supabase/build_setup_sql.py 가 생성합니다. 직접 고치지 말고
-- assets/visual-assets.json 을 고친 뒤 스크립트를 다시 실행하세요.

-- ════════════════════════════════════════════════════════════
-- 1부. 테이블 · 정책
-- ════════════════════════════════════════════════════════════

create table if not exists public.visual_assets (
  id             text primary key,
  asset_type     text not null
                   check (asset_type in ('office','floorplan','product','material','project','proposed')),
  name           text not null,
  storage_path   text not null,
  thumbnail_path text,
  alt_text       text not null default '',
  ratio          text not null default '3:2',
  width          integer,
  height         integer,
  source         text,
  source_url     text,
  license        text,
  purpose        text,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

alter table public.visual_assets enable row level security;

-- 읽기만 공개합니다. 쓰기는 대시보드나 service_role 로만 가능합니다.
drop policy if exists "visual_assets 공개 읽기" on public.visual_assets;
create policy "visual_assets 공개 읽기"
  on public.visual_assets for select
  to anon, authenticated
  using (true);

create index if not exists visual_assets_type_idx on public.visual_assets (asset_type);

-- ════════════════════════════════════════════════════════════
-- 2부. Asset 메타데이터
-- ════════════════════════════════════════════════════════════

"""

FOOTER = """
-- ════════════════════════════════════════════════════════════
-- 3부. 확인
-- ════════════════════════════════════════════════════════════

-- 아래를 실행해 {count} 행이 나오면 성공입니다.
--   select count(*) from public.visual_assets;
--   select asset_type, count(*) from public.visual_assets group by asset_type order by 1;
"""


def q(value) -> str:
    """SQL 문자열 리터럴. 작은따옴표는 두 번 써서 이스케이프합니다."""
    if value is None:
        return "null"
    return "'" + str(value).replace("'", "''") + "'"


def strip_prefix(url: str | None) -> str:
    """assets/products/x.webp → products/x.webp (버킷 안의 경로)"""
    if not url:
        return ""
    return url.split("?")[0].removeprefix("assets/")


def main() -> int:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assets = manifest["assets"]

    rows = []
    for asset_id, entry in sorted(assets.items()):
        rows.append(
            "  (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            % (
                q(asset_id),
                q(entry["type"]),
                q(entry["name"]),
                q(strip_prefix(entry.get("url"))),
                q(strip_prefix(entry.get("thumbnailUrl"))),
                q(entry.get("alt") or ""),
                q(entry.get("ratio") or "3:2"),
                entry.get("width") if entry.get("width") else "null",
                entry.get("height") if entry.get("height") else "null",
                q(entry.get("source")),
                q(entry.get("sourceUrl")),
                q(entry.get("license")),
                q(entry.get("purpose")),
            )
        )

    body = (
        "insert into public.visual_assets\n"
        "  (id, asset_type, name, storage_path, thumbnail_path, alt_text, ratio,\n"
        "   width, height, source, source_url, license, purpose)\n"
        "values\n"
        + ",\n".join(rows)
        + "\non conflict (id) do update set\n"
        "  asset_type     = excluded.asset_type,\n"
        "  name           = excluded.name,\n"
        "  storage_path   = excluded.storage_path,\n"
        "  thumbnail_path = excluded.thumbnail_path,\n"
        "  alt_text       = excluded.alt_text,\n"
        "  ratio          = excluded.ratio,\n"
        "  width          = excluded.width,\n"
        "  height         = excluded.height,\n"
        "  source         = excluded.source,\n"
        "  source_url     = excluded.source_url,\n"
        "  license        = excluded.license,\n"
        "  purpose        = excluded.purpose;\n"
    )

    OUT.write_text(HEADER + body + FOOTER.format(count=len(rows)), encoding="utf-8")
    print(f"supabase/setup.sql 생성 — Asset {len(rows)}건")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
