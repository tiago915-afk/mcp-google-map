import { composeText } from "../format.js";
import { publishFacebook, publishInstagram } from "../publishers/meta.js";
import { publishLinkedIn } from "../publishers/linkedin.js";
import type { Brief, Draft, PublishResult } from "../types.js";

/** Agent de publication : envoie un brouillon validé vers sa plateforme. */
export async function publishDraft(draft: Draft, brief: Brief): Promise<PublishResult> {
  const text = composeText(draft);
  switch (draft.platform) {
    case "facebook":
      return { platform: "facebook", ...(await publishFacebook(text, brief.imageUrl, brief.link)) };
    case "instagram":
      if (!brief.imageUrl) throw new Error("Instagram exige une image (--image <url publique>)");
      return { platform: "instagram", ...(await publishInstagram(text, brief.imageUrl)) };
    case "linkedin":
      return {
        platform: "linkedin",
        ...(await publishLinkedIn(text, { imageUrl: brief.imageUrl, altText: draft.altText, link: brief.link })),
      };
  }
}
