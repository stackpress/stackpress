//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { AdminConfig } from '../../types';
//session
import { hash, encrypt } from '../../session/helpers';
//schema
import type Model from '../../schema/spec/Model';

export default function AdminCreatePageFactory(model: Model) {
  return async function AdminCreatePage(
    req: Request, 
    res: Response,
    ctx: Server
  ) {
    //get the admin config
    const admin = ctx.config<AdminConfig>('admin') || {};
    //set data for template layer
    res.data.set('admin', { 
      root: admin.root || '/admin',
      name: admin.name || 'Admin', 
      logo: admin.logo || '/images/logo-square.png',
      menu: admin.menu || []
    });
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //if form submitted
    if (req.method === 'POST') {
      //get the session seed (for encrypting)
      const seed = ctx.config.path('session.seed', 'abc123');
      //fix the data
      const data = req.data();
      //loop through the data
      for (const key in data) {
        //get the column meta
        const column = model.column(key);
        //if it's not a column, leave as is
        if (!column) continue;
        //determine if the field is encryptable
        const canEncrypt = typeof data[key] !== 'undefined' 
          && data[key] !== null;
        //if column is encryptable
        if (canEncrypt) {
          const string = String(data[key]);
          if (string.length > 0) {
            if (column.encrypted) {
              //encrypt the key
              data[key] = encrypt(string, seed);
            } else if (column.hash) {
              //hash the key
              data[key] = hash(string);
            }
          }
        }
      }
      //emit the create event
      const response = await ctx.resolve<UnknownNest>(
        `${model.dash}-create`, 
        req, 
        res
      );
      //if error
      if (res.code !== 200) {
        //pass straight to error
        await ctx.emit('error', req, res);
        return;
      }
      //redirect
      const root = admin.root || '/admin';
      res.redirect(
        `${root}/${model.dash}/detail/${response.results?.id}`
      );
    }
  };
};