/**
 * 공간을 확대했을 때, 그 안의 물건을 고르는 영역.
 *
 * 좌표는 공간 실내 이미지에 대한 백분율입니다. 이미지를 교체하면 여기만
 * 다시 잡으면 되고, 데이터(SpaceAsset)는 건드리지 않습니다.
 */

/** meeting_room_a_current.webp 기준 */
export const MEETING_A_OBJECTS = [
  { assetId: "mr-a-light", label: "LED 라인 조명", x: 36, y: 3, w: 30, h: 17 },
  { assetId: "mr-a-display", label: "75인치 디스플레이", x: 18, y: 21, w: 22, h: 29 },
  { assetId: "mr-a-wall", label: "흡음 패널 벽면", x: 42, y: 12, w: 10, h: 40 },
  { assetId: "mr-a-partition", label: "유리 파티션", x: 0, y: 2, w: 11, h: 48 },
  { assetId: "mr-a-door", label: "슬라이딩 도어", x: 0, y: 52, w: 11, h: 44 },
  { assetId: "mr-a-table", label: "회의 테이블", x: 21, y: 56, w: 44, h: 20 },
  { assetId: "mr-a-chair", label: "회의용 의자", x: 66, y: 52, w: 14, h: 36 },
  { assetId: "mr-a-floor", label: "카페트 타일", x: 20, y: 88, w: 34, h: 12 },
];

/** 공간별 확대 이미지 + 그 안의 오브젝트 */
/** lounge_current.webp 기준 */
export const LOUNGE_OBJECTS = [
  { assetId: "lounge-ceiling", label: "목재 루버 천장", x: 12, y: 0, w: 80, h: 22 },
  { assetId: "lounge-window", label: "유리 커튼월", x: 42, y: 26, w: 46, h: 30 },
  { assetId: "lounge-plant", label: "실내 식재", x: 17, y: 32, w: 14, h: 30 },
  { assetId: "lounge-sofa", label: "라운지 소파", x: 24, y: 55, w: 26, h: 20 },
  { assetId: "lounge-table", label: "라운지 테이블", x: 47, y: 62, w: 20, h: 20 },
  { assetId: "lounge-floor", label: "원목 마루", x: 10, y: 85, w: 34, h: 15 },
];

/** focus_zone_current.webp 기준 */
export const FOCUS_A_OBJECTS = [
  // 부스가 비스듬히 늘어서 있어, 같은 부스 안에서 위아래로 나눠 겹침을 피합니다.
  { assetId: "focus-a-light", label: "개별 태스크 조명", x: 14, y: 42, w: 17, h: 8 },
  { assetId: "focus-a-desk", label: "업무용 데스크", x: 14, y: 54, w: 17, h: 8 },
  { assetId: "focus-a-chair", label: "사무용 의자", x: 15, y: 63, w: 16, h: 25 },
  { assetId: "focus-a-door", label: "부스 유리 도어", x: 31, y: 6, w: 12, h: 82 },
  { assetId: "focus-a-booth", label: "집중업무 부스", x: 44, y: 12, w: 26, h: 70 },
  { assetId: "focus-a-floor", label: "카페트 타일", x: 40, y: 85, w: 34, h: 14 },
];

export const SPACE_DETAIL = {
  "mr-a": { assetId: "meeting_room_a_current", objects: MEETING_A_OBJECTS },
  lounge: { assetId: "lounge_current", objects: LOUNGE_OBJECTS },
  "od-a": { assetId: "open_desk_a_current", objects: [] },
  "focus-a": { assetId: "focus_zone_current", objects: FOCUS_A_OBJECTS },
  reception: { assetId: "reception_current", objects: [] },
  rest: { assetId: "rest_area_current", objects: [] },
};

export function spaceDetailFor(spaceId) {
  return SPACE_DETAIL[spaceId] || null;
}

/**
 * 오브젝트 360° 턴테이블 프레임.
 *
 * 실제 3D 엔진 대신, 여러 각도로 렌더한 이미지를 드래그로 넘깁니다.
 * 이미지가 없으면 뷰어는 뜨지 않고 단일 제품 사진으로 떨어집니다.
 */
export const TURNTABLES = {
  "mr-a-table": "turntable_meeting_table",
  "mr-a-chair": "turntable_meeting_chair",
  "mr-a-display": "turntable_display_75",
  "mr-a-light": "turntable_led_light",
  "mr-a-partition": "turntable_glass_partition",
  "mr-a-door": "turntable_sliding_door",
};

export const TURNTABLE_FRAMES = 4;
