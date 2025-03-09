//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//module plugins
import schema from './plugins/schema/plugin';
import types from './plugins/types/plugin';
import sql from './plugins/sql/plugin';
import template from './plugins/template/plugin';
import admin from './plugins/admin/plugin';
import language from './plugins/language/plugin';
import user from './plugins/user/plugin';
import api from './plugins/api/plugin';

export default async function plugin(server: Server) {
  //load the plugins
  schema(server);
  types(server);
  sql(server);
  template(server);
  admin(server);
  language(server);
  user(server);
  api(server);
};