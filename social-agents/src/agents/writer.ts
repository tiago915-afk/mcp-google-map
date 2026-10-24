import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { config } from "../config.js";
import { LIMITS } from "../format.js";
import type { Brief, Draft, Platform } from "../types.js";

const client = new Anthropic();

const DraftSchema = z.object({
  text: z.string().describe("Corps du post, sans les hashtags"),
  hashtags: z.array(z.string()).describe("Hashtags sans le #"),
  altText: z.string().describe("Description de l'image pour l'accessibilité, vide si pas d'image"),
});

const PLATFORM_GUIDES: Record<Platform, string> = {
  linkedin:
    "LinkedIn, audience professionnelle. Une accroche forte sur la première ligne (visible avant « voir plus »), " +
    "des paragraphes courts, une expertise ou un retour d'expérience concret, une question ou un appel à l'action final. " +
    "1 à 2 emojis maximum. 3 à 5 hashtags pertinents.",
  facebook:
    "Page Facebook professionnelle. Ton accessible et chaleureux, texte plutôt court (40 à 120 mots), " +
    "un appel à l'action clair. 0 à 3 hashtags.",
  instagram:
    "Instagram professionnel. La légende accompagne une image : première phrase accrocheuse, texte aéré, " +
    "emojis avec parcimonie, appel à l'action (« lien en bio » plutôt qu'une URL, les liens ne sont pas cliquables). " +
    "8 à 15 hashtags ciblés mêlant niche et volume.",
};

/** Agent de rédaction : produit un brouillon adapté à une plateforme. */
export async function writeDraft(
  platform: Platform,
  brief: Brief,
  brand: string,
  revision?: { previous: Draft; feedback: string },
): Promise<Draft> {
  const response = await client.beta.messages.parse({
    model: config.model,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(DraftSchema) },
    system:
      "Tu es un community manager expert qui rédige des posts pour un compte professionnel. " +
      "Respecte strictement le profil de marque fourni. N'invente ni chiffres, ni clients, ni témoignages : " +
      "si une information manque, reste général plutôt que de fabriquer un fait.\n\n" +
      `<profil_de_marque>\n${brand}\n</profil_de_marque>`,
    messages: [
      {
        role: "user",
        content: [
          // L'agent voit l'image pour écrire une légende qui lui correspond.
          ...(brief.imageUrl ? [{ type: "image" as const, source: { type: "url" as const, url: brief.imageUrl } }] : []),
          {
            type: "text" as const,
            text:
          `Plateforme : ${PLATFORM_GUIDES[platform]}\n` +
          `Limite : ${LIMITS[platform].chars} caractères hashtags compris.\n\n` +
          `Sujet du post :\n${brief.topic}\n` +
          (brief.link && platform !== "instagram" ? `\nLien à inclure : ${brief.link}\n` : "") +
          (brief.imageUrl ? "\nL'image ci-jointe accompagnera le post.\n" : "") +
          (revision
            ? `\nVersion précédente :\n${revision.previous.text}\n\nCorrections demandées : ${revision.feedback}\n`
            : ""),
          },
        ],
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error(`[${platform}] Rédaction refusée : ${response.stop_details?.explanation ?? "sans détail"}`);
  }
  const parsed = response.parsed_output;
  if (!parsed) throw new Error(`[${platform}] Réponse de l'agent illisible (stop_reason=${response.stop_reason})`);

  return {
    platform,
    text: parsed.text,
    hashtags: parsed.hashtags,
    altText: parsed.altText || undefined,
  };
}
