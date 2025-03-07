//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//schema
import type Model from '../../../schema/spec/Model';
//common
import Exception from '../../../Exception';
//sql
import type { DatabasePlugin } from '../types';

/**
 * This is a factory function that creates an event 
 * handler for purging records in the database
 * 
 * Usage:
 * emitter.on('profile-purge', purgeEventFactory(profile));
 */
export default function purgeEventFactory(model: Model) {
  return async function purgeEventAction(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the database engine
    const engine = req.context.plugin<DatabasePlugin>('database');
    if (!engine) return;
    try {
      await engine.truncate(model.snake);
    } catch (e) {
      const exception = Exception.upgrade(e as Error);
      res.setError(exception.toJSON());
      return;
    }
    
    res.fromStatusResponse({
      code: 200,
      status: 'OK',
      results: model.snake
    });
  };
};