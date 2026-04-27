//stackpress
import type Server from '@stackpress/ingest/Server';
//module plugins
import schema from 'stackpress-schema/plugin';
import sql from 'stackpress-sql/plugin';
import view from 'stackpress-view/plugin';
import admin from 'stackpress-admin/plugin';
import language from 'stackpress-language/plugin';
import server from 'stackpress-server/plugin';
import session from 'stackpress-session/plugin';
import api from 'stackpress-api/plugin';
import csrf from 'stackpress-csrf/plugin';

export default async function plugin(ctx: Server) {
  //load the plugins
  server(ctx);
  schema(ctx);
  language(ctx);
  csrf(ctx);
  sql(ctx);
  view(ctx);
  session(ctx);
  api(ctx);
  admin(ctx);
};