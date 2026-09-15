/**
 * Usage demo data.
 *
 * Monthly series and raw sessions are produced by a *seeded* generator, so the
 * numbers never shift between refreshes during a presentation. Figures that the
 * demo script says out loud (회의실 A: 72% / 4.2명 / 48분 / 14–16시) are pinned
 * as explicit targets rather than left to chance.
 */

import { SPACES } from "./office.js";

/* ── seeded RNG ─────────────────────────────────────────────────────── */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* ── per-space profile: current utilisation + behaviour ──────────────── */
/* Group averages land exactly on 회의실 68 / 업무 81 / 공용 54, and the
   area-weighted total on 72 — the figures shown on the dashboard. */
export const PROFILES = {
  "mr-a":        { util: 72, head: 4.2, dur: 48, peak: [14, 16], kind: "meeting" },
  "mr-b":        { util: 66, head: 3.4, dur: 41, peak: [10, 12], kind: "meeting" },
  "mr-c":        { util: 71, head: 5.1, dur: 52, peak: [11, 13], kind: "meeting" },
  "mr-d":        { util: 58, head: 3.1, dur: 38, peak: [15, 17], kind: "meeting" },
  "mr-e":        { util: 63, head: 2.6, dur: 34, peak: [13, 15], kind: "meeting" },
  "mr-f":        { util: 74, head: 6.8, dur: 63, peak: [10, 12], kind: "meeting" },
  "mr-g":        { util: 69, head: 3.8, dur: 45, peak: [14, 16], kind: "meeting" },
  "mr-h":        { util: 71, head: 2.4, dur: 31, peak: [16, 18], kind: "meeting" },
  "exec":        { util: 68, head: 2.2, dur: 96, peak: [9, 11], kind: "work" },
  "od-a":        { util: 86, head: 16.4, dur: 214, peak: [10, 12], kind: "work" },
  "od-b":        { util: 89, head: 17.1, dur: 221, peak: [10, 12], kind: "work" },
  "focus-a":     { util: 82, head: 7.9, dur: 118, peak: [9, 11], kind: "work" },
  "booth-1":     { util: 76, head: 1.0, dur: 22, peak: [11, 13], kind: "work" },
  "booth-2":     { util: 73, head: 1.0, dur: 19, peak: [15, 17], kind: "work" },
  "project-room":{ util: 80, head: 5.6, dur: 142, peak: [13, 15], kind: "work" },
  "od-c":        { util: 88, head: 15.2, dur: 218, peak: [10, 12], kind: "work" },
  "od-d":        { util: 85, head: 13.1, dur: 209, peak: [11, 13], kind: "work" },
  "focus-b":     { util: 83, head: 5.4, dur: 124, peak: [14, 16], kind: "work" },
  "reception":   { util: 48, head: 2.1, dur: 12, peak: [9, 11], kind: "common" },
  "lounge":      { util: 63, head: 6.4, dur: 34, peak: [12, 14], kind: "common" },
  "rest":        { util: 58, head: 4.2, dur: 21, peak: [12, 14], kind: "common" },
  "pantry":      { util: 61, head: 2.8, dur: 9, peak: [12, 14], kind: "common" },
  "print":       { util: 52, head: 1.4, dur: 6, peak: [16, 18], kind: "common" },
  "storage":     { util: 42, head: 1.2, dur: 8, peak: [9, 11], kind: "common" },
};

/* ── monthly series ─────────────────────────────────────────────────── */
export const SERIES_START = "2023-03";
export const SERIES_END = "2026-09";

/** 회의실 A: the six months the demo script quotes, pinned exactly. */
const PINNED = {
  "mr-a": {
    "2026-04": 64, "2026-05": 67, "2026-06": 71,
    "2026-07": 69, "2026-08": 74, "2026-09": 72,
  },
};

/**
 * 회의실 A was expanded 8인 → 12인 in 2024-01. Utilisation barely moved
 * (65% → 66%) and average headcount barely moved (4.1 → 4.3) — that flat line
 * is the evidence the whole product exists to surface.
 */
