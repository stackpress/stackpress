//stackpress-schema
import type { AttributesToken, ColumnToken } from './types.js';
import type Attribute from './Attribute.js';
import type Schema from './Schema.js';
import Column from './Column.js';
import Fieldset from './Fieldset.js';
import Attributes from './attribute/Attributes.js';
import Columns from './column/Columns.js';
import ModelStore from './model/ModelStore.js';

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
      Columns.make(columns),
      schema
    );
  }
  //store extension
  public readonly store: ModelStore;

  /**
   * Sets the name, attributes, and columns of the fieldset
   */
  public constructor(
    name: string,
    attributes?: Attributes | Array<Attribute>,
    columns?: Columns | Array<Column>,
    schema?: Schema
  ) {
    super(name, attributes, columns, schema);
    //create extensions
    this.store = new ModelStore(this);
  }
};