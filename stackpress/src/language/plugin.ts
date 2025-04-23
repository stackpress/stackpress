//stackpress
import type Server from '@stackpress/ingest/Server';
//language
import type { LanguageMap, LanguagePlugin } from './types.js';
import Language from './Language.js';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  //if no language config exists, disable the plugin
  if (!ctx.config.get('language')) return;
  //on config, configure and register the language plugin
  ctx.on('config', async (_req, _res, ctx) => {
    //configure and register the language plugin
    ctx.register('language', Language.configure(
      ctx.config.path('language.key', 'locale'), 
      ctx.config.path<LanguageMap>('language.languages', {})
    ));
  });
  //on listen, look for locale flag
  ctx.on('listen', async (_req, _res, ctx) => {
    const language = ctx.plugin<LanguagePlugin>('language');
    ctx.on('request', async (req, res, ctx) => {
      const key = ctx.config.path('language.key', 'locale');
      const defaultLocale = ctx.config.path('language.locale', 'en_US');
      //get the locale from the request
      let locale = req.data(key);
      //if valid locale, set the language
      if (language.locales.includes(locale)) {
        language.load(req, defaultLocale).update(locale, res);
      }
      //make a path array
      const pathArray = req.url.pathname.split('/');
      //get the locale from the request url
      //ie. /en_US/page
      locale = pathArray[1];
      //if valid locale, set the language
      if (language.locales.includes(locale)) {
        //set the language
        language.load(req, defaultLocale).update(locale, res);
        //splice the locale from the pathArray
        pathArray.splice(1, 1);
        //make a new request
        const request = ctx.request({
          resource: req.resource,
          body: req.body || undefined,
          headers: Object.fromEntries(req.headers.entries()),
          mimetype: req.mimetype,
          data: req.data(),
          method: req.method,
          query: Object.fromEntries(req.query.entries()),
          post: Object.fromEntries(req.post.entries()),
          session: req.session.data as Record<string, string>,
          url: new URL(req.url.origin + pathArray.join('/'))
        });
        await ctx.resolve(req.method, pathArray.join('/'), request, res);
      }
    });
  });
};