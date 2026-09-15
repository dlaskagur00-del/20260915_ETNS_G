import { chip, el } from "../../lib/dom.js";
import { spaceScene } from "../office/spaceScene.js";
import { comparePair } from "../office/visualStage.js";
import { getVisualAsset } from "../../api/assets.js";
import { manwon, won } from "../../lib/format.js";

/**
 * Current / Proposed comparison.
 *
 * Both scenes are rendered by the same renderer from the same coordinate
 * system, sharing one viewBox via `boundsFrom` — so the camera angle is
 * identical by construction rather than by careful image matching.
 */
export function proposalCompare(layout, images) {
  // 실제 렌더 이미지가 있으면 그것으로 비교합니다. 없으면 배치 도식으로 떨어집니다.
  const hasImages =
    images?.currentImageId &&
    getVisualAsset(images.currentImageId)?.status === "ready" &&
    getVisualAsset(images.proposedImageId)?.status === "ready";

  if (hasImages) {
    return el(
      "div",
      {},
      comparePair({
        leftId: images.currentImageId,
        rightId: images.proposedImageId,
        leftLabel: "CURRENT",
        rightLabel: "PROPOSED",
        leftCaption: "현재 공간",
        rightCaption: "AI 제안 공간",
      }),
      layout
        ? el(
            "div",
            { class: "cmp-table", style: { borderTop: "1px solid var(--line)" } },
            ...layout.comparison.map((row) =>
              el(
                "div",
                { class: "cmp-row" },
                el("div", { class: "cmp-rk" }, row.label),
                el("div", { class: "cmp-rb" }, row.before),
                el("div", { class: "cmp-ra-arrow" }, "→"),
                el("div", { class: "cmp-ra" }, row.after)
              )
            )
          )
        : null
    );
  }

  if (!layout) {
    return el(
      "div",
      { class: "empty" },
      el("div", { class: "big" }, "공간 배치 변경이 없는 제안입니다."),
      el("div", {}, "시공 없이 운영 정책만 조정하는 방향이라 Preview가 제공되지 않습니다.")
    );
  }

  const scene = (spaces, variant) =>
    el(
      "div",
      { class: `cmp-col ${variant}` },
      el(
        "div",
        { class: "cmp-head" },
        el("span", { class: "cmp-k" }, variant === "current" ? "CURRENT" : "PROPOSED"),
        el("span", { class: "cmp-t" }, variant === "current" ? "현재 공간" : "AI 제안 공간")
      ),
      el(
        "div",
        { class: "cmp-canvas" },
        spaceScene({
          mode: "iso",
          spaces,
          selectedId: variant === "proposed" ? spaces[0].id : null,
          boundsFrom: layout.boundsFrom,
          maxHeight: 200,
        })
      )
    );

  return el(
    "div",
    {},
    el(
      "div",
      { class: "cmp" },
      scene(layout.current, "current"),
      el("div", { class: "cmp-vs" }, "VS"),
      scene(layout.proposed, "proposed")
    ),
    el(
      "div",
      { class: "cmp-table" },
      ...layout.comparison.map((row) =>
        el(
          "div",
          { class: "cmp-row" },
          el("div", { class: "cmp-rk" }, row.label),
          el("div", { class: "cmp-rb" }, row.before),
          el("div", { class: "cmp-ra-arrow" }, "→"),
          el("div", { class: "cmp-ra" }, row.after)
        )
      )
    )
  );
}

/** Ballpark budget from history — explicitly not a quote. */
export function costEstimate(estimate, match) {
  const { min, max, basis } = estimate;

  return el(
    "div",
    { class: "cost" },
    el(
      "div",
      { class: "cost-head" },
      el("div", { class: "cost-k" }, "AI 예상 예산"),
      el("div", { class: "cost-v" }, `약 ${manwon(min)} ~ ${manwon(max)}`)
    ),
    basis.breakdown
      ? el(
          "div",
          { class: "cost-basis" },
          el("div", { class: "cost-basis-head" }, el("span", {}, "항목별 예상 내역")),
          ...basis.breakdown.map((row) =>
            el(
              "div",
              { class: "cost-row" },
              el("span", { class: "cr-t" }, row.item),
              el("span", { class: "cr-y" }, ""),
              el("span", { class: "cr-c" }, won(row.cost))
            )
          ),
          el(
            "div",
            { class: "cost-row summary" },
            el("span", { class: "cr-t" }, "합계"),
            el("span", { class: "cr-y" }, ""),
            el("span", { class: "cr-c" }, won(basis.breakdown.reduce((sum, r) => sum + r.cost, 0)))
          )
        )
      : null,
    match
      ? el(
          "div",
          { class: "vendor-match" },
          el("div", { class: "vm-head" }, el("span", { class: "vm-k" }, "추천 시공사"), chip("오피스 히스토리 기반 매칭", "accent")),
          el("div", { class: "vm-name" }, match.vendor.name),
          el("div", { class: "vm-reason" }, match.reason),
          match.vendor.cautions?.length
            ? el("div", { class: "vm-caution" }, "⚠ " + match.vendor.cautions[0])
            : null
        )
      : null,
    el(
      "div",
      { class: "cost-basis" },
      el(
        "div",
        { class: "cost-basis-head" },
        el("span", {}, "산출 근거"),
        chip(`유사 프로젝트 ${basis.similarProjects.length}건`)
      ),
      ...basis.similarProjects.map((project) =>
        el(
          "div",
          { class: "cost-row" },
          el("span", { class: "cr-t" }, project.title),
          el("span", { class: "cr-y" }, String(project.year)),
          el("span", { class: "cr-c" }, won(project.cost))
        )
      ),
      el(
        "div",
        { class: "cost-row summary" },
        el("span", { class: "cr-t" }, "평균 공사비"),
        el("span", { class: "cr-y" }, ""),
        el("span", { class: "cr-c" }, manwon(basis.avgCost))
      ),
      el("div", { class: "cost-note" }, basis.note)
    ),
    el(
      "div",
      { class: "cost-disclaimer" },
      "※ 축적된 History로 산출한 참고 범위입니다. 실제 견적이 아니며, 최종 금액은 담당자 검토와 업체 견적으로 확정합니다."
    )
  );
}
