/**
 * Visual Asset 매니페스트.
 *
 * 우선순위는 Supabase → 로컬 파일입니다.
 *
 * Supabase가 설정되어 있으면 그쪽을 진짜 원천으로 삼되, 응답이 없거나 실패하면
 * 곧바로 로컬 assets/visual-assets.json 으로 내려갑니다. 발표장에서 네트워크가
 * 끊겨도 화면이 그대로 떠야 하기 때문입니다.
 *
 * 로컬 매니페스트는 Python 파이프라인이 파일을 스캔해 status를 갱신합니다.
 * 이미지 경로를 컴포넌트에 직접 쓰지 않는 이유이기도 합니다: 원천이 바뀌어도
 * 화면 코드는 그대로입니다.
 */

import { fetchVisualAssets } from "../api/supabase.js";
import { supabaseEnabled } from "./supabaseConfig.js";

const MANIFEST_URL = "assets/visual-assets.json";

let manifest = { version: 0, assets: {} };
let source = "none";

async function loadLocal() {
  const response = await fetch(MANIFEST_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`manifest ${response.status}`);
  return await response.json();
}

export async function loadVisualAssets() {
  if (supabaseEnabled()) {
    try {
      const remote = await fetchVisualAssets();
      if (remote && Object.keys(remote.assets).length) {
        manifest = remote;
        source = "supabase";
        return manifest;
      }
    } catch (error) {
      console.warn("[assets] Supabase 조회 실패 — 로컬 매니페스트로 전환합니다:", error.message);
    }
  }

  try {
    manifest = await loadLocal();
    source = "local";
  } catch (error) {
    // 매니페스트가 없어도 앱은 동작해야 합니다 — 전부 Placeholder로 떨어집니다.
    console.warn("[assets] 매니페스트를 불러오지 못했습니다:", error.message);
    manifest = { version: 0, assets: {} };
    source = "none";
  }

  return manifest;
}

/** "supabase" | "local" | "none" — 화면에 현재 원천을 표시하는 데 씁니다. */
export function assetSource() {
  return source;
}

export function manifestLoaded() {
  return source !== "none";
}

export function allAssets() {
  return manifest.assets || {};
}

export function assetEntry(assetId) {
  return manifest.assets?.[assetId] || null;
}
