import { SUPABASE, storageUrl, supabaseEnabled } from "../data/supabaseConfig.js";

/**
 * Supabase REST 접근 — SDK 없이 fetch만 씁니다.
 *
 * 빌드 도구가 없는 프로젝트라 npm 패키지를 쓸 수 없고, 필요한 것도 읽기 한 종류뿐이라
 * 직접 호출하는 편이 의존성 없이 깔끔합니다.
 */

const TIMEOUT_MS = 4000;

async function restGet(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${SUPABASE.url}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE.anonKey,
        Authorization: `Bearer ${SUPABASE.anonKey}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * visual_assets 테이블을 매니페스트와 같은 형태로 변환해 돌려줍니다.
 *
 * 이미지 파일이 실제로 Storage에 있는지까지는 확인하지 않습니다 — 없으면
 * assetImage 컴포넌트가 Placeholder로 떨어지므로 화면이 깨지지 않습니다.
 */
export async function fetchVisualAssets() {
  if (!supabaseEnabled()) return null;

  const rows = await restGet("visual_assets?select=*");
  const assets = {};

  for (const row of rows) {
    assets[row.id] = {
      status: "ready",
      type: row.asset_type,
      name: row.name,
      url: storageUrl(row.storage_path),
      thumbnailUrl: storageUrl(row.thumbnail_path || row.storage_path),
      alt: row.alt_text || row.name,
      ratio: row.ratio || "4:3",
      width: row.width,
      height: row.height,
      source: row.source,
      sourceUrl: row.source_url,
      license: row.license,
      purpose: row.purpose,
      createdAt: row.created_at,
    };
  }

  return { version: "supabase", assets };
}
