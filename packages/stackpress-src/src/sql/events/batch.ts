//stackpress
import type { UnknownNest } from '@stackpress/ingest/dist/types';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { DatabasePlugin } from '@/types';
//schema
import type Model from '@/schema/spec/Model';
//local
import batch from '../actions/batch';

/**
 * This is a factory function that creates an event 
 * handler for batch upserting records in the database
 * 
 * Usage:
 * emitter.on('profile-batch', batchEventFactory(profile));
 */
export default function batchEventFactory(model: Model) {
  return async function BatchEventAction(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the database engine
    const engine = req.context.plugin<DatabasePlugin>('database');
    if (!engine) return;
    const rows = req.data<UnknownNest[]>('rows');
    const response = await batch(model, engine, rows);
    res.fromStatusResponse(response);
  };
};