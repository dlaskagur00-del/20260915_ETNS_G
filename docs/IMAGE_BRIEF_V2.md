# OFFICE HISTORY — 이미지 생성 요청서 V2

GPT 이미지 생성 도구에 **그대로 복사해서** 쓰는 문서입니다.
각 항목의 `PROMPT` 블록을 통째로 붙여넣으면 됩니다.

---

## ⚠️ 0. 모든 이미지에 반드시 적용 — 지난번 실패 원인

지난번 이미지는 **흰 여백 안에 피사체가 작게** 렌더되어 실제 내용이 240~450px밖에
되지 않았습니다. 발표 화면에서 3~4배 확대되어 흐리게 보입니다.

**모든 프롬프트 끝에 아래 문장을 반드시 붙이세요:**

```
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, no empty space around the subject,
high detail, sharp focus, 4k quality
```

**추가 공통 규칙**
- 이미지 안에 **글자 없음** (라벨·수치는 전부 웹에서 렌더)
- **사람 없음**, **브랜드 로고 없음**
- 색감: 화이트 · 라이트그레이 · 차콜 · 우드톤 (오렌지는 아주 적게)
- 공간 이미지 = **가로형(landscape)**, 제품 이미지 = **정사각(square)**

---

# 📦 A그룹 — 회의실 A 오브젝트 360° 턴테이블 (최우선)

공간을 클릭하면 확대되고, 그 안의 물건을 하나하나 클릭해서 **드래그로 360도 돌려보는**
기능에 쓰입니다. 이게 이번 요청의 핵심입니다.

## 프레임 수 선택 — 하나만 고르세요

| 방식 | 장수 | 회전 느낌 | 추천 |
|---|---|---|---|
| 8프레임 (45°씩) | 6종 × 8 = **48장** | 부드러움 | 시간 여유 있으면 |
| **4프레임 (90°씩)** | 6종 × 4 = **24장** | 툭툭 끊기지만 충분 | ✅ **권장** |
| 3뷰 (정면/측면/사선) | 6종 × 3 = 18장 | 회전 아님, 각도 전환 | 시간 없으면 |

> 4프레임을 권합니다. GPT가 8장 내내 같은 물체를 유지하기 어렵고,
> 어긋난 프레임이 하나라도 섞이면 회전이 튑니다.

## 생성 방법 — 반드시 한 대화에서 연속으로

1. 첫 프롬프트로 **0도(정면)** 를 만듭니다
2. 같은 대화에서 이어서: `"Same object, same lighting, same background. Rotate the camera 90 degrees clockwise around the object."`
3. 180도, 270도도 같은 방식으로 이어서 요청
4. **중간에 다른 물건을 만들지 마세요.** 한 물건을 끝내고 새 대화를 시작하세요

## 파일명 규칙

```
turntable_meeting_table_00.png   (0도 · 정면)
turntable_meeting_table_01.png   (90도)
turntable_meeting_table_02.png   (180도)
turntable_meeting_table_03.png   (270도)
```

8프레임이면 `_00` ~ `_07` 로 45도씩입니다.

---

### A-1. 회의 테이블 — `turntable_meeting_table_00 ~ 03`

```
PROMPT (0도)
Product render of a modern 2400mm conference table, light oak veneer top,
matte black steel column base, a recessed black cable port in the center of the top,
front view at slight eye level, pure white seamless studio background,
soft even studio lighting with a subtle contact shadow directly under the table,
no branding, no text, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, no empty space around the subject,
high detail, sharp focus, 4k quality
```

### A-2. 회의용 의자 — `turntable_meeting_chair_00 ~ 03`

```
PROMPT (0도)
Product render of a modern office conference chair, taupe leather ribbed seat and back,
polished chrome armrests, five-star polished aluminium base on black castors,
front view at slight eye level, pure white seamless studio background,
soft even studio lighting with a subtle contact shadow,
no branding, no text, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, no empty space around the subject,
high detail, sharp focus, 4k quality
```

### A-3. 75인치 디스플레이 — `turntable_display_75_00 ~ 03`

```
PROMPT (0도)
Product render of a 75-inch commercial wall-mounted display, screen powered off showing
plain dark glass, very thin black bezel, slim wall mount bracket visible at the back,
front view, pure white seamless studio background, soft even studio lighting,
no branding, no logo, no text on screen, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, no empty space around the subject,
high detail, sharp focus, 4k quality
```

### A-4. LED 라인 조명 — `turntable_led_light_00 ~ 03`

```
PROMPT (0도)
Product render of a suspended LED linear light fixture, slim matte black aluminium housing,
frosted diffuser strip glowing softly warm white, two thin black suspension cables,
front view, pure white seamless studio background, soft even studio lighting,
no branding, no text, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, no empty space around the subject,
high detail, sharp focus, 4k quality
```

### A-5. 유리 파티션 — `turntable_glass_partition_00 ~ 03`

