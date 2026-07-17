export type Language = "en" | "zh";

export const LANGUAGE_STORAGE_KEY = "kz-portfolio-lang";

export function detectInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "en" || stored === "zh") return stored;
  return window.navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function applyLanguage(lang: Language) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
}
