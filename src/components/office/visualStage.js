import { el } from "../../lib/dom.js";
import { getVisualAsset } from "../../api/assets.js";

/**
 * 이미지 위에 공간 선택 영역을 얹는 무대.
 *
 * 이미지 자체에는 히트맵도 라벨도 넣지 않습니다. 색과 선택 상태는 전부 위에
 * 겹치는 레이어라, 기간 필터가 바뀌면 이미지는 그대로 두고 색만 다시 칠합니다.
 *
 * 이미지가 없으면 `fallback`(기존 SVG 씬)을 대신 그립니다.
 */

function heatColor(value) {
  if (value === undefined || value === null) return null;
  if (value >= 84) return "var(--heat-5)";
  if (value >= 74) return "var(--heat-4)";
  if (value >= 64) return "var(--heat-3)";
  if (value >= 52) return "var(--heat-2)";
  return "var(--heat-1)";
}

/**
 * 전체화면 확대.
 *
 * 발표 중 "이 부분 보세요" 하는 순간을 위한 것입니다. 1920 화면에서 1440px까지
 * 커지는데 원본이 1536px이라 여전히 업스케일이 아닙니다. 핫스팟은 일부러 빼서
 * 이미지 하나만 보이게 합니다 — 확대의 목적이 선택이 아니라 관찰이라서요.
 */
function openLightbox(entry) {
  const img = el("img", { class: "lightbox__image", src: entry.url, alt: entry.alt || entry.name });
  const overlay = el(
    "div",
    { class: "lightbox", role: "dialog", "aria-label": entry.name },
    img,
    el("div", { class: "lightbox__cap" }, entry.name),
    el("button", { class: "lightbox__close", type: "button", "aria-label": "닫기" }, "✕")
  );

  const close = () => {
    overlay.remove();
    document.removeEventListener("keydown", onKey);
  };
  function onKey(event) {
    if (event.key === "Escape") close();
  }

  overlay.addEventListener("click", close);
  document.addEventListener("keydown", onKey);
  document.body.append(overlay);
}

export function visualStage({
  assetId,
  hotspots = [],
  selectedId = null,
  onSelect = null,
  heat = null,
  fallback = null,
  maxHeight = 460,
}) {
  const entry = getVisualAsset(assetId);

  if (!entry || entry.status !== "ready") {
    // 이미지가 아직 없으면 기존 SVG 씬을 그대로 씁니다 — 화면이 비지 않도록.
    if (fallback) return fallback;
    return el(
      "div",
      { class: "visual-fallback" },
      el("div", { class: "asset-ph-mark" }, "Visual Asset Required"),
      el("div", {}, entry?.name || assetId)
    );
  }

  const stage = el("div", { class: "visual-stage" });

  const img = el("img", {
    class: "visual-stage__image",
    src: entry.url,
    alt: entry.alt || entry.name,
    decoding: "async",
  });

  const layer = el("div", { class: "visual-stage__layer" });

  for (const spot of hotspots) {
    const isSelected = spot.spaceId === selectedId;
    const value = heat ? heat.get(spot.spaceId) : undefined;
    const fill = heat ? heatColor(value) : null;

    const button = el(
      "button",
      {
        class: [
          "space-hotspot",
          isSelected ? "is-selected" : "",
          heat ? "is-heat" : "",
        ],
        style: {
          left: `${spot.x}%`,
          top: `${spot.y}%`,
          width: `${spot.w}%`,
          height: `${spot.h}%`,
          ...(fill ? { backgroundColor: fill } : {}),
        },
        type: "button",
        "aria-label": spot.label,
        "aria-pressed": isSelected ? "true" : "false",
        onClick: onSelect ? () => onSelect(spot.spaceId) : null,
      },
      el(
        "span",
        { class: "space-hotspot__label" },
        spot.label,
        value !== undefined && value !== null
          ? el("b", {}, ` ${value}%`)
          : null
      )
    );
    layer.append(button);
  }

  // 이미지는 1536px인데 한때 645px로 줄여 쓰고 있었습니다. 폭이 먼저 차도록
  // 세로 여유를 크게 주면, 같은 이미지가 패널 폭만큼 커집니다 — 원본을 넘지
  // 않으므로 확대가 아니라 갖고 있던 픽셀을 꺼내 쓰는 것입니다.
  // 세로는 vh로 묶어 작은 화면에서 화면 밖으로 밀려나지 않게 합니다.
  img.style.maxHeight = `min(${maxHeight}px, 68vh)`;
  stage.append(img, layer);

  return el(
    "div",
    { class: "visual-stage-wrap" },
    stage,
    el(
      "button",
      {
        class: "stage-zoom",
        type: "button",
        title: "전체화면으로 크게 보기",
        "aria-label": "전체화면으로 크게 보기",
        onClick: () => openLightbox(entry),
      },
      "⤢ 크게 보기"
    )
  );
}

/** 같은 공간을 두 이미지로 나란히 비교합니다. */
export function comparePair({ leftId, rightId, leftLabel, rightLabel, leftCaption, rightCaption }) {
  const side = (assetId, label, caption, variant) => {
    const entry = getVisualAsset(assetId);
    const body =
      entry && entry.status === "ready"
        ? el("img", { src: entry.url, alt: entry.alt || entry.name, decoding: "async" })
        : el(
            "div",
            { class: "visual-fallback" },
            el("div", { class: "asset-ph-mark" }, "Visual Asset Required"),
            el("div", {}, entry?.name || assetId)
          );

    return el(
      "div",
      { class: `compare-col ${variant}` },
      el(
        "div",
        { class: "compare-head" },
        el("span", { class: "compare-k" }, label),
        caption ? el("span", { class: "compare-c" }, caption) : null
      ),
      el("div", { class: "compare-media" }, body)
    );
  };

  return el(
    "div",
    { class: "compare-grid" },
    side(leftId, leftLabel, leftCaption, "before"),
    side(rightId, rightLabel, rightCaption, "after")
  );
}
