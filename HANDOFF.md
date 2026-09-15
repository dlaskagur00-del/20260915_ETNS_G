# OFFICE HISTORY — 인수인계 문서

> 다른 AI 에이전트 환경에서 이 프로젝트를 이어받기 위한 문서입니다.
> **작업을 시작하기 전에 이 문서를 끝까지 읽어주세요.** 특히 6장(이미 내린 결정)은
> 모르고 건드리면 되돌리게 되는 내용입니다.

- 최종 갱신: 2026-09-15
- 작업 폴더: `C:\Users\etners\Desktop\etns_vibe\OFFICE_HISTORY`
- 배포: https://20260915etnes.vercel.app
- GitHub: https://github.com/dlaskagur00-del/20260915_ETNS_G

---

## 1. 이 프로젝트가 무엇인가

**OFFICE HISTORY** — 사무실의 공간 변화 이력과 실제 이용 이력을 한곳에 축적하고
**서로 연결**해서, 다음 공간 의사결정의 근거로 만드는 웹 서비스입니다.

이트너스 인턴(임남혁)의 **발표용 인터랙티브 프로토타입**입니다. 실제 서비스가 아니라
발표에서 직접 클릭하며 시연하는 것이 목적입니다.

### 핵심 공식

```
공간 구성 History          공간 이용 History
"무엇이·언제·왜 바뀌었나"  +  "얼마나·어떻게 쓰였나"   =   OFFICE HISTORY
```

### 절대 잊으면 안 되는 원칙

1. **HISTORY > AI** — AI Insight는 축적된 기록을 해석하는 보조 기능입니다.
   AI가 화면의 주인공이 되면 제품의 메시지가 무너집니다.
2. **공간이 주인공** — 모든 화면은 카드나 숫자가 아니라 공간(아이소메트릭 · Floor Map)에서
   시작하고, 숫자는 공간을 선택한 결과로 따라옵니다.
3. **정보는 많지만 한 번에 보이는 정보는 적게** — 기본은 최근 이력 1~2건만,
   전체는 사용자가 펼쳤을 때.
4. **두 History의 연결이 제품의 정체성** — 각각 잘 만드는 것만으로는 부족합니다.
   "바꿨는데 실제로 달라졌나?"에 답하는 것이 핵심입니다.
5. 일반적인 자산관리 시스템(현재 무엇이 있는가)도, 이용률 대시보드(지금 얼마나 쓰나)도
   아닙니다. **"왜 그렇게 되었나"와 "그 결과 무엇이 달라졌나"**가 핵심입니다.

### 서비스 메시지

- "사무환경의 경험을 일회성 업무가 아닌, 다음 판단을 위한 데이터로."
- 궁극 철학: **"개인의 센스를 조직의 데이터로."** (사이드바 하단에 상시 노출)

---

## 2. 기술 스택 — 여기가 가장 중요합니다

### ⚠️ 이 프로젝트에는 Node.js도 빌드 도구도 없습니다

```
프레임워크   없음 — 순수 ES 모듈 + 바닐라 JS
빌드         없음 — 소스를 그대로 브라우저가 실행
패키지       package.json 없음, node_modules 없음
타입         TypeScript 아님 (JSDoc 주석으로 형태 설명)
서버         Python 정적 서버 (scripts/dev_server.py)
```

**이유**: 작업 PC에 Node.js가 설치되어 있지 않았고, 발표가 임박해서 툴체인 설치로
시간을 쓰는 대신 빌드 리스크 0인 구조를 선택했습니다.

👉 **다음 에이전트에게**: `npm install`, React 도입, Vite 설정 등을 제안하지 마세요.
사용자가 명시적으로 요청하지 않는 한 현재 구조를 유지해야 합니다.
React로 옮기기 쉽도록 컴포넌트·데이터 계층은 이미 분리해 두었습니다.

### 실행 방법

```bash
cd "C:\Users\etners\Desktop\etns_vibe\OFFICE_HISTORY"
python scripts/dev_server.py 5173
# → http://localhost:5173
```

