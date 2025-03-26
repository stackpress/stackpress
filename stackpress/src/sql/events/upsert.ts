//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { DatabasePlugin } from '../../types';
//schema
import type Model from '../../schema/spec/Model';
//sql
import upsert from '../actions/upsert';

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
    const input = model.input(req.data());
    const ids = Object.fromEntries(model.ids
      .map(column => [ column.name, req.data(column.name) ])
      .filter(entry => Boolean(entry[1]))
    ) as Record<string, string | number>;
    const response = await upsert(model, engine, { ...input, ...ids });
    res.fromStatusResponse(response);
  };
};