//stackpress/schema
import { 
  capitalize, 
  camelize, 
  dasherize,
  snakerize 
} from '../helpers.js';
//stackpress/schema/fieldset
import type Fieldset from './Fieldset.js';

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
    return attribute && Array.isArray(attribute.value) 
      ? attribute.value as string[]
      : [];
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
   * Sets the name of the fieldset
   */
  constructor(name: string, fieldset: Fieldset) {
    this._name = capitalize(camelize(name));
    this._fieldset = fieldset;
  }

  /**
   * Converts name to string
   */
  public toString() {
    return this._name;
  }
};