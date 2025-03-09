//stackpress
import type { UnknownNest } from '@stackpress/lib/dist/types';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { AdminConfig } from '../../../types';
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
      await server.call<UnknownNest>(`${model.dash}-detail`, req, res);
      if (!res.body) {
        await server.call('error', req, res);
      }
    }
  };
};