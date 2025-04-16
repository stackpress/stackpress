//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model.js';
//sql
import type { DatabasePlugin } from '../types.js';
//actions
import upsert from '../actions/upsert.js';

/**
 * This is a factory function that creates an event 
 * handler for upserting a new or existing record in the database
 * 
 * Usage:
 * emitter.on('profile-upsert', upsertEventFactory(profile));
 */
export default function upsertEventFactory(model: Model) {
  return async function UpsertEventAction(
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
    //get the session seed (for encrypting)
    const seed = ctx.config.path('session.seed', 'abc123');
    const response = await upsert(model, engine, input, seed);
    res.fromStatusResponse(response);
  };
};