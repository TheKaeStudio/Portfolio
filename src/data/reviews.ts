import { getProjects, type Project } from './projects';

export interface Review {
  project: string;
  quote: string;
  author: string;
  role: string;
  placeholder?: boolean;
}

export interface ResolvedReview extends Omit<Review, 'project'> {
  project: Project;
}

export const reviews: Review[] = [
  {
    project: 'coffee-beanz-app',
    author: 'Prénom Nom',
    role: 'Fonction, Coffee Beanz',
    quote:
      'Exemple d’avis à remplacer. Ici, le client raconte en deux ou trois phrases ce que l’application a changé pour sa clientèle et pour son équipe : les commandes à emporter, le programme de points, les retours des habitués.',
    placeholder: true,
  },
  {
    project: 'varynia',
    author: 'Prénom Nom',
    role: 'Fonction, Varynia',
    quote:
      'Exemple d’avis à remplacer. Ce que le nouveau site et le simulateur ont apporté : plus de demandes de simulation, une image plus rassurante, une collaboration simple.',
    placeholder: true,
  },
  {
    project: 'mbremote',
    author: 'Prénom Nom',
    role: 'Fonction, MBRemote',
    quote:
      'Exemple d’avis à remplacer. Le ressenti sur la création de l’identité visuelle, du logo jusqu’au site, et sur la cohérence de l’ensemble.',
    placeholder: true,
  },
  {
    project: 'bureau-sen',
    author: 'Prénom Nom',
    role: 'Fonction, Bureau Sen',
    quote:
      'Exemple d’avis à remplacer. Les effets du référencement local sur les appels et les demandes, et l’accueil réservé au simulateur de crédit.',
    placeholder: true,
  },
  {
    project: 'sami-madeo',
    author: 'Prénom Nom',
    role: 'Créateur de contenu, Sami Madeo',
    quote:
      'Exemple d’avis à remplacer. Le rythme des montages, le respect des délais et l’effet sur les vues ou l’engagement de la chaîne.',
    placeholder: true,
  },
  {
    project: 'ua-renov',
    author: 'Prénom Nom',
    role: 'Fonction, UA Rénov',
    quote:
      'Exemple d’avis à remplacer. La façon dont le logo et les cartes de visite sont perçus par les clients et les partenaires.',
    placeholder: true,
  },
];

export const getReviews = async (): Promise<ResolvedReview[]> => {
  const projects = await getProjects();
  return reviews
    .filter((review) => import.meta.env.DEV || !review.placeholder)
    .map((review) => {
      const project = projects.find((entry) => entry.id === review.project);
      if (!project) throw new Error(`Projet introuvable pour l’avis de ${review.author} : ${review.project}`);
      return { ...review, project };
    });
};

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
