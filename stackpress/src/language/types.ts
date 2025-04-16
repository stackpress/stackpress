//stackpress
import type Request from '@stackpress/ingest/Request';
//language
import type SessionLanguage from './Language.js';

export type Language = {
  label: string,
  translations: Record<string, string>
};

export type LanguageMap = Record<string, Language>;

export type LanguageConstructor = {
  get key(): string;
  get locales(): string[];
  set languages(languages: LanguageMap);
  configure(key: string, languages: LanguageMap): LanguageConstructor;
  language(name: string): Language | null;
  load(req: Request, defaults?: string): SessionLanguage;
  new (): SessionLanguage; 
}

//ie. ctx.config<LanguageConfig>('language')
export type LanguageConfig = {
  key: string,
  locale: string,
  languages: LanguageMap
};

//ie. ctx.plugin<LanguagePlugin>('language')
export type LanguagePlugin = LanguageConstructor;