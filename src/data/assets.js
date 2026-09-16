/**
 * Space composition assets. Every space is described across the eight
 * categories the brief calls out (가구 · 벽지 · 바닥 · 파티션 · 조명 · 문 ·
 * 천장/마감 · 시설/설비), not just furniture.
 *
 * `replacementReason` and `specialNote` are first-class fields: the reason a
 * thing was chosen is the part of the record that has value later.
 */

import { SPACES } from "./office.js";

export const CATEGORIES = {
  furniture: "가구",
  wall: "벽지",
  floor: "바닥",
  partition: "파티션",
  lighting: "조명",
  door: "문",
  ceiling: "천장/마감",
  facility: "시설/설비",
};

/** The deck groups composition into three families; the eight categories map onto them. */
export const CATEGORY_GROUPS = [
  { id: "furniture", label: "Furniture", ko: "가구", categories: ["furniture"] },
  { id: "finish", label: "Finish", ko: "마감", categories: ["floor", "wall", "ceiling", "partition", "door"] },
  { id: "facility", label: "Facility", ko: "설비", categories: ["lighting", "facility"] },
];

export function groupOf(category) {
  return CATEGORY_GROUPS.find((group) => group.categories.includes(category)) || CATEGORY_GROUPS[2];
}

export const CATEGORY_ORDER = [
  "furniture", "lighting", "floor", "wall", "partition", "door", "ceiling", "facility",
];

