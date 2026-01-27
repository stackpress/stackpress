//stackpress/schema/spec/attribute
import type Attribute from '../attribute/Attribute.js';
import type Attributes from '../attribute/Attributes.js';
//stackpress/schema/spec/column
import Column from '../column/Column.js';
import ColumnType from '../column/ColumnType.js';
//stackpress/schema/spec/model
import ColumnStore from './ColumnStore.js';

/**
 * Sets the name and type of the column
 */
export default class ModelColumn extends Column {
  //store extension
  public readonly store: ColumnStore;

  public constructor(
    name: string, 
    type: ColumnType | { name: string, required?: boolean, multiple?: boolean },
    attributes?: Attributes | Iterable<Attribute>
  ) {
    super(name, type, attributes);
    this.store = new ColumnStore(this);
  }
}