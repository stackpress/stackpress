//stackpress/schema
import type { 
  AttributesToken, 
  ColumnToken,
  ColumnTypeToken
} from '../types.js';
import type Schema from '../Schema.js';
//stackpress/schema/attribute
import type Attribute from '../attribute/Attribute.js';
import Attributes from '../attribute/Attributes.js';
//stackpress/schema/fieldset
import Fieldset from '../fieldset/Fieldset.js';
//stackpress/schema/model
import ModelColumn from './ModelColumn.js';
import ModelColumns from './ModelColumns.js';
import ModelStore from './ModelStore.js';

export default class Model extends Fieldset {
  /**
   * Returns Fieldset from serialized tokens
   */
  public static make(
    name: string,
    attributes?: AttributesToken,
    columns?: Array<ColumnToken>,
    schema?: Schema
  ) {
    return new Model(
      name,
      Attributes.make(attributes),
      ModelColumns.make(columns),
      schema
    );
  }
  
  //model columns
  public readonly columns: ModelColumns;
  //store extension
  public readonly store: ModelStore;

  /**
   * Sets the name, attributes, and columns of the fieldset
   */
  public constructor(
    name: string,
    attributes?: Attributes | Array<Attribute>,
    columns?: ModelColumns | Array<ModelColumn>,
    schema?: Schema
  ) {
    super(name, attributes, columns, schema);
    this.columns = columns instanceof ModelColumns 
      ? columns
      : new ModelColumns(columns);
    this.columns.parent = this;
    //create extensions
    this.store = new ModelStore(this);
  }

  /**
   * Adds a column to the fieldset
   */
  public addColumn(column: ModelColumn): this;
  public addColumn(
    name: string,
    type: ColumnTypeToken,
    attributes?: AttributesToken
  ): this;
  public addColumn(
    name: ModelColumn | string,
    type?: ColumnTypeToken,
    attributes?: AttributesToken
  ) {
    if (name instanceof ModelColumn) {
      const column = name as ModelColumn;
      column.parent = this;
      this.columns.set(column.name.toString(), column);
    } else if (type) {
      const column = ModelColumn.make(
        name, 
        type, 
        attributes, 
        this
      ) as ModelColumn;
      this.columns.set(column.name.toString(), column);
    }
    return this;
  }

  /**
   * Returns column by name
   */
  public column(name: string, format?: string) {
    return super.column(name, format) as ModelColumn | undefined;
  }
};