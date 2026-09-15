/**
 * Furniture layouts derived from a space's own rectangle.
 *
 * This is a rendering concern, not stored data: give it a space and it returns
 * the boxes that make the floor plate read as an actual room. Deriving rather
 * than authoring means all 24 spaces stay furnished for free, and a proposed
 * layout gets furnished by the same rules as the real one.
 */

export const FURNITURE_STYLE = {
  desk:    { top: "#e3d7c6", right: "#cdbfab", left: "#b5a794" },
  table:   { top: "#ddcdb7", right: "#c6b39a", left: "#ac9880" },
  chair:   { top: "#7c7671", right: "#635e5a", left: "#4e4a47" },
  sofa:    { top: "#c2bab0", right: "#a9a196", left: "#8e867c" },
  counter: { top: "#cfc0aa", right: "#b6a690", left: "#9b8c77" },
  shelf:   { top: "#c1b5a3", right: "#a89c8b", left: "#8d8272" },
  plant:   { top: "#8aa07a", right: "#718a63", left: "#5d7451" },
  screen:  { top: "#7a736c", right: "#635d57", left: "#4f4a45" },
  rug:     { top: "#ded6ca", right: "#ded6ca", left: "#ded6ca" },
};

const H = {
  desk: 0.72, table: 0.74, chair: 0.46, sofa: 0.62,
  counter: 0.95, shelf: 1.55, plant: 1.05, screen: 0.8, rug: 0.02,
};

function box(kind, x, y, w, h) {
  return { kind, rect: { x, y, w, h }, h: H[kind] };
}

/** Evenly spaced positions across a span, inset from both ends. */
function spread(start, span, count, size) {
  if (count <= 0) return [];
  if (count === 1) return [start + (span - size) / 2];
  const gap = (span - size * count) / (count + 1);
  return Array.from({ length: count }, (_, i) => start + gap * (i + 1) + size * i);
}

/* ── room recipes ───────────────────────────────────────────────────── */

function meetingRoom(rect, capacity) {
  const items = [];
  const perSide = Math.max(1, Math.ceil(capacity / 2));

  const tableW = Math.min(rect.w * 0.52, 1.0 + perSide * 0.52);
  const tableH = Math.min(rect.h * 0.24, 1.15);
  const tx = rect.x + (rect.w - tableW) / 2;
  const ty = rect.y + (rect.h - tableH) / 2;

  items.push(box("table", tx, ty, tableW, tableH));

  for (const cx of spread(tx, tableW, perSide, 0.5)) {
    items.push(box("chair", cx, ty - 0.72, 0.5, 0.5));
    if (items.filter((i) => i.kind === "chair").length < capacity) {
      items.push(box("chair", cx, ty + tableH + 0.22, 0.5, 0.5));
    }
  }

  // Wall display on the far edge, plus a plant in the near corner.
  items.push(box("screen", rect.x + rect.w * 0.36, rect.y + 0.3, rect.w * 0.28, 0.1));
  items.push(box("plant", rect.x + rect.w - 1.1, rect.y + rect.h - 1.2, 0.55, 0.55));
  return items;
}

function openDesk(rect, capacity) {
  const items = [];
  const deskW = 1.35;
  const deskH = 0.72;
  const cols = Math.max(2, Math.min(4, Math.round(rect.w / 3.2)));
  const rows = Math.max(1, Math.ceil(capacity / (cols * 2)));

  const xs = spread(rect.x + 0.4, rect.w - 0.8, cols, deskW);
  const ys = spread(rect.y + 0.6, rect.h - 1.2, rows, deskH * 2 + 0.16);

  for (const y of ys) {
    for (const x of xs) {
      items.push(box("desk", x, y, deskW, deskH));
      items.push(box("desk", x, y + deskH + 0.16, deskW, deskH));
      items.push(box("chair", x + deskW / 2 - 0.25, y - 0.6, 0.5, 0.5));
      items.push(box("chair", x + deskW / 2 - 0.25, y + deskH * 2 + 0.3, 0.5, 0.5));
    }
  }

  items.push(box("plant", rect.x + rect.w - 1.0, rect.y + 0.5, 0.55, 0.55));
  items.push(box("plant", rect.x + 0.5, rect.y + rect.h - 1.1, 0.55, 0.55));
  return items;
}

function focusZone(rect, capacity) {
  const items = [];
  const cols = Math.max(1, Math.min(3, Math.round(rect.w / 2.6)));
  const rows = Math.max(1, Math.ceil(capacity / cols));
  const xs = spread(rect.x + 0.5, rect.w - 1.0, cols, 1.2);
  const ys = spread(rect.y + 0.6, rect.h - 1.2, Math.min(rows, 4), 0.68);

  for (const y of ys) {
    for (const x of xs) {
      items.push(box("desk", x, y, 1.2, 0.68));
      items.push(box("chair", x + 0.35, y + 0.82, 0.5, 0.5));
    }
  }
  return items;
}

