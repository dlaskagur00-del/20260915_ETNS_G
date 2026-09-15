import { chip, demoMark, el, emptyState, panel } from "../lib/dom.js";
import { navigate } from "../lib/router.js";
import { selectAsset, selectChange, selectSpace, setState } from "../store/selection.js";
import { CATEGORIES, CATEGORY_GROUPS, getAsset, getSpace, getSpaceArea, groupOf, listAssets, listSpaces, SPACE_TYPES } from "../api/spaces.js";
import { getSpaceStateAt, listChanges } from "../api/history.js";
import { assetIdForSpaceAsset } from "../api/assets.js";
import { assetThumb } from "../components/ui/assetImage.js";
import { spaceScene } from "../components/office/spaceScene.js";
import { timeline } from "../components/history/timeline.js";
import { assetDetail, changeDetail } from "../components/history/detail.js";
import { dotDate, won } from "../lib/format.js";

/** Asset placement fractions → absolute plan coordinates for the scene pins. */
function assetMarkers(space, assets, selectedAssetId) {
  return assets.map((asset) => ({
    id: asset.id,
    label: asset.name,
    selected: asset.id === selectedAssetId,
    x: space.rect.x + space.rect.w * asset.placement.x,
    y: space.rect.y + space.rect.h * asset.placement.y,
  }));
}

/**
 * Grouped the way the service describes composition — Furniture / Finish /
 * Facility — so it reads as "공간을 이루는 것들" rather than a flat asset table.
 */
function assetList(assets, selectedAssetId) {
  const sections = CATEGORY_GROUPS.map((group) => {
    const rows = assets.filter((asset) => groupOf(asset.category).id === group.id);
    if (!rows.length) return null;

    return el(
      "div",
      {},
      el(
        "div",
        { class: "sec-label" },
        `${group.label} · ${group.ko}`,
        el("span", { style: { float: "right", opacity: "0.7" } }, `${rows.length}`)
      ),
      ...rows.map((asset) =>
        el(
          "div",
          {
            class: asset.id === selectedAssetId ? "asset-row is-selected" : "asset-row",
            onClick: () => selectAsset(asset.id),
          },
          assetThumb(assetIdForSpaceAsset(asset), { alt: asset.name }),
          el("span", { class: "cat" }, CATEGORIES[asset.category]),
          el("span", { class: "nm" }, asset.name),
          el("span", { class: "st" }, won(asset.cost))
        )
      )
    );
  });

  return el("div", {}, ...sections);
}

