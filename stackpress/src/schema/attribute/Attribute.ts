//modules
import type { Data } from '@stackpress/idea-parser';
import DataSet from '@stackpress/lib/Set';
//stackpress/schema/config
import { defineBuiltIn } from '../config/definitions.js';
//stackpress/schema/attribute
import AttributeAssertion from './AttributeAssertion.js';
import AttributeComponent from './AttributeComponent.js';
import AttributeReference from './AttributeReference.js';

export default class Attribute {
  //the name of the attribute
  public readonly name: string;
  //true if the attribute is enabled (for flag attributes)
  public readonly enabled: boolean;
  //assertion extension
  public readonly assertion: AttributeAssertion;
  //component extension
  public readonly component: AttributeComponent;
  //reference extension
  public readonly reference: AttributeReference;
  //the arguments of the attribute (for method attributes)
  protected _args: DataSet<Data>;
  //true if the attribute is a flag attribute
  protected _flag: boolean;

  /**
   * Returns the arguments of the attribute (raw values)
   * if flag, will return []
   */
  public get args() {
    return Array.from(this._args);
  }

  /**
   * Returns true if this attribute is a flag attribute
   */
  public get isFlag() {
    return this.reference.defined 
      ? this.reference.isFlag 
      : this._flag;
  }

  /**
   * Returns true if this attribute is a method attribute
   */
  public get isMethod() {
    return this.reference.defined 
      ? this.reference.isMethod 
      : !this._flag;
  }

  /**
   * Returns the first possible value of the attribute
   */
  public get value() {
    return this.isMethod ? this.args[0] : this.enabled;
  }

  /**
   * Creates a new attribute instance
   */
  public constructor(name: string, args: Data[] | boolean = []) {
    this.name = name.toLowerCase();
    //setup the configuration
    if (typeof args === 'boolean') {
      this.enabled = args;
      this._flag = true;
      this._args = new DataSet();
    } else {
      this.enabled = true;
      this._flag = false;
      this._args = new DataSet(args);
    }
    //create extensions
    this.assertion = new AttributeAssertion(this);
    this.component = new AttributeComponent(this);
    this.reference = new AttributeReference(this);
  }
};

//ninja script to define built-in attributes
defineBuiltIn();