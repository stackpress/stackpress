//stackpress
import type { 
  UnknownNest,
  NestedObject, 
  StatusResponse
} from '@stackpress/lib/types';
import type Engine from '@stackpress/inquire/Engine';
//root
import Exception from '../../Exception';
//schema
import type Model from '../../schema/spec/Model';
//sql
import { toResponse, toErrorResponse } from '../helpers';

/**
 * Creates a database table row
 */
export default async function create<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  input: NestedObject
): Promise<StatusResponse<Partial<M>>> {
  //collect errors, if any
  const errors = model.assert(input, true);
  //if there were errors
  if (errors) {
    //return the errors
    return Exception
      .for('Invalid parameters')
      .withCode(400)
      .withErrors(errors as NestedObject<string>)
      .toResponse() as StatusResponse<Partial<M>>;
  }

  const data = { ...model.defaults, ...input };

  //action and return response
  try {
    const results = await engine
      .insert(model.snake)
      .values(model.serialize(data) as NestedObject<string>)
      .returning('*');
    if (results.length) {
      return toResponse(results[0]) as StatusResponse<Partial<M>>;
    }
  } catch (e) {
    return toErrorResponse(e as Error) as StatusResponse<Partial<M>>;
  }
  return toResponse(data) as StatusResponse<Partial<M>>;
};