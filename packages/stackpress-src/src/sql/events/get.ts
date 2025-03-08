//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { DatabasePlugin } from '@/types';
//schema
import type Model from '@/schema/spec/Model';
//local
import get from '../actions/get';

/**
 * This is a factory function that creates an event 
 * handler for retrieving a record from the database
 * 
 * Usage:
 * emitter.on('profile-get', getEventFactory(profile));
 */
export default function getEventFactory(model: Model) {
  return async function GetEventAction(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the database engine
    const engine = req.context.plugin<DatabasePlugin>('database');
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
    const response = await get(model, engine, key, value, selectors);

    if (response.code === 200 && !response.results) {
      response.code = 404;
      response.status = 'Not Found';
    }

    res.fromStatusResponse(response);
  };
};