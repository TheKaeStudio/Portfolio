const items = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

if (items.length && !reduce.matches) {
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const limit = window.innerHeight * 1.2;
    if (y <= limit) {
      for (const el of items) {
        const speed = Number(el.dataset.parallax) || 0;
        el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
      }
    }
    ticking = false;
  };

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
  update();
}

export {};
