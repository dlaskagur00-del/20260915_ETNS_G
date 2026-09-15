/**
 * The only global state in the app: "what am I currently looking at".
 * Server-ish data is never stored here — it is read through src/api/*.
 *
 * selectedSpaceId is deliberately shared by every screen. Moving from the
 * configuration history to the usage history keeps the space, which is what
 * makes the demo scenario flow without the presenter re-selecting anything.
 */

const state = {
  route: "dashboard",
  selectedSpaceId: null,
  selectedAssetId: null,
  selectedChangeId: null,
  selectedInsightId: null,
  selectedProposalId: null,
  selectedProjectId: null,
  usageGranularity: "month",
  usageRange: "6m",
  usageAnchorDate: "2026-09-14",
  showAllHistory: false,
  aiLensOpen: false,
};

const listeners = new Set();

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  for (const listener of listeners) listener(state);
}

export function setState(patch) {
  let changed = false;
  for (const [key, value] of Object.entries(patch)) {
    if (state[key] !== value) {
      state[key] = value;
      changed = true;
    }
  }
  if (changed) notify();
}

/** Changing the space resets everything scoped beneath it. */
export function selectSpace(spaceId) {
  setState({
    selectedSpaceId: spaceId,
    selectedAssetId: null,
    selectedChangeId: null,
    selectedInsightId: null,
    selectedProposalId: null,
    showAllHistory: false,
  });
}

export function selectAsset(assetId) {
  setState({ selectedAssetId: assetId });
}

export function selectChange(changeId) {
  setState({ selectedChangeId: changeId });
}
