/**
 * Deterministic "random" pick: the same key always gives the same answer, so
 * server and client agree and the choice is stable between visits.
 */
export function pickForPixelReveal(key: string, ratio = 0.4) {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1000) / 1000 < ratio;
}