`scripts/dev_server.py`는 `Cache-Control: no-store`를 보냅니다. 일반
`python -m http.server`를 쓰면 ES 모듈이 캐시되어 **수정이 반영되지 않습니다.**

### Python 환경

- 기본 `python` = **3.13.13** (Pillow 11.3.0, fonttools 4.59.0, brotli 설치됨)
- `py -3.12` = 3.12.5 (Pillow 없음)
- 스크립트는 3.12/3.13 양쪽 호환으로 작성되어 있습니다

---

## 3. 아키텍처

### 3계층 분리 (반드시 지킬 것)

```
src/data/    ← Demo Data 원본. 여기만 실제 데이터를 가짐
    ↓
src/api/     ← 데이터 접근 계층. 나중에 실제 API로 교체할 지점
    ↓
src/pages/   ← 화면. data/를 직접 import하면 안 됨 (반드시 api/ 경유)
```

### 폴더 구조

```
OFFICE_HISTORY/
├── index.html                  진입점
├── vercel.json                 정적 사이트 배포 설정
├── HANDOFF.md                  ← 이 문서
├── VISUAL_ASSET_REQUIREMENTS.md  필요한 이미지 28종 사양서 (프롬프트 포함)
│
├── styles/
│   ├── fonts.css               Pretendard @font-face (로컬 번들)
│   ├── tokens.css              색·폰트·간격 토큰
│   ├── base.css                리셋 + 기본 타이포
│   ├── layout.css              앱 셸 · 사이드바 · 그리드
│   └── components.css          모든 컴포넌트 스타일
│
├── src/
│   ├── main.js                 부트스트랩 (매니페스트 로드 → 렌더)
│   ├── store/selection.js      전역 상태 (선택 공간 등) — 유일한 전역
│   ├── lib/
│   │   ├── dom.js              el() / svg() / panel() 등 DOM 헬퍼
│   │   ├── iso.js              평면 좌표 → 아이소메트릭 투영
│   │   ├── furniture.js        공간 타입 → 가구 배치 자동 생성
│   │   ├── router.js           해시 라우팅 + URL에 선택 공간 반영
│   │   └── format.js           날짜·금액·퍼센트 포맷
│   ├── data/                   office, assets, changes, usage, insights,
│   │                           projects, vendors, visualAssets, supabaseConfig
│   ├── api/                    spaces, history, usage, insight, project,
│   │                           vendors, assets, supabase
│   ├── components/
│   │   ├── layout/appShell.js      사이드바 · 상단바 · Context Bar
│   │   ├── office/spaceScene.js    ★ 아이소메트릭/평면도 단일 렌더러
│   │   ├── history/{timeline,detail}.js
│   │   ├── usage/{changeImpact,usageLog}.js
│   │   ├── insight/proposal.js
│   │   ├── charts/{lineChart,barChart}.js
│   │   └── ui/assetImage.js        이미지 · 스켈레톤 · Placeholder
│   └── pages/                  dashboard, configuration, usage, insight, project
│
├── assets/
│   ├── visual-assets.json      Asset 매니페스트 (28종, status: ready|required)
│   ├── fonts/                  Pretendard 서브셋 woff2 5종 (1.67MB)
│   ├── products/ materials/ office/ floorplans/ projects/ proposed/
│   └── _originals/             생성 원본 (git 제외)
│
├── scripts/
│   ├── dev_server.py           no-cache 정적 서버
│   ├── images/process_assets.py    원본 → WebP + 썸네일 + 매니페스트 갱신
│   ├── fonts/subset_fonts.py       Pretendard 서브셋 재생성
│   └── supabase/generate_seed.py   매니페스트 → seed.sql
│
└── supabase/
    ├── schema.sql              visual_assets 테이블 + RLS
    └── seed.sql                28건 메타데이터 (자동 생성됨)
```

### 핵심 설계 — `spaceScene.js` 하나가 모든 공간을 그립니다

공간은 **평면 사각형(미터 단위)으로 한 번만 정의**되고, 같은 렌더러가 세 가지 뷰를 만듭니다.

