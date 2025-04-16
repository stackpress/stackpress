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
  //url flag (ie. ?locale) used to change the user's locale
  //this is also the name of the cookie used to store the locale
  //defaults to `locale`
  key?: string,
  //default locale
  //defaults to `en_US`
  locale?: string,
  //languages and translations
  languages?: LanguageMap
};

//ie. ctx.plugin<LanguagePlugin>('language')
export type LanguagePlugin = LanguageConstructor;