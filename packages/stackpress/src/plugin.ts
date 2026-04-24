//stackpress
import type Server from '@stackpress/ingest/Server';
//module plugins
import schema from 'stackpress-schema/plugin';
import sql from 'stackpress-sql/plugin';
import view from 'stackpress-view/plugin';
import admin from 'stackpress-admin/plugin';
import language from 'stackpress-language/plugin';
import session from 'stackpress-session/plugin';
import api from 'stackpress-api/plugin';
import csrf from 'stackpress-csrf/plugin';

export default async function plugin(server: Server) {
  //load the plugins
  schema(server);
  sql(server);
  view(server);
  admin(server);
  language(server);
  session(server);
  api(server);
  csrf(server);
};