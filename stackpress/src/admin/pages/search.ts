//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { AdminConfig } from '../../types';
//session
import { decrypt } from '../../session/helpers';
//schema
import type Model from '../../schema/spec/Model';

export default function AdminSearchPageFactory(model: Model) {
  return async function AdminSearchPage(
    req: Request, 
    res: Response,
    ctx: Server
  ) {
    //get the admin config
    const admin = ctx.config<AdminConfig>('admin') || {};
    //set data for template layer
    res.data.set('admin', {
      root: admin.root || '/admin',
      name: admin.name || 'Admin',
      logo: admin.logo || '/images/logo-square.png',
      menu: admin.menu || [],
    });
    req.data.set('columns', model.query);
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
      columns = [ '*' ],
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
    const response = await ctx.resolve(
      `${model.dash}-search`,
      { q, filter, span, sort, skip, take, columns },
      res
    );
    //if error
    if (res.code !== 200) {
      //pass straight to error
      await ctx.emit('error', req, res);
      return;
    }
    //remember the total
    const total = response.total;
    //get the session seed (for decrypting)
    const seed = ctx.config.path('session.seed', 'abc123');
    const rows = (response.results as UnknownNest[]).map(row => {
      //decrypt the data
      for (const key in row) {
        const column = model.column(key);

        if (column && column.encrypted) {
          const string = String(row[key]);
          if (string.length > 0) {
            try {
              row[key] = decrypt(String(row[key]), seed);
            } catch(e) {
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
