/**
 * AI Insight — always an *interpretation of accumulated history*, never a
 * standalone opinion. Every insight carries the evidence it was drawn from, and
 * every recommendation is phrased as something to review, not to execute.
 *
 * Proposed layouts are stored as geometry, not images, so the comparison view
 * renders Current and Proposed through the same scene renderer at an identical
 * camera angle.
 */

export const INSIGHTS = [
  {
    id: "ins-mra-capacity",
    spaceId: "mr-a",
    createdAt: "2026-09-10",
    type: "공간 효율",
    confidence: 0.82,
    status: "검토 대기",
    summary: "12인 회의실이지만 실제 이용은 4~6인에 집중되어 있습니다.",
    reason:
      "현재 12인 규모의 회의실이지만 최근 6개월 평균 이용 인원은 4.2명입니다. " +
      "4~6인 규모의 이용 패턴이 전체 사용의 78%를 차지합니다. " +
      "2024.01 8인 → 12인 확장 이후에도 평균 이용 인원과 이용률에 유의미한 변화가 없었습니다.",
    evidence: [
      { source: "공간 이용 History", label: "최근 6개월 평균 이용 인원", value: "4.2명 / 정원 12인" },
      { source: "공간 이용 History", label: "4~6인 회의 비중", value: "전체 이용의 78%" },
      { source: "구성 × 이용 연결", label: "2024.01 확장 전후 이용률", value: "65.0% → 66.0% (+1.0%p)" },
      { source: "공간 구성 History", label: "확장 투자 비용", value: "₩24,600,000" },
    ],
    recommendations: [
      {
        id: "prop-mra-split",
        title: "12인 회의실 1개 → 6인 회의실 2개 구성 검토",
        description:
          "동시 진행 가능한 회의 수를 2배로 늘리면서, 실제 이용 인원 분포(4~6인)에 맞는 규모로 재구성하는 방향입니다.",
        expectedEffect: "동시 회의 가능 수 1개 → 2개 · 회의실 대기 발생 감소 예상",
        estimatedCost: {
          min: 28000000,
          max: 32000000,
          basis: {
            avgCost: 30500000,
            similarProjects: [
              { title: "회의실 A 확장", year: 2024, cost: 24600000 },
              { title: "집중업무존 A 신설", year: 2024, cost: 16800000 },
              { title: "프로젝트룸 신설", year: 2025, cost: 19800000 },
            ],
            note: "과거 시공 비용 · 자재 가격 · 업체 History · 유사 프로젝트 견적 기준",
            breakdown: [
              { item: "가구 (책상 · 의자)", cost: 12000000 },
              { item: "파티션", cost: 8500000 },
              { item: "조명", cost: 4200000 },
              { item: "전기 · 통신", cost: 3800000 },
              { item: "기타", cost: 1500000 },
            ],
          },
        },
        vendorMatch: { spaceType: "meeting", keywords: ["인테리어", "공간"] },
        layout: {
          boundsFrom: [{ x: 20, y: 0, w: 10, h: 9 }],
          current: [
            {
              id: "cur-mra", name: "회의실 A", type: "meeting", capacity: 12,
              rect: { x: 20, y: 0, w: 10, h: 9 },
            },
          ],
          proposed: [
            {
              id: "prop-mra-1", name: "회의실 A-1", type: "meeting", capacity: 6,
              rect: { x: 20, y: 0, w: 10, h: 4.35 },
            },
            {
              id: "prop-mra-2", name: "회의실 A-2", type: "meeting", capacity: 6,
              rect: { x: 20, y: 4.65, w: 10, h: 4.35 },
            },
          ],
          comparison: [
            { label: "회의실 수", before: "1개 (12인)", after: "2개 (각 6인)" },
            { label: "동시 회의", before: "1건", after: "2건" },
            { label: "좌석 구성", before: "12석", after: "6석 × 2" },
            { label: "이동 동선", before: "단일 출입구", after: "복도측 출입구 2개소" },
          ],
        },
      },
      {
        id: "prop-mra-keep",
        title: "현행 유지 + 예약 규칙 조정 검토",
        description:
          "시공 없이 6인 이하 회의를 소회의실로 유도하는 예약 정책만 조정하는 방향입니다. 비용은 거의 들지 않지만 공간 구성 문제는 남습니다.",
        expectedEffect: "회의실 A 이용률 소폭 하락 · 소회의실 이용률 상승 예상",
        estimatedCost: {
          min: 0,
          max: 1200000,
          basis: {
            avgCost: 600000,
            similarProjects: [{ title: "예약 시스템 정책 변경", year: 2025, cost: 600000 }],
            note: "시스템 설정 변경 및 안내 비용 기준",
          },
        },
        layout: null,
      },
    ],
  },
  {
    id: "ins-focusa-demand",
    spaceId: "focus-a",
    createdAt: "2026-09-08",
    type: "수요 초과",
    confidence: 0.74,
    status: "검토 대기",
    summary: "집중업무존 A의 이용률이 지속적으로 높은 수준을 유지하고 있습니다.",
    reason:
      "집중업무존 A의 현재 이용률은 82%이며, 오전 시간대에는 사실상 포화 상태입니다. " +
      "2025.08 집중업무존 B를 신설한 이후에도 A의 이용률은 유지되고 있어, 수요가 분산되기보다 " +
      "전체 수요 자체가 증가한 것으로 해석됩니다.",
    evidence: [
      { source: "공간 이용 History", label: "현재 이용률", value: "82%" },
      { source: "공간 이용 History", label: "09–11시 이용률", value: "가장 높은 시간대" },
      { source: "공간 구성 History", label: "집중업무존 B 신설", value: "2025.08 · ₩15,200,000" },
    ],
    recommendations: [
      {
        id: "prop-focusa-expand",
        title: "집중 좌석 추가 확보 검토",
        description: "이용률이 낮은 공용 공간 일부를 집중 좌석으로 전환하는 방향을 검토할 수 있습니다.",
        expectedEffect: "집중 좌석 대기 감소 · 공용공간 이용률 일부 하락 예상",
        estimatedCost: {
          min: 9000000,
          max: 12000000,
          basis: {
            avgCost: 10500000,
            similarProjects: [{ title: "집중업무존 B 신설", year: 2025, cost: 15200000 }],
            note: "면적 대비 환산",
          },
        },
        layout: null,
      },
    ],
  },
  {
    id: "ins-mre-lowuse",
    spaceId: "mr-e",
    createdAt: "2026-09-05",
    type: "저활용",
    confidence: 0.68,
    status: "검토 대기",
    summary: "회의실 E는 평균 2.6명이 34분간 사용하는 패턴이 반복되고 있습니다.",
    reason:
      "회의실 E의 이용률은 63%로 낮지 않지만, 평균 이용 인원 2.6명 · 평균 체류 34분으로 " +
      "짧은 소규모 미팅이 대부분입니다. 폰부스 이용률(76% / 73%)이 함께 높은 점을 고려하면 " +
      "1~2인 용도로의 전환을 검토할 수 있습니다.",
    evidence: [
      { source: "공간 이용 History", label: "평균 이용 인원", value: "2.6명 / 정원 4인" },
      { source: "공간 이용 History", label: "평균 체류 시간", value: "34분" },
      { source: "공간 이용 History", label: "폰부스 이용률", value: "76% / 73%" },
    ],
    recommendations: [
      {
        id: "prop-mre-booth",
        title: "1~2인 미팅 부스 전환 검토",
        description: "회의실 E를 소형 미팅 부스 2기로 분할하는 방향입니다.",
        expectedEffect: "1~2인 미팅 수용력 증가 · 폰부스 대기 감소 예상",
        estimatedCost: {
          min: 6000000,
          max: 8000000,
          basis: {
            avgCost: 7000000,
            similarProjects: [{ title: "폰부스 신설", year: 2024, cost: 6400000 }],
            note: "폰부스 신설 실적 기준",
          },
        },
        layout: null,
      },
    ],
  },
];
