//stackpress
import type { UnknownNest } from '@stackpress/lib/dist/types';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { AdminConfig } from '../../../types';
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
      //emit the create event
      const response = await server.call<UnknownNest>(`${model.dash}-create`, req, res);
      //if they want json (success or fail)
      if (req.data.has('json')) return;
      //if successfully created
      if (res.code === 200) {
        //redirect
        const root = admin.root || '/admin';
        res.redirect(
          `${root}/${model.dash}/detail/${response.results?.id}`
        );
      }
    }
  };
};