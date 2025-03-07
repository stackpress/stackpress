//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//schema
import type Model from '@/schema/spec/Model';

export default function AdminSearchPageFactory(model: Model) {
  return async function AdminSearchPage(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the server
    const server = req.context;
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