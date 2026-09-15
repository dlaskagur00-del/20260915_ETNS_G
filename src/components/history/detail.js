import { chip, contextNote, detailRow, el } from "../../lib/dom.js";
import { CATEGORIES } from "../../api/spaces.js";
import { assetIdForSpaceAsset } from "../../api/assets.js";
import { assetImage } from "../ui/assetImage.js";
import { CHANGE_TYPES } from "../../api/history.js";
import { dotDate, won } from "../../lib/format.js";

export function beforeAfter(beforeValue, afterValue) {
  return el(
    "div",
    { class: "ba" },
    el("div", { class: "ba-col" }, el("div", { class: "ba-k" }, "변경 전"), el("div", { class: "ba-v" }, beforeValue)),
    el("div", { class: "ba-arrow" }, "→"),
    el("div", { class: "ba-col after" }, el("div", { class: "ba-k" }, "변경 후"), el("div", { class: "ba-v" }, afterValue))
  );
}

/** Asset detail — the "현재 상태" panel from the brief. */
export function assetDetail(asset) {
  const visualId = assetIdForSpaceAsset(asset);
  const isMaterial = ["floor", "wall", "ceiling"].includes(asset.category);

  return el(
    "div",
    {},
    el(
      "div",
      { class: isMaterial ? "asset-visual is-material" : "asset-visual" },
      assetImage(visualId, { ratio: isMaterial ? "1:1" : "4:3", alt: asset.name })
    ),
    el(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" } },
      el("h3", { style: { fontSize: "15px" } }, asset.name),
      chip(CATEGORIES[asset.category]),
      chip(asset.status, asset.status === "사용 중" ? "ok" : "warn")
    ),
    detailRow("제조사", asset.manufacturer),
    detailRow("모델", asset.model, { mono: true }),
    asset.material !== "-" ? detailRow("소재", asset.material) : null,
    detailRow("구매일", dotDate(asset.purchaseDate), { mono: true }),
    detailRow("설치일", dotDate(asset.installDate), { mono: true }),
    detailRow("구매 업체", asset.vendor),
    detailRow("구매 금액", won(asset.cost), { mono: true }),
    asset.previousProduct
      ? el(
          "div",
          { style: { marginTop: "12px" } },
          el("div", { class: "eyebrow", style: { marginBottom: "5px" } }, "이전 제품"),
          beforeAfter(asset.previousProduct, `${asset.manufacturer} ${asset.model}`)
        )
      : null,
    contextNote("교체 사유", asset.replacementReason),
    contextNote("특이사항", asset.specialNote)
  );
}

/** Change event detail — before / after plus the context around the decision. */
export function changeDetail(change, { onCompareUsage } = {}) {
  return el(
    "div",
    {},
    el(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" } },
      el("h3", { style: { fontSize: "15px" } }, change.title),
      chip(CHANGE_TYPES[change.changeType]),
      chip(dotDate(change.changedAt))
    ),
    beforeAfter(change.beforeValue, change.afterValue),
    el("div", { style: { height: "12px" } }),
    detailRow("변경 일자", dotDate(change.changedAt), { mono: true }),
    detailRow("담당 업체", change.vendor),
    detailRow("기록자", change.recordedBy || "-"),
    detailRow("비용", won(change.cost), { mono: true }),
    detailRow("시공 기간", `${change.durationDays}일`, { mono: true }),
    detailRow(
      "관련 파일",
      change.attachments.length
        ? el("div", { class: "files" }, ...change.attachments.map((file) => el("span", { class: "file-chip" }, file)))
        : "없음"
    ),
    contextNote("변경 사유", change.reason),
    contextNote("특이사항", change.note),
    change.impactWindow && onCompareUsage
      ? el(
          "div",
          { style: { marginTop: "14px" } },
          el(
            "button",
            { class: "btn primary", style: { width: "100%", justifyContent: "center" }, onClick: onCompareUsage },
            "이 변경의 이용 데이터 비교 ",
            el("span", { class: "arrow" }, "→")
          )
        )
      : null
  );
}
