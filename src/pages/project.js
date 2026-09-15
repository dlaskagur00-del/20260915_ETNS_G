import { chip, demoMark, detailRow, el, emptyState, panel } from "../lib/dom.js";
import { navigate } from "../lib/router.js";
import { selectChange, selectSpace, setState } from "../store/selection.js";
import { getSpace } from "../api/spaces.js";
import { getProject, listProjects } from "../api/project.js";
import { getVendor } from "../api/vendors.js";
import { spaceScene } from "../components/office/spaceScene.js";
import { comparePair } from "../components/office/visualStage.js";
import { assetThumb } from "../components/ui/assetImage.js";
import { getVisualAsset } from "../api/assets.js";
import { dotDate, pct, signed, won } from "../lib/format.js";

const FLYWHEEL = ["RECORD", "INSIGHT", "IMPROVEMENT", "PORTFOLIO"];

function deltaOf(project) {
  return project.result.after - project.result.before;
}

/**
 * Before / After for a completed project. No photographs exist in the demo, so
 * the space is drawn from its own geometry — the same renderer the rest of the
 * app uses — and the measured result carries the comparison.
 */
function beforeAfterScene(project) {
  // 실제 렌더 이미지가 있으면 그것으로 비교합니다.
  const hasImages =
    project.afterImageId && getVisualAsset(project.afterImageId)?.status === "ready";
  if (hasImages) {
    return comparePair({
      leftId: project.beforeImageId,
      rightId: project.afterImageId,
      leftLabel: "BEFORE",
      rightLabel: "AFTER",
      leftCaption: dotDate(project.startedAt),
      rightCaption: dotDate(project.completedAt),
    });
  }

  const afterSpaces = project.spaceIds.map((id) => getSpace(id)).filter(Boolean);
  if (!afterSpaces.length) return null;

  // Projects that changed a space's footprint carry their prior geometry, so
  // the two scenes actually differ; the rest compare on the measured result.
  const beforeSpaces = project.beforeSpaces || afterSpaces;
  const bounds = [...afterSpaces, ...beforeSpaces].map((space) => space.rect);

  const side = (label, caption, value, variant, spaces) =>
    el(
      "div",
      { class: `cmp-col ${variant}` },
      el(
        "div",
        { class: "cmp-head" },
        el("span", { class: "cmp-k" }, label),
        el("span", { class: "cmp-t" }, caption)
      ),
      el(
        "div",
        { class: "cmp-canvas" },
        spaceScene({
          mode: "iso",
          spaces,
          selectedId: variant === "proposed" ? spaces[0].id : null,
          boundsFrom: bounds,
          maxHeight: 170,
        })
      ),
      el(
        "div",
        { style: { padding: "8px 12px 10px", borderTop: "1px solid var(--line)" } },
        el(
          "div",
          { style: { fontFamily: "var(--font-mono)", fontSize: "17px" } },
          pct(value, 1)
        ),
        el("div", { style: { fontSize: "11.5px", color: "var(--text-3)" } }, project.result.metric)
      )
    );

  return el(
    "div",
    { class: "cmp" },
    side("BEFORE", dotDate(project.startedAt), project.result.before, "current", beforeSpaces),
    el("div", { class: "cmp-vs" }, "→"),
    side("AFTER", dotDate(project.completedAt), project.result.after, "proposed", afterSpaces)
  );
}

function deltaBadge(project) {
  // A newly built space has no "before" to improve on.
  if (project.result.before === 0) return el("span", { class: "prj-delta flat" }, "신설");
  const delta = deltaOf(project);
  return el(
    "span",
    { class: Math.abs(delta) < 3 ? "prj-delta flat" : "prj-delta up" },
    `${signed(delta, 1)}%p`
  );
}

