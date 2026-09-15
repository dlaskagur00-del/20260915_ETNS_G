import { CHANGES, CHANGE_TYPES } from "../data/changes.js";
import { getWindowStats } from "./usage.js";
import { getSpace, listAssets } from "./spaces.js";

export { CHANGE_TYPES };

export function listChanges(spaceId) {
  return CHANGES.filter((change) => change.spaceId === spaceId).sort((a, b) =>
    a.changedAt < b.changedAt ? 1 : -1
  );
}

export function getChange(changeId) {
  return CHANGES.find((change) => change.id === changeId) || null;
}

export function recentChanges(limit = 5) {
  return [...CHANGES].sort((a, b) => (a.changedAt < b.changedAt ? 1 : -1)).slice(0, limit);
}

/** 구성 요소 하나의 이력 — "이건 원래 무엇이었나"에 답합니다. */
export function changesOfAsset(assetId) {
  return CHANGES.filter((change) => change.assetId === assetId).sort((a, b) =>
    a.changedAt < b.changedAt ? 1 : -1
  );
}

export function changesInMonth(spaceId, periodKey) {
  return listChanges(spaceId).filter((change) => change.changedAt.slice(0, 7) === periodKey);
}

/**
 * The bridge between the two histories: compare usage before and after a
 * change, computed from the monthly series rather than stored as a result.
 */
export function getChangeImpact(changeId) {
  const change = getChange(changeId);
  if (!change || !change.impactWindow) return null;

  const before = getWindowStats(change.spaceId, ...change.impactWindow.before);
  const after = getWindowStats(change.spaceId, ...change.impactWindow.after);
  if (!before || !after) return null;

  const round = (value) => Math.round(value * 10) / 10;

  return {
    change,
    before,
    after,
    delta: {
      utilization: round(after.utilization - before.utilization),
      avgHeadcount: round(after.avgHeadcount - before.avgHeadcount),
      avgDurationMin: Math.round(after.avgDurationMin - before.avgDurationMin),
    },
    note: change.impactNote || null,
  };
}

export function changesWithImpact(spaceId) {
  return listChanges(spaceId).filter((change) => Boolean(change.impactWindow));
}


/**
 * 과거 시점의 공간 상태.
 *
 * The concept is explicit that a space record must answer "과거에는 무엇이
 * 있었는가", not only what is there now. This folds the timeline up to a date to
 * rebuild the space as it stood then: its footprint, its capacity, and the items
 * that were actually installed at that point — with the item a later
 * replacement displaced standing in where we know what it was.
 */
export function getSpaceStateAt(spaceId, dateIso) {
  const space = getSpace(spaceId);
  if (!space) return null;

  const history = listChanges(spaceId)
    .filter((change) => change.changedAt <= dateIso)
    .sort((a, b) => (a.changedAt < b.changedAt ? -1 : 1));

  let rect = space.rect;
  let capacity = space.capacity;

  // Start from the earliest recorded footprint, then replay forward.
  const firstWithState = history.find((change) => change.stateAfter);
  if (firstWithState) {
    for (const change of history) {
      if (change.stateAfter?.rect) rect = change.stateAfter.rect;
      if (change.stateAfter?.capacity) capacity = change.stateAfter.capacity;
    }
  }

  const assets = [];
  for (const asset of listAssets(spaceId)) {
    if (asset.installDate <= dateIso) {
      assets.push({ ...asset, wasCurrent: true });
    } else if (asset.previousProduct) {
      // Not installed yet at this date — what it replaced was in place instead.
      assets.push({
        ...asset,
        name: asset.previousProduct.split(" · ")[0],
        manufacturer: "-",
        model: "-",
        replaced: asset.name,
        wasCurrent: false,
      });
    }
  }

  return {
    asOf: dateIso,
    space,
    rect,
    capacity,
    assets,
    isCurrent: rect === space.rect && capacity === space.capacity,
    changeCount: history.length,
  };
}