export function configurationPage(state) {
  const spaces = listSpaces();
  const space = state.selectedSpaceId ? getSpace(state.selectedSpaceId) : null;
  const assets = space ? listAssets(space.id) : [];
  const changes = space ? listChanges(space.id) : [];
  const selectedAsset = state.selectedAssetId ? getAsset(state.selectedAssetId) : null;
  const selectedChange = state.selectedChangeId
    ? changes.find((change) => change.id === state.selectedChangeId)
    : null;

  // 과거 시점의 공간 상태 — selecting a timeline event rewinds the map and the
  // component list to how the space actually stood on that date.
  const pastState =
    selectedChange && space ? getSpaceStateAt(space.id, selectedChange.changedAt) : null;
  const timeTravel = pastState && !pastState.isCurrent;

  const sceneSpaces = timeTravel
    ? spaces.map((item) =>
        item.id === space.id
          ? { ...item, rect: pastState.rect, capacity: pastState.capacity }
          : item
      )
    : spaces;

  const shownAssets = timeTravel ? pastState.assets : assets;

  /* ── stage ─────────────────────────────────────────────────────── */
  const stage = el(
    "section",
    { class: "stage" },
    el(
      "div",
      { class: "stage-head" },
      el(
        "div",
        {},
        el("h2", { style: { fontSize: "13.5px" } }, "Isometric Office"),
        el(
          "div",
          { style: { fontSize: "11.5px", color: "var(--text-3)" } },
          timeTravel
            ? `${space.name} — ${dotDate(selectedChange.changedAt)} 당시의 공간 형태와 구성으로 표시하고 있습니다.`
            : space
            ? `${space.name} 선택됨 — 공간 안의 점을 클릭하면 구성 요소 상세가 열립니다.`
            : "공간을 클릭하면 해당 공간의 구성 이력을 확인할 수 있습니다."
        )
      ),
      timeTravel
        ? el(
            "div",
            { class: "timetravel" },
            el("span", { class: "tt-k" }, "과거 시점"),
            el("span", { class: "tt-d" }, `${dotDate(selectedChange.changedAt)} 기준`),
            el(
              "button",
              { class: "btn", onClick: () => selectChange(null) },
              "현재로"
            )
          )
        : space
        ? chip(`${assets.length} 구성 요소`, "accent")
        : chip(`${spaces.length} SPACES`)
    ),
    el(
      "div",
      { class: "stage-canvas" },
      spaceScene({
        mode: "iso",
        spaces: sceneSpaces,
        selectedId: space ? space.id : null,
        maxHeight: 470,
        onSelect: (spaceId) => selectSpace(spaceId),
        markers: space && !timeTravel ? assetMarkers(space, assets, state.selectedAssetId) : [],
        onMarkerSelect: (assetId) => selectAsset(assetId),
      })
    ),
    el(
      "div",
      { class: "stage-foot" },
      el(
        "span",
        { style: { fontSize: "11.5px", color: "var(--text-3)" } },
        timeTravel
          ? `${SPACE_TYPES[space.type].label} · 당시 정원 ${pastState.capacity}인 · ${Math.round(pastState.rect.w * pastState.rect.h * 10) / 10}㎡ · 누적 변경 ${pastState.changeCount}건`
          : space
          ? `${SPACE_TYPES[space.type].label} · 정원 ${space.capacity}인 · ${getSpaceArea(space)}㎡ · ${dotDate(space.builtAt + "-01").slice(0, 7)} 구축`
          : "공간 구성 History — 무엇이, 언제, 왜 바뀌었는가"
      ),
      el(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "12px" } },
        el("span", { class: "eyebrow" }, "RECORD · 무엇이 · 언제 · 왜 바뀌었는가?"),
        demoMark()
      )
    )
  );

  /* ── timeline ──────────────────────────────────────────────────── */
  const timelinePanel = space
    ? panel(
        {
          title: `${space.name} 변경 이력`,
          sub: state.showAllHistory ? `전체 ${changes.length}건` : `최근 ${Math.min(2, changes.length)}건`,
          flush: true,
          foot: changes.length > 2
            ? el(
                "button",
                {
                  class: "btn ghost",
                  onClick: () => setState({ showAllHistory: !state.showAllHistory }),
                },
                state.showAllHistory ? "최근 이력만 보기" : `전체 History 보기 (${changes.length}건)`,
                el("span", { class: "arrow" }, state.showAllHistory ? " ↑" : " ↓")
              )
            : null,
        },
        changes.length
          ? timeline({
              changes,
              selectedId: state.selectedChangeId,
              onSelect: (changeId) => selectChange(changeId),
              expanded: state.showAllHistory,
            })
          : emptyState("변경 이력이 없습니다.")
      )
    : null;

  /* ── right column ──────────────────────────────────────────────── */
  const componentsPanel = space
    ? panel(
        {
          title: timeTravel ? "공간 구성 요소 (과거 시점)" : "공간 구성 요소",
          sub: timeTravel
            ? `${dotDate(selectedChange.changedAt)} 당시 설치되어 있던 요소`
            : "가구뿐 아니라 마감재 · 설비까지",
          flush: true,
        },
        shownAssets.length
          ? assetList(shownAssets, state.selectedAssetId)
          : emptyState("등록된 구성 요소가 없습니다.")
      )
    : null;

  let detailBody;
  let detailTitle = "상세";
  let detailSub = null;

  if (selectedChange) {
    detailTitle = "변경 이력 상세";
    detailSub = space.name;
    detailBody = changeDetail(selectedChange, {
      onCompareUsage: () => {
        setState({ selectedChangeId: selectedChange.id });
        navigate("usage");
      },
    });
  } else if (selectedAsset) {
    detailTitle = "구성 요소 상세";
    detailSub = `${space.name} · 현재 상태`;
    detailBody = assetDetail(selectedAsset);
  } else if (space) {
    detailBody = emptyState(
      "구성 요소 또는 변경 이력을 선택하세요.",
      "선택하면 제조사 · 구매 이력 · 교체 사유 · 특이사항이 표시됩니다."
    );
  } else {
    detailBody = emptyState("공간이 선택되지 않았습니다.", "오피스 맵에서 공간을 클릭해 주세요.");
  }

  const detailPanel = panel({ title: detailTitle, sub: detailSub }, detailBody);

  return el(
    "div",
    { class: "split" },
    el("div", { class: "stack" }, stage, timelinePanel),
    el("div", { class: "stack" }, componentsPanel, detailPanel)
  );
}
