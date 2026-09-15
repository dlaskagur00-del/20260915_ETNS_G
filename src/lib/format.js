export function won(value) {
  return "₩" + value.toLocaleString("ko-KR");
}

export function manwon(value) {
  return Math.round(value / 10000).toLocaleString("ko-KR") + "만원";
}

export function pct(value, digits = 0) {
  return value.toFixed(digits) + "%";
}

/** "2026-06-01" → "2026.06.01" */
export function dotDate(iso) {
  return iso.slice(0, 10).replace(/-/g, ".");
}

/** "2026-06-01" → "2026.06" */
export function dotMonth(iso) {
  return iso.slice(0, 7).replace(/-/g, ".");
}

export function monthLabel(periodKey) {
  const month = Number(periodKey.slice(5, 7));
  return ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][month - 1];
}

export function minutes(value) {
  return Math.round(value) + "분";
}

export function people(value) {
  return value.toFixed(1) + "명";
}

export function signed(value, digits = 0) {
  const fixed = value.toFixed(digits);
  return value > 0 ? "+" + fixed : fixed;
}

export function addDays(iso, days) {
  const date = new Date(iso + "T00:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekdayKo(iso) {
  return ["일", "월", "화", "수", "목", "금", "토"][new Date(iso + "T00:00:00").getDay()];
}
