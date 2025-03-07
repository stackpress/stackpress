//stackpress
import type { UnknownNest } from '@stackpress/lib/dist/types';
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//schema
import type Model from '../../../schema/spec/Model';

export default function AdminImportPageFactory(model: Model) {
  return async function AdminImportPage(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the server
    const server = req.context;
    //if form submitted
    if (req.method === 'POST') {
      //emit the batch event
      const response = await server.call<UnknownNest[]>(`${model.dash}-batch`, req);
      res.fromStatusResponse(response);
    }
  };
};