/**
 * Data access layer. Pages and components never import from src/data directly —
 * they come through here, so swapping the mock for a real API later is a change
 * contained to this folder.
 */

import { OFFICE, SPACES, SPACE_TYPES, spaceArea } from "../data/office.js";
import { ASSETS, assetsOf, CATEGORIES, CATEGORY_GROUPS, CATEGORY_ORDER, groupOf } from "../data/assets.js";

export { CATEGORIES, CATEGORY_GROUPS, CATEGORY_ORDER, groupOf, SPACE_TYPES };

export function getOffice() {
  return OFFICE;
}

export function listSpaces() {
  return SPACES;
}

export function getSpace(spaceId) {
  return SPACES.find((space) => space.id === spaceId) || null;
}

export function getSpaceArea(space) {
  return spaceArea(space);
}

export function getSpaceCounts() {
  const counts = { total: SPACES.length, meeting: 0, work: 0, common: 0 };
  for (const space of SPACES) counts[space.type] += 1;
  return counts;
}

export function listAssets(spaceId) {
  return assetsOf(spaceId);
}

export function getAsset(assetId) {
  return ASSETS.find((asset) => asset.id === assetId) || null;
}

export function assetCategoryCounts(spaceId) {
  const counts = new Map();
  for (const asset of assetsOf(spaceId)) {
    counts.set(asset.category, (counts.get(asset.category) || 0) + 1);
  }
  return counts;
}
