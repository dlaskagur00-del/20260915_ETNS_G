/**
 * Plan coordinates (metres, x right / y down) projected to a 2:1 isometric view.
 * Every space is authored once as a plan rectangle; both the Isometric Office
 * and the 2D Floor Map derive their geometry from that single source, which is
 * what keeps a space's shape identical across screens (and in AI proposals).
 */

const COS30 = 0.866;
const SIN30 = 0.5;

export const ISO_UNIT = 9; // px per metre along the projected axes
export const PLAN_UNIT = 11; // px per metre in the flat floor map
export const SLAB_HEIGHT = 0.75; // metres of extrusion under each floor plate

export function project(x, y, z = 0) {
  return {
    x: (x - y) * COS30 * ISO_UNIT,
    y: ((x + y) * SIN30 - z) * ISO_UNIT,
  };
}

function pts(points) {
  return points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

/** Extruded floor plate for one rectangular space. */
export function isoSlab(rect, height = SLAB_HEIGHT) {
  const { x, y, w, h } = rect;
  const x2 = x + w;
  const y2 = y + h;

  const topCorners = [
    project(x, y, height),
    project(x2, y, height),
    project(x2, y2, height),
    project(x, y2, height),
  ];

  // Only the two faces pointing toward the viewer are visible.
  const leftFace = [topCorners[3], topCorners[2], project(x2, y2, 0), project(x, y2, 0)];
  const rightFace = [topCorners[2], topCorners[1], project(x2, y, 0), project(x2, y2, 0)];

  return {
    top: pts(topCorners),
    left: pts(leftFace),
    right: pts(rightFace),
    center: project(x + w / 2, y + h / 2, height),
  };
}

/** A box sitting on top of a floor plate — furniture inside a space. */
export function isoBox(rect, base = SLAB_HEIGHT, height = 0.4) {
  const { x, y, w, h } = rect;
  const x2 = x + w;
  const y2 = y + h;
  const top = base + height;

  const topCorners = [
    project(x, y, top), project(x2, y, top), project(x2, y2, top), project(x, y2, top),
  ];

  return {
    top: pts(topCorners),
    left: pts([topCorners[3], topCorners[2], project(x2, y2, base), project(x, y2, base)]),
    right: pts([topCorners[2], topCorners[1], project(x2, y, base), project(x2, y2, base)]),
  };
}

/** Flat floor-map rectangle. */
export function planRect(rect) {
  return {
    x: rect.x * PLAN_UNIT,
    y: rect.y * PLAN_UNIT,
    width: rect.w * PLAN_UNIT,
    height: rect.h * PLAN_UNIT,
    center: {
      x: (rect.x + rect.w / 2) * PLAN_UNIT,
      y: (rect.y + rect.h / 2) * PLAN_UNIT,
    },
  };
}

/** Projected point for furniture / hotspots inside a space. */
export function isoPoint(x, y, height = SLAB_HEIGHT) {
  return project(x, y, height);
}

/** The base plate the whole office model sits on. */
export function isoGround(rects, pad = 1.4) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const rect of rects) {
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.w);
    maxY = Math.max(maxY, rect.y + rect.h);
  }
  const corners = [
    project(minX - pad, minY - pad, 0),
    project(maxX + pad, minY - pad, 0),
    project(maxX + pad, maxY + pad, 0),
    project(minX - pad, maxY + pad, 0),
  ];
  return corners.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

export function isoBounds(rects, pad = 26) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const rect of rects) {
    const corners = [
      project(rect.x, rect.y, SLAB_HEIGHT),
      project(rect.x + rect.w, rect.y, SLAB_HEIGHT),
      project(rect.x + rect.w, rect.y + rect.h, 0),
      project(rect.x, rect.y + rect.h, 0),
      project(rect.x + rect.w, rect.y + rect.h, SLAB_HEIGHT),
    ];
    for (const point of corners) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
  }

  return {
    minX: minX - pad,
    minY: minY - pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  };
}

export function planBounds(rects, pad = 18) {
  let maxX = 0;
  let maxY = 0;
  for (const rect of rects) {
    maxX = Math.max(maxX, (rect.x + rect.w) * PLAN_UNIT);
    maxY = Math.max(maxY, (rect.y + rect.h) * PLAN_UNIT);
  }
  return { minX: -pad, minY: -pad, width: maxX + pad * 2, height: maxY + pad * 2 };
}

/**
 * Painter's algorithm: spaces further from the viewer (smaller x+y) are drawn
 * first so nearer plates overlap them correctly.
 */
export function isoDepthSort(spaces) {
  return [...spaces].sort((a, b) => {
    const da = a.rect.x + a.rect.y;
    const db = b.rect.x + b.rect.y;
    return da - db;
  });
}
