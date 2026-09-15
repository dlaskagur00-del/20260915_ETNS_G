# VISUAL ASSET REQUIREMENTS — OFFICE HISTORY

이미지 생성 도구에 그대로 넣어 쓸 수 있도록 작성한 사양서입니다.
각 항목의 `PROMPT BASE`는 영문 생성 도구용 문장이며, 필요에 따라 다듬어 사용합니다.

- 작성일: 2026-09-15
- 대상 프로젝트: `OFFICE_HISTORY/` (빌드 없는 ES 모듈 구조)
- Asset 저장 위치(1단계): `OFFICE_HISTORY/assets/<type>/`
- Asset 저장 위치(2단계): Supabase Storage `office-history-assets/<type>/`

---

## 0. 공통 규칙

모든 Asset에 공통으로 적용합니다.

| 항목 | 규칙 |
|---|---|
| 이미지 내 텍스트 | **없음** (라벨·수치는 전부 HTML로 렌더) |
| 사람 | **없음** (인물 저작권·초상권 회피, 공간 자체에 집중) |
| 브랜드 로고 | **없음** (실제 제조사 로고 금지 — Generic 제품으로 생성) |
| 배경 | Light / Neutral (#F4F3F1 계열과 충돌하지 않을 것) |
| 색감 | 화이트 · 라이트그레이 · 차콜 · 우드톤 중심, 오렌지는 강조로만 최소 사용 |
| 금지 | 네온, 강한 그라데이션, 보라색 AI 느낌, 과한 반사/글래스 효과 |
| 포맷 | 원본 PNG 또는 JPG → 파이프라인에서 WebP 변환 |
| 종횡비 | 공간 3:2, 제품 4:3, 마감재 1:1 |

**해상도 최소 기준** (미달 시 사용하지 않고 교체)

| 용도 | 최소 가로 |
|---|---|
| Office Main Visual | 1600px (권장 2400px) |
| Floor Map | 1600px (권장 2400px) |
| Before / After / Proposed | 1400px (권장 1920px) |
| 공간 개별 이미지 | 1400px |
| Product | 800px (권장 1200px) |
| Material Texture | 800px (권장 1000px, tileable) |
| Thumbnail | 320px (파이프라인이 자동 생성) |

---

## 1. 우선순위

발표까지 시간이 제한적이라면 **P0 6장**만 확보해도 데모의 핵심 장면이 전부 실제 이미지로 바뀝니다.

| 순위 | Asset | 이유 |
|---|---|---|
| **P0** | `office_isometric_main` | 구성 History 메인 — 서비스 첫인상 |
| **P0** | `floor_plan_main` | 이용 History 메인 |
| **P0** | `meeting_room_a_current` | 데모가 집중하는 공간 |
| **P0** | `meeting_room_a_proposed` | AI Insight 핵심 장면 |
| **P0** | `product_meeting_table` | 구성 요소 상세의 대표 제품 |
| **P0** | `product_meeting_chair` | 확장 History의 근거 제품 |
| P1 | `meeting_room_a_2023` | 과거 시점 rewind |
| P1 | `product_display_75`, `product_led_linear_light`, `product_glass_partition`, `product_sliding_door` | 회의실 A 나머지 구성 요소 |
| P1 | `material_carpet_tile`, `material_acoustic_panel`, `material_wood_floor` | 마감재 썸네일 |
| P2 | 공간 개별 이미지 5종 | 회의실 A 외 공간 |
| P2 | 제품·마감재 나머지 | 전체 완성도 |

---

## 2. OFFICE / SPACE

### ASSET ID: `office_isometric_main`
- **PURPOSE**: 공간 구성 History 메인 화면 / Dashboard 중앙
- **TYPE**: 3D Isometric Office
- **RESOLUTION**: 2400 × 1600 이상
- **CAMERA**: 아이소메트릭 (좌상단 30° 부감), 평행 투영
- **BACKGROUND**: 투명 또는 밝은 중성 단색
- **REQUIRED**
  - 단일 층 오피스 전체가 한 화면에 들어올 것
  - 회의실 3개 이상(유리 파티션으로 구획), Open Desk 구역 2개 이상,
    라운지, 리셉션, 집중업무존, 휴게공간이 시각적으로 구분될 것
  - 가구가 실제 오피스처럼 배치될 것 (책상 열, 회의 테이블, 소파, 카운터)
  - 식물 소량 배치
- **FORBIDDEN**: 텍스트, 사람, 천장(내부가 보여야 함), 외벽 창밖 풍경 과장
- **NOTE**: 현재 앱의 공간 배치(24개 공간, 3개 밴드 구조)와 **완전히 일치할 필요는 없습니다.**
  Hotspot 좌표를 이미지에 맞춰 다시 잡습니다.
- **PROMPT BASE**
  > Isometric 3D illustration of a modern corporate office floor, single level, cutaway with no ceiling, light neutral palette with warm wood and light grey, glass-partitioned meeting rooms, open desk clusters, lounge with sofas, reception counter, focus booths, a few plants, soft even lighting, clean architectural render, no people, no text, plain light background
- **STATUS**: REQUIRED

### ASSET ID: `floor_plan_main`
- **PURPOSE**: 공간 이용 History 메인 (Heatmap 베이스 레이어)
- **TYPE**: 2D Floor Plan (건축 평면도)
- **RESOLUTION**: 2400 × 1500 이상
- **CAMERA**: 정투영 top-down
- **BACKGROUND**: 흰색
- **REQUIRED**
  - 벽·문·구획이 명확한 건축 도면 스타일
  - 공간 구획이 **면(面)으로 닫혀 있을 것** — 그 위에 히트맵 색을 덮습니다
  - 가구는 평면 기호 수준으로 옅게 (히트맵을 가리지 않도록)
  - 선 색은 중간 회색, 채움은 거의 흰색
- **FORBIDDEN**: 텍스트/치수선/실명 라벨, 짙은 채움, 컬러 강조
- **NOTE**: 이 이미지 위에 히트맵·선택 하이라이트·라벨을 **코드 레이어로** 올립니다(§11 원칙).
- **PROMPT BASE**
  > Clean architectural floor plan of a modern office floor, top-down orthographic, thin mid-grey line work on white, rooms clearly enclosed, furniture shown as very light plan symbols, no dimensions, no text labels, no color fills, high resolution CAD-like drawing
- **STATUS**: REQUIRED

### ASSET ID: `meeting_room_a_current`
- **PURPOSE**: 회의실 A 현재 상태 / Project Asset AFTER / Current-Proposed 비교의 CURRENT
- **TYPE**: Interior Render
- **RESOLUTION**: 1920 × 1280 이상
- **CAMERA**: 출입구 쪽에서 실내를 바라보는 3/4 뷰, 눈높이 1.5m, 광각 24mm 상당
- **REQUIRED**: 12인 회의 테이블 1개, 메쉬 의자 12석, 벽면 75인치 디스플레이,
  천장 LED 라인 조명, 한쪽 유리 파티션, 카페트 타일 바닥, 후면 흡음 패널 벽
- **FORBIDDEN**: 텍스트, 사람, 브랜드 로고
- **CRITICAL**: `meeting_room_a_2023`, `meeting_room_a_proposed`와 **동일한 카메라 위치·화각·조명**으로 생성할 것. 세 장을 한 세션에서 연속 생성하는 것을 권장합니다.
- **PROMPT BASE**
  > Interior render of a corporate meeting room for 12 people, single long table with twelve mesh chairs, 75-inch wall display, linear LED ceiling light, one full-height glass partition wall, grey carpet tile floor, acoustic felt panel back wall, soft daylight, three-quarter view from the doorway at eye level, neutral light palette, no people, no text
- **STATUS**: REQUIRED

### ASSET ID: `meeting_room_a_2023`
- **PURPOSE**: 과거 시점(2023.03 최초 구축, 8인) / Project Asset BEFORE
- **TYPE**: Interior Render
- **RESOLUTION**: 1920 × 1280 이상
- **CAMERA**: `meeting_room_a_current`와 **완전히 동일**
- **REQUIRED**: 더 좁은 방, 8인 목재 테이블, 의자 8석, 55인치 디스플레이,
  형광 평판 조명, 석고 벽체(유리 파티션 아님), 여닫이 문
- **FORBIDDEN**: 텍스트, 사람
- **NOTE**: 확장 전이므로 방이 눈에 띄게 좁아야 합니다(63㎡ → 90㎡ 차이).
- **STATUS**: REQUIRED

### ASSET ID: `meeting_room_a_proposed`
- **PURPOSE**: AI Insight — 6인 회의실 2개 분할안
- **TYPE**: Interior Render (AI 제안)
- **RESOLUTION**: 1920 × 1280 이상
- **CAMERA**: `meeting_room_a_current`와 **완전히 동일**
- **REQUIRED**: 동일한 방을 유리 파티션으로 좌우 분할, 각 칸에 6인 테이블 1개씩,
  각 칸 별도 디스플레이, 조명·바닥·마감은 현재와 동일
- **FORBIDDEN**: 텍스트, 사람, 다른 공간처럼 보이는 구조 변경
- **CRITICAL**: "다른 회의실 사진"이 되면 안 됩니다. 같은 방에 칸막이가 생긴 것으로 읽혀야 합니다.
- **STATUS**: REQUIRED

### 공간 개별 이미지 (P2)

| ASSET ID | 공간 | 해상도 | 핵심 요소 |
|---|---|---|---|
| `lounge_current` | 라운지 | 1600×1067 | 소파 2조, 러그, 커피 테이블, 펜던트 조명, 원목 마루 |
| `open_desk_a_current` | Open Desk A | 1600×1067 | 벤치형 데스크 열, 로우 파티션, 라인 조명, 데코타일 |
| `focus_zone_current` | 집중업무존 | 1600×1067 | 1인 부스형 좌석, 흡음 파티션, 개별 조명 |
| `reception_current` | 리셉션 | 1600×1067 | 카운터, 대기 소파, 식물, 사이니지 벽(텍스트 없음) |
| `rest_area_current` | 휴게공간 | 1600×1067 | 원형 테이블, 하이테이블, 따뜻한 조명 |

카메라·조명 규칙은 `meeting_room_a_current`와 동일하게 적용합니다.

---

## 3. PRODUCT

공통: 정면 3/4 뷰, 순백 또는 아주 옅은 회색 배경, 부드러운 그림자, 제품만 단독,
**브랜드 로고 없음**(Generic 제품으로 생성), 1200 × 900 이상.

| ASSET ID | 제품 | 대응 SpaceAsset | 우선순위 |
|---|---|---|---|
| `product_meeting_table` | 2400mm 회의 테이블 (무늬목 상판, 케이블 포트) | `mr-a-table` | **P0** |
| `product_meeting_chair` | 메쉬 회의용 의자 | `mr-a-chair` | **P0** |
| `product_display_75` | 75인치 벽걸이 디스플레이 (화면 꺼진 상태) | `mr-a-display` | P1 |
| `product_led_linear_light` | LED 라인 조명 기구 | `mr-a-light` | P1 |
| `product_glass_partition` | 강화유리 파티션 모듈 | `mr-a-partition` | P1 |
| `product_sliding_door` | 유리 슬라이딩 도어 | `mr-a-door` | P1 |
| `product_office_desk` | 높이조절 업무용 데스크 | 업무공간 공통 | P2 |
| `product_task_chair` | 사무용 태스크 체어 | 업무공간 공통 | P2 |
| `product_lounge_sofa` | 라운지 2인 소파 | 공용공간 공통 | P2 |
| `product_video_conf` | 화상회의 사운드바 | `화상회의 장비` | P2 |

**PROMPT BASE 예시 (회의 테이블)**
> Product photo of a generic modern 2400mm conference table, light oak veneer top with a recessed cable port, matte black steel frame, three-quarter front view, pure white seamless background, soft studio lighting with a subtle contact shadow, no branding, no text, high resolution

---

## 4. MATERIAL

공통: 정사각 tileable 텍스처, 1000 × 1000 이상, 정면 평행 촬영, 균일 조명.

| ASSET ID | 마감재 | 대응 항목 | 우선순위 |
|---|---|---|---|
| `material_carpet_tile` | 회색 카페트 타일 | 회의실 A 바닥 | P1 |
| `material_acoustic_panel` | 펠트 흡음 패널 | 회의실 A 벽 | P1 |
| `material_wood_floor` | 원목 마루 | 라운지 바닥 | P1 |
| `material_deco_tile` | 데코타일 | 업무공간 바닥 | P2 |
| `material_paint_finish` | 도장 마감 (오프화이트) | 업무공간 벽 | P2 |
| `material_glass_frosted` | 하단 시트지 처리 유리 | 파티션 | P2 |

**PROMPT BASE 예시**
> Seamless tileable texture of grey loop-pile carpet tile, flat top-down view, even diffuse lighting, no shadows, no perspective, high resolution material swatch

---

## 5. PROJECT (Before / After)

| ASSET ID | 내용 | 재사용 |
|---|---|---|
| `project_mra_before` | 회의실 A 확장 전 | `meeting_room_a_2023` 재사용 |
| `project_mra_after` | 회의실 A 확장 후 | `meeting_room_a_current` 재사용 |
| `project_focusa_before` | 집중업무존 신설 전 (미사용 공간/창고) | 신규 |
| `project_focusa_after` | 집중업무존 신설 후 | `focus_zone_current` 재사용 |
| `project_lounge_before` | 라운지 바닥 교체 전 (데코타일) | 신규 |
| `project_lounge_after` | 라운지 바닥 교체 후 (원목 마루) | `lounge_current` 재사용 |

신규 2장만 생성하면 되며, **Before/After 쌍은 반드시 같은 카메라**로 만듭니다.

---

## 6. 총 필요 수량

| 구분 | 신규 생성 | 비고 |
|---|---|---|
| Office / Floor Plan | 2 | P0 |
| 회의실 A 3종 | 3 | P0 2 + P1 1, 동일 카메라 필수 |
| 공간 개별 | 5 | P2 |
| Product | 10 | P0 2 + P1 4 + P2 4 |
| Material | 6 | P1 3 + P2 3 |
| Project 신규 | 2 | P2 |
| **합계** | **28** | **P0만 = 6장** |

---

## 7. 파일 배치 규칙

```
OFFICE_HISTORY/
└── assets/
    ├── office/        office_isometric_main.webp, meeting_room_a_*.webp, lounge_current.webp …
    ├── floorplans/    floor_plan_main.webp
    ├── products/      product_*.webp
    ├── materials/     material_*.webp
    ├── projects/      project_*.webp
    ├── proposed/      meeting_room_a_proposed.webp
    └── _originals/    (git 제외) 생성된 원본 PNG 보관
```

- 파일명 = ASSET ID + 확장자
- 썸네일은 `<id>_thumb.webp`로 파이프라인이 자동 생성
- `_originals/`는 `.gitignore`에 넣고, 웹용 WebP만 커밋

---

## 8. 생성 후 진행 절차

1. 위 사양으로 이미지 생성 → `assets/_originals/`에 원본 저장
2. `python scripts/images/optimize_images.py` — 리사이즈 + WebP 변환 + 썸네일
3. `python scripts/images/validate_assets.py` — 해상도·용량·매니페스트 등록 검증
4. `assets/visual-assets.json` 매니페스트의 `status`가 `required` → `ready`로 전환
5. 앱이 자동으로 Placeholder 대신 실제 이미지를 사용

*(2~4번 스크립트는 아직 미구현 — 승인 후 작성)*
