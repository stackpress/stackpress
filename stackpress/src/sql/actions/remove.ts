//stackpress
import type { UnknownNest, StatusResponse } from '@stackpress/lib/types';
import type Engine from '@stackpress/inquire/Engine';
//schema
import type Model from '../../schema/spec/Model.js';
//sql
import { toErrorResponse } from '../helpers.js';
//local
import detail from './detail.js';
import update from './update.js';

/**
 * Removes a database table row
 */
export default async function remove<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  ids: Record<string, string|number>
): Promise<StatusResponse<M|null>> {
  //action and return response
  const active = model.active?.name;
  if (active) {
    return await update<M>(model, engine, ids, { [active]: false });
  }
  const row = await detail<M>(model, engine, ids);
  if (row.code !== 200) {
    return row;
  }
  const remove = engine.delete(model.snake);
  for (const column of model.ids) {
    remove.where(`${column.snake} = ?`, [ ids[column.name] ]);
  }
  try {
    await remove;
  } catch (e) {
    return toErrorResponse(e as Error) as StatusResponse<M>;
  }
  return row;
};