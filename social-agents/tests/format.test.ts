import assert from "node:assert/strict";
import { test } from "node:test";
import { composeText, normalizeHashtag, toLinkedInLittleText, validateDraft } from "../src/format.js";

test("normalizeHashtag retire le # et la ponctuation", () => {
  assert.equal(normalizeHashtag("#Transformation-Digitale!"), "TransformationDigitale");
  assert.equal(normalizeHashtag("éco_conception"), "éco_conception");
});

test("composeText ajoute les hashtags et respecte le plafond par plateforme", () => {
  const text = composeText({ platform: "linkedin", text: "Bonjour ", hashtags: ["a", "b", "c", "d", "e", "f"] });
  assert.equal(text, "Bonjour\n\n#a #b #c #d #e");
});

test("validateDraft signale un post Instagram trop long", () => {
  const problems = validateDraft({ platform: "instagram", text: "x".repeat(2300), hashtags: [] });
  assert.equal(problems.length, 1);
});

test("toLinkedInLittleText échappe les caractères réservés et garde les hashtags", () => {
  assert.equal(
    toLinkedInLittleText("Atelier (gratuit) @Lyon\n\n#RH #Management"),
    "Atelier \\(gratuit\\) \\@Lyon\n\n{hashtag|\\#|RH} {hashtag|\\#|Management}",
  );
});
