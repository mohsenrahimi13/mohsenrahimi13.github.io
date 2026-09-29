/* Mohsen Rahimi — motion layer (GSAP + ScrollTrigger + SplitText + Lenis)
   Progressive enhancement: if anything here fails, main.js's plain reveal still works. */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasLibs = window.gsap && window.ScrollTrigger && window.SplitText;
  if (reduce || !hasLibs) return;

  const root = document.documentElement;
  root.classList.add('motion');
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fine = window.matchMedia('(pointer: fine)').matches;

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    // anchor links go through Lenis so the easing matches
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id); if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -56, duration: 1.2 });
      history.pushState(null, '', id);
    }));
  }

  /* ---------- Preloader (once per session) ---------- */
  const pre = $('#preloader');
  let seen = false;
  try { seen = sessionStorage.getItem('seen') === '1'; sessionStorage.setItem('seen', '1'); } catch (e) {}
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (pre && !seen) {
    root.classList.add('is-loading');
    const name = new SplitText($('.pre-name'), { type: 'chars' });
    const counter = { v: 0 }; const cEl = $('.pre-count');
    intro
      .from(name.chars, { yPercent: 110, stagger: 0.03, duration: 0.8 })
      .to(counter, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { cEl.textContent = String(Math.round(counter.v)).padStart(3, '0'); } }, 0)
      .to($('.pre-line'), { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0)
      .to(name.chars, { yPercent: -110, stagger: 0.015, duration: 0.5, ease: 'power3.in' }, 1.15)
      .to([cEl, $('.pre-line')], { opacity: 0, duration: 0.3 }, 1.2)
      .to(pre, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 1.35)
      .add(() => { pre.remove(); root.classList.remove('is-loading'); }, 2.2);
  } else if (pre) { pre.remove(); }

  /* ---------- Hero entrance ---------- */
  const heroStart = pre && !seen ? 1.7 : 0.1;
  const h1 = $('.hero h1');
  const h1Split = new SplitText(h1, { type: 'chars,words', mask: 'chars' });
  const lede = new SplitText($('.hero .lede'), { type: 'lines', mask: 'lines' });
  intro
    .from(h1Split.chars, { yPercent: 115, rotate: 4, stagger: 0.035, duration: 1, ease: 'expo.out' }, heroStart)
    .from($('.hero .eyebrow'), { y: 14, opacity: 0, duration: 0.7 }, heroStart + 0.1)
    .from(lede.lines, { yPercent: 100, stagger: 0.08, duration: 0.9, ease: 'expo.out' }, heroStart + 0.35)
    .from($$('.hero-cta .btn, .hero-links li'), { y: 16, opacity: 0, stagger: 0.06, duration: 0.6 }, heroStart + 0.6)
    .from($('.photo-frame'), { clipPath: 'inset(0 0 100% 0 round 200px 200px 24px 24px)', duration: 1.3, ease: 'expo.inOut' }, heroStart + 0.1)
    .from($('.photo-frame img'), { scale: 1.25, duration: 1.6, ease: 'expo.out' }, heroStart + 0.1)
    .from($('.hero-photo figcaption'), { opacity: 0, y: 8, duration: 0.6 }, heroStart + 1)
    .from($('.hero-marquee'), { opacity: 0, duration: 0.8 }, heroStart + 0.9);

  /* ---------- Hero parallax ---------- */
  gsap.to('.hero-photo', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-text', {
    yPercent: 18, opacity: 0.35, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ---------- Section headings: masked line reveal ---------- */
  $$('.section h2').forEach(h => {
    const s = new SplitText(h, { type: 'chars', mask: 'chars' });
    gsap.from(s.chars, {
      yPercent: 110, stagger: 0.02, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: h, start: 'top 85%', once: true }
    });
  });
  $$('.section-num, .section-sub').forEach(el => {
    gsap.from(el, { opacity: 0, y: 10, duration: 0.6, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* ---------- About: words light up as you read ---------- */
  $$('[data-words]').forEach(p => {
    const s = new SplitText(p, { type: 'words' });
    gsap.fromTo(s.words, { opacity: 0.18 }, {
      opacity: 1, stagger: 0.02, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 }
    });
  });

  /* ---------- Generic staggered reveals (cards, timeline, etc.) ---------- */
  const groups = ['.fact-card', '.paper', '.timeline > li', '.award', '.teach-card', '.skills > div', '.contact-card', '.note', '.filters', '.contact .lede', '.contact h2 ~ p'];
  groups.forEach(sel => {
    const els = $$(sel); if (!els.length) return;
    ScrollTrigger.batch(els, {
      start: 'top 88%', once: true,
      onEnter: (batch) => gsap.fromTo(batch, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: 'expo.out', overwrite: true })
    });
  });
  // set initial state without a flash: elements start hidden only once JS is confirmed running
  gsap.set(groups.join(','), { opacity: 0 });
  // any element that never scrolls into view (already above fold on refresh) gets revealed on first refresh
  ScrollTrigger.addEventListener('refresh', () => ScrollTrigger.update());

  /* ---------- Timeline line draws ---------- */
  $$('.timeline > li').forEach(li => {
    gsap.from(li, { '--tl-draw': 0, ease: 'none', scrollTrigger: { trigger: li, start: 'top 80%', end: 'bottom 60%', scrub: true } });
  });

  /* ---------- Magnetic buttons (desktop) ---------- */
  if (fine) {
    $$('.btn, .chip, .icon-btn').forEach(el => {
      const strength = el.classList.contains('btn') ? 0.35 : 0.2;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- Paper cards: tilt toward the cursor ---------- */
  if (fine) {
    $$('.paper').forEach(card => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
      gsap.set(card, { transformPerspective: 1200 });
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 4);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 3);
      });
      card.addEventListener('mouseleave', () => { rx(0); ry(0); });
    });
  }

  /* ---------- Nav: hide on scroll down, show on scroll up ---------- */
  const nav = $('#nav');
  ScrollTrigger.create({
    start: 'top -120',
    onUpdate: (self) => nav.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 200),
    onLeaveBack: () => nav.classList.remove('is-hidden')
  });

  /* ---------- Hero background: a scatterplot that fits its own regression ---------- */
  const canvas = $('#hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [], fit = { a: 0, b: 0 }, progress = { p: 0 };
    const rng = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(20260929);
    const gen = () => {
      pts = [];
      for (let i = 0; i < 70; i++) {
        const x = rng();
        // Box–Muller noise
        const u = rng() || 1e-9, v = rng();
        const n = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        pts.push({ x, y: 0.25 + 0.5 * x + 0.09 * n });
      }
      const n = pts.length, sx = pts.reduce((s, p) => s + p.x, 0), sy = pts.reduce((s, p) => s + p.y, 0);
      const sxx = pts.reduce((s, p) => s + p.x * p.x, 0), sxy = pts.reduce((s, p) => s + p.x * p.y, 0);
      fit.b = (n * sxy - sx * sy) / (n * sxx - sx * sx); fit.a = (sy - fit.b * sx) / n;
    };
    const color = () => getComputedStyle(root).getPropertyValue('--accent').trim() || '#7a2e2e';
    const ink = () => getComputedStyle(root).getPropertyValue('--ink').trim() || '#000';
    const size = () => {
      const r = canvas.getBoundingClientRect(); const d = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height; canvas.width = W * d; canvas.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const X = x => 0.08 * W + x * 0.84 * W, Y = y => H - (0.12 * H + y * 0.76 * H);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const p = progress.p, c = color(), k = ink();
      // axes
      ctx.strokeStyle = k; ctx.globalAlpha = 0.18; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(0) + (X(1) - X(0)) * Math.min(1, p * 2), Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(0), Y(0) - (Y(0) - Y(1)) * Math.min(1, p * 2)); ctx.stroke();
      // points
      const nShow = Math.floor(pts.length * Math.max(0, Math.min(1, (p - 0.15) / 0.5)));
      pts.slice(0, nShow).forEach((pt, i) => {
        const fade = Math.min(1, (nShow - i) / 6);
        ctx.globalAlpha = 0.55 * fade; ctx.fillStyle = k;
        ctx.beginPath(); ctx.arc(X(pt.x), Y(pt.y), 2.2, 0, Math.PI * 2); ctx.fill();
      });
      // residuals then fitted line
      const lp = Math.max(0, Math.min(1, (p - 0.65) / 0.35));
      if (lp > 0) {
        ctx.globalAlpha = 0.16 * lp; ctx.strokeStyle = c; ctx.lineWidth = 1;
        pts.forEach(pt => { ctx.beginPath(); ctx.moveTo(X(pt.x), Y(pt.y)); ctx.lineTo(X(pt.x), Y(fit.a + fit.b * pt.x)); ctx.stroke(); });
        ctx.globalAlpha = 0.9; ctx.lineWidth = 1.6; ctx.strokeStyle = c;
        ctx.beginPath(); ctx.moveTo(X(0), Y(fit.a)); ctx.lineTo(X(lp), Y(fit.a + fit.b * lp)); ctx.stroke();
        if (lp >= 1) {
          ctx.globalAlpha = 0.7; ctx.fillStyle = c; ctx.font = '500 11px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillText('ŷ = ' + fit.a.toFixed(2) + ' + ' + fit.b.toFixed(2) + 'x', X(0.3), Y(0) + 16);
        }
      }
      ctx.globalAlpha = 1;
    };
    gen(); size(); draw();
    gsap.to(progress, { p: 1, duration: 3.2, ease: 'power2.inOut', delay: heroStart + 0.4, onUpdate: draw });
    window.addEventListener('resize', () => { size(); draw(); });
    $('#theme-toggle') && $('#theme-toggle').addEventListener('click', () => setTimeout(draw, 50));
  }

  // Once fonts are in, SplitText line breaks are final
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
