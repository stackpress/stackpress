//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model.js';
//sql
import type { DatabasePlugin } from '../types.js';
//actions
import detail from '../actions/detail.js';

/**
 * This is a factory function that creates an event 
 * handler for retrieving a record from the database
 * 
 * Usage:
 * emitter.on('profile-detail', detailEventFactory(profile));
 */
export default function detailEventFactory(model: Model) {
  return async function DetailEventAction(
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

    const ids = Object.fromEntries(model.ids
      .map(column => [ column.name, req.data(column.name) ])
      .filter(entry => Boolean(entry[1]))
    ) as Record<string, string | number>;
    const columns = req.data<string[]>('columns');
    const selectors = Array.isArray(columns) && columns.every(
      column => typeof column === 'string'
    ) ? columns : [ '*' ];
    //get the session seed (for decrypting)
    const seed = ctx.config.path<string|undefined>('session.seed');
    const response = await detail(model, engine, ids, selectors, seed);

    if (response.code === 200 && !response.results) {
      response.code = 404;
      response.status = 'Not Found';
    }
    res.fromStatusResponse(response);
  };
};