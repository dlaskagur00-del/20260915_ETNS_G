-- OFFICE HISTORY — Supabase 초기 설정 (한 번에 실행)
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

insert into public.visual_assets
  (id, asset_type, name, storage_path, thumbnail_path, alt_text, ratio,
   width, height, source, source_url, license, purpose)
values
  ('floor_plan_main', 'floorplan', '오피스 평면도', 'floorplans/floor_plan_main.webp', 'floorplans/floor_plan_main_thumb.webp', '오피스 층 전체 건축 평면도', '8:5', 1501, 983, null, null, null, '공간 이용 History 메인 (히트맵 베이스)'),
  ('focus_zone_current', 'office', '집중업무존', 'office/focus_zone_current.webp', 'office/focus_zone_current_thumb.webp', '흡음 파티션이 있는 1인 집중 좌석 구역', '3:2', 1536, 1024, null, null, null, '공간 개별 이미지'),
  ('lounge_current', 'office', '라운지', 'office/lounge_current.webp', 'office/lounge_current_thumb.webp', '소파와 러그가 있는 라운지 내부', '3:2', 1536, 1024, null, null, null, '공간 개별 이미지'),
  ('material_acoustic_panel', 'material', '흡음 패널', 'materials/material_acoustic_panel.webp', 'materials/material_acoustic_panel_thumb.webp', '세로 홈이 있는 진회색 펠트 흡음 패널 텍스처', '1:1', 418, 358, null, null, null, '마감재 스와치 — 벽'),
  ('material_carpet_tile', 'material', '카페트 타일', 'materials/material_carpet_tile.webp', 'materials/material_carpet_tile_thumb.webp', '회색 루프파일 카페트 타일 텍스처', '1:1', 527, 363, null, null, null, '마감재 스와치 — 바닥'),
  ('material_ceiling_tile', 'material', '천장 마감재', 'materials/material_ceiling_tile.webp', 'materials/material_ceiling_tile_thumb.webp', '시스템 천장 마감 타일 텍스처', '1:1', 1000, 1000, null, null, null, '마감재 스와치 — 천장'),
  ('material_deco_tile', 'material', '데코타일', 'materials/material_deco_tile.webp', 'materials/material_deco_tile_thumb.webp', '업무 공간용 데코타일 텍스처', '1:1', 1000, 1000, null, null, null, '마감재 스와치 — 바닥'),
  ('material_glass_frosted', 'material', '시트지 유리', 'materials/material_glass_frosted.webp', 'materials/material_glass_frosted_thumb.webp', '하단이 반투명 처리된 유리 텍스처', '1:1', 1000, 1000, null, null, null, '마감재 스와치 — 파티션'),
  ('material_paint_finish', 'material', '도장 마감', 'materials/material_paint_finish.webp', 'materials/material_paint_finish_thumb.webp', '오프화이트 도장 벽면 텍스처', '1:1', 1000, 1000, null, null, null, '마감재 스와치 — 벽'),
  ('material_wood_floor', 'material', '원목 마루', 'materials/material_wood_floor.webp', 'materials/material_wood_floor_thumb.webp', '따뜻한 톤의 오크 원목 마루 텍스처', '1:1', 516, 349, null, null, null, '마감재 스와치 — 바닥'),
  ('material_wood_louver', 'material', '목재 루버 천장', 'materials/material_wood_louver.webp', 'materials/material_wood_louver_thumb.webp', '목재 루버 천장', '1:1', 1000, 1000, null, null, null, '목재 루버 천장 마감재 스와치'),
  ('meeting_room_a_2023', 'office', '회의실 A 2023', 'office/meeting_room_a_2023.webp', 'office/meeting_room_a_2023_thumb.webp', '8인 규모였던 시절의 회의실 내부', '3:2', 1536, 1024, null, null, null, '과거 시점 재구성 · Project BEFORE'),
  ('meeting_room_a_after', 'office', '회의실 A 확장 직후', 'office/meeting_room_a_after.webp', 'office/meeting_room_a_after_thumb.webp', '12인으로 확장한 직후의 회의실 내부', '3:2', 1536, 1024, null, null, null, 'Project Asset AFTER · 변경 후 비교'),
  ('meeting_room_a_current', 'office', '회의실 A 현재', 'office/meeting_room_a_current.webp', 'office/meeting_room_a_current_thumb.webp', '12인 회의 테이블과 디스플레이가 있는 회의실 내부', '3:2', 1536, 1024, null, null, null, '회의실 A 현재 상태 · Project AFTER · Current'),
  ('meeting_room_a_proposed', 'proposed', '회의실 A 제안', 'proposed/meeting_room_a_proposed.webp', 'proposed/meeting_room_a_proposed_thumb.webp', '유리 파티션으로 둘로 나뉜 6인 회의실 두 개', '3:2', 1179, 786, null, null, null, 'AI Insight — 6인 2개 분할안'),
  ('office_isometric_main', 'office', '아이소메트릭 오피스', 'office/office_isometric_main.webp', 'office/office_isometric_main_thumb.webp', '오피스 전체를 위에서 비스듬히 내려다본 아이소메트릭 도면', '3:2', 1536, 1024, null, null, null, '공간 구성 History 메인 · Dashboard'),
  ('open_desk_a_current', 'office', 'Open Desk A', 'office/open_desk_a_current.webp', 'office/open_desk_a_current_thumb.webp', '벤치형 데스크가 늘어선 업무 공간', '3:2', 1536, 1024, null, null, null, '공간 개별 이미지'),
  ('product_air_purifier', 'product', '공기청정 설비', 'products/product_air_purifier.webp', 'products/product_air_purifier_thumb.webp', '공기청정 설비', '1:1', 1024, 1024, null, null, null, '공기청정 설비 · 구성 요소 상세'),
  ('product_display_55_prev', 'product', '이전 55인치 디스플레이', 'products/product_display_55_prev.webp', 'products/product_display_55_prev_thumb.webp', '이전 55인치 디스플레이', '1:1', 1024, 1024, null, null, null, '이전 55인치 디스플레이 · 변경 전 상태'),
  ('product_display_75', 'product', '75인치 디스플레이', 'products/product_display_75.webp', 'products/product_display_75_thumb.webp', '화면이 꺼진 75인치 벽걸이 디스플레이', '4:3', 480, 370, null, null, null, '구성 요소 상세 — 디스플레이'),
  ('product_drywall_partition_prev', 'product', '이전 석고보드 벽', 'products/product_drywall_partition_prev.webp', 'products/product_drywall_partition_prev_thumb.webp', '이전 석고보드 벽', '1:1', 1024, 1024, null, null, null, '이전 석고보드 벽 · 변경 전 상태'),
  ('product_fluorescent_light_prev', 'product', '이전 형광등 조명', 'products/product_fluorescent_light_prev.webp', 'products/product_fluorescent_light_prev_thumb.webp', '이전 형광등 조명', '1:1', 1024, 1024, null, null, null, '이전 형광등 조명 · 변경 전 상태'),
  ('product_glass_partition', 'product', '유리 파티션', 'products/product_glass_partition.webp', 'products/product_glass_partition_thumb.webp', '하단 시트지가 시공된 강화유리 파티션 모듈', '4:3', 476, 406, null, null, null, '구성 요소 상세 — 파티션'),
  ('product_hinged_door_prev', 'product', '이전 여닫이문', 'products/product_hinged_door_prev.webp', 'products/product_hinged_door_prev_thumb.webp', '이전 여닫이문', '1:1', 1024, 1024, null, null, null, '이전 여닫이문 · 변경 전 상태'),
  ('product_indoor_plant', 'product', '실내 식재', 'products/product_indoor_plant.webp', 'products/product_indoor_plant_thumb.webp', '실내 식재', '1:1', 1024, 1024, null, null, null, '실내 식재 · 구성 요소 상세'),
  ('product_led_linear_light', 'product', 'LED 라인 조명', 'products/product_led_linear_light.webp', 'products/product_led_linear_light_thumb.webp', '슬림한 흰색 하우징의 LED 라인 조명 기구', '4:3', 468, 302, null, null, null, '구성 요소 상세 — 조명'),
  ('product_lounge_sofa', 'product', '라운지 소파', 'products/product_lounge_sofa.webp', 'products/product_lounge_sofa_thumb.webp', '패브릭 마감의 2인용 라운지 소파', '4:3', 1024, 749, null, null, null, '구성 요소 상세 — 공용 공간'),
  ('product_meeting_chair', 'product', '회의용 의자', 'products/product_meeting_chair.webp', 'products/product_meeting_chair_thumb.webp', '메쉬 등받이와 알루미늄 베이스의 회의용 의자', '4:3', 450, 378, null, null, null, '구성 요소 상세 — 회의용 의자'),
  ('product_meeting_chair_prev', 'product', '이전 회의용 의자', 'products/product_meeting_chair_prev.webp', 'products/product_meeting_chair_prev_thumb.webp', '이전 회의용 의자', '1:1', 1024, 964, null, null, null, '이전 회의용 의자 · 변경 전 상태'),
  ('product_meeting_table', 'product', '회의 테이블', 'products/product_meeting_table.webp', 'products/product_meeting_table_thumb.webp', '무늬목 상판에 케이블 포트가 있는 2400mm 회의 테이블', '4:3', 541, 337, null, null, null, '구성 요소 상세 — 회의 테이블'),
  ('product_meeting_table_prev', 'product', '이전 회의 테이블', 'products/product_meeting_table_prev.webp', 'products/product_meeting_table_prev_thumb.webp', '이전 회의 테이블', '1:1', 1024, 926, null, null, null, '이전 회의 테이블 · 변경 전 상태'),
  ('product_office_desk', 'product', '업무용 데스크', 'products/product_office_desk.webp', 'products/product_office_desk_thumb.webp', '높이 조절이 가능한 업무용 데스크', '4:3', 1024, 868, null, null, null, '구성 요소 상세 — 업무 공간'),
  ('product_power_module', 'product', '전원 모듈', 'products/product_power_module.webp', 'products/product_power_module_thumb.webp', '테이블 매립형 전원·데이터 모듈', '4:3', 1024, 1024, null, null, null, '구성 요소 상세 — 시설/설비'),
  ('product_sliding_door', 'product', '슬라이딩 도어', 'products/product_sliding_door.webp', 'products/product_sliding_door_thumb.webp', '블랙 프레임의 유리 슬라이딩 도어', '4:3', 413, 381, null, null, null, '구성 요소 상세 — 문'),
  ('product_task_chair', 'product', '사무용 의자', 'products/product_task_chair.webp', 'products/product_task_chair_thumb.webp', '요추 지지대가 있는 사무용 태스크 체어', '4:3', 809, 1024, null, null, null, '구성 요소 상세 — 업무 공간'),
  ('product_video_conf', 'product', '화상회의 장비', 'products/product_video_conf.webp', 'products/product_video_conf_thumb.webp', '카메라와 스피커가 일체형인 화상회의 사운드바', '4:3', 1024, 1024, null, null, null, '구성 요소 상세 — 시설/설비'),
  ('product_water_purifier', 'product', '정수 설비', 'products/product_water_purifier.webp', 'products/product_water_purifier_thumb.webp', '정수 설비', '1:1', 1024, 1024, null, null, null, '정수 설비 · 구성 요소 상세'),
  ('product_whiteboard', 'product', '화이트보드', 'products/product_whiteboard.webp', 'products/product_whiteboard_thumb.webp', '벽면형 화이트보드', '4:3', 1024, 1024, null, null, null, '구성 요소 상세 — 회의 장비'),
  ('project_focusa_before', 'project', '집중업무존 신설 전', 'projects/project_focusa_before.webp', 'projects/project_focusa_before_thumb.webp', '집중업무존이 생기기 전의 미사용 공간', '3:2', 1536, 1024, null, null, null, 'Project Asset BEFORE'),
  ('project_lounge_before', 'project', '라운지 바닥 교체 전', 'projects/project_lounge_before.webp', 'projects/project_lounge_before_thumb.webp', '데코타일이 깔려 있던 시절의 라운지', '3:2', 1536, 1024, null, null, null, 'Project Asset BEFORE'),
  ('reception_current', 'office', '리셉션', 'office/reception_current.webp', 'office/reception_current_thumb.webp', '카운터와 대기 소파가 있는 리셉션', '3:2', 1536, 1024, null, null, null, '공간 개별 이미지'),
  ('rest_area_current', 'office', '휴게공간', 'office/rest_area_current.webp', 'office/rest_area_current_thumb.webp', '원형 테이블과 하이테이블이 있는 휴게공간', '3:2', 1536, 1024, null, null, null, '공간 개별 이미지'),
  ('turntable_display_75_00', 'product', '75인치 디스플레이 0°', 'products/turntable_display_75_00.webp', 'products/turntable_display_75_00_thumb.webp', '75인치 디스플레이 0°', '1:1', 1024, 1024, null, null, null, '75인치 디스플레이 360° 턴테이블 프레임 1/4'),
  ('turntable_display_75_01', 'product', '75인치 디스플레이 90°', 'products/turntable_display_75_01.webp', 'products/turntable_display_75_01_thumb.webp', '75인치 디스플레이 90°', '1:1', 1024, 1024, null, null, null, '75인치 디스플레이 360° 턴테이블 프레임 2/4'),
  ('turntable_display_75_02', 'product', '75인치 디스플레이 180°', 'products/turntable_display_75_02.webp', 'products/turntable_display_75_02_thumb.webp', '75인치 디스플레이 180°', '1:1', 1024, 1024, null, null, null, '75인치 디스플레이 360° 턴테이블 프레임 3/4'),
  ('turntable_display_75_03', 'product', '75인치 디스플레이 270°', 'products/turntable_display_75_03.webp', 'products/turntable_display_75_03_thumb.webp', '75인치 디스플레이 270°', '1:1', 1024, 1024, null, null, null, '75인치 디스플레이 360° 턴테이블 프레임 4/4'),
  ('turntable_glass_partition_00', 'product', '유리 파티션 0°', 'products/turntable_glass_partition_00.webp', 'products/turntable_glass_partition_00_thumb.webp', '유리 파티션 0°', '1:1', 1024, 1024, null, null, null, '유리 파티션 360° 턴테이블 프레임 1/4'),
  ('turntable_glass_partition_01', 'product', '유리 파티션 90°', 'products/turntable_glass_partition_01.webp', 'products/turntable_glass_partition_01_thumb.webp', '유리 파티션 90°', '1:1', 1024, 1024, null, null, null, '유리 파티션 360° 턴테이블 프레임 2/4'),
  ('turntable_glass_partition_02', 'product', '유리 파티션 180°', 'products/turntable_glass_partition_02.webp', 'products/turntable_glass_partition_02_thumb.webp', '유리 파티션 180°', '1:1', 1024, 1024, null, null, null, '유리 파티션 360° 턴테이블 프레임 3/4'),
  ('turntable_glass_partition_03', 'product', '유리 파티션 270°', 'products/turntable_glass_partition_03.webp', 'products/turntable_glass_partition_03_thumb.webp', '유리 파티션 270°', '1:1', 1024, 1024, null, null, null, '유리 파티션 360° 턴테이블 프레임 4/4'),
  ('turntable_led_light_00', 'product', 'LED 라인 조명 0°', 'products/turntable_led_light_00.webp', 'products/turntable_led_light_00_thumb.webp', 'LED 라인 조명 0°', '1:1', 1024, 1024, null, null, null, 'LED 라인 조명 360° 턴테이블 프레임 1/4'),
  ('turntable_led_light_01', 'product', 'LED 라인 조명 90°', 'products/turntable_led_light_01.webp', 'products/turntable_led_light_01_thumb.webp', 'LED 라인 조명 90°', '1:1', 1024, 1024, null, null, null, 'LED 라인 조명 360° 턴테이블 프레임 2/4'),
  ('turntable_led_light_02', 'product', 'LED 라인 조명 180°', 'products/turntable_led_light_02.webp', 'products/turntable_led_light_02_thumb.webp', 'LED 라인 조명 180°', '1:1', 1024, 1024, null, null, null, 'LED 라인 조명 360° 턴테이블 프레임 3/4'),
  ('turntable_led_light_03', 'product', 'LED 라인 조명 270°', 'products/turntable_led_light_03.webp', 'products/turntable_led_light_03_thumb.webp', 'LED 라인 조명 270°', '1:1', 1024, 1024, null, null, null, 'LED 라인 조명 360° 턴테이블 프레임 4/4'),
  ('turntable_meeting_chair_00', 'product', '회의용 의자 0°', 'products/turntable_meeting_chair_00.webp', 'products/turntable_meeting_chair_00_thumb.webp', '회의용 의자 0°', '1:1', 1024, 904, null, null, null, '회의용 의자 360° 턴테이블 프레임 1/4'),
  ('turntable_meeting_chair_01', 'product', '회의용 의자 90°', 'products/turntable_meeting_chair_01.webp', 'products/turntable_meeting_chair_01_thumb.webp', '회의용 의자 90°', '1:1', 1024, 904, null, null, null, '회의용 의자 360° 턴테이블 프레임 2/4'),
  ('turntable_meeting_chair_02', 'product', '회의용 의자 180°', 'products/turntable_meeting_chair_02.webp', 'products/turntable_meeting_chair_02_thumb.webp', '회의용 의자 180°', '1:1', 1024, 904, null, null, null, '회의용 의자 360° 턴테이블 프레임 3/4'),
  ('turntable_meeting_chair_03', 'product', '회의용 의자 270°', 'products/turntable_meeting_chair_03.webp', 'products/turntable_meeting_chair_03_thumb.webp', '회의용 의자 270°', '1:1', 1024, 904, null, null, null, '회의용 의자 360° 턴테이블 프레임 4/4'),
  ('turntable_meeting_table_00', 'product', '회의 테이블 0°', 'products/turntable_meeting_table_00.webp', 'products/turntable_meeting_table_00_thumb.webp', '회의 테이블 0°', '1:1', 1024, 897, null, null, null, '회의 테이블 360° 턴테이블 프레임 1/4'),
  ('turntable_meeting_table_01', 'product', '회의 테이블 90°', 'products/turntable_meeting_table_01.webp', 'products/turntable_meeting_table_01_thumb.webp', '회의 테이블 90°', '1:1', 1024, 897, null, null, null, '회의 테이블 360° 턴테이블 프레임 2/4'),
  ('turntable_meeting_table_02', 'product', '회의 테이블 180°', 'products/turntable_meeting_table_02.webp', 'products/turntable_meeting_table_02_thumb.webp', '회의 테이블 180°', '1:1', 1024, 897, null, null, null, '회의 테이블 360° 턴테이블 프레임 3/4'),
  ('turntable_meeting_table_03', 'product', '회의 테이블 270°', 'products/turntable_meeting_table_03.webp', 'products/turntable_meeting_table_03_thumb.webp', '회의 테이블 270°', '1:1', 1024, 897, null, null, null, '회의 테이블 360° 턴테이블 프레임 4/4'),
  ('turntable_sliding_door_00', 'product', '슬라이딩 도어 0°', 'products/turntable_sliding_door_00.webp', 'products/turntable_sliding_door_00_thumb.webp', '슬라이딩 도어 0°', '1:1', 1024, 1024, null, null, null, '슬라이딩 도어 360° 턴테이블 프레임 1/4'),
  ('turntable_sliding_door_01', 'product', '슬라이딩 도어 90°', 'products/turntable_sliding_door_01.webp', 'products/turntable_sliding_door_01_thumb.webp', '슬라이딩 도어 90°', '1:1', 1024, 1024, null, null, null, '슬라이딩 도어 360° 턴테이블 프레임 2/4'),
  ('turntable_sliding_door_02', 'product', '슬라이딩 도어 180°', 'products/turntable_sliding_door_02.webp', 'products/turntable_sliding_door_02_thumb.webp', '슬라이딩 도어 180°', '1:1', 1024, 1024, null, null, null, '슬라이딩 도어 360° 턴테이블 프레임 3/4'),
  ('turntable_sliding_door_03', 'product', '슬라이딩 도어 270°', 'products/turntable_sliding_door_03.webp', 'products/turntable_sliding_door_03_thumb.webp', '슬라이딩 도어 270°', '1:1', 1024, 1024, null, null, null, '슬라이딩 도어 360° 턴테이블 프레임 4/4'),
  ('vendor_project_thumbnail_01', 'project', '업체 프로젝트 썸네일 1', 'projects/vendor_project_thumbnail_01.webp', 'projects/vendor_project_thumbnail_01_thumb.webp', '완료 프로젝트 대표 이미지', '1:1', 1536, 1024, null, null, null, 'Project Asset 카드 썸네일'),
  ('vendor_project_thumbnail_02', 'project', '업체 프로젝트 썸네일 2', 'projects/vendor_project_thumbnail_02.webp', 'projects/vendor_project_thumbnail_02_thumb.webp', '완료 프로젝트 대표 이미지', '1:1', 1536, 1024, null, null, null, 'Project Asset 카드 썸네일')
on conflict (id) do update set
  asset_type     = excluded.asset_type,
  name           = excluded.name,
  storage_path   = excluded.storage_path,
  thumbnail_path = excluded.thumbnail_path,
  alt_text       = excluded.alt_text,
  ratio          = excluded.ratio,
  width          = excluded.width,
  height         = excluded.height,
  source         = excluded.source,
  source_url     = excluded.source_url,
  license        = excluded.license,
  purpose        = excluded.purpose;

-- ════════════════════════════════════════════════════════════
-- 3부. 확인
-- ════════════════════════════════════════════════════════════

-- 아래를 실행해 68 행이 나오면 성공입니다.
--   select count(*) from public.visual_assets;
--   select asset_type, count(*) from public.visual_assets group by asset_type order by 1;
