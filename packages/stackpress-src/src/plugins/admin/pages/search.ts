//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { AdminConfig } from '../../../types';
//schema
import type Model from '../../../schema/spec/Model';

export default function AdminSearchPageFactory(model: Model) {
  return async function AdminSearchPage(req: ServerRequest, res: Response) {
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
    //extract filters from url query
    let { q, filter, span, sort, skip, take } = req.data<{
      q?: string,
      filter?: Record<string, string|number|boolean>,
      span?: Record<string, (string|number|null|undefined)[]>,
      sort?: Record<string, any>,
      skip?: number,
      take?: number
    }>();

    if (skip && !isNaN(Number(skip))) {
      skip = Number(skip);
    }

    if (take && !isNaN(Number(take))) {
      take = Number(take);
    }
    //search using the filters
    await server.call(
      `${model.dash}-search`,
      { q, filter, span, sort, skip, take },
      res
    );
  };
};