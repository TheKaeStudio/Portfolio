import type { CategorySlug } from './services';
import type { ToolId } from './tools';

export type OriginId = 'hepl' | 'nsi' | 'mkit' | 'hackathon' | 'terrain' | 'autodidacte';

export const origins: Record<OriginId, { label: string; detail: string }> = {
  hepl: { label: 'Formation', detail: 'Bachelier en informatique, HEPL Seraing' },
  nsi: { label: 'Stage', detail: 'Développeur full-stack Angular chez NSI, Awans' },
  mkit: { label: 'MkIT', detail: 'Développeur full-stack et designer UI/UX depuis 2023' },
  hackathon: { label: 'Hackathons', detail: 'Citizens of Wallonia, 2023 et 2025' },
  terrain: { label: 'Projets clients', detail: 'Appris et affiné sur des projets réels' },
  autodidacte: { label: 'Autodidacte', detail: 'Projets personnels, documentation et curiosité' },
};

export const originIds = Object.keys(origins) as OriginId[];

export interface Skill {
  id: string;
  name: string;
  tool?: ToolId;
  origins: OriginId[];
  note: string;
  projects?: string[];
  links?: { label: string; href: string }[];
}

export interface SkillGroup {
  id: string;
  name: string;
  skills: Skill[];
}

export interface SkillBranch {
  id: CategorySlug;
  name: string;
  summary: string;
  groups: SkillGroup[];
}

const token = { label: 'Token, hackathon 2023', href: 'https://github.com/FullCycleConceptaria/token' };
const dont = { label: 'Don’t, hackathon 2025', href: 'https://github.com/NiteChill/dont-frontend-js' };

