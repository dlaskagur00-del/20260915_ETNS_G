/**
 * 업체 History.
 *
 * A vendor name on its own tells the next person nothing. What carries value is
 * what this organisation actually experienced working with them — that is the
 * part that disappears when a manager changes, and the part this file keeps.
 *
 * Counts, costs and durations are NOT stored here: they are derived from the
 * change and project history in src/api/vendors.js, so the record cannot drift
 * away from what actually happened.
 */

export const VENDOR_NOTES = {
  "OO Interior": {
    id: "v-interior",
    specialty: "인테리어 · 공간 시공",
    strengths: ["납기 준수", "주말 야간 시공 대응 가능"],
    cautions: ["회의실 방음 보완 필요 — 2024.01 확장 시 잔향 민원 발생, 흡음 패널 추가 시공"],
    note: "대규모 공간 변경에 주로 사용. 견적 대비 최종 비용 편차가 작은 편입니다.",
  },
  "OO Office": {
    id: "v-office",
    specialty: "가구 · 집기",
    strengths: ["제품 라인업 다양", "부분 교체(상판 등) 대응"],
    cautions: ["납기 3주 이상 소요되는 품목 있음 — 확장 프로젝트와 일정 조율 필요"],
    note: "가구 단품 교체에 적합. 기존 자산 재활용 제안을 먼저 해주는 편입니다.",
  },
  "OO Electric": {
    id: "v-electric",
    specialty: "조명 · 전기",
    strengths: ["조도 측정 리포트 제공", "시공 기간 짧음"],
    cautions: ["조광 제어 연동은 별도 견적"],
    note: "조도 개선 건에서 사전 측정 → 시공 → 사후 측정까지 기록을 남겨주어 History 축적에 유리합니다.",
  },
  "OO Systems": {
    id: "v-systems",
    specialty: "설비 · IT 장비",
    strengths: ["화상회의 장비 세팅 포함", "정기 방문 관리 계약 가능"],
    cautions: ["센서 감도 등 초기 조정 이력 있음 — 설치 후 2주 내 재점검 권장"],
    note: "장비 도입 후 운영 단계 이슈가 기록으로 남아 있어 재구매 판단에 참고 가능합니다.",
  },
  "자체 시공": {
    id: "v-inhouse",
    specialty: "내부 처리",
    strengths: ["비용 최소", "즉시 대응"],
    cautions: ["보증 없음"],
    note: "자산 재배치 등 단순 건에 한해 사용합니다.",
  },
};
