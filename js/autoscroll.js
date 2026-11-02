/* ---- guided auto-scroll ----
   Starts once the guest has scrolled by hand and let go. Glides to each
   section, rests so it can be read, and stops at the final section.
   Any touch, wheel, key or click hands control back to the guest; the
   small button above the music note resumes it. */
(() => {
  if (noMotion) return;

  const SPEED = 95;                 /* px per second */
  const MIN_GLIDE = 2.4, MAX_GLIDE = 14;   /* seconds */
  const START_DELAY = 1300;         /* ms after the first manual scroll settles */

  const root = document.documentElement;
  const btn = $('autoBtn');
  const sections = [...document.querySelectorAll('main section')];

  let gestured = false, touching = false, started = false, playing = false;
  let startTimer = 0, restTimer = 0, raf = 0;

  /* where to rest: each section centred, tall ones top then bottom */
  const stops = () => {
    const vh = innerHeight, maxY = root.scrollHeight - vh, out = [];
    sections.forEach(s => {
      const r = s.getBoundingClientRect(), top = r.top + scrollY;
      if (r.height <= vh - 140) out.push(top - (vh - r.height) / 2);
      else out.push(top - 70, top + r.height - vh + 70);
    });
    return out.map(y => Math.min(maxY, Math.max(0, y)));
  };

  const setUI = on => {
    btn.classList.toggle('paused', !on);
    btn.setAttribute('aria-label', on ? 'Pause automatic scrolling' : 'Resume automatic scrolling');
  };

  const halt = () => {
    playing = false;
    cancelAnimationFrame(raf);
    clearTimeout(restTimer);
    root.style.scrollBehavior = '';
  };

  const finish = () => {
    halt();
    btn.classList.remove('show');
  };

  const glide = (to, then) => {
    const from = scrollY, dist = to - from;
    const secs = Math.min(MAX_GLIDE, Math.max(MIN_GLIDE, Math.abs(dist) / SPEED));
    let t = 0, last = performance.now();
    const step = now => {
      t = Math.min(1, t + Math.min(50, now - last) / 1000 / secs);
      last = now;
      const e = .5 - Math.cos(Math.PI * t) / 2;   /* slow in, slow out */
      scrollTo(0, from + dist * e);
      if (t < 1) raf = requestAnimationFrame(step);
      else then();
    };
    raf = requestAnimationFrame(step);
  };

  /* rest long enough to read what is on screen */
  const restFor = y => {
    const mid = y + innerHeight / 2;
    const s = sections.find(el => {
      const r = el.getBoundingClientRect(), top = r.top + scrollY;
      return mid >= top && mid < top + r.height;
    });
    const chars = s ? s.textContent.replace(/\s+/g, ' ').length : 0;
    return Math.min(6500, 2600 + chars * 14);
  };

  const next = () => {
    if (!playing) return;
    const y = stops().find(v => v > scrollY + 24);
    if (y === undefined) return finish();
    glide(y, () => {
      if (!playing) return;
      restTimer = setTimeout(next, restFor(y));
    });
  };

  const play = () => {
    if (playing) return;
    if (scrollY >= root.scrollHeight - innerHeight - 4) return finish();
    playing = true;
    root.style.scrollBehavior = 'auto';      /* the page's smooth setting would fight each frame */
    setUI(true);
    btn.classList.add('show');
    next();
  };

  const pause = () => {
    if (!playing) return;
    halt();
    setUI(false);
  };

  /* the guest takes over */
  const onInput = e => {
    gestured = true;
    if (e.target instanceof Node && btn.contains(e.target)) return;
    pause();
  };
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(ev =>
    addEventListener(ev, onInput, { passive: true, capture: true }));
  addEventListener('touchstart', () => { touching = true; }, { passive: true });
  ['touchend', 'touchcancel'].forEach(ev =>
    addEventListener(ev, () => { touching = false; }, { passive: true }));

  btn.addEventListener('click', () => {
    if (playing) pause();
    else play();
  });

  /* begins after the first hand scroll has settled */
  const begin = () => {
    if (started) return;
    if (touching) { startTimer = setTimeout(begin, START_DELAY); return; }
    started = true;
    removeEventListener('scroll', watch);
    play();
  };
  const watch = () => {
    if (!gestured || scrollY < 8) return;
    clearTimeout(startTimer);
    startTimer = setTimeout(begin, START_DELAY);
  };
  addEventListener('scroll', watch, { passive: true });

  /* once the guest has been carried back to the beginning, the guide retires for good */
  addEventListener('invite-return', () => {
    started = true;
    clearTimeout(startTimer);
    removeEventListener('scroll', watch);
    finish();
  });
})();
