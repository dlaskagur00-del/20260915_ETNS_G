import { CHANGES } from "../data/changes.js";
import { PROJECTS } from "../data/projects.js";
import { VENDOR_NOTES } from "../data/vendors.js";
import { SPACES } from "../data/office.js";

/**
 * 업체 History is *derived* from what the organisation actually did with each
 * vendor. Nothing here is a stored summary that could go stale.
 */
function buildVendor(name) {
  const changes = CHANGES.filter((change) => change.vendor === name);
  const projects = PROJECTS.filter((project) => project.vendor === name);

  const totalCost = changes.reduce((sum, change) => sum + change.cost, 0);
  const totalDays = changes.reduce((sum, change) => sum + change.durationDays, 0);

  const spaceTypes = new Set(
    changes
      .map((change) => SPACES.find((space) => space.id === change.spaceId)?.type)
      .filter(Boolean)
  );
  const typeLabel = { meeting: "회의실", work: "업무 공간", common: "공용 공간" };

  return {
    name,
    ...VENDOR_NOTES[name],
    changeCount: changes.length,
    projectCount: projects.length,
    totalCost,
    avgDurationDays: changes.length ? Math.round((totalDays / changes.length) * 10) / 10 : 0,
    mainAreas: [...spaceTypes].map((type) => typeLabel[type]),
    lastWorkedAt: changes.map((change) => change.changedAt).sort().at(-1) || null,
    changes: changes.sort((a, b) => (a.changedAt < b.changedAt ? 1 : -1)),
    projects,
  };
}

export function listVendors() {
  return Object.keys(VENDOR_NOTES)
    .map(buildVendor)
    .filter((vendor) => vendor.changeCount > 0)
    .sort((a, b) => b.changeCount - a.changeCount);
}

export function getVendor(name) {
  return VENDOR_NOTES[name] ? buildVendor(name) : null;
}

/**
 * "추천 시공사 — 오피스 히스토리 기반 매칭": the vendor with the most
 * comparable work on this kind of space, plus the reason it was matched.
 */
export function matchVendor(spaceType, keywords = []) {
  const typeLabel = { meeting: "회의실", work: "업무 공간", common: "공용 공간" };
  const scored = listVendors().map((vendor) => {
    let score = vendor.changeCount;
    if (vendor.mainAreas.includes(typeLabel[spaceType])) score += 4;
    for (const keyword of keywords) {
      if (vendor.specialty.includes(keyword)) score += 3;
    }
    return { vendor, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.vendor;
  if (!best) return null;

  return {
    vendor: best,
    reason:
      `${typeLabel[spaceType]} 시공 ${best.changes.length}건 · 평균 ${best.avgDurationDays}일 · ` +
      `누적 ${(best.totalCost / 10000).toLocaleString("ko-KR")}만원 실적 기준`,
  };
}
