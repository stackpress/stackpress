//stackpress
import Exception from '../../../Exception.js';
//stackpress/schema/spec/attribute
import type Attribute from '../attribute/Attribute.js';
import Attributes from '../attribute/Attributes.js';
//stackpress/schema/spec/fieldset
import type Fieldset from '../fieldset/Fieldset.js';
//stackpress/schema/spec/column
import ColumnAssertion from './ColumnAssertion.js';
import ColumnComponent from './ColumnComponent.js';
import ColumnDocument from './ColumnDocument.js';
import ColumnName from './ColumnName.js';
import ColumnNumber from './ColumnNumber.js';
import ColumnRuntime from './ColumnRuntime.js';
import ColumnType from './ColumnType.js';
import ColumnValue from './ColumnValue.js';

/**
 * ex. name String @is.required @field.text({ type "text" })
 */
export default class Column {
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
  //runtime extension
  public readonly runtime: ColumnRuntime;
  //type of the column (String, Number, Boolean, etc)
  public readonly type: ColumnType;
  //value extension
  public readonly value: ColumnValue;
  //parent fieldset
  protected _parent?: Fieldset;

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
    this.type.schema = parent.schema;
  }

  /**
   * Sets the name and type of the column
   */
  public constructor(
    name: string, 
    type: ColumnType | { name: string, required?: boolean, multiple?: boolean },
    attributes?: Attributes | Iterable<Attribute>
  ) {
    this.name = new ColumnName(name, this);
    if (type instanceof ColumnType) {
      this.type = type;
    } else {
      const { name, required = true, multiple = false } = type;
      this.type = new ColumnType(name, required, multiple);
    }
    this.attributes = attributes instanceof Attributes 
      ? attributes 
      : new Attributes(attributes);
    //create extensions
    this.assertion = new ColumnAssertion(this);
    this.component = new ColumnComponent(this);
    this.document = new ColumnDocument(this);
    this.number = new ColumnNumber(this);
    this.runtime = new ColumnRuntime(this);
    this.value = new ColumnValue(this);
  }

  /**
   * Returns attribute by name
   */
  public attribute(name: string) {
    return this.attributes.get(name);
  }
};