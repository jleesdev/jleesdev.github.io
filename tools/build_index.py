#!/usr/bin/env python3
"""
content/**/*.md → content/index.json 번들 생성기.

사이트에는 빌드 스텝이 없다. 이 스크립트는 "브라우저가 디렉터리를 읽을 수 없다"는
한 가지 문제만 해결한다. 생성된 index.json 은 커밋되며, 사이트는 이 파일만 받으면
동작한다. md 파일이 사람이 읽고 쓰는 원본이고, index.json 은 기계용 산출물이다.

출력:
  content/index.json          공개 콘텐츠만 (커밋됨 → 사이트에 게시)
  content-private/index.json  비공개 포함 전체 (gitignore → 로컬에서만 보임)

실행:
  python3 tools/build_index.py
"""

import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "content"
PRIVATE_DIR = ROOT / "content-private"

LANGS = ("en", "ko")

FRONTMATTER_RE = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n?", re.DOTALL)
# 줄 전체가 마커인 경우만 인정한다. 본문 중간이나 코드 안에 쓴
# <!-- lang:ko --> 같은 예시 텍스트를 마커로 오인하지 않기 위함.
LANG_MARKER_RE = re.compile(r"^[ \t]*<!--[ \t]*lang:([a-z]{2})[ \t]*-->[ \t]*$",
                            re.IGNORECASE | re.MULTILINE)
KV_RE = re.compile(r"^([A-Za-z0-9_]+):\s*(.*)$")
LIST_ITEM_RE = re.compile(r"^\s*-\s+(.*)$")


# ────────────────────────────── 파서 ──────────────────────────────

def parse_value(raw):
    v = raw.strip()
    if v in ("true", "false"):
        return v == "true"
    if v.startswith("[") and v.endswith("]"):
        return [s.strip() for s in v[1:-1].split(",") if s.strip()]
    if re.fullmatch(r"-?\d+", v):
        return int(v)
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        return v[1:-1]
    return v


def parse_frontmatter(text):
    """js/content.js 의 parseFrontmatter 와 같은 YAML 서브셋을 지원한다."""
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text

    meta, current_key = {}, None
    for line in match.group(1).split("\n"):
        if not line.strip():
            continue
        item = LIST_ITEM_RE.match(line)
        if item and current_key:
            meta.setdefault(current_key, []).append(parse_value(item.group(1)))
            continue
        kv = KV_RE.match(line)
        if not kv:
            continue
        key, raw = kv.group(1), kv.group(2)
        if raw.strip() == "":
            meta[key] = []
            current_key = key
        else:
            meta[key] = parse_value(raw)
            current_key = None

    return meta, text[match.end():]


def split_langs(body):
    """본문을 <!-- lang:ko --> 마커 기준으로 언어별로 나눈다."""
    result, last_lang, last_idx = {}, None, 0

    for m in LANG_MARKER_RE.finditer(body):
        chunk = body[last_idx:m.start()]
        if last_lang:
            result[last_lang] = chunk.strip()
        elif chunk.strip():
            result["*"] = chunk.strip()
        last_lang, last_idx = m.group(1).lower(), m.end()

    tail = body[last_idx:].strip()
    if last_lang:
        result[last_lang] = tail
    elif tail:
        result["*"] = tail

    return result


def i18n_field(meta, base, default=""):
    """title_en / title_ko → {"en": ..., "ko": ...}. 한쪽만 있으면 그 값으로 채운다."""
    values = {lang: meta.get(f"{base}_{lang}") for lang in LANGS}
    plain = meta.get(base)
    if not any(values.values()):
        return {"*": plain} if plain is not None else ({"*": default} if default else {})

    fallback = next(v for v in values.values() if v)
    return {lang: (values[lang] if values[lang] else fallback) for lang in LANGS}


def parse_links(raw):
    """`- App Store | https://...` 형식을 {label, url} 로."""
    links = []
    for item in raw or []:
        if not isinstance(item, str):
            continue
        label, sep, url = item.partition("|")
        if not sep:
            links.append({"label": label.strip(), "url": label.strip()})
        else:
            links.append({"label": label.strip(), "url": url.strip()})
    return links


def parse_groups(raw):
    """`- Languages | C#, Swift` 형식을 {label, items[]} 로."""
    groups = []
    for item in raw or []:
        if not isinstance(item, str):
            continue
        label, _, items = item.partition("|")
        groups.append({
            "label": label.strip(),
            "items": [s.strip() for s in items.split(",") if s.strip()],
        })
    return groups


def as_list(value):
    if value is None:
        return []
    return value if isinstance(value, list) else [value]


def read_doc(path):
    meta, body = parse_frontmatter(path.read_text(encoding="utf-8"))
    return meta, split_langs(body)


