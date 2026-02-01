//stackpress/schema
import type { AttributesToken, ColumnTypeToken } from '../types.js';
//stackpress/schema/attribute
import Attribute from '../attribute/Attribute.js';
import Attributes from '../attribute/Attributes.js';
//stackpress/schema/column
import Column from '../column/Column.js';
import ColumnType from '../column/ColumnType.js';
//stackpress/schema/model
import type Model from './Model.js';
import ColumnStore from './ColumnStore.js';

/**
 * Sets the name and type of the column
 */
export default class ModelColumn extends Column {
  /**
   * Returns Column from serialized tokens
   */
  public static make(
    name: string, 
    type: ColumnTypeToken,
    attributes?: Array<Attribute> | AttributesToken,
    parent?: Model
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

    return new ModelColumn(name, columnType, columnAttributes, parent);
  }

  //store extension
  public readonly store: ColumnStore;

  public constructor(
    name: string, 
    type: ColumnType,
    attributes?: Attributes,
    parent?: Model
  ) {
    super(name, type, attributes, parent);
    this.store = new ColumnStore(this);
  }
};