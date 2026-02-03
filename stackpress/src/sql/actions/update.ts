//stackpress
import type { 
  UnknownNest,
  NestedObject, 
  StatusResponse
} from '@stackpress/lib/types';
import type Engine from '@stackpress/inquire/Engine';
//common
import Exception from '../../Exception.js';
//schema
import type Model from '../../schema/model/Model.js';
//sql
import { toErrorResponse } from '../helpers.js';
//local
import detail from './detail.js';

/**
 * Updates a database table row
 */
export default async function update<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  ids: Record<string, string|number>,
  input: NestedObject,
  seed?: string
): Promise<StatusResponse<M>> {
  //collect errors, if any
  const errors = model.runtime.assert(input, false);
  //if there were errors
  if (errors) {
    //return the errors
    return Exception
      .for('Invalid parameters')
      .withCode(400)
      .withErrors(errors as NestedObject<string>)
      .toResponse() as StatusResponse<M>;
  }

  //action and return response
  const update = engine
    .update(model.name.snakeCase)
    .set(model.runtime.serialize(input, seed) as NestedObject<string>);
  for (const column of model.store.ids.values()) {
    const columnName = column.name.toString();
    if (!ids[columnName]) {
      return Exception
        .for('Missing %s', columnName)
        .withCode(400)
        .toResponse()as StatusResponse<M>;
    }
    update.where(`${column.name.snakeCase} = ?`, [ ids[columnName] ]);
  }
  try {
    await update;
  } catch (e) {
    return toErrorResponse(e as Error) as StatusResponse<M>;
  }
  return await detail(
    model, 
    engine, 
    ids, 
    undefined, 
    seed
  ) as StatusResponse<M>;
};