/* ---- living frame: gold corner flourishes, shimmer, lotus blooms, touch response ----
   Idle motion is CSS (transform / opacity only). A small spring runs on
   requestAnimationFrame only while something is moving, then stops. */
(() => {
  const rnd = (a, b) => a + Math.random() * (b - a);

  const frag = document.createDocumentFragment();
  const corners = ['tl', 'tr', 'bl', 'br'].map(k => {
    const el = document.createElement('div');
    el.className = 'cn ' + k;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="cn-spr"><div class="cn-a"></div><div class="cn-c"></div></div>';
    frag.appendChild(el);
    return { k, el, spr: el.firstChild, rose: el.querySelector('.cn-c'), a: 0, v: 0 };
  });
  document.querySelector('.frame').after(frag);

  /* soft glow behind Ganesha */
  const halo = document.createElement('div');
  halo.className = 'halo';
  document.querySelector('.g-wrap').prepend(halo);

  /* ornamental dividers between sections */
  ['wedding', 'countdown', 'venue', 'ceremonies', 'reception', 'share'].forEach(id => {
    const o = document.createElement('div');
    o.className = 'orn rv rv-up';
    o.setAttribute('aria-hidden', 'true');
    o.addEventListener('click', e => petalBurst(e.clientX, e.clientY));
    $(id).prepend(o);
    rvWatch(o);
  });

  /* the lotus garden returns at the very end; its flowers open when it comes into view */
  const end = document.querySelector('.opening .garden').cloneNode(true);
  end.classList.add('end', 'pre');
  document.body.appendChild(end);
  new IntersectionObserver(([e], ob) => {
    if (e.isIntersecting) { end.classList.remove('pre'); ob.disconnect(); }
  }, { threshold: .1 }).observe(end);

  if (noMotion) return;

  /* light running round the border, plus gold that rises as you read */
  const frame = document.querySelector('.frame');
  [['t', 'runX', 0], ['r', 'runY', 3.5], ['b', 'runXr', 7], ['l', 'runYr', 10.5]].forEach(([side, run, delay]) => {
    const e = document.createElement('div');
    e.className = 'edge ' + side;
    const s = document.createElement('div');
    s.className = 'shine';
    s.style.setProperty('--run', run);
    s.style.setProperty('--delay', delay + 's');
    e.appendChild(s);
    frame.appendChild(e);
  });
  const prog = ['l', 'r'].map(side => {
    const p = document.createElement('div');
    p.className = 'prog ' + side;
    frame.appendChild(p);
    return p;
  });

  /* ---- spring: corners rustle, then settle; pointer parallax on desktop ---- */
  const bd = $('backdrop');
  const stick = document.querySelector('.opening-stick');
  new IntersectionObserver(([e]) => stick.classList.toggle('off', !e.isIntersecting)).observe(stick);
  let running = false, px = 0, py = 0, mx = 0, my = 0;
  const tick = () => {
    let busy = false;
    mx += (px - mx) * .06;
    my += (py - my) * .06;
    if (Math.abs(px - mx) + Math.abs(py - my) > .002) busy = true;
    corners.forEach(c => {
      c.v = (c.v - c.a * .045) * .93;
      c.a += c.v;
      if (Math.abs(c.a) + Math.abs(c.v) > .02) busy = true;
      else c.a = c.v = 0;
      c.spr.style.transform = `translate3d(${(mx * 7).toFixed(2)}px,${(my * 7).toFixed(2)}px,0) rotate(${c.a.toFixed(2)}deg)`;
    });
    bd.style.setProperty('--mx', (mx * -9).toFixed(2) + 'px');
    if (busy) requestAnimationFrame(tick);
    else running = false;
  };
  const wake = () => { if (!running) { running = true; requestAnimationFrame(tick); } };
  const kick = (c, amount) => {
    c.v += Math.max(-1.6, Math.min(1.6, amount));
    wake();
  };

  /* scrolling stirs the corners a little; gold rises with progress */
  let lastY = scrollY, docH = 1, scrollPending = false;
  const measure = () => { docH = Math.max(1, document.documentElement.scrollHeight - innerHeight); };
  const onScroll = () => {
    scrollPending = false;
    const dy = scrollY - lastY;
    lastY = scrollY;
    if (Math.abs(dy) > 6) corners.forEach((c, i) => kick(c, dy * (i % 2 ? .006 : -.006)));
    const p = Math.min(1, scrollY / docH).toFixed(3);
    prog.forEach(el => { el.style.transform = `scaleY(${p})`; });
  };
  addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  addEventListener('resize', measure);
  addEventListener('load', measure);
  measure();

  /* a new section arriving makes the frame stir */
  const stir = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    corners.forEach((c, i) => kick(c, i % 2 ? .9 : -.9));
    stir.unobserve(e.target);
  }), { threshold: .2 });
  document.querySelectorAll('.reveal').forEach(el => stir.observe(el));

  /* ---- touch + mouse ---- */
  let live = 0;
  const addFx = (cls, x, y, ms, vars) => {
    if (live > 36) return;
    const el = document.createElement('div');
    el.className = cls;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    if (vars) Object.keys(vars).forEach(k => el.style.setProperty(k, vars[k]));
    document.body.appendChild(el);
    live++;
    setTimeout(() => { el.remove(); live--; }, ms);
  };
  const shed = (x, y) => addFx('shed', x, y, 5000, {
    '--bx': rnd(-50, 50).toFixed(0) + 'px',
    '--br': rnd(-200, 200).toFixed(0) + 'deg'
  });
  const cornerPoint = c => [c.k[1] === 'l' ? 40 : innerWidth - 40, c.k[0] === 't' ? 40 : innerHeight - 40];
  const pop = c => c.rose.animate({ scale: ['1', '1.16', '.96', '1'] }, { duration: 750, easing: 'ease-out' });

  /* floating blossoms and sparkles lean away from a touch, then drift back */
  const floaters = [...document.querySelectorAll('.mote, .spark')];
  const pushFloaters = (x, y) => floaters.forEach(el => {
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - x, dy = r.top + r.height / 2 - y, d = Math.hypot(dx, dy);
    if (d > 130 || d < 1) return;
    const f = (130 - d) * .55 / d;
    el.style.translate = `${(dx * f).toFixed(0)}px ${(dy * f).toFixed(0)}px`;
    setTimeout(() => { el.style.translate = ''; }, 900);
  });

  const onTap = (x, y, target) => {
    if (target.closest && target.closest('.music-btn, .auto-btn')) return;
    addFx('rip', x, y, 880);
    for (let i = 0; i < 6; i++) {
      const ang = i / 6 * Math.PI * 2 + rnd(0, .5), dist = rnd(34, 62);
      addFx('bs', x, y, 820, {
        '--bx': (Math.cos(ang) * dist).toFixed(0) + 'px',
        '--by': (Math.sin(ang) * dist).toFixed(0) + 'px'
      });
    }
    pushFloaters(x, y);
    corners.forEach(c => {
      const [cx, cy] = cornerPoint(c);
      const d = Math.hypot(cx - x, cy - y);
      if (d > 230) return;
      kick(c, (Math.random() < .5 ? -1 : 1) * (1.6 - d / 230));
      pop(c);
      shed(x + rnd(-14, 14), y + rnd(-6, 10));
      if (d < 120) shed(x + rnd(-24, 24), y + rnd(0, 16));
    });
    /* touching a lotus makes it open a little wider and release petals */
    const lot = target.closest && target.closest('.gl, .gbud');
    if (lot) {
      lot.animate({ scale: ['1', '1.2', '.95', '1'] }, { duration: 900, easing: 'ease-out' });
      petalBurst(x, y);
    }
  };

  /* a tap, not a swipe: swiping to scroll stays clean */
  let down = null;
  addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; }, { passive: true });
  addEventListener('pointercancel', () => { down = null; }, { passive: true });
  addEventListener('pointerup', e => {
    if (down && performance.now() - down.t < 500 && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 12) {
      onTap(e.clientX, e.clientY, e.target);
    }
    down = null;
  }, { passive: true });

  /* desktop: gentle parallax, and corners rustle as the cursor passes */
  let moved = false, lastE = null, lastMX = 0, lastMY = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    lastE = e;
    if (moved) return;
    moved = true;
    requestAnimationFrame(() => {
      moved = false;
      const { clientX: x, clientY: y } = lastE;
      px = x / innerWidth - .5;
      py = y / innerHeight - .5;
      const speed = Math.hypot(x - lastMX, y - lastMY);
      lastMX = x;
      lastMY = y;
      corners.forEach(c => {
        const [cx, cy] = cornerPoint(c);
        if (Math.hypot(cx - x, cy - y) < 170 && speed > 4) kick(c, Math.min(speed * .03, .6) * (x > cx ? 1 : -1));
      });
      wake();
    });
  }, { passive: true });

  /* now and then a rose blooms and lets a blossom fall */
  setInterval(() => {
    if (document.hidden) return;
    const c = corners[Math.floor(rnd(0, 2))];
    pop(c);
    kick(c, .5);
    const [cx, cy] = cornerPoint(c);
    shed(cx + (c.k[1] === 'l' ? 26 : -26), cy + 30);
    const lots = [...document.querySelectorAll('.gl')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight;
    });
    if (lots.length) lots[Math.floor(rnd(0, lots.length))].animate({ scale: ['1', '1.1', '1'] }, { duration: 1400, easing: 'ease-in-out' });
  }, 6500);
})();
