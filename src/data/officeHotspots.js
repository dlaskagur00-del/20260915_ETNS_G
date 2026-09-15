/**
 * 이미지 위 공간 선택 영역.
 *
 * 좌표는 이미지 크기에 대한 백분율이라 화면 폭이 바뀌어도 위치가 따라갑니다.
 * 이미지를 교체하면 이 좌표만 다시 잡으면 됩니다.
 */

/** office_isometric_main.webp 기준 */
export const OFFICE_HOTSPOTS = [
  { spaceId: "mr-a", label: "회의실 A", x: 36, y: 16, w: 17, h: 21 },
  { spaceId: "od-a", label: "Open Desk A", x: 19, y: 30, w: 21, h: 28 },
  { spaceId: "lounge", label: "라운지", x: 53, y: 21, w: 15, h: 21 },
  { spaceId: "focus-a", label: "집중업무존", x: 64, y: 35, w: 15, h: 19 },
  { spaceId: "reception", label: "리셉션", x: 13, y: 56, w: 17, h: 23 },
];

/** floor_plan_main.webp 기준 */
export const FLOOR_HOTSPOTS = [
  { spaceId: "mr-c", label: "회의실 C", x: 6, y: 8, w: 17, h: 32 },
  { spaceId: "mr-b", label: "회의실 B", x: 24, y: 8, w: 17, h: 32 },
  { spaceId: "mr-a", label: "회의실 A", x: 42, y: 8, w: 17, h: 32 },
  { spaceId: "lounge", label: "라운지", x: 60, y: 8, w: 31, h: 34 },
  { spaceId: "mr-e", label: "회의실 E", x: 6, y: 52, w: 17, h: 38 },
  { spaceId: "od-a", label: "Open Desk A", x: 24, y: 52, w: 26, h: 38 },
  { spaceId: "focus-a", label: "집중업무존", x: 58, y: 52, w: 33, h: 38 },
];
