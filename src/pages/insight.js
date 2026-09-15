import { chip, demoMark, el, emptyState, panel } from "../lib/dom.js";
import { navigate } from "../lib/router.js";
import { selectSpace, setState } from "../store/selection.js";
import { getSpace } from "../api/spaces.js";
import { getInsight, insightsFor, listInsights } from "../api/insight.js";
import { projectsFor } from "../api/project.js";
import { matchVendor } from "../api/vendors.js";
import { costEstimate, proposalCompare } from "../components/insight/proposal.js";
import { dotDate } from "../lib/format.js";

const PROCESS = [
  "클라이언트 요청",
  "축적된 기록 조회",
  "AI 추천안",
  "담당자 최종 선택",
  "설계 · 시공",
];

function processStrip(activeIndex) {
  const nodes = [];
  PROCESS.forEach((step, index) => {
    if (index > 0) nodes.push(el("span", { class: "process-arrow" }, "→"));
    nodes.push(
      el("span", { class: index === activeIndex ? "process-step is-now" : "process-step" }, step)
    );
  });
  return el("div", { class: "process" }, ...nodes);
}

export function insightPage(state) {
  const space = state.selectedSpaceId ? getSpace(state.selectedSpaceId) : null;

  // Insights for the selected space come first — the demo arrives here with
  // 회의실 A already selected and should not have to hunt for its card.
  const scoped = space ? insightsFor(space.id) : [];
  const insights = scoped.length ? scoped : listInsights();

  const activeInsight =
    (state.selectedInsightId && getInsight(state.selectedInsightId)) || insights[0] || null;

  const listPanel = panel(
    {
      title: "AI Insight",
      sub: space && scoped.length ? `${space.name} 관련 ${scoped.length}건` : `전체 ${insights.length}건`,
      flush: true,
      foot: space && scoped.length
        ? el(
            "button",
            { class: "btn ghost", onClick: () => selectSpace(null) },
            "전체 Insight 보기"
          )
        : null,
    },
    ...insights.map((insight) => {
      const target = getSpace(insight.spaceId);
      return el(
        "div",
        {
          class: insight.id === activeInsight?.id ? "ins-row is-selected" : "ins-row",
          onClick: () => setState({ selectedInsightId: insight.id, selectedProposalId: null }),
        },
        el(
          "div",
          {},
          el("div", { class: "ins-space" }, target.name),
          el("div", { class: "ins-sum" }, insight.summary)
        ),
        el(
          "div",
          { class: "ins-meta" },
          chip(insight.type),
          chip(`신뢰도 ${Math.round(insight.confidence * 100)}%`, "info")
        )
      );
    })
  );

  if (!activeInsight) {
    return el("div", { class: "split" }, listPanel, panel({ title: "분석 상세" }, emptyState("Insight가 없습니다.")));
  }

  const insightSpace = getSpace(activeInsight.spaceId);
  const activeProposal =
    activeInsight.recommendations.find((rec) => rec.id === state.selectedProposalId) ||
    activeInsight.recommendations[0];

  const analysisPanel = panel(
    {
      title: `${insightSpace.name} 분석`,
      sub: `${dotDate(activeInsight.createdAt)} · ${activeInsight.type}`,
      actions: el(
        "button",
        {
          class: "btn",
          onClick: () => {
            selectSpace(insightSpace.id);
            navigate("usage");
          },
        },
        "근거 데이터 보기 ",
        el("span", { class: "arrow" }, "→")
      ),
      foot: demoMark(),
    },
    el(
      "div",
      { class: "request-ctx" },
      el("div", { class: "request-ctx-k" }, "클라이언트 요청"),
      el(
        "div",
        { class: "request-ctx-v" },
        `"${insightSpace.name} 쪽 회의실이 부족하다는 얘기가 계속 나옵니다. 어떻게 하는 게 좋을까요?"`
      ),
      el(
        "div",
        { class: "request-ctx-n" },
        "이 요청에 답하기 위해 축적된 구성·이용·비용 기록을 조회했습니다."
      )
    ),
    el("div", { class: "ins-reason" }, activeInsight.reason),
    el("div", { style: { height: "16px" } }),
    el(
      "div",
      { class: "eyebrow", style: { marginBottom: "6px" } },
      "이 추천의 근거 — 우리 조직에 쌓인 기록"
    ),
    ...activeInsight.evidence.map((item) =>
      el(
        "div",
        { class: "ev-row" },
        el("span", { class: "ev-src" }, item.source),
        el("span", { class: "ev-label" }, item.label),
        el("span", { class: "ev-value" }, item.value)
      )
    )
  );

  const proposalsPanel = panel(
    {
      title: "개선안",
      sub: "축적된 기록에서 도출한 추천안입니다. 선택은 담당자가 합니다.",
      flush: true,
      foot: processStrip(2),
    },
    ...activeInsight.recommendations.map((rec) =>
      el(
        "div",
        {
          class: rec.id === activeProposal.id ? "prop-row is-selected" : "prop-row",
          onClick: () => setState({ selectedProposalId: rec.id }),
        },
        el("div", { class: "prop-title" }, rec.title),
        el("div", { class: "prop-desc" }, rec.description),
        el("div", { class: "prop-effect" }, `기대 효과 · ${rec.expectedEffect}`),
        el(
          "div",
          { class: "prop-decide" },
          rec.id === activeProposal.id ? "✓ 검토 중" : "이 안 검토하기"
        )
      )
    )
  );

  const previewPanel = panel(
    {
      title: "공간 개선 Preview",
      sub: activeProposal.currentImageId || activeProposal.layout ? "동일 공간 · 동일 앵글 비교" : "배치 변경 없음",
    },
    proposalCompare(activeProposal.layout, activeProposal)
  );

  const costPanel = panel(
    { title: "예상 비용", sub: "의사결정을 위한 개산견적" },
    costEstimate(
      activeProposal.estimatedCost,
      activeProposal.vendorMatch
        ? matchVendor(activeProposal.vendorMatch.spaceType, activeProposal.vendorMatch.keywords)
        : null
    )
  );

  const relatedProjects = projectsFor(activeInsight.spaceId);
  const relatedPanel = relatedProjects.length
    ? panel(
        {
          title: "참고 · 이 공간의 과거 프로젝트",
          flush: true,
          foot: el(
            "button",
            { class: "btn ghost", onClick: () => navigate("project") },
            "Project Asset 전체 보기 ",
            el("span", { class: "arrow" }, "→")
          ),
        },
        ...relatedProjects.map((project) =>
          el(
            "div",
            {
              class: "prj-row",
              onClick: () => {
                setState({ selectedProjectId: project.id });
                navigate("project");
              },
            },
            el(
              "div",
              {},
              el("div", { class: "prj-title" }, project.title),
              el("div", { class: "prj-meta" }, `${dotDate(project.completedAt)} · ${project.vendor}`)
            ),
            el(
              "span",
              {
                class:
                  Math.abs(project.result.after - project.result.before) < 3
                    ? "prj-delta flat"
                    : "prj-delta up",
              },
              `${project.result.metric} ${project.result.after - project.result.before > 0 ? "+" : ""}${(project.result.after - project.result.before).toFixed(1)}%p`
            )
          )
        )
      )
    : null;

  return el(
    "div",
    { class: "split" },
    el("div", { class: "stack" }, analysisPanel, previewPanel),
    el("div", { class: "stack" }, listPanel, proposalsPanel, costPanel, relatedPanel)
  );
}
