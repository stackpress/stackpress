//stackpress/schema/spec
import * as dictionary from '../Dictionary.js';
//stackpress/schema/spec/attribute
import type Attribute from './Attribute.js';

export default class AttributeAssertion {
  //main attribute reference
  protected _attribute: Attribute;
  
  /**
   * Returns the assertion definition of the attribute
   */
  public get definition() {
    return dictionary.assertions.definition(this._attribute.name);
  }

  /**
   * Returns true if this attribute is an assertion
   */
  public get defined() {
    return dictionary.assertions.defined(this._attribute.name);
  }

  /**
   * Sets the attribute reference
   */
  public constructor(attribute: Attribute) {
    this._attribute = attribute;
  }
};