//stackpress-schema
import type Fieldset from '../Fieldset.js';
import { 
  capitalize, 
  camelize, 
  dasherize,
  snakerize 
} from '../helpers.js';

export default class FieldsetName {
  //fieldset reference
  protected _fieldset: Fieldset;
  //raw name
  protected _name: string;

  /**
   * Returns the camel case name
   */
  public get camelCase() {
    return camelize(this._name);
  }

  /**
   * Returns the dash case name
   */
  public get dashCase() {
    return dasherize(this._name);
  }
  
  /**
   * Returns the column @display
   * example: @display("User: {{name}}")
   */
  public get display() {
    return this._fieldset.attributes.value<string>('display') || null;
  }

  /**
   * Returns the column @label
   * example: @icon("user")
   */
  public get icon() {
    return this._fieldset.attributes.value<string>('icon') || null;
  }

  /**
   * Returns the column @labels
   * example: @labels("Some Label" "Some other label")
   */
  public get labels() {
    const attribute = this._fieldset.attributes.findValue(
      attribute => attribute.name === 'labels'
    );
    return attribute ? attribute.args as string[] : [];
  }

  /**
   * Returns the lower cased fieldset name
   */
  public get lowerCase() {
    return this._name.toLowerCase();
  }
  
  /**
   * Returns the @plural name
   */
  public get plural() {
    return this.labels[1] || null;
  }

  /**
   * Returns the @singular name
   */
  public get singular() {
    return this.labels[0] || null;
  }

  /**
   * Returns snake case name
   */
  public get snakeCase() {
    return snakerize(this._name);
  }

  /**
   * Returns title case name
   */
  public get titleCase() {
    return this._name;
  }
  
  /**
   * Returns the underscore fieldset name
   */
  public get underscoreCase() {
    return this.dashCase.replaceAll('-', '_');
  }

  /**
   * Sets the name of the fieldset
   */
  constructor(name: string, fieldset: Fieldset) {
    this._name = capitalize(camelize(name));
    this._fieldset = fieldset;
  }

  /**
   * Way to get (and change) the class naming standards
   * 
   * ie. User, ArticleComment
   */
  public toClassName(pattern = '%s') {
    return pattern.replaceAll('%s', this.titleCase);
  }

  /**
   * Way to get (and change) the component naming standards
   * 
   * ie. UserForm, ArticleCommentList
   */
  public toComponentName(pattern = '%s') {
    return pattern.replaceAll('%s', this.titleCase);
  }
  
  /**
   * Way to get (and change) the event naming standards
   * 
   * ie. article, user-profile
   */
  public toEventName(pattern = '%s') {
    return pattern.replace('%s', this.dashCase);
  }

  /**
   * Way to get (and change) the file path naming standards
   * 
   * ie. /stackpress-client/ArticleComment/
   * ie. /stackpress-client/user/
   */
  public toPathName(pattern = '%s') {
    return pattern.replaceAll('%s', this.toString());
  }
  
  /**
   * Way to get (and change) the method naming standards
   * 
   * ie. nameActions, profileIdActions, getName, getProfileId
   */
  public toPropertyName(pattern = '%s', titleCase = false) {
    if (titleCase) {
      return pattern.replaceAll('%s', this.titleCase);
    }
    return pattern.replaceAll('%s', this.camelCase);
  }

  /**
   * Converts name to string
   */
  public toString() {
    return this._name;
  }

  /**
   * Way to get (and change) the table naming standards
   * 
   * ie. users, article_comments
   */
  public toTableName(pattern = '%s') {
    return pattern.replaceAll('%s', this.snakeCase);
  }

  /**
   * Way to get (and change) the typescript naming standards
   * 
   * ie. UserInput, ArticleCommentExtended
   */
  public toTypeName(pattern = '%s') {
    return pattern.replaceAll('%s', this.titleCase);
  }

  /**
   * Way to get (and change) the URL and parameter naming standards
   * 
   * ie. /article, /user-profile/
   */
  public toURLPath(pattern = '%s') {
    return pattern.replace('%s', this.dashCase);
  }
};