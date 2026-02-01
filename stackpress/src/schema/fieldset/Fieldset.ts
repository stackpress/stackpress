//modules
import type { Data } from '@stackpress/idea-parser';
//stackpress
import Exception from '../../Exception.js';
//stackpress/schema
import type { 
  AttributesToken, 
  ColumnToken, 
  ColumnTypeToken 
} from '../types.js';
import type Schema from '../Schema.js';
//stackpress/schema/attribute
import Attribute from '../attribute/Attribute.js';
import Attributes from '../attribute/Attributes.js';
//stackpress/schema/column
import Column from '../column/Column.js';
import Columns from '../column/Columns.js';
//stackpress/schema/fieldset
import FieldsetAssertion from './FieldsetAssertion.js';
import FieldsetComponent from './FieldsetComponent.js';
import FieldsetDocument from './FieldsetDocument.js'; 
import FieldsetName from './FieldsetName.js';
import FieldsetRuntime from './FieldsetRuntime.js';
import FieldsetType from './FieldsetType.js';
import FieldsetValue from './FieldsetValue.js';


export default class Fieldset {
  /**
   * Returns Fieldset from serialized tokens
   */
  public static make(
    name: string,
    attributes?: AttributesToken,
    columns?: Array<ColumnToken>,
    schema?: Schema
  ) {
    return new Fieldset(
      name,
      Attributes.make(attributes),
      Columns.make(columns),
      schema
    );
  }

  //assertion extension
  public readonly assertion: FieldsetAssertion;
  //fieldset attributes
  public readonly attributes: Attributes;
  //fieldset columns
  public readonly columns: Columns;
  //component extension
  public readonly component: FieldsetComponent;
  //document extension
  public readonly document: FieldsetDocument;
  //name of the fieldset
  public readonly name: FieldsetName;
  //runtime extension
  public readonly runtime: FieldsetRuntime;
  //type extension
  public readonly type: FieldsetType;
  //value extension
  public readonly value: FieldsetValue;
  //global schema
  protected _schema?: Schema;

  /**
   * Checks if the schema is assigned
   * (to prevent error to be thrown)
   */
  public get hasSchema() {
    return typeof this._schema !== 'undefined';
  }
  
  /**
   * Returns the schema associated with the fieldset
   */
  public get schema() {
    if (!this._schema) {
      throw Exception.for(
        'Fieldset "%s" does not have a schema assigned.', 
        this.name
      );
    }
    return this._schema;
  }

  /**
   * Sets the schema associated with the fieldset
   */
  public set schema(schema: Schema) {
    this._schema = schema;
    //loop through columns and set schema
    this.columns.forEach(column => {
      column.type.schema = schema;
    });
  }

  /**
   * Sets the name, attributes, and columns of the fieldset
   */
  public constructor(
    name: string,
    attributes?: Attributes | Array<Attribute>,
    columns?: Columns | Array<Column>,
    schema?: Schema
  ) {
    this.name = new FieldsetName(name, this);
    this.attributes = attributes instanceof Attributes
      ? attributes
      : new Attributes(attributes);
    if (schema) {
      this._schema = schema;
    }
    this.columns = columns instanceof Columns 
      ? columns
      : new Columns(columns);
    this.columns.parent = this;
    //create extensions
    this.assertion = new FieldsetAssertion(this);
    this.component = new FieldsetComponent(this);
    this.document = new FieldsetDocument(this);
    this.runtime = new FieldsetRuntime(this);
    this.type = new FieldsetType(this);
    this.value = new FieldsetValue(this);
  }

  /**
   * Adds an attribute to the fieldset 
   */
  public addAttribute(attribute: Attribute): this;
  public addAttribute(name: string, value: Data[] | boolean): this;
  public addAttribute(
    attribute: Attribute | string, 
    value?: Data[] | boolean
  ) {
    const name = attribute instanceof Attribute
      ? attribute.name
      : attribute;
    attribute = attribute instanceof Attribute
      ? attribute
      : new Attribute(name, value);
    this.attributes.set(name, attribute);
    return this;
  }

  /**
   * Adds a column to the fieldset
   */
  public addColumn(column: Column): this;
  public addColumn(
    name: string,
    type: ColumnTypeToken,
    attributes?: AttributesToken
  ): this;
  public addColumn(
    name: Column | string,
    type?: ColumnTypeToken,
    attributes?: AttributesToken
  ) {
    if (name instanceof Column) {
      const column = name as Column;
      column.parent = this;
      this.columns.set(column.name.toString(), column);
    } else if (type) {
      const column = Column.make(name, type, attributes, this);
      this.columns.set(column.name.toString(), column);
    }
    return this;
  }


  /**
   * Returns attribute by name
   */
  public attribute(name: string) {
    return this.attributes.get(name);
  }

  /**
   * Returns column by name
   */
  public column(name: string, format?: string) {
    const column = this.columns.findValue(
      column => (format === 'camel' && name === column.name.camelCase)
        || (format === 'dash' && name === column.name.dashCase)
        || (format === 'snake' && name === column.name.snakeCase)
        || (format === 'title' && name === column.name.titleCase)
    );
    return column || this.columns.get(name);
  }
};