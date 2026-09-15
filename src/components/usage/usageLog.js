import { el, emptyState } from "../../lib/dom.js";
import { dotDate, weekdayKo } from "../../lib/format.js";

function clock(startMin) {
  const h = String(Math.floor(startMin / 60)).padStart(2, "0");
  const m = String(startMin % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * 공간 이용 History — the raw log, not just the aggregate. A statistics
 * dashboard answers "지금 얼마나 쓰이나"; this answers "언제 누가 어떻게 썼나".
 */
export function usageLog({ sessions, granularity, limit = 14 }) {
  if (!sessions.length) {
    return emptyState("해당 기간의 이용 기록이 없습니다.", "다른 기간을 선택해 보세요.");
  }

  const ordered = [...sessions].sort((a, b) =>
    a.date === b.date ? b.startMin - a.startMin : a.date < b.date ? 1 : -1
  );
  const visible = ordered.slice(0, limit);

  const rows = [];
  let lastDate = null;

  for (const session of visible) {
    if (session.date !== lastDate) {
      lastDate = session.date;
      rows.push(
        el(
          "div",
          { class: "log-date" },
          `${dotDate(session.date)} (${weekdayKo(session.date)})`
        )
      );
    }
    rows.push(
      el(
        "div",
        { class: "log-row" },
        el("span", { class: "lg-time" }, clock(session.startMin)),
        el("span", { class: "lg-type" }, session.usageType),
        el("span", { class: "lg-people" }, `${session.peopleCount}명`),
        el("span", { class: "lg-dur" }, `${session.durationMin}분`)
      )
    );
  }

  if (ordered.length > visible.length) {
    rows.push(
      el(
        "div",
        { class: "log-more" },
        `외 ${ordered.length - visible.length}건 · ${granularity === "day" ? "일" : granularity === "week" ? "주" : "월"} 단위 기준`
      )
    );
  }

  return el("div", {}, ...rows);
}
