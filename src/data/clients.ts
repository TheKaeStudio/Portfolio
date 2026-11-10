import type { ImageMetadata } from 'astro';
import mbremoteIcon from '@/assets/clients/mbremote-icon.svg';
import obgfLogo from '@/assets/clients/obgf.svg';
import umashiLogo from '@/assets/clients/umashi.svg';

export type Client =
  | { name: string; project: string; display: 'text' }
  | { name: string; project: string; display: 'icon'; icon: ImageMetadata }
  | { name: string; project: string; display: 'logo'; logo: ImageMetadata };

export const clients: Client[] = [
  { name: 'Varynia', project: 'varynia', display: 'text' },
  { name: 'Bureau Sen', project: 'bureau-sen', display: 'text' },
  { name: 'MBRemote', project: 'mbremote', display: 'icon', icon: mbremoteIcon },
  { name: 'MkIT', project: 'mkit', display: 'text' },
  { name: 'Coffee Beanz', project: 'coffee-beanz-app', display: 'text' },
  { name: 'Umashi', project: 'umashi', display: 'logo', logo: umashiLogo },
  { name: 'OBGF', project: 'obgf', display: 'logo', logo: obgfLogo },
  { name: 'UA Rénov', project: 'ua-renov', display: 'text' },
  { name: 'Outside Park', project: 'outside-park', display: 'text' },
  { name: 'Débouch24', project: 'debouch24', display: 'text' },
  { name: 'Sami Madeo', project: 'sami-madeo', display: 'text' },
];
