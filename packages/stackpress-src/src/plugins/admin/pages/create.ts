//stackpress
import type { UnknownNest } from '@stackpress/lib/dist/types';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { AdminConfig } from '../../../types';
//session
import { encrypt } from '../../../session/helpers';
//schema
import type Model from '../../../schema/spec/Model';

export default function AdminCreatePageFactory(model: Model) {
  return async function AdminCreatePage(req: ServerRequest, res: Response) {
    //extract project and model from client
    const server = req.context;
    //get the admin config
    const admin = server.config<AdminConfig>('admin') || {};
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
      const seed = server.config.path('session.seed', 'abc123');
      //fix the data
      const data = req.data();
      //loop through the data
      for (const key in data) {
        //get the column meta
        const column = model.column(key);
        //if it's not a column, leave as is
        if (!column) continue;
        //determine if the field is encryptable
        const canEncrypt = typeof data[key] !== 'undefined' && data[key] !== null;
        //if the field needs to be encrypted and is actually empty
        if (column.encrypted && canEncrypt) {
          const string = String(data[key]);
          if (string.length > 0) {
            //encrypt the key
            data[key] = encrypt(String(data[key]), seed);
          }
        }
      }
      //emit the create event
      const response = await server.call<UnknownNest>(`${model.dash}-create`, req, res);
      //if error
      if (res.code !== 200) {
        //pass straight to error
        await server.call('error', req, res);
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