const blocks = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const split = (root: HTMLElement) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const text = node.textContent ?? '';
    if (!text.trim()) continue;
    const fragment = document.createDocumentFragment();
    for (const part of text.split(/([ \t\n\r]+)/)) {
      if (!part) continue;
      if (/^[ \t\n\r]+$/.test(part)) {
        fragment.append(part);
      } else {
        const word = document.createElement('span');
        word.className = 'w';
        word.textContent = part;
        fragment.append(word);
      }
    }
    node.replaceWith(fragment);
  }

  return [...root.querySelectorAll<HTMLElement>('.w')];
};

if (blocks.length && !reduce) {
  const entries = blocks.map((el) => ({ el, words: split(el), lit: -1 }));
  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    for (const entry of entries) {
      const rect = entry.el.getBoundingClientRect();
      const start = vh * 0.92;
      const end = vh * 0.38;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height * 0.6)));
      const lit = Math.round(progress * entry.words.length);
      if (lit === entry.lit) continue;
      entry.words.forEach((word, i) => word.classList.toggle('is-lit', i < lit));
      entry.lit = lit;
    }
    ticking = false;
  };

  document.documentElement.classList.add('reveal-ready');
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', update, { passive: true });
  update();
}
