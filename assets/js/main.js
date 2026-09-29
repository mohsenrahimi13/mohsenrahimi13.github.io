/* Mohsen Rahimi — site interactions (no dependencies) */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* Theme toggle */
  const root = document.documentElement;
  const toggle = $('#theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = () => root.getAttribute('data-theme') || (prefersDark.matches ? 'dark' : 'light');
  toggle && toggle.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Mobile menu */
  const menuBtn = $('#menu-toggle');
  const menu = $('#mobile-menu');
  if (menuBtn && menu) {
    const close = () => { menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); };
    menuBtn.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(a => a.addEventListener('click', close));
  }

  /* Sticky nav shadow + reading progress */
  const nav = $('#nav');
  const bar = $('#progress-bar');
  const onScroll = () => {
    const y = window.scrollY;
    nav && nav.classList.toggle('is-scrolled', y > 8);
    if (bar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Scroll reveal */
  const motion = document.documentElement.classList.contains('motion');
  const pending = new Set(motion ? [] : $$('.reveal'));
  const show = (el) => { el.classList.add('is-visible'); pending.delete(el); };
  // Reveal anything at or above the viewport line (covers anchor jumps and mid-page reloads,
  // where IntersectionObserver alone would leave skipped elements invisible).
  const sweep = () => {
    const line = window.innerHeight * 0.92;
    pending.forEach(el => { if (el.getBoundingClientRect().top < line) show(el); });
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    pending.forEach(el => io.observe(el));
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('hashchange', () => setTimeout(sweep, 50));
    sweep();
  } else {
    pending.forEach(show);
  }

  /* Active section highlighting */
  const links = $$('[data-nav]');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => so.observe(s));
  }

  /* Research: expandable abstracts */
  $$('.paper-title').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel && panel.classList.toggle('is-open', open);
    });
  });

  /* Research: filters */
  const chips = $$('.chip[data-filter]');
  const papers = $$('.paper');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach(c => { const on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-selected', String(on)); });
    papers.forEach(p => p.classList.toggle('is-hidden', f !== 'all' && p.dataset.type !== f));
  }));

  /* Live Bergamo clock */
  const clock = $('#clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
    const tick = () => { clock.textContent = '· ' + fmt.format(new Date()); };
    tick(); setInterval(tick, 15000);
  }

  /* Copy email */
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const v = btn.dataset.copy;
    try { await navigator.clipboard.writeText(v); btn.classList.add('is-copied'); setTimeout(() => btn.classList.remove('is-copied'), 1800); }
    catch (e) { window.location.href = 'mailto:' + v; }
  }));

  /* Text scramble on hover (decode effect) */
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&';
  $$('[data-scramble]').forEach(el => {
    const original = el.textContent; let raf = null;
    el.addEventListener('mouseenter', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      cancelAnimationFrame(raf); const start = performance.now(); const dur = 420;
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur); const fixed = Math.floor(p * original.length);
        el.textContent = original.split('').map((ch, i) => (i < fixed || ch === ' ') ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]).join('');
        if (p < 1) raf = requestAnimationFrame(step); else el.textContent = original;
      };
      raf = requestAnimationFrame(step);
    });
  });

  /* Footer year */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
