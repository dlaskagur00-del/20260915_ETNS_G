import { el } from "../../lib/dom.js";
import { getVisualAsset } from "../../api/assets.js";

/**
 * 이미지가 있으면 이미지를, 없으면 무엇이 필요한지 말하는 Placeholder를 그립니다.
 *
 * 요청서 §20·§41의 규칙을 그대로 따릅니다: 가짜 이미지를 만들어 채우지 않고,
 * "이 Asset이 필요하다"를 화면에 남깁니다. 그래야 최종 점검 때 빠진 곳이
 * 눈에 보입니다.
 */

const RATIO_PADDING = {
  "1:1": "100%",
  "4:3": "75%",
  "3:2": "66.67%",
  "8:5": "62.5%",
  "16:9": "56.25%",
};

export function assetPlaceholder(assetId, { ratio = "4:3", compact = false } = {}) {
  const entry = getVisualAsset(assetId);
  const label = entry?.name || assetId || "Visual Asset";

  if (compact) {
    return el("div", { class: "asset-thumb is-empty", title: `${label} — 이미지 준비 중` });
  }

  return el(
    "div",
    { class: "asset-ph", style: { paddingBottom: RATIO_PADDING[ratio] || "75%" } },
    el(
      "div",
      { class: "asset-ph-inner" },
      el("div", { class: "asset-ph-mark" }, "Visual Asset Required"),
      el("div", { class: "asset-ph-name" }, label),
      assetId ? el("div", { class: "asset-ph-id" }, assetId) : null
    )
  );
}

/**
 * @param {string|null} assetId
 * @param {{ratio?:string, alt?:string}} options
 */
export function assetImage(assetId, { ratio, alt } = {}) {
  const entry = assetId ? getVisualAsset(assetId) : null;
  const shape = ratio || entry?.ratio || "4:3";

  if (!entry || entry.status !== "ready") {
    return assetPlaceholder(assetId, { ratio: shape });
  }

  const contained = entry.type === "product" || entry.type === "material";
  const frame = el("div", {
    class: contained ? "asset-frame is-loading is-contained" : "asset-frame is-loading",
    style: { paddingBottom: RATIO_PADDING[shape] || "75%" },
  });

  const img = el("img", {
    class: "asset-img",
    src: entry.url,
    alt: alt || entry.alt || entry.name,
    loading: "lazy",
    decoding: "async",
  });

  // 로드가 끝나야 스켈레톤을 걷습니다 — 깨진 이미지 아이콘은 노출하지 않습니다.
  img.addEventListener("load", () => frame.classList.remove("is-loading"));
  img.addEventListener("error", () => {
    frame.classList.remove("is-loading");
    frame.replaceChildren(assetPlaceholder(assetId, { ratio: shape }).firstChild);
    frame.classList.add("is-error");
  });

  frame.append(img);
  return frame;
}

/** 목록에 붙이는 작은 썸네일. */
export function assetThumb(assetId, { alt } = {}) {
  const entry = assetId ? getVisualAsset(assetId) : null;
  if (!entry || entry.status !== "ready") {
    return assetPlaceholder(assetId, { compact: true });
  }

  const img = el("img", {
    class: entry.type === "product" || entry.type === "material"
      ? "asset-thumb is-contained"
      : "asset-thumb",
    src: entry.thumbnailUrl || entry.url,
    alt: alt || entry.alt || entry.name,
    loading: "lazy",
    decoding: "async",
  });
  img.addEventListener("error", () => img.replaceWith(assetPlaceholder(assetId, { compact: true })));
  return img;
}
