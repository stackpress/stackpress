//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { DatabasePlugin } from '../../types';
//schema
import type Model from '../../schema/spec/Model';
//local
import search from '../actions/search';

/**
 * This is a factory function that creates an event 
 * handler for searching records in the database
 * 
 * Usage:
 * emitter.on('profile-search', searchEventFactory(profile));
 */
export default function searchEventFactory(model: Model) {
  return async function SearchEventAction(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the database engine
    const engine = req.context.plugin<DatabasePlugin>('database');
    if (!engine) return;
    const response = await search(model, engine, req.data());
    res.fromStatusResponse(response);
  };
};