# The Kae Studio

Portfolio et site vitrine de **The Kae Studio**, le studio de Koçak Ali Erdem : design UI/UX, développement web & mobile, montage vidéo et graphisme.

Site statique construit avec [Astro](https://astro.build), sans framework JavaScript côté client : chaque page est générée en HTML, les images sont optimisées au build (AVIF/WebP, tailles responsives) et seuls quelques petits scripts sont chargés (filtres, horloge, animations au scroll).

## Démarrer

```bash
npm install
npm run dev
```

Le site tourne sur [http://localhost:4321](http://localhost:4321).

| Commande          | Action                                              |
| :---------------- | :-------------------------------------------------- |
| `npm run dev`     | Serveur de développement                            |
| `npm run build`   | Vérification des types puis build dans `./dist/`    |
| `npm run preview` | Prévisualise le build de production                 |

## Structure

```text
src/
├── assets/            Ciel du hero, illustrations des sections, image Open Graph
├── components/        Sections de la page d’accueil et composants partagés
├── content/projects/  Une réalisation = un dossier (index.md + images)
├── data/              Infos du studio, services, clients, parcours
├── layouts/           Layout de base et balises SEO
├── pages/             Accueil, pages réalisations, 404, robots.txt
├── scripts/           Filtres, révélation du texte au scroll, parallax
└── styles/            Styles globaux et variables
```

## Ajouter une réalisation

1. Créer un dossier dans `src/content/projects/`, par exemple `mon-projet/`.
2. Y placer une image `cover.jpg` (format 4:3, idéalement 2000 × 1500) et les images de la galerie.
3. Créer `index.md` :

```md
---
title: Mon projet
client: Nom du client
summary: Une phrase qui résume le projet (170 caractères max).
categories: [ui-ux, developpement]
deliverables: [Site web, UI/UX]
year: '2026'
order: 13
cover: ./cover.jpg
coverAlt: Description de l’image de couverture
links:
  - label: monprojet.be
    href: https://monprojet.be
gallery:
  - src: ./capture.jpg
    alt: Description de la capture
    frame: browser
    url: monprojet.be
---

## Le contexte

…
```

Catégories disponibles pour les filtres : `ui-ux`, `developpement`, `montage-video`, `graphisme`.

Pour la galerie, `frame` accepte `browser`, `phone` ou `none`, et `span` accepte `full`, `half` ou `third`.

Pour ajouter un aperçu vidéo qui se lance au survol de la carte, déposer un MP4 court et léger dans `public/previews/` puis ajouter `preview: /previews/mon-projet.mp4` dans l’en-tête du fichier.

## SEO

- Balises `title`, `description`, Open Graph et Twitter générées pour chaque page
- URL canoniques, `sitemap-index.xml` et `robots.txt` générés automatiquement
- Données structurées JSON-LD : `WebSite`, `ProfessionalService`, `Person`, `CreativeWork` et `BreadcrumbList`
- Images Open Graph 1200 × 630 générées à partir des couvertures

## Nom de domaine

Le domaine est défini à un seul endroit, dans `astro.config.mjs` :

```js
site: 'https://kae.studio',
```

## Déploiement

Le projet est prêt pour [Vercel](https://vercel.com) : importer le dépôt GitHub, Vercel détecte Astro automatiquement. Le fichier `vercel.json` active les URL propres et le cache longue durée des assets.

## Polices

- [Fraunces](https://fonts.google.com/specimen/Fraunces) pour les titres
- [Geist](https://vercel.com/font) pour le texte
- [VT323](https://fonts.google.com/specimen/VT323) pour les numéros de section

Toutes sont sous licence SIL Open Font License et auto-hébergées via Fontsource.
