import { svg } from "../../lib/dom.js";
import {
  isoBounds, isoBox, isoDepthSort, isoGround, isoPoint, isoSlab, planBounds, planRect,
  PLAN_UNIT as PLAN_UNIT_REF, SLAB_HEIGHT as SLAB_HEIGHT_REF,
} from "../../lib/iso.js";
import { FURNITURE_STYLE, furnitureFor } from "../../lib/furniture.js";

const ENCLOSED = new Set(["meeting"]);

/**
 * One renderer for every view of the office.
 *
 * mode "iso"  — the isometric office used by 공간 구성 History
 * mode "plan" — the flat floor map used by 공간 이용 History (with heat fill)
 *
 * Both read the same plan rectangles, so a space keeps its identity and
 * proportions across screens; nothing is hand-placed twice.
 */

const TYPE_FILL = {
  meeting: "var(--surface-3)",
  work: "var(--surface-2)",
  common: "#f2ece3",
};

function heatFill(value) {
  if (value >= 84) return "var(--heat-5)";
  if (value >= 74) return "var(--heat-4)";
  if (value >= 64) return "var(--heat-3)";
  if (value >= 52) return "var(--heat-2)";
  return "var(--heat-1)";
}

function shade(color, amount) {
  return `color-mix(in srgb, ${color} ${100 - amount}%, #4a4038 ${amount}%)`;
}

function labelFor(space, heat, mode) {
  if (mode === "plan" && heat !== undefined) return `${heat}%`;
  return `${space.capacity > 0 ? space.capacity + "인" : "—"}`;
}

