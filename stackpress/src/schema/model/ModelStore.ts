//stackpress/schema
import type Model from '../Model.js';

export default class ModelStore {
  //model reference
  protected _model: Model;

  /**
   * Returns the column that will be used to toggle @active
   */
  public get active() {
    return this._model.columns.findValue(
      column => column.store.active
    );
  }

  /**
   * Returns all the columns with foreign relationships
   * ie. owner User @relation({ name "connections" local "userId" foreign "id" })
   */
  public get foreignRelationships() {
    return this._model.columns.filter(
      column => column.type.model !== null 
        && column.store.foreignRelationship !== null
    );
  }

  /**
   * Returns all the @id columns
   */
  public get ids() {
    return this._model.columns.filter(column => column.store.id);
  }

  /**
   * Returns all columns that are @filterable, @searchable, or @sortable
   */
  public get indexables() {
    return this._model.columns.filter(column => column.store.indexable);
  }

  /**
   * Returns all the columns with local relationships
   * ie. user User[]
   */
  public get localRelationships() {
    return this._model.columns.filter(
      column => column.store.localRelationship !== null
    );
  }
  
  /**
   * Returns the table @query
   * example: @query([ "*" ])
   * example: @query([ "id", "name" ])
   */
  public get query() {
    const attribute = this._model.attributes.findValue(
      attribute => attribute.name === 'query'
    );
    return attribute?.args as string[] || [];
  }

  /**
   * Returns true if the model is restorable
   */
  public get restorable() {
    return Boolean(
      this._model.columns.findValue(column => column.store.active)
    );
  }

  /**
   * Returns all the @searchable columns
   */
  public get searchables() {
    return this._model.columns.filter(column => column.store.searchable);
  }

  /**
   * Returns all the @sortable columns
   */
  public get sortables() {
    return this._model.columns.filter(column => column.store.sortable);
  }

  /**
   * Returns the column that will @timestamp when updated
   */
  public get timestamp() {
    return this._model.columns.findValue(column => column.store.timestamp);
  }

  /**
   * Returns all the @unique columns
   */
  public get uniques() {
    return this._model.columns.filter(column => column.store.unique);
  }

  /**
   * Sets the model reference
   */
  constructor(model: Model) {
    this._model = model;
  }
};