export const PLATFORMS = ["linkedin", "facebook", "instagram"] as const;
export type Platform = (typeof PLATFORMS)[number];

export interface Brief {
  /** Ce que vous voulez communiquer (sujet, annonce, idée). */
  topic: string;
  /** Image publique (URL https) — obligatoire pour Instagram. */
  imageUrl?: string;
  /** Lien à mettre en avant (Facebook, LinkedIn). */
  link?: string;
}

export interface Draft {
  platform: Platform;
  text: string;
  hashtags: string[];
  altText?: string;
}

export interface PublishResult {
  platform: Platform;
  id: string;
  url?: string;
}
