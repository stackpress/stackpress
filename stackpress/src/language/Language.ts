//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
//root
import type { Scalar } from '../types/index.js';
//language
import type { LanguageMap } from './types.js';

export default class Language {
  //the session key to put in the cookie
  protected static _key = 'locale';
  //all the languages
  protected static _languages: LanguageMap = {};

  /**
   * Returns a list of locales
   */
  public static get locales() {
    return Object.keys(this._languages);
  }

  /**
   * Returns a list of locales
   */
  public static get key() {
    return this._key;
  }

  /**
   * Need seed to verify tokens and access for roles 
   */
  public static configure(key: string, languages: LanguageMap) {
    this._key = key;
    this._languages = languages;
    return this;
  }

  /**
   * Returns language information given the locale name
   */
  public static language(name: string) {
    if (!this._languages[name]) {
      return null;
    }
    return {
      label: this._languages[name].label,
      translations: Object.assign({}, this._languages[name].translations)
    }
  }

  /**
   * Returns a new language using the locale from cookies
   */
  public static load(req: Request, defaults = 'en_US') {
    const locale = req.session(this.key) as string;
    const language = new Language();
    language.locale = locale || defaults;
    return language;
  }

  //the active language
  protected _locale: string = 'en_US';
  
  /**
   * Returns the active language label
   */
  public get label() {
    return Language._languages[this._locale]?.label || this._locale;
  }

  /**
   * Returns the active language
   */
  public get locale() {
    return this._locale;
  }

  /**
   * Returns the active language translations
   */
  public get translations() {
    return Language._languages[this._locale]?.translations || {};
  }

  /**
   * Sets the active language
   */
  public set locale(locale: string) {
    this._locale = locale;
  }

  /**
   * Saves the active locale to the session
   */
  public save(res: Response) {
    res.session.set(Language.key, this._locale);
    return this;
  }

  /**
   * Sets locale and updates the cookie sessoin
   */
  public update(locale: string, res: Response) {
    this._locale = locale;
    return this.save(res);
  }

  /**
   * Translates a phrase then replaces %s with variables
   */
  public translate(phrase: string, ...variables: Scalar[]) {
    let translation = this.translations[phrase] || phrase;
    for (let i = 0; i < variables.length; i++) {
      translation = translation.replace('%s', String(variables[i]));
    }
    return translation;
  }
}