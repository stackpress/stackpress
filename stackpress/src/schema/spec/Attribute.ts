//modules
import type { AttributeValue } from '@stackpress/idea-parser';
//schema
import type { AttributeConfig } from '../types.js';
import { first, toComponentToken } from '../config/attributes.js';

export default class Attribute {
  /**
   * Creates a new attribute instance
   */
  public static get(name: string, value: AttributeValue) {
    const attribute = first({ name });
    return attribute ? new Attribute(attribute, value) : null;
  }

  //one of the attribute configurations from ../config/attributes
  public readonly config: AttributeConfig;
  //the value of the attribute from the idea schema
  protected _value: AttributeValue;
  
  /**
   * Returns the raw value of the attribute
   */
  public get args() {
    return Array.isArray(this._value) ? [ ...this._value ] : [];
  }

  /**
   * Returns the component attribute configuration
   */
  public get component() {
    return toComponentToken(this.config, this.args);
  }

  /**
   * Returns the description of the attribute
   */
  public get description() {
    return this.config.description;
  }

  /**
   * Returns true if this attribute is enabled
   */
  public get enabled() {
    return this.isFlag && this.value === true;
  }

  /**
   * Returns true if this attribute is designed for a column
   */
  public get forColumn() {
    return this.config.kind !== 'model';
  }
  
  /**
   * Returns true if this attribute is designed for a model
   */
  public get forModel() {
    return this.config.kind === 'model';
  }

  /**
   * Returns true if this attribute is an admin attribute
   */
  public get isAdmin() {
    return this.config.name.startsWith('admin.');
  }

  /**
   * Returns true if this attribute is an assertion attribute
   */
  public get isAssertion() {
    return this.config.kind === 'assert';
  }
  
  /**
   * Returns true if this attribute is a component attribute
   */
  public get isComponent() {
    return this.config.type.includes('component');
  }
  
  /**
   * Returns true if this attribute is a form field attribute
   */
  public get isField() {
    return this.config.kind === 'field';
  }
  
  /**
   * Returns true if this attribute is a filter field attribute
   */
  public get isFilter() {
    return this.config.kind === 'filter';
  }
  
  /**
   * Returns true if this attribute is a flag attribute
   */
  public get isFlag() {
    return this.config.type.includes('flag');
  }
  
  /**
   * Returns true if this attribute is a list attribute
   */
  public get isList() {
    return this.config.kind === 'list';
  }
  
  /**
   * Returns true if this attribute is a method attribute
   */
  public get isMethod() {
    return this.config.type.includes('method')
      || this.config.type.includes('component');
  }
  
  /**
   * Returns true if this attribute is a form field attribute
   */
  public get isSpan() {
    return this.config.kind === 'span';
  }
  
  /**
   * Returns true if this attribute is a model attribute
   */
  public get isView() {
    return this.config.kind === 'view';
  }

  /**
   * Returns the key of the attribute
   */
  public get key() {
    return this.config.key;
  }

  /**
   * Returns the kind of the attribute
   */
  public get kind() {
    return this.config.kind;
  }

  /**
   * Returns the raw value of the attribute
   */
  public get raw() {
    return this._value;
  }

  /**
   * Returns the name of the attribute
   */
  public get name() {
    return this.config.name;
  }

  /**
   * Returns the types of the attribute
   */
  public get types() {
    return this.config.type;
  }

  /**
   * Returns the first value of the attribute
   */
  public get value() {
    if (Array.isArray(this._value)) {
      return this._value[0];
    } else if (typeof this._value === 'boolean') {
      return this._value;
    }
    return undefined;
  }

  /**
   * Sets the attribute configuration and value
   */
  public constructor(config: AttributeConfig, value: AttributeValue) {
    this.config = config;
    this._value = value;
  }
};