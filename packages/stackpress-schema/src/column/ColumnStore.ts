//stackpress-schema
import type { ColumnRelationProps } from '../types.js';
import type Column from '../Column.js';

export default class ColumnStore {
  //column reference
  protected _column: Column;

  /**
   * Returns true if this column is an @active column
   */
  public get active() {
    return this._column.attributes.enabled('active');
  }

  /**
   * Returns true if column is @filterable
   */
  public get filterable() {
    return Boolean(this._column.component.filterField);
  }

  /**
   * Collects the foreign relationship of this column
   * if this column looks like this:
   * owner User @relation({ name "connections" local "userId" foreign "id" })
   */
  public get foreignRelationship() {
    //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
    const relation = this.relation;
    //get the model based on this column type
    // foreign (parent) model
    const foreignModel = this._column.type.model;
    //if no relation data or this column type is not a model
    if (!relation || !foreignModel) {
      return null;
    }
    //find the column of foreign model where the type is this model
    //ie. users User[]
    //or. connections User[]
    const foreignColumn = foreignModel.columns.findValue(
      //ie. users User[]
      column => column.type.name === this._column.parent.name.toString()
        //...and if the local column has a relation name
        //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
        //to. connections User[]
        && (!relation.name || relation.name === column.name.toString())
    );
    //if no columns are found
    if (!foreignColumn) {
      //then it's not a valid relation
      return null;
    }
    //get the local model (the parent of this column)
    // local (child) model
    const localModel = this._column.parent;
    //user User @relation(local "userId" foreign: "id")
    //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
    const localColumn = this._column;
    //get the foreign (parent) and local (child) keys
    //ie. @relation(local "userId" foreign: "id")
    // (These are still Columns...)
    const foreignKey = foreignModel.columns.get(relation.foreign)!;
    const localKey = localModel.columns.get(relation.local)!;
    if (!foreignKey || !localKey) {
      return null;
    }
    //get the parent and child relation types
    //ie. user User
    //ie. user User?
    //ie. users User[]
    const foreignRelationType = foreignColumn.type.multiple ? 2 
      : foreignColumn.type.required ? 1 
      : 0;
    //ie. user User @relation(local "userId" foreign: "id")
    const localRelationType = localColumn.type.multiple ? 2 
      : localColumn.type.required ? 1 
      : 0;

    return { 
      //ie. users User[]
      foreign: { 
        //User
        model: foreignModel, 
        //user User[]
        column: foreignColumn, 
        //id
        key: foreignKey, 
        //2
        type: foreignRelationType
      }, 
      //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
      local: { 
        //File
        model: localModel, 
        //owner User @relation(...)
        column: localColumn, 
        //profileId
        key: localKey, 
        //1
        type: localRelationType
      } 
    };
  }

  /**
   * Returns true if column is an @id
   */
  public get id() {
    return this._column.attributes.enabled('id');
  }

  /**
   * Returns true if column is @filterable, @searchable, or @sortable
   */
  public get indexable() {
    return this.searchable 
      || this.filterable
      || this.spannable
      || this.sortable;
  }

  /**
   * Collects the local relationship of this column
   * if this column looks like this:
   * - users User
   * - users User?
   * - users User[]
   */
  public get localRelationship() {
    //get foreign model
    //example: user User[]
    const model = this._column.type.model;
    //if no model is found
    if (!model) {
      return null;
    }
    //get the foreign model's relational column
    const foreignColumn = model.columns.findValue(
      //example: user User[] === user User @relation(...)
      column => {
        //ie. connections User[]
        //to. owner User @relation({ name "connections" local "userId" foreign "id" })
        const withName = !column.store.relation 
          || !column.store.relation.name 
          || column.store.relation.name === this._column.name.toString();
        return column.type.name === this._column.parent.name.toString()
          //...and if the foreign column has a relation name
          && withName
      }
    );
    return foreignColumn?.store.foreignRelationship || null;
  }

  /**
   * Returns relation information
   */
  public get relation() {
    //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
    return this._column.attributes.value<ColumnRelationProps>('relation');
  }

  /**
   * Returns true if column is @searchable
   */
  public get searchable() {
    return this._column.attributes.enabled('searchable');
  }

  /**
   * Returns true if column is @sortable
   */
  public get sortable() {
    return this._column.attributes.enabled('sortable');
  }

  /**
   * Returns true if column is @spannable
   */
  public get spannable() {
    return Boolean(this._column.component.spanField);
  }

  /**
   * Returns true if there is an @timestamp column
   */
  public get timestamp() {
    return this._column.attributes.enabled('timestamp');
  }

  /**
   * Returns true if column is @unique
   */
  public get unique() {
    return this._column.attributes.enabled('unique');
  }

  /**
   * Sets the column reference
   */
  public constructor(column: Column) {
    this._column = column;
  }
};