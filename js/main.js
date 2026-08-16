/**
 * main.js — misc UI
 */

/**
 * 이 페이지가 어떤 프로젝트에 속하는지.
 *   1. <meta name="content-project" content="on-the-line">
 *   2. /work/project/?id=<id>
 * 둘 다 없으면 빈 문자열.
 */
function pageProjectId() {
  const meta = document.querySelector('meta[name="content-project"]')?.content;
  if (meta) return meta.trim();

  if (location.pathname.startsWith('/work/project/')) {
    return new URLSearchParams(location.search).get('id') || '';
  }

  return '';
}

/** 프로젝트에 속한 페이지에서는 nav 의 히스토리 아이콘이 그 프로젝트로 바로 가게 한다. */
function linkHistoryToProject() {
  const id = pageProjectId();
  if (!id) return;

  document.querySelectorAll('.nav-icon[href^="/work/journal/"]').forEach(link => {
    link.href = `/work/journal/?project=${encodeURIComponent(id)}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  linkHistoryToProject();
});
