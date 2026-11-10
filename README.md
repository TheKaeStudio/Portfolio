# The Kae Studio

My portfolio and showcase website, highlighting UI/UX design, web & mobile development, video editing and graphic design.

Static site built with [Astro](https://astro.build).

## Getting started

```bash
npm install
npm run dev
```

The site runs on [http://localhost:4321](http://localhost:4321).

| Command           | Action                                              |
| :---------------- | :-------------------------------------------------- |
| `npm run dev`     | Start the development server                        |
| `npm run build`   | Type-check, then build to `./dist/`                 |
| `npm run preview` | Preview the production build                        |

## Structure

```text
src/
├── assets/            Hero sky, section media, stack icons, Open Graph image
├── components/        Home page sections and shared components
├── content/projects/  One project = one folder (index.md + images)
├── data/              Studio info, services, clients, background, tools and skill tree
├── layouts/           Base layout and SEO tags
├── pages/             Home, project pages, 404, robots.txt
├── scripts/           Filters, scroll text reveal, parallax
└── styles/            Global styles and variables
```

## Adding a project

1. Create a folder in `src/content/projects/`, for example `my-project/`.
2. Add a `cover.jpg` image (4:3 ratio, ideally 2000 × 1500) and the gallery images.
3. Create `index.md`:

```md
---
title: My project
client: Client name
summary: One sentence that sums up the project (170 characters max).
categories: [ui-ux, developpement]
deliverables: [Website, UI/UX]
year: '2026'
industry: [Industry, Niche]
stack: [figma, react]
order: 13
icon:
  src: ./icon.png
  background: '#ffffff'
cover: ./cover.jpg
coverAlt: Description of the cover image
links:
  - label: myproject.be
    href: https://myproject.be
gallery:
  - src: ./screenshot.jpg
    alt: Description of the screenshot
    frame: browser
    url: myproject.be
---

## Context

…
```

Available categories for the filters: `ui-ux`, `developpement`, `montage-video`, `graphisme`.

`stack` lists the tools shown with their icons on the project page. Available ids are in `src/data/tools.ts`. `icon` is optional: without it, the project page uses a crop of the cover. Set `padded: true` for a logo that needs breathing room inside its tile.

In the gallery, `frame` accepts `browser`, `phone` or `none`, and `span` accepts `full`, `half` or `third`.

To add a video preview that plays when hovering the project card, drop a short, lightweight MP4 into `public/previews/` and add `preview: /previews/my-project.mp4` to the file's frontmatter.

## Skills

The skills shown in the background section and in the skill tree live in `src/data/skills.ts`: four branches, their groups, and for each skill where it was learned (`origins`) and a short note. Projects using a tool are linked automatically from their `stack`; skills without a tool can list `projects` by slug.

## SEO

- `title`, `description`, Open Graph and Twitter tags generated for every page
- Canonical URLs, `sitemap-index.xml` and `robots.txt` generated automatically
- JSON-LD structured data: `WebSite`, `ProfessionalService`, `Person`, `CreativeWork` and `BreadcrumbList`
- 1200 × 630 Open Graph images generated from the project covers

## Domain name

The domain is set in a single place, in `astro.config.mjs`:

```js
site: 'https://kae.studio',
```

## Deployment

The project is ready for [Vercel](https://vercel.com): import the GitHub repository and Vercel detects Astro automatically. The `vercel.json` file enables clean URLs and long-term caching for assets.

## Fonts

- [Fraunces](https://fonts.google.com/specimen/Fraunces) for headings
- [Geist](https://vercel.com/font) for body text
- [VT323](https://fonts.google.com/specimen/VT323) for section numbers
- [Gilda Display](https://fonts.google.com/specimen/Gilda+Display) for the hero title

All are licensed under the SIL Open Font License and self-hosted through Fontsource.

## Icons

Technology icons come from [skill-icons](https://github.com/tandpfun/skill-icons) (MIT) and [Simple Icons](https://simpleicons.org) (CC0). Logos remain the property of their respective owners.
