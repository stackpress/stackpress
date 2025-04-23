//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model.js';
//sql
import type { DatabasePlugin } from '../types.js';
//actions
import create from '../actions/create.js';

/**
 * This is a factory function that creates an event 
 * handler for creating a new record in the database
 * 
 * Usage:
 * emitter.on('profile-create', createEventFactory(profile));
 */
export default function createEventFactory(model: Model) {
  return async function CreateEventAction(
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
    //get the database seed (for encrypting)
    const seed = ctx.config.path<string|undefined>('database.seed');
    const response = await create(model, engine, input, seed);
    res.fromStatusResponse(response);
  };
};