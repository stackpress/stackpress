//modules
import type { DataMapFilter } from '@stackpress/lib/types';
import { isObject } from '@stackpress/lib/Nest';
import DataMap from '@stackpress/lib/Map';
//stackpress
import Exception from '../../Exception.js';
//stackpress/schema
import type { 
  ColumnToken,
  ColumnTypeToken,
  AttributesToken
} from '../types.js';
import type Fieldset from '../Fieldset.js';
import Attribute from '../Attribute.js';
import Column from '../Column.js';
//stackpress/schema/attribute
import Attributes from '../attribute/Attributes.js';
//stackpress/schema/column
import ColumnType from './ColumnType.js';

/**
 * Collection of columns
 * Map to discourage duplicates
 */
export default class Columns extends DataMap<string, Column> {
  /**
   * Returns Columns from serialized tokens
   */
  public static make(tokens?: Array<ColumnToken>, parent?: Fieldset) {
    const columns: Array<Column> = [];
    //if columns is an array
    if (Array.isArray(tokens)) {
      const entries = tokens.map(column => Column.make(
        column.name, 
        column.type, 
        column.attributes
      ) as Column);
      columns.push(...entries)
    }
    return new Columns(columns, parent);
  }

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
      throw Exception.for('Columns do not have a parent assigned.');
    }
    return this._parent;
  }
  
  /**
   * Sets the parent fieldset
   */
  public set parent(parent: Fieldset) {
    this._parent = parent;
    //assign parent to each column
    for (const column of this.values()) {
      column.parent = parent;
    }
  }

  /**
   * Allow construction from entries or record
   */
  public constructor(columns?: Array<Column>, parent?: Fieldset) {
    //if columns is an array
    super(Array.isArray(columns) 
      //we need to pass it as entries, ie. [ name, Column ][]
      ? columns.map(column => [ column.name.toString(), column ]) 
      : []
    );
    if (parent) {
      this._parent = parent;
      this.forEach(column => (column.parent = parent));
    }
  }

  /**
   * Adds a column to the collection
   */
  public add(column: Column): this;
  public add(
    name: string, 
    type: ColumnType, 
    attributes?: Attributes | Array<Attribute>
  ): this;
  public add(
    name: string, 
    type: ColumnTypeToken,
    attributes?: AttributesToken
  ): this;
  public add(
    name: Column | string, 
    type?: ColumnType | ColumnTypeToken, 
    attributes?: Attributes | Array<Attribute> | AttributesToken
  ) {
    //if Array<Attribute>
    const attributeArray = Array.isArray(attributes) 
      && attributes.every(attribute => attribute instanceof Attribute);
    //if AttributesToken
    const attributesToken = isObject(attributes) || (
      Array.isArray(attributes) && !attributeArray
    );
    //determine column name
    const columnName = typeof name === 'string' 
      //name: string
      ? name 
      //name: Column
      : name.name.toString();
    //determine column type
    const columnType = type instanceof ColumnType 
      //type: ColumnType
      ? type 
      : typeof type !== 'undefined'
      //type: ColumnTypeToken
      ? new ColumnType(type.name, type.required, type.multiple)
      : name instanceof Column
      ? name.type
      : undefined;
    //determine column attributes
    const columnAttributes = attributes instanceof Attributes
      //attributes: Attributes
      ? attributes
      : attributeArray
      //attributes: Array<Attribute>
      ? new Attributes(attributes as Array<Attribute>)
      : attributesToken
      //attributes: AttributesToken
      ? Attributes.make(attributes as AttributesToken)
      //no attributes
      : new Attributes();
    //only proceed if we have a column type
    if (columnType) {
      //now make a new column
      const column = name instanceof Column 
        ? name 
        : new Column(columnName, columnType, columnAttributes);
      //if there is a parent
      if (this._parent) {
        //assign the schema to the typemap
        if (this._parent.hasSchema) {
          columnType.schema = this._parent.schema;
        }
        //make sure column has a matching parent
        column.parent = this._parent;
      }
      //set the column
      this.set(column.name.toString(), column);
    }
    return this;
  }

  /**
   * Filters the data map (returns a new Columns instance)
   * Override to match constructor arguments and add parent assignment
   */
  public filter(callback: DataMapFilter<string, Column, this>) {
    const entries = Array.from(this.entries()).filter(
      entry => callback(entry[1], entry[0], this)
    );
    const constructor = this.constructor as new(
      map: Array<Column>, 
      parent?: Fieldset
    ) => this;
    return new constructor(entries.map(entry => entry[1]), this._parent);
  }
};