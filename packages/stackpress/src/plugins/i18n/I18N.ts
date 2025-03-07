//local
import type { Scalar, Languages } from './types';

export default class I18N {
  //the active language
  protected _locale: string = 'en_US';
  //all the languages
  protected _languages: Languages = {};

  /**
   * Returns the active language label
   */
  public get label() {
    return this._languages[this._locale]?.label || this._locale;
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
    return this._languages[this._locale]?.translations || {};
  }

  /**
   * Sets the active language
   */
  public set locale(locale: string) {
    this._locale = locale;
  }

  /**
   * Sets all the languages
   */
  public set languages(languages: Languages) {
    this._languages = languages;
  }

  /**
   * Returns language information given the locale name
   */
  public language(name: string) {
    if (!this._languages[name]) {
      return null;
    }
    return {
      label: this._languages[name].label,
      translations: Object.assign({}, this._languages[name].translations)
    }
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