# OFFICE HISTORY — 인수인계

> 다른 AI 에이전트나 개발자가 이 문서만 읽고 작업을 이어갈 수 있도록 쓴 문서입니다.
> 마지막 갱신: 2026-09-17

---

## 0. 30초 요약

ETNERS 사무환경팀의 **공간 이력 관리 시스템** 프로토타입입니다. 발표·시연용이며,
빌드 도구 없이 순수 ES 모듈로 만들어졌습니다.

| | |
|---|---|
| 배포 주소 | https://20260915etnes.vercel.app |
| GitHub | https://github.com/dlaskagur00-del/20260915_ETNS_G |
| 로컬 경로 | `C:\Users\etners\Desktop\etns_vibe\OFFICE_HISTORY` |
| 상태 | **완성. 시연 가능.** Supabase 연결만 남음 |
| 커밋 | 28개 |

```bash
# 개발 서버 (일반 http.server 쓰면 ES 모듈이 캐시돼서 수정이 안 보입니다)
python scripts/dev_server.py 5173
```

---

## 1. 이 제품이 무엇인가

> **공간 구성 History** (무엇이·언제·왜 바뀌었나)
> **＋ 공간 이용 History** (얼마나·어떻게 쓰였나)
> **＝ OFFICE HISTORY**

### 절대 원칙 (요청자가 명시한 것, 바꾸지 말 것)

1. **HISTORY > AI** — AI는 거들 뿐. 주인공은 축적된 기록
2. **공간이 주인공** — 사람·조직이 아니라 공간 단위로 모든 것이 기록됨
3. **"정보는 많지만 한 번에 보이는 정보는 적게"**
4. **두 History의 연결이 제품의 정체성** — 따로 놀면 의미 없음
5. **AI가 제안하고 사람이 결정한다** — 결정 권한은 담당자에게

### 핵심 서사 (시연의 축)

회의실 A를 2024년에 8인 → 12인으로 확장했습니다(2,460만원).
**이용률은 65% → 66%.** 규모가 부족했던 게 아니었습니다.
기록이 없으면 절대 알 수 없는 사실이고, AI가 "넓히지 말고 나누자"고
추천하는 근거입니다.

---

## 2. 기술 구조

### 의도적으로 하지 않은 것 — 되돌리지 마세요

- **빌드 도구 없음.** Node.js 미설치. npm, TypeScript, React 전부 없음
- **프레임워크 없음.** 순수 ES 모듈 + 바닐라 JS
- **SDK 없음.** Supabase도 `fetch` 로 REST 직접 호출

이건 제약이 아니라 선택입니다. 발표장에서 빌드가 깨질 일이 없고,
파일을 열면 바로 코드가 보입니다.

### 3계층 분리 (반드시 지킬 것)

```
src/data/   ← 원천 데이터. 화면이 여기를 직접 import 하면 안 됩니다
src/api/    ← 데이터 접근 계층. 화면은 여기만 씁니다
src/pages/  ← 화면
```

### 폴더

```
src/
  main.js              진입점. render() 에 실패 방어가 들어 있습니다
  store/selection.js   전역 상태는 "지금 무엇을 보고 있는가" 하나뿐
  lib/                 dom, router, format, iso, furniture
  api/                 spaces, history, usage, insight, project, vendors, assets, supabase
  data/                office, changes, usage, insights, projects, vendors, assets,
                       officeHotspots, objectHotspots, visualAssets, supabaseConfig
  pages/               dashboard, configuration, usage, insight, project
  components/
    office/            spaceScene(SVG), visualStage(이미지+핫스팟), turntable(360도)
    history/           timeline, detail
    usage/             usageLog, changeImpact
    insight/           proposal, aiLens
    charts/            lineChart, barChart
    layout/            appShell
    ui/                assetImage
assets/
  visual-assets.json   Asset 매니페스트 (단일 원천)
  office/ floorplans/ products/ materials/ projects/ proposed/ fonts/
  _originals/          PNG 원본 (파이프라인 입력)
  _originals/_raw/     정리 전 보관본
scripts/
  dev_server.py                   캐시 없는 정적 서버
  images/process_assets.py        PNG → WebP + 썸네일 + 매니페스트 갱신
  images/clean_product_shots.py   제품 컷에서 파일명·여백 잘라내기
  fonts/subset_fonts.py           프리텐다드 서브셋
  supabase/build_setup_sql.py     매니페스트 → setup.sql
docs/                             원본 요청서 3종 + 이미지 요청서 V2·V3
supabase/setup.sql                테이블 + RLS + Asset 68건 (자동 생성)
```

