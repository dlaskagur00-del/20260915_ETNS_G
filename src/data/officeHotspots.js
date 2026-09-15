/**
 * 이미지 위 공간 선택 영역.
 *
 * 좌표는 이미지 크기에 대한 백분율이라 화면 폭이 바뀌어도 위치가 따라갑니다.
 * 이미지를 교체하면 이 좌표만 다시 잡으면 됩니다.
 */

/** office_isometric_main.webp 기준 */
export const OFFICE_HOTSPOTS = [
  { spaceId: "mr-a", label: "회의실 A", x: 41, y: 8, w: 20, h: 22 },
  { spaceId: "lounge", label: "라운지", x: 62, y: 30, w: 24, h: 24 },
  { spaceId: "od-a", label: "Open Desk A", x: 10, y: 28, w: 26, h: 28 },
  { spaceId: "focus-a", label: "집중업무존", x: 42, y: 52, w: 24, h: 24 },
  { spaceId: "reception", label: "리셉션", x: 20, y: 62, w: 22, h: 26 },
];

/** floor_plan_main.webp 기준 */
export const FLOOR_HOTSPOTS = [
  { spaceId: "mr-c", label: "회의실 C", x: 6, y: 6, w: 19, h: 36 },
  { spaceId: "mr-b", label: "회의실 B", x: 27, y: 6, w: 24, h: 36 },
  { spaceId: "mr-e", label: "회의실 E", x: 53, y: 6, w: 8, h: 36 },
  { spaceId: "mr-a", label: "회의실 A", x: 62, y: 6, w: 30, h: 36 },
  { spaceId: "lounge", label: "라운지", x: 6, y: 47, w: 21, h: 48 },
  { spaceId: "od-a", label: "Open Desk A", x: 29, y: 47, w: 28, h: 48 },
  { spaceId: "focus-a", label: "집중업무존", x: 62, y: 47, w: 30, h: 48 },
];
