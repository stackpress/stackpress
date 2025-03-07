//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//schema
import type Model from '../../../schema/spec/Model';
//common
import type { AdminConfig } from '../types';

export default function AdminRestorePageFactory(model: Model) {
  return async function AdminRestorePage(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the server
    const server = req.context;
    //get the admin config
    const admin = server.config<AdminConfig['admin']>('admin') || {};
    const root = admin.root || '/admin';
    //get id from url params
    const ids = model.ids.map(column => req.data(column.name)).filter(Boolean);
    if (ids.length === model.ids.length) {
      //if confirmed
      if (req.data('confirmed')) {
        //emit restore event
        await server.call(`${model.dash}-restore`, req, res);
        //if they want json (success or fail)
        if (req.data.has('json')) return;
        //if successfully restored
        if (res.code === 200) {
          //redirect
          res.redirect(`${root}/${model.dash}/detail/${ids.join('/')}`);
        }
        return;
      }
      //not confirmed, fetch the data using the id
      await server.call(`${model.dash}-detail`, req, res);
    }
  };
};