---

## 3. 현재 상태

### 완성된 것

| | |
|---|---|
| Visual Asset | **68 / 68 ready.** placeholder 0건 |
| 변경 이력 | 40건 (회의실 A 13 · 라운지 6 · 집중업무존 A 6 · 나머지 각 1) |
| AI Insight | 4건 (회의실 A · 라운지 · 집중업무존 A · 회의실 E) |
| 손으로 쓴 구성 요소 | 회의실 A · 라운지 · 집중업무존 A (나머지는 템플릿 생성) |
| 오브젝트 핫스팟 | 3세트 20개 (회의실 A 8 · 라운지 6 · 집중업무존 A 6) |
| 360도 턴테이블 | 6세트 24프레임 (전부 회의실 A 오브젝트) |
| 폰트 | 프리텐다드 서브셋 자체 호스팅. **외부 요청 0건** |

### 남은 것 — Supabase 연결

**대시보드 작업이라 코드로 대신할 수 없습니다.**

1. **SQL 실행** — 대시보드 → SQL Editor → `supabase/setup.sql` 전체 붙여넣고 Run
   확인: `select count(*) from public.visual_assets;` → **68**
2. **버킷 생성** — Storage → New bucket → 이름 `office-history-assets` → **Public 켜기**
3. **파일 업로드** — `assets/` 아래 6개 폴더를 통째로 드래그 (136개 파일, 6.7MB)
   `scripts/supabase/` 로 업로드용 폴더를 다시 만들 수 있습니다
4. **키 입력** — `src/data/supabaseConfig.js` 의 `url`, `anonKey`

> ⚠️ **`service_role` 키는 절대 넣지 마세요.** 프런트엔드 파일이라 공개됩니다.
> `anon` 키는 애초에 공개용이고, SQL 에 읽기 전용 RLS 를 걸어두었습니다.

**연결 전에 알아둘 것:** 연결하면 앱이 이미지를 로컬이 아니라 Supabase 에서
읽습니다. 136개 중 하나라도 빠지면 그 이미지가 깨집니다. 또 시작할 때
Supabase 를 먼저 조회하고 실패하면 4초 후 로컬로 넘어갑니다.
**시연이 급하면 연결하지 않는 편이 안전합니다** — 지금도 완전히 동작합니다.

---

## 4. 절대 되돌리면 안 되는 것

### 4-1. 데모 숫자 보정값

`src/data/usage.js` 의 `REGIME` 이 **63.9 / 65.5** 로 되어 있습니다.
얼핏 65 / 66 이어야 할 것 같지만, 노이즈 오프셋을 거치면 화면에
**65.0% → 66.0%** 로 나오도록 맞춰둔 값입니다. "고치면" 시연 숫자가 깨집니다.

### 4-2. 핫스팟 좌표는 손으로 잰 값

`officeHotspots.js`(12개), `objectHotspots.js`(20개) 는 이미지 위 백분율
좌표입니다. **이미지를 교체하면 전부 다시 재야 합니다.** 자동화 방법 없습니다.

### 4-3. `.visual-stage` 의 `display: inline-block`

이미지를 정확히 감싸야 백분율 핫스팟이 맞습니다. `overflow:hidden` 이나
`object-fit` 을 넣으면 이미지가 잘리면서 핫스팟이 전부 어긋납니다.

### 4-4. 한글 폰트 서브셋

**UI 에 새 한글 문구를 넣으면 반드시 재생성해야 합니다.**
안 하면 그 글자가 화면에서 빈칸으로 나옵니다.

```bash
python scripts/fonts/subset_fonts.py
```

### 4-5. `scripts/` 위치

