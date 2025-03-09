//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//root
import type { LanguageConfig } from '../../types';
//i18n
import I18N from '../../i18n/I18N';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, register the i18n plugin
  server.on('config', req => {
    const server = req.context;
    //make a new i18n
    const i18n = new I18N();
    //load the languages from the project config
    i18n.languages = server.config.path<LanguageConfig>('language', {});
    //add i18n as a project plugin
    server.register('i18n', i18n);
  });
};