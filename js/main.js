/**
 * main.js — mobile nav toggle, dropdown nav, active nav link, misc UI
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDropdowns();
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

/* ── Desktop dropdown navigation ── */

function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.nav-dropdown-btn');
    if (!btn) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));

      // Close other dropdowns
      dropdowns.forEach(other => {
        if (other !== dropdown) {
          other.classList.remove('open');
          other.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  // Close all on outside click
  document.addEventListener('click', () => {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
      dropdown.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
    });
  });

  // Close all on Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('open');
        dropdown.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ── Active nav link ── */

function setActiveNavLink() {
  const path = window.location.pathname;

  document.querySelectorAll('.nav-dropdown-menu a, .mobile-nav-group a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (href === '/' || href === '/index.html') {
      if (path === '/' || path === '/index.html') {
        link.classList.add('active');
      }
      return;
    }

    const section = href.replace(/\/$/, '').replace('/index.html', '');
    if (section && path.startsWith(section)) {
      link.classList.add('active');
      // Mark parent dropdown button as active
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        parentDropdown.querySelector('.nav-dropdown-btn')?.classList.add('active');
      }
    }
  });
}
