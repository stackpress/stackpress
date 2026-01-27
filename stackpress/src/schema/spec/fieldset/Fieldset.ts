//stackpress
import Exception from '../../../Exception.js';
//stackpress/schema/spec
import type Schema from '../Schema.js';
//stackpress/schema/spec/attribute
import type Attribute from '../attribute/Attribute.js';
import Attributes from '../attribute/Attributes.js';
//stackpress/schema/spec/column
import type Column from '../column/Column.js';
import Columns from '../column/Columns.js';
//stackpress/schema/spec/fieldset
import FieldsetAssertion from './FieldsetAssertion.js';
import FieldsetComponent from './FieldsetComponent.js';
import FieldsetDocument from './FieldsetDocument.js'; 
import FieldsetName from './FieldsetName.js';
import FieldsetRuntime from './FieldsetRuntime.js';
import FieldsetType from './FieldsetType.js';
import FieldsetValue from './FieldsetValue.js';


export default class Fieldset {
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
  }

  /**
   * Sets the name, attributes, and columns of the fieldset
   */
  public constructor(
    name: string,
    attributes?: Attributes | Iterable<Attribute>,
    columns?: Columns | Iterable<Column>
  ) {
    this.name = new FieldsetName(name, this);
    this.attributes = attributes instanceof Attributes
      ? attributes
      : new Attributes(attributes);
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