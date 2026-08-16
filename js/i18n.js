/**
 * i18n — lightweight language switching
 *
 * Usage in HTML:  <element data-i18n="key">fallback text</element>
 * URL param:      ?lang=ko
 * Storage:        localStorage key "lang"
 *
 * Adding a new language:
 *   1. Add locales/xx.json
 *   2. Add 'xx' to SUPPORTED_LANGS below
 *   3. Add the label to LANG_LABELS below
 */

const SUPPORTED_LANGS = ['en', 'ko'];
const LANG_LABELS = { en: 'EN', ko: 'KO' };
const DEFAULT_LANG = 'en';

let currentLang = DEFAULT_LANG;
let translations = {};

function detectLang() {
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param && SUPPORTED_LANGS.includes(param)) return param;

  const stored = localStorage.getItem('lang');
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

  const browser = (navigator.language || 'en').split('-')[0];
  if (SUPPORTED_LANGS.includes(browser)) return browser;

  return DEFAULT_LANG;
}

async function loadTranslations(lang) {
  const base = document.querySelector('meta[name="base-url"]')?.content || '';
  const res = await fetch(`${base}/locales/${lang}.json`);
  if (!res.ok) throw new Error(`Failed to load ${lang}`);
  return res.json();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = translations[key];
    if (val !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    }
  });

  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.getAttribute('data-i18n-href');
    const val = translations[key];
    if (val !== undefined) el.href = val;
  });

  // 아이콘 버튼처럼 보이는 글자가 없는 요소용 — title 과 aria-label 을 함께 채운다.
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = translations[key];
    if (val !== undefined) {
      el.title = val;
      el.setAttribute('aria-label', val);
    }
  });

  document.documentElement.lang = currentLang;
  updateLangSelector();

  // content.js 로 렌더하는 페이지는 이 이벤트를 받아 다시 그린다.
  document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { lang: currentLang } }));
}

function updateLangSelector() {
  document.querySelectorAll('.lang-option[data-lang]').forEach(btn => {
    const lang = btn.getAttribute('data-lang');
    btn.classList.toggle('active', lang === currentLang);
  });
}

async function switchLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  try {
    translations = await loadTranslations(lang);
    currentLang = lang;
    localStorage.setItem('lang', lang);

    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());

    applyTranslations();
  } catch (e) {
    console.error('i18n error:', e);
  }
}

function t(key) {
  return translations[key] ?? key;
}

// 다른 스크립트(content.js 등)에서 현재 언어를 읽기 위한 접근자
window.getCurrentLang = () => currentLang;

async function initI18n() {
  currentLang = detectLang();
  try {
    translations = await loadTranslations(currentLang);
  } catch {
    if (currentLang !== DEFAULT_LANG) {
      currentLang = DEFAULT_LANG;
      translations = await loadTranslations(DEFAULT_LANG);
    }
  }
  applyTranslations();

  document.querySelectorAll('.lang-option[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => switchLang(btn.dataset.lang));
  });
}

document.addEventListener('DOMContentLoaded', initI18n);