const REGIME = {
  // Calibrated so the computed before/after windows land on the figures the
  // demo script quotes: 65% / 4.1명 → 66% / 4.3명.
  "mr-a": [
    { until: "2024-01", util: 63.9, head: 4.1 },
    { until: "2026-04", util: 65.5, head: 4.3 },
  ],
};

function monthKeys(from = SERIES_START, to = SERIES_END) {
  const keys = [];
  let [year, month] = from.split("-").map(Number);
  const [endYear, endMonth] = to.split("-").map(Number);
  while (year < endYear || (year === endYear && month <= endMonth)) {
    keys.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month > 12) { month = 1; year += 1; }
  }
  return keys;
}

export const MONTH_KEYS = monthKeys();

function regimeFor(spaceId, monthKey) {
  const regimes = REGIME[spaceId];
  if (!regimes) return null;
  for (const regime of regimes) {
    if (monthKey < regime.until) return regime;
  }
  return null;
}

function buildMonthly(space) {
  const profile = PROFILES[space.id];
  const rng = mulberry32(hashSeed("month:" + space.id));
  const opened = space.builtAt;

  // Spaces added after the office opened ramp up over their first year;
  // original spaces were already at steady state.
  const ramps = space.builtAt !== "2023-03";

  return MONTH_KEYS.filter((key) => key >= opened).map((key, index, all) => {
    const isCurrent = key === SERIES_END;
    const pinned = PINNED[space.id]?.[key];
    const regime = regimeFor(space.id, key);

    const maturity = ramps ? Math.min(1, (index + 3) / 14) : 1;
    const baseUtil = regime ? regime.util : profile.util;
    const baseHead = regime ? regime.head : profile.head;
    const noise = (rng() - 0.5) * 5.5;
    const seasonal = Math.sin((index / all.length) * Math.PI * 2.2) * 1.6;

    // The newest month is the "현재" figure quoted on the dashboard and in the
    // usage panel, so it is exactly the profile rather than a noisy draw.
    const utilization = isCurrent
      ? profile.util
      : pinned ?? Math.max(18, Math.min(96, baseUtil * (0.72 + 0.28 * maturity) + noise + seasonal));
    const avgHeadcount = isCurrent
      ? profile.head
      : baseHead * (0.9 + 0.1 * maturity) + (rng() - 0.5) * 0.28;
    const avgDurationMin = isCurrent ? profile.dur : profile.dur * (0.94 + rng() * 0.12);
    const sessionCount = Math.round((utilization / 100) * 20 * (540 / profile.dur));

    return {
      spaceId: space.id,
      granularity: "month",
      periodKey: key,
      stats: {
        utilization: Math.round(utilization * 10) / 10,
        avgHeadcount: Math.round(avgHeadcount * 10) / 10,
        avgDurationMin: Math.round(avgDurationMin),
        sessionCount,
      },
    };
  });
}

const MONTHLY = new Map(SPACES.map((space) => [space.id, buildMonthly(space)]));

export function monthlySeries(spaceId, months) {
  const all = MONTHLY.get(spaceId) || [];
  return months ? all.slice(-months) : all;
}

/** Average of the monthly series inside a window — used for change impact. */
export function windowStats(spaceId, fromKey, toKey) {
  const rows = (MONTHLY.get(spaceId) || []).filter((r) => r.periodKey >= fromKey && r.periodKey <= toKey);
  if (!rows.length) return null;
  const sum = rows.reduce(
    (acc, r) => ({
      utilization: acc.utilization + r.stats.utilization,
      avgHeadcount: acc.avgHeadcount + r.stats.avgHeadcount,
      avgDurationMin: acc.avgDurationMin + r.stats.avgDurationMin,
      sessionCount: acc.sessionCount + r.stats.sessionCount,
    }),
    { utilization: 0, avgHeadcount: 0, avgDurationMin: 0, sessionCount: 0 }
  );
  return {
    utilization: Math.round((sum.utilization / rows.length) * 10) / 10,
    avgHeadcount: Math.round((sum.avgHeadcount / rows.length) * 10) / 10,
    avgDurationMin: Math.round(sum.avgDurationMin / rows.length),
    sessionCount: sum.sessionCount,
    months: rows.length,
  };
}

