---
name: history
description: 작업 히스토리 항목을 추가·수정·삭제한다. "오늘 작업 기록해줘", "이거 히스토리에 남겨줘", "어제 한 일 정리해줘", 특정 프로젝트의 작업 내역을 사이트에 남기거나 이미 쓴 기록을 고칠 때 사용. Use when the user wants to log what they worked on, add or edit a work history entry, or record progress on a project.
---

# 작업 히스토리 항목 관리

`content/journal/` (공개) 또는 `content-private/journal/` (비공개)의 md 파일을 다룬다.
포맷과 빌드 규칙은 `CLAUDE.md` 의 Content System 절을 따른다.

## 새 항목 추가

### 1. 날짜와 프로젝트 확인

```bash
date +%F && ls content/projects/
```

- 사용자가 날짜를 말하지 않으면 오늘 날짜를 쓴다. "어제"처럼 상대적으로 말하면 계산해서 확정한다.
- 대상 프로젝트가 없으면 `project` 스킬로 먼저 만들자고 제안한다. 임의로 프로젝트를 만들지 않는다.
- 프로젝트가 여럿이고 어디에 속하는지 불명확하면 묻는다.

### 2. 공개 여부 확인

**공개 사이트에 올라간다는 점을 잊지 말 것.** 회사 업무·미공개 제품·내부 정보가 섞이면
비공개를 권한다. 판단이 애매하면 물어본다.

- 공개 → `content/journal/YYYY-MM-DD-<slug>.md`, `visibility: public`
- 비공개 → `content-private/journal/YYYY-MM-DD-<slug>.md`, `visibility: private`

slug 은 영문 소문자-하이픈. 같은 날 여러 건이면 슬러그로 구분한다.

### 3. 내용 수집

사용자가 말한 내용만 기록한다. 하지 않은 일을 채워 넣지 않는다.
코드 작업이라면 실제 커밋을 참고할 수 있다 (다른 레포면 경로를 물어본다):

```bash
git -C <repo> log --oneline --since=<date> --until=<date> --author="$(git config user.name)"
```

내용이 한 줄뿐이면 그대로 한 줄로 남긴다. 억지로 부풀리지 않는다.

### 4. 파일 작성

```markdown
---
date: 2026-08-16
project: on-the-line
title_en: <English title>
title_ko: <한국어 제목>
tags: [tag1, tag2]
visibility: public
links:
  - Commit | https://github.com/...
---

<!-- lang:ko -->
- 한 일 1
- 한 일 2

<!-- lang:en -->
- What I did 1
- What I did 2
```

- 사용자가 한국어로 말했으면 한국어가 원문, 영어는 번역이다. 반대면 반대로.
- `<!-- lang:xx -->` 마커는 **반드시 줄 전체**여야 한다. 본문 중간이나 백틱 안에 쓰면 마커로 인식되지 않는다(의도된 동작).
- `links` 가 없으면 그 키를 통째로 뺀다.
- `tags` 는 기존 항목에서 쓰던 것을 재사용한다: `grep -h '^tags:' content/journal/*.md`

## 기존 항목 수정·삭제

```bash
ls content/journal/ content-private/journal/ 2>/dev/null
grep -rl "<검색어>" content/journal/ content-private/journal/ 2>/dev/null
```

- 수정: 해당 md 파일만 고친다.
- 공개 ↔ 비공개 전환: 파일을 옮기고 `visibility` 값도 함께 바꾼다.
- 삭제: 어떤 항목을 지우는지 제목·날짜를 보여주고 확인받은 뒤 지운다.

## 마무리 (항상 실행)

```bash
python3 tools/build_index.py
```

- 실패하면 그 파일의 frontmatter를 고친다. `content/index.json` 을 직접 편집하지 않는다.
- 공개 항목을 추가했으면 `content/index.json` 도 함께 커밋한다.
- 렌더 확인이 필요하면 로컬 서버(`python3 -m http.server 8000`)로 `/work/journal/` 을 연다.

커밋 메시지는 `history: YYYY-MM-DD <제목>` 형식으로 한다.
비공개 파일은 gitignore 되어 있으므로 커밋 대상에 없는 게 정상이다.
푸시는 사용자에게 확인받고 한다.
