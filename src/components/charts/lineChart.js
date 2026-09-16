import { svg } from "../../lib/dom.js";

/**
 * Utilisation trend with space-change events marked on the same axis.
 *
 * This overlay is the point of the product: the moment a space was changed and
 * what actually happened to its usage afterwards sit in one picture, so the
 * "12인으로 확장했지만 이용은 그대로"라는 사실이 설명 없이 읽힙니다.
 */

const W = 640;
const H = 250;
const PAD = { top: 26, right: 16, bottom: 34, left: 38 };

export function lineChart({
  series,
  markers = [],
  selectedMarkerId = null,
  onMarkerSelect = null,
  yMin = 0,
  yMax = 100,
  labelEvery = 1,
}) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const stepX = series.length > 1 ? innerW / (series.length - 1) : 0;

  const xAt = (index) => PAD.left + index * stepX;
  const yAt = (value) => PAD.top + innerH - ((value - yMin) / (yMax - yMin)) * innerH;

  const ticks = [0, 25, 50, 75, 100].filter((t) => t >= yMin && t <= yMax);

  const gridlines = ticks.flatMap((tick) => [
    svg("line", {
      x1: PAD.left, x2: W - PAD.right, y1: yAt(tick), y2: yAt(tick),
      stroke: "var(--line)", "stroke-width": "1",
    }),
    svg("text", {
      x: PAD.left - 7, y: yAt(tick) + 3.5,
      "text-anchor": "end",
      style: { fontSize: "12.5px", fill: "var(--text-3)", fontFamily: "var(--font-mono)" },
    }, String(tick)),
  ]);

  const areaPoints = [
    `${xAt(0)},${yAt(yMin)}`,
    ...series.map((point, index) => `${xAt(index)},${yAt(point.value)}`),
    `${xAt(series.length - 1)},${yAt(yMin)}`,
  ].join(" ");

  const linePoints = series.map((point, index) => `${xAt(index)},${yAt(point.value)}`).join(" ");

  const markerNodes = markers.flatMap((marker) => {
    const index = series.findIndex((point) => point.periodKey === marker.periodKey);
    if (index < 0) return [];
    const x = xAt(index);
    const isSelected = marker.id === selectedMarkerId;

    const group = svg("g", {
      class: isSelected ? "chg-marker is-selected" : "chg-marker",
      role: "button",
      tabindex: "0",
      "aria-label": `${marker.label} 변경 이벤트`,
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
      svg("line", {
        class: "chg-line",
        x1: x, x2: x, y1: PAD.top - 12, y2: PAD.top + innerH,
        "stroke-dasharray": "3 3",
      }),
      svg("rect", { x: x - 9, y: PAD.top - 20, width: 18, height: 14, class: "chg-flag" }),
      svg("text", {
        x, y: PAD.top - 10, "text-anchor": "middle",
        style: { fontSize: "10.5px", fontFamily: "var(--font-mono)", fill: "#fff", pointerEvents: "none" },
      }, "변경"),
      isSelected
        ? svg("text", {
            x, y: PAD.top + innerH + 30, "text-anchor": "middle",
            style: { fontSize: "12.5px", fontFamily: "var(--font-sans)", fill: "var(--accent-deep)", fontWeight: "600" },
          }, marker.label)
        : null
    );
    return [group];
  });

  const dots = series.map((point, index) =>
    svg("circle", {
      cx: xAt(index), cy: yAt(point.value), r: index === series.length - 1 ? 4 : 2.6,
      fill: index === series.length - 1 ? "var(--accent)" : "var(--surface)",
      stroke: "var(--accent)", "stroke-width": "1.6",
    })
  );

  const valueLabels = series.map((point, index) =>
    index % labelEvery === 0 || index === series.length - 1
      ? svg("text", {
          x: xAt(index), y: yAt(point.value) - 9, "text-anchor": "middle",
          style: {
            fontSize: "12.5px",
            fontFamily: "var(--font-mono)",
            fill: index === series.length - 1 ? "var(--accent-deep)" : "var(--text-3)",
            fontWeight: index === series.length - 1 ? "600" : "400",
          },
        }, `${Math.round(point.value)}`)
      : null
  );

  const xLabels = series.map((point, index) =>
    index % labelEvery === 0 || index === series.length - 1
      ? svg("text", {
          x: xAt(index), y: H - 14, "text-anchor": "middle",
          style: { fontSize: "12.5px", fontFamily: "var(--font-mono)", fill: "var(--text-3)" },
        }, point.label)
      : null
  );

  return svg(
    "svg",
    {
      viewBox: `0 0 ${W} ${H}`,
      style: { width: "100%", height: "auto" },
      role: "img",
      "aria-label": "이용률 추이",
    },
    ...gridlines,
    svg("polygon", { points: areaPoints, fill: "var(--accent)", opacity: "0.08" }),
    svg("polyline", {
      points: linePoints, fill: "none", stroke: "var(--accent)",
      "stroke-width": "2", "stroke-linejoin": "round", "stroke-linecap": "round",
    }),
    ...markerNodes,
    ...dots,
    ...valueLabels,
    ...xLabels
  );
}
