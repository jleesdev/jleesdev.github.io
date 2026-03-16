# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal portfolio site hosted on GitHub Pages. No build process, no framework, no package manager — pure HTML, CSS, and vanilla JavaScript served directly.

## Development

Open `index.html` directly in a browser, or use any static file server:

```bash
python3 -m http.server 8000
# or
npx serve .
```

No build step, no linting setup, no test suite.

## Architecture

### File Structure

- `index.html` — Landing page (hero + grid of work/life sections)
- `css/` — Stylesheets loaded in order: `variables.css` → `reset.css` → `main.css` → `components.css`
- `js/main.js` — Navigation (mobile menu, dropdowns, active link detection)
- `js/i18n.js` — Internationalization (EN/KO language switching)
- `locales/en.json`, `locales/ko.json` — Translation strings
- `work/resume/`, `work/portfolio/` — Professional pages
- `life/on-the-line/` — Mobile game landing page with privacy and support subpages

### CSS Design System

All design tokens live in `css/variables.css` (colors, spacing, typography, shadows, transitions). Use these variables — never hardcode values. Key tokens:

- `--color-bg`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-accent`
- `--space-1` through `--space-24` (0.25rem increments)
- `--text-sm` through `--text-5xl`
- `--container-max` (1100px), `--nav-height` (64px)

### Internationalization

HTML elements use `data-i18n="key"` attributes. `i18n.js` fetches the appropriate locale JSON and replaces text content. Language precedence: URL param `?lang=` → `localStorage` → browser language → `en`.

When adding new text content, add a `data-i18n` attribute and corresponding keys to both `locales/en.json` and `locales/ko.json`.

### Page Template

Every page shares the same structure: fixed nav → main content → footer, loading all four CSS files and both JS files. Follow the existing pages as templates when adding new pages.

### Responsive Breakpoints

- `768px` — tablet (nav collapses to hamburger)
- `640px` — mobile (single-column layouts)
