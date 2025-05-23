//stackpress
import type { UnknownNest } from '@stackpress/ingest/types';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model.js';
//sql
import type { DatabasePlugin } from '../types.js';
//actions
import batch from '../actions/batch.js';

/**
 * This is a factory function that creates an event 
 * handler for batch upserting records in the database
 * 
 * Usage:
 * emitter.on('profile-batch', batchEventFactory(profile));
 */
export default function batchEventFactory(model: Model) {
  return async function BatchEventAction(
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
    const rows = req.data<UnknownNest[]>('rows');
    const response = await batch(model, engine, rows);
    res.fromStatusResponse(response);
  };
};