function lounge(rect) {
  const items = [];
  const rugW = rect.w * 0.52;
  const rugH = rect.h * 0.44;
  const rx = rect.x + (rect.w - rugW) / 2;
  const ry = rect.y + (rect.h - rugH) / 2;

  items.push(box("rug", rx, ry, rugW, rugH));
  items.push(box("sofa", rx + 0.2, ry - 0.9, rugW - 0.4, 0.8));
  items.push(box("sofa", rx + 0.2, ry + rugH + 0.1, rugW - 0.4, 0.8));
  items.push(box("table", rx + rugW * 0.3, ry + rugH * 0.3, rugW * 0.4, rugH * 0.4));

  for (const x of spread(rect.x + 0.6, rect.w - 1.2, 2, 0.6)) {
    items.push(box("plant", x, rect.y + 0.5, 0.6, 0.6));
  }
  items.push(box("counter", rect.x + rect.w - 1.4, rect.y + rect.h * 0.3, 1.0, rect.h * 0.4));
  return items;
}

function restArea(rect) {
  const items = [];
  const xs = spread(rect.x + 0.6, rect.w - 1.2, 2, 1.1);
  const ys = spread(rect.y + 0.8, rect.h - 1.6, 2, 1.1);
  for (const y of ys) {
    for (const x of xs) {
      items.push(box("table", x, y, 1.1, 1.1));
      items.push(box("chair", x - 0.62, y + 0.3, 0.5, 0.5));
      items.push(box("chair", x + 1.22, y + 0.3, 0.5, 0.5));
    }
  }
  items.push(box("plant", rect.x + rect.w - 0.9, rect.y + 0.4, 0.55, 0.55));
  return items;
}

function reception(rect) {
  return [
    box("counter", rect.x + rect.w * 0.2, rect.y + rect.h * 0.22, rect.w * 0.6, 0.85),
    box("sofa", rect.x + rect.w * 0.18, rect.y + rect.h * 0.66, rect.w * 0.3, 0.75),
    box("sofa", rect.x + rect.w * 0.55, rect.y + rect.h * 0.66, rect.w * 0.3, 0.75),
    box("plant", rect.x + 0.5, rect.y + rect.h - 1.2, 0.7, 0.7),
    box("plant", rect.x + rect.w - 1.2, rect.y + rect.h - 1.2, 0.7, 0.7),
  ];
}

function pantry(rect) {
  return [
    box("counter", rect.x + 0.3, rect.y + 0.4, rect.w - 0.6, 0.8),
    box("counter", rect.x + 0.3, rect.y + rect.h - 1.2, rect.w - 0.6, 0.8),
    box("table", rect.x + rect.w * 0.25, rect.y + rect.h * 0.42, rect.w * 0.5, rect.h * 0.18),
  ];
}

function utility(rect, kind) {
  const items = [];
  const count = Math.max(2, Math.round(rect.h / 3));
  for (const y of spread(rect.y + 0.4, rect.h - 0.8, count, 0.7)) {
    items.push(box(kind, rect.x + 0.35, y, rect.w - 0.7, 0.7));
  }
  return items;
}

function booth(rect) {
  return [
    box("desk", rect.x + 0.5, rect.y + rect.h * 0.34, rect.w - 1.0, 0.55),
    box("chair", rect.x + rect.w / 2 - 0.25, rect.y + rect.h * 0.58, 0.5, 0.5),
  ];
}

function executive(rect) {
  return [
    box("desk", rect.x + rect.w * 0.18, rect.y + rect.h * 0.18, rect.w * 0.5, 0.8),
    box("chair", rect.x + rect.w * 0.38, rect.y + rect.h * 0.18 + 1.0, 0.55, 0.55),
    box("table", rect.x + rect.w * 0.25, rect.y + rect.h * 0.58, rect.w * 0.45, 1.0),
    box("chair", rect.x + rect.w * 0.3, rect.y + rect.h * 0.58 - 0.7, 0.5, 0.5),
    box("chair", rect.x + rect.w * 0.52, rect.y + rect.h * 0.58 - 0.7, 0.5, 0.5),
    box("sofa", rect.x + rect.w - 1.3, rect.y + rect.h * 0.3, 0.9, rect.h * 0.35),
    box("plant", rect.x + 0.5, rect.y + rect.h - 1.2, 0.6, 0.6),
  ];
}

function projectRoom(rect, capacity) {
  const items = meetingRoom(rect, capacity);
  items.push(box("shelf", rect.x + rect.w - 0.9, rect.y + 0.5, 0.6, rect.h * 0.4));
  return items;
}

/* ── dispatcher ─────────────────────────────────────────────────────── */

const BY_ID = {
  reception,
  lounge,
  rest: restArea,
  pantry,
  print: (rect) => utility(rect, "shelf"),
  storage: (rect) => utility(rect, "shelf"),
  exec: executive,
  "project-room": projectRoom,
};

export function furnitureFor(space) {
  const recipe = BY_ID[space.id];
  if (recipe) return recipe(space.rect, space.capacity);

  if (space.id.startsWith("booth")) return booth(space.rect);
  if (space.id.startsWith("focus")) return focusZone(space.rect, space.capacity);
  if (space.type === "meeting") return meetingRoom(space.rect, space.capacity);
  if (space.type === "work") return openDesk(space.rect, space.capacity);
  return restArea(space.rect);
}
