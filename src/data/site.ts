export const site = {
  name: 'The Kae Studio',
  legalName: 'The Kae Studio',
  tagline: 'Design & Développement',
  title: 'The Kae Studio · Design UI/UX, développement web & mobile, montage vidéo',
  description:
    'The Kae Studio est le studio de Koçak Ali Erdem : design UI/UX, développement de sites, d’applications mobiles et de logiciels, montage vidéo et graphisme, en Belgique.',
  founder: {
    name: 'Koçak Ali Erdem',
    givenName: 'Ali Erdem',
    familyName: 'Koçak',
    jobTitle: 'Designer UI/UX & développeur full-stack',
  },
  email: 'kocakalierdem@gmail.com',
  phone: '+32 467 32 81 51',
  phoneHref: 'tel:+32467328151',
  location: {
    city: 'Verviers',
    region: 'Province de Liège',
    country: 'Belgique',
    countryCode: 'BE',
    latitude: 50.5891,
    longitude: 5.8627,
  },
  timezone: 'Europe/Brussels',
  locale: 'fr_BE',
  socials: [{ label: 'GitHub', href: 'https://github.com/TheKaeStudio' }],
} as const;

export type Site = typeof site;
