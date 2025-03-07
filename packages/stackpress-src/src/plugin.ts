//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//module plugins
import incept from './plugins/schema/plugin';
import types from './plugins/types/plugin';
import sql from './plugins/sql/plugin';
import ink from './plugins/press/plugin';
import admin from './plugins/admin/plugin';
import i18n from './plugins/i18n/plugin';
import user from './plugins/user/plugin';
import api from './plugins/api/plugin';

export default async function plugin(server: Server) {
  //load the plugins
  incept(server);
  types(server);
  sql(server);
  ink(server);
  admin(server);
  i18n(server);
  user(server);
  api(server);
};