| mode | 쓰이는 곳 | 특징 |
|---|---|---|
| `iso` | Dashboard, 공간 구성 History | 가구 자동 배치, 선택 공간이 떠오름 |
| `plan` | 공간 이용 History | 히트맵 색칠, 라벨에 이용률 |
| `iso` + `boundsFrom` | AI 제안, Project Before/After | **viewBox 공유 → 카메라 앵글 구조적 동일** |

`boundsFrom`이 핵심입니다. Current/Proposed 두 씬이 같은 viewBox를 쓰기 때문에
"같은 앵글"이 눈대중이 아니라 **구조적으로 보장**됩니다.

### 상태 관리

`src/store/selection.js`의 전역 상태는 **"지금 무엇을 보고 있는가" 하나뿐**입니다.
서버 데이터는 전역에 두지 않습니다.

- `selectedSpaceId`는 **모든 화면이 공유**합니다. 화면을 옮겨도 유지되는 것이
  데모 시나리오가 끊기지 않는 핵심 장치입니다.
- URL에 반영됩니다 (`#/configuration?space=mr-a`) — 발표 중 새로고침해도 복구됩니다.
- 공간을 바꾸면 하위 선택(asset · change · insight)은 초기화됩니다.

---

## 4. 구현 완료 상태

### 화면 5종 — 전부 동작

| 화면 | 내용 |
|---|---|
| **Dashboard** | 공간 수 타일(24/8/10/6), 아이소메트릭 오피스 24개 공간, 최근 History 4건, 이번 달 이용률 |
| **공간 구성 History** | 공간 선택 → 구성요소(Furniture/Finish/Facility) → 상세(제품 이미지·이전 제품·교체 사유·특이사항) → Timeline → **과거 시점 재구성** |
| **공간 이용 History** | Floor Map 히트맵, 이용률 추이 + **변경 마커**, Day/Week/Month 필터, 이용 로그, 시간대/요일 패턴, 데이터 출처 |
| **AI Insight** | 분석 근거(Evidence) 출처별 노출, 개선안 2건, Current/Proposed 동일 앵글 비교, 예상 비용 + 항목별 내역 + 추천 시공사 |
| **Project Asset** | 완료 프로젝트 6건, Before/After, 결과 기록, **업체 History**, 연결된 기록 역추적 |

### 특히 공들인 두 기능

**① 두 History의 연결 (제품의 차별점)**
이용률 추이 라인차트 위에 **공간 변경 시점이 세로 마커**로 찍히고, 클릭하면
변경 전후 비교 패널이 열립니다. 수치는 하드코딩이 아니라 **월별 데이터에서 계산**됩니다.

**② 과거 시점 재구성**
Timeline에서 "2023.03 최초 구축"을 클릭하면 맵에서 **회의실 A가 8인 / 63㎡로 실제로
줄어들고**, 구성 요소도 당시 제품으로 전부 바뀝니다 (`getSpaceStateAt()`이 타임라인을
접어서 계산). "과거에는 무엇이 있었는가"를 눈으로 보여주는 장치입니다.

---

## 5. 데모 시나리오 — 이 숫자들은 절대 바꾸지 마세요

발표 대본에 그대로 인용되는 수치입니다. **데이터를 수정할 때 이 값이 유지되는지
반드시 확인하세요.**

| 항목 | 값 | 나오는 곳 |
|---|---|---|
| 회의실 A 현재 이용률 | **72%** | 이용 History 지표 |
| 평균 이용 인원 | **4.2명** | 이용 History 지표 |
| 평균 체류 시간 | **48분** | 이용 History 지표 |
| Peak Time | **14:00~16:00** | 이용 History 지표 |
| 최근 6개월 추이 | **64 / 67 / 71 / 69 / 74 / 72** | 이용률 추이 차트 |
| 확장 전후 이용률 | **65.0% → 66.0%** | 변경 전후 비교 |
| 확장 전후 평균 인원 | **4.1명 → 4.3명** | 변경 전후 비교 |
| 4~6인 회의 비중 | **78%** | AI Insight 근거 |
| 예상 비용 | **2,800~3,200만원** (평균 3,050만원) | AI Insight |
| 항목별 내역 합계 | **₩30,000,000** | AI Insight |
| 집중업무존 개선 결과 | **+18%p** | Project Asset |
| Dashboard 이용률 | 전체 72 / 회의실 68 / 업무 81 / 공용 54 | Dashboard |

