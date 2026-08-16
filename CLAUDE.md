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
- `js/content.js` — Loads `content/index.json` and renders markdown
- `locales/en.json`, `locales/ko.json` — Translation strings (UI labels only)
- `content/` — Markdown content: projects, work history, resume
- `content-private/` — Private history entries (gitignored, localhost only)
- `tools/build_index.py` — Bundles `content/**/*.md` into `content/index.json`
- `work/resume/`, `work/portfolio/`, `work/journal/`, `work/project/` — Professional pages
- `life/on-the-line/` — Mobile game landing page with privacy and support subpages

### Content System

Page content is **not** written into HTML. It lives in markdown files and the pages render it:

```
content/projects/<id>.md                 프로젝트 (포트폴리오 카드 + 상세 페이지)
content/journal/YYYY-MM-DD-<slug>.md     작업 히스토리 항목
content/resume/experience/<id>.md        경력
content/resume/education/<id>.md         학력
content/resume/skills.md                 기술 스택 + 이력서 사이드바 링크
content/index.json                       생성물 — 직접 편집 금지
content-private/journal/...              비공개 히스토리 (gitignored)
```

Each file is `frontmatter + body`. Both languages live in one file, separated by
markers that **must occupy a whole line**:

```markdown
---
date: 2026-08-16
project: on-the-line
title_en: Level editor prototype
title_ko: 레벨 에디터 프로토타입
tags: [unity, tooling]
visibility: public
links:
  - Commit | https://github.com/...
---

<!-- lang:ko -->
한국어 본문

<!-- lang:en -->
English body
```

Frontmatter is a small YAML subset: `key: value`, `[inline, arrays]`, block lists (`  - item`),
`true`/`false`, integers. Links and skill groups use `Label | value` items. `title_en`/`title_ko`
pairs collapse to `{en, ko}`; a missing side falls back to the other.

**After editing any content file, run:**

```bash
python3 tools/build_index.py
```

Browsers cannot list directories, so this bundles everything into `content/index.json`
(committed, public) and `content-private/index.json` (gitignored, includes private entries).
The site loads the private bundle only on localhost. Entries marked `visibility: private`
never enter the public bundle even if they sit in `content/`.

Markdown support is a deliberate subset (`js/content.js`): headings, lists, blockquotes,
fenced code, `---`, bold/italic, inline code, links, images. No tables, no raw HTML.

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
