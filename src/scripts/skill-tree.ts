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
  const minZoom = 0.12;
  const maxZoom = 2.4;
  const dragThreshold = 6;

  const camera = { x: 0, y: 0, k: 1 };
  const pointers = new Map<number, { x: number; y: number }>();
  let start = { x: 0, y: 0 };
  let moved = false;
  let suppressClick = false;
  let lastZoom = 0;
  let selected: string | null = null;
  let frame = 0;
  let stars: Star[] = [];
  let shooting: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
  let nextShot = 0;

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const applyZoom = () => {
    const k = camera.k;
    if (k === lastZoom) return;
    lastZoom = k;
    const set = (name: string, value: number) => worldEl.style.setProperty(name, value.toFixed(3));
    set('--root-scale', clamp(0.3 / k, 1, 2.2));
    set('--star-scale', clamp(0.4 / k, 1, 2.4));
    set('--branch-scale', clamp(0.55 / k, 1, 3.4));
    set('--group-scale', clamp(0.5 / k, 1, 1.8));
    set('--icon-scale', clamp(0.3 / k, 1, 1.9));
    set('--label-scale', clamp(0.75 / k, 1, 1.65));
    worldEl.dataset.zoom = k < 0.28 ? 'far' : k < 0.44 ? 'mid' : 'near';
  };

  const render = (animate = false) => {
    worldEl.classList.toggle('is-animating', animate && !reduce);
    worldEl.style.transform = `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.k})`;
    applyZoom();
    if (reduce) drawSky(0);
  };

  const panelOpen = () => !panel.hidden;

  const visibleArea = () => {
    const rect = viewport.getBoundingClientRect();
    if (compact.matches) {
      const top = 116;
      const bottom = panelOpen() ? panel.offsetHeight + 12 : 104;
      return { left: 12, top, width: rect.width - 24, height: rect.height - top - bottom };
    }
    const top = 150;
    const right = panelOpen() ? panel.offsetWidth + 60 : 20;
    return { left: 20, top, width: rect.width - right - 20, height: rect.height - top - 110 };
  };

  const fit = (box: Box, animate = true) => {
    const area = visibleArea();
    camera.k = clamp(Math.min(area.width / box.width, area.height / box.height), minZoom, 1.15);
    camera.x = area.left + area.width / 2 - (box.x + box.width / 2) * camera.k;
    camera.y = area.top + area.height / 2 - (box.y + box.height / 2) * camera.k;
    render(animate);
  };

  const centerOn = (x: number, y: number, minK: number) => {
    const area = visibleArea();
    camera.k = clamp(Math.max(camera.k, minK), minZoom, maxZoom);
    camera.x = area.left + area.width / 2 - x * camera.k;
    camera.y = area.top + area.height / 2 - y * camera.k;
    render(true);
  };

  const zoomAt = (px: number, py: number, factor: number, animate = false) => {
    const k = clamp(camera.k * factor, minZoom, maxZoom);
    camera.x = px - (px - camera.x) * (k / camera.k);
    camera.y = py - (py - camera.y) * (k / camera.k);
    camera.k = k;
    render(animate);
  };

  const nodeElement = (id: string) => worldEl.querySelector<HTMLElement>(`.node[data-node="${id}"]:not([data-self])`);

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
    const node = nodeElement(id);
    if (!node) return;
    const isBranch = node.classList.contains('node--branch');
    const minK = compact.matches ? (isBranch ? 0.5 : 0.75) : 0.8;
    centerOn(parseFloat(node.style.left), parseFloat(node.style.top), minK);
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
      ctx.fillStyle =
        star.hue > 0.86
          ? `rgba(255, 214, 170, ${alpha})`
          : star.hue > 0.7
            ? `rgba(170, 205, 255, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;
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

  const explored = () => dialog.classList.add('has-explored');

  const open = (target?: string) => {
    if (!dialog.open) dialog.showModal();
    dialog.classList.remove('has-explored');
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
    if (target) window.setTimeout(() => select(target), 450);
  };

  document.querySelectorAll<HTMLElement>('[data-tree-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => open(trigger.dataset.treeOpen || undefined));
  });

  dialog.querySelector('[data-tree-close]')?.addEventListener('click', () => dialog.close());
  panel.querySelector('[data-panel-close]')?.addEventListener('click', closePanel);

  dialog.addEventListener('cancel', (event) => {
    if (panelOpen()) {
      event.preventDefault();
      closePanel();
    }
  });

  dialog.addEventListener('close', () => {
    cancelAnimationFrame(frame);
    closePanel();
  });

  dialog.addEventListener('click', (event) => {
    if (suppressClick) {
      event.preventDefault();
      return;
    }
    const target = event.target as Element;
    const node = target.closest<HTMLElement>('[data-node]');
    if (node) {
      explored();
      select(node.dataset.node!, event.detail === 0);
    } else if (viewport.contains(target) && panelOpen()) {
      closePanel();
    }
  });

  dialog.querySelectorAll<HTMLElement>('[data-focus]').forEach((button) => {
    button.addEventListener('click', () => {
      closePanel();
      setFocusButton(button);
      button.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
      const branch = button.dataset.branch && nodeElement(button.dataset.branch);
      if (branch && compact.matches) {
        camera.k = 0;
        centerOn(parseFloat(branch.style.left), parseFloat(branch.style.top), 0.45);
      } else {
        fit(JSON.parse(button.dataset.focus!));
      }
    });
  });

  dialog.querySelectorAll<HTMLElement>('[data-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      const area = visibleArea();
      explored();
      zoomAt(area.left + area.width / 2, area.top + area.height / 2, button.dataset.zoom === 'in' ? 1.4 : 1 / 1.4, true);
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
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      start = { x: event.clientX, y: event.clientY };
      moved = false;
    }
    worldEl.classList.remove('is-animating');
  });

  viewport.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    if (!moved) {
      const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y);
      if (pointers.size < 2 && distance < dragThreshold) return;
      moved = true;
      explored();
      viewport.classList.add('is-dragging');
      pointers.forEach((_, id) => {
        try {
          viewport.setPointerCapture(id);
        } catch {}
      });
    }
    if (pointers.size === 1) {
      camera.x += event.clientX - previous.x;
      camera.y += event.clientY - previous.y;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      render();
      return;
    }
    const [a, b] = [...pointers.values()];
    const before = Math.hypot(a.x - b.x, a.y - b.y);
    const midBefore = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const [c, d] = [...pointers.values()];
    const after = Math.hypot(c.x - d.x, c.y - d.y);
    const midAfter = { x: (c.x + d.x) / 2, y: (c.y + d.y) / 2 };
    const rect = viewport.getBoundingClientRect();
    camera.x += midAfter.x - midBefore.x;
    camera.y += midAfter.y - midBefore.y;
    if (before > 0) zoomAt(midAfter.x - rect.left, midAfter.y - rect.top, after / before);
    else render();
  });

  const release = (event: PointerEvent) => {
    if (!pointers.delete(event.pointerId)) return;
    if (pointers.size === 1) {
      const [rest] = pointers.values();
      start = { ...rest };
    }
    if (pointers.size > 0) return;
    viewport.classList.remove('is-dragging');
    if (moved) {
      suppressClick = true;
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);
    }
  };

  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);

  viewport.addEventListener('dblclick', (event) => {
    if ((event.target as Element).closest('[data-node]')) return;
    const rect = viewport.getBoundingClientRect();
    explored();
    zoomAt(event.clientX - rect.left, event.clientY - rect.top, 1.8, true);
  });

  viewport.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      explored();
      const rect = viewport.getBoundingClientRect();
      const lines = event.deltaMode === 1;
      const trackpad = !lines && !event.ctrlKey && (Math.abs(event.deltaX) > 0.5 || Math.abs(event.deltaY) < 40);
      if (trackpad) {
        camera.x -= event.deltaX;
        camera.y -= event.deltaY;
        render();
        return;
      }
      const delta = lines ? event.deltaY * 16 : event.deltaY;
      const factor = Math.exp(-delta * (event.ctrlKey ? 0.012 : 0.0022));
      zoomAt(event.clientX - rect.left, event.clientY - rect.top, factor);
    },
    { passive: false },
  );

  dialog.addEventListener('gesturestart', (event) => event.preventDefault());

  window.addEventListener('resize', () => {
    if (!dialog.open) return;
    resizeSky();
    if (!selected) fit(fullBox, false);
  });
}

export {};
