---
date: 2026-08-16
project: personal-site
title_en: Markdown-backed content and work history
title_ko: 마크다운 기반 콘텐츠·작업 히스토리 구조 도입
tags: [tooling, content]
visibility: public
---

<!-- lang:ko -->
포트폴리오/이력서가 HTML 하드코딩이라 항목을 추가할 때마다 HTML·EN·KO 세 곳을 손봐야 했다.
작업 히스토리처럼 매일 쌓이는 콘텐츠에는 못 버티는 구조라 데이터 레이어를 분리했다.

- `content/**/*.md` 를 원본으로 하고 frontmatter + 본문 형식으로 통일
- 한 파일 안에서 `<!-- lang:ko -->` / `<!-- lang:en -->` 마커로 두 언어를 같이 관리 — 한쪽만 갱신되는 desync 방지
- 브라우저가 디렉터리를 못 읽는 문제는 `tools/build_index.py` 가 만든 `content/index.json` 번들로 해결
- 비공개 일지는 `content-private/` 에 두고 gitignore, 공개 번들에서 제외

<!-- lang:en -->
The portfolio and resume were hardcoded HTML, so adding one entry meant editing three places:
the markup plus both locale files. That does not survive a journal that grows daily, so the
content moved into its own layer.

- `content/**/*.md` is now the source of truth: frontmatter plus body
- Both languages live in one file, split by `<!-- lang:ko -->` / `<!-- lang:en -->` markers, so they cannot drift apart
- Browsers cannot list directories, so `tools/build_index.py` emits a `content/index.json` bundle
- Private entries sit in `content-private/`, gitignored and excluded from the public bundle
