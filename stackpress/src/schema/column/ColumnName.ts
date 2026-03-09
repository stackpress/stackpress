//stackpress/schema
import type Column from '../Column.js';
import { 
  capitalize, 
  camelize, 
  dasherize,
  snakerize 
} from '../helpers.js';

export default class ColumnName {
  //column reference
  protected _column: Column;
  //raw name
  protected _name: string;

  /**
   * Returns the dashed fieldset name
   */
  public get camelCase() {
    return camelize(this._name);
  }

  /**
   * Returns the dashed fieldset name
   */
  public get dashCase() {
    return dasherize(this._name);
  }
  
  /**
   * Returns the column @label
   * example: @label("Some Label")
   */
  public get label() {
    return this._column.attributes.value<string>('label') 
      || this.toString();
  }

  /**
   * returns snake case name
   */
  public get snakeCase() {
    return snakerize(this._name);
  }

  /**
   * Returns title case name
   */
  public get titleCase() {
    return capitalize(this.camelCase);
  }

  /**
   * Returns the underscore fieldset name
   */
  public get underscoreCase() {
    return this.dashCase.replaceAll('-', '_');
  }

  /**
   * Sets the name of the column
   */
  constructor(name: string, column: Column) {
    this._name = name;
    this._column = column;
  }

  /**
   * Way to get (and change) the class naming standards
   * 
   * ie. Name, ProfileID
   */
  public toClassName(pattern = '%s') {
    return pattern.replaceAll('%s', this.titleCase);
  }

  /**
   * Way to get (and change) the component naming standards
   * 
   * ie. NameFormField, ProfileIdViewFormat
   */
  public toComponentName(pattern = '%s') {
    return pattern.replaceAll('%s', this.titleCase);
  }

  /**
   * Way to get (and change) the file path naming standards
   * 
   * ie. /stackpress-client/ArticleComment/NameFormField.tsx
   */
  public toPathName(pattern = '%s') {
    return pattern.replaceAll('%s', this.titleCase);
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
   * Way to get (and change) the typescript naming standards
   * 
   * ie. name, profileId
   */
  public toTypeName(pattern = '%s') {
    return pattern.replaceAll('%s', this.toString());
  }

  /**
   * Way to get (and change) the URL and parameter naming standards
   * 
   * ie. /name/, /profile_id/, filter[name], filter[profile_id]
   */
  public toURLPath(pattern = '%s') {
    return pattern.replaceAll('%s', this.underscoreCase);
  }
};