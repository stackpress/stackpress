//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { AdminConfig } from '../../../types';
//schema
import type Model from '../../../schema/spec/Model';

export default function AdminRestorePageFactory(model: Model) {
  return async function AdminRestorePage(req: ServerRequest, res: Response) {
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
      //if confirmed
      if (req.data('confirmed')) {
        //emit restore event
        await server.call(`${model.dash}-restore`, req, res);
        //if they want json (success or fail)
        if (req.data.has('json')) return;
        //if successfully restored
        if (res.code === 200) {
          //redirect
          const root = admin.root || '/admin';
          res.redirect(`${root}/${model.dash}/detail/${ids.join('/')}`);
        }
        return;
      }
      //not confirmed, fetch the data using the id
      await server.call(`${model.dash}-detail`, req, res);
    }
  };
};