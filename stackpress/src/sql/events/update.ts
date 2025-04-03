//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model';
//sql
import type { DatabasePlugin } from '../types';
//session
import { hash, encrypt } from '../../session/helpers';
//actions
import update from '../actions/update';

/**
 * This is a factory function that creates an event 
 * handler for removing a record from the database
 * 
 * Usage:
 * emitter.on('profile-update', updateEventFactory(profile));
 */
export default function updateEventFactory(model: Model) {
  return async function UpdateEventAction(
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
    //remove values that are not columns
    const input = model.input(req.data(), false);
    //get the session seed (for encrypting)
    const seed = ctx.config.path('session.seed', 'abc123');
    //loop through the input and encrypt or hash the values
    for (const key in input) {
      //get the column meta
      const column = model.column(key);
      //if it's not a column, leave as is
      if (!column) continue;
      //determine if the field is encryptable
      const canEncrypt = typeof input[key] !== 'undefined' && input[key] !== null;
      //if column is encryptable
      if (canEncrypt) {
        const string = String(input[key]);
        if (string.length > 0) {
          if (column.encrypted) {
            //encrypt the key
            input[key] = encrypt(string, seed);
          } else if (column.hash) {
            //hash the key
            input[key] = hash(string);
          }
        }
      }
    }
    const ids = Object.fromEntries(model.ids
      .map(column => [ column.name, req.data(column.name) ])
      .filter(entry => Boolean(entry[1]))
    ) as Record<string, string | number>;
    const response = await update(model, engine, ids, input);
    res.fromStatusResponse(response);
  };
};