/* Hand-authored assets for the space the demo walks through. */
const AUTHORED = {
  "mr-a": [
    {
      id: "mr-a-table", category: "furniture", name: "회의 테이블",
      manufacturer: "DESKER", model: "DSK-2400", material: "무늬목 / 스틸 프레임",
      purchaseDate: "2025-03-12", installDate: "2025-03-18", vendor: "OO Office",
      cost: 1850000, status: "사용 중",
      replacementReason: "기존 테이블 노후화 및 회의 인원 증가",
      specialNote: "케이블 매립형 제품",
      previousProduct: "2,000mm 목재 테이블 · 2023.03 설치",
      placement: { x: 0.5, y: 0.45 },
    },
    {
      id: "mr-a-chair", category: "furniture", name: "회의용 의자 12석",
      manufacturer: "시디즈", model: "T50", material: "메쉬 / 알루미늄",
      purchaseDate: "2024-01-08", installDate: "2024-01-15", vendor: "OO Office",
      cost: 4320000, status: "사용 중",
      replacementReason: "8인 → 12인 확장에 따른 좌석 증설",
      specialNote: "확장 시 기존 8석 유지, 4석만 추가 구매",
      previousProduct: "회의용 의자 8석 · 2023.03 설치 (8석은 유지, 4석만 추가)",
      placement: { x: 0.5, y: 0.72 },
    },
    {
      id: "mr-a-light", category: "lighting", name: "LED 라인 조명",
      manufacturer: "필립스", model: "CoreLine SM134V", material: "알루미늄 하우징",
      purchaseDate: "2026-05-20", installDate: "2026-06-11", vendor: "OO Electric",
      cost: 2400000, status: "사용 중",
      replacementReason: "확장 후 테이블 끝단 조도 부족 (320lx → 목표 500lx)",
      specialNote: "조광 제어 가능, 회의 모드 프리셋 3종",
      previousProduct: "형광 평판 조명 320lx · 2023.03 설치",
      placement: { x: 0.5, y: 0.2 },
    },
    {
      id: "mr-a-display", category: "facility", name: "75인치 디스플레이",
      manufacturer: "삼성", model: "QB75B", material: "-",
      purchaseDate: "2024-01-08", installDate: "2024-01-16", vendor: "OO Office",
      cost: 3100000, status: "사용 중",
      replacementReason: "12인 확장으로 기존 55인치 가독성 부족",
      specialNote: "무선 미러링 동글 상시 연결",
      previousProduct: "55인치 디스플레이 · 2023.03 설치",
      placement: { x: 0.5, y: 0.08 },
    },
    {
      id: "mr-a-partition", category: "partition", name: "유리 파티션",
      manufacturer: "LX하우시스", model: "GP-1200", material: "강화유리 12T",
      purchaseDate: "2023-12-18", installDate: "2024-01-12", vendor: "OO Interior",
      cost: 6800000, status: "사용 중",
      replacementReason: "회의실 확장에 따른 벽체 재시공",
      specialNote: "하단 1.1m 시트지 시공, 복도측 시야 차단",
      previousProduct: "석고 벽체 · 2023.03 시공",
      placement: { x: 0.08, y: 0.5 },
    },
    {
      id: "mr-a-floor", category: "floor", name: "카페트 타일",
      manufacturer: "인터페이스", model: "Human Nature", material: "나일론",
      purchaseDate: "2023-02-20", installDate: "2023-03-04", vendor: "OO Interior",
      cost: 1620000, status: "사용 중",
      replacementReason: "최초 구축",
      specialNote: "부분 교체 가능한 타일형, 잔여 재고 12장 보유",
      previousProduct: null,
      placement: { x: 0.25, y: 0.62 },
    },
    {
      id: "mr-a-wall", category: "wall", name: "흡음 패널 벽면",
      manufacturer: "동화", model: "AC-300", material: "폴리에스터 흡음재",
      purchaseDate: "2023-12-18", installDate: "2024-01-10", vendor: "OO Interior",
      cost: 2900000, status: "사용 중",
      replacementReason: "확장 후 잔향 증가 민원",
      specialNote: "NRC 0.85, 후면 벽 전체 시공",
      previousProduct: "일반 도장 마감 · 2023.03 시공",
      placement: { x: 0.9, y: 0.5 },
    },
    {
      id: "mr-a-door", category: "door", name: "슬라이딩 도어",
      manufacturer: "LX하우시스", model: "SD-900", material: "강화유리 / 알루미늄",
      purchaseDate: "2023-12-18", installDate: "2024-01-12", vendor: "OO Interior",
      cost: 1450000, status: "사용 중",
      replacementReason: "여닫이 문의 동선 간섭 해소",
      specialNote: "사용 중 표시등 연동",
      previousProduct: "여닫이 도어 · 2023.03 설치",
      placement: { x: 0.2, y: 0.95 },
    },
  ],

  /* 라운지 — 회의실 A 다음으로 기록이 쌓인 공간. 공용공간은 "누가 요청했는지"가
     남지 않으면 나중에 왜 이렇게 됐는지 아무도 설명하지 못합니다. */
  lounge: [
    {
      id: "lounge-sofa", category: "furniture", name: "라운지 소파",
      manufacturer: "일룸", model: "LS-2200", material: "패브릭 / 우레탄 폼",
      purchaseDate: "2025-10-28", installDate: "2025-11-14", vendor: "OO Office",
      cost: 7200000, status: "사용 중",
      replacementReason: "기존 2인 소파로는 팀 단위 휴식 수요를 받지 못함",
      specialNote: "오염 시 커버만 교체 가능한 모델",
      previousProduct: "2인용 패브릭 소파 2조 · 2023.03 설치",
      placement: { x: 0.3, y: 0.7 },
    },
    {
      id: "lounge-table", category: "furniture", name: "라운지 테이블",
      manufacturer: "일룸", model: "RT-900", material: "원목 / 스틸 베이스",
      purchaseDate: "2025-10-28", installDate: "2025-11-14", vendor: "OO Office",
      cost: 1350000, status: "사용 중",
      replacementReason: "소파 교체에 맞춘 높이 조정 (450mm → 520mm)",
      specialNote: "노트북 사용을 고려해 상판을 넓힌 사양",
      previousProduct: "사각 로우 테이블 · 2023.03 설치",
      placement: { x: 0.5, y: 0.75 },
    },
    {
      id: "lounge-floor", category: "floor", name: "원목 마루",
      manufacturer: "동화자연마루", model: "NF-720", material: "강화 원목",
      purchaseDate: "2026-05-18", installDate: "2026-06-02", vendor: "OO Interior",
      cost: 4100000, status: "사용 중",
      replacementReason: "데코타일 들뜸 반복 및 공용공간 이미지 개선",
      specialNote: "주말 시공으로 업무 영향 없음",
      previousProduct: "데코타일 · 2023.03 시공",
      placement: { x: 0.5, y: 0.9 },
    },
    {
      id: "lounge-ceiling", category: "ceiling", name: "목재 루버 천장",
      manufacturer: "KCC", model: "WL-450", material: "자작나무 루버",
      purchaseDate: "2025-10-02", installDate: "2025-11-14", vendor: "OO Interior",
      cost: 5800000, status: "사용 중",
      replacementReason: "노출 천장의 소음 반사로 대화가 울린다는 민원",
      specialNote: "루버 뒤 흡음재 병행 시공",
      previousProduct: "노출 천장 마감 · 2023.03 시공",
      placement: { x: 0.5, y: 0.12 },
    },
    {
      id: "lounge-window", category: "partition", name: "유리 커튼월",
      manufacturer: "LX하우시스", model: "CW-2400", material: "복층 로이유리",
      purchaseDate: "2023-02-10", installDate: "2023-03-06", vendor: "OO Interior",
      cost: 12400000, status: "사용 중",
      replacementReason: "최초 구축",
      specialNote: "서향 일사 차단을 위해 로이 코팅 사양 선택",
      placement: { x: 0.15, y: 0.4 },
    },
    {
      id: "lounge-plant", category: "facility", name: "실내 식재",
      manufacturer: "그린랩", model: "임대 관리형", material: "생화분",
      purchaseDate: "2026-03-09", installDate: "2026-03-16", vendor: "OO Green",
      cost: 960000, status: "사용 중",
      replacementReason: "조화 식재가 관리되지 않는다는 지적",
      specialNote: "월 1회 관리 포함 임대 계약 (연 96만원)",
      previousProduct: "조화 식재 · 2023.03 설치",
      placement: { x: 0.35, y: 0.45 },
    },
  ],

  /* 집중업무존 A — 신설 프로젝트로 통째로 만들어진 공간이라 최초 구축 기록이
     많고, 신설 이후의 보완 기록이 그 위에 쌓입니다. */
  "focus-a": [
    {
      id: "focus-a-booth", category: "partition", name: "집중업무 부스",
      manufacturer: "퍼시스", model: "FB-1200", material: "자작합판 / 흡음 패널",
      purchaseDate: "2024-04-22", installDate: "2024-05-13", vendor: "OO Interior",
      cost: 9600000, status: "사용 중",
      replacementReason: "최초 구축 — 미사용 공간을 1인 집중업무존으로 전환",
      specialNote: "12석 중 4석은 통화용 밀폐 부스",
      placement: { x: 0.4, y: 0.4 },
    },
    {
      id: "focus-a-desk", category: "furniture", name: "업무용 데스크",
      manufacturer: "퍼시스", model: "DS-1200", material: "멜라민 / 스틸",
      purchaseDate: "2024-04-22", installDate: "2024-05-13", vendor: "OO Office",
      cost: 3800000, status: "사용 중",
      replacementReason: "최초 구축",
      specialNote: "부스 폭에 맞춘 1,200mm 특주 사양",
      placement: { x: 0.4, y: 0.6 },
    },
    {
      id: "focus-a-chair", category: "furniture", name: "사무용 의자",
      manufacturer: "시디즈", model: "T50 Air", material: "메쉬 / 알루미늄",
      purchaseDate: "2026-01-19", installDate: "2026-02-04", vendor: "OO Office",
      cost: 4480000, status: "사용 중",
      replacementReason: "장시간 착석 사용으로 초기 도입 의자의 쿠션 꺼짐",
      specialNote: "요추 지지 옵션 포함 사양으로 상향",
      previousProduct: "사무용 의자 T40 12석 · 2024.05 설치",
      placement: { x: 0.42, y: 0.68 },
    },
    {
      id: "focus-a-light", category: "lighting", name: "개별 태스크 조명",
      manufacturer: "필립스", model: "Hue Go Desk", material: "알루미늄",
      purchaseDate: "2024-04-22", installDate: "2024-05-13", vendor: "OO Electric",
      cost: 1680000, status: "사용 중",
      replacementReason: "최초 구축 — 부스 내부 조도 확보",
      specialNote: "개인이 밝기를 조절할 수 있도록 부스마다 개별 설치",
      placement: { x: 0.4, y: 0.25 },
    },
    {
      id: "focus-a-door", category: "door", name: "부스 유리 도어",
      manufacturer: "LX하우시스", model: "GD-900", material: "강화유리 / 알루미늄",
      purchaseDate: "2025-08-11", installDate: "2025-09-01", vendor: "OO Interior",
      cost: 5200000, status: "사용 중",
      replacementReason: "밀폐 부스의 답답함 및 사용 여부 확인 불가 민원",
      specialNote: "하단 프로스트 처리로 시선은 차단, 사용 여부만 보이게",
      previousProduct: "목재 여닫이 도어 · 2024.05 설치",
      placement: { x: 0.45, y: 0.45 },
    },
    {
      id: "focus-a-floor", category: "floor", name: "카페트 타일",
      manufacturer: "인터페이스", model: "Composure", material: "나일론 루프",
      purchaseDate: "2024-04-22", installDate: "2024-05-13", vendor: "OO Interior",
      cost: 2240000, status: "사용 중",
      replacementReason: "최초 구축 — 발소리 저감",
      specialNote: "오염 부위만 낱장 교체 가능",
      placement: { x: 0.5, y: 0.9 },
    },
  ],
};