`dev_server.py` 가 저장소 루트에 있으면 **Vercel 이 Flask 프로젝트로 오인**해
배포가 실패합니다. `scripts/` 안에 있어야 합니다.
`vercel.json` 의 `framework: null`, `outputDirectory: "."` 도 같은 이유입니다.

---

## 5. 이미지 파이프라인

```bash
# 1) PNG 를 assets/_originals/ 에 넣는다 (파일명 = Asset ID)
# 2) 제품 컷이면 파일명·여백 정리
python scripts/images/clean_product_shots.py --apply
# 3) WebP 변환 + 썸네일 + 매니페스트 갱신
python scripts/images/process_assets.py
```

### 파이프라인이 걸러내는 것

| 검사 | 기준 |
|---|---|
| 사실상 빈 이미지 | 내용이 프레임의 30% 미만이면 **실패** |
| 피사체가 작음 | 60% 미만이면 경고 |
| 해상도 부족 | 타입별 최소 폭 미달이면 실패 |

### 실제로 겪은 함정 — 같은 실수 반복하지 마세요

1. **흰 캔버스에 파일명이 찍힌 이미지** 6장이 화면까지 올라갔습니다.
   `material`·`product` 은 여백 제거 대상이 아니라 검사를 안 거쳤습니다
2. **두 그림이 한 캔버스에 나란히** 붙은 이미지 2장. 여백 검사가 못 잡습니다 —
   붙어 있던 게 흰 여백이 아니라 다른 그림이라 "100% 채움"으로 계산됐습니다.
   **세로로 완전히 흰 줄이 안쪽에 있는지**로 따로 검사해야 찾습니다
3. **정리 스크립트가 멱등하지 않았습니다.** 두 번 돌리면 여백이 더 깎였습니다.
   지금은 항상 `_raw/` 원본에서 출발합니다
4. **파일명이 그대로라 브라우저가 옛 이미지를 계속 썼습니다.**
   지금은 `?v=<generatedAt>` 을 붙여 캐시를 끊습니다

### 이미지 생성 시 반드시 넣을 문구

GPT 이미지 출력 상한은 **가로 1536px** 입니다. "4K" 같은 말은 효과 없습니다.
대신 아래 문구가 결정적입니다 — 이게 없으면 흐릿하게 나옵니다.

```
Sharp focus across the entire frame, no depth-of-field blur, no soft glow,
no painterly or rendered look, no CGI smoothness.
Full frame composition, fills the entire frame edge to edge,
no white margins, no border, no padding.
```

실제로 이 문구 하나로 공간 이미지 13장의 선명도가 **3.4 → 18.8 (5.5배)**
올랐습니다.

---

## 6. 화질에 대해 (측정 결과)

- 원본 1536px, 화면 표시 1180px (1920 기준) → **업스케일 아님**
- 턴테이블·제품·마감재는 화면에서 34~356px 로 작게 표시됨
  → **다시 뽑아도 차이가 안 보입니다.** 공간 이미지만 신경 쓰면 됩니다
- 확대(`⤢ 크게 보기`)하면 1440px 까지 커지지만 여전히 원본 이내
- **AI 업스케일은 권하지 않습니다.** 없는 디테일을 지어내서 인테리어에서는
  나뭇결이 이상한 패턴으로 바뀝니다

---

## 7. 시연 영상

`C:\Users\etners\Desktop\OFFICE_HISTORY_시연영상.mp4` (3분 05초, 1920×1080)

ffmpeg 으로 편집했습니다. 편집 명세와 스크립트는 세션 작업 폴더에 있습니다
(`edit_spec.py`, `make_video2.py`). 다시 만들려면 원본 녹화본이 필요합니다.

**편집에서 배운 것**

- **자막은 반드시 한 줄.** 두 줄로 쓰면 아래 줄이 화면 밖으로 잘립니다.
  길면 두 개로 나눠 차례로 띄웁니다
- `drawtext` 는 `%` 를 서식 문자로 해석합니다. `65%` 같은 숫자가 들어가면
  오류가 나므로 텍스트를 파일로 넘겨야 합니다
