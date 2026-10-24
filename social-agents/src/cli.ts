import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { publishDraft } from "./agents/publisher.js";
import { writeDraft } from "./agents/writer.js";
import { composeText, validateDraft } from "./format.js";
import { PLATFORMS, type Brief, type Draft, type Platform, type PublishResult } from "./types.js";

const USAGE = `Usage : npm run post -- "<sujet du post>" [options]

Options :
  --image <url>        Image publique (https), obligatoire pour Instagram
  --link <url>         Lien à mettre en avant (Facebook, LinkedIn)
  --platforms <liste>  linkedin,facebook,instagram (par défaut : toutes)
  --brand <fichier>    Profil de marque (par défaut : brand.md)
  --dry-run            Rédige les posts sans rien publier
  --yes                Publie sans demander de validation (déconseillé)`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    image: { type: "string" },
    link: { type: "string" },
    platforms: { type: "string" },
    brand: { type: "string", default: "brand.md" },
    "dry-run": { type: "boolean", default: false },
    yes: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help || positionals.length === 0) {
  console.log(USAGE);
  process.exit(values.help ? 0 : 1);
}

const brief: Brief = { topic: positionals.join(" "), imageUrl: values.image, link: values.link };

let platforms: Platform[] = values.platforms
  ? (values.platforms.split(",").map((p) => p.trim().toLowerCase()) as Platform[])
  : [...PLATFORMS];
const unknown = platforms.filter((p) => !PLATFORMS.includes(p));
if (unknown.length) {
  console.error(`Plateforme inconnue : ${unknown.join(", ")}`);
  process.exit(1);
}
if (platforms.includes("instagram") && !brief.imageUrl) {
  console.warn("⚠  Instagram ignoré : il faut une image (--image <url>).");
  platforms = platforms.filter((p) => p !== "instagram");
}

const brand = await readFile(values.brand!, "utf8").catch(() => "");
if (!brand) console.warn(`⚠  Profil de marque introuvable (${values.brand}) — rédaction sans consignes de marque.`);

console.log(`\n✍  Les agents rédigent pour : ${platforms.join(", ")}…\n`);
const settled = await Promise.allSettled(platforms.map((p) => writeDraft(p, brief, brand)));
const drafts: Draft[] = [];
settled.forEach((r, i) => {
  if (r.status === "fulfilled") drafts.push(r.value);
  else console.error(`✗ ${platforms[i]} : ${(r.reason as Error).message}`);
});

const rl = createInterface({ input: process.stdin, output: process.stdout });
const approved: Draft[] = [];

for (let draft of drafts) {
  for (;;) {
    show(draft);
    if (values["dry-run"]) break;
    if (values.yes) {
      if (validateDraft(draft).length === 0) approved.push(draft);
      break;
    }
    const answer = (await rl.question("[p] publier  [r] retravailler  [i] ignorer > ")).trim().toLowerCase();
    if (answer === "p") {
      approved.push(draft);
      break;
    }
    if (answer === "i") break;
    if (answer === "r") {
      const feedback = await rl.question("Que faut-il changer ? > ");
      draft = await writeDraft(draft.platform, brief, brand, { previous: draft, feedback });
    }
  }
}
rl.close();

if (values["dry-run"] || approved.length === 0) {
  console.log("\nRien n'a été publié.");
  process.exit(0);
}

const results: PublishResult[] = [];
for (const draft of approved) {
  try {
    const result = await publishDraft(draft, brief);
    results.push(result);
    console.log(`✓ ${draft.platform} publié ${result.url ?? result.id}`);
  } catch (err) {
    console.error(`✗ ${draft.platform} : ${(err as Error).message}`);
  }
}

await appendHistory(brief, approved, results);

function show(draft: Draft) {
  const text = composeText(draft);
  const problems = validateDraft(draft);
  console.log(`──────── ${draft.platform.toUpperCase()} (${text.length} car.) ────────`);
  console.log(text);
  if (draft.altText) console.log(`\n[texte alternatif] ${draft.altText}`);
  if (problems.length) console.log(`\n⚠  ${problems.join(" ; ")}`);
  console.log();
}

async function appendHistory(brief: Brief, drafts: Draft[], results: PublishResult[]) {
  const file = "history.json";
  const history = JSON.parse(await readFile(file, "utf8").catch(() => "[]")) as unknown[];
  history.push({ date: new Date().toISOString(), brief, drafts, results });
  await writeFile(file, JSON.stringify(history, null, 2));
}
