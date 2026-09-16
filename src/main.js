import { el, mount } from "./lib/dom.js";
import { loadVisualAssets } from "./data/visualAssets.js";
import { navigate, startRouter } from "./lib/router.js";
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

  let body;
  try {
    body = page(state);
  } catch (error) {
    // 한 화면이 터져도 앱 전체가 백지가 되지는 않게 합니다. 발표나 녹화 중에는
    // 새로고침 말고는 복구할 방법이 없기 때문에, 최소한 어디로 돌아가야 하는지는
    // 화면에 남아 있어야 합니다.
    console.error("[render] 화면을 그리지 못했습니다:", error);
    body = el(
      "div",
      { class: "render-error" },
      el("div", { class: "render-error-k" }, "이 화면을 표시하지 못했습니다"),
      el("div", { class: "render-error-t" }, "다른 화면은 정상입니다. 대시보드로 돌아가 주세요."),
      el(
        "button",
        { class: "btn primary", onClick: () => navigate("dashboard") },
        "대시보드로"
      )
    );
  }

  mount(root, appShell(state, body));

  const pageNode = root.querySelector(".page");
  if (pageNode) pageNode.scrollTop = scrolled;
}

// 매니페스트를 먼저 읽어 두면 이후 렌더는 전부 동기로 유지됩니다.
await loadVisualAssets();

subscribe(render);
startRouter();
render();
