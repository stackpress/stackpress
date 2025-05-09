//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model.js';
//sql
import type { DatabasePlugin } from '../types.js';
//actions
import search from '../actions/search.js';

/**
 * This is a factory function that creates an event 
 * handler for searching records in the database
 * 
 * Usage:
 * emitter.on('profile-search', searchEventFactory(profile));
 */
export default function searchEventFactory(model: Model) {
  return async function SearchEventAction(
    req: Request, 
    res: Response,
    ctx: Server
  ) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //if there are no columns from the request
    if (!req.data.has('columns')
      //if there is @query([ "*" ])
      && Array.isArray(model.query) 
      && model.query.length
      && model.query.every(column => typeof column === 'string')
    ) {
      req.data.set('columns', model.query)
    }
    //get the database engine
    const engine = ctx.plugin<DatabasePlugin>('database');
    if (!engine) return;
    //get the database seed (for encrypting)
    const seed = ctx.config.path<string|undefined>('database.seed');
    const response = await search(model, engine, req.data(), seed);
    res.fromStatusResponse(response);
  };
};