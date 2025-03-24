//stackpress
import type { UnknownNest, StatusResponse } from '@stackpress/lib/types';
import type Engine from '@stackpress/inquire/Engine';
//schema
import type Model from '../../schema/spec/Model';
//local
import search from './search';

/**
 * Returns a database table row
 */
export default async function get<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  key: string, 
  value: string|number,
  columns = [ '*' ]
): Promise<StatusResponse<M|null>> {
  const filter: Record<string, string|number|boolean> = { [key]: value };
  if (model.active) {
    filter[model.active.name] = -1;
  }
  const response = await search<M>(model, engine, { columns, filter, take: 1 });
  //@ts-ignore - Property 'results' does not exist on type 'ErrorResponse'.
  if (Array.isArray(response.results)) {
    //@ts-ignore - Property 'results' does not exist on type 'ErrorResponse'.
    response.results = response.results[0] || null;
  }
  return response as unknown as StatusResponse<M>;
};