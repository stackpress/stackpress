//stackpress/schema
import dictionary from '../dictionary.js';
//stackpress/schema/attribute
import type Attribute from './Attribute.js';

export default class AttributeAssertion {
  //main attribute reference
  protected _attribute: Attribute;

  /**
   * Returns true if this attribute is an assertion
   */
  public get defined() {
    return dictionary.assertions.defined(this._attribute.name);
  }
  
  /**
   * Returns the assertion definition of the attribute
   */
  public get definition() {
    return dictionary.assertions.definition(this._attribute.name);
  }

  /**
   * Sets the attribute reference
   */
  public constructor(attribute: Attribute) {
    this._attribute = attribute;
  }
};