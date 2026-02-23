import { Language, languageConfig } from '@/data/translations';

export function isValidLang(lang: string | undefined): lang is Language {
  return !!lang && lang in languageConfig;
}

export function getLang(param: string | undefined): Language {
  return isValidLang(param) ? param : 'en';
}

export function getFontClass(lang: Language): string {
  const dir = languageConfig[lang].dir;
  if (dir === 'rtl') return 'font-arabic';
  if (lang === 'hi') return 'font-hindi';
  return 'font-latin';
}
