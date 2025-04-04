//stackpress
import type { UnknownNest, NestedObject } from '@stackpress/lib/types';
import type Engine from '@stackpress/inquire/Engine';
//schema
import type Model from '../../schema/spec/Model';
//sql
import type { SearchParams } from '../types';
//local
import batch from './batch';
import create from './create';
import detail from './detail';
import get from './get';
import remove from './remove';
import restore from './restore';
import search from './search';
import update from './update';
import upsert from './upsert';

export {
  batch,
  create,
  detail,
  get,
  remove,
  restore,
  search,
  update,
  upsert
};

export class Actions<M extends UnknownNest = UnknownNest> {
  //engine generic
  public readonly engine: Engine;
  //schema model
  public readonly model: Model;
  //seed
  protected _seed?: string;

  /**
   * Sets the model and engine for the actions. 
   */
  constructor(model: Model, engine: Engine, seed?: string) {
    this.engine = engine;
    this.model = model;
    this._seed = seed;
  }

  /**
   * Upserts many rows into the database table
   */
  public async batch(rows: M[]) {
    return batch<M>(this.model, this.engine, rows, this._seed);
  }

  /**
   * Creates a database table row
   */
  public create(input: NestedObject) {
    return create<M>(this.model, this.engine, input, this._seed);
  }

  /**
   * Returns a database table row
   */
  public detail(ids: Record<string, string|number>, columns?: string[]) {
    return detail<M>(this.model, this.engine, ids, columns, this._seed);
  }

  /**
   * Returns a database table row
   */
  public get(key: string, value: string|number, columns?: string[]) {
    return get<M>(this.model, this.engine, key, value, columns, this._seed);
  }

  /**
   * Removes a database table row
   */
  public remove(ids: Record<string, string|number>) {
    return remove<M>(this.model, this.engine, ids);
  }
  
  /**
   * Restores a database table row
   */
  public restore(ids: Record<string, string|number>) {
    return restore<M>(this.model, this.engine, ids);
  }

  /**
   * Searches the database table
   */
  public search(query: SearchParams) {
    return search<M>(this.model, this.engine, query, this._seed);
  }
  
  /**
   * Updates a database table row
   */
  public update(ids: Record<string, string|number>, input: NestedObject) {
    return update<M>(this.model, this.engine, ids, input, this._seed);
  }

  /**
   * Updates or inserts into a database table row
   */
  public upsert(input: NestedObject) {
    return upsert<M>(this.model, this.engine, input, this._seed);
  }
}

export default function actions<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  seed?: string
) {
  return new Actions<M>(model, engine, seed);
}