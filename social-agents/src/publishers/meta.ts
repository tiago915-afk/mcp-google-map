import { config } from "../config.js";
import { requestJson } from "./http.js";

const graph = (path: string) => `https://graph.facebook.com/${config.meta.graphVersion}/${path}`;

async function graphPost<T>(path: string, params: Record<string, string>, label: string): Promise<T> {
  return requestJson<T>(
    graph(path),
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ...params, access_token: config.meta.pageToken() }),
    },
    label,
  );
}

async function graphGet<T>(path: string, fields: string, label: string): Promise<T> {
  const qs = new URLSearchParams({ fields, access_token: config.meta.pageToken() });
  return requestJson<T>(`${graph(path)}?${qs}`, { method: "GET" }, label);
}

/** Publie sur une Page Facebook : photo avec légende, ou post texte (+ lien). */
export async function publishFacebook(text: string, imageUrl?: string, link?: string) {
  const pageId = config.meta.pageId();
  if (imageUrl) {
    const res = await graphPost<{ id: string; post_id?: string }>(
      `${pageId}/photos`,
      { url: imageUrl, caption: text },
      "Facebook",
    );
    const id = res.post_id ?? res.id;
    return { id, url: `https://www.facebook.com/${id}` };
  }
  const params: Record<string, string> = { message: text };
  if (link) params.link = link;
  const res = await graphPost<{ id: string }>(`${pageId}/feed`, params, "Facebook");
  return { id: res.id, url: `https://www.facebook.com/${res.id}` };
}

/**
 * Publie sur un compte Instagram professionnel en deux temps :
 * création d'un conteneur média, puis publication une fois le conteneur prêt.
 */
export async function publishInstagram(caption: string, imageUrl: string) {
  const igId = config.meta.instagramId();
  const container = await graphPost<{ id: string }>(
    `${igId}/media`,
    { image_url: imageUrl, caption },
    "Instagram (conteneur)",
  );

  for (let attempt = 0; attempt < 20; attempt++) {
    const { status_code } = await graphGet<{ status_code?: string }>(container.id, "status_code", "Instagram (statut)");
    if (status_code === "FINISHED" || status_code === undefined) break;
    if (status_code === "ERROR" || status_code === "EXPIRED") {
      throw new Error(`Instagram : le conteneur média est en état ${status_code}`);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }

  const media = await graphPost<{ id: string }>(
    `${igId}/media_publish`,
    { creation_id: container.id },
    "Instagram (publication)",
  );
  const { permalink } = await graphGet<{ permalink?: string }>(media.id, "permalink", "Instagram (lien)").catch(
    () => ({ permalink: undefined }),
  );
  return { id: media.id, url: permalink };
}
