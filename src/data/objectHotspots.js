/**
 * 공간을 확대했을 때, 그 안의 물건을 고르는 영역.
 *
 * 좌표는 공간 실내 이미지에 대한 백분율입니다. 이미지를 교체하면 여기만
 * 다시 잡으면 되고, 데이터(SpaceAsset)는 건드리지 않습니다.
 */

/** meeting_room_a_current.webp 기준 */
export const MEETING_A_OBJECTS = [
  { assetId: "mr-a-light", label: "LED 라인 조명", x: 24, y: 10, w: 52, h: 14 },
  { assetId: "mr-a-display", label: "75인치 디스플레이", x: 40, y: 32, w: 19, h: 14 },
  { assetId: "mr-a-wall", label: "흡음 패널 벽면", x: 10, y: 28, w: 27, h: 26 },
  { assetId: "mr-a-partition", label: "유리 파티션", x: 78, y: 24, w: 20, h: 54 },
  { assetId: "mr-a-table", label: "회의 테이블", x: 28, y: 55, w: 56, h: 18 },
  { assetId: "mr-a-chair", label: "회의용 의자", x: 30, y: 73, w: 50, h: 15 },
  { assetId: "mr-a-floor", label: "카페트 타일", x: 8, y: 88, w: 40, h: 11 },
];

/** 공간별 확대 이미지 + 그 안의 오브젝트 */
export const SPACE_DETAIL = {
  "mr-a": { assetId: "meeting_room_a_current", objects: MEETING_A_OBJECTS },
  lounge: { assetId: "lounge_current", objects: [] },
  "od-a": { assetId: "open_desk_a_current", objects: [] },
  "focus-a": { assetId: "focus_zone_current", objects: [] },
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
