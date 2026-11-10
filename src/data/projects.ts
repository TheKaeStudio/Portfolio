import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export const getProjects = async () =>
  (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);

export type CardSize = 'large' | 'small' | 'full';

export const layoutSizes = (count: number): CardSize[] => {
  const sizes: CardSize[] = [];
  let large = true;
  while (sizes.length < count) {
    const capacity = large ? 2 : 3;
    const remaining = count - sizes.length;
    const take = Math.min(capacity, remaining);
    if (take === capacity) {
      sizes.push(...Array<CardSize>(take).fill(large ? 'large' : 'small'));
    } else if (take === 1) {
      sizes.push('full');
    } else {
      sizes.push(...Array<CardSize>(take).fill('large'));
    }
    large = !large;
  }
  return sizes;
};
