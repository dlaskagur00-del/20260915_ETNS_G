-- OFFICE HISTORY — Visual Asset 메타데이터 스키마
--
-- Supabase 대시보드 → SQL Editor 에 그대로 붙여넣고 실행하세요.
-- 이미지 파일 자체는 Storage에, 그 파일이 무엇이고 어디에 쓰이는지는 이 표에 남습니다.

create table if not exists public.visual_assets (
  id            text primary key,
  asset_type    text not null
                  check (asset_type in ('office','floorplan','product','material','project','proposed')),
  name          text not null,
  storage_path  text not null,              -- 예: products/product_meeting_table.webp
  thumbnail_path text,                      -- 예: products/product_meeting_table_thumb.webp
  alt_text      text not null default '',
  ratio         text not null default '4:3',
  width         integer,
  height        integer,
  source        text,
  source_url    text,
  license       text,
  purpose       text,                       -- 이 Asset이 화면 어디에 쓰이는가
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.visual_assets is
  'OFFICE HISTORY 화면에서 사용하는 시각 자산의 메타데이터. 파일은 Storage 버킷에 있다.';
comment on column public.visual_assets.storage_path is
  'office-history-assets 버킷 기준 상대 경로';
comment on column public.visual_assets.purpose is
  '어느 화면에서 왜 쓰이는지 — 나중에 담당자가 바뀌어도 판단할 수 있도록 남긴다';

-- 갱신 시각 자동 반영
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists visual_assets_touch on public.visual_assets;
create trigger visual_assets_touch
  before update on public.visual_assets
  for each row execute function public.touch_updated_at();

-- 읽기는 공개, 쓰기는 대시보드/서비스 키로만
alter table public.visual_assets enable row level security;

drop policy if exists "visual_assets 공개 읽기" on public.visual_assets;
create policy "visual_assets 공개 읽기"
  on public.visual_assets for select
  to anon, authenticated
  using (true);

create index if not exists visual_assets_type_idx on public.visual_assets (asset_type);
