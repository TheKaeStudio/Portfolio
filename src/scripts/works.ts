type Size = 'large' | 'small' | 'full';

const grid = document.querySelector<HTMLElement>('[data-works]');
const group = document.querySelector<HTMLElement>('[data-filters]');
const statusEl = document.querySelector<HTMLElement>('[data-works-status]');

const sizesFor = (count: number): Size[] => {
  const sizes: Size[] = [];
  let large = true;
  while (sizes.length < count) {
    const capacity = large ? 2 : 3;
    const take = Math.min(capacity, count - sizes.length);
    if (take === capacity) sizes.push(...Array<Size>(take).fill(large ? 'large' : 'small'));
    else if (take === 1) sizes.push('full');
    else sizes.push(...Array<Size>(take).fill('large'));
    large = !large;
  }
  return sizes;
};

if (grid && group) {
  const items = [...grid.querySelectorAll<HTMLElement>('.works__item')];
  const buttons = [...group.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const labels = new Map(buttons.map((b) => [b.dataset.filter, b.firstChild?.textContent?.trim() ?? '']));

  const render = (filter: string) => {
    const visible: HTMLElement[] = [];
    for (const item of items) {
      const match = filter === 'all' || (item.dataset.categories ?? '').split(' ').includes(filter);
      item.hidden = !match;
      if (match) visible.push(item);
    }
    sizesFor(visible.length).forEach((size, i) => {
      visible[i].dataset.size = size;
    });
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
    }
    if (statusEl) {
      const label = filter === 'all' ? 'tous les projets' : labels.get(filter);
      statusEl.textContent = `${visible.length} projet${visible.length > 1 ? 's' : ''} affiché${visible.length > 1 ? 's' : ''} : ${label}`;
    }
  };

  const apply = (filter: string, animate = true) => {
    if (!buttons.some((b) => b.dataset.filter === filter)) filter = 'all';
    const url = new URL(window.location.href);
    if (filter === 'all') url.searchParams.delete('filtre');
    else url.searchParams.set('filtre', filter);
    history.replaceState(history.state, '', url);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (animate && !reduce && 'startViewTransition' in document) {
      document.startViewTransition(() => render(filter));
    } else {
      render(filter);
    }
  };

  group.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (button?.dataset.filter) apply(button.dataset.filter);
  });

  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('[data-filter-link]');
    if (link?.dataset.filterLink) apply(link.dataset.filterLink, false);
  });

  const initial = new URL(window.location.href).searchParams.get('filtre');
  if (initial) apply(initial, false);

  const canHover = window.matchMedia('(hover: hover)').matches;
  if (canHover) {
    for (const item of items) {
      const video = item.querySelector<HTMLVideoElement>('video');
      if (!video) continue;
      item.addEventListener('mouseenter', () => {
        video.play().then(() => video.classList.add('is-playing')).catch(() => {});
      });
      item.addEventListener('mouseleave', () => {
        video.pause();
        video.classList.remove('is-playing');
      });
    }
  }
}

export {};
