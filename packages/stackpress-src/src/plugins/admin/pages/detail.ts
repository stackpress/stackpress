//stackpress
import type { UnknownNest } from '@stackpress/lib/dist/types';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { AdminConfig } from '../../../types';
//session
import { decrypt } from '../../../session/helpers';
//schema
import type Model from '../../../schema/spec/Model';

export default function AdminDetailPageFactory(model: Model) {
  return async function AdminDetailPage(req: ServerRequest, res: Response) {
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
    //get id from url params
    const ids = model.ids.map(column => req.data(column.name)).filter(Boolean);
    if (ids.length === model.ids.length) {
      //emit detail event
      const response = await server.call<UnknownNest>(`${model.dash}-detail`, req, res);
      if (!res.body) {
        //pass straight to error
        await server.call('error', req, res);
        return;
      }
      //get the session seed (for decrypting)
      const seed = server.config.path('session.seed', 'abc123');
      const results = response.results as UnknownNest;
      //decrypt the data
      for (const key in results) {
        const column = model.column(key);
        if (column && column.encrypted) {
          const string = String(results[key]);
          if (string.length > 0) {
            try {
              results[key] = decrypt(String(results[key]), seed);
            } catch(e) {
              //this can fail if the data was not encrypted 
              //using the same seed or not encrypted at all 
            }
            
          }
        }
      }
      res.setResults(results);
    }
  };
};