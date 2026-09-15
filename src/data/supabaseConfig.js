/**
 * Supabase 연결 설정.
 *
 * 아래 두 값을 채우면 앱이 이미지와 메타데이터를 Supabase에서 읽어옵니다.
 * 비워 두면 로컬 assets/ 폴더를 그대로 사용하므로, 설정 전에도 앱은 정상 동작합니다.
 *
 * anon 키는 프런트엔드에 노출되는 것을 전제로 설계된 공개 키입니다.
 * 읽기 전용 정책(RLS)만 열려 있으므로 이 파일에 넣어도 됩니다.
 * 반대로 service_role 키는 절대 여기에 넣지 마세요.
 *
 * 값은 Supabase 대시보드 → Project Settings → API 에서 확인할 수 있습니다.
 */

export const SUPABASE = {
  /** 예: https://abcdefghijklm.supabase.co */
  url: "",

  /** Project Settings → API → Project API keys → anon / public */
  anonKey: "",

  /** Storage 버킷 이름 */
  bucket: "office-history-assets",
};

export function supabaseEnabled() {
  return Boolean(SUPABASE.url && SUPABASE.anonKey);
}

/** 버킷 내 상대 경로 → 공개 URL */
export function storageUrl(path) {
  if (!SUPABASE.url || !path) return null;
  return `${SUPABASE.url}/storage/v1/object/public/${SUPABASE.bucket}/${path}`;
}
