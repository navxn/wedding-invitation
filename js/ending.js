/* ---- end of the invitation ----
   At the very bottom, a deliberate extra pull (wheel, finger drag or key) or a tap on the
   "Back to the beginning" cue glides gently back to the opening screen. It only happens
   once per pull, never on momentum, never by itself, and any touch hands control back. */
(() => {
  const cue = $('endCue');
  if (!cue) return;
  const root = document.documentElement;
  const DWELL = 800;            /* ms the guest must rest at the end before a pull counts */
  const WHEEL_NEED = 160;       /* px of wheel travel */
  const DRAG_NEED = 90;         /* px of finger drag */

  let pull = 0, going = false, goStart = 0, raf = 0, relaxTimer = 0, arrived = 0, startY = null;

  const atEnd = () => scrollY >= root.scrollHeight - innerHeight - 3;
  const setPull = v => {
    pull = Math.max(0, Math.min(1, v));
    cue.style.setProperty('--pull', pull.toFixed(3));
  };
  const relax = () => {
    clearTimeout(relaxTimer);
    relaxTimer = setTimeout(function fade() {
      if (going || pull <= 0) return;
      setPull(pull - .08);
      relaxTimer = setTimeout(fade, 30);
    }, 320);
  };

  /* note when the guest arrives at the end, and light the cue */
  let ticking = false;
  const watch = () => {
    ticking = false;
    const end = atEnd();
    if (end && !arrived) arrived = performance.now();
    if (!end) { arrived = 0; if (!going) setPull(0); }
    cue.classList.toggle('ready', end && !going);
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(watch); }
  }, { passive: true });
  addEventListener('resize', watch);
  watch();

  const ready = () => !going && atEnd() && arrived && performance.now() - arrived > DWELL;

  /* the glide back */
  const stop = () => {
    if (!going) return;
    going = false;
    cancelAnimationFrame(raf);
    root.style.scrollBehavior = '';
    cue.classList.remove('going');
    setPull(0);
    arrived = 0;
    watch();
  };
  const goTop = () => {
    if (going) return;
    if (noMotion) { scrollTo({ top: 0, behavior: 'auto' }); setPull(0); return; }
    dispatchEvent(new Event('invite-return'));
    going = true;
    goStart = performance.now();
    cue.classList.add('going');
    cue.classList.remove('ready');
    root.style.scrollBehavior = 'auto';
    const from = scrollY;
    const secs = Math.min(4.6, Math.max(2.4, from / 1500));
    let t = 0, last = performance.now();
    const step = now => {
      t = Math.min(1, t + Math.min(50, now - last) / 1000 / secs);
      last = now;
      const e = .5 - Math.cos(Math.PI * t) / 2;     /* slow in, slow out */
      scrollTo(0, from * (1 - e));
      if (t < 1) raf = requestAnimationFrame(step);
      else stop();
    };
    raf = requestAnimationFrame(step);
  };

  /* the guest takes over at any moment */
  /* (wheel events right after the trigger are the tail of the same flick, so they are ignored) */
  ['wheel', 'touchstart', 'keydown'].forEach(ev =>
    addEventListener(ev, () => {
      if (going && (ev !== 'wheel' || performance.now() - goStart > 1300)) stop();
    }, { passive: true, capture: true }));

  addEventListener('wheel', e => {
    if (e.deltaY <= 0 || !ready()) { if (e.deltaY < 0) setPull(0); return; }
    setPull(pull + e.deltaY / WHEEL_NEED);
    if (pull >= 1) goTop(); else relax();
  }, { passive: true });

  /* finger: the drag must begin while already resting at the end */
  addEventListener('touchstart', e => {
    startY = ready() && e.touches.length === 1 ? e.touches[0].clientY : null;
  }, { passive: true });
  addEventListener('touchmove', e => {
    if (startY === null || going) return;
    setPull((startY - e.touches[0].clientY) / DRAG_NEED);
  }, { passive: true });
  const release = () => {
    if (startY === null) return;
    startY = null;
    if (pull >= .85) goTop(); else relax();
  };
  addEventListener('touchend', release, { passive: true });
  addEventListener('touchcancel', release, { passive: true });

  /* keyboard: two deliberate presses at the end */
  addEventListener('keydown', e => {
    if (!['ArrowDown', 'PageDown', 'End', ' '].includes(e.key) || !ready()) return;
    if (e.target instanceof Element && e.target.closest('button, a, input, textarea')) return;
    setPull(pull + .55);
    if (pull >= 1) goTop(); else relax();
  });

  cue.addEventListener('click', goTop);
})();
