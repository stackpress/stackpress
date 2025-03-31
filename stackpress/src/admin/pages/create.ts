//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//session
import { hash, encrypt } from '../../session/helpers';
//schema
import type Model from '../../schema/spec/Model';
//language
import type { LanguageConfig } from '../../language/types';
//view
import type { ViewConfig, BrandConfig } from '../../view/types';
//admin
import type { AdminConfig } from '../types';

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
      //get the session seed (for encrypting)
      const seed = ctx.config.path('session.seed', 'abc123');
      //fix the data
      const data = req.data();
      //loop through the data
      for (const key in data) {
        //get the column meta
        const column = model.column(key);
        //if it's not a column, leave as is
        if (!column) continue;
        //determine if the field is encryptable
        const canEncrypt = typeof data[key] !== 'undefined' 
          && data[key] !== null;
        //if column is encryptable
        if (canEncrypt) {
          const string = String(data[key]);
          if (string.length > 0) {
            if (column.encrypted) {
              //encrypt the key
              data[key] = encrypt(string, seed);
            } else if (column.hash) {
              //hash the key
              data[key] = hash(string);
            }
          }
        }
      }
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
      //redirect
      const base = admin.base || '/admin';
      res.redirect(
        `${base}/${model.dash}/detail/${response.results?.id}`
      );
    }
  };
};