import { chip, el } from "../../lib/dom.js";
import { CHANGE_TYPES } from "../../api/history.js";
import { dotDate, people, pct, signed } from "../../lib/format.js";

function metric(label, beforeValue, afterValue, deltaText, deltaTone) {
  return el(
    "div",
    { class: "impact-row" },
    el("div", { class: "impact-k" }, label),
    el("div", { class: "impact-v before" }, beforeValue),
    el("div", { class: "impact-arrow" }, "→"),
    el("div", { class: "impact-v after" }, afterValue),
    el("div", { class: `impact-delta ${deltaTone}` }, deltaText)
  );
}

function tone(value, threshold) {
  if (Math.abs(value) < threshold) return "flat";
  return value > 0 ? "up" : "down";
}

/**
 * 공간 구성 History × 공간 이용 History.
 * The numbers are computed from the monthly series around the change date, so
 * this panel reports what actually happened rather than a stored conclusion.
 */
export function changeImpact(impact) {
  const { change, before, after, delta } = impact;

  return el(
    "div",
    { class: "impact" },
    el(
      "div",
      { class: "impact-head" },
      el(
        "div",
        {},
        el("div", { class: "impact-title" }, change.title),
        el("div", { class: "impact-sub" }, `${dotDate(change.changedAt)} · ${change.beforeValue} → ${change.afterValue}`)
      ),
      chip(CHANGE_TYPES[change.changeType], "accent")
    ),
    el(
      "div",
      { class: "impact-table" },
      el(
        "div",
        { class: "impact-legend" },
        el("span", {}, `변경 전 ${before.months}개월`),
        el("span", {}, `변경 후 ${after.months}개월`)
      ),
      metric(
        "이용률",
        pct(before.utilization, 1),
        pct(after.utilization, 1),
        signed(delta.utilization, 1) + "%p",
        tone(delta.utilization, 3)
      ),
      metric(
        "평균 이용 인원",
        people(before.avgHeadcount),
        people(after.avgHeadcount),
        signed(delta.avgHeadcount, 1) + "명",
        tone(delta.avgHeadcount, 0.5)
      ),
      metric(
        "평균 체류 시간",
        `${before.avgDurationMin}분`,
        `${after.avgDurationMin}분`,
        signed(delta.avgDurationMin) + "분",
        tone(delta.avgDurationMin, 5)
      )
    ),
    impact.note ? el("div", { class: "impact-note" }, impact.note) : null
  );
}
