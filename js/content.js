/**
 * content.js — Markdown 콘텐츠 로더 / 렌더러
 *
 * 콘텐츠 원본은 content/**\/*.md (frontmatter + 본문).
 * 브라우저는 디렉터리를 읽을 수 없으므로 tools/build_index.py 가 생성한
 * content/index.json 번들을 한 번 받아서 렌더한다.
 *
 * 로컬(localhost)에서는 content-private/index.json 을 먼저 시도해서
 * 비공개 일지까지 포함된 번들을 사용한다. 배포본에는 그 파일이 없다.
 *
 * 사용법:
 *   const idx = await Content.index();
 *   el.innerHTML = Content.markdown(Content.pick(entry.body));
 */
(function (global) {
  'use strict';

  const SAFE_URL = /^(https?:\/\/|mailto:|\/|#|\.\/|\.\.\/)/i;

  /* ────────────────────────── utils ────────────────────────── */

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function safeUrl(url) {
    const u = String(url).trim();
    return SAFE_URL.test(u) ? u : '#';
  }

  function baseUrl() {
    return document.querySelector('meta[name="base-url"]')?.content || '';
  }

  function currentLang() {
    if (typeof global.getCurrentLang === 'function') return global.getCurrentLang();
    return document.documentElement.lang || 'en';
  }

  /**
   * {en: "...", ko: "..."} 형태에서 현재 언어를 고른다.
   * '*' 키는 언어 구분 없이 공통으로 쓰이는 값.
   */
  function pick(obj, lang) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    const l = lang || currentLang();
    return obj[l] || obj['*'] || obj.en || obj.ko || '';
  }

  /* ─────────────────────── markdown 렌더러 ─────────────────────── */

  function renderInline(text) {
    const codes = [];
    // 인라인 코드는 먼저 빼두고 나머지 규칙을 적용한 뒤 되돌린다.
    let s = String(text).replace(/`([^`]+)`/g, (_, c) => {
      codes.push(c);
      return `@@CODE${codes.length - 1}@@`;
    });

    s = escapeHtml(s);

    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,
      (_, alt, src) => `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy">`);

    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, href) => {
      const u = safeUrl(href);
      const ext = /^https?:/i.test(u);
      return `<a href="${u}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${txt}</a>`;
    });

    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

    return s.replace(/@@CODE(\d+)@@/g, (_, i) => `<code>${escapeHtml(codes[i])}</code>`);
  }

  /**
   * 지원 문법: 제목(#~####), 목록(-, 1.), 인용(>), 코드펜스(```),
   * 구분선(---), 강조(**, *), 인라인 코드, 링크, 이미지.
   */
  function markdown(md) {
    // 줄 단위 주석만 제거한다. 인라인으로 쓴 주석은 본문 예시일 수 있으므로 남긴다.
    const src = String(md || '')
      .replace(/\r\n/g, '\n')
      .replace(/^[ \t]*<!--[\s\S]*?-->[ \t]*$/gm, '');
    const lines = src.split('\n');
    const out = [];

    let para = [], list = null, quote = [], fence = null, fenceLang = '';

    const flushPara = () => {
      if (para.length) { out.push(`<p>${para.map(renderInline).join('<br>')}</p>`); para = []; }
    };
    const flushList = () => {
      if (list) {
        out.push(`<${list.tag}>${list.items.map(i => `<li>${renderInline(i)}</li>`).join('')}</${list.tag}>`);
        list = null;
      }
    };
    const flushQuote = () => {
      if (quote.length) { out.push(`<blockquote>${quote.map(renderInline).join('<br>')}</blockquote>`); quote = []; }
    };
    const flushAll = () => { flushPara(); flushList(); flushQuote(); };

    for (const line of lines) {
      const fenceMark = /^```(\w*)\s*$/.exec(line);

      if (fence !== null) {
        if (fenceMark) {
          const cls = fenceLang ? ` class="lang-${fenceLang}"` : '';
          out.push(`<pre><code${cls}>${escapeHtml(fence.join('\n'))}</code></pre>`);
          fence = null;
        } else {
          fence.push(line);
        }
        continue;
      }

      if (fenceMark) { flushAll(); fence = []; fenceLang = fenceMark[1]; continue; }
      if (!line.trim()) { flushAll(); continue; }

      const heading = /^(#{1,4})\s+(.*)$/.exec(line);
      if (heading) {
        flushAll();
        const level = heading[1].length + 1; // 페이지 h1 이 이미 있으므로 h2 부터
        out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
        continue;
      }

      if (/^(---|\*\*\*|___)\s*$/.test(line)) { flushAll(); out.push('<hr class="divider">'); continue; }

      const blockquote = /^>\s?(.*)$/.exec(line);
      if (blockquote) { flushPara(); flushList(); quote.push(blockquote[1]); continue; }

      const ul = /^\s*[-*]\s+(.*)$/.exec(line);
      if (ul) {
        flushPara(); flushQuote();
        if (!list || list.tag !== 'ul') { flushList(); list = { tag: 'ul', items: [] }; }
        list.items.push(ul[1]);
        continue;
      }

      const ol = /^\s*\d+\.\s+(.*)$/.exec(line);
      if (ol) {
        flushPara(); flushQuote();
        if (!list || list.tag !== 'ol') { flushList(); list = { tag: 'ol', items: [] }; }
        list.items.push(ol[1]);
        continue;
      }

      flushList(); flushQuote();
      para.push(line);
    }

    if (fence !== null) out.push(`<pre><code>${escapeHtml(fence.join('\n'))}</code></pre>`);
    flushAll();

    return out.join('\n');
  }

  /* ──────────────────────── index 로더 ──────────────────────── */

  const EMPTY = { projects: [], journal: [], resume: { experience: [], education: [], skills: [] } };

  let indexPromise = null;

  function isLocal() {
    return ['localhost', '127.0.0.1', '::1', ''].includes(location.hostname);
  }

  async function fetchJson(path) {
    try {
      const res = await fetch(baseUrl() + path, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function index() {
    if (!indexPromise) {
      indexPromise = (async () => {
        // 비공개 번들은 로컬에서만 시도 (배포본에는 존재하지 않음)
        if (isLocal()) {
          const priv = await fetchJson('/content-private/index.json');
          if (priv) return Object.assign({}, EMPTY, priv, { _private: true });
        }
        const pub = await fetchJson('/content/index.json');
        if (pub) return Object.assign({}, EMPTY, pub, { _private: false });
        console.warn('[content] index.json 을 찾을 수 없습니다. `python3 tools/build_index.py` 를 실행하세요.');
        return Object.assign({}, EMPTY, { _private: false });
      })();
    }
    return indexPromise;
  }

  /* ───────────────────────── 헬퍼 ───────────────────────── */

  function projectMap(idx) {
    const map = {};
    (idx.projects || []).forEach(p => { map[p.id] = p; });
    return map;
  }

  function journalFor(idx, projectId) {
    return (idx.journal || []).filter(e => !projectId || e.project === projectId);
  }

  /** "2026-08-16" → "2026.08.16" */
  function formatDate(iso) {
    return String(iso || '').replace(/-/g, '.');
  }

  /** "2026-08-16" → "2026-08" */
  function monthOf(iso) {
    return String(iso || '').slice(0, 7);
  }

  function renderLinks(links) {
    if (!links || !links.length) return '';
    return links.map(l => {
      const url = safeUrl(l.url);
      const ext = /^https?:/i.test(url);
      const arrow = ext ? ' ↗' : '';
      return `<a href="${url}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(l.label)}${arrow}</a>`;
    }).join('');
  }

  function renderTags(tags) {
    if (!tags || !tags.length) return '';
    return `<div class="skill-tags">${tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>`;
  }

  global.Content = {
    index, pick, markdown, escapeHtml, safeUrl,
    projectMap, journalFor, formatDate, monthOf,
    renderLinks, renderTags, currentLang
  };
})(window);
