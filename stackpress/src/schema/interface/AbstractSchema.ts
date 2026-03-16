//stackpress/schema
import type { DefinitionInterfaceMap } from '../types.js';

export default abstract class AbstractSchema<
  //the basic type of the records in the store
  T extends Record<string, unknown>,
  //map of columns and schemas
  C extends DefinitionInterfaceMap = DefinitionInterfaceMap
> {
  //map of the columns associated with this schema
  public abstract columns: C;
  //default value map
  public abstract defaults: { [key in keyof C]: C[key]['defaults'] };
  //seed for encryption purposes
  protected _seed: string;

  /**
   * Set encryption seed
   */
  public constructor(seed = '') {
    this._seed = seed;
  }

  /**
   * Removes any keys from the input that are not defined in 
   * the columns map, and populates default values if specified.
   */
  public filter<V extends Record<string, any>>(value: V, populate = false) {
    const filtered = Object.fromEntries(
      Object.entries(value).filter(([key]) => key in this.columns),
    ) as Partial<T>;
    return populate ? this.populate(filtered) : filtered;
  }

  /**
   * Populates the input with default values 
   * for any keys that are not provided.
   */
  public populate<V extends Record<string, any>>(value: V) {
    return { ...this.defaults, ...value } as typeof this.defaults & V;
  }
};