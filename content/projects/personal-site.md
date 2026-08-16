---
id: personal-site
title_en: Personal Site
title_ko: 개인 사이트
summary_en: This site. A static portfolio and work history on GitHub Pages — no framework, no build step.
summary_ko: 이 사이트. GitHub Pages 위에 올린 정적 포트폴리오 겸 작업 히스토리. 프레임워크도 빌드 스텝도 없음.
period_en: 2026 – Present
period_ko: 2026 – 현재
status: active
showcase: true
order: 2
tags: [HTML, CSS, JavaScript, GitHub Pages]
links:
  - GitHub | https://github.com/jleesdev/jleesdev.github.io
  - History | /work/journal/
---

<!-- lang:ko -->
순수 HTML/CSS/바닐라 JS로 만든 정적 사이트입니다.

- 콘텐츠는 `content/**/*.md` (frontmatter + 본문)에 두고, 페이지는 이를 렌더링만 합니다
- EN/KO 전환은 한 파일 안에서 `<!-- lang:xx -->` 마커로 본문을 나눠 처리합니다
- 작업 히스토리는 프로젝트 단위로 묶이고, 비공개 항목은 로컬에서만 보입니다

<!-- lang:en -->
A static site built with plain HTML, CSS, and vanilla JavaScript.

- Content lives in `content/**/*.md` (frontmatter + body); pages only render it
- EN/KO switching splits one file by `<!-- lang:xx -->` markers
- History entries are grouped by project; private entries render only on localhost
