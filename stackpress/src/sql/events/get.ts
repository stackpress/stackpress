//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model.js';
//sql
import type { DatabasePlugin } from '../types.js';
//actions
import get from '../actions/get.js';

/**
 * This is a factory function that creates an event 
 * handler for retrieving a record from the database
 * 
 * Usage:
 * emitter.on('profile-get', getEventFactory(profile));
 */
export default function getEventFactory(model: Model) {
  return async function GetEventAction(
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

    //get the value
    const value = req.data('value');
    if (typeof value === 'undefined') return;
    //get the key
    const key = req.data('key');
    //get the columns
    const columns = req.data<string[]>('columns');
    const selectors = Array.isArray(columns) && columns.every(
      column => typeof column === 'string'
    ) ? columns : [ '*' ];
    //get the database seed (for encrypting)
    const seed = ctx.config.path<string|undefined>('database.seed');
    const response = await get(model, engine, key, value, selectors, seed);

    if (response.code === 200 && !response.results) {
      response.code = 404;
      response.status = 'Not Found';
    }

    res.fromStatusResponse(response);
  };
};