/* Templates used to compose the remaining spaces. */
const TEMPLATES = {
  meeting: [
    { category: "furniture", name: "회의 테이블", maker: "DESKER", model: "DSK-1800", cost: 1240000, reason: "노후화 교체", prev: "동일 카테고리 구형 모델", note: "케이블 트레이 포함" },
    { category: "furniture", name: "회의용 의자", maker: "시디즈", model: "T40", cost: 2160000, reason: "좌석 증설", prev: "기존 좌석 일부 유지", note: "스택 가능 모델" },
    { category: "lighting", name: "LED 평판 조명", maker: "필립스", model: "SM060C", cost: 980000, reason: "조도 개선", prev: "형광 평판 조명", note: "색온도 4000K" },
    { category: "facility", name: "화상회의 장비", maker: "로지텍", model: "Rally Bar", cost: 2750000, reason: "화상회의 수요 증가", note: "자동 화자 추적" },
    { category: "partition", name: "유리 파티션", maker: "LX하우시스", model: "GP-1000", cost: 4300000, reason: "최초 구축", note: "하단 시트지 시공" },
    { category: "floor", name: "카페트 타일", maker: "인터페이스", model: "Composure", cost: 1180000, reason: "최초 구축", note: "부분 교체형" },
    { category: "wall", name: "흡음 벽지", maker: "개나리", model: "AW-220", cost: 760000, reason: "잔향 개선", note: "친환경 인증 자재" },
    { category: "door", name: "여닫이 도어", maker: "LX하우시스", model: "HD-700", cost: 820000, reason: "최초 구축", note: "사용중 표시등 없음" },
  ],
  work: [
    { category: "furniture", name: "업무용 데스크", maker: "퍼시스", model: "DS-1400", cost: 5600000, reason: "좌석 재배치", prev: "고정형 데스크", note: "높이 조절형 일부 포함" },
    { category: "furniture", name: "사무용 의자", maker: "시디즈", model: "T50 Air", cost: 6400000, reason: "노후화 교체", prev: "동일 카테고리 구형 모델", note: "요추 지지 옵션 적용" },
    { category: "lighting", name: "LED 라인 조명", maker: "필립스", model: "CoreLine", cost: 1840000, reason: "조도 균일도 개선", prev: "평판 조명", note: "재실 감지 연동" },
    { category: "partition", name: "로우 파티션", maker: "퍼시스", model: "LP-900", cost: 2300000, reason: "집중도 개선 요청", note: "높이 900mm" },
    { category: "floor", name: "데코타일", maker: "LX하우시스", model: "DT-500", cost: 2450000, reason: "최초 구축", note: "정전기 방지 처리" },
    { category: "wall", name: "도장 마감", maker: "노루페인트", model: "친환경 수성", cost: 640000, reason: "이미지 개선", note: "저VOC 제품" },
    { category: "ceiling", name: "시스템 천장", maker: "KCC", model: "SC-600", cost: 3100000, reason: "최초 구축", note: "설비 점검구 포함" },
    { category: "facility", name: "공기청정 설비", maker: "LG", model: "AS-300", cost: 1450000, reason: "실내 공기질 민원", note: "필터 6개월 주기" },
  ],
  common: [
    { category: "furniture", name: "라운지 소파", maker: "일룸", model: "LS-2200", cost: 3800000, reason: "노후화 교체", prev: "동일 카테고리 구형 모델", note: "패브릭 커버 분리 세탁" },
    { category: "furniture", name: "하이 테이블", maker: "DESKER", model: "HT-1200", cost: 1320000, reason: "스탠딩 미팅 수요", note: "이동형 캐스터" },
    { category: "lighting", name: "펜던트 조명", maker: "루이스폴센", model: "PH5", cost: 2200000, reason: "공간 분위기 개선", note: "높이 조절 가능" },
    { category: "floor", name: "원목 마루", maker: "구정마루", model: "GW-900", cost: 4100000, reason: "바닥 마감재 교체", prev: "데코타일", note: "생활 방수 등급" },
    { category: "wall", name: "포인트 벽지", maker: "개나리", model: "KW-180", cost: 520000, reason: "브랜드 아이덴티티 반영", note: "ETNERS 컬러 적용" },
    { category: "facility", name: "정수 설비", maker: "코웨이", model: "CHP-671", cost: 1750000, reason: "이용 인원 증가", note: "월 1회 방문 관리" },
    { category: "ceiling", name: "노출 천장 마감", maker: "-", model: "-", cost: 1900000, reason: "최초 구축", note: "덕트 도장 마감" },
    { category: "door", name: "자동문", maker: "코아스", model: "AD-1200", cost: 2600000, reason: "최초 구축", note: "센서 감도 조정 이력 있음" },
  ],
};

