/* ---- links: maps, calendar, WhatsApp ---- */
const $ = id => document.getElementById(id);
const mapsUrl = o =>
  (o.mapsLink && o.mapsLink.trim()) ||
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(o.mapsQuery);
const calUrl = o =>
  'https://calendar.google.com/calendar/render?action=TEMPLATE'
  + '&text=' + encodeURIComponent(o.title)
  + '&dates=' + o.startUTC + '/' + o.endUTC
  + '&ctz=Asia/Kolkata'
  + '&details=' + encodeURIComponent(o.details)
  + '&location=' + encodeURIComponent(o.location);

$('mapsBtn').href = mapsUrl(INVITE.wedding);
$('calBtn').href = calUrl(INVITE.wedding);
$('cerMapsBtn').href = mapsUrl(INVITE.ceremonies);
$('recMapsBtn').href = mapsUrl(INVITE.reception);
$('recCalBtn').href = calUrl(INVITE.reception);
$('waBtn').href = 'https://wa.me/?text=' +
  encodeURIComponent(INVITE.shareText + '\n' + location.href.split('#')[0]);
$('countdownLabel').textContent = INVITE.countdownLabel;
$('countMsg').textContent = INVITE.countdownDoneMsg;

/* ---- scroll reveal (repeatable) ----
   Every text element shows when it comes into view and resets when it has left, so it plays
   again on the way back, in either direction. Transitions always chase the current state,
   so nothing can be left half-way. Elements arriving together are staggered in reading order. */
const SHOW = 0.15;
const rvShow = (el, delay) => {
  el.style.setProperty('--d', delay.toFixed(2) + 's');
  el.classList.add('in');
};
const rvHide = el => {
  if (!el.classList.contains('in')) return;
  el.style.setProperty('--d', '0s');
  el.classList.remove('in');
};
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
  const enter = [];
  es.forEach(e => {
    if (e.intersectionRatio >= SHOW) { if (!e.target.classList.contains('in')) enter.push(e); }
    else if (!e.isIntersecting) rvHide(e.target);
  });
  enter.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    .forEach((e, i) => rvShow(e.target, Math.min(i * .13, .8)));
}, { threshold: [0, SHOW], rootMargin: '0px 0px -5% 0px' }) : null;
const rvWatch = el => io ? io.observe(el) : el.classList.add('in');
document.querySelectorAll('.reveal .rv').forEach(rvWatch);

/* safety net: after any scroll or layout change, anything well inside the screen that is still
   hidden (very tall elements, odd rounding, restored scroll positions) is shown */
{
  let t = 0;
  const sweep = () => {
    const vh = innerHeight;
    document.querySelectorAll('.reveal .rv:not(.in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (Math.min(r.bottom, vh) - Math.max(r.top, 0) >= Math.min(r.height * .5, 70) && r.height) rvShow(el, 0);
    });
  };
  const later = () => { clearTimeout(t); t = setTimeout(sweep, 220); };
  addEventListener('scroll', later, { passive: true });
  addEventListener('resize', later);
  addEventListener('orientationchange', later);
  addEventListener('pageshow', later);
  addEventListener('load', later);
}

/* animations rest while the tab or app is in the background */
document.addEventListener('visibilitychange', () =>
  document.documentElement.classList.toggle('tab-hidden', document.hidden));

