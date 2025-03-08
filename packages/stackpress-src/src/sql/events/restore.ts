//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { DatabasePlugin } from '@/types';
//schema
import type Model from '@/schema/spec/Model';
//local
import restore from '../actions/restore';

/**
 * This is a factory function that creates an event 
 * handler for restoring a record in the database
 * 
 * Usage:
 * emitter.on('profile-restore', restoreEventFactory(profile));
 */
export default function restoreEventFactory(model: Model) {
  return async function RestoreEventAction(req: ServerRequest, res: Response) {
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
    const response = await restore(model, engine, ids);
    res.fromStatusResponse(response);
  };
};