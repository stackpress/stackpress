//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//local
import type { Languages } from './types';
import I18N from './I18N';

export type Config = { languages: Languages };

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, register the i18n plugin
  server.on('config', req => {
    const server = req.context;
    //get the project config
    const config = server.config.get<Config>();
    //make a new i18n
    const i18n = new I18N();
    //load the languages from the project config
    i18n.languages = config.languages || {};
    //add i18n as a project plugin
    server.register('i18n', i18n);
  });
};