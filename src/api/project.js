import { PROJECTS } from "../data/projects.js";

export function listProjects() {
  return [...PROJECTS].sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1));
}

export function getProject(projectId) {
  return PROJECTS.find((project) => project.id === projectId) || null;
}

export function projectsFor(spaceId) {
  return PROJECTS.filter((project) => project.spaceIds.includes(spaceId));
}

export function projectByInsight(insightId) {
  return PROJECTS.find((project) => project.relatedInsightId === insightId) || null;
}
