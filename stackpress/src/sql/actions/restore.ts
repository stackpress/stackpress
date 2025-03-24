//stackpress
import type { UnknownNest, StatusResponse } from '@stackpress/lib/dist/types';
import type Engine from '@stackpress/inquire/dist/Engine';
//schema
import type Model from '../../schema/spec/Model';
//local
import detail from './detail';
import update from './update';

/**
 * Restores a database table row
 */
export default async function restore<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  ids: Record<string, string|number>
): Promise<StatusResponse<M|null>> {
  //action and return response
  const active = model.active?.snake;
  if (active) {
    return await update<M>(model, engine, ids, { [active]: true });
  }
  
  return await detail<M>(model, engine, ids);
};