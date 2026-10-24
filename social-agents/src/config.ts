import "dotenv/config";

function optional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function required(name: string): string {
  const value = optional(name);
  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name} (voir .env.example)`);
  }
  return value;
}

export const config = {
  model: optional("CLAUDE_MODEL") ?? "claude-opus-5-5",
  meta: {
    graphVersion: optional("META_GRAPH_VERSION") ?? "v23.0",
    pageToken: () => required("META_PAGE_ACCESS_TOKEN"),
    pageId: () => required("FACEBOOK_PAGE_ID"),
    instagramId: () => required("INSTAGRAM_BUSINESS_ID"),
  },
  linkedin: {
    version: optional("LINKEDIN_VERSION") ?? "202606",
    token: () => required("LINKEDIN_ACCESS_TOKEN"),
    author: () => required("LINKEDIN_AUTHOR_URN"),
  },
};
