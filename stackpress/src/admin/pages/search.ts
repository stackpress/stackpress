//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//session
import { decrypt } from '../../session/helpers';
//schema
import type Model from '../../schema/spec/Model';
//language
import type { LanguageConfig } from '../../language/types';
//view
import type { ViewConfig, BrandConfig } from '../../view/types';
//admin
import type { AdminConfig } from '../types';

export default function AdminSearchPageFactory(model: Model) {
  return async function AdminSearchPage(
    req: Request, 
    res: Response,
    ctx: Server
  ) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the view, brandm lang and admin config
    const view = ctx.config.path<ViewConfig>('view', {});
    const brand = ctx.config.path<BrandConfig>('brand', {});
    const language = ctx.config.path<LanguageConfig>('language', {
      key: 'locale',
      locale: 'en_US',
      languages: {}
    });
    const admin = ctx.config.path<AdminConfig>('admin', {});
    //set data for template layer
    res.data.set('view', { 
      base: view.base || '/',
      props: view.props || {}
    });
    res.data.set('brand', { 
      name: brand.name || 'Stackpress',
      logo: brand.logo || '/logo.png',
      icon: brand.icon || '/icon.png',
      favicon: brand.favicon || '/favicon.ico'
    });
    res.data.set('language', { 
      key: language.key || 'locale',
      locale: language.locale || 'en_US',
      languages: language.languages || {}
    });
    res.data.set('admin', { 
      name: admin.name || 'Admin',
      base: admin.base || '/admin',
      menu: admin.menu || []
    });
    //extract filters from url query
    let {
      q,
      filter,
      span,
      sort,
      skip,
      take,
      columns = model.query?.length ? model.query : [ '*' ],
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
