//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { DatabasePlugin } from '../../../types';
//schema
import type Model from '../../../schema/spec/Model';
//sql
import create from '../../../sql/actions/create';

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
    const input = model.input(req.data());
    const response = await create(model, engine, input);
    res.fromStatusResponse(response);
  };
};