```
PROMPT (0도)
Product render of a single tempered glass office partition module, clear glass panel
with a slim matte black aluminium frame, a frosted horizontal band across the lower third,
front view, pure white seamless studio background, soft even studio lighting,
no branding, no text, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, no empty space around the subject,
high detail, sharp focus, 4k quality
```

### A-6. 슬라이딩 도어 — `turntable_sliding_door_00 ~ 03`

```
PROMPT (0도)
Product render of a glass sliding office door, clear glass panel in a slim matte black frame,
black top sliding track rail, vertical black tubular pull handle,
front view, pure white seamless studio background, soft even studio lighting,
no branding, no text, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, no empty space around the subject,
high detail, sharp focus, 4k quality
```

---

# 🕰️ B그룹 — 오브젝트의 "변경 전" 모습 (히스토리 보강용)

현재 제품만 있고 이전 제품 이미지가 없어서, 타임라인이 "다 새것"처럼 보입니다.
**변경 전 이미지가 있어야 "무엇이 왜 바뀌었는지"가 눈으로 보입니다.**

각 1장씩, 정사각, 위 공통 규칙 동일 적용.

### B-1. `product_meeting_table_prev` — 2,000mm 목재 테이블 (2023년)

```
PROMPT
Product render of an older 2000mm conference table from around 2015,
dark walnut laminate top with visible scratches and worn edges,
simple silver metal legs, no cable port, slightly dated design,
front three-quarter view, pure white seamless studio background,
soft even studio lighting with a subtle contact shadow,
no branding, no text, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

### B-2. `product_meeting_chair_prev` — 구형 패브릭 의자

```
PROMPT
Product render of an older office meeting chair from around 2015,
dark grey worn fabric seat and back, black plastic armrests,
black nylon five-star base on castors, slightly dated and used looking,
front three-quarter view, pure white seamless studio background,
soft even studio lighting, no branding, no text, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

### B-3. `product_display_55_prev` — 55인치 구형 디스플레이

```
PROMPT
Product render of an older 55-inch wall-mounted display from around 2016,
screen powered off, noticeably thick black plastic bezel, dated proportions,
front view, pure white seamless studio background, soft even studio lighting,
no branding, no logo, no text on screen, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

### B-4. `product_fluorescent_light_prev` — 형광 평판 조명

```
PROMPT
Product render of an older recessed fluorescent ceiling panel light,
white steel frame with a milky yellowish acrylic diffuser, slightly dated office fixture,
front view, pure white seamless studio background, soft even studio lighting,
no branding, no text, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

### B-5. `product_drywall_partition_prev` — 석고 벽체

```
PROMPT
Product render of a plain painted drywall partition wall section,
off-white matte painted surface, simple white skirting at the bottom,
completely opaque, no glass, no window, plain and dated,
front view, pure white seamless studio background, soft even studio lighting,
no branding, no text, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

### B-6. `product_hinged_door_prev` — 여닫이 문

```
PROMPT
Product render of an older hinged office door, plain white painted wooden door leaf,
simple silver lever handle, white door frame, slightly dated,
front three-quarter view showing it partially open,
pure white seamless studio background, soft even studio lighting,
no branding, no text, no people,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

---

# 🏢 C그룹 — 공간 확대 뷰 (재생성 필요)

공간을 클릭하면 그 공간이 확대되고, 그 위에서 물건을 클릭합니다.
**지난번 이미지는 해상도가 부족해 전부 다시 만들어야 합니다.**

가로형(landscape), 위 공통 규칙 동일 적용.

## ⭐ C-1 ~ C-3. 회의실 A 3종 — 반드시 한 대화에서 연속으로

지난번 Current와 Proposed의 **카메라 앵글이 완전히 달라서** 같은 방으로 안 읽혔습니다.
이번엔 반드시 아래 순서를 지켜주세요.

**① `meeting_room_a_current` — 먼저 이것부터**

```
PROMPT
Interior render of a corporate meeting room for 12 people.
One long light oak conference table with a recessed cable port,
twelve taupe leather chairs with chrome bases,
a 75-inch black display mounted on the far beige wall,
two black linear LED pendant lights above the table,
a full-height glass partition wall with black frame on the right side,
grey carpet tile floor, a small plant in the corner,
soft daylight from the right, neutral light palette,
camera at eye level 1.5m high, standing in the doorway looking into the room,
three-quarter view showing the table diagonally,
photorealistic architectural interior render, no people, no text,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

**② `meeting_room_a_2023` — ①에 이어서 (같은 대화)**

```
PROMPT
Same room, exact same camera position, same camera angle, same focal length,
same lighting direction as the previous image. Do not move the camera.
Now show this room BEFORE its renovation in 2023:
the room is noticeably smaller and narrower,
an 8-person dark walnut table with eight grey fabric chairs,
a smaller 55-inch display with a thick bezel,
flat fluorescent ceiling panel lights instead of the linear LED pendants,
a plain painted drywall wall instead of the glass partition,
a plain hinged white door instead of sliding, same grey carpet floor.
Slightly older and more worn atmosphere.
No people, no text, full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

