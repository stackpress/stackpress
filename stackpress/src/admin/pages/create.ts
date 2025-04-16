//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model.js';
//language
import type { LanguageConfig } from '../../language/types.js';
//view
import type { ViewConfig, BrandConfig } from '../../view/types.js';
//admin
import type { AdminConfig } from '../types.js';

export default function AdminCreatePageFactory(model: Model) {
  return async function AdminCreatePage(
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
    //if form submitted
    if (req.method === 'POST') {
      //emit the create event
      const response = await ctx.resolve<UnknownNest>(
        `${model.dash}-create`, 
        req, 
        res
      );
      //if error
      if (res.code !== 200) {
        return;
      }
      //get id from url params
      const ids = model.ids.map(
        column => (response.results || {})[column.name]
      ).filter(Boolean);
      //redirect
      const base = admin.base || '/admin';
      res.redirect(
        `${base}/${model.dash}/detail/${ids.join('/')}`
      );
    }
  };
};