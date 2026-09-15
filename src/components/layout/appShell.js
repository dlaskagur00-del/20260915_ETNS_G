import { el, svg } from "../../lib/dom.js";
import { navigate } from "../../lib/router.js";
import { getOffice, getSpace, getSpaceArea, getSpaceCounts, SPACE_TYPES } from "../../api/spaces.js";
import { listChanges } from "../../api/history.js";
import { dotDate } from "../../lib/format.js";
import { assetProgress } from "../../api/assets.js";

const NAV = [
  { route: "dashboard", label: "Dashboard", icon: "grid" },
  { group: "Office History" },
  { route: "configuration", label: "공간 구성 History", icon: "layers", sub: true },
  { route: "usage", label: "공간 이용 History", icon: "pulse", sub: true },
  { route: "insight", label: "AI Insight", icon: "spark" },
  { route: "project", label: "Project Asset", icon: "archive" },
];

const ICONS = {
  grid: "M3 3h5v5H3zM10 3h5v5h-5zM3 10h5v5H3zM10 10h5v5h-5z",
  layers: "M9 2 16 6l-7 4-7-4zM2 10l7 4 7-4M2 13l7 4 7-4",
  pulse: "M2 10h3l2-6 3 12 2-6h4",
  spark: "M9 2v5M9 11v5M2 9h5M11 9h5M5 5l2.5 2.5M13 13l-2.5-2.5M13 5l-2.5 2.5M5 13l2.5-2.5",
  archive: "M2 5h14v3H2zM3.5 8v7h11V8M7 11h4",
};

function icon(name) {
  return svg(
    "svg",
    { class: "ico", viewBox: "0 0 18 18", fill: "none", stroke: "currentColor", "stroke-width": "1.4" },
    svg("path", { d: ICONS[name], "stroke-linecap": "round", "stroke-linejoin": "round" })
  );
}

function sidebar(state) {
  return el(
    "nav",
    { class: "nav" },
    el(
      "div",
      { class: "nav-brand" },
      el("span", { class: "mark" }, "OFFICE ", el("em", {}, "HISTORY")),
      el("div", { class: "sub" }, "사무환경 이력 관리")
    ),
    el(
      "div",
      { class: "nav-group" },
      ...NAV.map((item) =>
        item.group
          ? el("div", { class: "nav-group-label" }, item.group)
          : el(
              "button",
              {
                class: [
                  "nav-item",
                  item.sub ? "is-sub" : "",
                  state.route === item.route ? "is-active" : "",
                ],
                onClick: () => navigate(item.route),
              },
              icon(item.icon),
              el("span", {}, item.label)
            )
      )
    ),
    el(
      "div",
      { class: "nav-foot" },
      el("div", { class: "nav-tagline" }, "개인의 센스를", el("br"), "조직의 데이터로."),
      // 확보된 Visual Asset 진행 상황 — 빠진 이미지를 잊지 않기 위한 표시
      (() => {
        const { ready, total } = assetProgress();
        return total
          ? el("div", { class: "nav-assets" }, "VISUAL ASSET ", el("b", {}, `${ready}`), ` / ${total}`)
          : null;
      })(),
      el("div", { class: "nav-office" }, "ETNERS OFFICE · 본사 7F"),
      el("div", { class: "demo-mark" }, "* Demo Data")
    )
  );
}

function topbar() {
  const office = getOffice();
  const counts = getSpaceCounts();
  return el(
    "header",
    { class: "topbar" },
    el(
      "div",
      { class: "office" },
      el("span", { class: "office-name" }, office.name),
      el(
        "span",
        { class: "office-meta mono" },
        `${office.floorLabel} · 전체 ${counts.total} · 회의실 ${counts.meeting} · 업무 ${counts.work} · 공용 ${counts.common}`
      )
    ),
    el(
      "div",
      { class: "user" },
      el("span", {}, "사무환경팀 김담당"),
      el("div", { class: "avatar" }, "KD")
    )
  );
}

/** Actions that carry the selected space into the next screen of the demo. */
function contextActions(state) {
  const actions = [];
  if (!state.selectedSpaceId) return actions;

  if (state.route !== "configuration") {
    actions.push(
      el(
        "button",
        { class: "btn", onClick: () => navigate("configuration") },
        "구성 History"
      )
    );
  }
  if (state.route !== "usage") {
    actions.push(
      el("button", { class: "btn", onClick: () => navigate("usage") }, "이용 History")
    );
  }
  if (state.route !== "insight") {
    actions.push(
      el("button", { class: "btn", onClick: () => navigate("insight") }, "AI Insight")
    );
  }
  return actions;
}

function contextBar(state) {
  const space = state.selectedSpaceId ? getSpace(state.selectedSpaceId) : null;

  if (!space) {
    return el(
      "div",
      { class: "contextbar" },
      el("span", { class: "cb-label" }, "선택 공간"),
      el("span", { class: "cb-empty" }, "오피스 맵에서 공간을 선택하면 해당 공간의 이력을 따라갈 수 있습니다.")
    );
  }

  const lastChange = listChanges(space.id)[0];

  return el(
    "div",
    { class: "contextbar" },
    el("span", { class: "cb-label" }, "선택 공간"),
    el(
      "div",
      { class: "cb-space" },
      el("span", { class: "cb-swatch" }),
      el("span", {}, space.name)
    ),
    el(
      "div",
      { class: "cb-facts" },
      el("span", {}, SPACE_TYPES[space.type].label),
      el("span", {}, "정원 ", el("b", {}, `${space.capacity}인`)),
      el("span", {}, "면적 ", el("b", {}, `${getSpaceArea(space)}㎡`)),
      lastChange
        ? el("span", {}, "최근 변경 ", el("b", {}, dotDate(lastChange.changedAt)))
        : null
    ),
    el("div", { class: "cb-actions" }, ...contextActions(state))
  );
}

export function appShell(state, pageNode) {
  return el(
    "div",
    { class: "shell" },
    sidebar(state),
    el("div", { class: "main" }, topbar(), contextBar(state), el("div", { class: "page" }, pageNode))
  );
}
