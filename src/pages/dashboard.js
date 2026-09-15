import { chip, demoMark, el, panel, stat } from "../lib/dom.js";
import { navigate } from "../lib/router.js";
import { selectSpace } from "../store/selection.js";
import { getOffice, getSpace, getSpaceCounts, listSpaces } from "../api/spaces.js";
import { recentChanges, CHANGE_TYPES } from "../api/history.js";
import { getOfficeUsageSummary } from "../api/usage.js";
import { spaceScene } from "../components/office/spaceScene.js";
import { dotDate } from "../lib/format.js";

function usageBar(name, value) {
  return el(
    "div",
    { class: "ubar" },
    el(
      "div",
      { class: "ubar-head" },
      el("span", { class: "ubar-name" }, name),
      el("span", { class: "ubar-val" }, `${value}%`)
    ),
    el("div", { class: "ubar-track" }, el("div", { class: "ubar-fill", style: { width: `${value}%` } }))
  );
}

export function dashboardPage(state) {
  const office = getOffice();
  const counts = getSpaceCounts();
  const usage = getOfficeUsageSummary();

  const stage = el(
    "section",
    { class: "stage" },
    el(
      "div",
      { class: "stage-head" },
      el(
        "div",
        {},
        el("h2", { style: { fontSize: "13.5px" } }, `${office.name} · ${office.floorLabel}`),
        el("div", { class: "sub", style: { fontSize: "11.5px", color: "var(--text-3)" } },
          "공간을 클릭하면 해당 공간의 구성 History로 이동합니다.")
      ),
      chip(`${counts.total} SPACES`)
    ),
    el(
      "div",
      { class: "stage-canvas" },
      spaceScene({
        mode: "iso",
        spaces: listSpaces(),
        selectedId: state.selectedSpaceId,
        maxHeight: 450,
        onSelect: (spaceId) => {
          selectSpace(spaceId);
          navigate("configuration");
        },
      })
    ),
    el(
      "div",
      { class: "stage-foot" },
      el("span", { style: { fontSize: "11.5px", color: "var(--text-3)" } },
        "Isometric Office — 공간 구성 History 탐색용"),
      demoMark()
    )
  );

  const recent = panel(
    {
      title: "최근 공간 History",
      sub: "무엇이 · 언제 · 왜 바뀌었는가",
      flush: true,
      foot: el(
        "button",
        { class: "btn ghost", onClick: () => navigate("configuration") },
        "전체 History 보기 ",
        el("span", { class: "arrow" }, "→")
      ),
    },
    ...recentChanges(4).map((change) => {
      const space = getSpace(change.spaceId);
      return el(
        "div",
        {
          class: "rec-row",
          onClick: () => {
            selectSpace(change.spaceId);
            navigate("configuration");
          },
        },
        el("span", { class: "d" }, dotDate(change.changedAt)),
        el(
          "div",
          {},
          el("div", { class: "t" }, el("b", {}, change.title)),
          el("div", { class: "sp" }, `${space.name} · ${change.reason}`)
        ),
        chip(CHANGE_TYPES[change.changeType])
      );
    })
  );

  const usagePanel = panel(
    {
      title: "이번 달 공간 이용",
      sub: "2026.09 기준",
      flush: true,
      foot: el(
        "button",
        { class: "btn ghost", onClick: () => navigate("usage") },
        "이용 History 보기 ",
        el("span", { class: "arrow" }, "→")
      ),
    },
    usageBar("전체 공간 이용률", usage.total),
    usageBar("회의실 이용률", usage.meeting),
    usageBar("업무공간 이용률", usage.work),
    usageBar("공용공간 이용률", usage.common)
  );

  return el(
    "div",
    { class: "stack" },
    el(
      "div",
      { class: "grid-4" },
      stat({ label: "전체 공간", value: counts.total, desc: office.name }),
      stat({ label: "회의실", value: counts.meeting, desc: "Meeting Room" }),
      stat({ label: "업무 공간", value: counts.work, desc: "Work Space" }),
      stat({ label: "공용 공간", value: counts.common, desc: "Common Area" })
    ),
    el("div", { class: "split" }, stage, el("div", { class: "stack" }, recent, usagePanel))
  );
}
