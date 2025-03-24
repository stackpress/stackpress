//stackpress
import type Server from '@stackpress/ingest/Server';
//root
import type { LanguageMap, LanguagePlugin } from '../../types';
//i18n
import Language from '../../session/Language';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, configure and register the language plugin
  server.on('config', async (_req, _res, server) => {
    //configure and register the language plugin
    server.register('language', Language.configure(
      server.config.path('language.key', 'locale'), 
      server.config.path<LanguageMap>('language.languages', {})
    ));
  });
  //on listen, look for locale flag
  server.on('listen', async (_req, _res, server) => {
    const language = server.plugin<LanguagePlugin>('language');
    server.on('request', async (req, res, server) => {
      const key = server.config.path('language.key', 'locale');
      const defaultLocale = server.config.path('language.locale', 'en_US');
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
        const request = server.request({
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
        await server.resolve(req.method, pathArray.join('/'), request, res);
      }
    });
  });
};