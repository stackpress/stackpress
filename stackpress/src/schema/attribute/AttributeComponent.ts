//stackpress/schema
import dictionary from '../dictionary.js';
//stackpress/schema/attribute
import type Attribute from './Attribute.js';

export default class AttributeComponent {
  //main attribute reference
  protected _attribute: Attribute;

  /**
   * Returns true if this attribute is a component
   */
  public get defined() {
    return dictionary.components.defined(this._attribute.name);
  }

  /**
   * Returns the component definition of the attribute
   */
  public get definition() {
    return dictionary.components.definition(this._attribute.name);
  }

  /**
   * Returns the kind of component (field, filter, list, span, view, component)
   */
  public get kind() {
    if (this.defined) {
      const component = dictionary.components.definition(this._attribute.name)!;
      return component.kind;
    }
    return 'component';
  }

  /**
   * Returns true if this attribute is a filter field
   */
  public get isFilterField() {
    return this.kind === 'filter';
  }

  /**
   * Returns true if this attribute is a form field
   */
  public get isFormField() {
    return this.kind === 'field';
  }

  /**
   * Returns true if this attribute is a list format
   */
  public get isListFormat() {
    return this.kind === 'list';
  }

  /**
   * Returns true if this attribute is a record format
   */
  public get isSpanField() {
    return this.kind === 'span';
  }

  /**
   * Returns true if this attribute is a view format
   */
  public get isViewFormat() {
    return this.kind === 'view';
  }
  
  /**
   * Sets the attribute reference
   */
  public constructor(attribute: Attribute) {
    this._attribute = attribute;
  }
};