**이 수치들이 유지되는 원리**

- `src/data/usage.js`의 `PROFILES`가 공간별 현재 지표를 정의합니다.
  그룹 평균이 정확히 68/81/54가 되도록, 전체는 면적 가중 평균이 72가 되도록 맞춰져 있습니다.
- `PINNED`가 회의실 A의 최근 6개월을 고정합니다.
- `REGIME`이 2024-01 확장 전후 수준을 정의하고, 노이즈까지 감안해
  **63.9 / 65.5로 보정**되어 있습니다 (계산 결과가 65.0 / 66.0으로 나오게).
  이 숫자를 "이상해 보인다"고 65/66으로 되돌리면 화면 값이 66.1/66.5로 틀어집니다.
- 이용 데이터는 **시드 고정 난수**라 새로고침해도 값이 변하지 않습니다.

### 발표 흐름 (14단계)

```
Dashboard → 회의실 A 클릭 → (자동) 구성 History
  → Timeline에서 변경 이력 확인 → "이 변경의 이용 데이터 비교" 클릭
  → 이용 History (공간 선택 유지) → 6개월 추이 · 지표 확인
  → 변경 전후 비교 (65%→66%, 4.1→4.3명)
  → Context Bar에서 AI Insight → 근거 · 개선안 확인
  → Current/Proposed 동일 앵글 비교 → 예상 비용 · 추천 시공사
  → Project Asset → 회의실 A 확장 프로젝트 결과 기록
```

각 화면에 **다음 단계로 넘어가는 버튼**이 배치되어 있어 사이드바를 찾지 않아도 됩니다.

---

## 6. 이미 내린 결정 — 모르고 되돌리지 마세요

### 🔴 아이소메트릭 오피스를 SVG로 그리는 것은 의도된 선택입니다

사용자가 나중에 준 「시각자료 요청서」 §2는 *"단순 SVG 도형으로 제품 표현 금지"*라고
합니다. 현재 구현은 그 규칙과 충돌합니다. **하지만 현행 유지가 합의된 결론입니다.**

이유:
- AI 생성 오피스 이미지는 여기서 정의한 24개 공간 구성과 절대 일치하지 않습니다.
  교체하면 hotspot 24개를 손으로 재측정하고 히트맵·과거시점·제안 비교의 좌표계까지
  다시 맞춰야 합니다 (반나절 이상).
- 이미지로 바꾸면 **과거 시점 재구성**과 **Current/Proposed 동일 앵글 보장**이 사라집니다.
- 현재 SVG는 가구가 배치된 디지털 트윈 도식으로 읽히지, 저품질 placeholder가 아닙니다.

👉 **대신 제품·마감재 이미지를 채우는 것이 우선순위**입니다 (체감 효과가 더 큼).

### 🔴 폰트는 Pretendard 한 벌만, CDN 금지

- 발표장 네트워크가 끊겨도 동일하게 보여야 해서 **외부 요청 0건**으로 만들었습니다.
- mono 폰트(IBM Plex Mono)를 쓰다가 **한글이 섞인 라벨에서 폰트가 바뀌어 보이는 문제**가
  있어 제거했습니다. 숫자 정렬은 `font-variant-numeric: tabular-nums`로 해결합니다.
- **Regular(400) 파일이 없습니다.** CSS 매칭 규칙상 400 요청은 자동으로 Medium(500)으로
  떨어집니다. 프로젝터에서는 오히려 또렷해서 그대로 두기로 했습니다.
- 화면에 **새로운 한글을 추가하면** `python scripts/fonts/subset_fonts.py`를 다시 돌려야
  합니다 (서브셋에 없는 글자는 안 보입니다). 상용 음절은 대부분 포함되어 있어
  웬만한 문구 수정은 괜찮습니다.

