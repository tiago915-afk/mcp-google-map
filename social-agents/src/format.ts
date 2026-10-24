import type { Draft, Platform } from "./types.js";

/** Limites de caractères imposées par chaque plateforme. */
export const LIMITS: Record<Platform, { chars: number; hashtags: number }> = {
  linkedin: { chars: 3000, hashtags: 5 },
  facebook: { chars: 63206, hashtags: 3 },
  instagram: { chars: 2200, hashtags: 30 },
};

export function normalizeHashtag(tag: string): string {
  return tag.replace(/^#+/, "").replace(/[^\p{L}\p{N}_]/gu, "");
}

/** Texte final tel qu'il sera publié (hors échappement propre à LinkedIn). */
export function composeText(draft: Draft): string {
  const tags = draft.hashtags
    .map(normalizeHashtag)
    .filter(Boolean)
    .slice(0, LIMITS[draft.platform].hashtags)
    .map((t) => `#${t}`);
  return tags.length ? `${draft.text.trim()}\n\n${tags.join(" ")}` : draft.text.trim();
}

export function validateDraft(draft: Draft): string[] {
  const problems: string[] = [];
  const length = composeText(draft).length;
  const limit = LIMITS[draft.platform].chars;
  if (length > limit) problems.push(`${length} caractères (max ${limit})`);
  if (!draft.text.trim()) problems.push("texte vide");
  return problems;
}

/**
 * LinkedIn interprète le champ `commentary` au format « little text » :
 * les caractères réservés doivent être échappés, et les hashtags
 * s'écrivent {hashtag|\#|mot} pour rester cliquables.
 */
export function toLinkedInLittleText(text: string): string {
  const escaped = text.replace(/[\\|{}@\[\]()<>#*_~]/g, (c) => `\\${c}`);
  return escaped.replace(/\\#([\p{L}\p{N}_]+)/gu, (_m, word: string) => `{hashtag|\\#|${word}}`);
}
