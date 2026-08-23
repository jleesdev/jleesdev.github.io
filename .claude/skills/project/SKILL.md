---
name: project
description: 개인 사이트(jleesdev.github.io)의 프로젝트를 추가·수정·삭제하고 상태나 포트폴리오 노출을 바꾼다. "사이트에 프로젝트 추가해줘", "이 프로젝트 완료로 바꿔줘", "포트폴리오에서 내려줘", 프로젝트 설명·태그·링크를 고칠 때 사용. Use when the user wants to add a project to their personal site, change its status, toggle portfolio visibility, or edit project details.
---

# 프로젝트 관리

> **작업 위치.** 이 스킬은 개인 사이트 레포(`~/work/jleesdev.github.io`)의 콘텐츠를 다룬다.
> 다른 프로젝트에서 세션을 열었더라도 먼저 그 디렉터리로 이동한 뒤 작업한다.
> 아래의 모든 경로와 명령은 그 디렉터리 기준이다.
>
> ```bash
> cd ~/work/jleesdev.github.io && git status --short
> ```
>
> 작업을 마치면 원래 있던 디렉터리로 돌아온다. 사이트 레포의 변경사항만 커밋하고,
> 세션이 열려 있던 다른 레포는 건드리지 않는다.

`content/projects/<id>.md` 한 파일이 프로젝트 하나다. 이 파일이 포트폴리오 카드와
프로젝트 상세 페이지(`/work/project/?id=<id>`) 양쪽을 만든다. **포트폴리오는 별도 데이터가 아니다.**
포맷과 빌드 규칙은 `CLAUDE.md` 의 Content System 절을 따른다.

## 현황 확인

```bash
ls content/projects/ && grep -H '^\(id\|status\|showcase\):' content/projects/*.md
```

## 새 프로젝트 추가

`id` 는 파일명과 같게, 영문 소문자-하이픈으로 짓는다. 작업 히스토리 항목이 이 `id` 로
프로젝트를 참조하므로 나중에 바꾸기 번거롭다 — 처음에 신중히 정한다.

```markdown
---
id: <project-id>
title_en: <English name>
title_ko: <한국어 이름>
summary_en: <카드에 들어갈 한 문장>
summary_ko: <카드에 들어갈 한 문장>
period_en: 2026 – Present
period_ko: 2026 – 현재
status: active
showcase: true
order: 3
tags: [Unity, iOS]
links:
  - GitHub | https://github.com/...
---

<!-- lang:ko -->
프로젝트 설명. 상세 페이지에 들어간다.

<!-- lang:en -->
Project description shown on the detail page.
```

- `status`: `active` / `completed` / `paused` / `archived` — 라벨은 `locales/*.json` 의 `project.status.*` 키
- `showcase: true` 인 프로젝트만 포트폴리오 페이지에 나온다. 히스토리만 쌓고 공개는 안 할 프로젝트는 `false`
- `order` 는 정렬 순서(작을수록 먼저). 기존 값과 겹치지 않게 잡는다
- `summary` 는 카드에 그대로 노출되므로 한 문장으로 짧게
- `page` (선택): 프로젝트 전용 페이지 경로. 넣으면 포트폴리오 카드가 공용 상세
  (`/work/project/?id=`) 대신 그 페이지로 간다. 없으면 공용 상세로 간다
- `icon` (선택): 앱 아이콘 경로. **아이콘이 있는 프로젝트는 반드시 넣는다** — 카드 제목 옆에
  56×56 으로 붙어 목록에서 한눈에 구분된다. 없으면 카드에 아이콘 자리를 만들지 않는다
- `summary` 의 줄바꿈은 `\n` 으로 쓴다. frontmatter 파서가 한 줄짜리 `key: value` 라
  실제 개행을 담지 못해서, 카드가 그릴 때 `<br>` 로 바꾼다

```markdown
page: /life/on-the-line/
icon: /life/on-the-line/ontheline_logo_strawberry.png
summary_ko: 움직이고, 줄 세워서, 클리어하라!\n간단하지만 중독적인 라인 퍼즐 게임!
```

**포트폴리오 카드에는 링크를 두지 않는다.** 카드 전체가 `page`(또는 공용 상세)로 가는 하나의
링크다. 작업 히스토리도 외부 링크도 이동한 페이지에서 보여준다 — 카드에 링크가 늘어나면
어디를 눌러야 할지 흐려지고, 중첩 `<a>` 는 HTML 상으로도 성립하지 않는다.

**설명에는 게임/제품 자체를 쓴다.** 어디에 배포했는지, 무엇으로 만들었는지처럼 **태그가 이미
말해주는 것은 설명에서 뺀다.** 포팅·출시 같은 작업 이야기는 `history` 스킬로 일지에 남긴다.

## 프로젝트 전용 페이지

`life/on-the-line/` 처럼 직접 만든 페이지가 있는 프로젝트는 세 군데를 연결한다.

1. **md 에** `page: /life/on-the-line/` — 포트폴리오 카드가 그쪽을 가리키게 한다
2. **그 HTML `<head>` 에** `<meta name="content-project" content="<project-id>">` —
   nav 의 히스토리(시계) 아이콘이 그 프로젝트의 히스토리로 바로 간다
3. **그 페이지 본문에** md 내용을 직접 쓰지 말고 `content/index.json` 에서 읽어 그린다.
   포폴 카드·공용 상세와 같은 원본을 봐야 셋이 어긋나지 않는다:

```html
<script src="/js/content.js"></script>
<script>
  const PROJECT_ID = document.querySelector('meta[name="content-project"]').content;
  async function renderProjectAbout() {
    const idx = await Content.index();
    const project = (idx.projects || []).find(p => p.id === PROJECT_ID);
    if (!project) return;
    document.getElementById('project-about-body').innerHTML =
      `<div class="md-body">${Content.markdown(Content.pick(project.body))}</div>`
      + Content.renderTags(project.tags);
    document.getElementById('project-about').hidden = false;
  }
  document.addEventListener('i18n:applied', renderProjectAbout);
</script>
```

`build_index.py` 의 `collect_projects` 는 필드를 화이트리스트로 뽑는다. frontmatter 에
새 키를 더해도 거기 추가하지 않으면 `index.json` 에 안 실린다.

## 수정

- 상태 변경 → `status` 만 바꾼다
- 포트폴리오 노출 토글 → `showcase` 만 바꾼다
- 설명·태그·링크 변경 → 해당 필드 또는 본문을 고친다
- `id` 변경은 피한다. 꼭 필요하면 참조하는 히스토리 항목의 `project:` 값도 전부 함께 바꾼다:
  `grep -rl "project: <old-id>" content/journal/ content-private/journal/`

## 삭제

프로젝트를 지우면 그 프로젝트의 히스토리 항목이 붕 뜬다. 지우기 전에:

```bash
grep -rl "project: <id>" content/journal/ content-private/journal/ 2>/dev/null | wc -l
```

연결된 항목 수를 사용자에게 알리고, 함께 지울지 다른 프로젝트로 옮길지 확인받는다.
포트폴리오에서만 감추면 되는 경우가 대부분이므로 `showcase: false` 또는
`status: archived` 를 먼저 제안한다.

## 마무리 (항상 실행)

```bash
python3 tools/build_index.py
```

`content/index.json` 을 직접 편집하지 않는다. 변경된 md 와 index.json 을 함께 커밋한다.
커밋 메시지는 `project: <한 일>` 형식. 푸시는 사용자에게 확인받고 한다.
