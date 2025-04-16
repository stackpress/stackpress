//stackpress
import type { UnknownNest, NestedObject } from '@stackpress/lib/types';
import type Engine from '@stackpress/inquire/Engine';
//schema
import type Model from '../../schema/spec/Model.js';
//local
import create from './create.js';
import detail from './detail.js';
import update from './update.js';

/**
 * Updates or inserts into a database table row
 */
export default async function upsert<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  input: NestedObject,
  seed?: string
) {
  const ids: Record<string, string|number> = {};
  for (const column of model.ids) {
    if (!input[column.name]) {
      return await create<M>(model, engine, input, seed);
    }
    ids[column.name] = input[column.name] as string|number;
  }
  const row = await detail<M>(model, engine, ids, undefined, seed);
  if (row.results) {
    return await update<M>(model, engine, ids, input, seed);
  }
  return await create<M>(model, engine, input, seed);
};