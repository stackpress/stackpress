//stackpress
import type { UnknownNest, NestedObject } from '@stackpress/lib/dist/types';
import type Engine from '@stackpress/inquire/dist/Engine';
//schema
import type Model from '../../schema/spec/Model';
//local
import create from './create';
import detail from './detail';
import update from './update';

/**
 * Updates or inserts into a database table row
 */
export default async function upsert<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  input: NestedObject
) {
  const ids: Record<string, string|number> = {};
  for (const column of model.ids) {
    if (!input[column.name]) {
      return await create<M>(model, engine, input);
    }
    ids[column.name] = input[column.name] as string|number;
  }
  const row = await detail<M>(model, engine, ids);
  if (row.results) {
    return await update<M>(model, engine, ids, input);
  }
  return await create<M>(model, engine, input);
};