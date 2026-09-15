import { chip, demoMark, el, emptyState, panel, segmented } from "../lib/dom.js";
import { navigate } from "../lib/router.js";
import { selectChange, selectSpace, setState } from "../store/selection.js";
import { getSpace, listSpaces } from "../api/spaces.js";
import { changesWithImpact, getChangeImpact, listChanges } from "../api/history.js";
import {
  getCurrentStats, getFullSeries, getHeatmap, getHourlyPattern,
  getMonthlySeries, getSessions, getSessionSummary, getWeekdayPattern,
} from "../api/usage.js";
import { heatLegend, spaceScene } from "../components/office/spaceScene.js";
import { lineChart } from "../components/charts/lineChart.js";
import { barChart } from "../components/charts/barChart.js";
import { changeImpact } from "../components/usage/changeImpact.js";
import { usageLog } from "../components/usage/usageLog.js";
import { dotDate, monthLabel, people } from "../lib/format.js";

const RANGE_OPTIONS = [
  { value: "6m", label: "최근 6개월" },
  { value: "all", label: "전체 기간" },
];

const GRANULARITY_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

function metricTile(label, value, unit) {
  return el(
    "div",
    { class: "metric" },
    el("div", { class: "mk" }, label),
    el("div", { class: "mv" }, value, unit ? el("small", {}, unit) : null)
  );
}

