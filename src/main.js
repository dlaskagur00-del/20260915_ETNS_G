import { mount } from "./lib/dom.js";
import { loadVisualAssets } from "./data/visualAssets.js";
import { startRouter } from "./lib/router.js";
import { getState, subscribe } from "./store/selection.js";
import { appShell } from "./components/layout/appShell.js";
import { dashboardPage } from "./pages/dashboard.js";
import { configurationPage } from "./pages/configuration.js";
import { usagePage } from "./pages/usage.js";
import { insightPage } from "./pages/insight.js";
import { projectPage } from "./pages/project.js";

const PAGES = {
  dashboard: dashboardPage,
  configuration: configurationPage,
  usage: usagePage,
  insight: insightPage,
  project: projectPage,
};

const root = document.getElementById("app");

function render() {
  const state = getState();
  const page = PAGES[state.route] || dashboardPage;
  const scrolled = root.querySelector(".page")?.scrollTop ?? 0;

  mount(root, appShell(state, page(state)));

  const pageNode = root.querySelector(".page");
  if (pageNode) pageNode.scrollTop = scrolled;
}

// 매니페스트를 먼저 읽어 두면 이후 렌더는 전부 동기로 유지됩니다.
await loadVisualAssets();

subscribe(render);
startRouter();
render();
