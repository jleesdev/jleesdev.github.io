---
name: resume
description: 이력서의 경력·학력·기술 스택 항목을 추가·수정·삭제한다. "경력 추가해줘", "이력서 업데이트", "학력 고쳐줘", "스킬에 Swift 추가" 같은 요청에 사용. Use when the user wants to update their resume — experience, education, or skills.
---

# 이력서 관리

```
content/resume/experience/<id>.md   경력 (항목 1개 = 파일 1개)
content/resume/education/<id>.md    학력
content/resume/skills.md            기술 스택 + 사이드바 링크
```

포맷과 빌드 규칙은 `CLAUDE.md` 의 Content System 절을 따른다.

## 현황 확인

```bash
ls content/resume/experience/ content/resume/education/ && cat content/resume/skills.md
```

## 경력 / 학력 항목

파일명은 `<시작연도>-<slug>.md` 형태로 짓는다 (예: `2021-software-engineer.md`).

```markdown
---
period_en: 2021 – Present
period_ko: 2021 – 현재
title_en: Software Engineer
title_ko: 소프트웨어 엔지니어
org_en: Company Name
org_ko: 회사 이름
order: 1
---

<!-- lang:ko -->
- 담당 업무와 성과

<!-- lang:en -->
- Responsibilities and achievements
```

- `order` 가 작을수록 위에 온다. 최신 경력이 위로 오게 잡는다
- 학력은 본문 없이 frontmatter만 있어도 된다
- 현재 재직 중이면 `period` 를 `2021 – Present` / `2021 – 현재` 로 맞춘다
- 회사명·성과는 사용자가 말한 내용만 쓴다. 추측해서 채우지 않는다

placeholder(`—`)로 남아 있는 항목을 실제 내용으로 채우는 경우, 새 파일을 만들지 말고
그 파일을 고치거나 알맞은 파일명으로 옮긴 뒤 채운다.

## 기술 스택

`content/resume/skills.md` 는 frontmatter만 있다.

```markdown
---
groups:
  - Languages | C#, Swift, Python
  - Frameworks & Tools | Unity, Git
  - Platforms | iOS, Android
links:
  - LinkedIn | https://...
  - GitHub | https://github.com/jleesdev
---
```

- `그룹명 | 쉼표로 구분한 항목들` 형식. 그룹은 필요한 만큼 늘리거나 줄인다
- 그룹명은 두 언어 공통으로 그대로 노출된다
- `links` 는 이력서 사이드바의 Links 카드에 들어간다

## 삭제

어떤 항목을 지우는지 제목·기간을 보여주고 확인받은 뒤 파일을 지운다.

## 마무리 (항상 실행)

```bash
python3 tools/build_index.py
```

`content/index.json` 을 직접 편집하지 않는다. 렌더 확인이 필요하면
로컬 서버(`python3 -m http.server 8000`)로 `/work/resume/` 를 연다.

커밋 메시지는 `resume: <한 일>` 형식. 푸시는 사용자에게 확인받고 한다.