export function usagePage(state) {
  const spaces = listSpaces();
  const heat = getHeatmap();
  const space = state.selectedSpaceId ? getSpace(state.selectedSpaceId) : null;

  /* ── stage: floor map + heatmap ─────────────────────────────────── */
  const stage = el(
    "section",
    { class: "stage" },
    el(
      "div",
      { class: "stage-head" },
      el(
        "div",
        {},
        el("h2", { style: { fontSize: "13.5px" } }, "Floor Map · Usage Heatmap"),
        el(
          "div",
          { style: { fontSize: "11.5px", color: "var(--text-3)" } },
          "색이 진할수록 이용률이 높습니다. 공간을 클릭하면 우측 데이터가 바뀝니다."
        )
      ),
      chip("2026.09 기준")
    ),
    el(
      "div",
      { class: "stage-canvas" },
      spaceScene({
        mode: "plan",
        spaces,
        selectedId: space ? space.id : null,
        heat,
        maxHeight: 380,
        onSelect: (spaceId) => selectSpace(spaceId),
      })
    ),
    el(
      "div",
      { class: "stage-foot" },
      el(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "12px" } },
        el("span", { style: { fontSize: "11px", color: "var(--text-3)" } }, "이용률(%)"),
        heatLegend()
      ),
      el(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "12px" } },
        el("span", { class: "eyebrow" }, "HISTORY · 얼마나 · 어떻게 사용되었는가?"),
        demoMark()
      )
    )
  );

  if (!space) {
    return el(
      "div",
      { class: "split" },
      stage,
      panel(
        { title: "공간 이용 데이터" },
        emptyState("공간이 선택되지 않았습니다.", "Floor Map에서 공간을 클릭해 주세요.")
      )
    );
  }

  /* ── trend chart with change markers (the two histories, joined) ── */
  const range = state.usageRange || "6m";
  const rawSeries = range === "all" ? getFullSeries(space.id) : getMonthlySeries(space.id, 6);
  const series = rawSeries.map((row) => ({
    periodKey: row.periodKey,
    value: row.stats.utilization,
    label: range === "all" ? (row.periodKey.endsWith("-01") ? row.periodKey.slice(0, 4) : "") : monthLabel(row.periodKey),
  }));

  const spaceChanges = listChanges(space.id);
  const markers = spaceChanges
    .filter((change) => series.some((point) => point.periodKey === change.changedAt.slice(0, 7)))
    .map((change) => ({
      id: change.id,
      periodKey: change.changedAt.slice(0, 7),
      label: change.title,
      selected: change.id === state.selectedChangeId,
    }));

  const trendPanel = panel(
    {
      title: "이용률 추이",
      sub: markers.length
        ? "세로 표시는 공간 변경 시점입니다. 클릭하면 변경 전후 데이터를 비교합니다."
        : "선택 기간에 공간 변경 이력이 없습니다.",
      actions: segmented(RANGE_OPTIONS, range, (value) => setState({ usageRange: value })),
    },
    lineChart({
      series,
      markers,
      selectedMarkerId: state.selectedChangeId,
      onMarkerSelect: (changeId) => selectChange(changeId),
      labelEvery: range === "all" ? 6 : 1,
    })
  );

  /* ── change impact ──────────────────────────────────────────────── */
  const impactCandidates = changesWithImpact(space.id);
  const activeImpact =
    (state.selectedChangeId && getChangeImpact(state.selectedChangeId)) ||
    (impactCandidates.length ? getChangeImpact(impactCandidates[0].id) : null);

  const impactPanel = panel(
    {
      title: "공간 변경 전후 비교",
      sub: "공간 구성 History × 공간 이용 History",
      actions: impactCandidates.length > 1
        ? segmented(
            impactCandidates.map((change) => ({
              value: change.id,
              label: dotDate(change.changedAt).slice(2, 7),
            })),
            activeImpact ? activeImpact.change.id : null,
            (changeId) => selectChange(changeId)
          )
        : null,
      foot: activeImpact
        ? el(
            "button",
            {
              class: "btn ghost",
              onClick: () => {
                selectChange(activeImpact.change.id);
                navigate("configuration");
              },
            },
            "이 변경의 구성 History 보기 ",
            el("span", { class: "arrow" }, "→")
          )
        : null,
    },
    activeImpact
      ? changeImpact(activeImpact)
      : emptyState("비교 가능한 변경 이력이 없습니다.", "이용 데이터와 연결된 공간 변경이 아직 없습니다.")
  );

  /* ── usage detail ───────────────────────────────────────────────── */
  const stats = getCurrentStats(space.id);
  const summary = getSessionSummary(space.id, state.usageGranularity, state.usageAnchorDate);
  const sessions = getSessions(space.id, state.usageGranularity, state.usageAnchorDate);

  const detailPanel = panel(
    { title: `${space.name} 이용 현황`, sub: "2026.09 기준", flush: true },
    el(
      "div",
      { class: "metrics" },
      metricTile("현재 이용률", `${stats.utilization}`, "%"),
      metricTile("평균 이용 인원", `${stats.avgHeadcount}`, "명"),
      metricTile("평균 체류 시간", `${stats.avgDurationMin}`, "분"),
      metricTile("Peak Time", stats.peak),
      metricTile("저이용 시간", stats.lowUse)
    )
  );

  const weekday = getWeekdayPattern(space.id);
  const patternPanel = panel(
    { title: "이용 패턴", sub: "최근 30일 평균 · 시간대 / 요일" },
    el(
      "div",
      { class: "pattern-pair" },
      el(
        "div",
        {},
        el("div", { class: "eyebrow", style: { marginBottom: "4px" } }, "시간대별"),
        barChart({ data: getHourlyPattern(space.id) })
      ),
      el(
        "div",
        {},
        el("div", { class: "eyebrow", style: { marginBottom: "4px" } }, "요일별"),
        barChart({ data: weekday.map((day) => ({ label: day.label, value: day.value })) })
      )
    )
  );

  const sourcePanel = panel(
    { title: "데이터 출처", sub: "이 화면의 이용 데이터가 어디에서 오는가" },
    el(
      "div",
      { class: "source-list" },
      el(
        "div",
        { class: "source-row" },
        el("span", { class: "src-k" }, "이용 데이터"),
        el(
          "div",
          {},
          el("div", { class: "src-t" }, "AIoT 기반 회의실 관리 시스템"),
          el("div", { class: "src-n" }, "출원 10-2024-0123015 · 회의실 상태 · 예약 · 이용 데이터")
        )
      ),
      el(
        "div",
        { class: "source-row" },
        el("span", { class: "src-k" }, "공간 기준"),
        el(
          "div",
          {},
          el("div", { class: "src-t" }, "공간 산정 시스템 및 그 방법"),
          el("div", { class: "src-n" }, "출원 10-2025-0034347 · 인원 · 기준 → 필요 공간 산정")
        )
      ),
      el(
        "div",
        { class: "source-note" },
        "일회성으로 끝나던 두 시스템의 데이터를 History로 축적해 다음 공간 판단의 근거로 사용합니다."
      )
    )
  );

  const logPanel = panel(
    {
      title: "공간 이용 History",
      sub: `${state.usageGranularity === "day" ? "1일" : state.usageGranularity === "week" ? "최근 7일" : "최근 30일"} · ${summary.sessionCount}건 · 평균 ${people(summary.avgHeadcount)} / ${summary.avgDurationMin}분`,
      flush: true,
      actions: segmented(GRANULARITY_OPTIONS, state.usageGranularity, (value) =>
        setState({ usageGranularity: value })
      ),
    },
    usageLog({ sessions, granularity: state.usageGranularity })
  );

  return el(
    "div",
    { class: "split" },
    el("div", { class: "stack" }, stage, trendPanel, logPanel, sourcePanel),
    el("div", { class: "stack" }, detailPanel, impactPanel, patternPanel)
  );
}
