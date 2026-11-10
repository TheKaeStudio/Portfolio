export const categories = [
  { slug: 'ui-ux', label: 'UI/UX' },
  { slug: 'developpement', label: 'Développement' },
  { slug: 'montage-video', label: 'Montage vidéo' },
  { slug: 'graphisme', label: 'Graphisme' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export const categoryLabel = (slug: CategorySlug) => categories.find((c) => c.slug === slug)?.label ?? slug;

export const services: {
  title: string;
  category: CategorySlug;
  description: string;
}[] = [
  {
    title: 'Design UI/UX',
    category: 'ui-ux',
    description:
      'Parcours utilisateurs, wireframes, maquettes haute fidélité et design systems. Des interfaces claires, accessibles et pensées pour convertir.',
  },
  {
    title: 'Développement',
    category: 'developpement',
    description:
      'Sites vitrines, applications web et mobiles, logiciels sur mesure. Du front au back, des produits rapides, référencés et faciles à faire évoluer.',
  },
  {
    title: 'Montage vidéo',
    category: 'montage-video',
    description:
      'Reels, TikTok, Shorts et vidéos YouTube long format : rythme, sous-titres dynamiques et habillage pour retenir l’attention jusqu’à la dernière seconde.',
  },
  {
    title: 'Graphisme',
    category: 'graphisme',
    description:
      'Logos, chartes graphiques, packagings, affiches et visuels pour les réseaux sociaux, avec une identité cohérente sur chaque support.',
  },
];

export const servicePills: { label: string; category: CategorySlug }[] = [
  { label: 'Design UI/UX', category: 'ui-ux' },
  { label: 'Sites web', category: 'developpement' },
  { label: 'Applications mobiles', category: 'developpement' },
  { label: 'Logiciels sur mesure', category: 'developpement' },
  { label: 'Montage vidéo', category: 'montage-video' },
  { label: 'Graphisme & identité', category: 'graphisme' },
];
