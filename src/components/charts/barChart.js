import { svg } from "../../lib/dom.js";

const W = 340;
const H = 168;
const PAD = { top: 18, right: 8, bottom: 26, left: 8 };

/** Hourly usage pattern. The peak band is emphasised, the rest stays quiet. */
export function barChart({ data, highlightIndex = null }) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const max = Math.max(...data.map((d) => d.value), 10);
  const slot = innerW / data.length;
  const barW = Math.min(44, slot * 0.62);

  const peakIndex =
    highlightIndex ?? data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);

  const bars = data.flatMap((item, index) => {
    const height = (item.value / max) * innerH;
    const x = PAD.left + slot * index + (slot - barW) / 2;
    const y = PAD.top + innerH - height;
    const isPeak = index === peakIndex;

    return [
      svg("rect", {
        x, y, width: barW, height: Math.max(2, height),
        fill: isPeak ? "var(--accent)" : "var(--surface-3)",
        stroke: isPeak ? "var(--accent)" : "var(--line-strong)",
        "stroke-width": "1",
      }),
      svg("text", {
        x: x + barW / 2, y: y - 5, "text-anchor": "middle",
        style: {
          fontSize: "12.5px", fontFamily: "var(--font-mono)",
          fill: isPeak ? "var(--accent-deep)" : "var(--text-3)",
          fontWeight: isPeak ? "600" : "400",
        },
      }, String(item.value)),
      svg("text", {
        x: x + barW / 2, y: H - 9, "text-anchor": "middle",
        style: {
          fontSize: "12.5px", fontFamily: "var(--font-mono)",
          fill: isPeak ? "var(--accent-deep)" : "var(--text-3)",
        },
      }, item.label),
    ];
  });

  return svg(
    "svg",
    { viewBox: `0 0 ${W} ${H}`, style: { width: "100%", height: "auto" }, role: "img", "aria-label": "시간대별 이용 패턴" },
    ...bars
  );
}
