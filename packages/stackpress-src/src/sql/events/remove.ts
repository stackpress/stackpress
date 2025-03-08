//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { DatabasePlugin } from '@/types';
//schema
import type Model from '@/schema/spec/Model';
//local
import remove from '../actions/remove';

/**
 * This is a factory function that creates an event 
 * handler for removing a record from the database
 * 
 * Usage:
 * emitter.on('profile-remove', removeEventFactory(profile));
 */
export default function removeEventFactory(model: Model) {
  return async function RemoveEventAction(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the database engine
    const engine = req.context.plugin<DatabasePlugin>('database');
    if (!engine) return;

    const ids = Object.fromEntries(model.ids
      .map(column => [ column.name, req.data(column.name) ])
      .filter(entry => Boolean(entry[1]))
    ) as Record<string, string | number>;
    const response = await remove(model, engine, ids);
    res.fromStatusResponse(response);
  };
};