/* ---- floating gold dust + backdrop parallax ---- */
const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!noMotion) {
  const layer = $('petalLayer');
  const rnd = (a, b) => a + Math.random() * (b - a);
  /* x positions stay in the side margins so nothing drifts across the text */
  const edgeX = () => (Math.random() < .5 ? rnd(1, 15) : rnd(84, 97)).toFixed(1) + 'vw';
  /* soft motes of gold rise through the whole screen; fewer on low-end phones */
  const small = (navigator.hardwareConcurrency || 8) <= 4;
  const count = innerWidth > 800 ? 26 : small ? 11 : 17;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'mote';
    p.style.setProperty('--x', rnd(2, 98).toFixed(1) + 'vw');
    p.style.setProperty('--s', rnd(5, 13).toFixed(0) + 'px');
    p.style.setProperty('--dur', rnd(13, 26).toFixed(1) + 's');
    p.style.setProperty('--delay', (-rnd(0, 26)).toFixed(1) + 's');
    p.style.setProperty('--sway', rnd(-7, 7).toFixed(1) + 'vw');
    p.style.setProperty('--o', rnd(.45, .9).toFixed(2));
    layer.appendChild(p);
  }
  /* 10 golden sparkles that glow in place and fade, like lamp-light on gold */
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.setProperty('--x', edgeX());
    s.style.setProperty('--y', rnd(6, 92).toFixed(0) + 'vh');
    s.style.setProperty('--s', rnd(12, 22).toFixed(0) + 'px');
    s.style.setProperty('--dur', rnd(4, 7.5).toFixed(1) + 's');
    s.style.setProperty('--delay', (-rnd(0, 8)).toFixed(1) + 's');
    layer.appendChild(s);
  }
  const bd = $('backdrop');
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const maxDrift = bd.offsetHeight * 0.03;
      bd.style.setProperty('--sy', (-Math.min(scrollY * 0.045, maxDrift)).toFixed(1) + 'px');
      ticking = false;
    });
  }, { passive: true });
}

/* ---- petal burst on ❀ / divider tap ---- */
function petalBurst(x, y) {
  if (noMotion) return;
  for (let i = 0; i < 10; i++) {
    const b = document.createElement('div');
    b.className = 'burst-petal';
    b.style.left = (x - 11) + 'px';
    b.style.top = (y - 11) + 'px';
    const ang = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 75;
    b.style.setProperty('--bx', (Math.cos(ang) * dist).toFixed(0) + 'px');
    b.style.setProperty('--by', (Math.sin(ang) * dist - 35).toFixed(0) + 'px');
    b.style.setProperty('--br', (Math.random() * 360 - 180).toFixed(0) + 'deg');
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 950);
  }
}
document.querySelectorAll('.flower-sep, .divider').forEach(el =>
  el.addEventListener('click', e => petalBurst(e.clientX, e.clientY))
);

/* ---- live countdown to the Muhurtham ---- */
(() => {
  const grid = $('countGrid');
  const m = (INVITE.wedding.startUTC || '').match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (!grid || !m) return;
  const target = Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  const pad = n => String(n).padStart(2, '0');
  const cells = ['cdDays', 'cdHours', 'cdMins', 'cdSecs'].map($);
  let timer = null;
  const tick = () => {
    const left = target - Date.now();
    if (left <= 0) {
      clearInterval(timer);
      grid.style.display = 'none';
      $('countMsg').style.display = 'block';
      return;
    }
    cells[0].textContent = Math.floor(left / 864e5);
    cells[1].textContent = pad(Math.floor(left / 36e5) % 24);
    cells[2].textContent = pad(Math.floor(left / 6e4) % 60);
    cells[3].textContent = pad(Math.floor(left / 1e3) % 60);
  };
  timer = setInterval(tick, 1000);
  tick();
})();

/* ---- background music + opening screen ----
   Phones only allow sound after a real gesture, so nothing plays at load.
   "Open Invitation" is that gesture: it lifts the opening screen and starts
   the tune with a gentle fade. The floating note button mutes / unmutes. */
