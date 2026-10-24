import { config } from "../config.js";
import { toLinkedInLittleText } from "../format.js";
import { requestJson } from "./http.js";

const API = "https://api.linkedin.com/rest";

function headers(extra: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${config.linkedin.token()}`,
    "LinkedIn-Version": config.linkedin.version,
    "X-Restli-Protocol-Version": "2.0.0",
    ...extra,
  };
}

/** Téléverse une image (depuis une URL publique) et renvoie son URN LinkedIn. */
async function uploadImage(imageUrl: string): Promise<string> {
  const init = await requestJson<{ value: { uploadUrl: string; image: string } }>(
    `${API}/images?action=initializeUpload`,
    {
      method: "POST",
      headers: headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ initializeUploadRequest: { owner: config.linkedin.author() } }),
    },
    "LinkedIn (init. image)",
  );

  const source = await fetch(imageUrl);
  if (!source.ok) throw new Error(`Impossible de télécharger l'image ${imageUrl} (HTTP ${source.status})`);
  const bytes = await source.arrayBuffer();

  const put = await fetch(init.value.uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${config.linkedin.token()}` },
    body: bytes,
  });
  if (!put.ok) throw new Error(`LinkedIn (envoi image) : HTTP ${put.status} ${await put.text()}`);
  return init.value.image;
}

/** Publie un post sur un profil ou une page entreprise LinkedIn. */
export async function publishLinkedIn(text: string, opts: { imageUrl?: string; altText?: string; link?: string }) {
  const body: Record<string, unknown> = {
    author: config.linkedin.author(),
    commentary: toLinkedInLittleText(text),
    visibility: "PUBLIC",
    distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  if (opts.imageUrl) {
    const image = await uploadImage(opts.imageUrl);
    body.content = { media: { id: image, ...(opts.altText ? { altText: opts.altText } : {}) } };
  } else if (opts.link) {
    body.content = { article: { source: opts.link, title: opts.link } };
  }

  const res = await fetch(`${API}/posts`, {
    method: "POST",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`LinkedIn : HTTP ${res.status} ${await res.text()}`);
  // L'URN du post est renvoyé dans l'en-tête x-restli-id.
  const id = res.headers.get("x-restli-id") ?? "";
  return { id, url: id ? `https://www.linkedin.com/feed/update/${id}` : undefined };
}
