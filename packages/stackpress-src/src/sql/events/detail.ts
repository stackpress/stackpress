//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { DatabasePlugin } from '../../types';
//schema
import type Model from '../../schema/spec/Model';
//local
import detail from '../actions/detail';

/**
 * This is a factory function that creates an event 
 * handler for retrieving a record from the database
 * 
 * Usage:
 * emitter.on('profile-detail', detailEventFactory(profile));
 */
export default function detailEventFactory(model: Model) {
  return async function DetailEventAction(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the database engine
    const engine = req.context.plugin<DatabasePlugin>('database');
    if (!engine) return;

    const ids = Object.fromEntries(model.ids
      .map(column => [ column.name, req.data(column.name) ])
      .filter(entry => Boolean(entry[1]))
    ) as Record<string, string | number>;
    const columns = req.data<string[]>('columns');
    const selectors = Array.isArray(columns) && columns.every(
      column => typeof column === 'string'
    ) ? columns : [ '*' ];
    const response = await detail(model, engine, ids, selectors);

    if (response.code === 200 && !response.results) {
      response.code = 404;
      response.status = 'Not Found';
    }
    res.fromStatusResponse(response);
  };
};