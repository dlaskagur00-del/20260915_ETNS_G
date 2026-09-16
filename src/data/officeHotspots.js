/**
 * 이미지 위 공간 선택 영역.
 *
 * 좌표는 이미지 크기에 대한 백분율이라 화면 폭이 바뀌어도 위치가 따라갑니다.
 * 이미지를 교체하면 이 좌표만 다시 잡으면 됩니다.
 */

/** office_isometric_main.webp 기준 */
export const OFFICE_HOTSPOTS = [
  { spaceId: "mr-a", label: "회의실 A", x: 40, y: 7, w: 18, h: 20 },
  { spaceId: "lounge", label: "라운지", x: 14, y: 24, w: 26, h: 20 },
  { spaceId: "focus-a", label: "집중업무존", x: 66, y: 30, w: 22, h: 24 },
  { spaceId: "od-a", label: "Open Desk A", x: 34, y: 41, w: 26, h: 22 },
  { spaceId: "reception", label: "리셉션", x: 50, y: 63, w: 18, h: 18 },
];

/** floor_plan_main.webp 기준 */
export const FLOOR_HOTSPOTS = [
  { spaceId: "mr-a", label: "회의실 A", x: 44, y: 3, w: 17, h: 20 },
  { spaceId: "mr-b", label: "회의실 B", x: 62, y: 3, w: 15, h: 18 },
  { spaceId: "mr-e", label: "회의실 E", x: 62, y: 21, w: 15, h: 16 },
  { spaceId: "lounge", label: "라운지", x: 11, y: 21, w: 20, h: 20 },
  { spaceId: "od-a", label: "Open Desk A", x: 28, y: 44, w: 24, h: 28 },
  { spaceId: "mr-c", label: "회의실 C", x: 6, y: 55, w: 20, h: 30 },
  { spaceId: "focus-a", label: "집중업무존", x: 74, y: 33, w: 18, h: 45 },
];