### 🟡 요구사항 문서 간 충돌을 이렇게 정리했습니다

원본 요청서에 서로 모순되는 내용이 있어 다음과 같이 통일했습니다.

| 충돌 | 결정 |
|---|---|
| 회의실 A 확장 시점이 2024.01과 2026.06으로 다르게 적힘 | **2024.01 확장**으로 통일. 그래야 "확장 후 2년이 지나도 여전히 4.2명"이라는 서사가 성립하고 6개월 추이와도 충돌하지 않음. 2026.06은 조명 교체 |
| Dashboard 예시의 "2026.08.21 테이블 교체"와 Detail의 "설치일 2025.03.18" 충돌 | 2025.03은 테이블 교체, 2026.08.21은 **상판 교체(보수)**로 분리 |
| 전체 공간 24개 vs 예시 공간 8개 | **24개 전부 상세 데이터** (사용자 선택) |
| 전체 이용률 72%가 그룹 평균과 안 맞음 | 그룹은 단순 평균, **전체는 면적 가중 평균**으로 정의 |

### 🟡 API 계층은 동기 함수입니다

설계안에는 Promise 기반으로 적었지만, 실제로는 동기로 구현했습니다. 프로토타입이라
비동기 렌더링 복잡도를 감수할 이유가 없었습니다. 교체 지점(`src/api/`)은 그대로라
나중에 async로 바꿔도 화면 코드 수정 범위가 제한됩니다.

---

## 7. Visual Asset 시스템

### 동작 원리

```
assets/_originals/에 원본 이미지 저장 (파일명 = Asset ID)
  ↓ python scripts/images/process_assets.py
WebP 변환 + 썸네일 생성 + 매니페스트 status를 required → ready
  ↓ 브라우저 새로고침
화면에 자동 반영 (Placeholder → 실제 이미지)
```

- 이미지가 없으면 **가짜 이미지를 만들지 않고** `VISUAL ASSET REQUIRED / 제품명 / asset_id`
  Placeholder를 표시합니다 (요청서 §20·§41).
- 최소 해상도 미달 이미지는 **확대하지 않고 실패 처리**합니다 (제품 800px, 공간 1200px).
- 사이드바에 `VISUAL ASSET 9 / 28 LOCAL` 형태로 진행 상황이 상시 표시됩니다.

### 현재 확보 상태: 9 / 28

**완료(9)**: 회의 테이블 · 회의용 의자 · 75인치 디스플레이 · LED 라인 조명 ·
유리 파티션 · 슬라이딩 도어 · 카페트 타일 · 흡음 패널 · 원목 마루

**남은 19장**의 ID·용도·해상도·영문 프롬프트는 전부
📄 `VISUAL_ASSET_REQUIREMENTS.md` 에 있습니다.

**우선순위**: 회의실 A 3종(현재 / 2023 / 제안)이 가장 가치가 높습니다.
**반드시 한 대화에서 연속 생성**해야 카메라 앵글이 같습니다.

⚠️ **공간 이미지는 가로형(1536×1024)으로** 생성해야 합니다. 정사각형은 거부됩니다.

---

## 8. 배포 상태

### GitHub
- https://github.com/dlaskagur00-del/20260915_ETNS_G (`main` 브랜치)
- 원래 할일관리 앱이 있던 저장소를 **force push로 덮어썼습니다** (사용자 승인함).
  할일관리 앱은 로컬 `../ETNS_ TODO_APP/`에 6개 커밋으로 남아 있습니다.

### Vercel
- https://20260915etnes.vercel.app — **자동 배포됨** (`git push`만 하면 반영)
- 빌드 없는 정적 사이트입니다. `vercel.json`에 `framework: null`,
  `buildCommand: null`, `outputDirectory: "."`로 명시되어 있습니다.
- ⚠️ **루트에 `.py` 파일을 두지 마세요.** Vercel이 Flask 앱으로 오인해 배포가 실패합니다
  (실제로 한 번 겪었고, `dev_server.py`를 `scripts/`로 옮겨 해결했습니다).

