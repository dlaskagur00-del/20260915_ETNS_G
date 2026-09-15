import { chip, contextNote, detailRow, el } from "../../lib/dom.js";
import { CATEGORIES } from "../../api/spaces.js";
import { assetIdForSpaceAsset } from "../../api/assets.js";
import { assetImage } from "../ui/assetImage.js";
import { turntable } from "../office/turntable.js";
import { comparePair } from "../office/visualStage.js";
import { changesOfAsset, getChangeImpact, CHANGE_TYPES as TYPES } from "../../api/history.js";
import { people, pct, signed } from "../../lib/format.js";
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
      // 360° 프레임이 확보된 물건은 돌려볼 수 있고, 아니면 사진 한 장입니다.
      turntable(asset.id, { label: asset.name }) ||
        assetImage(visualId, { ratio: isMaterial ? "1:1" : "4:3", alt: asset.name })
    ),
    el(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" } },
      el("h3", { style: { fontSize: "16.5px" } }, asset.name),
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
    contextNote("특이사항", asset.specialNote),
    assetHistory(asset)
  );
}

/**
 * 이 물건 하나가 거쳐온 이력.
 *
 * 공간 전체 타임라인과 별개로, 선택한 오브젝트만의 변천을 보여줍니다.
 * "언제 무엇에서 무엇으로, 왜 바뀌었나"가 한 줄씩 쌓입니다.
 */
function assetHistory(asset) {
  const rows = changesOfAsset(asset.id);
  if (!rows.length) return null;

  return el(
    "div",
    { class: "asset-history" },
    el("div", { class: "asset-history-k" }, `이 구성 요소의 이력 ${rows.length}건`),
    ...rows.map((change) =>
      el(
        "div",
        { class: "asset-history-row" },
        el("span", { class: "ah-date" }, dotDate(change.changedAt)),
        el(
          "div",
          {},
          el(
            "div",
            { class: "ah-title" },
            change.title,
            el("span", { class: "ah-type" }, TYPES[change.changeType])
          ),
          el("div", { class: "ah-flow" }, `${change.beforeValue} → ${change.afterValue}`),
          el("div", { class: "ah-reason" }, change.reason)
        )
      )
    )
  );
}

/**
 * 변경이 실제로 어떤 결과로 이어졌는지 — 구성 History 안에서 바로 보여줍니다.
 * 이용 History로 넘어가지 않아도 판단의 실마리가 보이도록.
 */
function changeImpactSummary(change) {
  const impact = getChangeImpact(change.id);
  if (!impact) return null;

  const { before, after, delta } = impact;
  return el(
    "div",
    { class: "impact-inline" },
    el("div", { class: "impact-inline-k" }, "변경 이후 이용 데이터"),
    el(
      "div",
      { class: "impact-inline-rows" },
      el(
        "div",
        { class: "impact-inline-row" },
        el("span", {}, "평균 이용 인원"),
        el("b", {}, `${people(before.avgHeadcount)} → ${people(after.avgHeadcount)}`),
        el("i", {}, `${signed(delta.avgHeadcount, 1)}명`)
      ),
      el(
        "div",
        { class: "impact-inline-row" },
        el("span", {}, "이용률"),
        el("b", {}, `${pct(before.utilization, 1)} → ${pct(after.utilization, 1)}`),
        el("i", {}, `${signed(delta.utilization, 1)}%p`)
      )
    ),
    impact.note ? el("div", { class: "impact-inline-note" }, impact.note) : null
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
      el("h3", { style: { fontSize: "16.5px" } }, change.title),
      chip(CHANGE_TYPES[change.changeType]),
      chip(dotDate(change.changedAt))
    ),
    change.beforeImageId || change.afterImageId
      ? el(
          "div",
          { style: { marginBottom: "12px" } },
          comparePair({
            leftId: change.beforeImageId,
            rightId: change.afterImageId,
            leftLabel: "BEFORE",
            rightLabel: "AFTER",
            leftCaption: change.beforeValue,
            rightCaption: change.afterValue,
          })
        )
      : null,
    beforeAfter(change.beforeValue, change.afterValue),
    changeImpactSummary(change),
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