/* date numbers react to scroll (see below) */
(() => {
  const btn = $('musicBtn');
  const music = $('bgMusic');
  const custom = (INVITE.musicFile || '').trim();
  if (custom) music.src = 'assets/audio/' + custom.replace(/^.*\//, '');

  const VOL = .65, FADE_IN = 2.4, FADE_OUT = 1.8;
  music.volume = 0;

  const show = () => btn.classList.add('show');
  if (music.readyState >= 1) show();
  music.addEventListener('loadedmetadata', show, { once: true });
  music.addEventListener('canplay', show, { once: true });
  music.addEventListener('error', () => btn.classList.remove('show'));

  let fadeEnd = null, rafFade = 0;
  const fadeTo = (goal, secs, then) => {
    clearTimeout(fadeEnd); cancelAnimationFrame(rafFade);
    const from = music.volume, t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / (secs * 1000));
      const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      music.volume = Math.min(1, Math.max(0, from + (goal - from) * e));
      if (k < 1) rafFade = requestAnimationFrame(step);
      else if (then) then();
    };
    rafFade = requestAnimationFrame(step);
  };

  const setUI = playing => {
    btn.classList.toggle('playing', playing);
    btn.setAttribute('aria-pressed', String(!playing));
    btn.setAttribute('aria-label', playing ? 'Mute background music' : 'Play background music');
  };

  let muted = false;
  const playFade = secs => {
    music.play().then(() => { setUI(true); fadeTo(VOL, secs); }).catch(() => {});
  };

  /* first gesture (scroll, finger-lift, tap) starts the tune; a browser that
     refuses stays silent and the hooks stay armed for the next try */
  const tryStart = e => {
    if (e && e.target instanceof Node && btn.contains(e.target)) return;
    if (muted) { detach(); return; }
    if (music.paused && music.getAttribute('src')) {
      music.play().then(() => { detach(); setUI(true); fadeTo(VOL, FADE_IN); }).catch(() => {});
    }
  };
  const ARM = [[window, 'scroll'], [document, 'touchend'], [document, 'pointerup']];
  const detach = () => ARM.forEach(([t, ev]) => t.removeEventListener(ev, tryStart, true));
  ARM.forEach(([t, ev]) => t.addEventListener(ev, tryStart, { capture: true, passive: true }));

  btn.addEventListener('click', () => {
    if (muted || music.paused) { muted = false; playFade(FADE_IN); }
    else { muted = true; setUI(false); fadeTo(0, FADE_OUT, () => music.pause()); }
  });

  /* hush when the guest switches apps / locks the screen */
  let hushed = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      hushed = !music.paused;
      if (hushed) music.pause();
    } else {
      if (hushed && !muted) playFade(1.2);
      hushed = false;
    }
  });
})();

/* ---- opening date: numbers light up in turn as the page scrolls ---- */
(() => {
  const op = $('opening');
  const nums = [...document.querySelectorAll('.open-date .d')];
  const hint = document.querySelector('.open-hint');
  const stick = op.firstElementChild;
  const vh = () => innerHeight;
  let ticking = false;
  const update = () => {
    ticking = false;
    const range = Math.max(1, op.offsetHeight - vh());
    const p = Math.min(1, Math.max(0, -op.getBoundingClientRect().top / range));
    nums.forEach((n, i) => n.classList.toggle('on', noMotion || p >= 0.12 + i * 0.26));
    stick.style.setProperty('--p', p.toFixed(3));
    document.body.classList.toggle('in-open', p < .6);
    if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 5));
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  update();
})();

/* ---- the couple's names stay on one line each, at one shared size ----
   The CSS sizes get very close; this trims a few percent more where a narrow phone or a slow
   web font needs it, and re-checks on resize, rotation and once the fonts have loaded. */
(() => {
  const $$ = s => [...document.querySelectorAll(s)];
  const groups = [
    { lines: () => $$('.names>span'), sizers: () => $$('.names'),
      limit: () => $('couple').clientWidth, width: el => el.offsetWidth },
    { lines: () => $$('.bride-name'), sizers: () => $$('.bride-name'),
      limit: () => $('invitation').clientWidth, width: el => el.offsetWidth },
    { lines: () => $$('.sum-row dd.nm'), sizers: () => $$('.sum-row dd.nm'),
      limit: () => Math.min(...$$('.sum-row dd.nm').map(e => e.clientWidth)), width: el => el.scrollWidth }
  ];
  const MIN = 14;
  const fit = () => groups.forEach(g => {
    const lines = g.lines(), sizers = g.sizers();
    if (!lines.length) return;
    sizers.forEach(s => { s.style.fontSize = ''; });
    let size = parseFloat(getComputedStyle(sizers[0]).fontSize);
    const limit = g.limit();
    while (size > MIN && lines.some(l => g.width(l) > limit + .5)) {
      size *= .97;
      sizers.forEach(s => { s.style.fontSize = size.toFixed(2) + 'px'; });
    }
  });
  let t = 0;
  const later = () => { clearTimeout(t); t = setTimeout(fit, 120); };
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  addEventListener('load', fit);
  addEventListener('resize', later);
  addEventListener('orientationchange', later);
})();
