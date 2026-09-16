const SVG_NS = "http://www.w3.org/2000/svg";

function applyProps(node, props) {
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;

    if (key === "class") {
      node.setAttribute("class", Array.isArray(value) ? value.filter(Boolean).join(" ") : value);
    } else if (key === "style" && typeof value === "object") {
      Object.assign(node.style, value);
    } else if (key === "dataset") {
      Object.assign(node.dataset, value);
    } else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "html") {
      node.innerHTML = value;
    } else {
      node.setAttribute(key, value === true ? "" : value);
    }
  }
}

function appendChildren(node, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  applyProps(node, props);
  appendChildren(node, children);
  return node;
}

export function svg(tag, props = {}, ...children) {
  const node = document.createElementNS(SVG_NS, tag);
  applyProps(node, props);
  appendChildren(node, children);
  return node;
}

export function frag(...children) {
  const f = document.createDocumentFragment();
  appendChildren(f, children);
  return f;
}

export function mount(container, ...children) {
  container.replaceChildren();
  appendChildren(container, children);
  return container;
}

/** Common building blocks used across pages. */
export function panel({ title, sub, actions, flush = false, foot }, ...body) {
  return el(
    "section",
    { class: "panel" },
    title &&
      el(
        "div",
        { class: "panel-head" },
        el("div", {}, el("h2", {}, title), sub && el("div", { class: "sub" }, sub)),
        actions || null
      ),
    el("div", { class: flush ? "panel-body flush" : "panel-body" }, ...body),
    foot && el("div", { class: "panel-foot" }, foot)
  );
}

export function detailRow(key, value, opts = {}) {
  return el(
    "div",
    { class: "drow" },
    el("div", { class: "dk" }, key),
    el("div", { class: opts.mono ? "dv mono" : "dv" }, value)
  );
}

export function contextNote(label, value) {
  return el(
    "div",
    { class: "dnote" },
    el("div", { class: "dk" }, label),
    el("div", { class: "dv" }, value)
  );
}

export function chip(text, variant) {
  return el("span", { class: variant ? `chip ${variant}` : "chip" }, text);
}

export function demoMark() {
  return el("span", { class: "demo-mark" }, "* Demo Data");
}

export function emptyState(big, small) {
  return el("div", { class: "empty" }, el("div", { class: "big" }, big), small && el("div", {}, small));
}

export function segmented(options, activeValue, onSelect) {
  return el(
    "div",
    { class: "seg" },
    ...options.map((opt) =>
      el(
        "button",
        {
          class: opt.value === activeValue ? "is-active" : "",
          onClick: () => onSelect(opt.value),
        },
        opt.label
      )
    )
  );
}