- 구간을 통째로 지우면 화면이 튑니다. **1초 빨리감기로 압축**하면 자연스럽습니다
- 화면 녹화는 **1.2배까지** 자연스럽습니다. 그 이상은 커서가 미끄러져 보입니다

---

## 8. 알려진 한계

| | |
|---|---|
| 클릭 가능한 공간 | 오피스 맵 5개 · 평면도 7개 (전체 24개 중) |
| 깊이가 있는 공간 | 3개 (회의실 A · 라운지 · 집중업무존 A). 나머지는 변경 1건 |
| 360도 회전 | 회의실 A 오브젝트 6개만 |
| 로그인 | 없음. 데이터가 전부 정적으로 노출됨 (전부 `* Demo Data`) |
| 오프라인 | Service Worker 없음. 단 폰트·이미지가 전부 자체 호스팅이라 강한 편 |

**로그인을 붙인다면** — 지금 구조에서는 화면 앞에 문을 다는 것과 데이터를
잠그는 것이 별개입니다. `/src/data/changes.js` 를 주소창에 직접 치면 다 보입니다.
발표용이라면 브라우저 안에서 판정하는 방식이 안전합니다(네트워크가 끊겨도 진입 가능).
실제 접근 제어가 필요해지면 데이터를 Supabase 로 옮기고 RLS 를 걸어야 합니다.

**AutoCAD 연동을 묻는다면** — Autodesk Platform Services 의 Viewer SDK 로 가능합니다.
다만 DWG → SVF 변환(Model Derivative, 유료), 서버에서 토큰 발급(현재 서버 없음),
상시 네트워크가 필요합니다. 도면 정확도만 필요하면 **AutoCAD 에서 PDF·이미지로
내보내 지금 평면도 자리에 넣으면** 대부분의 이득을 얻습니다.

---

## 9. 자주 하게 될 작업

```bash
# 개발 서버 (캐시 없음 — 일반 http.server 쓰지 말 것)
python scripts/dev_server.py 5173

# 새 이미지 반영
python scripts/images/clean_product_shots.py --apply   # 제품 컷일 때만
python scripts/images/process_assets.py

# UI 에 한글 문구를 추가한 뒤 (안 하면 글자가 빈칸으로 나옴)
python scripts/fonts/subset_fonts.py

# Asset 이 늘었을 때 Supabase SQL 다시 만들기
python scripts/supabase/build_setup_sql.py

# 배포 (Vercel 이 자동으로 받습니다)
git add -A && git commit -m "..." && git push
```

> 이 PC 에서 `python` 은 Pillow 가 없는 3.12 를 가리킵니다.
> 파이프라인은 **3.13** 으로 실행해야 합니다:
> `C:\Users\etners\AppData\Local\Programs\Python\Python313\python.exe`

---

## 10. 요청자에 대해

- 발표자는 ETNERS 인턴 **임남혁**. 발표 10분, PPT 7분, 영상 3분 예정
- 이미지는 전부 GPT 로 직접 생성해 옵니다. **프롬프트를 복사·붙여넣기 할 수 있게**
  주면 가장 잘 진행됩니다. 파일명을 지정해 주는 것이 중요합니다
- 완료 보고는 **짧게** 원합니다:
  `완료 / 수정: [파일] / 핵심: [3~6개] / 검증: [결과] / 남은 문제: [없음 또는 항목]`
- **자격 증명은 직접 다루지 않습니다.** 비밀번호·연결 문자열은 사용자가 직접
  입력합니다. `anon` 키만 파일에 들어갑니다

---

## 11. 원본 요청서

`docs/` 에 요청자가 준 원본이 그대로 있습니다. 판단이 갈릴 때 여기가 기준입니다.

| 파일 | 내용 |
|---|---|
| `01_개발요청서.md` | 기능 명세 26개 절 |
| `02_개념설명서.md` | 제품 철학 28개 절 — **가장 중요** |
| `03_시각자료요청서.md` | 시각 자산 기준 44개 절 |
| `IMAGE_BRIEF_V2.md` | 40장 요청서 (완료) |
| `IMAGE_BRIEF_V3.md` | 마감 9장 요청서 (완료) |
