//modules
import type { Data } from '@stackpress/idea-parser';
//stackpress
import Exception from '../Exception.js';
//stackpress/schema
import type { AttributesToken, ColumnTypeToken } from './types.js';
import type Fieldset from './Fieldset.js';
import Attribute from './Attribute.js';
//stackpress/schema/attribute
import Attributes from './attribute/Attributes.js';
//stackpress/schema/column
import ColumnAssertion from './column/ColumnAssertion.js';
import ColumnComponent from './column/ColumnComponent.js';
import ColumnDocument from './column/ColumnDocument.js';
import ColumnName from './column/ColumnName.js';
import ColumnNumber from './column/ColumnNumber.js';
import ColumnStore from './column/ColumnStore.js';
import ColumnType from './column/ColumnType.js';
import ColumnValue from './column/ColumnValue.js';

/**
 * ex. name String @is.ne @field.text({ type "text" })
 */
export default class Column {
  /**
   * Returns Column from serialized tokens
   */
  public static make(
    name: string, 
    type: ColumnTypeToken,
    attributes?: Array<Attribute> | AttributesToken,
    parent?: Fieldset
  ) {
    const { name: typeName, required = true, multiple = false } = type;
    const columnType = new ColumnType(typeName, required, multiple);
    const isAttributes = Array.isArray(attributes) && attributes.every(
      attr => attr instanceof Attribute
    );
    const columnAttributes = isAttributes
      ? new Attributes(attributes)
      //has to be serialized tokens
      : Attributes.make(attributes);

    return new Column(name, columnType, columnAttributes, parent);
  }

  //assertion extension
  public readonly assertion: ColumnAssertion;
  //column attributes
  public readonly attributes: Attributes;
  //component extension
  public readonly component: ColumnComponent;
  //document extension
  public readonly document: ColumnDocument;
  //name of the column
  public readonly name: ColumnName;
  //number extension
  public readonly number: ColumnNumber;
  //store extension
  public readonly store: ColumnStore;
  //type of the column (String, Number, Boolean, etc)
  public readonly type: ColumnType;
  //value extension
  public readonly value: ColumnValue;
  //parent fieldset
  protected _parent?: Fieldset;

  /**
   * Checks if column has a parent fieldset
   * (to prevent error to be thrown)
   */
  public get hasParent() {
    return typeof this._parent !== 'undefined';
  }

  /**
   * Returns the parent fieldset
   */
  public get parent() {
    if (!this._parent) {
      throw Exception.for(
        'Column "%s" does not have a parent assigned.',
        this.name
      );
    }
    return this._parent;
  }

  /**
   * Sets the parent fieldset
   */
  public set parent(parent: Fieldset) {
    this._parent = parent;
    if (this._parent.hasSchema) {
      this.type.schema = this._parent.schema;
    }
  }

  /**
   * Sets the name and type of the column
   */
  public constructor(
    name: string, 
    type: ColumnType,
    attributes?: Attributes,
    parent?: Fieldset
  ) {
    this.name = new ColumnName(name, this);
    this.type = type;
    this.attributes = attributes || new Attributes();
    this._parent = parent;
    if (this._parent && this._parent.hasSchema) {
      this.type.schema = this._parent.schema;
    }
    //create extensions
    this.assertion = new ColumnAssertion(this);
    this.component = new ColumnComponent(this);
    this.document = new ColumnDocument(this);
    this.number = new ColumnNumber(this);
    this.store = new ColumnStore(this);
    this.value = new ColumnValue(this);
  }

  /**
   * Adds an attribute to the column 
   */
  public addAttribute(attribute: Attribute): this;
  public addAttribute(name: string, value: Data[] | boolean): this;
  public addAttribute(
    attribute: Attribute | string, 
    value?: Data[] | boolean
  ) {
    const name = attribute instanceof Attribute
      ? attribute.name.toString()
      : attribute;
    attribute = attribute instanceof Attribute
      ? attribute
      : new Attribute(name, value);
    this.attributes.set(name, attribute);
    return this;
  }

  /**
   * Returns attribute by name
   */
  public attribute(name: string) {
    return this.attributes.get(name);
  }
};