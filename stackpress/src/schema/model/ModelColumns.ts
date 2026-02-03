//modules
import type { 
  DataMapFilter, 
  DataMapIterator 
} from '@stackpress/lib/types';
import type DataMap from '@stackpress/lib/Map';
import { isObject } from '@stackpress/lib/Nest';
//stackpress/schema
import type { 
  ColumnToken,
  ColumnTypeToken,
  AttributesToken
} from '../types.js';
//stackpress/schema/column
import type Column from '../column/Column.js';
import Columns from '../column/Columns.js';
import ColumnType from '../column/ColumnType.js';
//stackpress/schema/attribute
import Attribute from '../attribute/Attribute.js';
import Attributes from '../attribute/Attributes.js';
//stackpress/schema/model
import type Model from './Model.js';
import ModelColumn from './ModelColumn.js';

export default class ModelColumns extends Columns {
  /**
   * Returns Columns from serialized tokens
   */
  public static make(
    tokens?: Array<ColumnToken>,
    parent?: Model
  ) {
    const columns: Array<ModelColumn> = [];
    //if columns is an array
    if (Array.isArray(tokens)) {
      const entries = tokens.map(column => ModelColumn.make(
        column.name, 
        column.type, 
        column.attributes
      ));
      columns.push(...entries)
    }
    return new ModelColumns(columns, parent);
  }

  /**
   * Returns the parent fieldset
   */
  public get parent() {
    return super.parent as Model;
  }
  
  /**
   * Sets the parent fieldset
   */
  public set parent(parent: Model) {
    super.parent = parent;
  }

  /**
   * Allow construction from entries or record
   */
  public constructor(columns?: Array<ModelColumn>, parent?: Model) {
    //if columns is an array
    super(columns, parent);
  }

  /**
   * Adds a column to the collection
   */
  public add(column: ModelColumn): this;
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
    name: ModelColumn | string, 
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
      : name instanceof ModelColumn
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
      const column = name instanceof ModelColumn
        ? name 
        : new ModelColumn(columnName, columnType, columnAttributes);
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
   * Returns an iterator of the entries
   */
  public entries() {
    return super.entries() as MapIterator<[ string, ModelColumn ]>;
  }

  /**
   * Filters the data map (returns a new Columns instance)
   * Override to match constructor arguments and add parent assignment
   */
  public filter(callback: DataMapFilter<string, ModelColumn, this>) {
    const iterator = this.entries() as MapIterator<[ string, ModelColumn ]>;
    const entries = Array.from(iterator).filter(
      entry => callback(entry[1], entry[0], this)
    );
    const constructor = this.constructor as new(
      map: Array<ModelColumn>, 
      parent?: Model
    ) => this;
    return new constructor(
      entries.map(entry => entry[1]), 
      this.hasParent ? this.parent : undefined
    );
  }

   /**
   * Finds the first entry that matches the callback
   */
  public find(callback: DataMapFilter<string, ModelColumn, this>) {
    const iterator = this.entries() as MapIterator<[ string, ModelColumn ]>;
    for (const [ key, value ] of iterator) {
      if (callback(value, key, this)) {
        return [ key, value ] as [ string, ModelColumn ];
      }
    }
    return undefined;
  }

  /**
   * Finds the first key that matches the callback
   */
  public findKey(callback: DataMapFilter<string, ModelColumn, this>) {
    const entry = this.find(callback);
    return Array.isArray(entry) ? entry[0] : undefined;
  }

  /**
   * Finds the first value that matches the callback
   */
  public findValue(callback: DataMapFilter<string, ModelColumn, this>) {
    const entry = this.find(callback);
    return Array.isArray(entry) ? entry[1] : undefined;
  }

  /**
   * Returns a specified element from the Map object. If the value that 
   * is associated to the provided key is an object, then you will get 
   * a reference to that object and any change made to that object will 
   * effectively modify it inside the Map.
   */
  public get(name: string) {
    return super.get(name) as ModelColumn | undefined;
  }

  /**
   * Maps the data map values to a new data map
   */
  public map<T>(callback: DataMapIterator<string, ModelColumn, this, T>) {
    const constructor = this.constructor as new() => DataMap<string, T>;
    const map = new constructor();
    const iterator = this.entries() as MapIterator<[ string, ModelColumn ]>;
    for (const entry of iterator) {
      map.set(entry[0], callback(entry[1], entry[0], this));
    }
    return map;
  }

  /**
   * Iterates through each column in the collection
   */
  public forEach(callback: DataMapIterator<string, ModelColumn, this, void>) {
    super.forEach(callback as (
      value: Column, 
      key: string, 
      map: Map<string, Column>
    ) => void);
  }

  /**
   * Returns the data map as an array
   */
  public toArray() {
    return Array.from(this.values()) as Array<ModelColumn>;
  }

  /**
   * Returns the data map as a plain object
   */
  public toObject() {
    return Object.fromEntries(this) as Record<string, ModelColumn>;
  }

  /**
   * Returns an iterator of the values
   */
  public values() {
    return super.values() as MapIterator<ModelColumn>;
  }
};