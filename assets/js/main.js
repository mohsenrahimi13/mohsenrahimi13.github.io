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

  /* Footer year */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
