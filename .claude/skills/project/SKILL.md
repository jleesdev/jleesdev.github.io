---
name: project
description: 사이트의 프로젝트를 추가·수정·삭제하고 상태나 포트폴리오 노출을 바꾼다. "프로젝트 추가해줘", "이 프로젝트 완료로 바꿔줘", "포트폴리오에서 내려줘", 프로젝트 설명·태그·링크를 고칠 때 사용. Use when the user wants to add a project, change its status, toggle portfolio visibility, or edit project details.
---

# 프로젝트 관리

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
