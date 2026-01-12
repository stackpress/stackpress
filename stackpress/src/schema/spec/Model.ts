//local
import type Column from './Column.js';
import Fieldset from './Fieldset.js';

export default class Model extends Fieldset {
  /**
   * Returns the column that will be used to toggle @active
   */
  public get active() {
    return Array
      .from(this.columns.values())
      .find(column => column.active);
  }

  /**
   * Returns all the models with columns related to this model
   */
  public get childRelations(): Column[] {
    //all columns with user User[]
    return Array
      .from(this.columns.values())
      .filter(column => column.childRelation !== null);
  }

  /**
   * Returns all the filter field columns
   */
  public get filters() {
    return Array
      .from(this.columns.values())
      .filter(column => Boolean(column.filter));
  }

  /**
   * Returns all the @id columns
   */
  public get ids() {
    return Array
      .from(this.columns.values())
      .filter(column => column.id);
  }

  /**
   * Returns all columns that are @filterable, @searchable, or @sortable
   */
  public get indexables() {
    return Array
      .from(this.columns.values())
      .filter(column => column.indexable);
  }
  
  /**
   * Returns the table @query
   * example: @query([ "*" ])
   * example: @query([ "id", "name" ])
   */
  public get query() {
    const columns = this.args<string>('query') || [ '*' ];
    return columns.length > 0 ? columns : [ '*' ];
  }

  /**
   * Returns all the models with columns related to this model
   */
  public get parentRelations(): Column[] {
    //all columns with user User[]
    return Array
      .from(this.columns.values())
      .filter(column => column.parentRelation !== null);
  }

  /**
   * Returns all the columns with relations
   */
  public get relations(): Column[] {
    //all columns with @relation(...)
    return Array
      .from(this.columns.values())
      .filter(column => column.relation !== null);
  }

  /**
   * Returns true if the model is restorable
   */
  public get restorable() {
    return Array
      .from(this.columns.values())
      .some(column => column.active);
  }

  /**
   * Returns all the @searchable columns
   */
  public get searchables() {
    return Array
      .from(this.columns.values())
      .filter(column => column.searchable);
  }

  /**
   * Returns all the @sortable columns
   */
  public get sortables() {
    return Array
      .from(this.columns.values())
      .filter(column => column.sortable);
  }

  /**
   * Returns all the span field columns
   */
  public get spans() {
    return Array
      .from(this.columns.values())
      .filter(column => Boolean(column.span));
  }

  /**
   * Returns all the unique columns
   */
  public get uniques() {
    return Array
      .from(this.columns.values())
      .filter(column => column.unique);
  }

  /**
   * Returns the column that will be stamped when @updated
   */
  public get updated() {
    return Array
      .from(this.columns.values())
      .find(column => column.updated);
  }
}