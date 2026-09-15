import { chip, el } from "../../lib/dom.js";
import { CHANGE_TYPES } from "../../api/history.js";
import { dotDate } from "../../lib/format.js";

/**
 * Change timeline. Shows only the most recent entries by default — the brief's
 * "정보는 많지만 한 번에 보이는 정보는 적게" rule — and expands on demand.
 */
export function timeline({ changes, selectedId, onSelect, limit = 2, expanded = false }) {
  const visible = expanded ? changes : changes.slice(0, limit);

  return el(
    "div",
    { class: "tl" },
    ...visible.map((change) =>
      el(
        "div",
        {
          class: change.id === selectedId ? "tl-item is-selected" : "tl-item",
          onClick: () => onSelect(change.id),
        },
        el("div", { class: "tl-date" }, dotDate(change.changedAt)),
        el("div", { class: "tl-rail" }, el("div", { class: "tl-dot" }), el("div", { class: "tl-line" })),
        el(
          "div",
          { class: "tl-body" },
          el(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" } },
            el("span", { class: "tl-title" }, change.title),
            chip(CHANGE_TYPES[change.changeType], change.impactWindow ? "accent" : null)
          ),
          el("div", { class: "tl-sub" }, change.reason)
        )
      )
    )
  );
}
