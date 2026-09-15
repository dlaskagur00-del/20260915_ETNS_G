import { SPACES, spaceArea } from "../data/office.js";
import {
  HOUR_BUCKETS, PROFILES, WEEKDAYS, hourlyPattern, monthlySeries, sessionsForDate,
  lowUseBand, weekdayPattern, windowStats,
} from "../data/usage.js";
import { addDays } from "../lib/format.js";

export { HOUR_BUCKETS, WEEKDAYS };

export function getWeekdayPattern(spaceId) {
  return weekdayPattern(spaceId);
}

export function getCurrentStats(spaceId) {
  const latest = monthlySeries(spaceId).at(-1);
  const profile = PROFILES[spaceId];
  return {
    utilization: latest ? latest.stats.utilization : profile.util,
    avgHeadcount: latest ? latest.stats.avgHeadcount : profile.head,
    avgDurationMin: latest ? latest.stats.avgDurationMin : profile.dur,
    peak: `${String(profile.peak[0]).padStart(2, "0")}:00 ~ ${String(profile.peak[1]).padStart(2, "0")}:00`,
    lowUse: lowUseBand(spaceId).range.replace("-", ":00 ~ ") + ":00",
  };
}

export function getMonthlySeries(spaceId, months = 6) {
  return monthlySeries(spaceId, months);
}

export function getFullSeries(spaceId) {
  return monthlySeries(spaceId);
}

export function getHourlyPattern(spaceId) {
  return hourlyPattern(spaceId);
}

export function getWindowStats(spaceId, fromKey, toKey) {
  return windowStats(spaceId, fromKey, toKey);
}

/** Utilisation per space — the floor-map heatmap reads this. */
export function getHeatmap() {
  const map = new Map();
  for (const space of SPACES) {
    map.set(space.id, getCurrentStats(space.id).utilization);
  }
  return map;
}

/**
 * Office-wide figures on the dashboard. Group rates are plain averages of the
 * spaces in each group; the total is area-weighted, because a 130㎡ open desk
 * and a 17㎡ phone booth should not count the same.
 */
export function getOfficeUsageSummary() {
  const groups = { meeting: [], work: [], common: [] };
  let weighted = 0;
  let area = 0;

  for (const space of SPACES) {
    const utilization = getCurrentStats(space.id).utilization;
    groups[space.type].push(utilization);
    const size = spaceArea(space);
    weighted += utilization * size;
    area += size;
  }

  const mean = (values) => Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;

  return {
    total: Math.round(weighted / area),
    meeting: Math.round(mean(groups.meeting)),
    work: Math.round(mean(groups.work)),
    common: Math.round(mean(groups.common)),
  };
}

/* ── session logs ───────────────────────────────────────────────────── */

function rangeFor(granularity, anchorDate) {
  if (granularity === "day") return [anchorDate];
  if (granularity === "week") {
    return Array.from({ length: 7 }, (_, i) => addDays(anchorDate, -6 + i));
  }
  return Array.from({ length: 30 }, (_, i) => addDays(anchorDate, -29 + i));
}

export function getSessions(spaceId, granularity, anchorDate) {
  const dates = rangeFor(granularity, anchorDate);
  return dates.flatMap((date) => sessionsForDate(spaceId, date));
}

export function getSessionSummary(spaceId, granularity, anchorDate) {
  const sessions = getSessions(spaceId, granularity, anchorDate);
  if (!sessions.length) {
    return { sessionCount: 0, avgHeadcount: 0, avgDurationMin: 0, totalMinutes: 0 };
  }
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMin, 0);
  const totalPeople = sessions.reduce((sum, s) => sum + s.peopleCount, 0);
  return {
    sessionCount: sessions.length,
    avgHeadcount: Math.round((totalPeople / sessions.length) * 10) / 10,
    avgDurationMin: Math.round(totalMinutes / sessions.length),
    totalMinutes,
  };
}
