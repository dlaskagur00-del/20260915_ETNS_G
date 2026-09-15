/**
 * Demo office. Every space is authored once as a plan rectangle (metres);
 * src/lib/iso.js derives both the isometric view and the flat floor map from it.
 */

export const OFFICE = {
  id: "etners-hq",
  name: "ETNERS OFFICE",
  floorLabel: "본사 7F",
  floorSize: { w: 58, h: 32 },
  address: "서울 강남구",
  managedSince: "2023-03",
};

export const SPACE_TYPES = {
  meeting: { label: "회의실", group: "회의실" },
  work: { label: "업무 공간", group: "업무 공간" },
  common: { label: "공용 공간", group: "공용 공간" },
};

export const SPACES = [
  // ── Band A ──────────────────────────────────────────────────────────
  {
    id: "reception", name: "리셉션", type: "common", capacity: 6,
    rect: { x: 0, y: 0, w: 8, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "lounge", name: "라운지", type: "common", capacity: 24,
    rect: { x: 8, y: 0, w: 12, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "mr-a", name: "회의실 A", type: "meeting", capacity: 12,
    rect: { x: 20, y: 0, w: 10, h: 9 }, status: "운영 중", builtAt: "2023-03",
    note: "2026.06 8인 → 12인 확장",
  },
  {
    id: "mr-b", name: "회의실 B", type: "meeting", capacity: 6,
    rect: { x: 30, y: 0, w: 7, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "mr-c", name: "회의실 C", type: "meeting", capacity: 8,
    rect: { x: 37, y: 0, w: 7, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "mr-d", name: "회의실 D", type: "meeting", capacity: 6,
    rect: { x: 44, y: 0, w: 7, h: 9 }, status: "운영 중", builtAt: "2024-01",
  },
  {
    id: "exec", name: "임원실", type: "work", capacity: 4,
    rect: { x: 51, y: 0, w: 7, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },

  // ── Band B ──────────────────────────────────────────────────────────
  {
    id: "od-a", name: "Open Desk A", type: "work", capacity: 20,
    rect: { x: 0, y: 11, w: 13, h: 10 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "od-b", name: "Open Desk B", type: "work", capacity: 20,
    rect: { x: 13, y: 11, w: 13, h: 10 }, status: "운영 중", builtAt: "2023-03",
    note: "2026.07 좌석 16석 → 20석",
  },
  {
    id: "focus-a", name: "집중업무존 A", type: "work", capacity: 12,
    rect: { x: 26, y: 11, w: 8, h: 10 }, status: "운영 중", builtAt: "2024-05",
  },
  {
    id: "booth-1", name: "폰부스 1", type: "work", capacity: 1,
    rect: { x: 34, y: 11, w: 3.5, h: 5 }, status: "운영 중", builtAt: "2024-05",
  },
  {
    id: "booth-2", name: "폰부스 2", type: "work", capacity: 1,
    rect: { x: 34, y: 16, w: 3.5, h: 5 }, status: "운영 중", builtAt: "2024-05",
  },
  {
    id: "project-room", name: "프로젝트룸", type: "work", capacity: 8,
    rect: { x: 37.5, y: 11, w: 7, h: 10 }, status: "운영 중", builtAt: "2025-02",
  },
  {
    id: "mr-e", name: "회의실 E", type: "meeting", capacity: 4,
    rect: { x: 44.5, y: 11, w: 6.5, h: 10 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "mr-f", name: "회의실 F", type: "meeting", capacity: 10,
    rect: { x: 51, y: 11, w: 7, h: 10 }, status: "운영 중", builtAt: "2023-03",
  },

  // ── Band C ──────────────────────────────────────────────────────────
  {
    id: "rest", name: "휴게공간", type: "common", capacity: 16,
    rect: { x: 0, y: 23, w: 8, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "pantry", name: "탕비실", type: "common", capacity: 8,
    rect: { x: 8, y: 23, w: 4.5, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "print", name: "프린트존", type: "common", capacity: 4,
    rect: { x: 12.5, y: 23, w: 4.5, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "od-c", name: "Open Desk C", type: "work", capacity: 18,
    rect: { x: 17, y: 23, w: 11, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "od-d", name: "Open Desk D", type: "work", capacity: 16,
    rect: { x: 28, y: 23, w: 10, h: 9 }, status: "운영 중", builtAt: "2024-09",
  },
  {
    id: "focus-b", name: "집중업무존 B", type: "work", capacity: 8,
    rect: { x: 38, y: 23, w: 6, h: 9 }, status: "운영 중", builtAt: "2025-08",
  },
  {
    id: "mr-g", name: "회의실 G", type: "meeting", capacity: 6,
    rect: { x: 44, y: 23, w: 7, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },
  {
    id: "mr-h", name: "회의실 H", type: "meeting", capacity: 4,
    rect: { x: 51, y: 23, w: 4, h: 9 }, status: "운영 중", builtAt: "2024-01",
  },
  {
    id: "storage", name: "창고", type: "common", capacity: 0,
    rect: { x: 55, y: 23, w: 3, h: 9 }, status: "운영 중", builtAt: "2023-03",
  },
];

export function spaceArea(space) {
  return Math.round(space.rect.w * space.rect.h * 10) / 10;
}
