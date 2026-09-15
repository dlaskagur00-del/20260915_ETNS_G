import { allAssets, assetEntry, assetSource } from "../data/visualAssets.js";

/**
 * Visual Asset 접근 계층.
 *
 * 화면은 Asset ID만 알고, 그것이 로컬 파일인지 Supabase Storage URL인지는
 * 여기서만 결정합니다.
 */

export function getVisualAsset(assetId) {
  return assetEntry(assetId);
}

export function isAssetReady(assetId) {
  return assetEntry(assetId)?.status === "ready";
}

export function assetUrl(assetId) {
  const entry = assetEntry(assetId);
  return entry?.status === "ready" ? entry.url : null;
}

export function assetThumbUrl(assetId) {
  const entry = assetEntry(assetId);
  if (entry?.status !== "ready") return null;
  return entry.thumbnailUrl || entry.url;
}

/** 아직 확보되지 않은 Asset 목록 — 개발 중 진행 상황 확인용. */
export function listRequiredAssets() {
  return Object.entries(allAssets())
    .filter(([, entry]) => entry.status !== "ready")
    .map(([id, entry]) => ({ id, ...entry }));
}

export function assetProgress() {
  const entries = Object.values(allAssets());
  const ready = entries.filter((entry) => entry.status === "ready").length;
  return { ready, total: entries.length, source: assetSource() };
}

/**
 * SpaceAsset → Visual Asset 연결.
 *
 * 구성 요소마다 assetId를 일일이 적어두는 대신, 제품명으로 매핑합니다.
 * 24개 공간의 구성 요소가 템플릿에서 생성되기 때문에, 이 방식이면 공간이
 * 늘어나도 연결이 자동으로 따라옵니다.
 */
const BY_NAME = {
  "회의 테이블": "product_meeting_table",
  "회의용 의자": "product_meeting_chair",
  "회의용 의자 12석": "product_meeting_chair",
  "75인치 디스플레이": "product_display_75",
  "LED 라인 조명": "product_led_linear_light",
  "LED 평판 조명": "product_led_linear_light",
  "펜던트 조명": "product_led_linear_light",
  "유리 파티션": "product_glass_partition",
  "로우 파티션": "product_glass_partition",
  "슬라이딩 도어": "product_sliding_door",
  "여닫이 도어": "product_sliding_door",
  "자동문": "product_sliding_door",
  "업무용 데스크": "product_office_desk",
  "사무용 의자": "product_task_chair",
  "라운지 소파": "product_lounge_sofa",
  "하이 테이블": "product_office_desk",
  "화상회의 장비": "product_video_conf",
  "화이트보드": "product_whiteboard",
  "전원 모듈": "product_power_module",
  "시스템 천장": "material_ceiling_tile",
  "노출 천장 마감": "material_ceiling_tile",
  "카페트 타일": "material_carpet_tile",
  "흡음 패널 벽면": "material_acoustic_panel",
  "흡음 벽지": "material_acoustic_panel",
  "원목 마루": "material_wood_floor",
  "데코타일": "material_deco_tile",
  "도장 마감": "material_paint_finish",
  "포인트 벽지": "material_paint_finish",
};

export function assetIdForSpaceAsset(spaceAsset) {
  if (spaceAsset.assetId) return spaceAsset.assetId;
  return BY_NAME[spaceAsset.name] || null;
}

/** 공간 → 공간 이미지. 없으면 null이고 화면은 Placeholder로 떨어집니다. */
const BY_SPACE = {
  "mr-a": "meeting_room_a_current",
  lounge: "lounge_current",
  "od-a": "open_desk_a_current",
  "focus-a": "focus_zone_current",
  reception: "reception_current",
  rest: "rest_area_current",
};

export function assetIdForSpace(spaceId) {
  return BY_SPACE[spaceId] || null;
}
