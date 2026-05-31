const THEME_KEY = 'zimbari-theme';
const DEFAULT_THEME = 'light';

export function applyTheme(theme = DEFAULT_THEME) {
  const nextTheme = theme === 'dark' ? 'dark' : DEFAULT_THEME;
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(THEME_KEY, nextTheme);
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
}

export function initializeTheme() {
  applyTheme(getTheme());
}
