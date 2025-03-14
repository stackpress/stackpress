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
      menu: admin.menu || [],
    });
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //extract filters from url query
    let {
      q,
      filter,
      span,
      sort,
      skip,
      take,
      columns = ['*'],
    } = req.data<{
      q?: string;
      filter?: Record<string, string | number | boolean>;
      span?: Record<string, (string | number | null | undefined)[]>;
      sort?: Record<string, any>;
      skip?: number;
      take?: number;
      columns?: string[];
    }>();

    if (skip && !isNaN(Number(skip))) {
      skip = Number(skip);
    }

    if (take && !isNaN(Number(take))) {
      take = Number(take);
    }
    //search using the filters
    const response = await server.call(
      `${model.dash}-search`,
      { q, filter, span, sort, skip, take, columns },
      res
    );
    //if error
    if (res.code !== 200) {
      //pass straight to error
      await server.call('error', req, res);
      return;
    }
    //remember the total
    const total = response.total;
    //get the session seed (for decrypting)
    const seed = server.config.path('session.seed', 'abc123');
    const rows = (response.results as UnknownNest[]).map((row) => {
      //decrypt the data
      for (const key in row) {
        const column = model.column(key);

        if (column && column.encrypted) {
          const string = String(row[key]);
          if (string.length > 0) {
            try {
              row[key] = decrypt(String(row[key]), seed);
            } catch (e) {
              //this can fail if the data was not encrypted
              //using the same seed or not encrypted at all
            }
          }
        }
      }
      return row;
    });
    res.setRows(rows, total || rows.length);
  };
}
