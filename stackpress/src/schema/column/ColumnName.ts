//stackpress/schema
import { 
  capitalize, 
  camelize, 
  dasherize,
  snakerize 
} from '../helpers.js';
//stackpress/schema/column
import type Column from './Column.js';

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
    return this._column.attributes.value<string>('label');
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
   * Sets the name of the column
   */
  constructor(name: string, column: Column) {
    this._name = name;
    this._column = column;
  }

  /**
   * Converts name to string
   */
  public toString() {
    return this._name;
  }
};