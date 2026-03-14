/**
 * main.js — mobile nav toggle, active nav link, misc UI
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  setActiveNavLink();
});

/* ── Mobile navigation ── */

function initMobileNav() {
  const btn = document.querySelector('.nav-mobile-btn');
  const menu = document.querySelector('.nav-mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

/* ── Active nav link ── */

function setActiveNavLink() {
  const path = window.location.pathname;

  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Exact root match
    if (href === '/' || href === '/index.html') {
      if (path === '/' || path === '/index.html') {
        link.classList.add('active');
      }
      return;
    }

    // Section match (e.g. /resume/ matches /resume/index.html)
    const section = href.replace(/\/$/, '').replace('/index.html', '');
    if (section && path.startsWith(section)) {
      link.classList.add('active');
    }
  });
}
