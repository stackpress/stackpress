//stackpress
import Exception from '../../../Exception.js';
import DataMap from '@stackpress/lib/Map';
//stackpress/schema/spec/attribute
import type Attribute from '../attribute/Attribute.js';
import Attributes from '../attribute/Attributes.js';
//stackpress/schema/spec/fieldset
import type Fieldset from '../fieldset/Fieldset.js';
//stackpress/schema/spec/column
import ColumnType from './ColumnType.js';
import Column from './Column.js';

/**
 * Collection of columns
 * Map to discourage duplicates
 */
export default class Columns<C extends Column = Column> extends DataMap<string, C> {
  //parent fieldset
  protected _parent?: Fieldset;
  
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
    for (const column of this.values()) {
      column.parent = parent;
    }
  }

  /**
   * Allow construction from entries or record
   */
  public constructor(columns?: Iterable<C>) {
    super(Array.isArray(columns) 
      ? columns.map(column => [ column.name, column ])
      : typeof columns !== 'undefined'
      ? Object.entries(columns)
      : []
    );
  }

  /**
   * Adds a column to the collection
   */
  public add(column: C): this;
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
    column: string | C, 
    type?: string | ColumnType, 
    required?: boolean | Attributes | Iterable<Attribute>,
    multiple?: boolean,
    attributes?: Attributes | Iterable<Attribute>
  ) {
    //if add(column: Column)
    if (column instanceof Column) {
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
      column = new Column(column, type, required) as C;
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
      column = new Column(column, typemap, attributes) as C;
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