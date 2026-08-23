---
name: history
description: 개인 사이트(jleesdev.github.io)의 작업 히스토리 항목을 추가·수정·삭제한다. "오늘 작업 기록해줘", "이거 히스토리에 남겨줘", "어제 한 일 정리해줘" 처럼 작업 내역을 사이트에 남기거나 이미 쓴 기록을 고칠 때 사용. 다른 프로젝트에서 작업하던 중에도 호출될 수 있다. Use when the user wants to log what they worked on to their personal site, add or edit a work history entry, or record progress on a project.
---

# 작업 히스토리 항목 관리

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

- 목록에는 요약 한 줄만 보이고, 클릭하면 본문 전체가 펼쳐진다. **`summary_ko` / `summary_en` 을
  항상 넣는다** — 없으면 본문을 140자로 잘라 자동 요약해서 문장 중간에 끊긴다. 접힌 상태에서
  딱 필요한 만큼만 보이도록 한 문장으로 쓴다.
- 사용자가 한국어로 말했으면 한국어가 원문, 영어는 번역이다. 반대면 반대로.

### 문체 (항목 사이에서 흔들리지 않게 고정)

| | 규칙 |
|---|---|
| 산문 | 마침표 **있음**, `~다` 어투. **문장이 끝나면 줄을 바꾼다** |
| 불릿 | 마침표 **없음**, `~다` 로 끝내지 않고 **명사형**으로 맺는다 |
| 요약 | 한 문장, 마침표 있음 |

```markdown
게임 도중 앱을 나갔다 돌아오면 진행이 되돌아가 있다는 제보를 받고 저장 구조를 뜯어봤다.
저장이 "떠나는 순간을 잡아서 한 번 쓴다"에만 의존하고 있었다.

- Unity 스플래시 스크린 제거
- 되돌리기 직후와 새 판 시작 직후에도 저장 — 취소한 수가 되살아나던 구간 차단
```

**한 항목은 한 줄로 쓴다.** 렌더러가 줄 단위 파서라 들여쓴 이어짐 줄은 `<li>` 밖으로 나가
별도 문단이 된다. 산문도 마찬가지여서, 문단 안에서 임의로 접으면 그 자리에 `<br>` 이 박힌다.
줄바꿈은 **문장 끝에서만** 한다.

불릿 안에서 설명을 덧붙일 때는 마침표로 문장을 잇지 말고 `—` 로 붙인다.
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