export function projectPage(state) {
  const projects = listProjects();
  // Arriving from the demo flow with a space selected should land on that
  // space's project rather than the newest one in the office.
  const scoped = state.selectedSpaceId
    ? projects.filter((project) => project.spaceIds.includes(state.selectedSpaceId))
    : [];
  const active = getProject(state.selectedProjectId) || scoped[0] || projects[0];

  const listPanel = panel(
    {
      title: "Project Asset",
      sub: `완료 프로젝트 ${projects.length}건 · 조직의 자산으로 축적`,
      flush: true,
      foot: el(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" } },
        ...FLYWHEEL.flatMap((step, index) => [
          index > 0 ? el("span", { class: "process-arrow" }, "→") : null,
          el("span", { class: "process-step" }, step),
        ])
      ),
    },
    ...projects.map((project) =>
      el(
        "div",
        {
          class: project.id === active?.id ? "prj-row is-selected" : "prj-row",
          onClick: () => setState({ selectedProjectId: project.id }),
        },
        el(
          "div",
          { style: { display: "flex", gap: "10px", alignItems: "center", minWidth: 0 } },
          project.thumbnailId ? assetThumb(project.thumbnailId, { alt: project.title }) : null,
          el(
            "div",
            { style: { minWidth: 0 } },
            el("div", { class: "prj-title" }, project.title),
            el(
              "div",
              { class: "prj-meta" },
              `${dotDate(project.completedAt)} · ${won(project.cost)}`
            )
          )
        ),
        deltaBadge(project)
      )
    )
  );

  if (!active) {
    return el("div", { class: "split" }, listPanel, panel({ title: "상세" }, emptyState("프로젝트가 없습니다.")));
  }

  const spaceNames = active.spaceIds.map((id) => getSpace(id)?.name).filter(Boolean).join(", ");
  const delta = deltaOf(active);

  const detailPanel = panel(
    {
      title: active.title,
      sub: `${spaceNames} · ${active.vendor}`,
      actions: el(
        "div",
        { style: { display: "flex", gap: "6px" } },
        chip(active.isPublicCase ? "Case Study 활용 가능" : "내부 전용", active.isPublicCase ? "ok" : "warn"),
        ...active.tags.map((tag) => chip(tag))
      ),
      foot: demoMark(),
    },
    beforeAfterScene(active),
    el("div", { style: { height: "16px" } }),
    detailRow("프로젝트 기간", `${dotDate(active.startedAt)} ~ ${dotDate(active.completedAt)}`, { mono: true }),
    detailRow("비용", won(active.cost), { mono: true }),
    detailRow("업체", active.vendor),
    detailRow(
      "개선 결과",
      `${active.result.metric} ${pct(active.result.before, 1)} → ${pct(active.result.after, 1)} (${signed(delta, 1)}%p)`,
      { mono: true }
    ),
    detailRow(
      "시공 범위",
      el("div", { class: "scope" }, ...active.scope.map((item) => el("span", { class: "scope-item" }, item)))
    ),
    el(
      "div",
      { class: "dnote", style: { marginTop: "12px" } },
      el("div", { class: "dk" }, "결과 기록"),
      el("div", { class: "dv" }, active.resultNote)
    )
  );

  // 업체 History — vendor experience the organisation accumulated, derived from
  // the change and project records rather than typed in as a summary.
  const vendor = getVendor(active.vendor);
  const vendorPanel = vendor
    ? panel(
        { title: "업체 History", sub: `${vendor.name} · ${vendor.specialty}` },
        el(
          "div",
          { class: "vendor-stats" },
          el("div", { class: "vendor-stat" }, el("div", { class: "vk" }, "진행 건수"), el("div", { class: "vv" }, `${vendor.changeCount}건`)),
          el("div", { class: "vendor-stat" }, el("div", { class: "vk" }, "평균 공사 기간"), el("div", { class: "vv" }, `${vendor.avgDurationDays}일`)),
          el("div", { class: "vendor-stat" }, el("div", { class: "vk" }, "누적 비용"), el("div", { class: "vv" }, `${Math.round(vendor.totalCost / 10000).toLocaleString("ko-KR")}만`))
        ),
        el(
          "div",
          { class: "vendor-line" },
          el("span", { class: "vl-k" }, "주요 공간"),
          el("span", { class: "vl-v" }, vendor.mainAreas.join(" · ") || "-")
        ),
        el(
          "div",
          { class: "vendor-line" },
          el("span", { class: "vl-k" }, "강점"),
          el("span", { class: "vl-v" }, vendor.strengths.join(" · "))
        ),
        ...vendor.cautions.map((caution) =>
          el(
            "div",
            { class: "vendor-line caution" },
            el("span", { class: "vl-k" }, "특이사항"),
            el("span", { class: "vl-v" }, caution)
          )
        ),
        el(
          "div",
          { class: "dnote", style: { marginTop: "12px" } },
          el("div", { class: "dk" }, "담당자 메모"),
          el("div", { class: "dv" }, vendor.note)
        )
      )
    : null;

  const linkPanel = panel(
    { title: "연결된 기록", sub: "이 프로젝트가 남긴 History" },
    el(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "8px" } },
      ...active.relatedChangeIds.map((changeId) =>
        el(
          "button",
          {
            class: "btn",
            style: { justifyContent: "space-between", width: "100%" },
            onClick: () => {
              selectSpace(active.spaceIds[0]);
              selectChange(changeId);
              navigate("configuration");
            },
          },
          "공간 구성 History에서 보기",
          el("span", { class: "arrow" }, "→")
        )
      ),
      el(
        "button",
        {
          class: "btn",
          style: { justifyContent: "space-between", width: "100%" },
          onClick: () => {
            selectSpace(active.spaceIds[0]);
            navigate("usage");
          },
        },
        "공간 이용 History에서 보기",
        el("span", { class: "arrow" }, "→")
      ),
      active.relatedInsightId
        ? el(
            "button",
            {
              class: "btn",
              style: { justifyContent: "space-between", width: "100%" },
              onClick: () => {
                selectSpace(active.spaceIds[0]);
                setState({ selectedInsightId: active.relatedInsightId, selectedProposalId: null });
                navigate("insight");
              },
            },
            "관련 AI Insight 보기",
            el("span", { class: "arrow" }, "→")
          )
        : null
    )
  );

  return el(
    "div",
    { class: "split" },
    el("div", { class: "stack" }, detailPanel),
    el("div", { class: "stack" }, listPanel, vendorPanel, linkPanel)
  );
}
