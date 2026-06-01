const THEME_KEY = 'zimbari-theme';

function setThemeAttributes(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
    return;
  }
  document.documentElement.dataset.theme = theme;
}

export function applyTheme(theme = 'system') {
  const nextTheme = ['light', 'dark', 'system'].includes(theme) ? theme : 'system';
  localStorage.setItem(THEME_KEY, nextTheme);
  setThemeAttributes(nextTheme);
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'system';
}

export function initializeTheme() {
  setThemeAttributes(getTheme());
}