export function spaceScene({
  mode = "iso",
  spaces,
  selectedId = null,
  heat = null,
  onSelect = null,
  maxHeight = 460,
  markers = [],
  onMarkerSelect = null,
  boundsFrom = null,
}) {
  // boundsFrom lets two scenes share one viewBox — how Current and Proposed
  // layouts end up at an identical camera angle instead of being eyeballed.
  const rects = (boundsFrom || spaces.map((space) => space.rect));
  const box = mode === "iso" ? isoBounds(rects) : planBounds(rects);
  const ordered = mode === "iso" ? isoDepthSort(spaces) : spaces;
  const labels = [];

  const children = ordered.map((space) => {
    const isSelected = space.id === selectedId;
    const heatValue = heat ? heat.get(space.id) : undefined;
    const baseFill = heat ? heatFill(heatValue) : TYPE_FILL[space.type];

    const group = svg(
      "g",
      {
        class: isSelected ? "sp-floor is-selected" : "sp-floor",
        role: "button",
        tabindex: "0",
        "aria-label": space.name,
        onClick: onSelect ? () => onSelect(space.id) : null,
        onKeydown: onSelect
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(space.id);
              }
            }
          : null,
      }
    );

    if (mode === "iso") {
      // A selected space lifts off the plate — the model equivalent of a
      // highlight, and far easier to read at a glance than an outline alone.
      const plateTop = SLAB_HEIGHT_REF + (isSelected ? 0.5 : 0);
      const slab = isoSlab(space.rect, plateTop);

      group.append(
        svg("polygon", { points: slab.left, fill: shade(baseFill, 30), stroke: "var(--line-strong)", "stroke-width": "0.6" }),
        svg("polygon", { points: slab.right, fill: shade(baseFill, 16), stroke: "var(--line-strong)", "stroke-width": "0.6" }),
        svg("polygon", {
          class: "sp-top",
          points: slab.top,
          fill: baseFill,
          stroke: isSelected ? "var(--accent)" : "var(--line-strong)",
          "stroke-width": isSelected ? "1.4" : "0.7",
        })
      );

      // Glass partitions on the two far edges of enclosed rooms — enough to
      // read as a room without hiding what is inside.
      if (ENCLOSED.has(space.type) || space.id?.startsWith("booth")) {
        const { x, y, w, h } = space.rect;
        for (const wall of [
          { x, y, w, h: 0.14 },
          { x: x + w - 0.14, y, w: 0.14, h },
        ]) {
          const box = isoBox(wall, plateTop, 1.05);
          group.append(
            svg("polygon", { points: box.left, fill: "#cfd6d9", opacity: "0.72" }),
            svg("polygon", { points: box.right, fill: "#dde3e5", opacity: "0.72" }),
            svg("polygon", { points: box.top, fill: "#eaeef0", opacity: "0.85" })
          );
        }
      }

      for (const piece of space.furniture || furnitureFor(space)) {
        const style = FURNITURE_STYLE[piece.kind] || FURNITURE_STYLE.table;
        const box = isoBox(piece.rect, plateTop, piece.h || 0.4);
        group.append(
          svg("polygon", { points: box.left, fill: style.left }),
          svg("polygon", { points: box.right, fill: style.right }),
          svg("polygon", { points: box.top, fill: style.top, stroke: style.left, "stroke-width": "0.3" })
        );
      }

      // Labels are collected and drawn in a final pass: a nearer floor plate
      // would otherwise paint over the name of the space behind it.
      labels.push(
        svg("text", { class: isSelected ? "sp-label is-selected" : "sp-label", x: slab.center.x, y: slab.center.y - 1 }, space.name),
        svg("text", { class: "sp-sublabel", x: slab.center.x, y: slab.center.y + 9 }, labelFor(space, heatValue, mode))
      );
    } else {
      const r = planRect(space.rect);
      group.append(
        svg("rect", {
          class: "sp-top",
          x: r.x, y: r.y, width: r.width, height: r.height,
          fill: baseFill,
          stroke: "var(--surface)",
          "stroke-width": "2",
        }),
        svg("rect", {
          class: "sp-outline",
          x: r.x + 1, y: r.y + 1, width: r.width - 2, height: r.height - 2,
          fill: "none",
          stroke: isSelected ? "var(--accent)" : "transparent",
          "stroke-width": isSelected ? "2.5" : "0",
        }),
        svg("text", { class: isSelected ? "sp-label is-selected" : "sp-label", x: r.center.x, y: r.center.y - 1 }, space.name),
        svg("text", { class: "sp-sublabel", x: r.center.x, y: r.center.y + 10 }, labelFor(space, heatValue, mode))
      );
    }

    return group;
  });

  // Asset hotspots for the selected space, drawn above every floor plate.
  for (const marker of markers) {
    const point = mode === "iso" ? isoPoint(marker.x, marker.y) : {
      x: marker.x * PLAN_UNIT_REF,
      y: marker.y * PLAN_UNIT_REF,
    };
    const group = svg("g", {
      class: marker.selected ? "asset-pin is-selected" : "asset-pin",
      role: "button",
      tabindex: "0",
      "aria-label": marker.label,
      onClick: onMarkerSelect ? () => onMarkerSelect(marker.id) : null,
      onKeydown: onMarkerSelect
        ? (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onMarkerSelect(marker.id);
            }
          }
        : null,
    });
    group.append(
      svg("circle", { cx: point.x, cy: point.y, r: marker.selected ? 6.5 : 5, class: "pin-dot" }),
      marker.selected
        ? svg("text", { class: "pin-label", x: point.x, y: point.y - 11 }, marker.label)
        : null
    );
    children.push(group);
  }

  const ground =
    mode === "iso"
      ? [
          svg("polygon", {
            points: isoGround(spaces.map((s) => s.rect)),
            fill: "var(--text-3)",
            opacity: "0.14",
            transform: "translate(3, 6)",
          }),
          svg("polygon", {
            points: isoGround(spaces.map((s) => s.rect)),
            fill: "var(--surface-3)",
            stroke: "var(--line-strong)",
            "stroke-width": "0.8",
          }),
        ]
      : [];

  return svg(
    "svg",
    {
      viewBox: `${box.minX.toFixed(1)} ${box.minY.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`,
      style: { maxHeight: `min(${maxHeight}px, 46vh)`, width: "100%" },
      preserveAspectRatio: "xMidYMid meet",
      role: "group",
      "aria-label": mode === "iso" ? "아이소메트릭 오피스" : "오피스 평면도",
    },
    ...ground,
    ...children,
    ...labels
  );
}

export function heatLegend() {
  const steps = [
    { fill: "var(--heat-1)", label: "~51" },
    { fill: "var(--heat-2)", label: "52–63" },
    { fill: "var(--heat-3)", label: "64–73" },
    { fill: "var(--heat-4)", label: "74–83" },
    { fill: "var(--heat-5)", label: "84~" },
  ];

  const bar = svg(
    "svg",
    { viewBox: "0 0 290 32", style: { width: "290px", height: "32px" }, "aria-label": "이용률 범례" },
    ...steps.flatMap((step, index) => [
      svg("rect", { x: index * 58, y: 0, width: 58, height: 12, fill: step.fill }),
      svg("text", {
        x: index * 58 + 29, y: 28,
        "text-anchor": "middle",
        style: { fontSize: "13px", fill: "var(--text-2)", fontFamily: "var(--font-mono)" },
      }, step.label),
    ])
  );

  return bar;
}
