export interface TimelineEntry {
  period: string;
  award?: 'winner' | 'nominee';
  title: string;
  place: string;
  description?: string;
  link?: { label: string; href: string };
}

export const timeline: { title: string; entries: TimelineEntry[] }[] = [
  {
    title: 'Expériences',
    entries: [
      {
        period: 'Depuis 2023',
        title: 'Développeur full-stack & designer UI/UX',
        place: 'MkIT, Verviers',
        description: 'Sites web, outils internes, interfaces et contenus pour les réseaux sociaux.',
      },
      {
        period: 'Stage',
        title: 'Développeur full-stack Angular',
        place: 'NSI, Awans',
        description: 'Développement d’applications web en équipe, du front Angular aux API.',
      },
    ],
  },
  {
    title: 'Distinctions',
    entries: [
      {
        period: 'Mars 2023',
        award: 'winner',
        title: 'Prix du meilleur projet étudiant',
        place: 'Hackathon Citizens of Wallonia',
        description:
          'Projet Token\u00a0: une plateforme qui valorise les associations de Verviers grâce à une monnaie d’entraide.',
        link: { label: 'Voir Token sur GitHub', href: 'https://github.com/FullCycleConceptaria/token' },
      },
      {
        period: '2025',
        award: 'nominee',
        title: 'Nommé pour le prix de l’UI et le prix de l’UX',
        place: 'Hackathon Citizens of Wallonia',
        description: 'Projet Don’t\u00a0: conception de l’interface et de l’expérience utilisateur.',
        link: { label: 'Voir Don’t sur GitHub', href: 'https://github.com/NiteChill/dont-frontend-js' },
      },
    ],
  },
  {
    title: 'Formation',
    entries: [
      {
        period: 'En cours',
        title: 'Bachelier en informatique, développement d’applications',
        place: 'HEPL, Seraing',
        description: 'Troisième année.',
      },
    ],
  },
];
