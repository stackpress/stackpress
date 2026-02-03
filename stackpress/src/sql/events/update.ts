//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/model/Model.js';
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
    const input = model.runtime.inputValues(req.data(), false);
    const ids = model.store.ids
      .map(column => req.data<string | number>(column.name.toString()))
      .filter(value => typeof value !== 'undefined' && value !== null)
      .toObject();
    //get the database seed (for encrypting)
    const seed = ctx.config.path<string|undefined>('database.seed');
    const response = await update(model, engine, ids, input, seed);
    res.fromStatusResponse(response);
  };
};