export const skillTree: SkillBranch[] = [
  {
    id: 'developpement',
    name: 'Développement',
    summary: 'Du site vitrine à l’application mobile, en passant par les API et le logiciel de bureau.',
    groups: [
      {
        id: 'front',
        name: 'Front-end web',
        skills: [
          {
            id: 'react',
            name: 'React',
            tool: 'react',
            origins: ['hackathon', 'autodidacte'],
            note: 'Ma base côté front. Token, prix du meilleur projet étudiant en 2023, et Don’t, nommé en 2025, sont tous deux construits avec React.',
            links: [token, dont],
          },
          {
            id: 'nextjs',
            name: 'Next.js',
            tool: 'nextjs',
            origins: ['autodidacte'],
            note: 'Le prolongement naturel de React quand un projet demande du rendu serveur, des routes API et un bon référencement.',
          },
          {
            id: 'angular',
            name: 'Angular',
            tool: 'angular',
            origins: ['nsi'],
            note: 'Appris en entreprise pendant mon stage chez NSI à Awans, sur des applications web développées en équipe.',
          },
          {
            id: 'astro',
            name: 'Astro',
            tool: 'astro',
            origins: ['autodidacte'],
            note: 'Le framework de ce portfolio\u00a0: des pages statiques, légères et pensées pour le référencement.',
          },
        ],
      },
      {
        id: 'cms',
        name: 'CMS',
        skills: [
          {
            id: 'wordpress',
            name: 'WordPress',
            tool: 'wordpress',
            origins: ['terrain'],
            note: 'Pour les sites que mes clients veulent pouvoir mettre à jour eux-mêmes, sans dépendre de moi.',
          },
          {
            id: 'elementor',
            name: 'Elementor',
            tool: 'elementor',
            origins: ['terrain'],
            note: 'Le constructeur de pages qui me permet de livrer des mises en page sur mesure, fidèles aux maquettes Figma.',
          },
        ],
      },
      {
        id: 'back',
        name: 'Back-end',
        skills: [
          {
            id: 'express',
            name: 'Express',
            tool: 'express',
            origins: ['autodidacte'],
            note: 'Pour monter rapidement des API REST en Node.js, avec un immense écosystème de middlewares.',
          },
          {
            id: 'fastify',
            name: 'Fastify',
            tool: 'fastify',
            origins: ['autodidacte'],
            note: 'Quand la performance compte\u00a0: des API Node.js plus rapides, avec une validation par schémas.',
          },
          {
            id: 'spring',
            name: 'Java Spring',
            tool: 'spring',
            origins: ['hepl'],
            note: 'Vu à la HEPL dans le cours de systèmes distribués\u00a0: services web et API en Java.',
          },
          {
            id: 'php',
            name: 'PHP',
            tool: 'php',
            origins: ['hepl', 'terrain'],
            note: 'La programmation web côté serveur à la HEPL, puis au quotidien sur les sites WordPress de mes clients.',
          },
        ],
      },
      {
        id: 'mobile',
        name: 'Mobile',
        skills: [
          {
            id: 'expo',
            name: 'Expo React Native',
            tool: 'expo',
            origins: ['autodidacte', 'terrain'],
            note: 'Mes compétences React transposées au mobile\u00a0: une seule base de code pour iOS et Android.',
          },
          {
            id: 'flutter',
            name: 'Flutter',
            tool: 'flutter',
            origins: ['autodidacte'],
            note: 'Le framework de Google en Dart, pour des interfaces fluides et très personnalisées.',
          },
          {
            id: 'kotlin',
            name: 'Kotlin',
            tool: 'kotlin',
            origins: ['hepl'],
            note: 'Le développement Android natif, vu dans les cours de programmation mobile de la HEPL.',
          },
        ],
      },
      {
        id: 'desktop',
        name: 'Desktop',
        skills: [
          {
            id: 'swing',
            name: 'Java Swing',
            tool: 'swing',
            origins: ['hepl'],
            note: 'Mes premières interfaces graphiques, dans les cours de développement orienté objet en Java.',
          },
          {
            id: 'wpf',
            name: 'C# .NET WPF',
            tool: 'wpf',
            origins: ['hepl'],
            note: 'Des applications de bureau Windows en C#, vues à la HEPL.',
          },
          {
            id: 'electron',
            name: 'Electron',
            tool: 'electron',
            origins: ['autodidacte'],
            note: 'Des applications de bureau multiplateformes construites avec les technologies du web.',
          },
        ],
      },
      {
        id: 'data',
        name: 'Données',
        skills: [
          {
            id: 'postgresql',
            name: 'PostgreSQL',
            tool: 'postgresql',
            origins: ['hepl', 'terrain'],
            note: 'Les bases de données relationnelles et le SQL, vus dès la première année à la HEPL, puis en production derrière l’application Coffee Beanz.',
          },
          {
            id: 'prisma',
            name: 'Prisma',
            tool: 'prisma',
            origins: ['autodidacte', 'terrain'],
            note: 'Un ORM typé pour Node.js\u00a0: le schéma de la base devient du code lisible et sûr.',
          },
          {
            id: 'firebase',
            name: 'Firebase',
            tool: 'firebase',
            origins: ['autodidacte'],
            note: 'Authentification, base de données en temps réel et hébergement pour lancer une application rapidement.',
          },
        ],
      },
      {
        id: 'cloud',
        name: 'Cloud & services',
        skills: [
          {
            id: 'clerk',
            name: 'Clerk',
            tool: 'clerk',
            origins: ['terrain'],
            note: 'L’authentification clé en main\u00a0: inscription, connexion et sessions sécurisées sans réinventer la roue.',
          },
          {
            id: 'stripe',
            name: 'Stripe',
            tool: 'stripe',
            origins: ['terrain'],
            note: 'Le paiement en ligne des commandes, sécurisé de bout en bout.',
          },
          {
            id: 'cloudflare',
            name: 'Cloudflare R2',
            tool: 'cloudflare',
            origins: ['terrain'],
            note: 'Le stockage des images et des fichiers, servis rapidement et sans frais de sortie.',
          },
          {
            id: 'railway',
            name: 'Railway',
            tool: 'railway',
            origins: ['terrain'],
            note: 'L’hébergement de l’API et de la base de données de l’application Coffee Beanz.',
          },
        ],
      },
      {
        id: 'devops',
        name: 'DevOps & outils',
        skills: [
          {
            id: 'git',
            name: 'Git',
            tool: 'git',
            origins: ['hepl', 'mkit'],
            note: 'Indispensable partout\u00a0: en cours, en entreprise et sur chacun de mes projets.',
          },
          {
            id: 'docker',
            name: 'Docker',
            tool: 'docker',
            origins: ['autodidacte'],
            note: 'Des environnements identiques du développement à la production, grâce aux conteneurs.',
          },
          {
            id: 'kubernetes',
            name: 'Kubernetes',
            tool: 'kubernetes',
            origins: ['autodidacte'],
            note: 'L’orchestration de conteneurs, pour déployer des services et les faire évoluer.',
          },
        ],
      },
    ],
  },
  {
    id: 'ui-ux',
    name: 'UI/UX',
    summary: 'Des interfaces claires, testées et prêtes à être développées.',
    groups: [
      {
        id: 'ui-tools',
        name: 'Outils',
        skills: [
          {
            id: 'figma',
            name: 'Figma',
            tool: 'figma',
            origins: ['hackathon', 'mkit', 'terrain'],
            note: 'Toutes mes maquettes, mes prototypes et mes design systems naissent dans Figma.',
            links: [dont],
          },
        ],
      },
      {
        id: 'ui-craft',
        name: 'Savoir-faire',
        skills: [
          {
            id: 'parcours',
            name: 'Parcours utilisateur',
            origins: ['hackathon', 'terrain'],
            note: 'Comprendre qui utilise le produit et dessiner le chemin le plus court vers son objectif.',
            projects: ['coffee-beanz-app', 'varynia', 'bureau-sen'],
          },
          {
            id: 'maquettes',
            name: 'Wireframes & maquettes',
            origins: ['mkit', 'terrain'],
            note: 'Valider la structure en noir et blanc, puis passer à la haute fidélité, du mobile au desktop.',
            projects: ['obgf', 'varynia', 'mbremote'],
          },
          {
            id: 'prototypes',
            name: 'Prototypes interactifs',
            origins: ['hackathon', 'terrain'],
            note: 'Un prototype cliquable pour tester l’expérience avant d’écrire la moindre ligne de code. C’est ce travail qui m’a valu une nomination aux prix UI et UX en 2025.',
            projects: ['coffee-beanz-app'],
            links: [dont],
          },
          {
            id: 'design-system',
            name: 'Design system',
            origins: ['mkit', 'terrain'],
            note: 'Couleurs, typographies et composants réunis pour que chaque écran parle la même langue.',
            projects: ['mbremote', 'coffee-beanz-app'],
          },
        ],
      },
    ],
  },
  {
    id: 'montage-video',
    name: 'Montage vidéo',
    summary: 'Des formats courts qui accrochent et des vidéos longues qui retiennent.',
    groups: [
      {
        id: 'video-tools',
        name: 'Outils',
        skills: [
          {
            id: 'premiere',
            name: 'Premiere Pro',
            tool: 'premiere',
            origins: ['autodidacte', 'terrain'],
            note: 'Le cœur de mon montage\u00a0: rythme, coupes, étalonnage et mixage audio.',
          },
          {
            id: 'aftereffects',
            name: 'After Effects',
            tool: 'aftereffects',
            origins: ['autodidacte', 'terrain'],
            note: 'Titres animés, transitions et petites animations qui donnent du relief aux vidéos.',
          },
        ],
      },
      {
        id: 'video-formats',
        name: 'Formats',
        skills: [
          {
            id: 'reels',
            name: 'Reels & shorts',
            origins: ['mkit', 'terrain'],
            note: 'Accrocher en une seconde et raconter une histoire en moins de trente.',
            projects: ['debouch24', 'mkit', 'sami-madeo'],
          },
          {
            id: 'long-format',
            name: 'YouTube long format',
            origins: ['terrain'],
            note: 'Garder l’attention sur la durée, avec un rythme pensé pour la rétention.',
            projects: ['sami-madeo'],
          },
          {
            id: 'sous-titres',
            name: 'Sous-titres dynamiques',
            origins: ['terrain'],
            note: 'Des sous-titres animés, lisibles sans le son, comme la plupart des vidéos regardées sur mobile.',
            projects: ['debouch24', 'mkit'],
          },
        ],
      },
    ],
  },
  {
    id: 'graphisme',
    name: 'Graphisme',
    summary: 'Des identités et des supports qui donnent une image nette et cohérente.',
    groups: [
      {
        id: 'graphic-tools',
        name: 'Outils',
        skills: [
          {
            id: 'photoshop',
            name: 'Photoshop',
            tool: 'photoshop',
            origins: ['autodidacte', 'terrain'],
            note: 'Retouche, détourage et compositions pour les affiches, les visuels produits et les réseaux sociaux.',
          },
          {
            id: 'illustrator',
            name: 'Illustrator',
            tool: 'illustrator',
            origins: ['autodidacte', 'terrain'],
            note: 'Logos, pictogrammes et identités vectorielles, nets à toutes les tailles.',
          },
        ],
      },
      {
        id: 'graphic-craft',
        name: 'Savoir-faire',
        skills: [
          {
            id: 'identite',
            name: 'Identité visuelle',
            origins: ['terrain'],
            note: 'Du logo à la charte graphique, une image cohérente sur tous les supports.',
            projects: ['mbremote', 'ua-renov', 'outside-park'],
          },
          {
            id: 'packaging',
            name: 'Packaging',
            origins: ['terrain'],
            note: 'Des étiquettes qui se remarquent en rayon et respectent les contraintes d’impression.',
            projects: ['umashi'],
          },
          {
            id: 'print',
            name: 'Print & affiches',
            origins: ['terrain'],
            note: 'Affiches, flyers et cartes de visite préparés pour l’imprimeur.',
            projects: ['coffee-beanz-affiches', 'outside-park', 'ua-renov'],
          },
          {
            id: 'social',
            name: 'Visuels réseaux sociaux',
            origins: ['mkit', 'terrain'],
            note: 'Une ligne graphique reconnaissable, post après post.',
            projects: ['mkit'],
          },
        ],
      },
    ],
  },
];

export const allSkills = skillTree.flatMap((branch) =>
  branch.groups.flatMap((group) => group.skills.map((skill) => ({ ...skill, branch, group }))),
);

export const toolSkills = allSkills.filter((skill) => skill.tool);
