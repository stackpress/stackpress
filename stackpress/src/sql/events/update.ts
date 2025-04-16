//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model.js';
//sql
import type { DatabasePlugin } from '../types.js';
//actions
import update from '../actions/update.js';

/**
 * This is a factory function that creates an event 
 * handler for removing a record from the database
 * 
 * Usage:
 * emitter.on('profile-update', updateEventFactory(profile));
 */
export default function updateEventFactory(model: Model) {
  return async function UpdateEventAction(
    req: Request, 
    res: Response,
    ctx: Server
  ) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the database engine
    const engine = ctx.plugin<DatabasePlugin>('database');
    if (!engine) return;
    //remove values that are not columns
    const input = model.input(req.data(), false);
    const ids = Object.fromEntries(model.ids
      .map(column => [ column.name, req.data(column.name) ])
      .filter(entry => Boolean(entry[1]))
    ) as Record<string, string | number>;
    //get the session seed (for encrypting)
    const seed = ctx.config.path<string|undefined>('session.seed');
    const response = await update(model, engine, ids, input, seed);
    res.fromStatusResponse(response);
  };
};