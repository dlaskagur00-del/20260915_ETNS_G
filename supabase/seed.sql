-- OFFICE HISTORY — Visual Asset 메타데이터 seed
-- scripts/supabase/generate_seed.py 가 생성했습니다. 직접 수정하지 마세요.
-- schema.sql 을 먼저 실행한 뒤 이 파일을 SQL Editor에 붙여넣으세요.
--
-- 이미 있는 id는 최신 값으로 덮어씁니다 (여러 번 실행해도 안전합니다).

insert into public.visual_assets
  (id, asset_type, name, storage_path, thumbnail_path, alt_text, ratio,
   width, height, source, source_url, license, purpose)
values
  ('office_isometric_main', 'office', '아이소메트릭 오피스', 'office/office_isometric_main.webp', 'office/office_isometric_main_thumb.webp', '오피스 전체를 위에서 비스듬히 내려다본 아이소메트릭 도면', '3:2', null, null, null, null, null, '공간 구성 History 메인 · Dashboard'),
  ('floor_plan_main', 'floorplan', '오피스 평면도', 'floorplans/floor_plan_main.webp', 'floorplans/floor_plan_main_thumb.webp', '오피스 층 전체 건축 평면도', '8:5', null, null, null, null, null, '공간 이용 History 메인 (히트맵 베이스)'),
  ('meeting_room_a_current', 'office', '회의실 A 현재', 'office/meeting_room_a_current.webp', 'office/meeting_room_a_current_thumb.webp', '12인 회의 테이블과 디스플레이가 있는 회의실 내부', '3:2', null, null, null, null, null, '회의실 A 현재 상태 · Project AFTER · Current'),
  ('meeting_room_a_2023', 'office', '회의실 A 2023', 'office/meeting_room_a_2023.webp', 'office/meeting_room_a_2023_thumb.webp', '8인 규모였던 시절의 회의실 내부', '3:2', null, null, null, null, null, '과거 시점 재구성 · Project BEFORE'),
  ('meeting_room_a_proposed', 'proposed', '회의실 A 제안', 'proposed/meeting_room_a_proposed.webp', 'proposed/meeting_room_a_proposed_thumb.webp', '유리 파티션으로 둘로 나뉜 6인 회의실 두 개', '3:2', null, null, null, null, null, 'AI Insight — 6인 2개 분할안'),
  ('lounge_current', 'office', '라운지', 'office/lounge_current.webp', 'office/lounge_current_thumb.webp', '소파와 러그가 있는 라운지 내부', '3:2', null, null, null, null, null, '공간 개별 이미지'),
  ('open_desk_a_current', 'office', 'Open Desk A', 'office/open_desk_a_current.webp', 'office/open_desk_a_current_thumb.webp', '벤치형 데스크가 늘어선 업무 공간', '3:2', null, null, null, null, null, '공간 개별 이미지'),
  ('focus_zone_current', 'office', '집중업무존', 'office/focus_zone_current.webp', 'office/focus_zone_current_thumb.webp', '흡음 파티션이 있는 1인 집중 좌석 구역', '3:2', null, null, null, null, null, '공간 개별 이미지'),
  ('reception_current', 'office', '리셉션', 'office/reception_current.webp', 'office/reception_current_thumb.webp', '카운터와 대기 소파가 있는 리셉션', '3:2', null, null, null, null, null, '공간 개별 이미지'),
  ('rest_area_current', 'office', '휴게공간', 'office/rest_area_current.webp', 'office/rest_area_current_thumb.webp', '원형 테이블과 하이테이블이 있는 휴게공간', '3:2', null, null, null, null, null, '공간 개별 이미지'),
  ('product_meeting_table', 'product', '회의 테이블', 'products/product_meeting_table.webp', 'products/product_meeting_table_thumb.webp', '무늬목 상판에 케이블 포트가 있는 2400mm 회의 테이블', '4:3', 800, 800, null, null, null, '구성 요소 상세 — 회의 테이블'),
  ('product_meeting_chair', 'product', '회의용 의자', 'products/product_meeting_chair.webp', 'products/product_meeting_chair_thumb.webp', '메쉬 등받이와 알루미늄 베이스의 회의용 의자', '4:3', 800, 800, null, null, null, '구성 요소 상세 — 회의용 의자'),
  ('product_display_75', 'product', '75인치 디스플레이', 'products/product_display_75.webp', 'products/product_display_75_thumb.webp', '화면이 꺼진 75인치 벽걸이 디스플레이', '4:3', 800, 800, null, null, null, '구성 요소 상세 — 디스플레이'),
  ('product_led_linear_light', 'product', 'LED 라인 조명', 'products/product_led_linear_light.webp', 'products/product_led_linear_light_thumb.webp', '슬림한 흰색 하우징의 LED 라인 조명 기구', '4:3', 800, 800, null, null, null, '구성 요소 상세 — 조명'),
  ('product_glass_partition', 'product', '유리 파티션', 'products/product_glass_partition.webp', 'products/product_glass_partition_thumb.webp', '하단 시트지가 시공된 강화유리 파티션 모듈', '4:3', 800, 800, null, null, null, '구성 요소 상세 — 파티션'),
  ('product_sliding_door', 'product', '슬라이딩 도어', 'products/product_sliding_door.webp', 'products/product_sliding_door_thumb.webp', '블랙 프레임의 유리 슬라이딩 도어', '4:3', 800, 800, null, null, null, '구성 요소 상세 — 문'),
  ('product_office_desk', 'product', '업무용 데스크', 'products/product_office_desk.webp', 'products/product_office_desk_thumb.webp', '높이 조절이 가능한 업무용 데스크', '4:3', null, null, null, null, null, '구성 요소 상세 — 업무 공간'),
  ('product_task_chair', 'product', '사무용 의자', 'products/product_task_chair.webp', 'products/product_task_chair_thumb.webp', '요추 지지대가 있는 사무용 태스크 체어', '4:3', null, null, null, null, null, '구성 요소 상세 — 업무 공간'),
  ('product_lounge_sofa', 'product', '라운지 소파', 'products/product_lounge_sofa.webp', 'products/product_lounge_sofa_thumb.webp', '패브릭 마감의 2인용 라운지 소파', '4:3', null, null, null, null, null, '구성 요소 상세 — 공용 공간'),
  ('product_video_conf', 'product', '화상회의 장비', 'products/product_video_conf.webp', 'products/product_video_conf_thumb.webp', '카메라와 스피커가 일체형인 화상회의 사운드바', '4:3', null, null, null, null, null, '구성 요소 상세 — 시설/설비'),
  ('material_carpet_tile', 'material', '카페트 타일', 'materials/material_carpet_tile.webp', 'materials/material_carpet_tile_thumb.webp', '회색 루프파일 카페트 타일 텍스처', '1:1', 800, 800, null, null, null, '마감재 스와치 — 바닥'),
  ('material_acoustic_panel', 'material', '흡음 패널', 'materials/material_acoustic_panel.webp', 'materials/material_acoustic_panel_thumb.webp', '세로 홈이 있는 진회색 펠트 흡음 패널 텍스처', '1:1', 800, 800, null, null, null, '마감재 스와치 — 벽'),
  ('material_wood_floor', 'material', '원목 마루', 'materials/material_wood_floor.webp', 'materials/material_wood_floor_thumb.webp', '따뜻한 톤의 오크 원목 마루 텍스처', '1:1', 800, 800, null, null, null, '마감재 스와치 — 바닥'),
  ('material_deco_tile', 'material', '데코타일', 'materials/material_deco_tile.webp', 'materials/material_deco_tile_thumb.webp', '업무 공간용 데코타일 텍스처', '1:1', null, null, null, null, null, '마감재 스와치 — 바닥'),
  ('material_paint_finish', 'material', '도장 마감', 'materials/material_paint_finish.webp', 'materials/material_paint_finish_thumb.webp', '오프화이트 도장 벽면 텍스처', '1:1', null, null, null, null, null, '마감재 스와치 — 벽'),
  ('material_glass_frosted', 'material', '시트지 유리', 'materials/material_glass_frosted.webp', 'materials/material_glass_frosted_thumb.webp', '하단이 반투명 처리된 유리 텍스처', '1:1', null, null, null, null, null, '마감재 스와치 — 파티션'),
  ('project_focusa_before', 'project', '집중업무존 신설 전', 'projects/project_focusa_before.webp', 'projects/project_focusa_before_thumb.webp', '집중업무존이 생기기 전의 미사용 공간', '3:2', null, null, null, null, null, 'Project Asset BEFORE'),
  ('project_lounge_before', 'project', '라운지 바닥 교체 전', 'projects/project_lounge_before.webp', 'projects/project_lounge_before_thumb.webp', '데코타일이 깔려 있던 시절의 라운지', '3:2', null, null, null, null, null, 'Project Asset BEFORE')
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
