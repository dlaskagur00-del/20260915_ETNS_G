/**
 * Visual Asset 매니페스트.
 *
 * 단일 진실 원천은 `assets/visual-assets.json`입니다 — Python 파이프라인이
 * 파일을 스캔해 status를 required → ready로 바꾸고, 앱은 그 결과만 읽습니다.
 * 이미지 경로를 컴포넌트에 직접 쓰지 않는 이유이기도 합니다: 나중에 Supabase
 * Storage로 옮겨도 이 파일의 url만 바뀌고 화면 코드는 그대로입니다.
 */

const MANIFEST_URL = "assets/visual-assets.json";

let manifest = { version: 0, assets: {} };
let loaded = false;

export async function loadVisualAssets() {
  try {
    const response = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`manifest ${response.status}`);
    manifest = await response.json();
    loaded = true;
  } catch (error) {
    // 매니페스트가 없어도 앱은 동작해야 합니다 — 전부 Placeholder로 떨어집니다.
    console.warn("[assets] 매니페스트를 불러오지 못했습니다:", error.message);
    manifest = { version: 0, assets: {} };
    loaded = false;
  }
  return manifest;
}

export function manifestLoaded() {
  return loaded;
}

export function allAssets() {
  return manifest.assets || {};
}

export function assetEntry(assetId) {
  return manifest.assets?.[assetId] || null;
}
