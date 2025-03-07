//local
import type Column from './Column';
import Fieldset from './Fieldset';

export default class Model extends Fieldset {
  /**
   * Returns the column that will be used to toggle @active
   */
  public get active() {
    return Array.from(this.columns.values()).find(
      column => column.attributes.active === true
    );
  }

  /**
   * Returns the column that will be stamped when @created
   */
  public get created() {
    return Array.from(this.columns.values()).find(
      column => column.attributes.created === true
    );
  }

  /**
   * Returns all the filter field columns
   */
  public get filters() {
    return Array.from(this.columns.values()).filter(
      column => column.filter.method !== 'none'
    );
  }

  /**
   * Returns all the @id columns
   */
  public get ids() {
    return Array.from(this.columns.values()).filter(
      column => column.id
    );
  }

  /**
   * Returns all columns that are @filterable, @searchable, or @sortable
   */
  public get indexables() {
    return Array.from(this.columns.values()).filter(
      column => column.indexable
    );
  }

  /**
   * Returns all the models with columns related to this model
   */
  public get related(): Column[] {
    //all columns with user User[]
    return Array.from(this.columns.values()).filter(
      column => column.related !== null
    );
  }

  /**
   * Returns all the columns with relations
   */
  public get relations(): Column[] {
    //all columns with @relation(...)
    return Array.from(this.columns.values()).filter(
      column => column.relation !== null
    );
  }

  /**
   * Returns true if the model is restorable
   */
  public get restorable() {
    return Array.from(this.columns.values()).some(
      column => column.attributes.active === true
    );
  }

  /**
   * Returns all the @searchable columns
   */
  public get searchables() {
    return Array.from(this.columns.values()).filter(
      column => column.searchable
    );
  }

  /**
   * Returns all the @sortable columns
   */
  public get sortables() {
    return Array.from(this.columns.values()).filter(
      column => column.sortable
    );
  }

  /**
   * Returns all the span field columns
   */
  public get spans() {
    return Array.from(this.columns.values()).filter(
      column => column.span.method !== 'none'
    );
  }

  /**
   * Returns all the unique columns
   */
  public get uniques() {
    return Array.from(this.columns.values()).filter(
      column => column.unique
    );
  }

  /**
   * Returns the column that will be stamped when @updated
   */
  public get updated() {
    return Array.from(this.columns.values()).find(
      column => column.attributes.updated === true
    );
  }
}