def rel(path):
    return str(path.relative_to(ROOT))


# ────────────────────────────── 수집 ──────────────────────────────

def collect_projects(root):
    projects = []
    for path in sorted((root / "projects").glob("*.md")):
        meta, body = read_doc(path)
        projects.append({
            "id": meta.get("id", path.stem),
            "path": rel(path),
            "title": i18n_field(meta, "title", path.stem),
            "summary": i18n_field(meta, "summary"),
            "period": i18n_field(meta, "period"),
            "status": meta.get("status", "active"),
            "tags": as_list(meta.get("tags")),
            "links": parse_links(meta.get("links")),
            "showcase": bool(meta.get("showcase", False)),
            # 프로젝트 전용 페이지가 있으면 포폴 카드가 상세 대신 그쪽으로 간다.
            "page": meta.get("page", ""),
            # 포폴 카드에 띄울 앱 아이콘 (없으면 카드에 아이콘을 안 그린다).
            "icon": meta.get("icon", ""),
            "order": meta.get("order", 999),
            "body": body,
        })
    projects.sort(key=lambda p: (p["order"], p["id"]))
    return projects


def collect_journal(root, visibility_default="public"):
    entries = []
    journal_dir = root / "journal"
    if not journal_dir.exists():
        return entries

    for path in sorted(journal_dir.rglob("*.md")):
        meta, body = read_doc(path)
        entry_date = str(meta.get("date", ""))
        if not entry_date:
            print(f"  ! date 없음, 건너뜀: {rel(path)}", file=sys.stderr)
            continue
        entries.append({
            "id": path.stem,
            "path": rel(path),
            "date": entry_date,
            "project": meta.get("project", ""),
            "title": i18n_field(meta, "title", path.stem),
            # 없으면 목록에서 본문 첫 줄로 자동 요약한다 (js/content.js).
            "summary": i18n_field(meta, "summary"),
            "tags": as_list(meta.get("tags")),
            "links": parse_links(meta.get("links")),
            "visibility": meta.get("visibility", visibility_default),
            "body": body,
        })
    entries.sort(key=lambda e: (e["date"], e["id"]), reverse=True)
    return entries


def collect_resume(root):
    def section(name):
        items = []
        section_dir = root / "resume" / name
        if not section_dir.exists():
            return items
        for path in sorted(section_dir.glob("*.md")):
            meta, body = read_doc(path)
            items.append({
                "id": path.stem,
                "path": rel(path),
                "period": i18n_field(meta, "period"),
                "title": i18n_field(meta, "title", path.stem),
                "org": i18n_field(meta, "org"),
                "order": meta.get("order", 999),
                "body": body,
            })
        items.sort(key=lambda i: (i["order"], i["id"]))
        return items

    skills_path = root / "resume" / "skills.md"
    skills, resume_links = [], []
    if skills_path.exists():
        meta, _ = read_doc(skills_path)
        skills = parse_groups(meta.get("groups"))
        resume_links = parse_links(meta.get("links"))

    return {
        "experience": section("experience"),
        "education": section("education"),
        "skills": skills,
        "links": resume_links,
    }


# ────────────────────────────── 빌드 ──────────────────────────────

def build(include_private):
    """공개 콘텐츠를 기준으로, 필요하면 content-private/ 를 덧붙인다."""
    projects = collect_projects(PUBLIC_DIR)
    journal = collect_journal(PUBLIC_DIR)
    resume = collect_resume(PUBLIC_DIR)

    if include_private and PRIVATE_DIR.exists():
        projects += collect_projects(PRIVATE_DIR) if (PRIVATE_DIR / "projects").exists() else []
        journal += collect_journal(PRIVATE_DIR, visibility_default="private")
        journal.sort(key=lambda e: (e["date"], e["id"]), reverse=True)
    else:
        # 공개 디렉터리에 있더라도 visibility: private 인 항목은 게시하지 않는다.
        journal = [e for e in journal if e.get("visibility") != "private"]
        projects = [p for p in projects if p.get("status") != "private"]

    return {
        "generated": date.today().isoformat(),
        "includesPrivate": bool(include_private),
        "projects": projects,
        "journal": journal,
        "resume": resume,
    }


def write(bundle, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"  {rel(path)}  (프로젝트 {len(bundle['projects'])} · 일지 {len(bundle['journal'])})")


def main():
    if not PUBLIC_DIR.exists():
        print(f"content/ 디렉터리가 없습니다: {PUBLIC_DIR}", file=sys.stderr)
        return 1

    print("index 생성:")
    write(build(include_private=False), PUBLIC_DIR / "index.json")

    if PRIVATE_DIR.exists():
        write(build(include_private=True), PRIVATE_DIR / "index.json")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
