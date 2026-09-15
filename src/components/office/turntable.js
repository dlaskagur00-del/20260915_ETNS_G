import { el } from "../../lib/dom.js";
import { getVisualAsset } from "../../api/assets.js";
import { TURNTABLES, TURNTABLE_FRAMES } from "../../data/objectHotspots.js";

/**
 * 오브젝트 360° 뷰어.
 *
 * 3D 엔진 대신 여러 각도에서 렌더한 이미지를 드래그로 넘깁니다. 빌드 도구가
 * 없는 프로젝트라 무거운 런타임을 들이지 않으면서도 "돌려보는" 경험은 같습니다.
 *
 * 프레임 이미지가 하나도 없으면 null을 돌려주고, 화면은 기존 단일 제품 사진으로
 * 떨어집니다.
 */

function frameIds(baseId) {
  return Array.from(
    { length: TURNTABLE_FRAMES },
    (_, i) => `${baseId}_${String(i).padStart(2, "0")}`
  );
}

export function hasTurntable(assetId) {
  const base = TURNTABLES[assetId];
  if (!base) return false;
  return frameIds(base).every((id) => getVisualAsset(id)?.status === "ready");
}

export function turntable(assetId, { label } = {}) {
  const base = TURNTABLES[assetId];
  if (!base || !hasTurntable(assetId)) return null;

  const frames = frameIds(base).map((id) => getVisualAsset(id));
  let index = 0;

  const viewer = el("div", { class: "turntable" });
  const stage = el("div", { class: "turntable-stage" });

  const images = frames.map((entry, i) =>
    el("img", {
      class: i === 0 ? "turntable-frame is-on" : "turntable-frame",
      src: entry.url,
      alt: `${label || entry.name} — ${i * Math.round(360 / TURNTABLE_FRAMES)}도`,
      draggable: "false",
      decoding: "async",
    })
  );
  stage.append(...images);

  const show = (next) => {
    const wrapped = ((next % frames.length) + frames.length) % frames.length;
    if (wrapped === index) return;
    images[index].classList.remove("is-on");
    images[wrapped].classList.add("is-on");
    index = wrapped;
    readout.textContent = `${wrapped * Math.round(360 / TURNTABLE_FRAMES)}°`;
  };

  // 드래그한 거리에 따라 프레임을 넘깁니다.
  let dragging = false;
  let startX = 0;
  let startIndex = 0;
  const STEP_PX = 45;

  const onDown = (event) => {
    dragging = true;
    startX = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    startIndex = index;
    stage.classList.add("is-dragging");
  };
  const onMove = (event) => {
    if (!dragging) return;
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    show(startIndex + Math.round((x - startX) / STEP_PX));
  };
  const onUp = () => {
    dragging = false;
    stage.classList.remove("is-dragging");
  };

  stage.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);

  const readout = el("span", { class: "turntable-deg" }, "0°");

  const controls = el(
    "div",
    { class: "turntable-bar" },
    el("button", { class: "btn ghost", type: "button", onClick: () => show(index - 1) }, "◀"),
    el("span", { class: "turntable-hint" }, "드래그해서 돌려보세요"),
    readout,
    el("button", { class: "btn ghost", type: "button", onClick: () => show(index + 1) }, "▶")
  );

  viewer.append(stage, controls);
  return viewer;
}
