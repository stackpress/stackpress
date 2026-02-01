//stackpress/schema
import dictionary from '../dictionary.js';
//stackpress/schema/attribute
import type Attribute from './Attribute.js';

export default class AttributeReference {
  //main attribute reference
  protected _attribute: Attribute;

  /**
   * Returns true if the attribute is defined
   */
  public get defined() {
    return dictionary.attributes.defined(this._attribute.name);
  }

  /**
   * Returns the attribute definition
   */
  public get definition() {
    return dictionary.attributes.definition(this._attribute.name);
  }

  /**
   * Returns true if this attribute is for a schema (model, fieldset)
   */
  public get forSchema() {
    return this.kind === 'schema';
  }

  /**
   * Returns true if this attribute is for a column
   */
  public get forColumn() {
    return this.kind === 'column';
  }

  /**
   * Returns true if this attribute is a flag attribute
   */
  public get isFlag() {
    if (this.defined) {
      return Boolean(this.definition!.flag);
    }
    return false;
  }

  /**
   * Returns true if this attribute is a method attribute
   */
  public get isMethod() {
    if (this.defined) {
      return Boolean(this.definition!.method);
    }
    return false;
  }

  /**
   * Returns the kind of the attribute (schema, column, attribute)
   */
  public get kind() {
    return this.defined ? this.definition!.kind : 'attribute';
  }
  
  /**
   * Sets the attribute reference
   */
  public constructor(attribute: Attribute) {
    this._attribute = attribute;
  }
};
