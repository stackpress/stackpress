//stackpress
import type { 
  UnknownNest,
  NestedObject, 
  StatusResponse
} from '@stackpress/lib/types';
import type Engine from '@stackpress/inquire/Engine';
//root
import Exception from '../../Exception.js';
//schema
import type Model from '../../schema/model/Model.js';
//sql
import { toResponse, toErrorResponse } from '../helpers.js';

/**
 * Creates a database table row
 */
export default async function create<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  input: NestedObject,
  seed?: string
): Promise<StatusResponse<Partial<M>>> {
  //collect errors, if any
  const errors = model.runtime.assert(input, true);
  //if there were errors
  if (errors) {
    //return the errors
    return Exception
      .for('Invalid parameters')
      .withCode(400)
      .withErrors(errors as NestedObject<string>)
      .toResponse() as StatusResponse<Partial<M>>;
  }

  const data = { ...model.runtime.defaultValues(), ...input };
  //action and return response
  try {
    const results = await engine
      .insert<Record<string, any>>(model.name.snakeCase)
      .values(model.runtime.serialize(data, seed) as NestedObject<string>)
      .returning('*');
    if (results.length) {
      return toResponse(
        model.runtime.unserialize(results[0], seed)
      ) as StatusResponse<Partial<M>>;
    }
  } catch (e) {
    return toErrorResponse(e as Error) as StatusResponse<Partial<M>>;
  }
  return toResponse(model.runtime.unserialize(data)) as StatusResponse<Partial<M>>;
};