**③ `meeting_room_a_proposed` — ①에 이어서 (같은 대화)**

```
PROMPT
Same room as the first image, exact same camera position, same camera angle,
same focal length, same lighting as the first image. Do not move the camera.
Now the single large room is divided into TWO smaller meeting rooms
by a new full-height glass partition running through the middle of the room.
Each half contains its own 6-person light oak table with six taupe leather chairs
and its own wall-mounted display.
Same ceiling lights, same carpet floor, same wall finishes as the first image.
The viewer is still standing in the same doorway looking in.
No people, no text, full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

## C-4 ~ C-8. 나머지 공간 5종

각각 별도 대화에서 만드셔도 됩니다. 모두 눈높이 3/4 뷰, 가로형.

**`lounge_current` — 라운지**
```
PROMPT
Interior render of a modern office lounge, two light grey fabric sofas facing each other
across a low oak coffee table on a soft beige rug, a black pendant linear light above,
warm oak plank flooring, a large window with soft daylight on the left,
two tall plants, a coffee counter along the back wall,
camera at eye level, three-quarter view, photorealistic architectural interior render,
no people, no text, full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

**`open_desk_a_current` — Open Desk A**
```
PROMPT
Interior render of an open-plan office work area, four rows of bench desks
with light oak tops and matte black frames, grey mesh task chairs,
low grey fabric partitions between facing desks, black linear LED lights above each row,
grey vinyl tile floor, plants at the end of the rows, large windows with soft daylight,
camera at eye level, three-quarter view down the aisle,
photorealistic architectural interior render, no people, no text,
full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

**`focus_zone_current` — 집중업무존**
```
PROMPT
Interior render of a focus work zone in a modern office,
six individual single-person desks separated by tall dark grey felt acoustic partitions,
each desk with a small black task lamp and a grey task chair,
grey carpet floor, quiet neutral palette, soft even ceiling lighting,
camera at eye level, three-quarter view, photorealistic architectural interior render,
no people, no text, full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

**`reception_current` — 리셉션**
```
PROMPT
Interior render of a corporate office reception area,
a long light oak reception counter with a dark stone top,
two grey fabric waiting sofas to the side with a low table,
a plain beige feature wall behind the counter with no logo and no text,
large plants, polished light concrete floor, bright soft daylight from tall windows,
camera at eye level, three-quarter view, photorealistic architectural interior render,
no people, no text, full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

**`rest_area_current` — 휴게공간**
```
PROMPT
Interior render of an office break and rest area,
three round light oak tables with grey chairs, one tall bar table with three stools,
warm black pendant lights above, oak plank floor, plants near a large window,
a small pantry counter along one wall, relaxed neutral palette, warm soft lighting,
camera at eye level, three-quarter view, photorealistic architectural interior render,
no people, no text, full frame composition, subject fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

## C-9. 오피스 전경 — `office_isometric_main` (재생성)

```
PROMPT
Isometric 3D cutaway illustration of a modern corporate office floor,
single level with no ceiling so the interior is fully visible,
light neutral palette with warm oak furniture and light grey floors,
four glass-partitioned meeting rooms along the top,
two large open desk clusters in the middle,
a lounge with sofas, a reception counter with a waiting area,
a row of focus booths, several plants,
clean architectural 3D render, soft even lighting, plain white background,
no people, no text,
full frame composition, the office floor fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

## C-10. 평면도 — `floor_plan_main` (재생성)

```
PROMPT
Clean architectural floor plan of a modern office floor, top-down orthographic view,
thin mid-grey line work on white background, rooms clearly enclosed by walls,
furniture drawn as very light plan symbols, doors shown with swing arcs,
no dimensions, no text labels, no room names, no color fills,
professional CAD drawing style,
full frame composition, the floor plan fills the entire frame edge to edge,
no white margins, no border, no padding, high detail, sharp focus, 4k quality
```

---

# 📁 파일 정리

전부 한 폴더에 넣고 경로만 알려주시면 됩니다.

```
C:\Users\etners\Desktop\이미지2\
```

**파일명은 위에 적힌 ID 그대로** 써주세요. 확장자는 `.png` / `.jpg` 아무거나 괜찮습니다.

---

# 📊 총 장수

| 그룹 | 내용 | 장수 |
|---|---|---|
| A | 오브젝트 360° 턴테이블 (4프레임 기준) | **24** |
| B | 오브젝트 변경 전 | **6** |
| C | 공간 확대 뷰 + 오피스 + 평면도 | **10** |
| | **합계** | **40** |

## 시간이 부족하면 이 순서로

1. **C-1 ~ C-3** 회의실 A 3종 (3장) — 데모의 핵심
2. **A-1, A-2** 테이블·의자 턴테이블 (8장) — 360도 기능 시연
3. **B-1, B-2** 테이블·의자 변경 전 (2장) — 히스토리 설득력
4. **C-9** 오피스 전경 (1장) — 첫인상

**이 14장만 있어도 발표는 충분합니다.**
