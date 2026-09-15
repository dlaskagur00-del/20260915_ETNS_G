import { getState, setState, subscribe } from "../store/selection.js";

export const ROUTES = ["dashboard", "configuration", "usage", "insight", "project"];

let applying = false;

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, query] = raw.split("?");
  const params = new URLSearchParams(query || "");
  return {
    route: ROUTES.includes(path) ? path : "dashboard",
    space: params.get("space"),
  };
}

/** The selected space lives in the URL so a refresh mid-demo restores it. */
function writeHash() {
  const { route, selectedSpaceId } = getState();
  const next = selectedSpaceId ? `#/${route}?space=${selectedSpaceId}` : `#/${route}`;
  if (location.hash !== next) {
    applying = true;
    location.hash = next;
    applying = false;
  }
}

function readHash() {
  const { route, space } = parseHash();
  setState({ route, selectedSpaceId: space || getState().selectedSpaceId });
}

export function navigate(route, spaceId) {
  const patch = { route };
  if (spaceId !== undefined) patch.selectedSpaceId = spaceId;
  setState(patch);
}

export function startRouter() {
  window.addEventListener("hashchange", () => {
    if (applying) return;
    readHash();
  });
  subscribe(writeHash);

  if (location.hash) readHash();
  else writeHash();
}
