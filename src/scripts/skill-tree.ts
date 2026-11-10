interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  depth: number;
  phase: number;
  speed: number;
  hue: number;
}

const dialog = document.querySelector<HTMLDialogElement>('[data-tree]');

if (dialog) {
  const viewport = dialog.querySelector<HTMLElement>('[data-tree-viewport]')!;
  const worldEl = dialog.querySelector<HTMLElement>('[data-tree-world]')!;
  const panel = dialog.querySelector<HTMLElement>('[data-tree-panel]')!;
  const canvas = dialog.querySelector<HTMLCanvasElement>('[data-tree-sky]')!;
  const ctx = canvas.getContext('2d')!;
  const fullBox: Box = JSON.parse(worldEl.dataset.box!);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact = window.matchMedia('(max-width: 760px)');
  const minZoom = 0.2;
  const maxZoom = 2.2;

  const camera = { x: 0, y: 0, k: 1 };
  const pointers = new Map<number, { x: number; y: number }>();
  let selected: string | null = null;
  let frame = 0;
  let stars: Star[] = [];
  let shooting: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
  let nextShot = 0;

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const render = (animate = false) => {
    worldEl.classList.toggle('is-animating', animate && !reduce);
    worldEl.style.transform = `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.k})`;
    if (reduce) drawSky(0);
  };

  const panelWidth = () => (panel.hidden || compact.matches ? 0 : panel.offsetWidth + 40);

  const fit = (box: Box, animate = true) => {
    const rect = viewport.getBoundingClientRect();
    const top = 150;
    const bottom = 110;
    const width = rect.width - panelWidth() - 40;
    const height = rect.height - top - bottom;
    camera.k = clamp(Math.min(width / box.width, height / box.height), minZoom, 1.15);
    camera.x = 20 + width / 2 - (box.x + box.width / 2) * camera.k;
    camera.y = top + height / 2 - (box.y + box.height / 2) * camera.k;
    render(animate);
  };

  const zoomAt = (px: number, py: number, factor: number, animate = false) => {
    const k = clamp(camera.k * factor, minZoom, maxZoom);
    camera.x = px - (px - camera.x) * (k / camera.k);
    camera.y = py - (py - camera.y) * (k / camera.k);
    camera.k = k;
    render(animate);
  };

  const centerOn = (x: number, y: number) => {
    const rect = viewport.getBoundingClientRect();
    camera.k = Math.max(camera.k, 0.8);
    camera.x = (rect.width - panelWidth()) / 2 - x * camera.k;
    camera.y = rect.height / 2 - y * camera.k;
    render(true);
  };

  const ancestry = (id: string) => {
    const chain: string[] = [];
    let current: string | undefined = id;
    while (current && current !== 'root') {
      chain.push(current);
      const node: HTMLElement | null = worldEl.querySelector(`[data-self="${current}"], .node--skill[data-node="${current}"], .node--branch[data-node="${current}"]`);
      current = node?.dataset.parent;
    }
    return chain;
  };

  const highlight = (id: string | null) => {
    const lit = new Set(id ? ancestry(id) : []);
    dialog.querySelectorAll<SVGLineElement>('[data-link]').forEach((line) => {
      line.classList.toggle('is-lit', lit.has(line.dataset.link!));
    });
    dialog.querySelectorAll<HTMLElement>('[data-node]').forEach((node) => {
      node.classList.toggle('is-active', node.dataset.node === id && !node.dataset.self);
    });
  };

  const showPanel = (id: string, focus: boolean) => {
    panel.querySelectorAll<HTMLElement>('[data-panel]').forEach((article) => {
      article.hidden = article.dataset.panel !== id;
    });
    panel.hidden = false;
    panel.scrollTop = 0;
    if (focus) panel.focus({ preventScroll: true });
  };

  const closePanel = () => {
    panel.hidden = true;
    selected = null;
    highlight(null);
  };

  const select = (id: string, focus = false) => {
    selected = id;
    highlight(id);
    showPanel(id, focus);
    const node = worldEl.querySelector<HTMLElement>(`.node[data-node="${id}"]:not([data-self])`);
    if (node && !compact.matches) {
      centerOn(parseFloat(node.style.left), parseFloat(node.style.top));
    }
  };

  const setFocusButton = (button: HTMLElement | null) => {
    dialog.querySelectorAll<HTMLElement>('[data-focus]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
  };

  const resizeSky = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const area = canvas.clientWidth * canvas.clientHeight;
    const count = Math.round(clamp(area / 2600, 160, 620));
    stars = Array.from({ length: count }, () => {
      const depth = Math.random();
      return {
        x: Math.random(),
        y: Math.random(),
        r: 0.35 + depth * depth * 1.5,
        depth,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.6,
        hue: Math.random(),
      };
    });
  };

  const drawSky = (time: number) => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (const star of stars) {
      const shift = 0.02 + star.depth * 0.08;
      const x = (((star.x * w + camera.x * shift) % w) + w) % w;
      const y = (((star.y * h + camera.y * shift) % h) + h) % h;
      const twinkle = reduce ? 1 : 0.55 + 0.45 * Math.sin(time * 0.001 * star.speed + star.phase);
      const alpha = (0.25 + star.depth * 0.75) * twinkle;
      ctx.fillStyle = star.hue > 0.86 ? `rgba(255, 214, 170, ${alpha})` : star.hue > 0.7 ? `rgba(170, 205, 255, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, star.r, 0, Math.PI * 2);
      ctx.fill();
      if (star.r > 1.5 && twinkle > 0.9) {
        ctx.fillStyle = `rgba(200, 225, 255, ${alpha * 0.12})`;
        ctx.beginPath();
        ctx.arc(x, y, star.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (reduce) return;
    if (!shooting && time > nextShot) {
      shooting = { x: Math.random() * w * 0.7 + w * 0.2, y: Math.random() * h * 0.35, vx: -9 - Math.random() * 5, vy: 4 + Math.random() * 3, life: 1 };
      nextShot = time + 5000 + Math.random() * 7000;
    }
    if (shooting) {
      const { x, y, vx, vy, life } = shooting;
      const gradient = ctx.createLinearGradient(x, y, x - vx * 14, y - vy * 14);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${life})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - vx * 14, y - vy * 14);
      ctx.stroke();
      shooting.x += vx;
      shooting.y += vy;
      shooting.life -= 0.018;
      if (shooting.life <= 0) shooting = null;
    }
  };

  const loop = (time: number) => {
    drawSky(time);
    frame = requestAnimationFrame(loop);
  };

  const open = (target?: string) => {
    if (!dialog.open) dialog.showModal();
    resizeSky();
    closePanel();
    setFocusButton(dialog.querySelector('[data-focus]'));
    fit(fullBox, false);
    if (reduce) drawSky(0);
    else {
      cancelAnimationFrame(frame);
      nextShot = performance.now() + 1800;
      frame = requestAnimationFrame(loop);
    }
    if (target) {
      window.setTimeout(() => select(target), compact.matches ? 0 : 450);
      if (compact.matches) {
        dialog.querySelector(`.list__skill[data-node="${target}"], .list__branch-head[data-node="${target}"]`)?.scrollIntoView({ block: 'center' });
      }
    }
  };

  document.querySelectorAll<HTMLElement>('[data-tree-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => open(trigger.dataset.treeOpen || undefined));
  });

  dialog.querySelector('[data-tree-close]')?.addEventListener('click', () => dialog.close());
  panel.querySelector('[data-panel-close]')?.addEventListener('click', closePanel);

  dialog.addEventListener('cancel', (event) => {
    if (!panel.hidden) {
      event.preventDefault();
      closePanel();
    }
  });

  dialog.addEventListener('close', () => {
    cancelAnimationFrame(frame);
    closePanel();
  });

  dialog.addEventListener('click', (event) => {
    const node = (event.target as Element).closest<HTMLElement>('[data-node]');
    if (node) select(node.dataset.node!, event.detail === 0);
  });

  dialog.querySelectorAll<HTMLElement>('[data-focus]').forEach((button) => {
    button.addEventListener('click', () => {
      closePanel();
      setFocusButton(button);
      fit(JSON.parse(button.dataset.focus!));
    });
  });

  dialog.querySelectorAll<HTMLElement>('[data-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      const rect = viewport.getBoundingClientRect();
      zoomAt((rect.width - panelWidth()) / 2, rect.height / 2, button.dataset.zoom === 'in' ? 1.35 : 1 / 1.35, true);
    });
  });

  dialog.querySelectorAll<HTMLButtonElement>('[data-origin]').forEach((button) => {
    button.addEventListener('click', () => {
      const active = button.getAttribute('aria-pressed') === 'true';
      dialog.querySelectorAll('[data-origin]').forEach((item) => item.setAttribute('aria-pressed', 'false'));
      const origin = active ? null : button.dataset.origin!;
      if (origin) button.setAttribute('aria-pressed', 'true');
      dialog.classList.toggle('is-filtered', Boolean(origin));
      const matches = new Set<string>();
      dialog.querySelectorAll<HTMLElement>('[data-origins]').forEach((node) => {
        const match = Boolean(origin && node.dataset.origins!.split(' ').includes(origin));
        node.classList.toggle('is-match', match);
        if (match) matches.add(node.dataset.node!);
      });
      dialog.querySelectorAll<SVGLineElement>('.link--skill').forEach((line) => {
        line.classList.toggle('is-match', matches.has(line.dataset.link!));
      });
    });
  });

  viewport.addEventListener('pointerdown', (event) => {
    if ((event.target as Element).closest('button')) return;
    viewport.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    viewport.classList.add('is-dragging');
    worldEl.classList.remove('is-animating');
  });

  viewport.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    if (pointers.size === 1) {
      camera.x += event.clientX - previous.x;
      camera.y += event.clientY - previous.y;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      render();
      return;
    }
    const [a, b] = [...pointers.values()];
    const before = Math.hypot(a.x - b.x, a.y - b.y);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const [c, d] = [...pointers.values()];
    const after = Math.hypot(c.x - d.x, c.y - d.y);
    const rect = viewport.getBoundingClientRect();
    if (before > 0) zoomAt((c.x + d.x) / 2 - rect.left, (c.y + d.y) / 2 - rect.top, after / before);
  });

  const release = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    if (pointers.size === 0) viewport.classList.remove('is-dragging');
  };

  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);

  viewport.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      if (event.ctrlKey || event.metaKey) {
        zoomAt(event.clientX - rect.left, event.clientY - rect.top, Math.exp(-event.deltaY * 0.01));
      } else {
        camera.x -= event.deltaX;
        camera.y -= event.deltaY;
        render();
      }
    },
    { passive: false },
  );

  window.addEventListener('resize', () => {
    if (!dialog.open) return;
    resizeSky();
    if (!selected) fit(fullBox, false);
  });
}

export {};