### Supabase — 코드는 완성, 사용자 설정 대기 중

| 단계 | 상태 |
|---|---|
| 테이블 스키마 (`supabase/schema.sql`) | 작성 완료, **실행 대기** |
| 메타데이터 seed (`supabase/seed.sql`) | 생성 완료, **실행 대기** |
| Storage 버킷 `office-history-assets` | **생성 대기** (Public 필수) |
| 이미지 업로드 | **대기** |
| `src/data/supabaseConfig.js` 채우기 | **대기** (url · anonKey) |

**설계**: Supabase를 우선 사용하되 **4초 안에 응답이 없거나 실패하면 로컬 매니페스트로
자동 전환**합니다. 발표장에서 네트워크가 끊겨도 화면이 그대로 뜹니다.
사이드바 표시가 `LOCAL` ↔ `SUPABASE`로 바뀌어 현재 원천을 확인할 수 있습니다.

⚠️ `anonKey`만 넣으세요. `service_role` 키는 절대 프런트엔드에 넣으면 안 됩니다.

---

## 9. 남은 작업

### 이미지만 있으면 되는 것
- 회의실 A 3종 → Before/After · Current/Proposed가 실제 렌더로 바뀜
- 공간 개별 5종, 제품 4종, 마감재 3종, 프로젝트 2종

### 사용자 작업 대기
- Supabase 4단계 (스키마 → seed → 버킷 → 설정 파일)

### 개념 문서 기준 미구현 (우선순위 순)
1. **최초 견적 vs 최종 비용** (§15) — 지금은 최종 비용만 있음. 저비용·고효과
2. **업체 History 전용 화면** (§16) — 현재는 Project Asset 안에만 있음
3. **Case Study / Portfolio 뷰** (§17) — `isPublicCase` 플래그만 있고 화면 없음
4. **관련 사진·도면·문서 뷰어** (§5) — 파일명 칩만 있고 실제 열람 불가
5. **자재 History** (§13) — 자재가 항목 속성으로만 존재

---

## 10. 다음 에이전트를 위한 체크리스트

작업을 시작하기 전에:

- [ ] `python scripts/dev_server.py 5173`으로 실행해서 현재 상태를 눈으로 확인
- [ ] 데모 시나리오 14단계를 직접 클릭해보기 (5장의 흐름)
- [ ] 6장(이미 내린 결정)을 읽고, 되돌리려는 것이 아닌지 점검

작업하면서:

- [ ] `src/pages/`에서 `src/data/`를 직접 import하지 않기 (반드시 `src/api/` 경유)
- [ ] 5장의 데모 수치가 유지되는지 변경 후 확인
- [ ] 화면에 새 한글을 추가했으면 `subset_fonts.py` 재실행
- [ ] 루트에 `.py` 파일 두지 않기 (Vercel 배포 실패)
- [ ] 외부 CDN 링크 추가하지 않기 (오프라인 동작 보장)

마무리:

- [ ] 브라우저에서 5개 화면 전부 렌더 + 콘솔 에러 0건 확인
- [ ] `git push` → Vercel 자동 배포 → 배포 사이트에서 재확인

---

## 11. 참고 문서

| 문서 | 내용 |
|---|---|
| `VISUAL_ASSET_REQUIREMENTS.md` | 필요한 이미지 28종 사양서 + 영문 프롬프트 |
| `supabase/schema.sql` | 테이블 · RLS 정책 |
| `supabase/seed.sql` | Asset 메타데이터 28건 |

사용자가 준 원본 요청서는 세 종류입니다 (대화에만 존재, 파일 없음):
1. **개발 요청서** — 기능 요구사항, STEP 1~9 개발 단계
2. **개념 설명서** — 서비스 철학 28개 장 (§1~§28)
3. **시각자료 요청서** — Visual Asset 시스템 44개 장

필요하면 사용자에게 다시 요청하세요. 이 문서에 핵심은 요약되어 있습니다.
