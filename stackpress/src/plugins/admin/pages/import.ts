//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../../schema/spec/Model';

export default function AdminImportPageFactory(model: Model) {
  return async function AdminImportPage(
    req: Request, 
    res: Response,
    ctx: Server
  ) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //if form submitted
    if (req.method === 'POST') {
      //emit the batch event
      const response = await ctx.resolve<UnknownNest[]>(
        `${model.dash}-batch`, 
        req
      );
      res.fromStatusResponse(response);
    }
  };
};