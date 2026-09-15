import { INSIGHTS } from "../data/insights.js";

export function listInsights() {
  return [...INSIGHTS].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function insightsFor(spaceId) {
  return INSIGHTS.filter((insight) => insight.spaceId === spaceId);
}

export function getInsight(insightId) {
  return INSIGHTS.find((insight) => insight.id === insightId) || null;
}

export function getProposal(proposalId) {
  for (const insight of INSIGHTS) {
    const found = insight.recommendations.find((rec) => rec.id === proposalId);
    if (found) return { insight, proposal: found };
  }
  return null;
}