/* ── hourly pattern ─────────────────────────────────────────────────── */
export const HOUR_BUCKETS = ["09-11", "11-13", "13-15", "15-17", "17-19"];

/** The quietest two-hour band — the counterpart to Peak Time. */
export function lowUseBand(spaceId) {
  const pattern = hourlyPattern(spaceId);
  return pattern.reduce((low, bucket) => (bucket.value < low.value ? bucket : low), pattern[0]);
}

export function hourlyPattern(spaceId) {
  const profile = PROFILES[spaceId];
  const rng = mulberry32(hashSeed("hour:" + spaceId));
  const [peakStart] = profile.peak;

  return HOUR_BUCKETS.map((range) => {
    const start = Number(range.slice(0, 2));
    const distance = Math.abs(start - peakStart) / 2;
    const value = profile.util * (1.18 - distance * 0.22) * (0.92 + rng() * 0.16);
    return { range, value: Math.max(8, Math.round(value)) };
  });
}

/* ── weekday pattern ────────────────────────────────────────────────── */
export const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

/** Utilisation by day of week — Mondays and Fridays sag, weekends are near-empty. */
export function weekdayPattern(spaceId) {
  const profile = PROFILES[spaceId];
  const rng = mulberry32(hashSeed("wday:" + spaceId));
  const shape = [0.92, 1.06, 1.08, 1.04, 0.9, 0.12, 0.05];

  return WEEKDAYS.map((label, index) => ({
    label,
    value: Math.max(1, Math.round(profile.util * shape[index] * (0.95 + rng() * 0.1))),
    isWeekend: index >= 5,
  }));
}

/* ── raw sessions (day / week views) ────────────────────────────────── */
const USAGE_TYPES = {
  meeting: ["정기회의", "프로젝트 미팅", "외부 미팅", "1:1"],
  work: ["집중업무", "협업", "개인업무"],
  common: ["휴식", "대기", "간단 미팅"],
};

function isBusinessDay(iso) {
  const day = new Date(iso + "T00:00:00").getDay();
  return day !== 0 && day !== 6;
}

export function sessionsForDate(spaceId, dateIso) {
  if (!isBusinessDay(dateIso)) return [];

  const profile = PROFILES[spaceId];
  const rng = mulberry32(hashSeed(`sess:${spaceId}:${dateIso}`));
  const monthKey = dateIso.slice(0, 7);
  const monthly = (MONTHLY.get(spaceId) || []).find((r) => r.periodKey === monthKey);
  const utilization = monthly ? monthly.stats.utilization : profile.util;

  const bookedMinutes = (utilization / 100) * 540 * (0.82 + rng() * 0.36);
  const sessions = [];
  let cursor = 9 * 60 + Math.round(rng() * 25);
  let used = 0;

  while (used < bookedMinutes && cursor < 19 * 60) {
    const duration = Math.max(15, Math.round((profile.dur * (0.6 + rng() * 0.85)) / 5) * 5);
    if (cursor + duration > 19 * 60) break;

    const inPeak = cursor >= profile.peak[0] * 60 && cursor < profile.peak[1] * 60;
    const headcount = Math.max(
      1,
      Math.round(profile.head * (inPeak ? 1.15 : 0.85) + (rng() - 0.5) * 2)
    );
    const types = USAGE_TYPES[profile.kind];

    sessions.push({
      id: `${spaceId}-${dateIso}-${sessions.length}`,
      spaceId,
      date: dateIso,
      startMin: cursor,
      durationMin: duration,
      peopleCount: headcount,
      usageType: types[Math.floor(rng() * types.length)],
    });

    used += duration;
    cursor += duration + Math.round((10 + rng() * 45) / 5) * 5;
  }

  return sessions;
}