const VENDORS = ["OO Office", "OO Interior", "OO Electric", "OO Systems"];

function hash(text) {
  let h = 7;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

function buildAssets(space) {
  if (AUTHORED[space.id]) {
    return AUTHORED[space.id].map((asset) => ({ ...asset, spaceId: space.id }));
  }

  const templates = TEMPLATES[space.type];
  const seed = hash(space.id);
  const count = space.capacity <= 1 ? 4 : space.capacity <= 6 ? 6 : templates.length;

  return templates.slice(0, count).map((template, index) => {
    const year = 2023 + ((seed + index) % 4);
    const month = 1 + ((seed >> (index + 1)) % 12);
    const day = 4 + ((seed >> index) % 22);
    const purchase = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const installDay = Math.min(28, day + 4 + (index % 5));
    const scale = space.capacity <= 6 ? 0.7 : space.capacity >= 16 ? 1.25 : 1;

    return {
      id: `${space.id}-${template.category}-${index}`,
      spaceId: space.id,
      category: template.category,
      name: template.name,
      manufacturer: template.maker,
      model: template.model,
      material: "-",
      purchaseDate: purchase,
      installDate: `${year}-${String(month).padStart(2, "0")}-${String(installDay).padStart(2, "0")}`,
      vendor: VENDORS[(seed + index) % VENDORS.length],
      cost: Math.round((template.cost * scale) / 10000) * 10000,
      status: (seed + index) % 11 === 0 ? "점검 필요" : "사용 중",
      replacementReason: template.reason,
      previousProduct: template.prev || null,
      specialNote: template.note,
      placement: {
        x: 0.2 + ((index * 0.23) % 0.62),
        y: 0.18 + ((index * 0.31) % 0.66),
      },
    };
  });
}

export const ASSETS = SPACES.flatMap(buildAssets);

export function assetsOf(spaceId) {
  const rows = ASSETS.filter((asset) => asset.spaceId === spaceId);
  return rows.sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  );
}
