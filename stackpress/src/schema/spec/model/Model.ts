//stackpress/schema/spec/attribute
import type Attributes from '../attribute/Attributes.js';
import type Attribute from '../attribute/Attribute.js';
//stackpress/schema/spec/fieldset
import Fieldset from '../fieldset/Fieldset.js';
//stackpress/schema/spec/model
import ModelColumn from './ModelColumn.js';
import ModelColumns from './ModelColumns.js';
import ModelStore from './ModelStore.js';

export default class Model extends Fieldset {
  //fieldset columns
  public readonly columns: ModelColumns;
  //store extension
  public readonly store: ModelStore;

  /**
   * Sets the name, attributes, and columns of the fieldset
   */
  public constructor(
    name: string,
    attributes?: Attributes | Iterable<Attribute>,
    columns?: ModelColumns | Iterable<ModelColumn>
  ) {
    super(name, attributes);
    this.columns = columns instanceof ModelColumns 
      ? columns 
      : new ModelColumns(columns);
    this.columns.parent = this;
    //create extensions
    this.store = new ModelStore(this);
  }
};