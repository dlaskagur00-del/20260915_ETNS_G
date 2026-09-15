import { el } from "../../lib/dom.js";
import { listChanges } from "../../api/history.js";
import { getSessions, getFullSeries } from "../../api/usage.js";
import { listProjects } from "../../api/project.js";
import { listVendors } from "../../api/vendors.js";
import { listAssets } from "../../api/spaces.js";

/**
 * AI 관점 — "이 추천은 무엇을 보고 나온 것인가".
 *
 * 결론만 보여주면 담당자가 그 판단을 검증할 수 없습니다. 여기서는 AI가 실제로
 * 읽은 기록의 양, 거친 추론 단계, 각 근거의 비중, 그리고 **보지 못한 것**까지
 * 드러냅니다. 마지막 항목이 특히 중요합니다 — 최종 선택이 사람의 몫인 이유가
 * 바로 거기 있기 때문입니다.
 */

/** AI가 읽은 기록의 양 — 데이터에서 직접 셉니다. */
function scanScope(spaceId) {
  const changes = listChanges(spaceId).length;
  const assets = listAssets(spaceId).length;
  const months = getFullSeries(spaceId).length;
  const sessions = getSessions(spaceId, "month", "2026-09-14").length;
  const projects = listProjects().filter((p) => p.spaceIds.includes(spaceId)).length;
  const vendors = listVendors().length;

  return [
    { label: "공간 변경 이력", value: `${changes}건`, source: "공간 구성 History" },
    { label: "구성 요소 기록", value: `${assets}개`, source: "공간 구성 History" },
    { label: "월별 이용 집계", value: `${months}개월`, source: "공간 이용 History" },
    { label: "최근 30일 이용 로그", value: `${sessions}건`, source: "공간 이용 History" },
    { label: "완료 프로젝트", value: `${projects}건`, source: "Project Asset" },
    { label: "거래 업체 기록", value: `${vendors}곳`, source: "업체 History" },
  ];
}

const REASONING = [
  {
    step: "관측",
    text: "정원 12석 대비 최근 6개월 평균 이용 인원이 4.2명으로, 좌석의 약 35%만 쓰이고 있습니다.",
  },
  {
    step: "비교",
    text: "같은 오피스의 6인 이하 회의실(B·E·G)은 평균 2.6~3.8명으로 정원 대비 이용률이 더 높습니다.",
  },
  {
    step: "가설",
    text: "회의실이 부족한 것이 아니라, 실제 회의 규모에 맞는 크기의 방이 부족한 것일 수 있습니다.",
  },
  {
    step: "검증",
    text: "2024.01 확장 기록을 찾아 전후를 비교했습니다. 규모를 8인에서 12인으로 늘렸지만 평균 이용 인원은 4.1명에서 4.3명으로, 이용률은 65%에서 66%로 거의 움직이지 않았습니다.",
  },
  {
    step: "결론",
    text: "규모 확장은 이미 한 번 시도되었고 효과가 제한적이었습니다. 같은 면적을 둘로 나누는 방향을 검토해볼 수 있습니다.",
  },
];

const WEIGHTS = [
  { label: "확장 전후 이용 변화", weight: 40, note: "같은 공간에서 이미 검증된 결과라 가장 무겁게 봤습니다" },
  { label: "회의 규모 분포 (4~6인 78%)", weight: 30, note: "수요의 실제 모양을 보여줍니다" },
  { label: "정원 대비 이용 인원", weight: 20, note: "단독으로는 약한 근거라 보조로만 썼습니다" },
  { label: "유사 프로젝트 비용 실적", weight: 10, note: "판단이 아니라 비용 범위 산출에만 썼습니다" },
];

const BLIND_SPOTS = [
  "예약은 되었으나 실제로 쓰이지 않은 회의(노쇼)는 이용 로그에 남지 않습니다.",
  "향후 조직 개편이나 채용 계획은 이 기록에 없습니다. 인원이 늘 예정이라면 결론이 달라집니다.",
  "대외 미팅처럼 규모보다 격식이 중요한 용도는 인원 수만으로 판단할 수 없습니다.",
  "분할 시 생기는 방음·환기 문제는 과거 기록에 사례가 없어 예측하지 못했습니다.",
];

export function aiLens(insight, spaceName) {
  const scope = scanScope(insight.spaceId);
  const total = scope.reduce((sum, row) => sum + parseInt(row.value, 10), 0);

  return el(
    "div",
    { class: "ai-lens" },

    el(
      "div",
      { class: "lens-block" },
      el("div", { class: "lens-k" }, `읽은 기록 — ${spaceName} 관련 ${total}건`),
      el(
        "div",
        { class: "lens-scope" },
        ...scope.map((row) =>
          el(
            "div",
            { class: "lens-scope-row" },
            el("span", { class: "ls-label" }, row.label),
            el("span", { class: "ls-value" }, row.value),
            el("span", { class: "ls-source" }, row.source)
          )
        )
      )
    ),

    el(
      "div",
      { class: "lens-block" },
      el("div", { class: "lens-k" }, "판단 과정"),
      el(
        "div",
        { class: "lens-steps" },
        ...REASONING.map((row, index) =>
          el(
            "div",
            { class: "lens-step" },
            el("span", { class: "lstep-n" }, String(index + 1)),
            el(
              "div",
              {},
              el("div", { class: "lstep-k" }, row.step),
              el("div", { class: "lstep-t" }, row.text)
            )
          )
        )
      )
    ),

    el(
      "div",
      { class: "lens-block" },
      el("div", { class: "lens-k" }, "근거별 비중"),
      el(
        "div",
        {},
        ...WEIGHTS.map((row) =>
          el(
            "div",
            { class: "lens-weight" },
            el(
              "div",
              { class: "lw-head" },
              el("span", {}, row.label),
              el("b", {}, `${row.weight}%`)
            ),
            el(
              "div",
              { class: "lw-track" },
              el("div", { class: "lw-fill", style: { width: `${row.weight}%` } })
            ),
            el("div", { class: "lw-note" }, row.note)
          )
        )
      )
    ),

    el(
      "div",
      { class: "lens-block is-limit" },
      el("div", { class: "lens-k" }, "이 추천이 보지 못한 것"),
      el(
        "ul",
        { class: "lens-limits" },
        ...BLIND_SPOTS.map((text) => el("li", {}, text))
      ),
      el(
        "div",
        { class: "lens-closing" },
        "기록에 없는 것은 판단할 수 없습니다. 최종 선택이 담당자에게 있는 이유입니다."
      )
    )
  );
}
