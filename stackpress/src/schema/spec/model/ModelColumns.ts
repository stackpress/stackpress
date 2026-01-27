//stackpress
import Exception from '../../../Exception.js';
//stackpress/schema/spec/attribute
import type Attribute from '../attribute/Attribute.js';
import Attributes from '../attribute/Attributes.js';
//stackpress/schema/spec/model
import type Model from './Model.js';
import ModelColumn from './ModelColumn.js';
//stackpress/schema/spec/column
import Columns from '../column/Columns.js';
import ColumnType from '../column/ColumnType.js';

/**
 * Collection of columns
 * Map to discourage duplicates
 */
export default class ModelColumns extends Columns<ModelColumn> {
  /**
   * Returns the parent model
   */
  public get parent() {
    if (!this._parent) {
      throw Exception.for('Columns do not have a parent assigned.');
    }
    return this._parent as Model;
  }
  
  /**
   * Sets the parent model
   */
  public set parent(parent: Model) {
    this._parent = parent;
    for (const column of this.values()) {
      column.parent = parent;
    }
  }

  /**
   * Allow construction from entries or record
   */
  public constructor(columns?: Iterable<ModelColumn>) {
    super(columns);
  }

  /**
   * Adds a column to the collection
   */
  public add(column: ModelColumn): this;
  public add(
    column: string, 
    type: ColumnType, 
    attributes?: Attributes | Iterable<Attribute>
  ): this;
  public add(
    column: string, 
    type: string, 
    required?: boolean,
    multiple?: boolean,
    attributes?: Attributes | Iterable<Attribute>
  ): this;
  public add(
    column: string | ModelColumn, 
    type?: string | ColumnType, 
    required?: boolean | Attributes | Iterable<Attribute>,
    multiple?: boolean,
    attributes?: Attributes | Iterable<Attribute>
  ) {
    //if add(column: Column)
    if (column instanceof ModelColumn) {
      //if there is a parent
      if (this._parent) {
        //make sure column has a matching parent
        column.parent = this._parent;
      }
      //set the column
      this.set(column.name.toString(), column);
    //if add(column: string, type: ColumnType, attributes?)
    } else if (typeof column === 'string' 
      && type instanceof ColumnType
      && (typeof required === 'undefined' 
        || Array.isArray(required) 
        || required instanceof Attributes
      )
    ) {
      //make a new column
      column = new ModelColumn(column, type, required);
      //if there is a parent
      if (this._parent) {
        //make sure column has a matching parent
        column.parent = this._parent;
      }
      //set the column
      this.set(column.name.toString(), column);
    //if add(column: string, type: string, required?, multiple?, attributes?)
    } else if (typeof column === 'string' 
      && typeof type === 'string'
      && (typeof required === 'undefined' || typeof required === 'boolean')
      && (typeof multiple === 'undefined' || typeof multiple === 'boolean')
      && (typeof attributes === 'undefined' 
        || Array.isArray(attributes) 
        || attributes instanceof Attributes
      )
    ) {
      //make a new typemap
      const typemap = new ColumnType(
        type, 
        typeof required !== 'undefined' ? required : true, 
        typeof multiple !== 'undefined' ? multiple : false
      );
      //make a new column
      column = new ModelColumn(column, typemap, attributes);
      //if there is a parent
      if (this._parent) {
        //assign the schema to the typemap
        typemap.schema = this._parent.schema;
        //make sure column has a matching parent
        column.parent = this._parent;
      }
      //set the column
      this.set(column.name.toString(), column);
    }
    return this;
  }
};