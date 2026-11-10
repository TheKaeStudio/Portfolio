export const categories = [
  { slug: 'ui-ux', label: 'UI/UX' },
  { slug: 'developpement', label: 'Développement' },
  { slug: 'montage-video', label: 'Montage vidéo' },
  { slug: 'graphisme', label: 'Graphisme' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export const categoryLabel = (slug: CategorySlug) => categories.find((c) => c.slug === slug)?.label ?? slug;

export interface Service {
  title: string;
  category: CategorySlug;
  description: string;
  steps: { title: string; text: string }[];
  formats: string[];
  deliverables: string[];
}

export const services: Service[] = [
  {
    title: 'Design UI/UX',
    category: 'ui-ux',
    description:
      'Parcours utilisateurs, wireframes, maquettes haute fidélité et design systems. Des interfaces claires, accessibles et pensées pour convertir.',
    steps: [
      { title: 'Découverte', text: 'On échange sur vos objectifs, vos utilisateurs et ce qui se fait chez vos concurrents.' },
      { title: 'Architecture', text: 'Parcours utilisateurs, arborescence et wireframes pour valider la structure avant le visuel.' },
      { title: 'Maquettes', text: 'Design haute fidélité sur Figma, pensé pour le mobile comme pour le desktop.' },
      { title: 'Prototype', text: 'Un prototype cliquable pour tester l’expérience et ajuster avant le développement.' },
      { title: 'Passation', text: 'Design system, composants et spécifications prêtes pour les développeurs.' },
    ],
    formats: [
      'Audit UX d’un site ou d’une application existante',
      'Maquettes d’un site vitrine ou d’une landing page',
      'Design complet d’une application web ou mobile',
      'Création ou refonte d’un design system',
    ],
    deliverables: ['Fichiers Figma', 'Prototype interactif', 'Guide de styles'],
  },
  {
    title: 'Développement',
    category: 'developpement',
    description:
      'Sites vitrines, applications web et mobiles, logiciels sur mesure. Du front au back, des produits rapides, référencés et faciles à faire évoluer.',
    steps: [
      { title: 'Cadrage', text: 'Fonctionnalités, priorités et choix techniques adaptés à votre budget et à vos délais.' },
      { title: 'Développement', text: 'Des étapes courtes avec un lien de prévisualisation pour suivre l’avancement en direct.' },
      { title: 'Contenu & SEO', text: 'Intégration des contenus, optimisation du référencement et des performances.' },
      { title: 'Mise en ligne', text: 'Hébergement, nom de domaine, statistiques de visite et tests sur tous les écrans.' },
      { title: 'Suivi', text: 'Maintenance, évolutions et prise en main pour que vous restiez autonome.' },
    ],
    formats: [
      'Site vitrine ou landing page',
      'Application web sur mesure : outil métier, espace client, simulateur…',
      'Application mobile iOS et Android',
      'Logiciel interne et automatisation de tâches',
    ],
    deliverables: ['Code source', 'Mise en ligne', 'Documentation'],
  },
  {
    title: 'Montage vidéo',
    category: 'montage-video',
    description:
      'Reels, TikTok, Shorts et vidéos YouTube long format : rythme, sous-titres dynamiques et habillage pour retenir l’attention jusqu’à la dernière seconde.',
    steps: [
      { title: 'Brief', text: 'Objectif de la vidéo, plateforme visée, ton et références qui vous plaisent.' },
      { title: 'Dérushage', text: 'Je sélectionne les meilleurs moments de vos rushes et construis l’histoire.' },
      { title: 'Montage', text: 'Accroche dès la première seconde, rythme, transitions et sous-titres dynamiques.' },
      { title: 'Son & couleurs', text: 'Musique, sound design et étalonnage pour un rendu propre et cohérent.' },
      { title: 'Livraison', text: 'Exports optimisés pour chaque réseau, avec un temps prévu pour vos ajustements.' },
    ],
    formats: [
      'Reels, TikTok et Shorts à l’unité ou en pack mensuel',
      'Vidéos YouTube long format',
      'Vidéos de présentation pour votre entreprise',
      'Déclinaison d’une vidéo longue en formats courts',
    ],
    deliverables: ['Vidéos prêtes à publier', 'Formats 9:16 et 16:9', 'Miniatures sur demande'],
  },
  {
    title: 'Graphisme',
    category: 'graphisme',
    description:
      'Logos, chartes graphiques, packagings, affiches et visuels pour les réseaux sociaux, avec une identité cohérente sur chaque support.',
    steps: [
      { title: 'Immersion', text: 'Votre activité, votre cible et votre positionnement face à la concurrence.' },
      { title: 'Pistes créatives', text: 'Un moodboard et des premières propositions pour trouver la bonne direction.' },
      { title: 'Affinage', text: 'On fait évoluer la piste retenue jusqu’à la version finale.' },
      { title: 'Déclinaisons', text: 'Adaptation sur tous vos supports, du print aux réseaux sociaux.' },
      { title: 'Livraison', text: 'Fichiers sources, exports prêts à l’emploi et règles d’utilisation.' },
    ],
    formats: [
      'Logo et identité visuelle',
      'Charte graphique complète',
      'Packaging et étiquettes',
      'Affiches, flyers et cartes de visite',
      'Visuels pour les réseaux sociaux',
    ],
    deliverables: ['Fichiers sources', 'Exports print et web', 'Charte d’utilisation'],
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
