# Social Agents

Des agents IA qui rédigent et publient vos posts professionnels sur **LinkedIn**, **Facebook** et **Instagram**.

```
 sujet + image ──► Agents de rédaction (Claude, un par réseau, en parallèle)
                         │
                         ▼
                 Vous relisez : publier / retravailler / ignorer
                         │
                         ▼
                 Agents de publication ──► LinkedIn API · Meta Graph API
```

- **Un agent par réseau** : chacun adapte le ton, la longueur, les hashtags et l'appel à l'action aux codes de sa plateforme.
- **Profil de marque** (`brand.md`) : votre activité, votre cible, votre ton. Les agents le relisent à chaque post.
- **Validation humaine** : rien n'est publié sans votre accord, et vous pouvez demander une nouvelle version (« plus court », « tutoie », etc.).
- **API officielles uniquement** : pas de scraping, pas de mot de passe stocké, aucun risque de blocage de compte.
- **Historique** : chaque publication est consignée dans `history.json`.

## Installation

```bash
cd social-agents
npm install
cp .env.example .env   # puis remplissez les clés
```

Modifiez ensuite `brand.md` pour décrire votre activité.

## Utilisation

```bash
# Rédiger seulement, sans rien publier (idéal pour commencer)
npm run post -- "Retour sur notre atelier RH du 15 octobre" --dry-run

# Les trois réseaux, avec image (obligatoire pour Instagram) et lien
npm run post -- "Lancement de notre offre d'accompagnement PME" \
  --image https://monsite.fr/visuel.jpg --link https://monsite.fr/offre

# Seulement LinkedIn
npm run post -- "3 leçons tirées de 10 ans de conseil" --platforms linkedin
```

Pour chaque brouillon, l'application affiche le texte final et demande :
`[p] publier  [r] retravailler  [i] ignorer`.

## Obtenir les accès

### Claude
Créez une clé sur <https://console.anthropic.com> → `ANTHROPIC_API_KEY`.

### Facebook + Instagram (Meta)
Pré-requis : une **Page Facebook** et un compte **Instagram professionnel** (Business ou Creator) **lié à cette Page**.

1. Créez une application de type « Entreprise » sur <https://developers.facebook.com>.
2. Ajoutez les produits *Facebook Login for Business* et *Instagram Graph API*.
3. Dans l'[explorateur de l'API Graph](https://developers.facebook.com/tools/explorer/), générez un jeton utilisateur avec :
   `pages_show_list`, `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`.
4. Échangez-le contre un jeton longue durée, puis appelez `GET /me/accounts` : récupérez l'`id` de la Page (`FACEBOOK_PAGE_ID`) et son `access_token` (`META_PAGE_ACCESS_TOKEN`, qui n'expire pas s'il provient d'un jeton longue durée).
5. `GET /{page-id}?fields=instagram_business_account` → `INSTAGRAM_BUSINESS_ID`.

> Tant que l'app est en mode « Développement », elle fonctionne pour vos propres comptes (vous êtes administrateur). La revue d'app Meta n'est nécessaire que pour gérer les comptes d'autres personnes.

### LinkedIn
1. Créez une app sur <https://www.linkedin.com/developers/apps> et associez-la à votre page entreprise.
2. Demandez les produits **Share on LinkedIn** (profil personnel, scope `w_member_social`) et/ou **Community Management API** (page entreprise, scope `w_organization_social`).
3. Générez un jeton OAuth 2.0 avec l'outil *OAuth Token Generator* → `LINKEDIN_ACCESS_TOKEN` (valable 60 jours).
4. `LINKEDIN_AUTHOR_URN` :
   - profil : `urn:li:person:<id>` (l'`id` est le champ `sub` renvoyé par `GET https://api.linkedin.com/v2/userinfo`) ;
   - page entreprise : `urn:li:organization:<id>` (le numéro visible dans l'URL d'admin de la page).
5. `LINKEDIN_VERSION` : version mensuelle de l'API (format `AAAAMM`). LinkedIn retire les versions après environ un an ; si vous obtenez une erreur `NONEXISTENT_VERSION`, passez à une version plus récente.

## Bon à savoir

- **Instagram** exige une image accessible publiquement en JPEG (pas de post texte seul). Les liens dans les légendes ne sont pas cliquables : l'agent écrit « lien en bio ».
- **Modèle** : `claude-opus-5-5` par défaut (variable `CLAUDE_MODEL` pour changer). Le repli automatique côté serveur (`fallbacks: "default"`) est activé : si une requête est refusée par un filtre de sécurité, elle est relancée sur un autre modèle.
- **Coût** : environ quelques centimes par série de trois posts.
- Les agents ont pour consigne de ne jamais inventer de chiffres, de clients ou de témoignages. Relisez tout de même avant de publier : c'est votre réputation professionnelle.

## Structure

```
src/
  cli.ts                 Orchestration : rédaction → validation → publication
  agents/writer.ts       Agent de rédaction (Claude, sortie structurée)
  agents/publisher.ts    Agent de publication (aiguillage par réseau)
  publishers/meta.ts     Facebook Page + Instagram (Graph API)
  publishers/linkedin.ts LinkedIn Posts API (+ envoi d'image)
  format.ts              Limites, hashtags, échappement LinkedIn
tests/format.test.ts     Tests unitaires (npm test)
```
